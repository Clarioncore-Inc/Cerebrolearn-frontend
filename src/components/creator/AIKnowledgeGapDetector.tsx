"use client";

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, Lightbulb, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

interface Gap {
  id: string;
  type: 'missing-prerequisite' | 'weak-transition' | 'overloaded-module' | 'missing-assessment';
  severity: 'high' | 'medium' | 'low';
  location: string;
  description: string;
  suggestion: string;
}

interface AIKnowledgeGapDetectorProps {
  courseData: any;
  onApplySuggestion?: (gapId: string, suggestion: string) => void;
}

export function AIKnowledgeGapDetector({ courseData, onApplySuggestion }: AIKnowledgeGapDetectorProps) {
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    analyzeKnowledgeGaps();
  }, [courseData]);

  const analyzeKnowledgeGaps = () => {
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const detectedGaps: Gap[] = [];

      // Check for missing prerequisites
      if (!courseData.prerequisites || courseData.prerequisites.length === 0) {
        detectedGaps.push({
          id: 'gap-1',
          type: 'missing-prerequisite',
          severity: 'medium',
          location: 'Course Setup',
          description: 'No prerequisites defined',
          suggestion: 'Add prerequisites to help students understand what knowledge they need before starting'
        });
      }

      // Check for overloaded modules
      if (courseData.sections && courseData.sections.some((s: any) => s.lessons && s.lessons.length > 8)) {
        detectedGaps.push({
          id: 'gap-2',
          type: 'overloaded-module',
          severity: 'low',
          location: 'Course Structure',
          description: 'Some modules contain too many lessons',
          suggestion: 'Consider breaking large modules into smaller, focused units for better learning outcomes'
        });
      }

      // Check for weak transitions
      if (courseData.sections && courseData.sections.length > 1) {
        const sectionsWithoutDesc = courseData.sections.filter((s: any) => !s.description || !s.outcome);
        if (sectionsWithoutDesc.length > 0) {
          detectedGaps.push({
            id: 'gap-3',
            type: 'weak-transition',
            severity: 'medium',
            location: 'Module Transitions',
            description: 'Some modules lack clear outcomes or descriptions',
            suggestion: 'Add module descriptions and learning outcomes to improve flow and student understanding'
          });
        }
      }

      // Check for missing assessments
      if (!courseData.assessments || courseData.assessments.length === 0) {
        detectedGaps.push({
          id: 'gap-4',
          type: 'missing-assessment',
          severity: 'high',
          location: 'Course Assessment',
          description: 'No quizzes or assessments defined',
          suggestion: 'Add quizzes and exercises to reinforce learning and track student progress'
        });
      }

      setGaps(detectedGaps);
      setAnalyzing(false);
    }, 1000);
  };

  const visibleGaps = gaps.filter(gap => !dismissed.includes(gap.id));

  if (analyzing) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
            <p className="text-sm text-amber-700">AI is analyzing your course structure...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (visibleGaps.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-700">Great structure!</p>
              <p className="text-sm text-green-600">No major knowledge gaps detected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const severityConfig = {
    high: {
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badgeColor: 'bg-red-100 text-red-700'
    },
    medium: {
      icon: Info,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    low: {
      icon: Lightbulb,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-700'
    }
  };

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <Badge variant="secondary">
            {visibleGaps.length} {visibleGaps.length === 1 ? 'suggestion' : 'suggestions'}
          </Badge>
        </div>
        <CardDescription>
          Non-blocking suggestions to improve your course
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleGaps.map((gap) => {
          const config = severityConfig[gap.severity];
          const Icon = config.icon;
          
          return (
            <Alert key={gap.id} className={`${config.borderColor} ${config.bgColor}`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{gap.description}</p>
                        <Badge className={`${config.badgeColor} text-xs`}>
                          {gap.location}
                        </Badge>
                      </div>
                      <AlertDescription className="text-sm">
                        {gap.suggestion}
                      </AlertDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDismissed([...dismissed, gap.id])}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {onApplySuggestion && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApplySuggestion(gap.id, gap.suggestion)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Apply Suggestion
                    </Button>
                  )}
                </div>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}
