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
  Award,
  Lightbulb,
  TrendingUp,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { SlideInView } from '../pages/SlideInView';
import {
  getGeniusById,
  getGeniusExpertise,
  getGeniusAchievements,
  getGeniusContributions,
} from '../../data/geniusData';
import {
  MBTI_FUNCTIONS,
  MBTI_PROFILES,
  getCognitiveFunctionImagePath,
  getMBTITypeImagePath,
} from '../../data/mbtiData';
import {
  ZODIAC_PROFILES,
  getZodiacAppearanceSummary,
  getZodiacSign,
} from '../../data/zodiacData';

interface PersonalitySubjectProfileProps {
  subject: PDBSubject;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

export function PersonalitySubjectProfile({ subject, onBack, onNavigate }: PersonalitySubjectProfileProps) {
  const [imgError, setImgError] = useState(false);
  const [personalityExpanded, setPersonalityExpanded] = useState(false);
  const [zodiacExpanded, setZodiacExpanded] = useState(false);
  const showImage = !imgError && !!subject.imageUrl;

  const genius = subject.geniusId ? getGeniusById(subject.geniusId) : undefined;
  const expertise = subject.geniusId ? getGeniusExpertise(subject.geniusId) : [];
  const achievements = subject.geniusId ? getGeniusAchievements(subject.geniusId) : [];
  const contributions = subject.geniusId ? getGeniusContributions(subject.geniusId) : [];

  const primaryMbti = useMemo(() => {
    if (!subject.mbtiType || !(subject.mbtiType in MBTI_PROFILES)) {
      return null;
    }

    return {
      typeCode: subject.mbtiType,
      profile: MBTI_PROFILES[subject.mbtiType],
    };
  }, [subject.mbtiType]);

  const zodiacSign = useMemo(() => {
    const fromBirthDate = genius?.birth_date ? getZodiacSign(genius.birth_date) : null;
    if (fromBirthDate) {
      return fromBirthDate;
    }

    const manualSign = genius?.zodiac_sign;
    if (manualSign && Object.prototype.hasOwnProperty.call(ZODIAC_PROFILES, manualSign)) {
      return manualSign as keyof typeof ZODIAC_PROFILES;
    }

    return null;
  }, [genius?.birth_date, genius?.zodiac_sign]);

  const tabs = useMemo(() => {
    const list: { value: string; label: string; icon: typeof User }[] = [
      { value: 'about', label: 'About', icon: User },
    ];
    if (primaryMbti || zodiacSign) {
      list.push({ value: 'personality', label: 'Cognitive & Personality', icon: Brain });
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
    return list;
  }, [primaryMbti, zodiacSign, genius, expertise.length, achievements.length, contributions.length]);

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
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">About {subject.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {genius?.short_description || subject.subtitle}
                  </p>
                </div>
                {(genius?.birth_place || birthYear) && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border">
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

                {(primaryMbti || zodiacSign) && (
                  <div className="pt-6 border-t border-border space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#395192]" />
                      Cognitive &amp; Personality
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {primaryMbti && (
                        <Badge variant="secondary">
                          {primaryMbti.typeCode} &middot; {primaryMbti.profile.nickname}
                        </Badge>
                      )}
                      {zodiacSign && (
                        <Badge variant="secondary">
                          {zodiacSign} &middot; {ZODIAC_PROFILES[zodiacSign].archetype}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {genius?.biography && (
                  <div className="pt-6 border-t border-border space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#395192]" />
                      Biography
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {genius.biography.length > 260
                        ? `${genius.biography.slice(0, 260).trim()}...`
                        : genius.biography}
                    </p>
                  </div>
                )}

                {expertise.length > 0 && (
                  <div className="pt-6 border-t border-border space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#10b981]" />
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[...expertise]
                        .sort((a, b) => b.proficiency_level - a.proficiency_level)
                        .slice(0, 5)
                        .map(exp => (
                          <Badge key={exp.id} variant="outline">
                            {exp.expertise}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}

                {achievements.length > 0 && (
                  <div className="pt-6 border-t border-border space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#f59e0b]" />
                      Major Achievements
                    </h4>
                    <ul className="space-y-2">
                      {achievements.slice(0, 3).map(achievement => (
                        <li key={achievement.id} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{achievement.title}</span>
                          {achievement.year && ` (${achievement.year})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {contributions.length > 0 && (
                  <div className="pt-6 border-t border-border space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-[#06b6d4]" />
                      Key Contributions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {contributions.length} tracked contribution{contributions.length === 1 ? '' : 's'},
                      including {contributions[0].field}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {(primaryMbti || zodiacSign) && (
            <TabsContent value="personality" className="pt-6">
              <div className="space-y-6">
                {primaryMbti && (
                  <SlideInView delay={100}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-lg font-semibold">{primaryMbti.profile.nickname}</h3>
                              <Badge variant="secondary">{primaryMbti.typeCode}</Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onNavigate('personality-types')}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View All Personality Types
                            </Button>
                          </div>
                        </div>

                        <div className="border-t px-6 py-6 space-y-6">
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {primaryMbti.profile.stack.map((code) => {
                              const fn = MBTI_FUNCTIONS[code];
                              return (
                                <div key={code} className="space-y-3">
                                  <img
                                    src={getCognitiveFunctionImagePath(code)}
                                    alt={`${code} icon`}
                                    className="h-14 w-14 object-contain"
                                  />
                                  <div className="space-y-1.5">
                                    <p className="text-sm font-semibold">
                                      ({code}) {fn.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-semibold text-foreground">{fn.sublabel}:</span>{' '}
                                      {fn.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="space-y-3">
                            <div className="overflow-hidden rounded-xl border bg-muted/20">
                              <img
                                src={getMBTITypeImagePath(primaryMbti.typeCode)}
                                alt={`Illustration of ${primaryMbti.typeCode}`}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                            <p className="text-xs italic text-muted-foreground">Image of MBTI Type</p>
                          </div>

                          <div className="rounded-2xl bg-muted/40 p-6 space-y-4">
                            {primaryMbti.profile.paragraphs
                              .slice(0, personalityExpanded ? undefined : 1)
                              .map((paragraph, index) => (
                                <p key={index} className="text-sm leading-7 text-muted-foreground">
                                  {paragraph}
                                </p>
                              ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setPersonalityExpanded((current) => !current)}
                            className="text-sm text-primary flex items-center gap-1 ml-auto"
                          >
                            {personalityExpanded ? (
                              <>
                                Show Less <ChevronUp className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Show More <ChevronDown className="h-4 w-4" />
                              </>
                            )}
                          </button>

                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-primary" />
                              Personality Matchups
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Notable figures who share this cognitive type
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {primaryMbti.profile.matchups.map((name) => (
                                <Badge key={name} variant="outline" className="text-sm py-1.5">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SlideInView>
                )}

                {zodiacSign && (
                  <SlideInView delay={150}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6 space-y-3">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                  {zodiacSign} ({ZODIAC_PROFILES[zodiacSign].symbolName})
                                </h3>
                                <Badge variant="secondary">{ZODIAC_PROFILES[zodiacSign].archetype}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {ZODIAC_PROFILES[zodiacSign].dateRangeLabel}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{ZODIAC_PROFILES[zodiacSign].element}</Badge>
                                <Badge variant="outline">{ZODIAC_PROFILES[zodiacSign].modality}</Badge>
                                <Badge variant="outline">
                                  Ruled by {ZODIAC_PROFILES[zodiacSign].rulingPlanet}
                                </Badge>
                                <Badge variant="outline">
                                  Influenced by {ZODIAC_PROFILES[zodiacSign].influencePlanet}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onNavigate('zodiac-signs')}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View All Zodiac Signs
                            </Button>
                          </div>
                        </div>

                        <div className="border-t px-6 py-6 space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border bg-muted/40 p-3">
                              <img
                                src={`/assets/${zodiacSign.toLowerCase()}_symbol.png`}
                                alt={`${zodiacSign} symbol`}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-base font-semibold">General Physical Appearance</h4>
                              <p className="text-sm text-muted-foreground">
                                {getZodiacAppearanceSummary(zodiacSign, ZODIAC_PROFILES[zodiacSign])}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="overflow-hidden rounded-xl border bg-muted/20">
                              <img
                                src={`/assets/${zodiacSign.toLowerCase()}.png`}
                                alt={`Illustration of ${zodiacSign}`}
                                className="w-full h-auto object-cover"
                              />
                            </div>
                            <p className="text-xs italic text-muted-foreground">Image of a {zodiacSign}</p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-base font-semibold">General Conscience &amp; Personality</h4>
                            {ZODIAC_PROFILES[zodiacSign].paragraphs
                              .slice(0, zodiacExpanded ? undefined : 1)
                              .map((paragraph, index) => (
                                <p key={index} className="text-sm text-muted-foreground">
                                  {paragraph}
                                </p>
                              ))}
                            <button
                              type="button"
                              onClick={() => setZodiacExpanded((current) => !current)}
                              className="text-sm text-primary flex items-center gap-1 ml-auto"
                            >
                              {zodiacExpanded ? (
                                <>
                                  Show Less <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Show More <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SlideInView>
                )}
              </div>
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
        </Tabs>
      </div>
    </div>
  );
}
