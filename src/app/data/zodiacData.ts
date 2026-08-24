import { type LucideIcon, Flame, Mountain, Wind, Droplet } from 'lucide-react';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ZodiacModality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface ZodiacProfile {
  symbolName: string;
  archetype: string;
  mbtiArchetype: string;
  dateRangeLabel: string;
  element: ZodiacElement;
  modality: ZodiacModality;
  rulingPlanet: string;
  influencePlanet?: string;
  exaltationPlanet?: string;
  /** [cognitive style / rulership, characterization, overall summary] — the intro sentence is generated separately via getZodiacParagraphs. */
  paragraphs: [string, string, string];
}

export const ZODIAC_ELEMENT_ICONS: Record<ZodiacElement, LucideIcon> = {
  Fire: Flame,
  Earth: Mountain,
  Air: Wind,
  Water: Droplet,
};

export const ZODIAC_PROFILES: Record<ZodiacSign, ZodiacProfile> = {
  Aries: {
    symbolName: 'The Ram',
    archetype: 'The Pioneering Warrior',
    mbtiArchetype: 'ESTP',
    dateRangeLabel: 'March 21st - April 19th',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    influencePlanet: 'Pluto',
    exaltationPlanet: 'Sun',
    paragraphs: [
      '{name}’s Aries Sun Sign is a (CARDINAL (Visionary)-FIRE (Intuitive)) (Volcano) modal-element, making his/her cognitive style associated with initiative, rapid decision-making, experimentation, and pioneering thought. Aries is ruled by Mars and influenced by Pluto, which associates his/her intelligence with assertiveness, mental courage, competitiveness, independence, decisiveness, problem-solving under pressure, risk-taking, innovation, and action-oriented thinking.',
      '{name}’s Aries intelligence is characterized by a willingness to act upon ideas quickly and learn through direct experimentation. He/she may excel at identifying opportunities, making rapid judgments, and developing solutions when immediate action is required.',
      'Overall, {name}’s Aries Sun Sign is associated with pioneering intelligence, decisive reasoning, inventive action, and intellectual courage, emphasizing the ability to turn ideas into action and approach difficult problems without hesitation.',
    ],
  },
  Taurus: {
    symbolName: 'The Bull',
    archetype: 'The Designing Banker',
    mbtiArchetype: 'ISFP',
    dateRangeLabel: 'April 20th - May 20th',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    exaltationPlanet: 'Moon',
    paragraphs: [
      '{name}’s Taurus Sun Sign is a (FIXED (Focused)-EARTH (Logic)) (Rock) modal-element, making his/her cognitive style associated with concentration, persistence, practicality, and deliberate reasoning. Taurus is ruled by Venus, which associates his/her intelligence with patience, stability, applied reasoning, design-oriented thinking, sensory awareness, persistence, practical problem-solving, resource management, and long-term learning.',
      '{name}’s Taurus intelligence is characterized by the ability to remain focused on a problem and gradually develop reliable solutions. He/she may prefer concrete knowledge, practical applications, and methods that produce tangible and lasting results.',
      'Overall, {name}’s Taurus Sun Sign is associated with practical intelligence, sustained concentration, deliberate reasoning, design thinking, and persistent problem-solving, emphasizing the ability to build knowledge and solutions gradually.',
    ],
  },
  Gemini: {
    symbolName: 'The Twins',
    archetype: 'The Thinking Messenger',
    mbtiArchetype: 'ENTP',
    dateRangeLabel: 'May 21st - June 20th',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    paragraphs: [
      '{name}’s Gemini Sun Sign is a (MUTABLE (Versatile)-AIR (Idealistic)) (Wind) modal-element, making his/her cognitive style associated with curiosity, adaptability, communication, and rapid information processing. Gemini is ruled by Mercury, which associates his/her intelligence with verbal reasoning, intellectual curiosity, pattern recognition, information gathering, mental agility, communication, brainstorming, multitasking, and conceptual association.',
      '{name}’s Gemini intelligence is characterized by the ability to rapidly connect different pieces of information and generate multiple perspectives on a subject. He/she may particularly enjoy learning through conversation, debate, questioning, experimentation, and exposure to diverse ideas.',
      'Overall, {name}’s Gemini Sun Sign is associated with verbal intelligence, mental flexibility, rapid learning, associative thinking, communication, and intellectual versatility, emphasizing the ability to connect and exchange ideas quickly.',
    ],
  },
  Cancer: {
    symbolName: 'The Crab',
    archetype: 'The Healing Mother',
    mbtiArchetype: 'ISFJ',
    dateRangeLabel: 'June 21st - July 22nd',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    exaltationPlanet: 'Jupiter',
    paragraphs: [
      '{name}’s Cancer Sun Sign is a (CARDINAL (Visionary)-WATER (Perceptive)) (Tide) modal-element, making his/her cognitive style associated with perception, memory, intuition, and contextual understanding. Cancer is ruled by the Moon, which associates his/her intelligence with emotional perception, memory, intuitive reasoning, contextual awareness, imaginative thinking, pattern recognition, and sensitivity to environmental information.',
      '{name}’s Cancer intelligence is characterized by the ability to retain meaningful information and understand situations through context and accumulated experience. He/she may be particularly attentive to subtle emotional or environmental patterns that other people overlook.',
      'Overall, {name}’s Cancer Sun Sign is associated with intuitive intelligence, strong contextual awareness, memory, emotional perception, and imaginative reasoning, emphasizing the ability to understand information through experience and context.',
    ],
  },
  Leo: {
    symbolName: 'The Lion',
    archetype: 'The Creative King',
    mbtiArchetype: 'ENFP',
    dateRangeLabel: 'July 23rd - August 22nd',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'the Sun',
    exaltationPlanet: 'Neptune',
    paragraphs: [
      '{name}’s Leo Sun Sign is a (FIXED (Focused)-FIRE (Intuitive)) (Sunlight) modal-element, making his/her cognitive style associated with creativity, expressive thinking, confidence, and focused ideation. Leo is ruled by the Sun, which associates his/her intelligence with creative expression, leadership thinking, originality, visualization, performance, persuasive communication, confidence in ideas, and the ability to inspire others intellectually.',
      '{name}’s Leo intelligence is characterized by the ability to develop ideas and communicate them with clarity, confidence, and expressive force. He/she may excel when intellectual work allows creativity and personal originality to become visible.',
      'Overall, {name}’s Leo Sun Sign is associated with creative intelligence, expressive reasoning, intellectual leadership, originality, and persuasive communication, emphasizing the ability to transform ideas into compelling intellectual expressions.',
    ],
  },
  Virgo: {
    symbolName: 'The Virgin',
    archetype: 'The Analytical Maiden',
    mbtiArchetype: 'INTP',
    dateRangeLabel: 'August 23rd - September 22nd',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    exaltationPlanet: 'Mercury',
    paragraphs: [
      '{name}’s Virgo Sun Sign is a (MUTABLE (Versatile)-EARTH (Logic)) (Soil) modal-element, making his/her cognitive style associated with analysis, precision, organization, and systematic improvement. Virgo is ruled by Mercury, which associates his/her intelligence with analytical reasoning, attention to detail, critical thinking, categorization, optimization, practical problem-solving, accuracy, and systematic learning.',
      '{name}’s Virgo intelligence is characterized by the ability to break complex information into smaller components and identify inconsistencies or areas for improvement. He/she may excel at refining systems, detecting errors, and developing precise solutions.',
      'Overall, {name}’s Virgo Sun Sign is associated with analytical intelligence, precision, systematic reasoning, critical thinking, and optimization, emphasizing the ability to improve knowledge and systems through careful examination.',
    ],
  },
  Libra: {
    symbolName: 'The Scales',
    archetype: 'The Harmonizing Diplomat',
    mbtiArchetype: 'ESFP',
    dateRangeLabel: 'September 23rd - October 22nd',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    exaltationPlanet: 'Saturn',
    paragraphs: [
      '{name}’s Libra Sun Sign is a (CARDINAL (Visionary)-AIR (Idealistic)) (Wind) modal-element, making his/her cognitive style associated with comparison, balance, social perception, and conceptual evaluation. Libra is ruled by Venus, which associates his/her intelligence with social reasoning, perspective-taking, diplomacy, comparative analysis, aesthetic cognition, negotiation, balance, and evaluating multiple sides of an issue.',
      '{name}’s Libra intelligence is characterized by the ability to recognize competing perspectives and search for equilibrium between them. He/she may be particularly capable of considering how different ideas interact within social or conceptual systems.',
      'Overall, {name}’s Libra Sun Sign is associated with social intelligence, comparative reasoning, perspective-taking, diplomatic thinking, and aesthetic intelligence, emphasizing the ability to evaluate multiple viewpoints and identify balance.',
    ],
  },
  Scorpio: {
    symbolName: 'The Scorpion',
    archetype: 'The Researching Sorcerer',
    mbtiArchetype: 'INTP',
    dateRangeLabel: 'October 23rd - November 21st',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto',
    influencePlanet: 'Mars',
    exaltationPlanet: 'Uranus',
    paragraphs: [
      '{name}’s Scorpio Sun Sign is a (FIXED (Focused)-WATER (Perceptive)) (Ice) modal-element, making his/her cognitive style associated with depth, investigation, concentration, and uncovering hidden information. Scorpio is ruled by Pluto and influenced by Mars, which associates his/her intelligence with research, deductive reasoning, psychological perception, strategic thinking, investigation, persistence, pattern recognition, and deep analysis.',
      '{name}’s Scorpio intelligence is characterized by a tendency to investigate subjects beyond their surface-level explanations. He/she may be particularly interested in hidden mechanisms, complex systems, mysteries, and difficult questions requiring sustained intellectual concentration.',
      'Overall, {name}’s Scorpio Sun Sign is associated with investigative intelligence, deep analytical reasoning, strategic thinking, psychological perception, and research, emphasizing the pursuit of underlying causes and hidden information.',
    ],
  },
  Sagittarius: {
    symbolName: 'The Centaur-Archer',
    archetype: 'The Philosophical Explorer',
    mbtiArchetype: 'ENTP',
    dateRangeLabel: 'November 22nd - December 21st',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    influencePlanet: 'Neptune',
    paragraphs: [
      '{name}’s Sagittarius Sun Sign is a (MUTABLE (Versatile)-FIRE (Intuitive)) (Lightning) modal-element, making his/her cognitive style associated with exploration, abstraction, philosophy, and expansive thinking. Sagittarius is ruled by Jupiter, which associates his/her intelligence with philosophical reasoning, conceptual exploration, intellectual curiosity, synthesis, big-picture thinking, abstract thinking, teaching, and pursuit of knowledge.',
      '{name}’s Sagittarius intelligence is characterized by a tendency to connect individual facts into broader theories and conceptual frameworks. He/she may be particularly motivated by questions involving meaning, truth, philosophy, science, culture, and the larger structure of reality.',
      'Overall, {name}’s Sagittarius Sun Sign is associated with philosophical intelligence, abstract reasoning, intellectual exploration, synthesis, and big-picture thinking, emphasizing the expansion and integration of knowledge.',
    ],
  },
  Capricorn: {
    symbolName: 'The Sea-Goat',
    archetype: 'The Architectural Archmage',
    mbtiArchetype: 'INTJ',
    dateRangeLabel: 'December 22nd - January 19th',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    influencePlanet: 'Uranus',
    exaltationPlanet: 'Mars',
    paragraphs: [
      '{name}’s Capricorn Sun Sign is a (CARDINAL (Visionary)-EARTH (Logic)) (Mountain) modal-element, making his/her cognitive style associated with logical reasoning, structure, discipline, strategic planning, systematic thinking, and long-term intellectual development. Capricorn is ruled by Saturn and influenced by Uranus, associating his/her intelligence with organization, constructive reasoning, practical problem-solving, technical thinking, strategic planning, knowledge accumulation, persistence, innovation, and structured creativity.',
      '{name}’s Capricorn intelligence is characterized by the ability to organize complex information into structured systems and pursue difficult intellectual objectives over long periods. He/she may be particularly drawn toward mathematics, science, engineering, technology, philosophy, business strategy, and other fields requiring systematic reasoning.',
      'Overall, {name}’s Capricorn Sun Sign is associated with logical, methodical, strategic, constructive, and disciplined intelligence, emphasizing the ability to transform complex knowledge into structured systems, practical solutions, and long-term intellectual achievements.',
    ],
  },
  Aquarius: {
    symbolName: 'The Water Bearer',
    archetype: 'The Revolutionary Mad-Scientist',
    mbtiArchetype: 'INTP',
    dateRangeLabel: 'January 20th - February 18th',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus',
    influencePlanet: 'Saturn',
    paragraphs: [
      '{name}’s Aquarius Sun Sign is a (FIXED (Focused)-AIR (Idealistic)) (Atmosphere) modal-element, making his/her cognitive style associated with originality, abstraction, innovation, independence, and unconventional thinking. Aquarius is ruled by Uranus and influenced by Saturn, associating his/her intelligence with inventive reasoning, scientific thinking, experimentation, technological thinking, abstract pattern recognition, unconventional problem-solving, systems thinking, and future-oriented ideas.',
      '{name}’s Aquarius intelligence is characterized by questioning established assumptions and exploring alternative explanations or possibilities. He/she may be particularly interested in science, technology, invention, theoretical concepts, social systems, and ideas concerning the future.',
      'Overall, {name}’s Aquarius Sun Sign is associated with innovative intelligence, scientific thinking, abstract reasoning, technological creativity, and unconventional problem-solving, emphasizing originality and the exploration of new intellectual possibilities.',
    ],
  },
  Pisces: {
    symbolName: 'The Two-Fishes',
    archetype: 'The Imaginative Mystic',
    mbtiArchetype: 'INFP',
    dateRangeLabel: 'February 19th - March 20th',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune',
    influencePlanet: 'Jupiter',
    exaltationPlanet: 'Venus',
    paragraphs: [
      '{name}’s Pisces Sun Sign is a (MUTABLE (Versatile)-WATER (Perceptive)) (Ocean) modal-element, making his/her cognitive style associated with imagination, intuition, creativity, and holistic perception. Pisces is ruled by Neptune and influenced by Jupiter, associating his/her intelligence with creative thinking, intuitive reasoning, imagination, symbolic thinking, artistic cognition, emotional perception, abstraction, synthesis, and exploration of intangible concepts.',
      '{name}’s Pisces intelligence is characterized by the ability to approach information through imagination, symbolism, intuition, and interconnected concepts. He/she may be particularly drawn toward artistic, philosophical, spiritual, psychological, or imaginative subjects.',
      'Overall, {name}’s Pisces Sun Sign is associated with creative intelligence, intuitive reasoning, imaginative thinking, holistic perception, and abstract cognition, emphasizing the ability to explore ideas through symbolism, intuition, and interconnected patterns.',
    ],
  },
};

