/**
 * Achievement System Service
 * Manages achievement definitions, tracking, unlocking, and rewards
 */

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'learning' | 'skill' | 'intelligence' | 'social' | 'consistency' | 'competition' | 'special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  criteria: AchievementCriteria;
  rewardPoints: number;
  rewardBadge?: string;
  isHidden: boolean; // Easter egg achievements
}

export interface AchievementCriteria {
  type: 'count' | 'streak' | 'threshold' | 'specific';
  metric: string; // e.g., 'courses_completed', 'login_streak', 'iq_score'
  target: number;
  condition?: 'gte' | 'lte' | 'eq'; // greater/less than or equal, equals
}

export interface UserAchievementProgress {
  id: string;
  userId: string;
  achievementId: string;
  progress: number; // 0-100
  currentValue: number;
  targetValue: number;
  unlocked: boolean;
  unlockedAt: string | null;
  notified: boolean;
}

const STORAGE_KEYS = {
  ACHIEVEMENTS: 'cerebrolearn_achievements',
  USER_PROGRESS: 'cerebrolearn_user_achievement_progress'
};

// Predefined achievements
export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Learning Milestones
  {
    id: 'first-course',
    title: 'First Steps',
    description: 'Complete your first course',
    icon: '🎓',
    rarity: 'common',
    category: 'learning',
    criteria: { type: 'count', metric: 'courses_completed', target: 1, condition: 'gte' },
    rewardPoints: 100,
    isHidden: false
  },
  {
    id: 'five-courses',
    title: 'Knowledge Seeker',
    description: 'Complete 5 courses',
    icon: '📚',
    rarity: 'uncommon',
    category: 'learning',
    criteria: { type: 'count', metric: 'courses_completed', target: 5, condition: 'gte' },
    rewardPoints: 500,
    isHidden: false
  },
  {
    id: 'ten-courses',
    title: 'Scholar',
    description: 'Complete 10 courses',
    icon: '🎖️',
    rarity: 'rare',
    category: 'learning',
    criteria: { type: 'count', metric: 'courses_completed', target: 10, condition: 'gte' },
    rewardPoints: 1000,
    isHidden: false
  },
  {
    id: 'master-learner',
    title: 'Master Learner',
    description: 'Complete 25 courses',
    icon: '👑',
    rarity: 'epic',
    category: 'learning',
    criteria: { type: 'count', metric: 'courses_completed', target: 25, condition: 'gte' },
    rewardPoints: 2500,
    isHidden: false
  },

  // Skill Mastery
  {
    id: 'skill-novice',
    title: 'Skill Novice',
    description: 'Reach level 5 in any skill',
    icon: '⭐',
    rarity: 'common',
    category: 'skill',
    criteria: { type: 'threshold', metric: 'max_skill_level', target: 5, condition: 'gte' },
    rewardPoints: 200,
    isHidden: false
  },
  {
    id: 'skill-expert',
    title: 'Skill Expert',
    description: 'Reach level 8 in any skill',
    icon: '🌟',
    rarity: 'rare',
    category: 'skill',
    criteria: { type: 'threshold', metric: 'max_skill_level', target: 8, condition: 'gte' },
    rewardPoints: 800,
    isHidden: false
  },
  {
    id: 'skill-master',
    title: 'Skill Master',
    description: 'Reach level 10 in any skill',
    icon: '💎',
    rarity: 'legendary',
    category: 'skill',
    criteria: { type: 'threshold', metric: 'max_skill_level', target: 10, condition: 'gte' },
    rewardPoints: 5000,
    isHidden: false
  },

  // Intelligence Growth
  {
    id: 'iq-genius',
    title: 'Certified Genius',
    description: 'Score 140+ on an IQ test',
    icon: '🧠',
    rarity: 'rare',
    category: 'intelligence',
    criteria: { type: 'threshold', metric: 'iq_score', target: 140, condition: 'gte' },
    rewardPoints: 1400,
    isHidden: false
  },
  {
    id: 'intelligence-500',
    title: 'Rising Star',
    description: 'Reach 500 intelligence score',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'intelligence',
    criteria: { type: 'threshold', metric: 'intelligence_score', target: 500, condition: 'gte' },
    rewardPoints: 500,
    isHidden: false
  },
  {
    id: 'intelligence-750',
    title: 'Superior Mind',
    description: 'Reach 750 intelligence score',
    icon: '🌠',
    rarity: 'rare',
    category: 'intelligence',
    criteria: { type: 'threshold', metric: 'intelligence_score', target: 750, condition: 'gte' },
    rewardPoints: 1500,
    isHidden: false
  },
  {
    id: 'intelligence-900',
    title: 'Transcendent',
    description: 'Reach 900 intelligence score',
    icon: '👁️',
    rarity: 'legendary',
    category: 'intelligence',
    criteria: { type: 'threshold', metric: 'intelligence_score', target: 900, condition: 'gte' },
    rewardPoints: 9000,
    isHidden: false
  },

  // Social Achievements
  {
    id: 'first-follower',
    title: 'Making Connections',
    description: 'Get your first follower',
    icon: '👥',
    rarity: 'common',
    category: 'social',
    criteria: { type: 'count', metric: 'follower_count', target: 1, condition: 'gte' },
    rewardPoints: 50,
    isHidden: false
  },
  {
    id: 'popular',
    title: 'Popular',
    description: 'Reach 50 followers',
    icon: '🌐',
    rarity: 'rare',
    category: 'social',
    criteria: { type: 'count', metric: 'follower_count', target: 50, condition: 'gte' },
    rewardPoints: 1000,
    isHidden: false
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Reach 100 followers',
    icon: '📣',
    rarity: 'epic',
    category: 'social',
    criteria: { type: 'count', metric: 'follower_count', target: 100, condition: 'gte' },
    rewardPoints: 2000,
    isHidden: false
  },

  // Consistency Achievements
  {
    id: 'week-streak',
    title: 'Dedicated Learner',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    rarity: 'uncommon',
    category: 'consistency',
    criteria: { type: 'streak', metric: 'login_streak', target: 7, condition: 'gte' },
    rewardPoints: 350,
    isHidden: false
  },
  {
    id: 'month-streak',
    title: 'Unstoppable',
    description: 'Maintain a 30-day learning streak',
    icon: '🚀',
    rarity: 'rare',
    category: 'consistency',
    criteria: { type: 'streak', metric: 'login_streak', target: 30, condition: 'gte' },
    rewardPoints: 3000,
    isHidden: false
  },
  {
    id: 'hundred-day-streak',
    title: 'Legend',
    description: 'Maintain a 100-day learning streak',
    icon: '🏆',
    rarity: 'legendary',
    category: 'consistency',
    criteria: { type: 'streak', metric: 'login_streak', target: 100, condition: 'gte' },
    rewardPoints: 10000,
    isHidden: false
  },

  // Competition Achievements
  {
    id: 'top-100',
    title: 'Rising Through Ranks',
    description: 'Reach top 100 on the global leaderboard',
    icon: '📊',
    rarity: 'uncommon',
    category: 'competition',
    criteria: { type: 'threshold', metric: 'global_rank', target: 100, condition: 'lte' },
    rewardPoints: 500,
    isHidden: false
  },
  {
    id: 'top-10',
    title: 'Elite',
    description: 'Reach top 10 on the global leaderboard',
    icon: '🥇',
    rarity: 'epic',
    category: 'competition',
    criteria: { type: 'threshold', metric: 'global_rank', target: 10, condition: 'lte' },
    rewardPoints: 5000,
    isHidden: false
  },

  // Special/Hidden Achievements
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete a course between 2 AM and 5 AM',
    icon: '🦉',
    rarity: 'uncommon',
    category: 'special',
    criteria: { type: 'specific', metric: 'night_completion', target: 1, condition: 'gte' },
    rewardPoints: 300,
    isHidden: true
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Score 100% on 10 quizzes',
    icon: '💯',
    rarity: 'rare',
    category: 'special',
    criteria: { type: 'count', metric: 'perfect_scores', target: 10, condition: 'gte' },
    rewardPoints: 1000,
    isHidden: true
  }
];

