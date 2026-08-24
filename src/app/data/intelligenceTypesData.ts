import {
  type LucideIcon,
  Palette,
  Puzzle,
  Microscope,
  Infinity as InfinityIcon,
  Camera,
  Brain,
  Languages,
  Music,
  UserCircle,
  Leaf,
  Flame,
  Calculator,
  Dumbbell,
  Shapes,
  Users,
  Wrench,
  MessageCircle,
  ScanEye,
} from 'lucide-react';

export type IntelligenceTypeKey =
  | 'creative'
  | 'logical_perceptual'
  | 'analytical'
  | 'existential'
  | 'long_term_memory'
  | 'implicit'
  | 'linguistic'
  | 'musical_rhythmic'
  | 'intrapersonal'
  | 'naturalistic'
  | 'motivational'
  | 'logical_mathematical'
  | 'bodily_kinesthetic'
  | 'visual_spatial'
  | 'interpersonal'
  | 'practical'
  | 'social_intelligence'
  | 'perceptual';

interface IntelligenceTypeMeta {
  label: string;
  description: string;
  icon: LucideIcon;
}

// The Intelligence Types from the Cerebrolearn profile specification.
export const INTELLIGENCE_TYPES: Record<IntelligenceTypeKey, IntelligenceTypeMeta> = {
  creative: {
    label: 'Creative',
    description: 'Originality, imagination, and the ability to generate novel ideas.',
    icon: Palette,
  },
  logical_perceptual: {
    label: 'Logical-Perceptual (Fluid)',
    description: 'Reasoning with new, unfamiliar problems independent of prior knowledge.',
    icon: Puzzle,
  },
  analytical: {
    label: 'Analytical (Fluid)',
    description: 'Breaking down complex information and drawing structured conclusions.',
    icon: Microscope,
  },
  existential: {
    label: 'Existential',
    description: 'Grappling with deep questions about purpose, meaning, and life.',
    icon: InfinityIcon,
  },
  long_term_memory: {
    label: 'Long-Term / Photographic Memory',
    description: 'Storing and recalling detailed information over extended periods.',
    icon: Camera,
  },
  implicit: {
    label: 'Implicit (Subconscious)',
    description: 'Learning and pattern recognition that happens below conscious awareness.',
    icon: Brain,
  },
  linguistic: {
    label: 'Verbal-Linguistic Intelligence',
    description: 'Skill with words, language acquisition, and verbal expression.',
    icon: Languages,
  },
  musical_rhythmic: {
    label: 'Musical-Rhythmic',
    description: 'Sensitivity to rhythm, pitch, tone, and musical patterns.',
    icon: Music,
  },
  intrapersonal: {
    label: 'Intrapersonal',
    description: 'Self-awareness, introspection, and understanding of one\u2019s own emotions.',
    icon: UserCircle,
  },
  naturalistic: {
    label: 'Naturalistic',
    description: 'Recognizing and categorizing patterns found in the natural world.',
    icon: Leaf,
  },
  motivational: {
    label: 'Motivational',
    description: 'Drive, persistence, and the ability to sustain effort toward goals.',
    icon: Flame,
  },
  logical_mathematical: {
    label: 'Logical-Mathematical',
    description: 'Numerical reasoning, quantitative problem-solving, and logical deduction.',
    icon: Calculator,
  },
  bodily_kinesthetic: {
    label: 'Bodily-Kinesthetic',
    description: 'Physical coordination, body control, and hands-on skill with movement.',
    icon: Dumbbell,
  },
  visual_spatial: {
    label: 'Visual-Spatial',
    description: 'Visualizing, manipulating, and reasoning about shapes, space, and imagery.',
    icon: Shapes,
  },
  interpersonal: {
    label: 'Interpersonal',
    description: 'Reading others’ emotions and motivations, and building effective relationships.',
    icon: Users,
  },
  practical: {
    label: 'Practical',
    description: 'Applying knowledge and skills to solve real-world, everyday problems.',
    icon: Wrench,
  },
  social_intelligence: {
    label: 'Social Intelligence',
    description: 'Navigating social situations and building rapport within groups.',
    icon: MessageCircle,
  },
  perceptual: {
    label: 'Perceptual',
    description: 'Rapidly detecting, discriminating, and processing sensory information.',
    icon: ScanEye,
  },
};

export const INTELLIGENCE_TYPE_KEYS: IntelligenceTypeKey[] = Object.keys(
  INTELLIGENCE_TYPES,
) as IntelligenceTypeKey[];
