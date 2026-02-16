"use client";

import React, { useState } from 'react';
import { Eye, AlertCircle, CheckCircle, MessageSquare, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

interface PreviewIssue {
  id: string;
  type: 'incomplete' | 'unverified' | 'draft';
  location: string;
  description: string;
}

interface InlineFeedback {
  id: string;
  sectionId: string;
  userName: string;
  feedback: string;
  timestamp: string;
}

interface CollaborativePreviewProps {
  courseData: any;
  onClose?: () => void;
}

export function CollaborativePreview({ courseData, onClose }: CollaborativePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbacks, setFeedbacks] = useState<InlineFeedback[]>([]);

  const issues: PreviewIssue[] = [
    ...(courseData.sections?.filter((s: any) => !s.title || s.lessons?.length === 0).map((s: any, i: number) => ({
      id: `incomplete-${i}`,
      type: 'incomplete' as const,
      location: `Section ${i + 1}`,
      description: 'Incomplete section - missing title or lessons'
    })) || []),
    ...(!courseData.verificationRequests || courseData.verificationRequests.length === 0 ? [{
      id: 'unverified-1',
      type: 'unverified' as const,
      location: 'Course',
      description: 'No verification requested'
    }] : []),
    ...(courseData.status === 'draft' ? [{
      id: 'draft-1',
      type: 'draft' as const,
      location: 'Course',
      description: 'Course is in draft mode'
    }] : [])
  ];

  const handleAddFeedback = () => {
    if (!feedbackText.trim() || !selectedSection) return;

    const newFeedback: InlineFeedback = {
      id: Date.now().toString(),
      sectionId: selectedSection,
      userName: 'You',
      feedback: feedbackText,
      timestamp: new Date().toISOString()
    };

    setFeedbacks([...feedbacks, newFeedback]);
    setFeedbackText('');
    setSelectedSection(null);
  };

  const issueConfig = {
    incomplete: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Incomplete'
    },
    unverified: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Unverified'
    },
    draft: {
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      label: 'Draft'
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowPreview(true)}
        className="w-full"
      >
        <Eye className="w-4 h-4 mr-2" />
        Collaborative Preview
      </Button>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Course Preview - Learner View</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={feedbackMode ? 'default' : 'outline'}
                  onClick={() => setFeedbackMode(!feedbackMode)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {feedbackMode ? 'Exit' : 'Add'} Feedback
                </Button>
              </div>
            </div>
            <DialogDescription>
              See how learners will experience your course
            </DialogDescription>
          </DialogHeader>

          {/* Issues Summary */}
          {issues.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Preview Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.map((issue) => {
                  const config = issueConfig[issue.type];
                  const Icon = config.icon;
                  
                  return (
                    <div 
                      key={issue.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${config.bgColor}`}
                    >
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{issue.description}</p>
                        <p className="text-xs text-muted-foreground">{issue.location}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Course Preview */}
          <div className="space-y-4">
            {/* Course Header */}
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold mb-2">{courseData.title || 'Untitled Course'}</h1>
              <p className="text-muted-foreground">{courseData.description || 'No description yet'}</p>
              
              {!courseData.title && (
                <Badge variant="destructive" className="mt-2">
                  Missing Title
                </Badge>
              )}
            </div>

            {/* Course Content */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              
              {!courseData.sections || courseData.sections.length === 0 ? (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                    <p className="font-medium text-amber-700">No content added yet</p>
                    <p className="text-sm text-amber-600">Add sections and lessons to get started</p>
                  </CardContent>
                </Card>
              ) : (
                courseData.sections.map((section: any, index: number) => {
                  const sectionFeedbacks = feedbacks.filter(f => f.sectionId === section.id);
                  
                  return (
                    <Card key={section.id} className={feedbackMode ? 'cursor-pointer hover:border-primary' : ''}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {section.title || `Section ${index + 1} (Untitled)`}
                            </CardTitle>
                            {section.description && (
                              <CardDescription className="mt-1">
                                {section.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!section.title && (
                              <Badge variant="destructive" className="text-xs">
                                Missing Title
                              </Badge>
                            )}
                            {feedbackMode && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSection(section.id)}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Lessons */}
                        {!section.lessons || section.lessons.length === 0 ? (
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground text-center">No lessons yet</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {section.lessons.map((lesson: any, lIndex: number) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center gap-3 p-3 border rounded-lg"
                              >
                                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {lesson.title || `Lesson ${lIndex + 1} (Untitled)`}
                                  </p>
                                  {lesson.duration && (
                                    <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Section Feedbacks */}
                        {sectionFeedbacks.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Feedback:</p>
                            {sectionFeedbacks.map((fb) => (
                              <div key={fb.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start justify-between mb-1">
                                  <p className="text-sm font-medium">{fb.userName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(fb.timestamp).toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm">{fb.feedback}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* Add Feedback Dialog */}
          {selectedSection && (
            <Dialog open={!!selectedSection} onOpenChange={() => setSelectedSection(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Inline Feedback</DialogTitle>
                  <DialogDescription>
                    Provide feedback for this section
                  </DialogDescription>
                </DialogHeader>
                
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter your feedback..."
                  rows={4}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedSection(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFeedback}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Feedback
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
