"use client";

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, Wand2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface AIAssistPanelProps {
  type: 'title' | 'description' | 'structure' | 'objectives' | 'visual';
  context?: any;
  onAccept: (suggestion: any) => void;
  onReject?: () => void;
}

export function AIAssistPanel({ type, context, onAccept, onReject }: AIAssistPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);

  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      let generatedSuggestions: any[] = [];
      
      switch (type) {
        case 'title':
          generatedSuggestions = [
            { 
              text: `Complete ${context?.category || 'Programming'} Masterclass 2024`,
              tone: 'Marketing-oriented',
              confidence: 0.95
            },
            { 
              text: `Fundamentals of ${context?.category || 'Programming'}: A Comprehensive Guide`,
              tone: 'Academic',
              confidence: 0.88
            },
            { 
              text: `Learn ${context?.category || 'Programming'} from Scratch`,
              tone: 'Beginner-friendly',
              confidence: 0.92
            }
          ];
          break;
          
        case 'description':
          generatedSuggestions = [
            {
              text: `Master the fundamentals of ${context?.category || 'this topic'} with hands-on projects and real-world examples. Perfect for ${context?.level || 'all'} learners.`,
              tone: 'Beginner-friendly'
            },
            {
              text: `An evidence-based approach to understanding ${context?.category || 'this subject'}, incorporating latest research and industry standards.`,
              tone: 'Academic'
            },
            {
              text: `Transform your career with this comprehensive ${context?.category || 'course'}. Join thousands of successful graduates!`,
              tone: 'Marketing-oriented'
            }
          ];
          break;
          
        case 'structure':
          generatedSuggestions = [{
            modules: [
              {
                title: 'Introduction & Foundations',
                lessons: ['Welcome & Course Overview', 'Setup & Prerequisites', 'Core Concepts'],
                outcome: 'Understand the basics and set up your environment'
              },
              {
                title: 'Intermediate Concepts',
                lessons: ['Advanced Techniques', 'Best Practices', 'Common Patterns'],
                outcome: 'Apply intermediate-level skills'
              },
              {
                title: 'Advanced Topics & Projects',
                lessons: ['Real-world Projects', 'Performance Optimization', 'Final Assessment'],
                outcome: 'Build production-ready solutions'
              }
            ]
          }];
          break;
          
        case 'objectives':
          generatedSuggestions = [
            'Understand core concepts and terminology',
            'Apply knowledge to solve real-world problems',
            'Build practical projects from scratch',
            'Evaluate and optimize solutions',
            'Create production-ready implementations'
          ];
          break;
          
        case 'visual':
          generatedSuggestions = [
            { type: 'diagram', name: 'Concept Map', description: 'Visual relationship diagram' },
            { type: 'calculator', name: 'Interactive Calculator', description: 'Hands-on practice tool' },
            { type: 'simulator', name: 'Virtual Simulator', description: 'Safe experimentation environment' }
          ];
          break;
      }
      
      setSuggestions(generatedSuggestions);
      setIsGenerating(false);
      setExpanded(true);
    }, 1500);
  };

  if (!expanded) {
    return (
      <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">AI Assist Available</p>
              <p className="text-sm text-muted-foreground">Get AI-powered suggestions</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={generateSuggestions}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">AI Suggestions</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={generateSuggestions}
              disabled={isGenerating}
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => {
                setExpanded(false);
                onReject?.();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Review and select AI-generated options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="p-3 bg-background rounded-lg border hover:border-primary/50 transition-colors"
          >
            {type === 'title' || type === 'description' ? (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1">{suggestion.text}</p>
                  <Button 
                    size="sm"
                    onClick={() => {
                      onAccept(suggestion.text);
                      setExpanded(false);
                    }}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                </div>
                {suggestion.tone && (
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.tone}
                  </Badge>
                )}
                {suggestion.confidence && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${suggestion.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            ) : type === 'structure' ? (
              <div className="space-y-3">
                {suggestion.modules?.map((module: any, mIndex: number) => (
                  <div key={mIndex} className="space-y-1">
                    <p className="font-medium">{module.title}</p>
                    <p className="text-sm text-muted-foreground">{module.outcome}</p>
                    <ul className="text-sm space-y-1 ml-4">
                      {module.lessons?.map((lesson: string, lIndex: number) => (
                        <li key={lIndex} className="list-disc">{lesson}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Button 
                  className="w-full mt-2"
                  onClick={() => {
                    onAccept(suggestion);
                    setExpanded(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply Structure
                </Button>
              </div>
            ) : type === 'objectives' ? (
              <div className="flex items-center justify-between">
                <p className="flex-1">{suggestion}</p>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => onAccept(suggestion)}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : type === 'visual' ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{suggestion.name}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onAccept(suggestion)}
                >
                  Insert
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
