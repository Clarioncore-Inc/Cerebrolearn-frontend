import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentsApi } from '../../utils/api-client';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Search,
  Copy,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Trophy,
  Star,
  BookOpen,
  Target,
  CheckCircle2,
} from 'lucide-react';

// Import Figma course images
import imgImage from 'figma:asset/2c71d31963450c58fe599c40a68f1bf74c09b3de.png';
import imgImage1 from 'figma:asset/908f6e6dadefff9c6fad99774e0aa7808b2270ab.png';
import imgImage2 from 'figma:asset/aa0e63b4b72dafa20ebf705cb3408f9d3a4343ef.png';

interface ModernLearnerDashboardProps {
  onNavigate?: (page: string, data?: any) => void;
}

interface CourseCardProps {
  image: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  instructor: string;
  rating?: number;
  onContinue?: () => void;
}

interface CompletedCourse {
  id: number;
  title: string;
  thumbnail: string;
  instructor: string;
  completedDate: string;
  rating: number;
  certificate: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  image,
  title,
  description,
  progress,
  duration,
  instructor,
  rating = 4.5,
  onContinue,
}) => {
  return (
    <Card className='overflow-hidden hover:shadow-md transition-shadow duration-200'>
      <div className='relative'>
        <img
          src={image}
          alt={title}
          className='w-full h-[180px] object-cover'
        />
        <div className='absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1'>
          <Clock className='h-3 w-3 text-white' />
          <span className='text-xs text-white'>{duration}</span>
        </div>
      </div>
      <CardContent className='p-4 space-y-3'>
        <div className='flex items-center justify-between'>
          <Badge variant='secondary' className='text-xs'>
            In Progress
          </Badge>
          <div className='flex items-center gap-1'>
            <button className='p-1 hover:bg-accent rounded'>
              <Copy className='h-4 w-4' />
            </button>
            <button className='p-1 hover:bg-accent rounded'>
              <ExternalLink className='h-4 w-4' />
            </button>
            <button className='p-1 hover:bg-accent rounded'>
              <MoreVertical className='h-4 w-4' />
            </button>
          </div>
        </div>

        <div>
          <h3 className='font-semibold text-foreground mb-1'>{title}</h3>
          <p className='text-sm text-muted-foreground'>by {instructor}</p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>Progress</span>
            <span className='font-medium text-primary'>{progress}%</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        <div className='flex items-center justify-between pt-2'>
          <div className='flex items-center gap-1'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm font-medium'>{rating}</span>
          </div>
          <Button size='sm' onClick={onContinue} className='gap-2'>
            <Play className='h-4 w-4' />
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function ModernLearnerDashboard({
  onNavigate,
}: ModernLearnerDashboardProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const enrollmentsData = await enrollmentsApi.getMy();
      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Use mock data
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  // Sample course data - would be replaced with actual enrolled courses
  const inProgressCourses = [
    {
      image: imgImage,
      title: 'Introduction to Machine Learning',
      description: 'Learn the fundamentals of ML and AI',
      progress: 65,
      duration: '12 hours',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.8,
    },
    {
      image: imgImage1,
      title: 'Advanced React Patterns',
      description: 'Master modern React development',
      progress: 42,
      duration: '8 hours',
      instructor: 'John Smith',
      rating: 4.9,
    },
    {
      image: imgImage2,
      title: 'Data Science Fundamentals',
      description: 'Introduction to data analysis and visualization',
      progress: 78,
      duration: '15 hours',
      instructor: 'Prof. Emily Chen',
      rating: 4.7,
    },
    {
      image: imgImage,
      title: 'UX Design Principles',
      description: 'Create user-centered designs',
      progress: 23,
      duration: '10 hours',
      instructor: 'Michael Brown',
      rating: 4.6,
    },
    {
      image: imgImage1,
      title: 'Python for Beginners',
      description: 'Start your programming journey',
      progress: 89,
      duration: '6 hours',
      instructor: 'Lisa Anderson',
      rating: 4.9,
    },
    {
      image: imgImage2,
      title: 'Digital Marketing Strategy',
      description: 'Master online marketing',
      progress: 34,
      duration: '9 hours',
      instructor: 'David Wilson',
      rating: 4.5,
    },
  ];

  // Sample completed courses
  const completedCourses: CompletedCourse[] = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      thumbnail: imgImage,
      instructor: 'John Doe',
      completedDate: '24-Oct, 2024',
      rating: 5,
      certificate: true,
    },
    {
      id: 2,
      title: 'CSS Grid & Flexbox',
      thumbnail: imgImage1,
      instructor: 'Jane Smith',
      completedDate: '22-Oct, 2024',
      rating: 4,
      certificate: true,
    },
    {
      id: 3,
      title: 'Web Accessibility',
      thumbnail: imgImage2,
      instructor: 'Mike Johnson',
      completedDate: '20-Oct, 2024',
      rating: 5,
      certificate: true,
    },
    {
      id: 4,
      title: 'Git & GitHub Basics',
      thumbnail: imgImage,
      instructor: 'Sarah Williams',
      completedDate: '18-Oct, 2024',
      rating: 4,
      certificate: true,
    },
    {
      id: 5,
      title: 'TypeScript Essentials',
      thumbnail: imgImage1,
      instructor: 'Tom Brown',
      completedDate: '15-Oct, 2024',
      rating: 5,
      certificate: true,
    },
  ];

  // Learning stats
  const stats = [
    {
      label: 'Courses Enrolled',
      value: '12',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Courses Completed',
      value: '5',
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Learning Hours',
      value: '148',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Certificates Earned',
      value: '5',
      icon: Trophy,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Welcome back, {profile?.full_name || 'Learner'}! 👋
          </h1>
          <p className='text-muted-foreground mt-1'>
            Continue your learning journey
          </p>
        </div>
        <div className='w-[320px]'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search courses...'
              className='pl-10 bg-white border-gray-300'
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div
                  className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>{stat.label}</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='bg-transparent border-b border-gray-200 rounded-none h-auto p-0 w-full justify-start'>
          <TabsTrigger
            value='overview'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3'
          >
            In Progress
            <Badge variant='secondary' className='ml-2'>
              {inProgressCourses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value='completed'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3'
          >
            Completed
            <Badge variant='secondary' className='ml-2'>
              {completedCourses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value='saved'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3'
          >
            Saved
            <Badge variant='secondary' className='ml-2'>
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value='achievements'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3'
          >
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* In Progress Tab */}
        <TabsContent value='overview' className='mt-6 space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Continue Learning
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Pick up where you left off
                </p>
              </div>
              <Button
                variant='outline'
                onClick={() => onNavigate?.('catalog')}
                className='gap-2'
              >
                <BookOpen className='h-4 w-4' />
                Browse Courses
              </Button>
            </div>

            {/* Course Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {inProgressCourses.map((course, index) => (
                <CourseCard
                  key={index}
                  {...course}
                  onContinue={() => onNavigate?.('course', { id: index })}
                />
              ))}
            </div>

            {/* Show More Button */}
            <div className='flex justify-center pt-4'>
              <Button variant='outline' className='gap-2'>
                Show More
                <ChevronDown className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Completed Courses Tab */}
        <TabsContent value='completed' className='mt-6 space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Completed Courses
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Your learning achievements
                </p>
              </div>
            </div>

            {/* Table */}
            <div className='border border-gray-200 rounded-lg overflow-hidden bg-white'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Course Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Instructor
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Completed Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Rating
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      Certificate
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {completedCourses.map((course) => (
                    <tr key={course.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-3'>
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className='w-10 h-10 rounded object-cover'
                          />
                          <span className='font-medium text-gray-900'>
                            {course.title}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {course.instructor}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                        {course.completedDate}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < course.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {course.certificate && (
                          <Badge
                            variant='default'
                            className='bg-green-100 text-green-700 hover:bg-green-100'
                          >
                            Available
                          </Badge>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <div className='flex items-center gap-2'>
                          <Button size='sm' variant='outline'>
                            View Certificate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className='flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white'>
                <Button variant='outline' size='sm' className='gap-2'>
                  <ChevronLeft className='h-4 w-4' />
                  Previous
                </Button>

                <div className='flex items-center gap-2'>
                  {[1, 2, 3].map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      className='w-9 h-9 p-0'
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button variant='outline' size='sm' className='gap-2'>
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Saved Courses Tab */}
        <TabsContent value='saved' className='mt-6'>
          <div className='text-center py-6 text-muted-foreground'>
            Saved courses will be displayed here
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value='achievements' className='mt-6'>
          <div className='text-center py-6 text-muted-foreground'>
            Your achievements and badges will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
