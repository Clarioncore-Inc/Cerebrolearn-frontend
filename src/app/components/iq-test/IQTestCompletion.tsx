"use client";

import React, { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

interface IQTestCompletionProps {
  onNavigate: (page: string, data?: any) => void;
  resultId: string;
}

export function IQTestCompletion({ onNavigate, resultId }: IQTestCompletionProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'analyzing' | 'calculating' | 'finalizing'>('analyzing');

  useEffect(() => {
    // Simulate processing stages
    const stages = [
      { name: 'analyzing', duration: 2000, progressEnd: 30 },
      { name: 'calculating', duration: 2000, progressEnd: 70 },
      { name: 'finalizing', duration: 1500, progressEnd: 100 }
    ];

    let currentStageIndex = 0;
    let currentProgress = 0;

    const runStage = () => {
      if (currentStageIndex >= stages.length) {
        // All stages complete, navigate to results
        setTimeout(() => {
          onNavigate('iq-test-results', { resultId });
        }, 500);
        return;
      }

      const stage = stages[currentStageIndex];
      setStage(stage.name as any);

      const progressIncrement = (stage.progressEnd - currentProgress) / 20;
      let steps = 0;

      const interval = setInterval(() => {
        steps++;
        currentProgress = Math.min(
          currentProgress + progressIncrement,
          stage.progressEnd
        );
        setProgress(Math.round(currentProgress));

        if (steps >= 20) {
          clearInterval(interval);
          currentStageIndex++;
          setTimeout(runStage, 300);
        }
      }, stage.duration / 20);
    };

    runStage();
  }, [resultId, onNavigate]);

  const getStageMessage = () => {
    switch (stage) {
      case 'analyzing':
        return 'Analyzing your responses...';
      case 'calculating':
        return 'Calculating cognitive scores...';
      case 'finalizing':
        return 'Finalizing your results...';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="py-16 px-8">
          <div className="text-center space-y-8">
            {/* Animated Brain Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse-glow">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center animate-bounce-subtle">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Processing Your Test</h1>
              <p className="text-muted-foreground text-lg">
                Please wait while we evaluate your cognitive performance
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground capitalize">
                  {getStageMessage()}
                </span>
                <span className="font-medium text-primary">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className={`p-4 rounded-lg border-2 transition-all ${
                stage === 'analyzing' 
                  ? 'border-primary bg-primary/5' 
                  : progress >= 30 
                  ? 'border-success bg-success/5'
                  : 'border-border'
              }`}>
                <div className="text-xs font-medium text-muted-foreground mb-1">Step 1</div>
                <div className="text-sm font-medium">Analysis</div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 transition-all ${
                stage === 'calculating' 
                  ? 'border-primary bg-primary/5' 
                  : progress >= 70 
                  ? 'border-success bg-success/5'
                  : 'border-border'
              }`}>
                <div className="text-xs font-medium text-muted-foreground mb-1">Step 2</div>
                <div className="text-sm font-medium">Calculation</div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 transition-all ${
                stage === 'finalizing' 
                  ? 'border-primary bg-primary/5' 
                  : progress >= 100 
                  ? 'border-success bg-success/5'
                  : 'border-border'
              }`}>
                <div className="text-xs font-medium text-muted-foreground mb-1">Step 3</div>
                <div className="text-sm font-medium">Finalization</div>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="pt-8 text-center">
              <p className="text-sm text-muted-foreground italic">
                Did you know? The average IQ score is designed to be 100, 
                with a standard deviation of 15 points.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}