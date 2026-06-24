import {
  UserGeniusProfile,
  UserGeniusFields,
  UserExpertise,
  UserAchievement,
  UserContribution,
  UserIntelligenceHistory,
  UserProfileStats,
  UserSearchFilters
} from '../types/userGenius';
import { calculateIntelligenceScore, calculateGeniusRank } from './intelligenceScoring';

/**
 * User Genius Service
 * Manages user genius profiles, achievements, expertise, and rankings
 * Uses localStorage for offline functionality
 */

const STORAGE_KEYS = {
  USER_GENIUS_FIELDS: 'cerebrolearn_user_genius_fields',
  USER_EXPERTISE: 'cerebrolearn_user_expertise',
  USER_ACHIEVEMENTS: 'cerebrolearn_user_achievements',
  USER_CONTRIBUTIONS: 'cerebrolearn_user_contributions',
  USER_INTELLIGENCE_HISTORY: 'cerebrolearn_user_intelligence_history',
  USER_FOLLOWS: 'cerebrolearn_user_follows',
  USER_SAVED_CONTENT: 'cerebrolearn_user_saved_content'
};

/**
 * Get user genius fields
 */
export function getUserGeniusFields(userId: string): UserGeniusFields {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_GENIUS_FIELDS);
  const allFields = stored ? JSON.parse(stored) : {};

  return allFields[userId] || {
    iq_score: null,
    intelligence_score: null,
    genius_rank: null,
    zodiac_sign: null,
    birth_place: null,
    birth_date: null,
    short_bio: null,
    long_bio: null,
    profile_banner_url: null,
    personality_type: null,
    learning_style: null,
    intelligence_categories: [],
    public_profile: true,
    show_iq_score: true,
    show_rankings: true
  };
}

/**
 * Update user genius fields
 */
export function updateUserGeniusFields(userId: string, fields: Partial<UserGeniusFields>): void {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_GENIUS_FIELDS);
  const allFields = stored ? JSON.parse(stored) : {};

  allFields[userId] = {
    ...getUserGeniusFields(userId),
    ...fields
  };

  localStorage.setItem(STORAGE_KEYS.USER_GENIUS_FIELDS, JSON.stringify(allFields));
}

/**
 * Get user expertise
 */
export function getUserExpertise(userId: string): UserExpertise[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_EXPERTISE);
  const allExpertise = stored ? JSON.parse(stored) : [];
  return allExpertise.filter((e: UserExpertise) => e.user_id === userId);
}

/**
 * Add user expertise
 */
export function addUserExpertise(expertise: Omit<UserExpertise, 'id' | 'created_at' | 'updated_at'>): UserExpertise {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_EXPERTISE);
  const allExpertise = stored ? JSON.parse(stored) : [];

  const newExpertise: UserExpertise = {
    ...expertise,
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  allExpertise.push(newExpertise);
  localStorage.setItem(STORAGE_KEYS.USER_EXPERTISE, JSON.stringify(allExpertise));

  return newExpertise;
}

/**
 * Get user achievements
 */
export function getUserAchievements(userId: string): UserAchievement[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
  const allAchievements = stored ? JSON.parse(stored) : [];
  return allAchievements.filter((a: UserAchievement) => a.user_id === userId);
}

/**
 * Award achievement to user
 */
