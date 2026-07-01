"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  X,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface VirtualWaitingRoomProps {
  onNavigate: (page: string, data?: any) => void;
  appointment: any;
}

export function VirtualWaitingRoom({ onNavigate, appointment }: VirtualWaitingRoomProps) {
  const { user } = useAuth();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [deviceChecks, setDeviceChecks] = useState({
    camera: 'checking',
    microphone: 'checking',
    speakers: 'checking',
    connection: 'checking'
  });
  const [sessionStatus, setSessionStatus] = useState<'waiting' | 'ready' | 'joining'>('waiting');
  const [timeUntilSession, setTimeUntilSession] = useState<string>('');
  const [waitTime, setWaitTime] = useState(0);

  // Simulate device checks
  useEffect(() => {
    const checkDevices = async () => {
      // Simulate checking devices
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDeviceChecks({
        camera: videoEnabled ? 'success' : 'warning',
        microphone: audioEnabled ? 'success' : 'warning',
        speakers: speakerEnabled ? 'success' : 'warning',
        connection: 'success'
      });
    };
    checkDevices();
  }, [videoEnabled, audioEnabled, speakerEnabled]);

  // Calculate time until session
  useEffect(() => {
    const updateTime = () => {
      const sessionDate = new Date(`${appointment.date}T${appointment.time}`);
      const now = new Date();
      const diff = sessionDate.getTime() - now.getTime();

      if (diff < 0) {
        setTimeUntilSession('Session time has started');
        setSessionStatus('ready');
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeUntilSession(`${minutes}m ${seconds}s`);
        
        // Allow joining 5 minutes early
        if (minutes < 5) {
          setSessionStatus('ready');
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [appointment]);

  // Track wait time
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const testCamera = () => {
    toast.success('Camera test successful!');
    setVideoEnabled(true);
  };

  const testMicrophone = () => {
    toast.success('Microphone test successful!');
    setAudioEnabled(true);
  };

  const testSpeakers = () => {
    toast.success('Playing test sound... (Mock)');
    setSpeakerEnabled(true);
  };

  const joinSession = () => {
    if (sessionStatus !== 'ready') {
      toast.error('Session is not ready yet. Please wait.');
      return;
    }

    setSessionStatus('joining');
    toast.success('Joining session...');
    
    setTimeout(() => {
      onNavigate('video-call', { appointment, role: 'student' });
    }, 1500);
  };

  const leaveWaitingRoom = () => {
    if (confirm('Leave the waiting room? You can return anytime before your session.')) {
      onNavigate('therapy-dashboard');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
    }
  };

  const allChecksPass = Object.values(deviceChecks).every(check => 
    check === 'success' || check === 'warning'
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Virtual Waiting Room</h1>
            <p className="text-muted-foreground">
              Prepare for your session with {appointment.psychologistName}
            </p>
          </div>
          <Button variant="outline" onClick={leaveWaitingRoom}>
            <X className="h-4 w-4 mr-2" />
            Leave Waiting Room
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Video Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {videoEnabled ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Mock video preview */}
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-purple-900">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Camera Preview</p>
                            <p className="text-sm opacity-75 mt-1">You look great!</p>
                          </div>
                        </div>
                        {/* Overlay info */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-600">
                            <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
                            Live Preview
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="secondary">{user?.name}</Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center text-white">
                        <VideoOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Camera Off</p>
                        <p className="text-sm opacity-75 mt-1">Enable your camera to see yourself</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="p-4 bg-muted border-t">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      variant={videoEnabled ? "default" : "destructive"}
                      onClick={() => setVideoEnabled(!videoEnabled)}
                      className="rounded-full h-14 w-14"
                    >
                      {videoEnabled ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant={audioEnabled ? "default" : "destructive"}
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className="rounded-full h-14 w-14"
                    >
                      {audioEnabled ? (
                        <Mic className="h-5 w-5" />
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant={speakerEnabled ? "default" : "destructive"}
                      onClick={() => setSpeakerEnabled(!speakerEnabled)}
                      className="rounded-full h-14 w-14"
                    >
                      {speakerEnabled ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full h-14 w-14"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                    <span>Camera: {videoEnabled ? 'On' : 'Off'}</span>
                    <span>•</span>
                    <span>Microphone: {audioEnabled ? 'On' : 'Off'}</span>
                    <span>•</span>
                    <span>Speaker: {speakerEnabled ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Check Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Device Check
                </CardTitle>
                <CardDescription>
                  Make sure everything is working properly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deviceChecks.camera)}
                    <div>
                      <p className="font-semibold">Camera</p>
                      <p className="text-sm text-muted-foreground">
                        {deviceChecks.camera === 'success' ? 'Working properly' : 
                         deviceChecks.camera === 'warning' ? 'Camera disabled' : 'Checking...'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={testCamera}>
                    Test
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deviceChecks.microphone)}
                    <div>
                      <p className="font-semibold">Microphone</p>
                      <p className="text-sm text-muted-foreground">
                        {deviceChecks.microphone === 'success' ? 'Working properly' : 
                         deviceChecks.microphone === 'warning' ? 'Microphone muted' : 'Checking...'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={testMicrophone}>
                    Test
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deviceChecks.speakers)}
                    <div>
                      <p className="font-semibold">Speakers</p>
                      <p className="text-sm text-muted-foreground">
                        {deviceChecks.speakers === 'success' ? 'Working properly' : 
                         deviceChecks.speakers === 'warning' ? 'Speakers off' : 'Checking...'}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={testSpeakers}>
                    Test
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deviceChecks.connection)}
                    <div>
                      <p className="font-semibold">Internet Connection</p>
                      <p className="text-sm text-muted-foreground">
                        {deviceChecks.connection === 'success' ? 'Strong connection' : 'Checking...'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Good</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Session Info */}
          <div className="space-y-6">
            {/* Session Status */}
            <Card className={`border-2 ${
              sessionStatus === 'ready' ? 'border-green-500' : 
              sessionStatus === 'joining' ? 'border-blue-500' : 'border-yellow-500'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessionStatus === 'waiting' && (
                  <div className="text-center py-4">
                    <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="font-semibold text-lg mb-2">Waiting to Join</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Session starts in: {timeUntilSession}
                    </p>
                    <Badge variant="secondary">You're early! Great preparation</Badge>
                  </div>
                )}

                {sessionStatus === 'ready' && (
                  <div className="text-center py-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="font-semibold text-lg mb-2">Ready to Join</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your therapist is waiting
                    </p>
                    <Button onClick={joinSession} className="w-full" size="lg">
                      <Video className="h-4 w-4 mr-2" />
                      Join Session Now
                    </Button>
                  </div>
                )}

                {sessionStatus === 'joining' && (
                  <div className="text-center py-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                    <p className="font-semibold text-lg mb-2">Joining Session...</p>
                    <p className="text-sm text-muted-foreground">
                      Please wait
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Therapist</p>
                    <p className="font-semibold">{appointment.psychologistName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Video className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Session Type</p>
                    <p className="font-semibold">{appointment.sessionType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Scheduled Time</p>
                    <p className="font-semibold">
                      {new Date(`${appointment.date}T${appointment.time}`).toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Monitor className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-muted-foreground">Format</p>
                    <p className="font-semibold">Online Video Session</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wait Time */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Time in waiting room</p>
                  <p className="text-3xl font-bold">
                    {Math.floor(waitTime / 60)}:{(waitTime % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pre-Session Reminder */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-1">Before joining:</p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>✓ Find a quiet, private space</li>
                  <li>✓ Close other applications</li>
                  <li>✓ Have water nearby</li>
                  <li>✓ Review your preparation notes</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Need Help */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p className="text-muted-foreground">
                  Having technical issues?
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
