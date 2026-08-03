import { MBTIType } from './mbtiData';

export type DichotomyPair = 'EI' | 'SN' | 'TF' | 'JP';
export type DichotomyLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MBTIQuizOption {
  text: string;
  letter: DichotomyLetter;
}

export interface MBTIQuizQuestion {
  id: number;
  dichotomy: DichotomyPair;
  prompt: string;
  options: [MBTIQuizOption, MBTIQuizOption];
}

// 7 questions per dichotomy (28 total). Each question offers two statements;
// picking one casts a vote for that letter within its dichotomy pair.
export const MBTI_QUIZ_QUESTIONS: MBTIQuizQuestion[] = [
  // Extraversion (E) vs Introversion (I)
  { id: 1, dichotomy: 'EI', prompt: 'At a party or social gathering, you tend to...', options: [{ text: 'Work the room and meet as many new people as possible', letter: 'E' }, { text: 'Stick with a few people you already know well', letter: 'I' }] },
  { id: 2, dichotomy: 'EI', prompt: 'After a long, demanding week, you recharge best by...', options: [{ text: 'Going out with friends or doing something social', letter: 'E' }, { text: 'Spending quiet time alone or with one close person', letter: 'I' }] },
  { id: 3, dichotomy: 'EI', prompt: 'When working through a problem, you prefer to...', options: [{ text: 'Talk it out loud with others as you think', letter: 'E' }, { text: 'Think it through quietly in your own head first', letter: 'I' }] },
  { id: 4, dichotomy: 'EI', prompt: 'In a group project, you naturally...', options: [{ text: 'Jump in and start discussing ideas right away', letter: 'E' }, { text: 'Listen first, then share once you\u2019ve gathered your thoughts', letter: 'I' }] },
  { id: 5, dichotomy: 'EI', prompt: 'You would rather spend a free Saturday...', options: [{ text: 'Out and about, surrounded by activity and people', letter: 'E' }, { text: 'At home, or somewhere calm, doing your own thing', letter: 'I' }] },
  { id: 6, dichotomy: 'EI', prompt: 'When meeting new people, you generally feel...', options: [{ text: 'Energized and eager to introduce yourself', letter: 'E' }, { text: 'Reserved until you get a sense of them first', letter: 'I' }] },
  { id: 7, dichotomy: 'EI', prompt: 'Your ideal work environment involves...', options: [{ text: 'Frequent collaboration and open discussion', letter: 'E' }, { text: 'Long stretches of uninterrupted, independent focus', letter: 'I' }] },

  // Sensing (S) vs Intuition (N)
  { id: 8, dichotomy: 'SN', prompt: 'When learning something new, you prefer...', options: [{ text: 'Clear, concrete facts and step-by-step instructions', letter: 'S' }, { text: 'Big-picture concepts and how ideas connect', letter: 'N' }] },
  { id: 9, dichotomy: 'SN', prompt: 'You trust information more when it comes from...', options: [{ text: 'Direct experience and observable evidence', letter: 'S' }, { text: 'Patterns, hunches, and future possibilities', letter: 'N' }] },
  { id: 10, dichotomy: 'SN', prompt: 'When telling a story, you tend to focus on...', options: [{ text: 'What actually happened, in accurate detail', letter: 'S' }, { text: 'The meaning behind it or where it might lead', letter: 'N' }] },
  { id: 11, dichotomy: 'SN', prompt: 'You\u2019re more drawn to conversations about...', options: [{ text: 'Practical, real-world topics', letter: 'S' }, { text: 'Abstract ideas, theories, or "what if" scenarios', letter: 'N' }] },
  { id: 12, dichotomy: 'SN', prompt: 'When solving a problem, you rely more on...', options: [{ text: 'Proven methods that have worked before', letter: 'S' }, { text: 'A hunch or novel idea, even if untested', letter: 'N' }] },
  { id: 13, dichotomy: 'SN', prompt: 'You\u2019re more interested in...', options: [{ text: 'What is real and happening right now', letter: 'S' }, { text: 'What could be, down the road', letter: 'N' }] },
  { id: 14, dichotomy: 'SN', prompt: 'People would describe you as more...', options: [{ text: 'Down-to-earth and detail-oriented', letter: 'S' }, { text: 'Imaginative and idea-driven', letter: 'N' }] },

  // Thinking (T) vs Feeling (F)
  { id: 15, dichotomy: 'TF', prompt: 'When making a tough decision, you weigh most heavily...', options: [{ text: 'Logic, consistency, and objective facts', letter: 'T' }, { text: 'How it will affect the people involved', letter: 'F' }] },
  { id: 16, dichotomy: 'TF', prompt: 'When a friend is upset, your first instinct is to...', options: [{ text: 'Help them think through the problem logically', letter: 'T' }, { text: 'Validate their feelings and offer support', letter: 'F' }] },
  { id: 17, dichotomy: 'TF', prompt: 'You value being seen as...', options: [{ text: 'Fair and rational', letter: 'T' }, { text: 'Compassionate and understanding', letter: 'F' }] },
  { id: 18, dichotomy: 'TF', prompt: 'In a disagreement, you\u2019re more likely to...', options: [{ text: 'Point out the flaws in the argument itself', letter: 'T' }, { text: 'Consider how each person feels about it', letter: 'F' }] },
  { id: 19, dichotomy: 'TF', prompt: 'Feedback you give others tends to be...', options: [{ text: 'Direct and focused on what needs improvement', letter: 'T' }, { text: 'Gentle and mindful of how it lands', letter: 'F' }] },
  { id: 20, dichotomy: 'TF', prompt: 'You make your best decisions when you...', options: [{ text: 'Set emotion aside and analyze the situation', letter: 'T' }, { text: 'Check in with your values and how you feel', letter: 'F' }] },
  { id: 21, dichotomy: 'TF', prompt: 'A good decision is one that is...', options: [{ text: 'Logically sound, even if unpopular', letter: 'T' }, { text: 'In harmony with everyone\u2019s needs', letter: 'F' }] },

  // Judging (J) vs Perceiving (P)
  { id: 22, dichotomy: 'JP', prompt: 'When it comes to plans, you prefer to...', options: [{ text: 'Have things decided and settled in advance', letter: 'J' }, { text: 'Keep your options open and decide as you go', letter: 'P' }] },
  { id: 23, dichotomy: 'JP', prompt: 'Your workspace or bag is usually...', options: [{ text: 'Organized, with everything in its place', letter: 'J' }, { text: 'A bit scattered, but you know where things are', letter: 'P' }] },
  { id: 24, dichotomy: 'JP', prompt: 'Before a trip, you tend to...', options: [{ text: 'Plan the itinerary in detail ahead of time', letter: 'J' }, { text: 'Figure things out spontaneously along the way', letter: 'P' }] },
  { id: 25, dichotomy: 'JP', prompt: 'Deadlines make you feel...', options: [{ text: 'Motivated \u2014 you like finishing things early', letter: 'J' }, { text: 'Fine \u2014 you often do your best work under pressure', letter: 'P' }] },
  { id: 26, dichotomy: 'JP', prompt: 'You prefer a lifestyle that is...', options: [{ text: 'Structured and predictable', letter: 'J' }, { text: 'Flexible and open to change', letter: 'P' }] },
  { id: 27, dichotomy: 'JP', prompt: 'When starting a new project, you...', options: [{ text: 'Make a plan before diving in', letter: 'J' }, { text: 'Dive in and adapt as you learn more', letter: 'P' }] },
  { id: 28, dichotomy: 'JP', prompt: 'You feel most comfortable when...', options: [{ text: 'A decision has been made and it\u2019s settled', letter: 'J' }, { text: 'You still have room to change your mind', letter: 'P' }] },
];