/**
 * Initialize user achievement progress for all achievements
 */
export function initializeUserAchievements(userId: string): void {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  const allProgress = stored ? JSON.parse(stored) : {};

  if (allProgress[userId]) return; // Already initialized

  const userProgress: Record<string, UserAchievementProgress> = {};

  ALL_ACHIEVEMENTS.forEach(achievement => {
    userProgress[achievement.id] = {
      id: `progress-${userId}-${achievement.id}`,
      userId,
      achievementId: achievement.id,
      progress: 0,
      currentValue: 0,
      targetValue: achievement.criteria.target,
      unlocked: false,
      unlockedAt: null,
      notified: false
    };
  });

  allProgress[userId] = userProgress;
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));
}

/**
 * Get user's achievement progress
 */
export function getUserAchievementProgress(userId: string): UserAchievementProgress[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  const allProgress = stored ? JSON.parse(stored) : {};
  const userProgress = allProgress[userId] || {};

  return Object.values(userProgress);
}

/**
 * Get unlocked achievements for user
 */
export function getUnlockedAchievements(userId: string): Achievement[] {
  const progress = getUserAchievementProgress(userId);
  const unlockedIds = progress.filter(p => p.unlocked).map(p => p.achievementId);
  return ALL_ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id));
}

/**
 * Get locked achievements for user (excluding hidden ones if not unlocked)
 */
