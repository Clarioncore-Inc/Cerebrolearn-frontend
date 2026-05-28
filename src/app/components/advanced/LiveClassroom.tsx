import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, Monitor, MessageSquare, Users, Settings, PhoneOff, MoreVertical, Hand, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LiveClassroomProps {
  classId: string;
  className: string;
  instructor: string;
}

export function LiveClassroom({ classId, className, instructor }: LiveClassroomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  const participants = [
    { id: '1', name: 'Sarah Johnson (Instructor)', role: 'instructor', video: true, audio: true },
    { id: '2', name: 'You', role: 'student', video: !isVideoOff, audio: !isMuted },
    { id: '3', name: 'Alex Kumar', role: 'student', video: true, audio: false },
    { id: '4', name: 'Maria Garcia', role: 'student', video: true, audio: true }
  ];

  const chatMessages = [
    { id: '1', sender: 'Sarah Johnson', message: 'Welcome everyone! Let\'s begin.', time: '10:00 AM' },
    { id: '2', sender: 'Alex Kumar', message: 'Thanks! Excited to learn.', time: '10:01 AM' },
    { id: '3', sender: 'You', message: 'Ready to start!', time: '10:01 AM' }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      toast.success('Message sent');
      setChatMessage('');
    }
  };

  const handleLeaveClass = () => {
    toast.success('Left the class');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">{className}</h2>
          <p className="text-sm text-gray-400">with {instructor}</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5" />
          <span>{participants.length} participants</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Main Speaker */}
          <div className="flex-1 bg-black relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold">SJ</span>
                </div>
                <p className="text-xl font-semibold">{instructor}</p>
                <p className="text-gray-400">Instructor</p>
              </div>
            </div>

            {/* Screen Share Indicator */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-sm rounded flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>

            {/* Presentation Mode */}
            <button className="absolute top-4 right-4 px-4 py-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              View Slides
            </button>
          </div>

          {/* Participant Thumbnails */}
          <div className="bg-gray-800 p-4">
            <div className="grid grid-cols-4 gap-4">
              {participants.slice(0, 4).map((participant) => (
                <div key={participant.id} className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="font-bold text-white">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                      {participant.name.split(' ')[0]}
                    </span>
                    <div className="flex gap-1">
                      {!participant.audio && (
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                          <MicOff className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                toast.success(isMuted ? 'Microphone on' : 'Microphone off');
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={() => {
                setIsVideoOff(!isVideoOff);
                toast.success(isVideoOff ? 'Camera on' : 'Camera off');
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={() => {
                setIsHandRaised(!isHandRaised);
                toast.success(isHandRaised ? 'Hand lowered' : 'Hand raised');
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isHandRaised ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Hand className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </button>

            <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
              <Settings className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleLeaveClass}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors ml-4"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold text-white">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{msg.sender}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white border-gray-600 focus-visible:border-primary placeholder:text-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}