export interface DichotomyScore {
  leftLetter: DichotomyLetter;
  rightLetter: DichotomyLetter;
  left: number;
  right: number;
}

export interface MBTIQuizComputedResult {
  type: MBTIType;
  scores: Record<DichotomyPair, DichotomyScore>;
}

const DICHOTOMY_LETTERS: Record<DichotomyPair, [DichotomyLetter, DichotomyLetter]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
};

export function computeMBTIType(answers: (0 | 1 | null)[]): MBTIQuizComputedResult {
  const tally: Record<DichotomyLetter, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  MBTI_QUIZ_QUESTIONS.forEach((q, index) => {
    const choice = answers[index];
    if (choice === null || choice === undefined) return;
    tally[q.options[choice].letter] += 1;
  });

  const scores = {} as Record<DichotomyPair, DichotomyScore>;
  let typeCode = '';

  (Object.keys(DICHOTOMY_LETTERS) as DichotomyPair[]).forEach((pair) => {
    const [leftLetter, rightLetter] = DICHOTOMY_LETTERS[pair];
    const left = tally[leftLetter];
    const right = tally[rightLetter];
    scores[pair] = { leftLetter, rightLetter, left, right };
    // Ties default to the left (more common/canonical) letter.
    typeCode += left >= right ? leftLetter : rightLetter;
  });

  return { type: typeCode as MBTIType, scores };
}
