"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  User,
  Clock,
  CheckCheck,
  AlertCircle,
  Search,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface SessionMessagingProps {
  onNavigate: (page: string, data?: any) => void;
  booking?: any;
}

export function SessionMessaging({ onNavigate, booking }: SessionMessagingProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>(() => {
    if (!booking) return [];
    const saved = localStorage.getItem(`messages_${booking.id}`);
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        senderId: booking.psychologistId,
        senderName: booking.psychologistName,
        text: `Hi! I'm looking forward to our session on ${new Date(booking.date).toLocaleDateString()}. Feel free to message me if you have any questions beforehand.`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
      }
    ];
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (booking) {
      localStorage.setItem(`messages_${booking.id}`, JSON.stringify(messages));
    }
  }, [messages, booking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user?.id,
      senderName: user?.name || 'You',
      text: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    toast.success('Message sent');

    // Simulate response from therapist
    setTimeout(() => {
      const response = {
        id: `msg_${Date.now() + 1}`,
        senderId: booking?.psychologistId,
        senderName: booking?.psychologistName,
        text: 'Thank you for your message. I\'ll review this before our session.',
        timestamp: new Date().toISOString(),
        read: false
      };
      setMessages(prev => [...prev, response]);
    }, 3000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!booking) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No booking selected</p>
            <Button onClick={() => onNavigate('therapy-dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onNavigate('therapy-dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">{booking.psychologistName}</h2>
                  <p className="text-xs text-muted-foreground">
                    Session: {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-6 py-3">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Note:</strong> This is for non-urgent communication only. In case of emergency, call 911 or text 988.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => {
              const isOwn = msg.senderId === user?.id;
              const showDate = index === 0 || 
                new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <Badge variant="secondary" className="text-xs">
                        {new Date(msg.timestamp).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Badge>
                    </div>
                  )}

                  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      {!isOwn && (
                        <p className="text-xs text-muted-foreground mb-1 px-4">
                          {msg.senderName}
                        </p>
                      )}
                      <div className={`rounded-2xl px-4 py-3 ${
                        isOwn 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-muted rounded-bl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-4 ${
                        isOwn ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(msg.timestamp)}
                        </span>
                        {isOwn && (
                          <CheckCheck className={`h-3 w-3 ${
                            msg.read ? 'text-blue-500' : 'text-muted-foreground'
                          }`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <Button variant="ghost" size="sm" className="mb-1">
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <div className="flex-1">
                <Textarea
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  className="resize-none min-h-[44px] max-h-[120px]"
                />
              </div>

              <Button variant="ghost" size="sm" className="mb-1">
                <Smile className="h-5 w-5" />
              </Button>

              <Button 
                onClick={sendMessage}
                disabled={!message.trim()}
                className="mb-1"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              Messages are secure and HIPAA-compliant. Response time: Within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
