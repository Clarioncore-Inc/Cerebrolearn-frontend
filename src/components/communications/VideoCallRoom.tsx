"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from '../ui/textarea';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Settings,
  PhoneOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Users,
  Clock,
  Signal,
  AlertCircle,
  Send,
  X,
  Circle,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface VideoCallRoomProps {
  onNavigate: (page: string, data?: any) => void;
  appointment: any;
  role: 'student' | 'psychologist';
}

export function VideoCallRoom({ onNavigate, appointment, role }: VideoCallRoomProps) {
  const { user } = useAuth();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEndDialog, setShowEndDialog] = useState(false);

  const participantName = role === 'student' 
    ? appointment.psychologistName 
    : appointment.studentName || 'Student';

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate connection quality changes
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities: ('excellent' | 'good' | 'poor')[] = ['excellent', 'excellent', 'good', 'excellent'];
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setConnectionQuality(randomQuality);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast.success(videoEnabled ? 'Camera turned off' : 'Camera turned on');
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast.success(audioEnabled ? 'Microphone muted' : 'Microphone unmuted');
  };

  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
    toast.success(speakerEnabled ? 'Speaker muted' : 'Speaker unmuted');
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    toast.success(screenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: `msg_${Date.now()}`,
      sender: user?.name || 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isSelf: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate response (in real app, this comes from other participant)
    setTimeout(() => {
      const response = {
        id: `msg_${Date.now() + 1}`,
        sender: participantName,
        text: 'Message received',
        timestamp: new Date().toISOString(),
        isSelf: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const endSession = () => {
    setShowEndDialog(true);
  };

  const confirmEndSession = () => {
    toast.success('Session ended');
    // Save session data
    const sessionData = {
      id: appointment.id,
      duration: sessionDuration,
      endedAt: new Date().toISOString()
    };
    localStorage.setItem(`session_${appointment.id}`, JSON.stringify(sessionData));
    
    // Navigate to feedback
    onNavigate('session-feedback', { 
      appointment, 
      duration: sessionDuration 
    });
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <Signal className="h-4 w-4 text-green-600" />;
      case 'good':
        return <Signal className="h-4 w-4 text-yellow-600" />;
      case 'poor':
        return <Signal className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-900 flex flex-col`}>
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-sm font-semibold">Live Session</span>
            </div>
            <div className="flex items-center gap-2 text-white text-sm">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(sessionDuration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getConnectionIcon()}
              <span className="text-white text-sm capitalize">{connectionQuality}</span>
            </div>
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              2 participants
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {/* Main Video (Participant) */}
          <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
            {screenSharing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <div className="text-center text-white">
                  <Monitor className="h-20 w-20 mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Screen Sharing Active</p>
                  <p className="text-sm opacity-75 mt-2">
                    {participantName} is sharing their screen
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    {videoEnabled ? (
                      <>
                        <div className="h-32 w-32 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                          <User className="h-16 w-16 opacity-50" />
                        </div>
                        <p className="text-2xl font-semibold">{participantName}</p>
                        <p className="text-sm opacity-75 mt-2">Video enabled</p>
                      </>
                    ) : (
                      <>
                        <VideoOff className="h-20 w-20 mx-auto mb-4 opacity-50" />
                        <p className="text-xl">{participantName}</p>
                        <p className="text-sm opacity-75 mt-2">Camera is off</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Participant Audio Indicator */}
                {audioEnabled && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Self Video (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-64 aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-xl">
              {videoEnabled ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">You</p>
                    </div>
                  </div>
                  {audioEnabled && (
                    <div className="absolute top-2 left-2">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs">{user?.name}</Badge>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Camera Off</p>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Warning */}
            {connectionQuality === 'poor' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <Alert variant="destructive" className="w-auto">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Poor connection quality. Check your internet.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="absolute top-0 right-0 w-80 h-full bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <button onClick={() => setShowChat(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.isSelf ? 'bg-primary text-white' : 'bg-gray-700 text-white'
                    }`}>
                      <p className="text-xs opacity-75 mb-1">{msg.sender}</p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={2}
                  className="resize-none"
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant={videoEnabled ? "secondary" : "destructive"}
              onClick={toggleVideo}
              className="rounded-full h-12 w-12"
            >
              {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant={audioEnabled ? "secondary" : "destructive"}
              onClick={toggleAudio}
              className="rounded-full h-12 w-12"
            >
              {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant={speakerEnabled ? "secondary" : "destructive"}
              onClick={toggleSpeaker}
              className="rounded-full h-12 w-12"
            >
              {speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant={screenSharing ? "default" : "secondary"}
              onClick={toggleScreenShare}
              className="rounded-full"
            >
              {screenSharing ? (
                <>
                  <MonitorOff className="h-5 w-5 mr-2" />
                  Stop Sharing
                </>
              ) : (
                <>
                  <Monitor className="h-5 w-5 mr-2" />
                  Share Screen
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => setShowChat(!showChat)}
              className="rounded-full relative"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat
              {messages.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
                  {messages.length}
                </Badge>
              )}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={toggleFullscreen}
              className="rounded-full h-12 w-12"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="rounded-full h-12 w-12"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Controls */}
          <div>
            <Button
              size="lg"
              variant="destructive"
              onClick={endSession}
              className="rounded-full"
            >
              <PhoneOff className="h-5 w-5 mr-2" />
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* End Session Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <PhoneOff className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">End Session?</h3>
                <p className="text-muted-foreground">
                  Are you sure you want to end this therapy session?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Session duration: {formatDuration(sessionDuration)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEndDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={confirmEndSession}
                >
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
