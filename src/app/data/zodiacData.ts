import { type LucideIcon, Flame, Mountain, Wind, Droplet } from 'lucide-react';

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ZodiacModality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface ZodiacProfile {
  symbolName: string;
  archetype: string;
  dateRangeLabel: string;
  element: ZodiacElement;
  modality: ZodiacModality;
  rulingPlanet: string;
  influencePlanet: string;
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
    symbolName: 'Ram',
    archetype: 'The Pioneering Warrior',
    dateRangeLabel: 'March 21 - April 19',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    influencePlanet: 'Pluto',
    paragraphs: [
      'Being born under Aries makes this a Cardinal Fire sign, forming a bold, energetic General Conscience and Personality. Ruled by Mars and influenced by Pluto, Aries individuals are driven, assertive, and quick to act on instinct.',
      'Aries is courageous and dynamic, often the first to take the leap where others hesitate. Impulsiveness, confrontational confidence, and the occasional emotional outburst can make Aries seem aggressive or domineering, but the intent is almost always forward-moving.',
      'Overall, the Aries Sun Sign is driven toward conquest, action, and leadership. Spontaneous energy ensures ideas are quickly executed, and Aries seeks to be honored for boldness and impact — leaving a legacy of fearless pioneering and power.',
    ],
  },
  Taurus: {
    symbolName: 'Bull',
    archetype: 'The Steadfast Builder',
    dateRangeLabel: 'April 20 - May 20',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    influencePlanet: 'Moon',
    paragraphs: [
      'Being born under Taurus makes this a Fixed Earth sign, forming a grounded, patient General Conscience and Personality. Ruled by Venus, Taurus individuals value comfort, beauty, and steady, tangible progress.',
      'Taurus is dependable and persistent, preferring to build things that last rather than chase fleeting trends. Stubbornness and resistance to change can surface, but it comes from a deep commitment to stability and quality.',
      'Overall, the Taurus Sun Sign is driven toward security, sensory pleasure, and loyalty. Steady effort ensures goals are achieved with lasting results, and Taurus seeks to be honored for reliability — leaving a legacy of enduring craftsmanship.',
    ],
  },
  Gemini: {
    symbolName: 'Twins',
    archetype: 'The Curious Messenger',
    dateRangeLabel: 'May 21 - June 20',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    influencePlanet: 'Jupiter',
    paragraphs: [
      'Being born under Gemini makes this a Mutable Air sign, forming a quick-witted, sociable General Conscience and Personality. Ruled by Mercury, Gemini individuals thrive on communication, ideas, and variety.',
      'Gemini is adaptable and endlessly curious, able to hold multiple interests and perspectives at once. Restlessness and inconsistency can appear, but it stems from a genuine hunger for new information and connection.',
      'Overall, the Gemini Sun Sign is driven toward learning, conversation, and versatility. Mental agility ensures ideas travel fast, and Gemini seeks to be honored for wit and insight — leaving a legacy of connection and exchange.',
    ],
  },
  Cancer: {
    symbolName: 'Crab',
    archetype: 'The Nurturing Guardian',
    dateRangeLabel: 'June 21 - July 22',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    influencePlanet: 'Neptune',
    paragraphs: [
      'Being born under Cancer makes this a Cardinal Water sign, forming a deeply emotional, protective General Conscience and Personality. Ruled by the Moon, Cancer individuals are intuitive, nurturing, and attuned to feelings.',
      'Cancer is loyal and caring, often putting family and close bonds above all else. Moodiness and defensiveness can surface when feeling vulnerable, but underneath is a fierce devotion to those it loves.',
      'Overall, the Cancer Sun Sign is driven toward emotional security, home, and belonging. Instinctive care ensures loved ones are protected, and Cancer seeks to be honored for devotion — leaving a legacy of warmth and nurture.',
    ],
  },
  Leo: {
    symbolName: 'Lion',
    archetype: 'The Radiant Sovereign',
    dateRangeLabel: 'July 23 - August 22',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    influencePlanet: 'Mars',
    paragraphs: [
      'Being born under Leo makes this a Fixed Fire sign, forming a confident, expressive General Conscience and Personality. Ruled by the Sun, Leo individuals are warm, generous, and naturally drawn to the spotlight.',
      'Leo is proud and loyal, leading with heart and a desire to make others feel celebrated. Pride and a need for recognition can surface, but it comes from genuine warmth and a drive to inspire.',
      'Overall, the Leo Sun Sign is driven toward creativity, leadership, and generosity. Radiant confidence ensures Leo stands out, and Leo seeks to be honored for its heart — leaving a legacy of inspiration and pride.',
    ],
  },
  Virgo: {
    symbolName: 'Maiden',
    archetype: 'The Meticulous Healer',
    dateRangeLabel: 'August 23 - September 22',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    influencePlanet: 'Chiron',
    paragraphs: [
      'Being born under Virgo makes this a Mutable Earth sign, forming a precise, service-oriented General Conscience and Personality. Ruled by Mercury, Virgo individuals are analytical, practical, and detail-focused.',
      'Virgo is diligent and helpful, finding purpose in improving systems and supporting others. Overcritical tendencies and perfectionism can surface, but it comes from a sincere desire for things to be done well.',
      'Overall, the Virgo Sun Sign is driven toward order, usefulness, and mastery of craft. Careful attention ensures quality and reliability, and Virgo seeks to be honored for competence — leaving a legacy of quiet excellence.',
    ],
  },
  Libra: {
    symbolName: 'Scales',
    archetype: 'The Harmonious Diplomat',
    dateRangeLabel: 'September 23 - October 22',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    influencePlanet: 'Saturn',
    paragraphs: [
      'Being born under Libra makes this a Cardinal Air sign, forming a balanced, relational General Conscience and Personality. Ruled by Venus, Libra individuals value fairness, beauty, and partnership.',
      'Libra is charming and diplomatic, skilled at seeing multiple sides of a situation. Indecisiveness and people-pleasing can surface, but it comes from a genuine wish for peace and equity.',
      'Overall, the Libra Sun Sign is driven toward harmony, justice, and connection. Thoughtful balance ensures fair outcomes, and Libra seeks to be honored for grace — leaving a legacy of diplomacy and beauty.',
    ],
  },
  Scorpio: {
    symbolName: 'Scorpion',
    archetype: 'The Intense Transformer',
    dateRangeLabel: 'October 23 - November 21',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto',
    influencePlanet: 'Mars',
    paragraphs: [
      'Being born under Scorpio makes this a Fixed Water sign, forming an intense, penetrating General Conscience and Personality. Ruled by Pluto and influenced by Mars, Scorpio individuals are passionate, strategic, and drawn to depth.',
      'Scorpio is loyal and resilient, unafraid to face what others avoid. Jealousy and secrecy can surface when trust feels threatened, but underneath is a powerful capacity for transformation and truth.',
      'Overall, the Scorpio Sun Sign is driven toward depth, power, and reinvention. Fearless intensity ensures nothing stays hidden for long, and Scorpio seeks to be honored for strength — leaving a legacy of transformation.',
    ],
  },
  Sagittarius: {
    symbolName: 'Archer',
    archetype: 'The Adventurous Philosopher',
    dateRangeLabel: 'November 22 - December 21',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    influencePlanet: 'Mercury',
    paragraphs: [
      'Being born under Sagittarius makes this a Mutable Fire sign, forming an optimistic, exploratory General Conscience and Personality. Ruled by Jupiter, Sagittarius individuals are adventurous, honest, and driven to seek meaning.',
      'Sagittarius is free-spirited and open-minded, always chasing the next horizon or big idea. Bluntness and restlessness can surface, but it comes from an authentic love of truth and freedom.',
      'Overall, the Sagittarius Sun Sign is driven toward exploration, wisdom, and growth. Boundless optimism ensures new paths are always found, and Sagittarius seeks to be honored for insight — leaving a legacy of adventure.',
    ],
  },
  Capricorn: {
    symbolName: 'Sea-Goat',
    archetype: 'The Disciplined Achiever',
    dateRangeLabel: 'December 22 - January 19',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    influencePlanet: 'Mars',
    paragraphs: [
      'Being born under Capricorn makes this a Cardinal Earth sign, forming a disciplined, ambitious General Conscience and Personality. Ruled by Saturn, Capricorn individuals are patient, responsible, and focused on long-term achievement.',
      'Capricorn is hardworking and resilient, willing to climb slowly toward lasting success. Rigidity and a fear of failure can surface, but it comes from a deep respect for structure and accomplishment.',
      'Overall, the Capricorn Sun Sign is driven toward mastery, status, and legacy. Steady discipline ensures goals are eventually reached, and Capricorn seeks to be honored for achievement — leaving a legacy of enduring success.',
    ],
  },
  Aquarius: {
    symbolName: 'Water-Bearer',
    archetype: 'The Visionary Rebel',
    dateRangeLabel: 'January 20 - February 18',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus',
    influencePlanet: 'Saturn',
    paragraphs: [
      'Being born under Aquarius makes this a Fixed Air sign, forming an independent, forward-thinking General Conscience and Personality. Ruled by Uranus, Aquarius individuals are innovative, humanitarian, and unafraid to break convention.',
      'Aquarius is original and idealistic, often ahead of its time in vision. Detachment and stubbornness can surface, but it comes from a strong commitment to individuality and progress.',
      'Overall, the Aquarius Sun Sign is driven toward innovation, community, and change. Unconventional thinking ensures new ideas take root, and Aquarius seeks to be honored for originality — leaving a legacy of progress.',
    ],
  },
  Pisces: {
    symbolName: 'Fish',
    archetype: 'The Empathic Dreamer',
    dateRangeLabel: 'February 19 - March 20',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune',
    influencePlanet: 'Jupiter',
    paragraphs: [
      'Being born under Pisces makes this a Mutable Water sign, forming a compassionate, imaginative General Conscience and Personality. Ruled by Neptune, Pisces individuals are intuitive, artistic, and deeply empathetic.',
      'Pisces is gentle and dreamy, often absorbing the emotions of those around it. Escapism and over-sensitivity can surface, but it comes from a profound capacity for compassion and creativity.',
      'Overall, the Pisces Sun Sign is driven toward empathy, art, and spiritual connection. Boundless imagination ensures beauty is found everywhere, and Pisces seeks to be honored for compassion — leaving a legacy of healing and wonder.',
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

export function getZodiacAppearanceSummary(sign: ZodiacSign, profile: ZodiacProfile): string {
  return `The ${sign} (${profile.symbolName}) is traditionally associated with a ${profile.element.toLowerCase()}-led presence, ${profile.modality.toLowerCase()} expression, and the influence of ${profile.rulingPlanet}.`;
}
