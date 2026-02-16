import React, { useEffect, useState } from 'react';
import api from '../../utils/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import {
  Settings,
  DollarSign,
  CreditCard,
  Globe,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { PlatformSettings } from '../../types/database';

export function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getSettings();
      setSettings(response.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load platform settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await api.admin.updateSettings(settings);
      toast.success('Platform settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save platform settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    if (!settings) return;

    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Failed to load settings</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Platform Settings</h1>
          <p className="text-muted-foreground">
            Configure platform-wide settings and preferences
          </p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="features">
            <Globe className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>
                Basic information about your learning platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  defaultValue="CerebroLearn"
                  placeholder="Enter platform name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Description</Label>
                <Input
                  id="platform-description"
                  defaultValue="Interactive Learning Platform"
                  placeholder="Enter platform description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="support@cerebrolearn.com"
                  placeholder="support@example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  placeholder="USD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <Input
                  id="timezone"
                  defaultValue="America/New_York"
                  placeholder="UTC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Input id="language" defaultValue="English" placeholder="English" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Commission</CardTitle>
              <CardDescription>
                Configure how revenue is split between platform and creators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commission-rate">Platform Commission Rate</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="commission-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.commission_rate * 100}
                    onChange={(e) =>
                      updateSetting('commission_rate', parseFloat(e.target.value) / 100)
                    }
                    className="w-32"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Creators receive {((1 - settings.commission_rate) * 100).toFixed(0)}% of
                  course revenue
                </p>
              </div>
              <Separator />
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="font-medium">Revenue Split Example:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Price:</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Platform Commission ({(settings.commission_rate * 100).toFixed(0)}%):
                    </span>
                    <span>${(100 * settings.commission_rate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Creator Earnings:</span>
                    <span className="text-green-500">
                      ${(100 * (1 - settings.commission_rate)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Providers</CardTitle>
              <CardDescription>
                Configure payment gateway integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stripe</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept credit card payments globally
                  </p>
                </div>
                <Switch
                  checked={settings.payment_providers.stripe_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting('payment_providers.stripe_enabled', checked)
                  }
                />
              </div>
              {settings.payment_providers.stripe_enabled && (
                <div className="space-y-4 pl-4 border-l-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
                    <Input
                      id="stripe-key"
                      type="password"
                      placeholder="pk_live_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                    <Input
                      id="stripe-secret"
                      type="password"
                      placeholder="sk_live_..."
                    />
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Flutterwave</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept payments in Africa
                  </p>
                </div>
                <Switch
                  checked={settings.payment_providers.flutterwave_enabled}
                  onCheckedChange={(checked) =>
                    updateSetting('payment_providers.flutterwave_enabled', checked)
                  }
                />
              </div>
              {settings.payment_providers.flutterwave_enabled && (
                <div className="space-y-4 pl-4 border-l-2">
                  <div className="space-y-2">
                    <Label htmlFor="flutterwave-key">Flutterwave Public Key</Label>
                    <Input
                      id="flutterwave-key"
                      type="password"
                      placeholder="FLWPUBK-..."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Settings */}
        <TabsContent value="features" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Features</CardTitle>
              <CardDescription>
                Enable or disable platform-wide features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Social Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to sign in with Google, GitHub, etc.
                  </p>
                </div>
                <Switch
                  checked={settings.features.social_login}
                  onCheckedChange={(checked) =>
                    updateSetting('features.social_login', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Organizations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable multi-tenant organization support
                  </p>
                </div>
                <Switch
                  checked={settings.features.organizations}
                  onCheckedChange={(checked) =>
                    updateSetting('features.organizations', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Discussions</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow comments and discussions on lessons
                  </p>
                </div>
                <Switch
                  checked={settings.features.discussions}
                  onCheckedChange={(checked) =>
                    updateSetting('features.discussions', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Gamification</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable XP, badges, and leaderboards
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Course Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow students to rate and review courses
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Certificates</Label>
                  <p className="text-sm text-muted-foreground">
                    Issue certificates upon course completion
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Authentication</CardTitle>
              <CardDescription>
                Configure security settings and authentication rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue="24"
                  className="w-32"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="password-min">Minimum Password Length</Label>
                <Input
                  id="password-min"
                  type="number"
                  defaultValue="8"
                  min="6"
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Configure data retention and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>GDPR Compliance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enhanced privacy controls for EU users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Collect anonymous usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure automated email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Welcome Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email to new users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Course Enrollment</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify creators of new enrollments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    Send payment receipts to users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Send weekly progress reports to learners
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Configure in-app and push notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify users of new comments on their content
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Achievement Unlocked</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify users when they earn badges
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg" disabled={saving}>
          {saving ? (
            <>Saving Changes...</>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
