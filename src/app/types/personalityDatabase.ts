// Personality Database (PDB-style) module type definitions
// Standalone module: subjects can be linked to an existing Genius profile
// (via geniusId) or exist independently as custom entries.

export type PersonalitySystemId =
  | 'mbti'
  | 'enneagram'
  | 'instinctualVariant'
  | 'tritype'
  | 'classicJungian'
  | 'socionics'
  | 'attitudinalPsyche'
  | 'temperament'
  | 'big5Extraversion'
  | 'big5Neuroticism'
  | 'big5Agreeableness'
  | 'big5Conscientiousness'
  | 'big5Openness'
  | 'big5Sloan';

export interface PersonalitySystemMeta {
  id: PersonalitySystemId;
  label: string;
  shortLabel: string;
  /** Ordered list of valid type codes for this system, e.g. 16 MBTI codes. */
  typeCodes: string[];
  /** Human-friendly names/nicknames keyed by type code. */
  typeNames: Record<string, string>;
}

export type SubjectCategory =
  | 'Historical Figure'
  | 'Public Intellectual'
  | 'Fictional Character'
  | 'Celebrity'
  | 'Musician'
  | 'Athlete';

export interface PDBSubject {
  id: string;
  slug: string;
  name: string;
  category: SubjectCategory;
  subcategory?: string;
  subtitle: string;
  imageUrl: string | null;
  /** Whether this subject mirrors an existing Genius profile record. */
  sourceType: 'genius' | 'custom';
  /** Genius.id this subject is linked to, when sourceType === 'genius'. */
  geniusId?: string;
}

export interface PDBVoteTally {
  subjectId: string;
  systemId: PersonalitySystemId;
  typeCode: string;
  votes: number;
}

export interface PDBTypeResult {
  typeCode: string;
  typeName: string;
  votes: number;
  percentage: number;
}

export interface PDBComment {
  id: string;
  subjectId: string;
  parentId: string | null;
  authorName: string;
  isAnonymous: boolean;
  text: string;
  createdAt: string;
  upvotes: number;
  downvotes?: number;
}

export interface PDBCommentNode extends PDBComment {
  replies: PDBCommentNode[];
}
