import {
  Genius,
  GeniusEra,
  GeniusProfileType,
  GeniusProfile,
  GeniusSearchFilters,
  GeniusSearchResult
} from '../types/genius';
import {
  geniuses,
  getGeniusById,
  getGeniusExpertise,
  getGeniusAchievements,
  getGeniusContributions
} from '../data/geniusData';
import { publicGeniusApi } from '../../../utils/api-client';

export async function fetchPublishedGeniuses(): Promise<Genius[]> {
  const res = await publicGeniusApi.list();
  return res.items.map(r => ({
    id: r.id,
    slug: r.slug,
    full_name: r.full_name,
    iq_score: r.iq_score,
    iq_score_label: r.iq_score_label,
    iq_score_note: r.iq_score_note,
    birth_date: r.birth_date,
    death_date: r.death_date,
    birth_place: r.birth_place,
    zodiac_sign: r.zodiac_sign,
    profile_image_url: r.profile_image_url ?? null,
    banner_image_url: r.banner_image_url ?? null,
    image_attribution: r.image_attribution ?? null,
    biography: r.biography,
    short_description: r.short_description,
    era: r.era as GeniusEra,
    profile_type: r.profile_type as GeniusProfileType,
    is_historical: r.is_historical,
    is_fictional: r.is_fictional,
    source_url: r.source_url,
    editorial_note: r.editorial_note,
    publication_status: r.publication_status,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
}

export const GENIUS_PROFILE_DRAFTS_KEY = 'cerebrolearn.genius.profileDrafts';

/**
 * Genius Service
 * Provides methods for searching, filtering, and retrieving genius data
 */

function getStoredProfileDrafts(): Record<string, Genius> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(GENIUS_PROFILE_DRAFTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredProfileDrafts(drafts: Record<string, Genius>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GENIUS_PROFILE_DRAFTS_KEY, JSON.stringify(drafts));
}

// Get seed profiles without admin draft overrides.
export function getGeniusSeedProfiles(): Genius[] {
  return [...geniuses];
}

// Get all geniuses, including frontend admin draft overrides.
export function getAllGeniuses(): Genius[] {
  const drafts = getStoredProfileDrafts();
  const byId = new Map(geniuses.map((genius) => [genius.id, genius]));

  Object.values(drafts).forEach((draft) => {
    byId.set(draft.id, draft);
  });

  return Array.from(byId.values());
}

export function getGeniusProfileDrafts(): Genius[] {
  return Object.values(getStoredProfileDrafts());
}

export function saveGeniusProfileDraft(profile: Genius): Genius {
  const drafts = getStoredProfileDrafts();
  const nextProfile = {
    ...profile,
    updated_at: new Date().toISOString(),
  };
  drafts[nextProfile.id] = nextProfile;
  setStoredProfileDrafts(drafts);
  return nextProfile;
}

export function deleteGeniusProfileDraft(id: string): void {
  const drafts = getStoredProfileDrafts();
  delete drafts[id];
  setStoredProfileDrafts(drafts);
}

export function resetGeniusProfileDrafts(): void {
  setStoredProfileDrafts({});
}

export function getProfileTypeLabel(profileType: GeniusProfileType): string {
  switch (profileType) {
    case 'historical':
      return 'Historical';
    case 'fictional':
      return 'Fictional';
    case 'public_intellectual':
      return 'Public intellectual';
    default:
      return 'Profile';
  }
}

// Get genius with full profile data
export function getGeniusProfile(id: string): GeniusProfile | null {
  const genius = getAllGeniuses().find((profile) => profile.id === id || profile.slug === id) ?? getGeniusById(id);
  if (!genius) return null;

  return {
    ...genius,
    expertise: getGeniusExpertise(id),
    achievements: getGeniusAchievements(id),
    personality_traits: [],
    contributions: getGeniusContributions(id),
    relationships: [],
    categories: []
  };
}

// Search geniuses with filters
export function searchGeniuses(filters: GeniusSearchFilters): GeniusSearchResult[] {
  let results = getAllGeniuses().filter((genius) => genius.publication_status === 'published');

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(genius =>
      genius.full_name.toLowerCase().includes(query) ||
      genius.short_description.toLowerCase().includes(query) ||
      genius.biography.toLowerCase().includes(query) ||
      genius.birth_place.toLowerCase().includes(query) ||
      genius.profile_type.replace('_', ' ').includes(query)
    );
  }

  // IQ range filter
  if (filters.iq_min !== undefined) {
    results = results.filter(genius => genius.iq_score && genius.iq_score >= filters.iq_min!);
  }
  if (filters.iq_max !== undefined) {
    results = results.filter(genius => genius.iq_score && genius.iq_score <= filters.iq_max!);
  }

  // Era filter
  if (filters.eras && filters.eras.length > 0) {
    results = results.filter(genius => filters.eras!.includes(genius.era));
  }

  if (filters.profile_types && filters.profile_types.length > 0) {
    results = results.filter(genius => filters.profile_types!.includes(genius.profile_type));
  }

  if (filters.expertise && filters.expertise.length > 0) {
    const expertiseTerms = filters.expertise.map((item) => item.toLowerCase());
    results = results.filter((genius) =>
      getGeniusExpertise(genius.id).some((item) =>
        expertiseTerms.includes(item.expertise.toLowerCase())
      )
    );
  }

  // Birth year filter
  if (filters.birth_year_min !== undefined || filters.birth_year_max !== undefined) {
    results = results.filter(genius => {
      if (!genius.birth_date) return false;
      const birthYear = parseInt(genius.birth_date.split('-')[0]);
      const min = filters.birth_year_min ?? -Infinity;
      const max = filters.birth_year_max ?? Infinity;
      return birthYear >= min && birthYear <= max;
    });
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
      case 'name':
        comparison = a.full_name.localeCompare(b.full_name);
        break;
      case 'birth_date':
        comparison = (a.birth_date || '').localeCompare(b.birth_date || '');
        break;
      default:
        // Relevance sorting (by IQ score as proxy)
        comparison = (a.iq_score || 0) - (b.iq_score || 0);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Convert to search results
  return results.map(genius => ({
    genius,
    score: 1.0,
    matched_fields: ['full_name']
  }));
}

// Get top geniuses by IQ
export function getTopGeniusesByIQ(limit: number = 10): Genius[] {
  return getAllGeniuses()
    .filter((g) => g.publication_status === 'published')
    .filter(g => g.iq_score !== null)
    .sort((a, b) => (b.iq_score || 0) - (a.iq_score || 0))
    .slice(0, limit);
}

// Get geniuses by era
export function getGeniusesByEra(era: string): Genius[] {
  return getAllGeniuses().filter(g => g.era === era && g.publication_status === 'published');
}

// Get random geniuses
export function getRandomGeniuses(count: number = 6): Genius[] {
  const shuffled = getAllGeniuses()
    .filter((g) => g.publication_status === 'published')
    .sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get genius statistics
export function getGeniusStatistics() {
  const published = getAllGeniuses().filter((g) => g.publication_status === 'published');
  const total = published.length;
  const iqProfiles = published.filter((g) => g.iq_score !== null);
  const avgIQ = iqProfiles.length
    ? iqProfiles.reduce((sum, g) => sum + (g.iq_score || 0), 0) / iqProfiles.length
    : 0;
  const historical = published.filter(g => g.profile_type === 'historical').length;
  const contemporary = published.filter(g => g.era === 'Contemporary').length;
  const fictional = published.filter(g => g.profile_type === 'fictional').length;
  const publicIntellectuals = published.filter(g => g.profile_type === 'public_intellectual').length;

  const eraDistribution = published.reduce((acc, g) => {
    acc[g.era] = (acc[g.era] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    avgIQ: Math.round(avgIQ),
    historical,
    contemporary,
    fictional,
    publicIntellectuals,
    eraDistribution
  };
}
