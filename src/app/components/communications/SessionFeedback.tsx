"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Heart,
  TrendingUp,
  MessageSquare,
  Target,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SessionFeedbackProps {
  onNavigate: (page: string, data?: any) => void;
  appointment: any;
  duration: number;
}

export function SessionFeedback({ onNavigate, appointment, duration }: SessionFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState({
    helpfulness: 0,
    progress: 0,
    comfort: 0,
    wouldRecommend: null as boolean | null,
    goalsAddressed: [] as string[],
    improvements: '',
    positives: '',
    nextSessionGoals: ''
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minutes`;
  };

  const goalOptions = [
    'Discussed main concerns',
    'Learned new coping strategies',
    'Gained new insights',
    'Felt heard and understood',
    'Made progress on goals',
    'Received helpful feedback'
  ];

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    // Save feedback
    const feedbackData = {
      appointmentId: appointment.id,
      rating,
      ...feedback,
      submittedAt: new Date().toISOString()
    };

    const allFeedback = JSON.parse(localStorage.getItem('session_feedback') || '[]');
    allFeedback.push(feedbackData);
    localStorage.setItem('session_feedback', JSON.stringify(allFeedback));

    toast.success('Thank you for your feedback!');
    onNavigate('therapy-dashboard');
  };

  const skip = () => {
    if (confirm('Skip feedback? Your input helps improve future sessions.')) {
      onNavigate('therapy-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Session Complete</h1>
          <p className="text-muted-foreground">
            Thank you for attending your session with {appointment.psychologistName}
          </p>
        </div>

        {/* Session Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Duration</span>
                </div>
                <p className="text-2xl font-bold">{formatDuration(duration)}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Session Type</span>
                </div>
                <p className="text-lg font-semibold">{appointment.sessionType}</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Date</span>
                </div>
                <p className="text-lg font-semibold">
                  {new Date(appointment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Rating */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overall Session Rating</CardTitle>
            <CardDescription>How would you rate this session?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-12 w-12 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 5 && 'Excellent! We\'re glad it went so well.'}
                {rating === 4 && 'Great! Thank you for your feedback.'}
                {rating === 3 && 'Good. We appreciate your input.'}
                {rating === 2 && 'We\'re sorry to hear that. Your feedback helps us improve.'}
                {rating === 1 && 'We apologize for the experience. Please share more details below.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Feedback</CardTitle>
            <CardDescription>Help us understand your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Helpfulness */}
            <div>
              <Label className="mb-3 block">How helpful was this session?</Label>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFeedback({ ...feedback, helpfulness: level })}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                      feedback.helpfulness === level
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">{level}</div>
                      {level === 1 && <div className="text-xs mt-1">Not helpful</div>}
                      {level === 5 && <div className="text-xs mt-1">Very helpful</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div>
              <Label className="mb-3 block">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Did you make progress today?
                </div>
              </Label>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFeedback({ ...feedback, progress: level })}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                      feedback.progress === level
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl font-bold">{level}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Comfort */}
            <div>
              <Label className="mb-3 block">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  How comfortable did you feel?
                </div>
              </Label>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFeedback({ ...feedback, comfort: level })}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                      feedback.comfort === level
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl font-bold">{level}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goals Addressed */}
            <div>
              <Label className="mb-3 block">What goals were addressed? (Select all that apply)</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={goal}
                      checked={feedback.goalsAddressed.includes(goal)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFeedback({
                            ...feedback,
                            goalsAddressed: [...feedback.goalsAddressed, goal]
                          });
                        } else {
                          setFeedback({
                            ...feedback,
                            goalsAddressed: feedback.goalsAddressed.filter(g => g !== goal)
                          });
                        }
                      }}
                    />
                    <label htmlFor={goal} className="text-sm cursor-pointer flex-1">
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Would Recommend */}
            <div>
              <Label className="mb-3 block">Would you recommend this therapist to others?</Label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedback({ ...feedback, wouldRecommend: true })}
                  className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                    feedback.wouldRecommend === true
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-border hover:border-green-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ThumbsUp className={`h-6 w-6 ${
                      feedback.wouldRecommend === true ? 'text-green-600' : 'text-muted-foreground'
                    }`} />
                    <span className="font-semibold">Yes</span>
                  </div>
                </button>
                <button
                  onClick={() => setFeedback({ ...feedback, wouldRecommend: false })}
                  className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                    feedback.wouldRecommend === false
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-border hover:border-red-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ThumbsDown className={`h-6 w-6 ${
                      feedback.wouldRecommend === false ? 'text-red-600' : 'text-muted-foreground'
                    }`} />
                    <span className="font-semibold">No</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Written Feedback */}
            <div>
              <Label htmlFor="positives">What went well in this session?</Label>
              <Textarea
                id="positives"
                placeholder="Share what you found helpful or positive..."
                value={feedback.positives}
                onChange={(e) => setFeedback({ ...feedback, positives: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="improvements">What could be improved?</Label>
              <Textarea
                id="improvements"
                placeholder="Share any concerns or suggestions..."
                value={feedback.improvements}
                onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="nextGoals">Goals for next session (optional)</Label>
              <Textarea
                id="nextGoals"
                placeholder="What would you like to focus on next time?"
                value={feedback.nextSessionGoals}
                onChange={(e) => setFeedback({ ...feedback, nextSessionGoals: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={skip} className="flex-1">
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit Feedback
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Your feedback is confidential and helps improve the quality of care
        </p>
      </div>
    </div>
  );
}
