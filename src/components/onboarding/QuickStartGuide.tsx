import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { BookOpen, Users, Award, Zap } from 'lucide-react';

interface QuickStartGuideProps {
  role: string;
  onAction: (action: string) => void;
  onDismiss: () => void;
}

export function QuickStartGuide({ role, onAction, onDismiss }: QuickStartGuideProps) {
  const guides = {
    learner: {
      title: "Welcome to LearnPro! 🎓",
      steps: [
        {
          icon: BookOpen,
          title: "Browse Courses",
          description: "Explore our catalog of interactive courses",
          action: "catalog",
          buttonText: "View Catalog"
        },
        {
          icon: Zap,
          title: "Start Learning",
          description: "Enroll in courses and begin your journey",
          action: null
        },
        {
          icon: Award,
          title: "Earn Rewards",
          description: "Collect XP, badges, and maintain your streak",
          action: "leaderboard",
          buttonText: "View Leaderboard"
        }
      ]
    },
    instructor: {
      title: "Welcome, Instructor! 👨‍🏫",
      steps: [
        {
          icon: BookOpen,
          title: "Create Your First Course",
          description: "Click 'Create Course' to start building",
          action: "create_course",
          buttonText: "Create Course"
        },
        {
          icon: Users,
          title: "Add Lessons",
          description: "Create interactive lessons, quizzes, and videos",
          action: null
        },
        {
          icon: Zap,
          title: "Publish & Share",
          description: "Make your course public and reach students",
          action: null
        }
      ]
    },
    admin: {
      title: "Admin Dashboard Overview 🛠️",
      steps: [
        {
          icon: Users,
          title: "Manage Users",
          description: "View and moderate platform users",
          action: null
        },
        {
          icon: BookOpen,
          title: "Moderate Content",
          description: "Review and approve courses",
          action: null
        },
        {
          icon: Award,
          title: "View Analytics",
          description: "Monitor platform growth and engagement",
          action: null
        }
      ]
    }
  };

  const guide = guides[role as keyof typeof guides] || guides.learner;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{guide.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {guide.steps.map((step, index) => (
            <div key={index} className="p-4 bg-background rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="mb-2">{step.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
              {step.action && step.buttonText && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    onAction(step.action);
                    onDismiss();
                  }}
                >
                  {step.buttonText}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
