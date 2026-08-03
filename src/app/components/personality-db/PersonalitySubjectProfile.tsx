import React, { useState } from 'react';
import { PDBSubject } from '../../types/personalityDatabase';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PersonalityVotingWidget } from './PersonalityVotingWidget';
import { CommentSection } from './CommentSection';
import { SlideInView } from '../pages/SlideInView';

interface PersonalitySubjectProfileProps {
  subject: PDBSubject;
  onBack: () => void;
}

export function PersonalitySubjectProfile({ subject, onBack }: PersonalitySubjectProfileProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !imgError && !!subject.imageUrl;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header/Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#395192]/15 via-background to-[#06b6d4]/10 border-b border-border">
        <div className="absolute inset-0 neural-grid opacity-20"></div>
        <div className="container relative z-10 py-10">
          <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-white/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Personality Database
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {showImage ? (
              <img
                src={subject.imageUrl!}
                alt={subject.name}
                onError={() => setImgError(true)}
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-2xl object-cover flex-shrink-0 bg-muted"
              />
            ) : (
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 bg-gradient-to-br from-[#395192] to-[#06b6d4]">
                {subject.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{subject.name}</h1>
                <p className="text-lg text-muted-foreground">{subject.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#395192] text-white border-0">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  {subject.category}
                </Badge>
                {subject.subcategory && (
                  <Badge variant="outline">{subject.subcategory}</Badge>
                )}
                {subject.sourceType === 'genius' && (
                  <Badge variant="outline">Linked Genius Profile</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SlideInView>
              <PersonalityVotingWidget subjectId={subject.id} />
            </SlideInView>
            <SlideInView delay={100}>
              <CommentSection subjectId={subject.id} />
            </SlideInView>
          </div>

          <div className="space-y-6">
            <SlideInView delay={200}>
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold text-foreground">About This Page</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Personality types shown here are crowd-sourced through community voting,
                    not verified clinical assessments. Anyone — including anonymous visitors
                    — can vote and discuss.
                  </p>
                </CardContent>
              </Card>
            </SlideInView>
          </div>
        </div>
      </div>
    </div>
  );
}
