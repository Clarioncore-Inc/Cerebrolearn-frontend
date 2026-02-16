import React, { useState } from 'react';
import { BookOpen, Search, Filter, Users, CheckCircle, Clock, Star, Plus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface OrganizationCoursesProps {
  organizationId: string;
}

export function OrganizationCourses({ organizationId }: OrganizationCoursesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Mock data - replace with API calls
  const courses = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      category: 'Technology',
      level: 'Advanced',
      duration: '8 hours',
      rating: 4.8,
      enrolledTeams: 3,
      totalEnrolled: 145,
      completed: 112,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      required: true
    },
    {
      id: '2',
      title: 'Leadership Essentials',
      category: 'Leadership',
      level: 'Intermediate',
      duration: '6 hours',
      rating: 4.6,
      enrolledTeams: 5,
      totalEnrolled: 187,
      completed: 142,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      required: true
    },
    {
      id: '3',
      title: 'Data Analytics Fundamentals',
      category: 'Technology',
      level: 'Beginner',
      duration: '10 hours',
      rating: 4.9,
      enrolledTeams: 2,
      totalEnrolled: 98,
      completed: 76,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      required: false
    },
    {
      id: '4',
      title: 'Product Management 101',
      category: 'Business',
      level: 'Beginner',
      duration: '7 hours',
      rating: 4.5,
      enrolledTeams: 2,
      totalEnrolled: 76,
      completed: 54,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      required: false
    },
    {
      id: '5',
      title: 'UI/UX Design Fundamentals',
      category: 'Design',
      level: 'Intermediate',
      duration: '12 hours',
      rating: 4.7,
      enrolledTeams: 1,
      totalEnrolled: 52,
      completed: 48,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      required: false
    },
    {
      id: '6',
      title: 'Sales Training Bootcamp',
      category: 'Sales',
      level: 'Beginner',
      duration: '5 hours',
      rating: 4.4,
      enrolledTeams: 1,
      totalEnrolled: 64,
      completed: 51,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
      required: true
    }
  ];

  const teams = [
    { id: '1', name: 'Engineering', members: 45 },
    { id: '2', name: 'Marketing', members: 28 },
    { id: '3', name: 'Sales', members: 52 },
    { id: '4', name: 'Design', members: 22 },
    { id: '5', name: 'Product', members: 31 },
    { id: '6', name: 'HR', members: 15 }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesAssignment = assignmentFilter === 'all' ||
      (assignmentFilter === 'required' && course.required) ||
      (assignmentFilter === 'optional' && !course.required);
    return matchesSearch && matchesCategory && matchesAssignment;
  });

  const handleAssignCourse = () => {
    toast.success('Course assigned successfully!');
    setShowAssignModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Course Management</h1>
          <p className="text-gray-600">Assign and manage courses for your teams</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors">
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Courses</p>
          <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Active Enrollments</p>
          <p className="text-2xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + c.totalEnrolled, 0)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Total Completions</p>
          <p className="text-2xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + c.completed, 0)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">Avg Rating</p>
          <p className="text-2xl font-bold text-gray-900">
            {(courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="required">Required Only</SelectItem>
              <SelectItem value="optional">Optional Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-40 bg-gray-200">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {course.required && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  Required
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {course.category}
                </span>
                <span className="text-sm text-gray-600">{course.level}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {course.rating}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="font-semibold text-gray-900">{course.totalEnrolled}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="font-semibold text-gray-900">{course.completed}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium text-gray-900">
                    {Math.round((course.completed / course.totalEnrolled) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#395192] rounded-full h-2"
                    style={{ width: `${(course.completed / course.totalEnrolled) * 100}%` }}
                  />
                </div>
              </div>

              {/* Teams Assigned */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{course.enrolledTeams} teams assigned</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse(course.id);
                    setShowAssignModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors text-sm"
                >
                  Assign to Team
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or add new courses</p>
        </div>
      )}

      {/* Assign Course Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Assign Course to Teams</h2>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedCourse(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Teams
                </label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {teams.map((team) => (
                    <label key={team.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200">
                      <input type="checkbox" className="w-4 h-4 text-[#395192] rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{team.name}</p>
                        <p className="text-sm text-gray-500">{team.members} members</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#395192] focus:border-transparent">
                  <option value="required">Required (with deadline)</option>
                  <option value="optional">Optional (recommended)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (for required courses)
                </label>
                <Input
                  type="date"
                  className="w-full"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCourse(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCourse}
                className="flex-1 px-4 py-2 bg-[#395192] text-white rounded-lg hover:bg-[#2d4178] transition-colors"
              >
                Assign Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}