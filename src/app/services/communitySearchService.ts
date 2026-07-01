import { Genius, GeniusEra } from '../types/genius';
import { UserGeniusProfile } from '../types/userGenius';
import { getAllGeniuses } from './geniusService';

/**
 * Community Search Service
 * Provides advanced search and filtering for both historical geniuses and user profiles
 */

export interface CombinedProfile {
  id: string;
  type: 'genius' | 'user';
  full_name: string;
  iq_score: number | null;
  intelligence_score: number | null;
  avatar_url: string | null;
  short_description: string;
  expertise: string[];
  era?: GeniusEra;
  zodiac_sign: string | null;
  birth_place: string | null;
  is_historical: boolean;
  follower_count?: number;
  achievements_count?: number;
  personality_type?: string | null;
}

export interface CommunitySearchFilters {
  query?: string;
  iq_min?: number;
  iq_max?: number;
  intelligence_min?: number;
  intelligence_max?: number;
  expertise?: string[];
  eras?: GeniusEra[];
  personality_types?: string[];
  zodiac_signs?: string[];
  profile_type?: 'all' | 'historical' | 'users';
  sort_by?: 'relevance' | 'iq' | 'intelligence' | 'name' | 'popular';
  sort_order?: 'asc' | 'desc';
}

export interface CategoryStats {
  category: string;
  count: number;
  avg_iq: number;
  top_profiles: CombinedProfile[];
}

/**
 * Convert Genius to CombinedProfile
 */
function geniusToCombinedProfile(genius: Genius): CombinedProfile {
  return {
    id: genius.id,
    type: 'genius',
    full_name: genius.full_name,
    iq_score: genius.iq_score,
    intelligence_score: null,
    avatar_url: genius.profile_image_url,
    short_description: genius.short_description,
    expertise: [], // Would be populated from genius expertise data
    era: genius.era,
    zodiac_sign: genius.zodiac_sign,
    birth_place: genius.birth_place,
    is_historical: genius.is_historical,
    achievements_count: 0,
    personality_type: null
  };
}

/**
 * Convert UserGeniusProfile to CombinedProfile
 */
function userToCombinedProfile(user: UserGeniusProfile): CombinedProfile {
  return {
    id: user.id,
    type: 'user',
    full_name: user.full_name,
    iq_score: user.genius_fields.iq_score,
    intelligence_score: user.genius_fields.intelligence_score,
    avatar_url: user.avatar_url,
    short_description: user.genius_fields.short_bio || 'CerebroLearn member',
    expertise: user.expertise.map(e => e.expertise),
    zodiac_sign: user.genius_fields.zodiac_sign,
    birth_place: user.genius_fields.birth_place,
    is_historical: false,
    follower_count: user.follower_count,
    achievements_count: user.achievements.length,
    personality_type: user.genius_fields.personality_type
  };
}

/**
 * Get all profiles (geniuses + users)
 */
export function getAllProfiles(userProfiles: UserGeniusProfile[] = []): CombinedProfile[] {
  const geniuses = getAllGeniuses().map(geniusToCombinedProfile);
  const users = userProfiles.map(userToCombinedProfile);
  return [...geniuses, ...users];
}

/**
 * Search profiles with advanced filters
 */
export function searchCommunity(
  filters: CommunitySearchFilters,
  userProfiles: UserGeniusProfile[] = []
): CombinedProfile[] {
  let results = getAllProfiles(userProfiles);

  // Filter by profile type
  if (filters.profile_type === 'historical') {
    results = results.filter(p => p.type === 'genius');
  } else if (filters.profile_type === 'users') {
    results = results.filter(p => p.type === 'user');
  }

  // Text search
  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase();
    results = results.filter(
      p =>
        p.full_name.toLowerCase().includes(query) ||
        p.short_description.toLowerCase().includes(query) ||
        p.birth_place?.toLowerCase().includes(query) ||
        p.expertise.some(e => e.toLowerCase().includes(query))
    );
  }

  // IQ range filter
  if (filters.iq_min !== undefined) {
    results = results.filter(p => p.iq_score !== null && p.iq_score >= filters.iq_min!);
  }
  if (filters.iq_max !== undefined) {
    results = results.filter(p => p.iq_score !== null && p.iq_score <= filters.iq_max!);
  }

  // Intelligence score range filter (for users)
  if (filters.intelligence_min !== undefined) {
    results = results.filter(
      p => p.intelligence_score !== null && p.intelligence_score >= filters.intelligence_min!
    );
  }
  if (filters.intelligence_max !== undefined) {
    results = results.filter(
      p => p.intelligence_score !== null && p.intelligence_score <= filters.intelligence_max!
    );
  }

  // Expertise filter
  if (filters.expertise && filters.expertise.length > 0) {
    results = results.filter(p =>
      filters.expertise!.some(exp => p.expertise.some(e => e.toLowerCase().includes(exp.toLowerCase())))
    );
  }

  // Era filter (for geniuses)
  if (filters.eras && filters.eras.length > 0) {
    results = results.filter(p => p.era && filters.eras!.includes(p.era));
  }

  // Personality type filter
  if (filters.personality_types && filters.personality_types.length > 0) {
    results = results.filter(
      p => p.personality_type && filters.personality_types!.includes(p.personality_type)
    );
  }

  // Zodiac sign filter
  if (filters.zodiac_signs && filters.zodiac_signs.length > 0) {
    results = results.filter(
      p => p.zodiac_sign && filters.zodiac_signs!.includes(p.zodiac_sign)
    );
  }

  // Sort results
  const sortBy = filters.sort_by || 'relevance';
  const sortOrder = filters.sort_order || 'desc';

  results.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'iq':
        comparison = (a.iq_score || 0) - (b.iq_score || 0);
        break;
      case 'intelligence':
        comparison = (a.intelligence_score || 0) - (b.intelligence_score || 0);
        break;
      case 'name':
        comparison = a.full_name.localeCompare(b.full_name);
        break;
      case 'popular':
        comparison = (a.follower_count || 0) - (b.follower_count || 0);
        break;
      case 'relevance':
      default:
        // For relevance, prioritize by IQ/intelligence score
        const aScore = a.intelligence_score || a.iq_score || 0;
        const bScore = b.intelligence_score || b.iq_score || 0;
        comparison = aScore - bScore;
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return results;
}

