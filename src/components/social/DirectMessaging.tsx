import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
  Star,
  Archive,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface DirectMessagingProps {
  userId: string;
}

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    sentByMe: boolean;
  };
  unreadCount: number;
  isPinned: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sentByMe: boolean;
  isRead: boolean;
}

export function DirectMessaging({ userId }: DirectMessagingProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        isOnline: true,
      },
      lastMessage: {
        text: 'Thanks for the help with that JavaScript question!',
        timestamp: '2024-01-15T14:30:00',
        isRead: true,
        sentByMe: false,
      },
      unreadCount: 0,
      isPinned: true,
    },
    {
      id: '2',
      user: {
        name: 'Dr. Michael Chen',
        avatar: 'MC',
        isOnline: true,
      },
      lastMessage: {
        text: 'I\'ve reviewed your project submission. Great work!',
        timestamp: '2024-01-15T12:15:00',
        isRead: false,
        sentByMe: false,
      },
      unreadCount: 2,
      isPinned: true,
    },
    {
      id: '3',
      user: {
        name: 'Emily Rodriguez',
        avatar: 'ER',
        isOnline: false,
        lastSeen: '2024-01-15T10:00:00',
      },
      lastMessage: {
        text: 'Let me know when you want to start the study group',
        timestamp: '2024-01-14T18:45:00',
        isRead: true,
        sentByMe: true,
      },
      unreadCount: 0,
      isPinned: false,
    },
    {
      id: '4',
      user: {
        name: 'David Kim',
        avatar: 'DK',
        isOnline: false,
        lastSeen: '2024-01-14T16:30:00',
      },
      lastMessage: {
        text: 'Did you understand the async/await concept?',
        timestamp: '2024-01-13T20:20:00',
        isRead: true,
        sentByMe: false,
      },
      unreadCount: 0,
      isPinned: false,
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hey! I saw your question in the forum about recursion',
      timestamp: '2024-01-15T13:00:00',
      sentByMe: true,
      isRead: true,
    },
    {
      id: '2',
      text: 'Oh hi! Yes, I\'m still trying to wrap my head around it',
      timestamp: '2024-01-15T13:02:00',
      sentByMe: false,
      isRead: true,
    },
    {
      id: '3',
      text: 'Let me share a simple example that helped me understand it better',
      timestamp: '2024-01-15T13:03:00',
      sentByMe: true,
      isRead: true,
    },
    {
      id: '4',
      text: 'Think of recursion like a Russian nesting doll - each function call opens up to reveal another function call until you reach the base case',
      timestamp: '2024-01-15T13:04:00',
      sentByMe: true,
      isRead: true,
    },
    {
      id: '5',
      text: 'That\'s a great analogy! That actually makes a lot of sense',
      timestamp: '2024-01-15T13:06:00',
      sentByMe: false,
      isRead: true,
    },
    {
      id: '6',
      text: 'The key is to always have a base case that stops the recursion, otherwise you\'ll get infinite calls',
      timestamp: '2024-01-15T13:08:00',
      sentByMe: true,
      isRead: true,
    },
    {
      id: '7',
      text: 'Thanks for the help with that JavaScript question!',
      timestamp: '2024-01-15T14:30:00',
      sentByMe: false,
      isRead: true,
    },
  ];

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }

    toast.success('Message sent!');
    setMessageInput('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-0">
          {sortedConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b ${
                selectedConversation === conversation.id ? 'bg-muted' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{conversation.user.avatar}</AvatarFallback>
                </Avatar>
                {conversation.user.isOnline && (
                  <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-background rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">
                      {conversation.user.name}
                    </span>
                    {conversation.isPinned && (
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTime(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'font-semibold' : 'text-muted-foreground'
                  }`}>
                    {conversation.lastMessage.sentByMe && (
                      <span className="mr-1">
                        {conversation.lastMessage.isRead ? (
                          <CheckCheck className="h-3 w-3 inline text-blue-500" />
                        ) : (
                          <Check className="h-3 w-3 inline" />
                        )}
                      </span>
                    )}
                    {conversation.lastMessage.text}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Chat Window */}
      {selectedConv ? (
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedConv.user.avatar}</AvatarFallback>
                  </Avatar>
                  {selectedConv.user.isOnline && (
                    <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConv.user.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedConv.user.isOnline ? (
                      'Online'
                    ) : selectedConv.user.lastSeen ? (
                      `Last seen ${formatTime(selectedConv.user.lastSeen)}`
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sentByMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sentByMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sentByMe
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                    message.sentByMe ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.sentByMe && (
                      message.isRead ? (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={handleSendMessage} className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <CardContent className="text-center">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
            <p className="text-muted-foreground">
              Choose a conversation from the list to start messaging
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
