import React, { useState } from 'react';
import { Genius } from '../../types/genius';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, Calendar, MapPin, TrendingUp } from 'lucide-react';

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
      className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-[#395192] bg-white h-full"
      onClick={onClick}
    >
      {/* Header with gradient */}
      <div
        className="h-32 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${iqColor}20 0%, ${iqColor}10 100%)`
        }}
      >
        {/* IQ Badge */}
        {genius.iq_score && (
          <div className="absolute top-4 right-4" title={genius.iq_score_note}>
            <div
              className="glass-ai rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg"
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
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs">
            {genius.era}
          </Badge>
        </div>

        {/* Profile Image */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          {showImage ? (
            <img
              src={genius.profile_image_url!}
              alt={genius.full_name}
              onError={() => setImgError(true)}
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover bg-muted"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${iqColor} 0%, ${iqColor}cc 100%)` }}
            >
              {genius.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pt-14 pb-4 text-center">
        <CardTitle className="text-xl text-[#395192] group-hover:text-[#052d69] transition-colors line-clamp-1">
          {genius.full_name}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {genius.short_description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pb-6">
        {/* Life Span */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {birthYear && birthYear < 0 ? `${Math.abs(birthYear)} BCE` : birthYear}
            {' - '}
            {deathYear && deathYear < 0 ? `${Math.abs(deathYear)} BCE` : deathYear || 'Present'}
          </span>
        </div>

        {/* Birth Place */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground line-clamp-1">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{genius.birth_place}</span>
        </div>

        {/* Zodiac if available */}
        {genius.zodiac_sign && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs">
              ♈ {genius.zodiac_sign}
            </Badge>
          </div>
        )}

        {/* Living-person signal */}
        {!genius.death_date && !genius.is_fictional && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-600">
              Living public figure
            </Badge>
          </div>
        )}

        {/* View Profile Button */}
        <div className="pt-2">
          <div className="w-full py-2 px-4 bg-gradient-to-r from-[#395192] to-[#06b6d4] text-white rounded-lg text-sm font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Full Profile
          </div>
        </div>
      </CardContent>
    </Card>
  );
}