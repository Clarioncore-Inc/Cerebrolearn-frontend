import {
  type LucideIcon,
  Eye,
  Lightbulb,
  History,
  Aperture,
  Cog,
  Gauge,
  Heart,
  Users,
} from 'lucide-react';

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type CognitiveFunctionCode =
  | 'Ni' | 'Ne' | 'Si' | 'Se' | 'Ti' | 'Te' | 'Fi' | 'Fe';

interface CognitiveFunctionMeta {
  name: string;
  sublabel: string;
  description: string;
  icon: LucideIcon;
}

// The 8 Jungian cognitive functions.
export const MBTI_FUNCTIONS: Record<CognitiveFunctionCode, CognitiveFunctionMeta> = {
  Ni: {
    name: 'Introverted Intuition',
    sublabel: 'Insight',
    description: 'Focuses on foresight, hidden patterns, and long-range future implications.',
    icon: Eye,
  },
  Ne: {
    name: 'Extraverted Intuition',
    sublabel: 'Creativity',
    description: 'Focuses on worldly pattern recognition, ideas, and invention.',
    icon: Lightbulb,
  },
  Si: {
    name: 'Introverted Sensing',
    sublabel: 'Memory',
    description: 'Focuses on memory and personal history.',
    icon: History,
  },
  Se: {
    name: 'Extraverted Sensing',
    sublabel: 'Visual-Spatial',
    description: 'Focuses on present, visual reality, and worldly experiences.',
    icon: Aperture,
  },
  Ti: {
    name: 'Introverted Thinking',
    sublabel: 'Logic',
    description: 'Focuses on internal logic, systems, and analysis.',
    icon: Cog,
  },
  Te: {
    name: 'Extraverted Thinking',
    sublabel: 'Efficiency',
    description: 'Focuses on organizing the external world, objective results, and productivity.',
    icon: Gauge,
  },
  Fi: {
    name: 'Introverted Feeling',
    sublabel: 'Authenticity',
    description: 'Focuses on personal values, individuality, and inner harmony.',
    icon: Heart,
  },
  Fe: {
    name: 'Extraverted Feeling',
    sublabel: 'Harmony',
    description: 'Focuses on group emotions, social harmony, and interpersonal connection.',
    icon: Users,
  },
};

export const MBTI_STACK_ROLE_LABELS = [
  'Dominant',
  'Auxiliary',
  'Tertiary',
  'Inferior',
] as const;

export interface MBTIProfile {
  nickname: string;
  // [dominant, auxiliary, tertiary, inferior]
  stack: [CognitiveFunctionCode, CognitiveFunctionCode, CognitiveFunctionCode, CognitiveFunctionCode];
  paragraphs: [string, string, string];
}

const MBTI_TYPE_IMAGE_PATHS: Partial<Record<MBTIType, string>> = {
  ENFJ: '/assets/ENFJ.png',
  ENFP: '/assets/ENFP.jpeg',
  ENTJ: '/assets/ENTJ.jpeg',
  ENTP: '/assets/ENTP.png',
  ESFJ: '/assets/ESFJ.jpg',
  ESFP: '/assets/ESFP.PNG',
  ESTJ: '/assets/ESTJ.jpg',
  ESTP: '/assets/ESTP.PNG',
  INFJ: '/assets/INFJ.png',
  INFP: '/assets/INFP.jpeg',
  INTJ: '/assets/INTJ.jpeg',
  INTP: '/assets/INTP.JPE',
  ISFJ: '/assets/ISFJ.png',
  ISFP: '/assets/ISFP.PNG',
  ISTJ: '/assets/ISTJ.png',
};

export function getMBTITypeImagePath(type: MBTIType): string {
  return MBTI_TYPE_IMAGE_PATHS[type] ?? `/assets/${type}.png`;
}

export function getCognitiveFunctionImagePath(code: CognitiveFunctionCode): string {
  return `/assets/${code}.svg`;
}

