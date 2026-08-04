// Personality Database (PDB-style) module type definitions
// Standalone module: subjects can be linked to an existing Genius profile
// (via geniusId) or exist independently as custom entries.

import { MBTIType } from '../data/mbtiData';

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
  /** Primary/consensus MBTI type shown in the Cognitive & Personality tab. */
  mbtiType?: MBTIType;
}
