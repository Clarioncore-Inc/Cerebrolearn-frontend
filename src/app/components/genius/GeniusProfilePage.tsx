import React, { useState } from 'react';
import { GeniusProfile } from '../../types/genius';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Brain,
  Calendar,
  MapPin,
  Award,
  Lightbulb,
  TrendingUp,
  ArrowLeft,
  Star
} from 'lucide-react';
import { SlideInView } from '../pages/SlideInView';

interface GeniusProfilePageProps {
  genius: GeniusProfile;
  onBack: () => void;
}

export function GeniusProfilePage({ genius, onBack }: GeniusProfilePageProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !imgError && !!genius.profile_image_url;

  const birthYear = genius.birth_date ? new Date(genius.birth_date).getFullYear() : null;
  const deathYear = genius.death_date ? new Date(genius.death_date).getFullYear() : null;

  const getIQColor = (iq: number | null) => {
    if (!iq) return '#64748b';
    if (iq >= 180) return '#f59e0b';
    if (iq >= 160) return '#06b6d4';
    if (iq >= 140) return '#10b981';
    return '#64748b';
  };

  const iqColor = getIQColor(genius.iq_score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header/Banner */}
      <div
        className="relative h-80 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${iqColor}30 0%, ${iqColor}10 100%)`
        }}
      >
        <div className="absolute inset-0 neural-grid opacity-20"></div>

        <div className="container relative z-10 h-full flex items-center">
          <div className="w-full">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-6 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              {/* Profile Image */}
              {showImage ? (
                <img
                  src={genius.profile_image_url!}
                  alt={genius.full_name}
                  onError={() => setImgError(true)}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-2xl object-cover flex-shrink-0 bg-muted"
                />
              ) : (
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center text-4xl md:text-5xl font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${iqColor} 0%, ${iqColor}cc 100%)` }}
                >
                  {genius.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}

              {/* Name and Quick Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                    {genius.full_name}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {genius.short_description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {genius.era} Era
                  </Badge>
                  {genius.zodiac_sign && (
                    <Badge variant="outline" className="text-sm">
                      ♈ {genius.zodiac_sign}
                    </Badge>
                  )}
                  {genius.iq_score ? (
                    <Badge
                      title={genius.iq_score_note}
                      className="text-sm text-white border-0"
                      style={{ backgroundColor: iqColor }}
                    >
                      <Brain className="w-3.5 h-3.5 mr-1" />
                      ~{genius.iq_score} est.
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-sm">
                      No verified IQ score
                    </Badge>
                  )}
                  {!genius.death_date && !genius.is_fictional && (
                    <Badge variant="outline" className="text-sm border-emerald-400 text-emerald-600">
                      Living public figure
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <SlideInView>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#395192]" />
                    Biography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {genius.biography}
                  </p>
                  {genius.editorial_note && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        {genius.editorial_note}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SlideInView>

            {/* Achievements */}
            {genius.achievements.length > 0 && (
              <SlideInView delay={100}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#f59e0b]" />
                      Major Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {genius.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="border-l-4 border-[#395192] pl-4 py-2"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">
                                {achievement.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
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
              </SlideInView>
            )}

            {/* Contributions */}
            {genius.contributions.length > 0 && (
              <SlideInView delay={200}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-[#06b6d4]" />
                      Key Contributions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {genius.contributions.map((contribution) => (
                        <div
                          key={contribution.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-foreground mb-1">
                              {contribution.field}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {contribution.contribution}
                            </div>
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
              </SlideInView>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <SlideInView delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* IQ Score */}
                  {genius.iq_score ? (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{genius.iq_score_label}</div>
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5" style={{ color: iqColor }} />
                        <span className="text-2xl font-bold" style={{ color: iqColor }}>
                          ~{genius.iq_score}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {genius.iq_score_note}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">IQ Score</div>
                      <p className="text-xs text-muted-foreground">{genius.iq_score_note}</p>
                    </div>
                  )}

                  {/* Life Span */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Life Span</div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {birthYear && birthYear < 0 ? `${Math.abs(birthYear)} BCE` : birthYear}
                        {' - '}
                        {deathYear && deathYear < 0 ? `${Math.abs(deathYear)} BCE` : deathYear || 'Present'}
                      </span>
                    </div>
                  </div>

                  {/* Birth Place */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Birth Place</div>
                    <div className="flex items-start gap-2 text-foreground">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{genius.birth_place}</span>
                    </div>
                  </div>

                  {/* Era */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Era</div>
                    <Badge variant="secondary" className="text-sm">
                      {genius.era}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </SlideInView>

            {/* Expertise */}
            {genius.expertise.length > 0 && (
              <SlideInView delay={400}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fields of Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {genius.expertise.map((exp) => (
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
              </SlideInView>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}