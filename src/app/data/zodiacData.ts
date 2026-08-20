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
      'Being born under Aries makes this a Cardinal Fire (Volcano) sign, forming a visionary, authoritative, and passionate General Conscience and Personality. Ruled by Mars and influenced by Pluto, Aries individuals are bold, energetic, competitive, assertive, fearless, quick-acting, passionate, independent, pioneering, impatient, emotionally intense, action-oriented, protective, and determined.',
      'Aries is courageous and dynamic, but impulsiveness, confrontational confidence, and emotional outbursts can sometimes make Aries appear aggressive, selfish, or domineering.',
      'Overall, the Aries Sun Sign is driven toward conquest, action, and leadership. Spontaneous energy ensures ideas are quickly executed, and Aries seeks to be honored for boldness and impact — leaving a legacy of fearless pioneering and power.',
    ],
  },
  Taurus: {
    symbolName: 'Bull',
    archetype: 'The Grounded Builder',
    dateRangeLabel: 'April 20 - May 20',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    influencePlanet: 'Moon',
    paragraphs: [
      "Being born under Taurus makes this a Fixed Earth (Rock) sign, forming a stabilizing, determined, and materially focused General Conscience and Personality. Ruled by Venus and influenced by Earth's magnetic steadiness, Taurus individuals are calm, reliable, loyal, comfort-seeking, protective, sensual, affectionate, deliberate, stubborn, persevering, practical, patient, and financially minded.",
      'Taurus is dependable and nurturing, but attachment to routine, sensitivity to change, and firm opinions can sometimes make Taurus appear stubborn, slow-moving, or overly possessive.',
      'Overall, the Taurus Sun Sign is driven toward long-term stability, beauty, and tangible results. Dedication ensures lasting structures in life and relationships, and Taurus seeks to be honored for loyalty and achievements — leaving a legacy of abundance and endurance.',
    ],
  },
  Gemini: {
    symbolName: 'Twins',
    archetype: 'The Thinking Messenger',
    dateRangeLabel: 'May 21 - June 20',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    influencePlanet: 'Jupiter',
    paragraphs: [
      'Being born under Gemini makes this a Mutable Air (Wind) sign, forming a curious, versatile, and mentally alert General Conscience and Personality. Ruled by Mercury, Gemini individuals are witty, adaptable, sociable, clever, youthful, intellectual, quick-witted, talkative, humorous, inquisitive, charming, multitasking, restless, and unpredictable.',
      'Gemini is communicative and spontaneous, but scattered focus, dual nature, and a tendency to intellectualize emotions can sometimes make Gemini appear flaky, inconsistent, deceitful, or overly sarcastic.',
      'Overall, the Gemini Sun Sign is driven toward intellectual stimulation, novelty, and expressive communication. Mental agility ensures rapid learning and adaptability, and Gemini seeks to be honored for intellect, humor, and ideas — leaving a legacy of connection, creativity, and clever influence.',
    ],
  },
  Cancer: {
    symbolName: 'Crab',
    archetype: 'The Healing Mother',
    dateRangeLabel: 'June 21 - July 22',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    influencePlanet: 'Neptune',
    paragraphs: [
      'Being born under Cancer makes this a Cardinal Water (Tide) sign, forming an emotionally intuitive, nurturing, and protective General Conscience and Personality. Ruled by the Moon, Cancer individuals are compassionate, caring, loyal, imaginative, sensitive, maternal, moody, protective, artistic, intuitive, emotionally deep, nostalgic, spiritual, and empathetic.',
      'Cancer is deeply empathetic and nurturing, but mood swings, clinginess, or passive-aggressiveness can sometimes make Cancer appear overly sensitive, defensive, or overly dependent.',
      'Overall, the Cancer Sun Sign is driven to emotionally nurture, protect, and preserve family or traditions. Emotional insight and spiritual depth lead to a legacy of emotional safety, memory, and heartfelt devotion.',
    ],
  },
  Leo: {
    symbolName: 'Lion',
    archetype: 'The Creative King',
    dateRangeLabel: 'July 23 - August 22',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    influencePlanet: 'Mars',
    paragraphs: [
      'Being born under Leo makes this a Fixed Fire (Sunlight) sign, forming a magnetic, expressive, and pride-driven General Conscience and Personality. Ruled by the Sun, Leo individuals are proud, charismatic, generous, dramatic, courageous, warm-hearted, leadership-oriented, creative, theatrical, loyal, authoritative, attention-seeking, and inspiring.',
      'Leo is confident and generous, but a need for recognition, pride, or ego-centeredness can sometimes make Leo appear vain, self-absorbed, or controlling.',
      'Overall, the Leo Sun Sign is driven to inspire, lead, and be remembered. Boldness and emotional warmth ensure admiration and creativity, leading to a legacy of leadership and heart-centered expression.',
    ],
  },
  Virgo: {
    symbolName: 'Virgin',
    archetype: 'The Analytical Maiden',
    dateRangeLabel: 'August 23 - September 22',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    influencePlanet: 'Chiron',
    paragraphs: [
      'Being born under Virgo makes this a Mutable Earth (Soil) sign, forming a meticulous, grounded, and improvement-oriented General Conscience and Personality. Ruled by Mercury, Virgo individuals are analytical, perfectionist, practical, detail-focused, humble, cautious, reliable, intelligent, organized, reserved, and health-conscious.',
      'Virgo is helpful and precise, but overthinking, criticism, or obsession with flaws can sometimes make Virgo appear anxious, inflexible, or overly judgmental.',
      'Overall, the Virgo Sun Sign is driven to refine, heal, and systematize. Practical intelligence ensures results with accuracy and humility, leading to a legacy of service, excellence, and intellectual clarity.',
    ],
  },
  Libra: {
    symbolName: 'Scales',
    archetype: 'The Harmonizing Diplomat',
    dateRangeLabel: 'September 23 - October 22',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    influencePlanet: 'Saturn',
    paragraphs: [
      'Being born under Libra makes this a Cardinal Air (Wind) sign, forming a socially intelligent, aesthetic, and balance-seeking General Conscience and Personality. Ruled by Venus, Libra individuals are fair, diplomatic, sociable, artistic, romantic, peace-seeking, indecisive, charming, intellectual, tactful, and idealistic.',
      'Libra is likable and peace-driven, but indecision, a desire for harmony, or people-pleasing can sometimes make Libra appear passive, passive-aggressive, noncommittal, or image-obsessed.',
      'Overall, the Libra Sun Sign is driven to create beauty, fairness, and social harmony. Elegance ensures meaningful relationships and thoughtful diplomacy, leading to a legacy of grace, aesthetics, and justice.',
    ],
  },
  Scorpio: {
    symbolName: 'Scorpion',
    archetype: 'The Researching Sorcerer',
    dateRangeLabel: 'October 23 - November 21',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto',
    influencePlanet: 'Mars',
    paragraphs: [
      'Being born under Scorpio makes this a Fixed Water (Ice) sign, forming an intense, private, and transformative General Conscience and Personality. Ruled by Pluto and influenced by Mars, Scorpio individuals are strategic, intuitive, secretive, powerful, deep, loyal, obsessive, transformative, analytical, mysterious, and fearless.',
      'Scorpio is resilient and deeply wise, but emotional extremes, secrecy, and intensity can sometimes make Scorpio appear controlling, manipulative, or distant.',
      'Overall, the Scorpio Sun Sign is driven to uncover truth, transform self and others, and master psychological depths. Research and sorcery lead to a legacy of power, mystery, and profound transformation.',
    ],
  },
  Sagittarius: {
    symbolName: 'Centaur-Archer',
    archetype: 'The Seeking Philosopher',
    dateRangeLabel: 'November 22 - December 21',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    influencePlanet: 'Neptune',
    paragraphs: [
      'Being born under Sagittarius makes this a Mutable Fire (Lightning) sign, forming a curious, adventurous, and visionary General Conscience and Personality. Ruled by Jupiter and influenced by Neptune, Sagittarius individuals are optimistic, freedom-loving, philosophical, humorous, blunt, expansive, open-minded, spontaneous, restless, wise, and spiritual.',
      'Sagittarius is visionary and uplifting, but impatience, preachiness, or risk-taking can sometimes make Sagittarius appear reckless, arrogant, or inconsistent.',
      'Overall, the Sagittarius Sun Sign is driven to explore, teach, and expand. Idealism and intellectual drive ensure a legacy of bold thought, optimism, and worldly wisdom.',
    ],
  },
  Capricorn: {
    symbolName: 'Sea-Goat',
    archetype: 'The Architectural Archmage',
    dateRangeLabel: 'December 22 - January 19',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    influencePlanet: 'Uranus',
    paragraphs: [
      'Being born under Capricorn makes this a Cardinal Earth (Mountain) sign, forming a visionary, authoritative, and logical General Conscience and Personality. Ruled by Saturn and influenced by Uranus, Capricorn individuals are ambitious, structured, managerial, traditional, lawful, genuine, generous, honest, cold, confident, authentic, witty, insightful, humorous, intelligent, wise, deep, suspicious, pessimistic, imaginative, innovative, logical, eidetic, knowledgeable, intuitive, scientific, tech-savvy, constructive, and practical — a Traditional and Structured Humanitarian.',
      'Capricorn is genuine and generous, but managerialism, suspicion, blunt honesty, coldness, confidence, and intellectual intensity can sometimes make Capricorn appear controlling, rude, pessimistic, condescending, or a know-it-all.',
      'Overall, the Capricorn Sun Sign is driven toward an adventure of universal knowledge and success in entrepreneurial, intellectual, philanthropic, and spiritual ventures. Generosity ensures gained knowledge benefits humanity philanthropically, and Capricorn seeks to be honored for intelligence and success — leaving a legacy of achievement.',
    ],
  },
  Aquarius: {
    symbolName: 'Water Bearer',
    archetype: 'The Revolutionary Mad-Scientist',
    dateRangeLabel: 'January 20 - February 18',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus',
    influencePlanet: 'Saturn',
    paragraphs: [
      'Being born under Aquarius makes this a Fixed Air (Atmosphere) sign, forming an inventive, idealistic, and highly independent General Conscience and Personality. Ruled by Uranus and influenced by Saturn, Aquarius individuals are visionary, unconventional, eccentric, intelligent, experimental, socially conscious, detached, rebellious, and friendly — a Rebellious Humanitarian.',
      'Aquarius is brilliant and original, but emotional detachment, stubborn ideals, and unpredictable behavior can sometimes make Aquarius appear cold, erratic, or arrogant.',
      'Overall, the Aquarius Sun Sign is driven to break norms, uplift society, and shape the future. A progressive mindset and abstract thinking lead to a legacy of experiments, disruption, rebellion, and humanitarianism.',
    ],
  },
  Pisces: {
    symbolName: 'Two-Fishes',
    archetype: 'The Imaginative Mystic',
    dateRangeLabel: 'February 19 - March 20',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune',
    influencePlanet: 'Jupiter',
    paragraphs: [
      'Being born under Pisces makes this a Mutable Water (Ocean) sign, forming an imaginative, empathetic, and deeply spiritual General Conscience and Personality. Ruled by Neptune and influenced by Jupiter, Pisces individuals are dreamy, artistic, intuitive, compassionate, mystical, idealistic, spiritual, emotional, gentle, escapist, sensitive, and imaginative.',
      'Pisces is soulful and visionary, but hypersensitivity, emotional absorption, and disconnection from reality can sometimes make Pisces appear lost, overly passive, or self-sacrificial.',
      'Overall, the Pisces Sun Sign is driven to dream, heal, and transcend boundaries. Creativity and emotional depth lead to a legacy of spiritual insight, artistic brilliance, and divine compassion.',
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
