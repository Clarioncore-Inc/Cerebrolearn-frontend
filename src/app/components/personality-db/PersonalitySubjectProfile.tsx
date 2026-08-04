import React, { useMemo, useState } from 'react';
import { PDBSubject } from '../../types/personalityDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ArrowLeft,
  Sparkles,
  User,
  Brain,
  MessageSquare,
  Award,
  Lightbulb,
  TrendingUp,
  Calendar,
  MapPin,
} from 'lucide-react';
import { PersonalityVotingWidget } from './PersonalityVotingWidget';
import { CommentSection } from './CommentSection';
import { SlideInView } from '../pages/SlideInView';
import { getAvailableSystemsForSubject } from '../../data/personalityDatabaseData';
import {
  getGeniusById,
  getGeniusExpertise,
  getGeniusAchievements,
  getGeniusContributions,
} from '../../data/geniusData';

interface PersonalitySubjectProfileProps {
  subject: PDBSubject;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

export function PersonalitySubjectProfile({ subject, onBack, onNavigate }: PersonalitySubjectProfileProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !imgError && !!subject.imageUrl;

  const requireSignIn = () => {
    onNavigate('auth', {
      authMode: 'login',
      postAuthRedirect: {
        page: 'personality-database',
        data: { slug: subject.slug },
      },
    });
  };

  const genius = subject.geniusId ? getGeniusById(subject.geniusId) : undefined;
  const expertise = subject.geniusId ? getGeniusExpertise(subject.geniusId) : [];
  const achievements = subject.geniusId ? getGeniusAchievements(subject.geniusId) : [];
  const contributions = subject.geniusId ? getGeniusContributions(subject.geniusId) : [];
  const personalitySystems = useMemo(
    () => getAvailableSystemsForSubject(subject.id),
    [subject.id],
  );

  const tabs = useMemo(() => {
    const list: { value: string; label: string; icon: typeof User }[] = [
      { value: 'about', label: 'About', icon: User },
    ];
    if (personalitySystems.length > 0) {
      list.push({ value: 'personality', label: 'Personality', icon: Brain });
    }
    if (genius?.biography) {
      list.push({ value: 'biography', label: 'Biography', icon: Sparkles });
    }
    if (expertise.length > 0) {
      list.push({ value: 'expertise', label: 'Expertise', icon: TrendingUp });
    }
    if (achievements.length > 0) {
      list.push({ value: 'achievements', label: 'Achievements', icon: Award });
    }
    if (contributions.length > 0) {
      list.push({ value: 'contributions', label: 'Contributions', icon: Lightbulb });
    }
    list.push({ value: 'community', label: 'Discussion', icon: MessageSquare });
    return list;
  }, [personalitySystems.length, genius, expertise.length, achievements.length, contributions.length]);

  const [activeTab, setActiveTab] = useState(tabs[0]?.value ?? 'about');

  const birthYear = genius?.birth_date ? new Date(genius.birth_date).getFullYear() : null;
  const deathYear = genius?.death_date ? new Date(genius.death_date).getFullYear() : null;

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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex-wrap h-auto justify-start">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="about" className="pt-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">About {subject.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {genius?.short_description || subject.subtitle}
                  </p>
                </div>
                {(genius?.birth_place || birthYear) && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                    {birthYear && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Life Span</div>
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar className="w-5 h-5" />
                          <span>
                            {birthYear} - {deathYear || 'Present'}
                          </span>
                        </div>
                      </div>
                    )}
                    {genius?.birth_place && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Birth Place</div>
                        <div className="flex items-start gap-2 text-foreground">
                          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{genius.birth_place}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {personalitySystems.length > 0 && (
            <TabsContent value="personality" className="pt-6">
              <SlideInView>
                <PersonalityVotingWidget subjectId={subject.id} onRequireSignIn={requireSignIn} />
              </SlideInView>
            </TabsContent>
          )}

          {genius?.biography && (
            <TabsContent value="biography" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#395192]" />
                    Biography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {genius.biography}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {expertise.length > 0 && (
            <TabsContent value="expertise" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fields of Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expertise.map(exp => (
                      <div key={exp.id}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">{exp.expertise}</span>
                          <span className="text-muted-foreground">{exp.proficiency_level}/10</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#395192] to-[#06b6d4] transition-all duration-500"
                            style={{ width: `${exp.proficiency_level * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {achievements.length > 0 && (
            <TabsContent value="achievements" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#f59e0b]" />
                    Major Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map(achievement => (
                      <div key={achievement.id} className="border-l-4 border-[#395192] pl-4 py-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          {achievement.year && (
                            <Badge variant="secondary" className="flex-shrink-0">
                              {achievement.year}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {contributions.length > 0 && (
            <TabsContent value="contributions" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#06b6d4]" />
                    Key Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contributions.map(contribution => (
                      <div
                        key={contribution.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground mb-1">{contribution.field}</div>
                          <div className="text-sm text-muted-foreground">{contribution.contribution}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-[#10b981]" />
                          <span className="text-sm font-medium text-[#10b981]">
                            {contribution.impact_score}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="community" className="pt-6">
            <SlideInView>
              <CommentSection subjectId={subject.id} onRequireSignIn={requireSignIn} />
            </SlideInView>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
