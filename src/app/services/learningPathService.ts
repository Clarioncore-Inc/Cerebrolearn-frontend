/**
 * Learning Path Service
 * Generates personalized learning paths based on user skills, goals, and progress
 */

export interface Skill {
  name: string;
  category: string;
  level: number; // 0-10
  isRequired: boolean;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetSkills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  priority: 'low' | 'medium' | 'high';
}

export interface LearningPath {
  id: string;
  goal: LearningGoal;
  currentSkills: Skill[];
  targetSkills: Skill[];
  skillGaps: SkillGap[];
  recommendedCourses: PathCourse[];
  estimatedTime: number; // total hours
  difficultyProgression: number[]; // difficulty over time 0-10
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendedAction: string;
}

export interface PathCourse {
  courseId: string;
  title: string;
  description: string;
  order: number;
  difficulty: number; // 1-10
  estimatedHours: number;
  skillsAcquired: string[];
  prerequisites: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  importance: 'required' | 'recommended' | 'optional';
}

const STORAGE_KEY = 'cerebrolearn_learning_paths';

// Predefined learning goals
export const PREDEFINED_GOALS: LearningGoal[] = [
  {
    id: 'web-dev-fullstack',
    title: 'Full-Stack Web Developer',
    description: 'Master both frontend and backend development to build complete web applications',
    targetSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Databases', 'APIs'],
    difficulty: 'intermediate',
    estimatedHours: 240,
    priority: 'high'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Learn to analyze data, build models, and extract insights using modern tools',
    targetSkills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL'],
    difficulty: 'advanced',
    estimatedHours: 320,
    priority: 'high'
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer',
    description: 'Create native and cross-platform mobile applications',
    targetSkills: ['JavaScript', 'React Native', 'Mobile UI', 'APIs', 'App Deployment'],
    difficulty: 'intermediate',
    estimatedHours: 200,
    priority: 'medium'
  },
  {
    id: 'ai-engineer',
    title: 'AI/ML Engineer',
    description: 'Build and deploy artificial intelligence and machine learning systems',
    targetSkills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'MLOps'],
    difficulty: 'advanced',
    estimatedHours: 360,
    priority: 'high'
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Solutions Architect',
    description: 'Design and implement scalable cloud infrastructure',
    targetSkills: ['Cloud Platforms', 'DevOps', 'Containers', 'Kubernetes', 'Security', 'Networking'],
    difficulty: 'advanced',
    estimatedHours: 280,
    priority: 'medium'
  }
];

/**
 * Analyze skill gaps between current and target skills
 */
