/**
 * Streak System Service
 * Tracks daily learning streaks, freeze days, and streak rewards
 */

export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  activityDates: string[]; // Array of dates with activity (YYYY-MM-DD format)
  freezesAvailable: number;
  freezesUsed: number;
  totalFreezes: number;
  streakHistory: StreakHistoryEntry[];
  milestones: StreakMilestone[];
}

export interface StreakHistoryEntry {
  date: string;
  streakCount: number;
  activity: 'login' | 'course' | 'quiz' | 'freeze';
}

export interface StreakMilestone {
  days: number;
  title: string;
  reward: number; // XP reward
  achieved: boolean;
  achievedDate?: string;
}

const STORAGE_KEY = 'cerebrolearn_user_streaks';

const STREAK_MILESTONES: Omit<StreakMilestone, 'achieved' | 'achievedDate'>[] = [
  { days: 3, title: '3-Day Starter', reward: 50 },
  { days: 7, title: 'Week Warrior', reward: 200 },
  { days: 14, title: 'Two-Week Champion', reward: 500 },
  { days: 30, title: 'Monthly Master', reward: 1500 },
  { days: 60, title: '60-Day Dynamo', reward: 3500 },
  { days: 100, title: 'Century Club', reward: 10000 },
  { days: 365, title: 'Year-Long Legend', reward: 50000 }
];

/**
 * Initialize streak data for user
 */
export function initializeUserStreak(userId: string): StreakData {
  const stored = localStorage.getItem(STORAGE_KEY);
  const allStreaks = stored ? JSON.parse(stored) : {};

  if (allStreaks[userId]) {
    return allStreaks[userId];
  }

  const newStreak: StreakData = {
    userId,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    activityDates: [],
    freezesAvailable: 2,
    freezesUsed: 0,
    totalFreezes: 2,
    streakHistory: [],
    milestones: STREAK_MILESTONES.map(m => ({ ...m, achieved: false }))
  };

  allStreaks[userId] = newStreak;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allStreaks));

  return newStreak;
}

/**
 * Get user streak data
 */
export function getUserStreak(userId: string): StreakData {
  const stored = localStorage.getItem(STORAGE_KEY);
  const allStreaks = stored ? JSON.parse(stored) : {};
  return allStreaks[userId] || initializeUserStreak(userId);
}

/**
 * Record activity and update streak
 */
export function recordActivity(
  userId: string,
  activityType: 'login' | 'course' | 'quiz' = 'login'
): {
  streak: StreakData;
  streakIncreased: boolean;
  newMilestones: StreakMilestone[];
} {
  const streak = getUserStreak(userId);
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Check if already recorded today
  if (streak.activityDates.includes(today)) {
    return { streak, streakIncreased: false, newMilestones: [] };
  }

  // Add today's activity
  streak.activityDates.push(today);
  streak.streakHistory.push({
    date: today,
    streakCount: streak.currentStreak + 1,
    activity: activityType
  });

  let streakIncreased = false;

  // Update streak
  if (streak.lastActivityDate === yesterday) {
    // Consecutive day - increase streak
    streak.currentStreak++;
    streakIncreased = true;
  } else if (streak.lastActivityDate === '') {
    // First ever activity
    streak.currentStreak = 1;
    streakIncreased = true;
  } else {
    // Streak broken - start over
    streak.currentStreak = 1;
  }

  streak.lastActivityDate = today;

  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  // Check milestones
  const newMilestones: StreakMilestone[] = [];
  streak.milestones.forEach(milestone => {
    if (!milestone.achieved && streak.currentStreak >= milestone.days) {
      milestone.achieved = true;
      milestone.achievedDate = today;
      newMilestones.push(milestone);
    }
  });

  // Grant freeze every 7 days
  if (streak.currentStreak % 7 === 0 && streak.currentStreak > 0) {
    streak.freezesAvailable = Math.min(streak.freezesAvailable + 1, 5); // Max 5 freezes
    streak.totalFreezes++;
  }

  // Save
  saveStreak(streak);

  return { streak, streakIncreased, newMilestones };
}

/**
 * Use a freeze day
 */
export function useFreeze(userId: string): boolean {
  const streak = getUserStreak(userId);

  if (streak.freezesAvailable <= 0) {
    return false; // No freezes available
  }

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Can only use freeze if missed yesterday
  if (streak.lastActivityDate !== yesterday) {
    streak.freezesAvailable--;
    streak.freezesUsed++;
    streak.lastActivityDate = yesterday; // Pretend yesterday had activity
    streak.activityDates.push(yesterday);
    streak.streakHistory.push({
      date: yesterday,
      streakCount: streak.currentStreak,
      activity: 'freeze'
    });

    saveStreak(streak);
    return true;
  }

  return false; // Can't use freeze (didn't miss a day)
}

/**
 * Check if streak is at risk (no activity today and yesterday was last activity)
 */
export function isStreakAtRisk(userId: string): boolean {
  const streak = getUserStreak(userId);
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // Streak is at risk if:
  // 1. No activity today
  // 2. Last activity was yesterday
  // 3. Current streak > 0
  return (
    !streak.activityDates.includes(today) &&
    streak.lastActivityDate === yesterday &&
    streak.currentStreak > 0
  );
}

/**
 * Check if streak is broken (missed more than one day)
 */
export function isStreakBroken(userId: string): boolean {
  const streak = getUserStreak(userId);
  const yesterday = getYesterdayDateString();

  return streak.currentStreak > 0 && streak.lastActivityDate !== yesterday;
}

/**
 * Get calendar data for the last 60 days
 */
export function getStreakCalendar(userId: string, days: number = 60): {
  date: string;
  hasActivity: boolean;
  isFreeze: boolean;
  streakDay: number;
}[] {
  const streak = getUserStreak(userId);
  const calendar: {
    date: string;
    hasActivity: boolean;
    isFreeze: boolean;
    streakDay: number;
  }[] = [];

  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDateString(date);

    const historyEntry = streak.streakHistory.find(h => h.date === dateString);

    calendar.push({
      date: dateString,
      hasActivity: streak.activityDates.includes(dateString),
      isFreeze: historyEntry?.activity === 'freeze',
      streakDay: historyEntry?.streakCount || 0
    });
  }

  return calendar;
}

/**
 * Get streak statistics
 */
export function getStreakStats(userId: string): {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  freezesAvailable: number;
  achievedMilestones: number;
  totalMilestones: number;
  nextMilestone: StreakMilestone | null;
} {
  const streak = getUserStreak(userId);

  const nextMilestone = streak.milestones.find(m => !m.achieved) || null;

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    totalDays: streak.activityDates.length,
    freezesAvailable: streak.freezesAvailable,
    achievedMilestones: streak.milestones.filter(m => m.achieved).length,
    totalMilestones: streak.milestones.length,
    nextMilestone
  };
}

// Helper functions

function saveStreak(streak: StreakData): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const allStreaks = stored ? JSON.parse(stored) : {};
  allStreaks[streak.userId] = streak;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allStreaks));
}

function getTodayDateString(): string {
  return formatDateString(new Date());
}

function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateString(yesterday);
}

function formatDateString(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Get streak color based on current streak
 */
export function getStreakColor(streak: number): string {
  if (streak >= 100) return 'from-purple-500 to-pink-600';
  if (streak >= 30) return 'from-orange-500 to-red-600';
  if (streak >= 7) return 'from-yellow-500 to-orange-500';
  return 'from-blue-500 to-cyan-500';
}
