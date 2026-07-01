// Genius Database Type Definitions

export interface Genius {
  id: string;
  slug: string;
  full_name: string;
  iq_score: number | null;
  iq_score_label: string;
  iq_score_note: string;
  birth_date: string | null; // ISO date string
  death_date: string | null; // ISO date string
  birth_place: string;
  zodiac_sign: string | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  image_attribution: string | null;
  biography: string;
  short_description: string; // 280 character bio
  era: GeniusEra;
  profile_type: GeniusProfileType;
  is_historical: boolean;
  is_fictional: boolean;
  source_url: string | null;
  editorial_note: string;
  publication_status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export type GeniusProfileType =
  | 'historical'
  | 'fictional'
  | 'public_intellectual';

export type GeniusEra =
  | 'Ancient'
  | 'Classical'
  | 'Medieval'
  | 'Renaissance'
  | 'Enlightenment'
  | 'Industrial'
  | 'Modern'
  | 'Contemporary';

export interface GeniusExpertise {
  id: string;
  genius_id: string;
  expertise: string;
  proficiency_level: number; // 1-10
}

export interface GeniusAchievement {
  id: string;
  genius_id: string;
  title: string;
  description: string;
  year: number | null;
  category: AchievementCategory;
}

export type AchievementCategory =
  | 'Discovery'
  | 'Invention'
  | 'Theory'
  | 'Award'
  | 'Publication'
  | 'Leadership';

export interface GeniusPersonalityTrait {
  id: string;
  genius_id: string;
  trait: string;
  category: TraitCategory;
}

export type TraitCategory =
  | 'MBTI'
  | 'Big5'
  | 'Characteristic'
  | 'Working Style';

export interface GeniusContribution {
  id: string;
  genius_id: string;
  field: string;
  contribution: string;
  impact_score: number; // 1-10
  year: number | null;
}

export interface GeniusRelationship {
  id: string;
  genius_id: string;
  related_genius_id: string;
  relationship_type: RelationshipType;
  description: string | null;
}

export type RelationshipType =
  | 'Teacher'
  | 'Student'
  | 'Colleague'
  | 'Rival'
  | 'Collaborator'
  | 'Influenced By'
  | 'Influenced';

export interface GeniusCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Composite type with all related data
export interface GeniusProfile extends Genius {
  expertise: GeniusExpertise[];
  achievements: GeniusAchievement[];
  personality_traits: GeniusPersonalityTrait[];
  contributions: GeniusContribution[];
  relationships: GeniusRelationship[];
  categories: string[];
}

// Search and filter types
export interface GeniusSearchFilters {
  query?: string;
  iq_min?: number;
  iq_max?: number;
  profile_types?: GeniusProfileType[];
  expertise?: string[];
  personality_types?: string[];
  eras?: GeniusEra[];
  categories?: string[];
  birth_year_min?: number;
  birth_year_max?: number;
  sort_by?: 'relevance' | 'iq' | 'name' | 'birth_date' | 'impact';
  sort_order?: 'asc' | 'desc';
}

export interface GeniusSearchResult {
  genius: Genius;
  score: number; // Relevance score
  matched_fields: string[];
}
