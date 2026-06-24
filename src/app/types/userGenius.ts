// User Genius Profile Extensions
// Extends the existing user system with genius-style profiles

export interface UserGeniusFields {
  // Intelligence Metrics
  iq_score: number | null;
  intelligence_score: number | null; // Composite calculated score (0-1000)
  genius_rank: number | null; // Platform-wide ranking

  // Personal Info
  zodiac_sign: string | null;
  birth_place: string | null;
  birth_date: string | null;

  // Profile Content
  short_bio: string | null; // 280 character bio
  long_bio: string | null; // Full biography
  profile_banner_url: string | null;

  // Personality & Learning
  personality_type: string | null; // MBTI (e.g., "INTJ")
  learning_style: string | null; // Visual, Auditory, Kinesthetic, Reading/Writing
  intelligence_categories: string[]; // Multiple intelligences

  // Privacy
  public_profile: boolean; // Allow profile to be discovered
  show_iq_score: boolean; // Display IQ publicly
  show_rankings: boolean; // Display rank publicly
}

export interface UserExpertise {
  id: string;
  user_id: string;
  expertise: string;
  proficiency_level: number; // 1-10
  verified: boolean; // Verified through certifications
  earned_from: string; // Course ID or test ID
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: 'Course' | 'Test' | 'Challenge' | 'Milestone' | 'Social' | 'Custom';
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earned_date: string;
  public: boolean;
  points: number; // XP/points awarded
}

export interface UserContribution {
  id: string;
  user_id: string;
  contribution_type: 'Discussion' | 'Resource' | 'Tutorial' | 'Research' | 'Project';
  title: string;
  description: string;
  url: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface UserIntelligenceHistory {
  id: string;
  user_id: string;
  metric_type: 'IQ Test' | 'Course Performance' | 'Problem Solving' | 'Memory' | 'Logical Reasoning';
  score: number;
  max_score: number;
  test_date: string;
  context: string; // Which test, course, or assessment
}

export interface UserFollows {
  id: string;
  follower_id: string; // User doing the following
  following_id: string; // User or Genius being followed
  following_type: 'User' | 'Genius';
  created_at: string;
}

export interface UserSavedContent {
  id: string;
  user_id: string;
  content_type: 'Genius' | 'Course' | 'Lesson' | 'User' | 'Discussion';
  content_id: string;
  created_at: string;
}

// Composite User Genius Profile
export interface UserGeniusProfile {
  // Existing user fields would be here
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;

  // Genius extensions
  genius_fields: UserGeniusFields;
  expertise: UserExpertise[];
  achievements: UserAchievement[];
  contributions: UserContribution[];
  intelligence_history: UserIntelligenceHistory[];

  // Social stats
  follower_count: number;
  following_count: number;
  course_completion_count: number;
  total_xp: number;
}

// Intelligence Score Factors
export interface IntelligenceFactors {
  iq_score: number; // Weight: 30%
  course_completion: number; // Weight: 20%
  test_performance: number; // Weight: 20%
  problem_solving: number; // Weight: 15%
  contribution_quality: number; // Weight: 10%
  engagement_level: number; // Weight: 5%
}

// User Profile Statistics
export interface UserProfileStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_achievements: number;
  rare_achievements: number;
  intelligence_growth: number; // Percentage growth
  global_rank: number | null;
  category_ranks: Record<string, number>; // Rank per expertise category
  avg_test_score: number;
  total_xp: number;
  streak_days: number;
}

// User Search Filters
export interface UserSearchFilters {
  query?: string;
  iq_min?: number;
  iq_max?: number;
  expertise?: string[];
  personality_types?: string[];
  intelligence_score_min?: number;
  rank_max?: number; // Top N users
  sort_by?: 'intelligence' | 'rank' | 'xp' | 'courses' | 'recent';
  sort_order?: 'asc' | 'desc';
  public_only?: boolean;
}

// Multiple Intelligence Categories (Gardner's Theory)
export type MultipleIntelligence =
  | 'Logical-Mathematical'
  | 'Linguistic-Verbal'
  | 'Visual-Spatial'
  | 'Musical-Rhythmic'
  | 'Bodily-Kinesthetic'
  | 'Interpersonal'
  | 'Intrapersonal'
  | 'Naturalistic'
  | 'Existential';

// Learning Styles
export type LearningStyle =
  | 'Visual'
  | 'Auditory'
  | 'Kinesthetic'
  | 'Reading/Writing'
  | 'Mixed';

// MBTI Personality Types
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
