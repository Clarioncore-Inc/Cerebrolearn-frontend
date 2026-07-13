export type IQTestType =
  | 'culture_fair_intelligence_test'
  | 'weschler_intelligence_test'
  | 'wechsler_intelligence_scale_for_children'
  | 'stanford_binet'
  | 'ravens_progressive_matrices';

export const DEFAULT_IQ_TEST_TYPE: IQTestType = 'culture_fair_intelligence_test';

const IQ_TEST_TYPE_LABELS: Record<IQTestType, string> = {
  culture_fair_intelligence_test: 'Culture Fair Intelligence Test',
  weschler_intelligence_test: 'Wechsler Intelligence Test',
  wechsler_intelligence_scale_for_children:
    'Wechsler Intelligence Scale for Children (WISC)',
  stanford_binet: 'Stanford-Binet',
  ravens_progressive_matrices: "Raven's Progressive Matrices",
};

export const IQ_TEST_TYPE_OPTIONS: Array<{
  value: IQTestType;
  label: string;
  description: string;
}> = [
  {
    value: 'culture_fair_intelligence_test',
    label: IQ_TEST_TYPE_LABELS.culture_fair_intelligence_test,
    description:
      'A non-verbal assessment focused on pattern recognition, classification, series completion, and matrix reasoning to reduce the influence of language and cultural background.',
  },
  {
    value: 'weschler_intelligence_test',
    label: IQ_TEST_TYPE_LABELS.weschler_intelligence_test,
    description:
      'A broad intelligence assessment that reviews verbal comprehension, working memory, processing speed, and perceptual reasoning through structured tasks.',
  },
  {
    value: 'wechsler_intelligence_scale_for_children',
    label: IQ_TEST_TYPE_LABELS.wechsler_intelligence_scale_for_children,
    description:
      'A child-focused Wechsler assessment with age-appropriate tasks across verbal comprehension, reasoning, and working memory.',
  },
  {
    value: 'stanford_binet',
    label: IQ_TEST_TYPE_LABELS.stanford_binet,
    description:
      'A broad cognitive assessment covering fluid reasoning, knowledge, quantitative reasoning, visual-spatial processing, and working memory.',
  },
  {
    value: 'ravens_progressive_matrices',
    label: IQ_TEST_TYPE_LABELS.ravens_progressive_matrices,
    description:
      'A non-verbal matrix-based assessment centered on abstract pattern recognition and visual reasoning.',
  },
];

export const isIQTestType = (value?: string | null): value is IQTestType =>
  IQ_TEST_TYPE_OPTIONS.some((option) => option.value === value);

const humanizeTestType = (value: string) =>
  value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const formatIQTestType = (
  testType?: string | null,
  fallback = 'Official IQ Test',
) => {
  const normalized = testType?.trim();
  if (!normalized) return fallback;

  return (
    IQ_TEST_TYPE_LABELS[normalized as IQTestType] ??
    (normalized.includes('_') ? humanizeTestType(normalized) : normalized)
  );
};