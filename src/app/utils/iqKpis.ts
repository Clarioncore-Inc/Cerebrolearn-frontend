export const IQ_KPI_OPTIONS = [
  'Pattern Recognition',
  'Working Memory',
  'Processing Speed',
  'Verbal Intelligence',
  'Spatial Reasoning',
] as const;

export type IQKpiLabel = (typeof IQ_KPI_OPTIONS)[number];

const LEGACY_CATEGORY_TO_KPI: Record<string, IQKpiLabel> = {
  'Pattern Recognition': 'Pattern Recognition',
  'Logical Reasoning': 'Working Memory',
  Mathematical: 'Working Memory',
  'Spatial Awareness': 'Spatial Reasoning',
  'Verbal Reasoning': 'Verbal Intelligence',
  'Working Memory': 'Working Memory',
  'Processing Speed': 'Processing Speed',
  'Verbal Intelligence': 'Verbal Intelligence',
  'Spatial Reasoning': 'Spatial Reasoning',
};

export function normalizeIQKpiCategory(category?: string | null): IQKpiLabel {
  if (!category) {
    return 'Pattern Recognition';
  }

  return LEGACY_CATEGORY_TO_KPI[category.trim()] ?? 'Pattern Recognition';
}