export function getLockedAchievements(userId: string): Achievement[] {
  const progress = getUserAchievementProgress(userId);
  const progressMap = new Map(progress.map(p => [p.achievementId, p]));

  return ALL_ACHIEVEMENTS.filter(achievement => {
    const prog = progressMap.get(achievement.id);
    const isLocked = !prog?.unlocked;
    return isLocked && !achievement.isHidden;
  });
}

/**
 * Check and unlock achievements based on user metrics
 */
export function checkAndUnlockAchievements(
  userId: string,
  metrics: Record<string, number>
): Achievement[] {
  const progress = getUserAchievementProgress(userId);
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  const allProgress = stored ? JSON.parse(stored) : {};
  const userProgress = allProgress[userId] || {};

  const newlyUnlocked: Achievement[] = [];

  progress.forEach(prog => {
    if (prog.unlocked) return; // Already unlocked

    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === prog.achievementId);
    if (!achievement) return;

    const metricValue = metrics[achievement.criteria.metric] || 0;
    const meetsCondition = evaluateCriteria(metricValue, achievement.criteria);

    if (meetsCondition) {
      // Unlock achievement
      userProgress[achievement.id] = {
        ...prog,
        progress: 100,
        currentValue: metricValue,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        notified: false
      };

      newlyUnlocked.push(achievement);
    } else {
      // Update progress
      const progressPercent = Math.min(100, (metricValue / achievement.criteria.target) * 100);
      userProgress[achievement.id] = {
        ...prog,
        progress: progressPercent,
        currentValue: metricValue
      };
    }
  });

  allProgress[userId] = userProgress;
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));

  return newlyUnlocked;
}

function evaluateCriteria(value: number, criteria: AchievementCriteria): boolean {
  const condition = criteria.condition || 'gte';

  switch (condition) {
    case 'gte':
      return value >= criteria.target;
    case 'lte':
      return value <= criteria.target;
    case 'eq':
      return value === criteria.target;
    default:
      return false;
  }
}

/**
 * Mark achievement notification as seen
 */
export function markAchievementNotified(userId: string, achievementId: string): void {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  const allProgress = stored ? JSON.parse(stored) : {};
  const userProgress = allProgress[userId] || {};

  if (userProgress[achievementId]) {
    userProgress[achievementId].notified = true;
    allProgress[userId] = userProgress;
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));
  }
}

/**
 * Get user achievement statistics
 */
export function getUserAchievementStats(userId: string): {
  total: number;
  unlocked: number;
  locked: number;
  byRarity: Record<AchievementRarity, number>;
  totalPoints: number;
  completionPercentage: number;
} {
  const progress = getUserAchievementProgress(userId);
  const unlocked = progress.filter(p => p.unlocked);
  const locked = progress.filter(p => !p.unlocked);

  const byRarity: Record<AchievementRarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  };

  let totalPoints = 0;

  unlocked.forEach(prog => {
    const achievement = ALL_ACHIEVEMENTS.find(a => a.id === prog.achievementId);
    if (achievement) {
      byRarity[achievement.rarity]++;
      totalPoints += achievement.rewardPoints;
    }
  });

  return {
    total: ALL_ACHIEVEMENTS.filter(a => !a.isHidden).length,
    unlocked: unlocked.length,
    locked: locked.length,
    byRarity,
    totalPoints,
    completionPercentage: (unlocked.length / ALL_ACHIEVEMENTS.filter(a => !a.isHidden).length) * 100
  };
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.category === category && !a.isHidden);
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'legendary':
      return 'from-amber-400 to-orange-600';
    case 'epic':
      return 'from-purple-500 to-pink-600';
    case 'rare':
      return 'from-blue-500 to-cyan-600';
    case 'uncommon':
      return 'from-green-500 to-emerald-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
}

/**
 * Get rarity label color (for badges)
 */
export function getRarityBadgeColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'legendary':
      return 'bg-amber-500/10 text-amber-700 border-amber-300';
    case 'epic':
      return 'bg-purple-500/10 text-purple-700 border-purple-300';
    case 'rare':
      return 'bg-blue-500/10 text-blue-700 border-blue-300';
    case 'uncommon':
      return 'bg-green-500/10 text-green-700 border-green-300';
    default:
      return 'bg-gray-500/10 text-gray-700 border-gray-300';
  }
}
