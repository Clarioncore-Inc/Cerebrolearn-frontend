import React, { useState } from 'react';
import { Sparkles, TrendingUp, Clock, BookOpen, Target, Brain, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

interface AIRecommendationsProps {
  userId: string;
  currentCourse?: string;
}

export function AIRecommendations({ userId, currentCourse }: AIRecommendationsProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock AI-generated recommendations based on user behavior
  const recommendations = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      category: 'Technology',
      level: 'Advanced',
      duration: '8 hours',
      rating: 4.8,
      students: 12450,
      matchScore: 98,
      reasons: [
        'You completed "React Fundamentals" with 95% score',
        'Similar users loved this course',
        'Trending in your learning path'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: '2',
      title: 'TypeScript Deep Dive',
      category: 'Technology',
      level: 'Intermediate',
      duration: '6 hours',
      rating: 4.9,
      students: 8920,
      matchScore: 95,
      reasons: [
        'Complements your JavaScript skills',
        'Popular among React developers',
        'High completion rate (87%)'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400'
    },
    {
      id: '3',
      title: 'System Design Fundamentals',
      category: 'Technology',
      level: 'Advanced',
      duration: '10 hours',
      rating: 4.7,
      students: 15230,
      matchScore: 92,
      reasons: [
        'Next step in your career path',
        'Aligns with your learning goals',
        '89% of learners found jobs after'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'
    }
  ];

  const learningInsights = {
    topSkills: ['React', 'JavaScript', 'CSS'],
    learningStreak: 12,
    completionRate: 87,
    avgScore: 92,
    nextMilestone: 'Complete 10 courses'
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">AI-Powered Recommendations</h2>
              <p className="text-purple-100 text-sm">Personalized just for you</p>
            </div>
          </div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-purple-100 hover:text-white text-sm underline"
          >
            How it works
          </button>
        </div>

        {showExplanation && (
          <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium">Our AI analyzes:</p>
              <button onClick={() => setShowExplanation(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1 text-sm text-purple-100">
              <li>• Your course completion history and scores</li>
              <li>• Learning patterns and preferences</li>
              <li>• Career goals and skill gaps</li>
              <li>• Success rates of similar learners</li>
              <li>• Industry trends and job market demands</li>
            </ul>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-purple-100 text-xs mb-1">Streak</p>
            <p className="text-2xl font-bold">{learningInsights.learningStreak} days</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-purple-100 text-xs mb-1">Completion</p>
            <p className="text-2xl font-bold">{learningInsights.completionRate}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-purple-100 text-xs mb-1">Avg Score</p>
            <p className="text-2xl font-bold">{learningInsights.avgScore}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-purple-100 text-xs mb-1">Top Skill</p>
            <p className="text-lg font-bold">{learningInsights.topSkills[0]}</p>
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recommended For You</h3>
          <button className="text-primary text-sm hover:underline">View All</button>
        </div>

        <div className="space-y-4">
          {recommendations.map((course) => (
            <div key={course.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#395192] hover:shadow-lg transition-all">
              <div className="flex gap-4">
                {/* Thumbnail */}
                <ImageWithFallback
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-32 h-32 object-cover rounded-lg shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          <Sparkles className="w-3 h-3" />
                          {course.matchScore}% match
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {course.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                      </div>

                      {/* AI Reasons */}
                      <div className="bg-purple-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-purple-900 mb-2 flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          Why we recommend this:
                        </p>
                        <ul className="space-y-1">
                          {course.reasons.map((reason, idx) => (
                            <li key={idx} className="text-xs text-purple-700 flex items-start gap-1">
                              <span className="text-purple-500 mt-0.5">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          ⭐ {course.rating}
                        </span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>

                    <Button className="shrink-0">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path Suggestion */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Suggested Learning Path</h3>
            <p className="text-gray-700 mb-4">
              Based on your progress, we recommend following the "Full-Stack Developer" path. 
              You're 60% complete!
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                View Learning Path
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
                Explore Other Paths
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Next Milestone</p>
            <p className="text-sm text-gray-600">{learningInsights.nextMilestone}</p>
          </div>
          <span className="text-2xl font-bold text-yellow-600">7/10</span>
        </div>
        <div className="mt-3 bg-yellow-200 rounded-full h-2">
          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  );
}