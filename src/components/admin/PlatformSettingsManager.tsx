"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Settings,
  Bell,
  Shield,
  DollarSign,
  Clock,
  Mail,
  Globe,
  Save,
  ArrowLeft,
  CheckCircle2,
  Info
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PlatformSettingsManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

export function PlatformSettingsManager({ onNavigate }: PlatformSettingsManagerProps) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('platform_settings');
    return saved ? JSON.parse(saved) : {
      // General Settings
      platformName: 'CerebroLearn',
      platformTagline: 'Empowering minds through integrated learning and mental wellness',
      supportEmail: 'support@cerebrolearn.com',
      timezone: 'America/Los_Angeles',
      
      // Booking Settings
      sessionDuration: 50,
      bufferTime: 10,
      maxAdvanceBooking: 60,
      minAdvanceBooking: 24,
      cancellationWindow: 24,
      enableWaitlist: true,
      autoConfirmBookings: false,
      
      // Payment Settings
      sessionPrice: 150,
      platformFee: 20,
      currency: 'USD',
      enableRefunds: true,
      refundWindow: 48,
      acceptedPaymentMethods: ['credit_card', 'debit_card'],
      
      // Notification Settings
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingConfirmation: true,
      reminderNotifications: true,
      reminderTiming: 24,
      feedbackRequests: true,
      
      // Quality Settings
      minRatingThreshold: 3.5,
      requireSessionNotes: true,
      notesDeadlineHours: 48,
      enableAutoReviews: true,
      
      // Security Settings
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      hipaaMode: true,
      dataRetention: 365,
      
      // Feature Flags
      enableIQTesting: true,
      enableVideoSessions: true,
      enableMessaging: true,
      enableGroupSessions: false,
      enableCoursePlatform: true
    };
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('platform_settings', JSON.stringify(settings));
    setHasChanges(false);
    toast.success('Platform settings saved successfully!');
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      localStorage.removeItem('platform_settings');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate('admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Portal
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Platform Settings</h1>
              <p className="text-muted-foreground">
                Configure system-wide settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge variant="default">
                  <Info className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button variant="outline" onClick={resetSettings}>
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="booking">
              <Clock className="h-4 w-4 mr-2" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="payment">
              <DollarSign className="h-4 w-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="features">
              <Globe className="h-4 w-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>Basic platform details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => updateSetting('platformName', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="platformTagline">Tagline</Label>
                  <Textarea
                    id="platformTagline"
                    value={settings.platformTagline}
                    onChange={(e) => updateSetting('platformTagline', e.target.value)}
                    className="mt-2"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSetting('supportEmail', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <select
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-md"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Settings */}
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Configuration</CardTitle>
                <CardDescription>Default session and booking parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    value={settings.sessionDuration}
                    onChange={(e) => updateSetting('sessionDuration', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Standard therapy session length</p>
                </div>

                <div>
                  <Label htmlFor="bufferTime">Buffer Time Between Sessions (minutes)</Label>
                  <Input
                    id="bufferTime"
                    type="number"
                    value={settings.bufferTime}
                    onChange={(e) => updateSetting('bufferTime', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Time gap between appointments</p>
                </div>

                <div>
                  <Label htmlFor="maxAdvanceBooking">Max Advance Booking (days)</Label>
                  <Input
                    id="maxAdvanceBooking"
                    type="number"
                    value={settings.maxAdvanceBooking}
                    onChange={(e) => updateSetting('maxAdvanceBooking', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">How far in advance students can book</p>
                </div>

                <div>
                  <Label htmlFor="minAdvanceBooking">Min Advance Booking (hours)</Label>
                  <Input
                    id="minAdvanceBooking"
                    type="number"
                    value={settings.minAdvanceBooking}
                    onChange={(e) => updateSetting('minAdvanceBooking', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimum notice required for booking</p>
                </div>

                <div>
                  <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                  <Input
                    id="cancellationWindow"
                    type="number"
                    value={settings.cancellationWindow}
                    onChange={(e) => updateSetting('cancellationWindow', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Time before session when cancellation is allowed</p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableWaitlist">Enable Waitlist</Label>
                    <p className="text-sm text-muted-foreground">Allow students to join waitlist for full slots</p>
                  </div>
                  <Switch
                    id="enableWaitlist"
                    checked={settings.enableWaitlist}
                    onCheckedChange={(checked) => updateSetting('enableWaitlist', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="autoConfirmBookings">Auto-Confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
                  </div>
                  <Switch
                    id="autoConfirmBookings"
                    checked={settings.autoConfirmBookings}
                    onCheckedChange={(checked) => updateSetting('autoConfirmBookings', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Configuration</CardTitle>
                <CardDescription>Pricing and payment processing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionPrice">Session Price ({settings.currency})</Label>
                  <Input
                    id="sessionPrice"
                    type="number"
                    value={settings.sessionPrice}
                    onChange={(e) => updateSetting('sessionPrice', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Default price per therapy session</p>
                </div>

                <div>
                  <Label htmlFor="platformFee">Platform Fee (%)</Label>
                  <Input
                    id="platformFee"
                    type="number"
                    value={settings.platformFee}
                    onChange={(e) => updateSetting('platformFee', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Platform commission (${settings.sessionPrice * (settings.platformFee / 100)} per session)
                  </p>
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => updateSetting('currency', e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-md"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableRefunds">Enable Refunds</Label>
                    <p className="text-sm text-muted-foreground">Allow refunds for cancelled sessions</p>
                  </div>
                  <Switch
                    id="enableRefunds"
                    checked={settings.enableRefunds}
                    onCheckedChange={(checked) => updateSetting('enableRefunds', checked)}
                  />
                </div>

                {settings.enableRefunds && (
                  <div>
                    <Label htmlFor="refundWindow">Refund Window (hours)</Label>
                    <Input
                      id="refundWindow"
                      type="number"
                      value={settings.refundWindow}
                      onChange={(e) => updateSetting('refundWindow', parseInt(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Time before session to receive full refund</p>
                  </div>
                )}

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-semibold mb-2">Revenue Split:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Session Price:</span>
                      <span className="font-semibold">${settings.sessionPrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fee ({settings.platformFee}%):</span>
                      <span>-${(settings.sessionPrice * (settings.platformFee / 100)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span>Psychologist Earnings:</span>
                      <span className="font-bold">${(settings.sessionPrice * (1 - settings.platformFee / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure automated notifications and reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS (requires integration)</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="bookingConfirmation">Booking Confirmations</Label>
                    <p className="text-sm text-muted-foreground">Send confirmation when booking is made</p>
                  </div>
                  <Switch
                    id="bookingConfirmation"
                    checked={settings.bookingConfirmation}
                    onCheckedChange={(checked) => updateSetting('bookingConfirmation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="reminderNotifications">Session Reminders</Label>
                    <p className="text-sm text-muted-foreground">Automatically send session reminders</p>
                  </div>
                  <Switch
                    id="reminderNotifications"
                    checked={settings.reminderNotifications}
                    onCheckedChange={(checked) => updateSetting('reminderNotifications', checked)}
                  />
                </div>

                {settings.reminderNotifications && (
                  <div>
                    <Label htmlFor="reminderTiming">Reminder Timing (hours before session)</Label>
                    <Input
                      id="reminderTiming"
                      type="number"
                      value={settings.reminderTiming}
                      onChange={(e) => updateSetting('reminderTiming', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="feedbackRequests">Feedback Requests</Label>
                    <p className="text-sm text-muted-foreground">Request feedback after completed sessions</p>
                  </div>
                  <Switch
                    id="feedbackRequests"
                    checked={settings.feedbackRequests}
                    onCheckedChange={(checked) => updateSetting('feedbackRequests', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>Platform security and data protection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="hipaaMode">HIPAA Compliance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable HIPAA-compliant data handling</p>
                  </div>
                  <Switch
                    id="hipaaMode"
                    checked={settings.hipaaMode}
                    onCheckedChange={(checked) => updateSetting('hipaaMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all accounts</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Automatic logout after inactivity</p>
                </div>

                <div>
                  <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => updateSetting('dataRetention', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">How long to retain user data after account closure</p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="requireSessionNotes">Require Session Notes</Label>
                    <p className="text-sm text-muted-foreground">Mandate SOAP notes for all sessions</p>
                  </div>
                  <Switch
                    id="requireSessionNotes"
                    checked={settings.requireSessionNotes}
                    onCheckedChange={(checked) => updateSetting('requireSessionNotes', checked)}
                  />
                </div>

                {settings.requireSessionNotes && (
                  <div>
                    <Label htmlFor="notesDeadlineHours">Notes Deadline (hours after session)</Label>
                    <Input
                      id="notesDeadlineHours"
                      type="number"
                      value={settings.notesDeadlineHours}
                      onChange={(e) => updateSetting('notesDeadlineHours', parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Settings */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Features</CardTitle>
                <CardDescription>Enable or disable platform capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableIQTesting">IQ Testing Module</Label>
                    <p className="text-sm text-muted-foreground">Enable comprehensive IQ assessment</p>
                  </div>
                  <Switch
                    id="enableIQTesting"
                    checked={settings.enableIQTesting}
                    onCheckedChange={(checked) => updateSetting('enableIQTesting', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableVideoSessions">Video Sessions</Label>
                    <p className="text-sm text-muted-foreground">Enable online video therapy sessions</p>
                  </div>
                  <Switch
                    id="enableVideoSessions"
                    checked={settings.enableVideoSessions}
                    onCheckedChange={(checked) => updateSetting('enableVideoSessions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableMessaging">Secure Messaging</Label>
                    <p className="text-sm text-muted-foreground">Student-psychologist messaging system</p>
                  </div>
                  <Switch
                    id="enableMessaging"
                    checked={settings.enableMessaging}
                    onCheckedChange={(checked) => updateSetting('enableMessaging', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableGroupSessions">Group Sessions</Label>
                    <p className="text-sm text-muted-foreground">Allow group therapy sessions</p>
                  </div>
                  <Switch
                    id="enableGroupSessions"
                    checked={settings.enableGroupSessions}
                    onCheckedChange={(checked) => updateSetting('enableGroupSessions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableCoursePlatform">Course Platform</Label>
                    <p className="text-sm text-muted-foreground">Enable LMS and course features</p>
                  </div>
                  <Switch
                    id="enableCoursePlatform"
                    checked={settings.enableCoursePlatform}
                    onCheckedChange={(checked) => updateSetting('enableCoursePlatform', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Features Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {settings.enableIQTesting && <Badge>IQ Testing</Badge>}
                  {settings.enableVideoSessions && <Badge>Video Sessions</Badge>}
                  {settings.enableMessaging && <Badge>Messaging</Badge>}
                  {settings.enableGroupSessions && <Badge>Group Sessions</Badge>}
                  {settings.enableCoursePlatform && <Badge>Course Platform</Badge>}
                  {settings.hipaaMode && <Badge variant="secondary">HIPAA Compliant</Badge>}
                  {settings.twoFactorAuth && <Badge variant="secondary">2FA Required</Badge>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button (Sticky Footer) */}
        {hasChanges && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Card className="shadow-lg border-2 border-primary">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="font-semibold">You have unsaved changes</p>
                  <Button onClick={saveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
