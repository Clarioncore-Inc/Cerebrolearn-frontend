"use client";

import React, { useMemo } from 'react';
import { Sparkles, RefreshCw, Users, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  MBTI_PROFILES,
  MBTI_FUNCTIONS,
  MBTIType,
  getMBTITypeImagePath,
} from '../../data/mbtiData';
import { DichotomyPair, DichotomyScore } from '../../data/mbtiQuizData';

interface MBTIQuizResultsProps {
  onNavigate: (page: string, data?: any) => void;
  resultId: string;
}

interface StoredMBTIResult {
  id: string;
  date: string;
  type: MBTIType;
  scores: Record<DichotomyPair, DichotomyScore>;
}

const DICHOTOMY_LABELS: Record<DichotomyPair, string> = {
  EI: 'Extraversion vs. Introversion',
  SN: 'Sensing vs. Intuition',
  TF: 'Thinking vs. Feeling',
  JP: 'Judging vs. Perceiving',
};

export function MBTIQuizResults({ onNavigate, resultId }: MBTIQuizResultsProps) {
  const result = useMemo(() => {
    const results: StoredMBTIResult[] = JSON.parse(localStorage.getItem('mbti_quiz_results') || '[]');
    return results.find((r) => r.id === resultId) || null;
  }, [resultId]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Result Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find your test results. Please try taking the test again.
            </p>
            <Button onClick={() => onNavigate('personality-test-landing')}>
              Take the Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = MBTI_PROFILES[result.type];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src={getMBTITypeImagePath(result.type)}
            alt={result.type}
            className="w-28 h-28 rounded-2xl object-cover mx-auto mb-4 bg-muted shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <Badge className="bg-[#395192] text-white border-0 mb-3">Your Result</Badge>
          <h1 className="text-4xl font-bold mb-1">{result.type}</h1>
          <p className="text-xl text-muted-foreground">{profile.nickname}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Completed on {new Date(result.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>

        {/* Dichotomy Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Dichotomy Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {(Object.keys(result.scores) as DichotomyPair[]).map((pair) => {
              const s = result.scores[pair];
              const total = s.left + s.right || 1;
              const leftPct = Math.round((s.left / total) * 100);
              return (
                <div key={pair}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">
                      {s.leftLetter} {leftPct}%
                    </span>
                    <span className="text-xs text-muted-foreground">{DICHOTOMY_LABELS[pair]}</span>
                    <span className="font-medium text-foreground">
                      {100 - leftPct}% {s.rightLetter}
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden flex">
                    <div className="h-full bg-[#395192]" style={{ width: `${leftPct}%` }} />
                    <div className="h-full bg-[#06b6d4]" style={{ width: `${100 - leftPct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Cognitive Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Cognitive Function Stack</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {profile.stack.map((code, index) => {
              const fn = MBTI_FUNCTIONS[code];
              const Icon = fn.icon;
              const roleLabel = ['Dominant', 'Auxiliary', 'Tertiary', 'Inferior'][index];
              return (
                <div key={code} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-[#395192]" />
                    <span className="font-semibold text-sm">{code}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{roleLabel} · {fn.name}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">About {result.type}s</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
            ))}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">Notable {result.type}s:</p>
              <div className="flex flex-wrap gap-2">
                {profile.matchups.map((m) => (
                  <Badge key={m} variant="secondary">{m}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" onClick={() => onNavigate('personality-test-landing')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake the Test
          </Button>
          <Button size="lg" onClick={() => onNavigate('personality-database')}>
            <Users className="w-4 h-4 mr-2" />
            Explore the Personality Database
          </Button>
          <Button size="lg" variant="secondary" onClick={() => toast.success('Result sharing coming soon!')}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Result
          </Button>
        </div>
      </div>
    </div>
  );
}
