import type { IQKpiLabel } from '../utils/iqKpis';
import type { IQTestType } from '../utils/iqTestTypes';

export interface IQPracticeCategoryScore {
  correct: number;
  total: number;
}

export interface IQPracticeResult {
  id: string;
  testType: IQTestType;
  completedAt: string;
  correctAnswers: number;
  totalQuestions: number;
  /** Percentage of questions answered correctly on the first try (0-100). */
  accuracy: number;
  timeTakenSeconds: number;
  categoryBreakdown: Partial<Record<IQKpiLabel, IQPracticeCategoryScore>>;
}

export type IQPracticeResultInput = Omit<IQPracticeResult, 'id' | 'accuracy'>;

// Practice results live in localStorage until the practice-attempts API exists.
// The key is scoped per user so accounts sharing a browser keep separate histories.
const getStorageKey = (userId: string) => `iq_practice_results:${userId}`;

const readResults = (userId: string): IQPracticeResult[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const iqPracticeResultService = {
  /** Returns the user's practice results, oldest first. */
  async list(userId: string): Promise<IQPracticeResult[]> {
    return readResults(userId).sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
    );
  },

  async save(userId: string, input: IQPracticeResultInput): Promise<IQPracticeResult> {
    const result: IQPracticeResult = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      accuracy: input.totalQuestions
        ? Math.round((input.correctAnswers / input.totalQuestions) * 100)
        : 0,
    };

    window.localStorage.setItem(
      getStorageKey(userId),
      JSON.stringify([...readResults(userId), result]),
    );

    return result;
  },
};