const ZODIAC_DATE_RANGES: Array<{ sign: ZodiacSign; startMonth: number; startDay: number; endMonth: number; endDay: number }> = [
  { sign: 'Capricorn', startMonth: 1, startDay: 1, endMonth: 1, endDay: 19 },
  { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
  { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 12, endDay: 31 },
];

const ZODIAC_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

/** Formats a `YYYY-MM-DD` date-of-birth string as e.g. "December 28th" (year omitted). */
export function formatZodiacBirthDate(dateOfBirth: string): string | null {
  const [, monthStr, dayStr] = dateOfBirth.split('-');
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!month || !day || month < 1 || month > 12) return null;
  return `${ZODIAC_MONTH_NAMES[month - 1]} ${day}${getOrdinalSuffix(day)}`;
}

/** Resolves a zodiac sign from a `YYYY-MM-DD` date-of-birth string. */
export function getZodiacSign(dateOfBirth: string): ZodiacSign | null {
  const [, monthStr, dayStr] = dateOfBirth.split('-');
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!month || !day) return null;

  const match = ZODIAC_DATE_RANGES.find(({ startMonth, startDay, endMonth, endDay }) => {
    if (startMonth === endMonth) {
      return month === startMonth && day >= startDay && day <= endDay;
    }
    return (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    );
  });

  return match?.sign ?? null;
}

