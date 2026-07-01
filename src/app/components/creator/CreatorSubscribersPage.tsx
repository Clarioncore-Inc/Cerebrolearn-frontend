import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Search, 
  Filter,
  Download,
  Mail,
  MapPin,
  Calendar,
  Activity,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

interface CreatorSubscribersPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CreatorSubscribersPage({ onNavigate }: CreatorSubscribersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const subscribers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      country: 'United States',
      subscribedDate: '2024-01-15',
      lastActivity: '2 hours ago',
      progress: 78,
      coursesEnrolled: 3,
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      country: 'United Kingdom',
      subscribedDate: '2024-02-20',
      lastActivity: '1 day ago',
      progress: 45,
      coursesEnrolled: 2,
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      country: 'Canada',
      subscribedDate: '2024-03-10',
      lastActivity: '3 days ago',
      progress: 92,
      coursesEnrolled: 4,
      avatar: 'MJ'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      country: 'Australia',
      subscribedDate: '2024-01-25',
      lastActivity: '5 hours ago',
      progress: 34,
      coursesEnrolled: 1,
      avatar: 'SW'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.b@example.com',
      country: 'Germany',
      subscribedDate: '2024-02-05',
      lastActivity: '1 week ago',
      progress: 67,
      coursesEnrolled: 2,
      avatar: 'DB'
    }
  ];

  const stats = [
    { label: 'Total Subscribers', value: '3,847', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Active This Week', value: '1,245', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Avg. Progress', value: '63%', icon: TrendingUp, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Completions', value: '892', icon: Award, color: 'text-amber-500', bgColor: 'bg-amber-500/10' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold gradient-text">Course Subscribers</h1>
            <p className="text-base text-muted-foreground">
              Manage and track learners enrolled in your courses
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="border-2">
              <Mail className="mr-2 h-4 w-4" />
              Email Subscribers
            </Button>
            <Button variant="outline" size="lg" className="border-2">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border hover:border-primary/50 transition-all duration-300 shadow-none hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscribers List */}
      <Card className="border-2 shadow-none hover:shadow-md transition-all">
        <CardHeader className="border-b bg-accent/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">All Subscribers</CardTitle>
              <CardDescription>View and manage your course subscribers</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full lg:w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {subscribers.map((subscriber) => (
              <div key={subscriber.id} className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 hover:bg-accent/50 transition-colors group">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                    {subscriber.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{subscriber.name}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{subscriber.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{subscriber.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Active {subscriber.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-2">
                      <div>
                        <div className="text-xl font-bold text-primary">{subscriber.progress}%</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-secondary/10 mb-2">
                      <div className="text-xl font-bold text-secondary">{subscriber.coursesEnrolled}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 lg:flex-initial">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t bg-accent/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1-5</span> of <span className="font-medium">3,847</span> subscribers
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}