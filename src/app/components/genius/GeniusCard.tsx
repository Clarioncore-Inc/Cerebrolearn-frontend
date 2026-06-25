import React, { useState } from 'react';
import { Genius } from '../../types/genius';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, Calendar, MapPin } from 'lucide-react';

interface GeniusCardProps {
  genius: Genius;
  onClick?: () => void;
}

export function GeniusCard({ genius, onClick }: GeniusCardProps) {

  const [imgError, setImgError] = useState(false);
  const showImage = !imgError && !!genius.profile_image_url;

  const birthYear = genius.birth_date ? new Date(genius.birth_date).getFullYear() : null;
  const deathYear = genius.death_date ? new Date(genius.death_date).getFullYear() : null;

  const getIQColor = (iq: number | null) => {
    if (!iq) return '#64748b';
    if (iq >= 180) return '#f59e0b'; // Gold
    if (iq >= 160) return '#06b6d4'; // Teal
    if (iq >= 140) return '#10b981'; // Green
    return '#64748b'; // Gray
  };

  const iqColor = getIQColor(genius.iq_score);

  return (
    <Card
      className="group h-full cursor-pointer overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#395192]/50 hover:shadow-2xl dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 dark:hover:border-[#06b6d4]/50 dark:hover:shadow-[0_24px_48px_rgba(2,6,23,0.65)]"
      onClick={onClick}
    >
      {/* Header with image / gradient */}
      <div
        className="relative h-48 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${iqColor}30 0%, ${iqColor}12 100%)`
        }}
      >
        {showImage ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent z-10" />
            <img
              src={genius.profile_image_url!}
              alt={genius.full_name}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain object-center p-3 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/30 text-3xl font-bold text-white shadow-xl backdrop-blur-md"
              style={{ background: `linear-gradient(135deg, ${iqColor} 0%, ${iqColor}cc 100%)` }}
            >
              {genius.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        )}

        {/* IQ Badge */}
        {genius.iq_score && (
          <div className="absolute top-4 right-4" title={genius.iq_score_note}>
            <div
              className="glass-ai flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow-lg dark:border-white/10 dark:bg-slate-950/75"
              style={{ borderColor: `${iqColor}40` }}
            >
              <Brain className="w-4 h-4" style={{ color: iqColor }} />
              <span className="text-sm font-bold" style={{ color: iqColor }}>
                ~{genius.iq_score}
              </span>
            </div>
          </div>
        )}

        {/* Era Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs text-yellow-800 dark:bg-slate-950/85 dark:text-amber-300 dark:border-white/10">
            {genius.era}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4 pt-6 text-center">
        <CardTitle className="line-clamp-1 text-xl text-[#395192] transition-colors group-hover:text-[#052d69] dark:text-slate-100 dark:group-hover:text-[#67e8f9]">
          {genius.full_name}
        </CardTitle>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground dark:text-slate-400">
          {genius.short_description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pb-6">
        {/* Life Span */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>
            {birthYear && birthYear < 0 ? `${Math.abs(birthYear)} BCE` : birthYear}
            {' - '}
            {deathYear && deathYear < 0 ? `${Math.abs(deathYear)} BCE` : deathYear || 'Present'}
          </span>
        </div>

        {/* Birth Place */}
        <div className="flex items-center justify-center gap-2 line-clamp-1 text-sm text-muted-foreground dark:text-slate-400">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{genius.birth_place}</span>
        </div>

        {/* Zodiac if available */}
        {genius.zodiac_sign && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs text-black dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200">
              ♈ {genius.zodiac_sign}
            </Badge>
          </div>
        )}

        {/* Living-person signal */}
        {!genius.death_date && !genius.is_fictional && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
              Living public figure
            </Badge>
          </div>
        )}

        {/* View Profile Button */}
        <div className="pt-2">
          <div className="w-full rounded-lg bg-gradient-to-r from-[#395192] to-[#06b6d4] px-4 py-2 text-center text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Full Profile
          </div>
        </div>
      </CardContent>
    </Card>
  );
}