/**
 * Get top profiles by IQ
 */
export function getTopByIQ(
  limit: number = 10,
  userProfiles: UserGeniusProfile[] = []
): CombinedProfile[] {
  const profiles = getAllProfiles(userProfiles);
  return profiles
    .filter(p => p.iq_score !== null)
    .sort((a, b) => (b.iq_score || 0) - (a.iq_score || 0))
    .slice(0, limit);
}

/**
 * Get top profiles by intelligence score (users only)
 */
export function getTopByIntelligence(
  limit: number = 10,
  userProfiles: UserGeniusProfile[] = []
): CombinedProfile[] {
  const profiles = getAllProfiles(userProfiles).filter(p => p.type === 'user');
  return profiles
    .filter(p => p.intelligence_score !== null)
    .sort((a, b) => (b.intelligence_score || 0) - (a.intelligence_score || 0))
    .slice(0, limit);
}

/**
 * Get rising stars (users with high intelligence growth)
 * For now, returns top users by intelligence score
 */
export function getRisingStars(
  limit: number = 10,
  userProfiles: UserGeniusProfile[] = []
): CombinedProfile[] {
  return getTopByIntelligence(limit, userProfiles);
}

/**
 * Get trending profiles (most followed/popular)
 */
export function getTrendingProfiles(
  limit: number = 10,
  userProfiles: UserGeniusProfile[] = []
): CombinedProfile[] {
  const profiles = getAllProfiles(userProfiles);
  return profiles
    .sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0))
    .slice(0, limit);
}

/**
 * Get category statistics
 */
export function getCategoryStats(userProfiles: UserGeniusProfile[] = []): CategoryStats[] {
  const categories: Record<string, { profiles: CombinedProfile[]; total_iq: number }> = {};

  const allProfiles = getAllProfiles(userProfiles);

  allProfiles.forEach(profile => {
    profile.expertise.forEach(exp => {
      if (!categories[exp]) {
        categories[exp] = { profiles: [], total_iq: 0 };
      }
      categories[exp].profiles.push(profile);
      categories[exp].total_iq += profile.iq_score || 0;
    });
  });

  return Object.entries(categories).map(([category, data]) => ({
    category,
    count: data.profiles.length,
    avg_iq: data.count > 0 ? Math.round(data.total_iq / data.count) : 0,
    top_profiles: data.profiles
      .sort((a, b) => (b.iq_score || 0) - (a.iq_score || 0))
      .slice(0, 3)
  }));
}

/**
 * Get recommended profiles based on expertise similarity
 */
export function getRecommendedProfiles(
  userExpertise: string[],
  limit: number = 5,
  userProfiles: UserGeniusProfile[] = []
): CombinedProfile[] {
  if (userExpertise.length === 0) {
    return getTopByIQ(limit, userProfiles);
  }

  const allProfiles = getAllProfiles(userProfiles);

  // Calculate similarity score
  const scored = allProfiles.map(profile => {
    const commonExpertise = profile.expertise.filter(e =>
      userExpertise.some(ue => e.toLowerCase().includes(ue.toLowerCase()))
    );
    return {
      profile,
      similarity: commonExpertise.length
    };
  });

  return scored
    .filter(s => s.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(s => s.profile);
}

/**
 * Get community statistics
 */
export function getCommunityStats(userProfiles: UserGeniusProfile[] = []) {
  const allProfiles = getAllProfiles(userProfiles);
  const geniuses = allProfiles.filter(p => p.type === 'genius');
  const users = allProfiles.filter(p => p.type === 'user');

  const avgIQ =
    allProfiles.filter(p => p.iq_score !== null).reduce((sum, p) => sum + (p.iq_score || 0), 0) /
      allProfiles.filter(p => p.iq_score !== null).length || 0;

  const avgIntelligence =
    users.filter(p => p.intelligence_score !== null).reduce((sum, p) => sum + (p.intelligence_score || 0), 0) /
      users.filter(p => p.intelligence_score !== null).length || 0;

  return {
    total_profiles: allProfiles.length,
    total_geniuses: geniuses.length,
    total_users: users.length,
    avg_iq: Math.round(avgIQ),
    avg_intelligence: Math.round(avgIntelligence),
    total_expertise_areas: new Set(allProfiles.flatMap(p => p.expertise)).size
  };
}