export function analyzeSkillGaps(
  currentSkills: Skill[],
  targetSkills: Skill[]
): SkillGap[] {
  const gaps: SkillGap[] = [];

  targetSkills.forEach(targetSkill => {
    const currentSkill = currentSkills.find(s => s.name === targetSkill.name);
    const currentLevel = currentSkill?.level || 0;
    const gap = Math.max(0, targetSkill.level - currentLevel);

    if (gap > 0) {
      gaps.push({
        skill: targetSkill.name,
        currentLevel,
        requiredLevel: targetSkill.level,
        gap,
        priority: determinePriority(gap, targetSkill.isRequired),
        recommendedAction: getRecommendedAction(gap, currentLevel)
      });
    }
  });

  return gaps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function determinePriority(gap: number, isRequired: boolean): 'critical' | 'high' | 'medium' | 'low' {
  if (isRequired && gap >= 7) return 'critical';
  if (gap >= 7) return 'high';
  if (gap >= 4) return 'medium';
  return 'low';
}

function getRecommendedAction(gap: number, currentLevel: number): string {
  if (currentLevel === 0) {
    return 'Start with beginner courses to build foundation';
  } else if (gap >= 7) {
    return 'Intensive study required - multiple courses recommended';
  } else if (gap >= 4) {
    return 'Intermediate courses to fill knowledge gaps';
  } else {
    return 'Practice and small improvements needed';
  }
}

/**
 * Generate personalized learning path
 */
export function generateLearningPath(
  goal: LearningGoal,
  currentSkills: Skill[]
): LearningPath {
  // Create target skills with appropriate levels based on goal difficulty
  const targetSkillLevel = goal.difficulty === 'beginner' ? 5 : goal.difficulty === 'intermediate' ? 7 : 9;
  const targetSkills: Skill[] = goal.targetSkills.map(skillName => ({
    name: skillName,
    category: determineCategory(skillName),
    level: targetSkillLevel,
    isRequired: true
  }));

  const skillGaps = analyzeSkillGaps(currentSkills, targetSkills);
  const recommendedCourses = generateCourseRecommendations(skillGaps, currentSkills);
  const estimatedTime = calculateTotalTime(recommendedCourses);
  const difficultyProgression = calculateDifficultyProgression(recommendedCourses);

  return {
    id: `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    goal,
    currentSkills,
    targetSkills,
    skillGaps,
    recommendedCourses,
    estimatedTime,
    difficultyProgression,
    completionPercentage: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function determineCategory(skillName: string): string {
  const categories: Record<string, string[]> = {
    'Frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'UI/UX'],
    'Backend': ['Node.js', 'Python', 'Java', 'APIs', 'Databases', 'SQL'],
    'Data Science': ['Statistics', 'Machine Learning', 'Data Visualization', 'Python', 'R'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms', 'DevOps'],
    'Mobile': ['React Native', 'Flutter', 'Mobile UI', 'App Deployment'],
    'AI/ML': ['Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps']
  };

  for (const [category, skills] of Object.entries(categories)) {
    if (skills.some(s => skillName.includes(s) || s.includes(skillName))) {
      return category;
    }
  }

  return 'General';
}

function generateCourseRecommendations(
  skillGaps: SkillGap[],
  currentSkills: Skill[]
): PathCourse[] {
  const courses: PathCourse[] = [];
  let order = 1;

  skillGaps.forEach(gap => {
    // Generate 1-3 courses per skill gap depending on gap size
    const courseCount = Math.min(3, Math.ceil(gap.gap / 3));

    for (let i = 0; i < courseCount; i++) {
      const difficulty = Math.max(1, gap.currentLevel + (i + 1) * 2);
      const isFirst = courses.length === 0;

      courses.push({
        courseId: `course-${gap.skill.toLowerCase()}-${i + 1}`,
        title: `${gap.skill} - ${i === 0 ? 'Fundamentals' : i === 1 ? 'Intermediate' : 'Advanced'}`,
        description: `Master ${gap.skill} through hands-on projects and real-world examples`,
        order: order++,
        difficulty: Math.min(10, difficulty),
        estimatedHours: 15 + i * 10,
        skillsAcquired: [gap.skill],
        prerequisites: isFirst ? [] : courses.slice(-1).map(c => c.title),
        status: isFirst ? 'available' : 'locked',
        importance: gap.priority === 'critical' ? 'required' : gap.priority === 'high' ? 'recommended' : 'optional'
      });
    }
  });

  return courses;
}

function calculateTotalTime(courses: PathCourse[]): number {
  return courses.reduce((total, course) => total + course.estimatedHours, 0);
}

function calculateDifficultyProgression(courses: PathCourse[]): number[] {
  return courses.map(c => c.difficulty);
}

/**
 * Save learning path
 */
export function saveLearningPath(path: LearningPath): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const paths = stored ? JSON.parse(stored) : [];

  const existingIndex = paths.findIndex((p: LearningPath) => p.id === path.id);

  if (existingIndex >= 0) {
    paths[existingIndex] = {
      ...path,
      updatedAt: new Date().toISOString()
    };
  } else {
    paths.push(path);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
}

/**
 * Get all learning paths
 */
export function getAllLearningPaths(): LearningPath[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get learning path by ID
 */
export function getLearningPath(id: string): LearningPath | null {
  const paths = getAllLearningPaths();
  return paths.find(p => p.id === id) || null;
}

/**
 * Delete learning path
 */
export function deleteLearningPath(id: string): void {
  const paths = getAllLearningPaths();
  const filtered = paths.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Update course status in learning path
 */
export function updateCourseStatus(
  pathId: string,
  courseId: string,
  status: PathCourse['status']
): void {
  const path = getLearningPath(pathId);
  if (!path) return;

  const courseIndex = path.recommendedCourses.findIndex(c => c.courseId === courseId);
  if (courseIndex >= 0) {
    path.recommendedCourses[courseIndex].status = status;

    // Unlock next course if this one is completed
    if (status === 'completed' && courseIndex < path.recommendedCourses.length - 1) {
      if (path.recommendedCourses[courseIndex + 1].status === 'locked') {
        path.recommendedCourses[courseIndex + 1].status = 'available';
      }
    }

    // Update completion percentage
    const completedCount = path.recommendedCourses.filter(c => c.status === 'completed').length;
    path.completionPercentage = (completedCount / path.recommendedCourses.length) * 100;

    saveLearningPath(path);
  }
}