/**
 * Builds the "What the Sun in {sign} Means Regarding Intelligence" paragraphs for a
 * specific person, generating the intro sentence from the sign's data and personalizing
 * the rest of the profile's stored paragraphs with the given name and pronouns.
 */
export function getZodiacParagraphs(
  sign: ZodiacSign,
  name: string,
  birthDateLabel: string,
  gender?: string | null,
): string[] {
  const profile = ZODIAC_PROFILES[sign];
  const { possessive, subject } = resolveZodiacPronouns(gender);
  const intro = `${name} being born on ${birthDateLabel} between ${profile.dateRangeLabel} makes ${possessive} Sun Sign ${sign} (${profile.symbolName}) (${profile.archetype}) (${profile.mbtiArchetype}), forming ${possessive} General Conscience and Personality.`;
  const resolvedParagraphs = profile.paragraphs.map((paragraph) =>
    paragraph
      .replaceAll('{name}', name)
      .replaceAll('his/her', possessive)
      .replaceAll('He/she', capitalize(subject)),
  );
  return [intro, ...resolvedParagraphs];
}

/** Resolves possessive/subject pronouns from a free-text gender field, defaulting to "their"/"they". */
function resolveZodiacPronouns(gender?: string | null): { possessive: string; subject: string } {
  const normalized = (gender ?? '').trim().toLowerCase();
  if (['male', 'man', 'm', 'boy'].includes(normalized)) return { possessive: 'his', subject: 'he' };
  if (['female', 'woman', 'f', 'girl'].includes(normalized)) return { possessive: 'her', subject: 'she' };
  return { possessive: 'their', subject: 'they' };
}

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);
