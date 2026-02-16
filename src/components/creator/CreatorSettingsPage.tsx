import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  User, 
  Mail,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Palette,
  Save,
  Upload,
  Camera
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreatorSettingsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CreatorSettingsPage({ onNavigate }: CreatorSettingsPageProps) {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Passionate educator with 10+ years of experience in software development and teaching.',
    website: 'https://johndoe.com',
    twitter: '@johndoe',
    linkedin: 'linkedin.com/in/johndoe'
  });

  const [notifications, setNotifications] = useState({
    emailNewSubscriber: true,
    emailCourseCompletion: true,
    emailReview: true,
    emailQuestion: false,
    pushNewSubscriber: true,
    pushRevenue: true
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Settings</h1>
        <p className="text-base text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto bg-accent p-1">
          <TabsTrigger value="profile" className="py-2.5">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="py-2.5">Notifications</TabsTrigger>
          <TabsTrigger value="payment" className="py-2.5">Payment</TabsTrigger>
          <TabsTrigger value="security" className="py-2.5">Security</TabsTrigger>
          <TabsTrigger value="preferences" className="py-2.5">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30 pt-[24px] pr-[24px] pb-[24px] pl-[32px] px-[32px] py-[24px]">
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>Update your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-[0px] pr-[24px] pb-[32px] pl-[24px]">
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                    JD
                  </div>
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Button variant="outline" size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell learners about yourself..."
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. Max 250 characters.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://your-website.com"
                    className="h-11"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                    <Input
                      id="twitter"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                      placeholder="@username"
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 p-[0px]">
                <Button onClick={handleSaveProfile} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" size="lg">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30">
              <CardTitle className="text-xl">Email Notifications</CardTitle>
              <CardDescription>Choose what emails you receive</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-1">
                  <Label htmlFor="email-subscriber" className="text-sm font-medium cursor-pointer">New Subscriber</Label>
                  <p className="text-sm text-muted-foreground">When someone enrolls in your course</p>
                </div>
                <Switch
                  id="email-subscriber"
                  checked={notifications.emailNewSubscriber}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNewSubscriber: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-1">
                  <Label htmlFor="email-completion" className="text-sm font-medium cursor-pointer">Course Completion</Label>
                  <p className="text-sm text-muted-foreground">When a learner completes your course</p>
                </div>
                <Switch
                  id="email-completion"
                  checked={notifications.emailCourseCompletion}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailCourseCompletion: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-1">
                  <Label htmlFor="email-review" className="text-sm font-medium cursor-pointer">New Review</Label>
                  <p className="text-sm text-muted-foreground">When someone reviews your course</p>
                </div>
                <Switch
                  id="email-review"
                  checked={notifications.emailReview}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailReview: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <Label htmlFor="email-question" className="text-sm font-medium cursor-pointer">Questions</Label>
                  <p className="text-sm text-muted-foreground">When learners ask questions</p>
                </div>
                <Switch
                  id="email-question"
                  checked={notifications.emailQuestion}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailQuestion: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="border-b bg-accent/30">
              <CardTitle className="text-xl">Push Notifications</CardTitle>
              <CardDescription>Manage your push notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="space-y-1">
                  <Label htmlFor="push-subscriber" className="text-sm font-medium cursor-pointer">New Subscribers</Label>
                  <p className="text-sm text-muted-foreground">Real-time notifications for enrollments</p>
                </div>
                <Switch
                  id="push-subscriber"
                  checked={notifications.pushNewSubscriber}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNewSubscriber: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="space-y-1">
                  <Label htmlFor="push-revenue" className="text-sm font-medium cursor-pointer">Revenue Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications about earnings and payouts</p>
                </div>
                <Switch
                  id="push-revenue"
                  checked={notifications.pushRevenue}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushRevenue: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSaveNotifications} size="lg">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
            <Button variant="outline" size="lg">Reset to Default</Button>
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage how you receive payouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Bank Transfer</p>
                      <p className="text-sm text-muted-foreground">Ending in ****4567</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
              <CardDescription>Configure automatic payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Payouts</Label>
                  <p className="text-sm text-muted-foreground">Receive payouts automatically each month</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="grid gap-2">
                <Label>Minimum Payout Amount</Label>
                <Input type="number" placeholder="$100" defaultValue="100" />
                <p className="text-sm text-muted-foreground">
                  Payouts will only be processed when balance exceeds this amount
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium mb-1">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with two-factor authentication
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader className="pt-[24px] pr-[32px] pb-[0px] pl-[32px]">
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Set your language and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" defaultValue="English" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD ($)" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-none hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact View</Label>
                  <p className="text-sm text-muted-foreground">Show more content in less space</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}