export const MBTI_PROFILES: Record<MBTIType, MBTIProfile> = {
  INTJ: {
    nickname: 'The Strategic Architect',
    stack: ['Ni', 'Te', 'Fi', 'Se'],
    paragraphs: [
      "INTJs are driven by a need to understand the underlying structure of ideas and systems. They see far ahead, anticipating problems and opportunities long before others notice them, and they trust their internal vision even when it isn't yet backed by hard evidence.",
      'Once a plan takes shape, INTJs move quickly to organize the resources, people, and steps required to bring it to life. They value competence, efficiency, and long-term results over small talk or unnecessary process.',
      'In relationships and teams, INTJs can come across as reserved or overly critical, but underneath is a deep commitment to helping the people and causes they care about improve. They thrive when given autonomy to pursue ambitious, meaningful goals.',
    ],
  },
  INTP: {
    nickname: 'The Analytical Thinker',
    stack: ['Ti', 'Ne', 'Si', 'Fe'],
    paragraphs: [
      "INTPs are captivated by ideas for their own sake. They build intricate internal frameworks of logic and enjoy testing them against new information, often exploring a subject far beyond what's practically necessary just to satisfy their curiosity.",
      'Comfortable with ambiguity, INTPs generate a wide range of possibilities and theories, then quietly refine them until the reasoning is airtight. They prefer precision over persuasion and would rather be right than popular.',
      "Socially, INTPs can seem detached, but they are fiercely loyal to people who share their intellectual interests. They do best in environments that reward independent thought and don't box them into rigid procedures.",
    ],
  },
  ENTJ: {
    nickname: 'The Decisive Commander',
    stack: ['Te', 'Ni', 'Se', 'Fi'],
    paragraphs: [
      'ENTJs are natural organizers who see the big picture and immediately start thinking about how to execute it. They value efficiency and clear goals, and they are quick to take charge when a plan needs a leader.',
      'Their long-range vision, paired with a drive for measurable results, makes ENTJs effective at building strategies, teams, and organizations that turn ambition into reality.',
      'ENTJs can be blunt and impatient with inefficiency, but they genuinely want the people around them to succeed. They thrive in roles with real responsibility and room to shape outcomes.',
    ],
  },
  ENTP: {
    nickname: 'The Debating Inventor',
    stack: ['Ne', 'Ti', 'Fe', 'Si'],
    paragraphs: [
      'ENTPs are adept at recognizing complex patterns and connections among ideas, people, and things in the real world. They excel at analyzing these patterns and interrelationships in great detail, leading to a profound understanding of how diverse information can be improved through brainstorming and inventive ideas.',
      'Driven by a desire to understand and enhance the world around them, ENTPs are usually perceptive in assessing situations accurately. They may have a quirky sense of humor and enjoy debate, which can sometimes lead to misunderstandings with friends, coworkers, and family. ENTPs are brilliant inventors and excel at generating extraordinary ideas and solutions to challenging problems.',
      'In a team environment, ENTPs thrive in roles that allow them to utilize their skills in deep brainstorming and collaboration. They view statements like "it can\'t be done" as personal challenges, and they are adept at leveraging their inventive brainpower to generate novel ideas.',
    ],
  },
  INFJ: {
    nickname: 'The Insightful Advocate',
    stack: ['Ni', 'Fe', 'Ti', 'Se'],
    paragraphs: [
      'INFJs combine deep intuition with a strong sense of empathy, giving them an almost uncanny ability to sense what people need and where situations are headed.',
      'They are quietly idealistic, drawn to meaningful causes and long-term visions of a better future, and they work steadily behind the scenes to bring those visions to life.',
      'INFJs can be private about their inner world, but they form deep, loyal connections with the people they trust. They need time alone to recharge from the emotional weight they carry for others.',
    ],
  },
  INFP: {
    nickname: 'The Idealist Healer',
    stack: ['Fi', 'Ne', 'Si', 'Te'],
    paragraphs: [
      'INFPs are guided by a strong inner compass of personal values. They care deeply about authenticity and meaning, and they naturally resist anything that feels forced or fake.',
      'Their imagination and openness to possibility make INFPs creative problem-solvers who see potential in people and ideas that others overlook.',
      'Warm but reserved, INFPs invest heavily in the relationships and causes they believe in. They do best in environments that give them freedom to express their values rather than rigid rules to follow.',
    ],
  },
  ENFJ: {
    nickname: 'The Inspiring Mentor',
    stack: ['Fe', 'Ni', 'Se', 'Ti'],
    paragraphs: [
      'ENFJs are natural motivators who tune in closely to the emotions and needs of the people around them, often before those people recognize the needs themselves.',
      'They combine this empathy with a clear sense of long-term vision, making them effective at rallying groups toward a shared purpose.',
      'ENFJs invest heavily in helping others grow, sometimes at the expense of their own needs. They thrive in roles centered on mentorship, leadership, and community building.',
    ],
  },
  ENFP: {
    nickname: 'The Enthusiastic Campaigner',
    stack: ['Ne', 'Fi', 'Te', 'Si'],
    paragraphs: [
      'ENFPs are energized by possibility. They see connections between people, ideas, and opportunities everywhere, and they approach life with genuine curiosity and warmth.',
      'Guided by strong personal values, ENFPs are passionate advocates for causes and people they believe in, and they are skilled at inspiring others to see new perspectives.',
      'They can struggle with follow-through once the initial excitement fades, but ENFPs bring creativity and authentic enthusiasm to everything they take on.',
    ],
  },
  ISTJ: {
    nickname: 'The Dependable Inspector',
    stack: ['Si', 'Te', 'Fi', 'Ne'],
    paragraphs: [
      'ISTJs are grounded in facts, experience, and proven methods. They have excellent memories for detail and a strong sense of duty toward the commitments they make.',
      'Practical and organized, ISTJs work methodically toward clear goals, valuing reliability and thoroughness over flashy shortcuts.',
      'They can seem reserved or resistant to change, but ISTJs are deeply trustworthy, and the people who rely on them know exactly what to expect.',
    ],
  },
  ISFJ: {
    nickname: 'The Devoted Protector',
    stack: ['Si', 'Fe', 'Ti', 'Ne'],
    paragraphs: [
      'ISFJs combine a strong memory for detail with genuine warmth toward the people in their lives. They notice small things that matter to others and act on them quietly.',
      'Dependable and hardworking, ISFJs take their responsibilities seriously and prefer steady, practical progress over big, risky changes.',
      'They can be reluctant to put their own needs first, but ISFJs are fiercely loyal, and they build trust through consistent, caring action rather than words.',
    ],
  },
  ESTJ: {
    nickname: 'The Efficient Executive',
    stack: ['Te', 'Si', 'Ne', 'Fi'],
    paragraphs: [
      'ESTJs are natural organizers who bring order and structure to whatever they touch. They rely on past experience and established procedures to get things done efficiently.',
      'Direct and decisive, ESTJs take charge readily, setting clear expectations and holding themselves and others accountable to them.',
      'They can come across as rigid, but ESTJs are dependable leaders who genuinely want their teams and communities to run smoothly and succeed.',
    ],
  },
  ESFJ: {
    nickname: 'The Supportive Consul',
    stack: ['Fe', 'Si', 'Ne', 'Ti'],
    paragraphs: [
      'ESFJs are attentive to the people around them, drawing on past experience to understand what others need to feel supported and included.',
      'Warm and organized, ESFJs excel at creating harmony in groups, often taking on the practical work of keeping everyone connected and cared for.',
      'They can take criticism personally, but ESFJs are generous with their time and energy, and they build strong, lasting communities wherever they go.',
    ],
  },
  ISTP: {
    nickname: 'The Practical Mechanic',
    stack: ['Ti', 'Se', 'Ni', 'Fe'],
    paragraphs: [
      'ISTPs are hands-on problem-solvers who understand how things work by taking them apart, literally or conceptually, and testing the pieces.',
      'They combine sharp internal logic with acute awareness of their physical surroundings, making them calm and effective in a crisis.',
      'Independent and private, ISTPs value their freedom and dislike being micromanaged. They show care through action rather than words.',
    ],
  },
  ISFP: {
    nickname: 'The Gentle Artist',
    stack: ['Fi', 'Se', 'Ni', 'Te'],
    paragraphs: [
      'ISFPs live by a quiet but firm sense of personal values, and they express themselves through action, craft, and aesthetics rather than words.',
      'Attuned to their immediate surroundings, ISFPs notice beauty and detail that others miss, and they bring a gentle, authentic presence to their relationships.',
      'They can be reluctant to assert themselves, but ISFPs are deeply loyal and adaptable, thriving in environments that let them express themselves freely.',
    ],
  },
  ESTP: {
    nickname: 'The Bold Entrepreneur',
    stack: ['Se', 'Ti', 'Fe', 'Ni'],
    paragraphs: [
      'ESTPs are energized by the present moment. They read situations quickly and act decisively, often thriving under pressure where others hesitate.',
      'Practical and logical, ESTPs cut through complexity to find the most direct path to a result, adapting their approach as new information comes in.',
      'They can be impulsive, but ESTPs bring a contagious confidence and resourcefulness to everything they do, making them natural troubleshooters.',
    ],
  },
  ESFP: {
    nickname: 'The Spontaneous Performer',
    stack: ['Se', 'Fi', 'Te', 'Ni'],
    paragraphs: [
      'ESFPs live fully in the moment, bringing warmth, energy, and spontaneity to the people and situations around them.',
      'Guided by personal values, ESFPs are genuine and generous, quick to notice when someone needs encouragement and quick to offer it.',
      'They can struggle with long-term planning, but ESFPs bring joy and practical care to everyday life, making them natural connectors in any group.',
    ],
  },
};