export function awardAchievement(achievement: Omit<UserAchievement, 'id' | 'earned_date'>): UserAchievement {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_ACHIEVEMENTS);
  const allAchievements = stored ? JSON.parse(stored) : [];

  const newAchievement: UserAchievement = {
    ...achievement,
    id: `ach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    earned_date: new Date().toISOString()
  };

  allAchievements.push(newAchievement);
  localStorage.setItem(STORAGE_KEYS.USER_ACHIEVEMENTS, JSON.stringify(allAchievements));

  return newAchievement;
}

/**
 * Get user contributions
 */
export function getUserContributions(userId: string): UserContribution[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_CONTRIBUTIONS);
  const allContributions = stored ? JSON.parse(stored) : [];
  return allContributions.filter((c: UserContribution) => c.user_id === userId);
}

/**
 * Get user intelligence history
 */
export function getUserIntelligenceHistory(userId: string): UserIntelligenceHistory[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_INTELLIGENCE_HISTORY);
  const allHistory = stored ? JSON.parse(stored) : [];
  return allHistory.filter((h: UserIntelligenceHistory) => h.user_id === userId);
}

/**
 * Record intelligence metric
 */
export function recordIntelligenceMetric(
  metric: Omit<UserIntelligenceHistory, 'id' | 'test_date'>
): UserIntelligenceHistory {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_INTELLIGENCE_HISTORY);
  const allHistory = stored ? JSON.parse(stored) : [];

  const newMetric: UserIntelligenceHistory = {
    ...metric,
    id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    test_date: new Date().toISOString()
  };

  allHistory.push(newMetric);
  localStorage.setItem(STORAGE_KEYS.USER_INTELLIGENCE_HISTORY, JSON.stringify(allHistory));

  return newMetric;
}

/**
 * Calculate user profile statistics
 */
export function calculateUserStats(userId: string): UserProfileStats {
  // This would integrate with existing course/enrollment data
  // For now, return mock stats
  const achievements = getUserAchievements(userId);
  const intelligenceHistory = getUserIntelligenceHistory(userId);

  const rareAchievements = achievements.filter(
    a => a.rarity === 'rare' || a.rarity === 'epic' || a.rarity === 'legendary'
  ).length;

  const avgTestScore = intelligenceHistory.length > 0
    ? intelligenceHistory.reduce((sum, h) => sum + (h.score / h.max_score) * 100, 0) / intelligenceHistory.length
    : 0;

  return {
    total_courses: 5,
    completed_courses: 3,
    in_progress_courses: 2,
    total_achievements: achievements.length,
    rare_achievements: rareAchievements,
    intelligence_growth: 0,
    global_rank: null,
    category_ranks: {},
    avg_test_score: Math.round(avgTestScore),
    total_xp: achievements.reduce((sum, a) => sum + a.points, 0),
    streak_days: 7
  };
}

/**
 * Get complete user genius profile
 */
export function getUserGeniusProfile(userId: string, userName: string, userEmail: string): UserGeniusProfile {
  const genius_fields = getUserGeniusFields(userId);
  const expertise = getUserExpertise(userId);
  const achievements = getUserAchievements(userId);
  const contributions = getUserContributions(userId);
  const intelligence_history = getUserIntelligenceHistory(userId);
  const stats = calculateUserStats(userId);

  // Calculate intelligence score
  const intelligenceScore = calculateIntelligenceScore(
    { genius_fields, expertise, achievements, contributions, intelligence_history },
    stats
  );

  // Update stored intelligence score
  updateUserGeniusFields(userId, { intelligence_score: intelligenceScore });

  return {
    id: userId,
    email: userEmail,
    full_name: userName,
    avatar_url: null,
    genius_fields: { ...genius_fields, intelligence_score: intelligenceScore },
    expertise,
    achievements,
    contributions,
    intelligence_history,
    follower_count: 0,
    following_count: 0,
    course_completion_count: stats.completed_courses,
    total_xp: stats.total_xp
  };
}

/**
 * Initialize demo user genius profile
 */
export function initializeDemoUserProfile(userId: string): void {
  const existingFields = getUserGeniusFields(userId);
  if (existingFields.iq_score !== null) return; // Already initialized

  // Set basic fields
  updateUserGeniusFields(userId, {
    iq_score: 145,
    zodiac_sign: 'Aquarius',
    birth_place: 'San Francisco, CA, USA',
    short_bio: 'Passionate learner exploring AI, mathematics, and cognitive science. On a journey to maximize human potential through technology.',
    personality_type: 'INTJ',
    learning_style: 'Visual',
    intelligence_categories: ['Logical-Mathematical', 'Visual-Spatial', 'Intrapersonal'],
    public_profile: true,
    show_iq_score: true,
    show_rankings: true
  });

  // Add expertise
  addUserExpertise({
    user_id: userId,
    expertise: 'Computer Science',
    proficiency_level: 8,
    verified: true,
    earned_from: 'course-1'
  });

  addUserExpertise({
    user_id: userId,
    expertise: 'Mathematics',
    proficiency_level: 7,
    verified: false,
    earned_from: 'course-2'
  });

  addUserExpertise({
    user_id: userId,
    expertise: 'Artificial Intelligence',
    proficiency_level: 6,
    verified: true,
    earned_from: 'course-3'
  });

  // Award achievements
  awardAchievement({
    user_id: userId,
    achievement_type: 'Course',
    title: 'First Course Completed',
    description: 'Completed your first course on CerebroLearn',
    icon: '🎓',
    rarity: 'common',
    public: true,
    points: 100
  });

  awardAchievement({
    user_id: userId,
    achievement_type: 'Test',
    title: 'IQ Test Genius',
    description: 'Scored 140+ on an IQ test',
    icon: '🧠',
    rarity: 'rare',
    public: true,
    points: 500
  });

  awardAchievement({
    user_id: userId,
    achievement_type: 'Milestone',
    title: 'Rising Star',
    description: 'Reached intelligence score of 500+',
    icon: '⭐',
    rarity: 'uncommon',
    public: true,
    points: 250
  });

  // Record intelligence history
  recordIntelligenceMetric({
    user_id: userId,
    metric_type: 'IQ Test',
    score: 145,
    max_score: 200,
    context: 'Initial IQ Assessment'
  });

  recordIntelligenceMetric({
    user_id: userId,
    metric_type: 'Course Performance',
    score: 92,
    max_score: 100,
    context: 'Introduction to AI - Final Exam'
  });
}

/**
 * Search users with filters
 */
export function searchUsers(filters: UserSearchFilters): any[] {
  // This would search across all users in the system
  // For now, return empty array as we don't have multi-user data
  return [];
}

/**
 * Get top users by intelligence score
 */
export function getTopUsers(limit: number = 10): any[] {
  // This would return leaderboard
  // For now, return empty array
  return [];
}
