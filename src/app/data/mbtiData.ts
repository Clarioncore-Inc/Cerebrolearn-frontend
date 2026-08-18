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
  paragraphs: [string];
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
    nickname: 'The Architectural Strategist',
    stack: ['Ni', 'Te', 'Fi', 'Se'],
    paragraphs: [
      'INTJs are particularly associated with strategic thinking, abstract reasoning, systems analysis, pattern recognition, long-range forecasting, and conceptual planning. They tend to construct internal models of how systems work and use those models to anticipate outcomes and develop efficient solutions. Their cognitive style is especially suited to complex problems requiring independence, foresight, and intellectual depth.',
    ],
  },
  INTP: {
    nickname: 'The Theoretical Logician',
    stack: ['Ti', 'Ne', 'Si', 'Fe'],
    paragraphs: [
      'INTPs are particularly associated with abstract reasoning, theoretical analysis, logical modeling, conceptual exploration, and intellectual curiosity. They tend to seek the underlying principles behind complex phenomena and construct internal systems for explaining how things work. Their cognitive style is especially suited to theoretical problems where independent analysis and conceptual depth are important.',
    ],
  },
  ENTJ: {
    nickname: 'The Commanding CEO',
    stack: ['Te', 'Ni', 'Se', 'Fi'],
    paragraphs: [
      'ENTJs are particularly associated with strategic reasoning, systems thinking, goal-oriented problem-solving, organizational intelligence, and long-range planning. They tend to analyze complex situations in terms of objectives, resources, structures, and outcomes. Their cognitive strength is especially apparent when intelligence must be translated into strategy, decision-making, leadership, and large-scale execution.',
    ],
  },
  ENTP: {
    nickname: 'The Debating Inventor',
    stack: ['Ne', 'Ti', 'Fe', 'Si'],
    paragraphs: [
      'ENTPs are particularly associated with divergent thinking, conceptual creativity, pattern recognition, intellectual experimentation, and inventive problem-solving. They tend to generate many possible explanations or solutions and then use logical analysis to test and refine them. Their cognitive strength is especially apparent when a problem requires connecting disparate concepts or imagining solutions that have not previously been considered.',
    ],
  },
  INFJ: {
    nickname: 'The Healing Advocate',
    stack: ['Ni', 'Fe', 'Ti', 'Se'],
    paragraphs: [
      'INFJs are particularly associated with pattern recognition, abstract synthesis, intuitive reasoning, conceptual depth, and understanding complex human behavior. They tend to integrate diverse pieces of information into broader interpretations and long-term perspectives. Their cognitive style is especially suited to problems requiring insight, interpretation, strategic foresight, and understanding underlying motivations or patterns.',
    ],
  },
  INFP: {
    nickname: 'The Imaginative Mediator',
    stack: ['Fi', 'Ne', 'Si', 'Te'],
    paragraphs: [
      'INFPs are particularly associated with conceptual thinking, imagination, introspection, abstract exploration, creative interpretation, and nuanced understanding. They tend to explore the deeper meanings and underlying principles behind experiences and ideas. Their cognitive style is especially suited to problems requiring originality, philosophical reflection, empathy, and the ability to consider multiple perspectives.',
    ],
  },
  ENFJ: {
    nickname: 'The Giving Mentor',
    stack: ['Fe', 'Ni', 'Se', 'Ti'],
    paragraphs: [
      'ENFJs are particularly associated with social intelligence, interpersonal reasoning, communication, strategic understanding of people, and synthesis of information across social contexts. They tend to recognize patterns in group dynamics and understand how ideas affect individuals and communities. Their cognitive strength is especially apparent when intelligence involves communication, coordination, persuasion, mentoring, and understanding complex interpersonal systems.',
    ],
  },
  ENFP: {
    nickname: 'The Enthusiastic Campaigner',
    stack: ['Ne', 'Fi', 'Te', 'Si'],
    paragraphs: [
      'ENFPs are particularly associated with creative ideation, associative thinking, conceptual exploration, pattern recognition, intellectual curiosity, and imaginative problem-solving. They tend to explore many possibilities and make connections between ideas, people, and seemingly unrelated concepts. Their cognitive strength is especially apparent when a problem benefits from originality, flexibility, and the ability to envision unconventional possibilities.',
    ],
  },
  ISTJ: {
    nickname: 'The Disciplined Inspector',
    stack: ['Si', 'Te', 'Fi', 'Ne'],
    paragraphs: [
      'ISTJs are particularly associated with logical organization, detailed analysis, factual reasoning, systematic thinking, memory, and methodical problem-solving. They tend to build knowledge through careful observation and apply established information accurately and consistently. Their cognitive style is especially suited to problems requiring precision, reliability, attention to detail, and disciplined reasoning.',
    ],
  },
  ISFJ: {
    nickname: 'The Defending Nurturer',
    stack: ['Si', 'Fe', 'Ti', 'Ne'],
    paragraphs: [
      'ISFJs are particularly associated with detailed memory, practical reasoning, observational awareness, conscientious analysis, and contextual understanding. They tend to retain information about people, experiences, procedures, and practical circumstances and apply that knowledge carefully. Their cognitive style is especially suited to problems requiring accuracy, consistency, attention to detail, and dependable application of knowledge.',
    ],
  },
  ESTJ: {
    nickname: 'The Directive Executive',
    stack: ['Te', 'Si', 'Ne', 'Fi'],
    paragraphs: [
      'ESTJs are particularly associated with practical reasoning, organizational intelligence, structured decision-making, efficiency, and systematic problem-solving. They tend to evaluate information according to established standards, observable results, and practical consequences. Their cognitive strength is especially apparent when intelligence must be converted into reliable processes, organization, execution, and measurable outcomes.',
    ],
  },
  ESFJ: {
    nickname: 'The Connective Consul',
    stack: ['Fe', 'Si', 'Ne', 'Ti'],
    paragraphs: [
      'ESFJs are particularly associated with social intelligence, practical reasoning, interpersonal awareness, organizational ability, and contextual understanding. They tend to recognize the needs of individuals and groups while organizing information around practical objectives and social expectations. Their cognitive strength is especially apparent when intelligence involves communication, coordination, relationship management, and applying knowledge to real-world situations.',
    ],
  },
  ISTP: {
    nickname: 'The Constructive Virtuoso',
    stack: ['Ti', 'Se', 'Ni', 'Fe'],
    paragraphs: [
      'ISTPs are particularly associated with mechanical reasoning, logical analysis, practical experimentation, troubleshooting, spatial understanding, and independent problem-solving. They tend to understand systems by examining how their components function and testing solutions directly. Their cognitive style is especially suited to technical and hands-on problems requiring precision, adaptability, and logical diagnosis.',
    ],
  },
  ISFP: {
    nickname: 'The Adventurous Artist',
    stack: ['Fi', 'Se', 'Ni', 'Te'],
    paragraphs: [
      'ISFPs are particularly associated with creative perception, observational intelligence, practical adaptability, aesthetic awareness, and experiential understanding. They tend to notice subtle details in their surroundings and express their understanding through direct experience and creative activity. Their cognitive style is especially suited to situations requiring flexibility, sensory awareness, originality, and practical judgment.',
    ],
  },
  ESTP: {
    nickname: 'The Entrepreneurial Promoter',
    stack: ['Se', 'Ti', 'Fe', 'Ni'],
    paragraphs: [
      'ESTPs are particularly associated with rapid situational analysis, practical problem-solving, adaptability, tactical reasoning, and real-time decision-making. They tend to process information quickly and respond effectively to changing circumstances. Their cognitive strength is especially apparent in environments where intelligence must be applied immediately through observation, action, improvisation, and practical judgment.',
    ],
  },
  ESFP: {
    nickname: 'The Entertaining Performer',
    stack: ['Se', 'Fi', 'Te', 'Ni'],
    paragraphs: [
      'ESFPs are particularly associated with situational awareness, practical intelligence, interpersonal responsiveness, adaptability, and experiential learning. They tend to process information through direct engagement with their environment and can respond quickly to changing social or practical circumstances. Their cognitive strength is especially apparent when intelligence requires flexibility, observation, communication, and effective real-world interaction.',
    ],
  },
};
