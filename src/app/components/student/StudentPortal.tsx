import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { EnhancedStudentDashboard } from './EnhancedStudentDashboard';
import { BadgeSystem } from './BadgeSystem';
import { CertificateList } from './CertificateGenerator';
import { StreakTracker } from './StreakTracker';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  LayoutDashboard,
  Award,
  Flame,
  GraduationCap,
  BookOpen,
  Settings,
  User,
} from 'lucide-react';

interface StudentPortalProps {
  onNavigate: (page: string, data?: any) => void;
}

export function StudentPortal({ onNavigate }: StudentPortalProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data - would come from API in production
  const mockCertificates = [
    {
      id: '1',
      courseName: 'Introduction to Python',
      completionDate: '2024-01-15',
      courseCreator: 'Dr. Sarah Johnson',
      certificateId: 'CERT-2024-001',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span className="hidden sm:inline">Streak</span>
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Certificates</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="dashboard">
            <EnhancedStudentDashboard onNavigate={onNavigate} />
          </TabsContent>

          <TabsContent value="badges">
            <BadgeSystem userBadges={profile?.badges || []} />
          </TabsContent>

          <TabsContent value="streak">
            <StreakTracker
              currentStreak={profile?.streak || 0}
              longestStreak={profile?.streak || 0}
              totalDaysActive={Math.floor((profile?.streak || 0) * 1.2)}
            />
          </TabsContent>

          <TabsContent value="certificates">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">My Certificates</h2>
                <p className="text-muted-foreground">
                  View and download your earned certificates
                </p>
              </div>
              <CertificateList certificates={mockCertificates} />
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account and preferences
                </p>
              </div>
              <Button onClick={() => onNavigate('profile')}>
                Go to Full Profile Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
