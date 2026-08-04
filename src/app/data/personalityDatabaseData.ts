import {
  PDBSubject,
  PDBVoteTally,
  PDBComment,
  PDBCommentNode,
  PDBTypeResult,
  PersonalitySystemMeta,
  PersonalitySystemId,
} from '../types/personalityDatabase';
import { MBTIType, MBTI_PROFILES } from './mbtiData';
import { getGeniusById } from './geniusData';

// ---- Personality systems (pluggable, MBTI is priority but not the only one) ----
const ENNEAGRAM_TYPE_NAMES: Record<string, string> = {
  '1': 'The Reformer',
  '2': 'The Helper',
  '3': 'The Achiever',
  '4': 'The Individualist',
  '5': 'The Investigator',
  '6': 'The Loyalist',
  '7': 'The Enthusiast',
  '8': 'The Challenger',
  '9': 'The Peacemaker',
};

const CLASSIC_JUNGIAN_NAMES: Record<string, string> = {
  Ni: 'Introverted Intuition',
  Ne: 'Extraverted Intuition',
  Si: 'Introverted Sensing',
  Se: 'Extraverted Sensing',
  Ti: 'Introverted Thinking',
  Te: 'Extraverted Thinking',
  Fi: 'Introverted Feeling',
  Fe: 'Extraverted Feeling',
};

const BIG5_BUCKET_CODES = ['25%', '50%', '75%', '100%'];
const INSTINCTUAL_VARIANTS = ['sp/so', 'sp/sx', 'so/sp', 'so/sx', 'sx/sp', 'sx/so'];
const TRITYPE_CODES = ['125', '136', '145', '154', '163', '217', '259', '268', '279', '317', '358', '368', '378', '459', '469', '478', '514', '531', '541', '584', '592', '629', '641', '648', '728', '749', '793', '826', '837', '853', '946', '962', '973'];
const SOCIONICS_CODES = ['ILE', 'LII', 'ESE', 'SEI', 'SLE', 'LSI', 'IEI', 'EIE', 'LIE', 'ILI', 'LSE', 'SLI', 'SEE', 'ESI', 'IEE', 'EII'];

function blankTypeNames(codes: string[]): Record<string, string> {
  return Object.fromEntries(codes.map(code => [code, '']));
}

function buildAttitudinalPsycheCodes(chars: string[] = ['V', 'L', 'E', 'F']): string[] {
  if (chars.length === 1) return chars;
  return chars.flatMap((char, index) =>
    buildAttitudinalPsycheCodes(chars.filter((_, innerIndex) => innerIndex !== index)).map(rest => `${char}${rest}`),
  );
}

function buildSloanCodes(): string[] {
  const codes: string[] = [];
  ['S', 'R'].forEach(extraversion => {
    ['C', 'L'].forEach(neuroticism => {
      ['O', 'U'].forEach(conscientiousness => {
        ['A', 'E'].forEach(agreeableness => {
          ['I', 'N'].forEach(openness => {
            codes.push(`${extraversion}${neuroticism}${conscientiousness}${agreeableness}${openness}`);
          });
        });
      });
    });
  });
  return codes;
}

export const PERSONALITY_SYSTEMS: PersonalitySystemMeta[] = [
  {
    id: 'mbti',
    label: 'Four Letter',
    shortLabel: 'Four Letter',
    typeCodes: Object.keys(MBTI_PROFILES),
    typeNames: Object.fromEntries(
      Object.entries(MBTI_PROFILES).map(([code, p]) => [code, p.nickname]),
    ),
  },
  {
    id: 'enneagram',
    label: 'Enneagram',
    shortLabel: 'Enneagram',
    typeCodes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    typeNames: ENNEAGRAM_TYPE_NAMES,
  },
  {
    id: 'instinctualVariant',
    label: 'Instinctual Variant',
    shortLabel: 'IV',
    typeCodes: INSTINCTUAL_VARIANTS,
    typeNames: blankTypeNames(INSTINCTUAL_VARIANTS),
  },
  {
    id: 'tritype',
    label: 'Tritype',
    shortLabel: 'Tritype',
    typeCodes: TRITYPE_CODES,
    typeNames: blankTypeNames(TRITYPE_CODES),
  },
  {
    id: 'classicJungian',
    label: 'Classic Jungian',
    shortLabel: 'Jungian',
    typeCodes: Object.keys(CLASSIC_JUNGIAN_NAMES),
    typeNames: CLASSIC_JUNGIAN_NAMES,
  },
  {
    id: 'socionics',
    label: 'Socionics',
    shortLabel: 'Socionics',
    typeCodes: SOCIONICS_CODES,
    typeNames: blankTypeNames(SOCIONICS_CODES),
  },
  {
    id: 'attitudinalPsyche',
    label: 'Attitudinal Psyche',
    shortLabel: 'AP',
    typeCodes: buildAttitudinalPsycheCodes(),
    typeNames: {},
  },
  {
    id: 'temperament',
    label: 'Temperaments',
    shortLabel: 'Temperaments',
    typeCodes: ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic'],
    typeNames: {
      Sanguine: 'Sanguine', Choleric: 'Choleric',
      Melancholic: 'Melancholic', Phlegmatic: 'Phlegmatic',
    },
  },
  {
    id: 'big5Extraversion',
    label: 'Big 5 - Extraversion',
    shortLabel: 'Big 5 - E',
    typeCodes: BIG5_BUCKET_CODES,
    typeNames: blankTypeNames(BIG5_BUCKET_CODES),
  },
  {
    id: 'big5Neuroticism',
    label: 'Big 5 - Neuroticism',
    shortLabel: 'Big 5 - N',
    typeCodes: BIG5_BUCKET_CODES,
    typeNames: blankTypeNames(BIG5_BUCKET_CODES),
  },
  {
    id: 'big5Agreeableness',
    label: 'Big 5 - Agreeableness',
    shortLabel: 'Big 5 - A',
    typeCodes: BIG5_BUCKET_CODES,
    typeNames: blankTypeNames(BIG5_BUCKET_CODES),
  },
  {
    id: 'big5Conscientiousness',
    label: 'Big 5 - Conscientiousness',
    shortLabel: 'Big 5 - C',
    typeCodes: BIG5_BUCKET_CODES,
    typeNames: blankTypeNames(BIG5_BUCKET_CODES),
  },
  {
    id: 'big5Openness',
    label: 'Big 5 - Openness',
    shortLabel: 'Big 5 - O',
    typeCodes: BIG5_BUCKET_CODES,
    typeNames: blankTypeNames(BIG5_BUCKET_CODES),
  },
  {
    id: 'big5Sloan',
    label: 'Big 5 (SLOAN)',
    shortLabel: 'SLOAN',
    typeCodes: buildSloanCodes(),
    typeNames: {},
  },
];

export function getSystemById(id: string): PersonalitySystemMeta | undefined {
  return PERSONALITY_SYSTEMS.find(s => s.id === id);
}

// ---- Subjects: reuse Genius profiles where available, plus standalone examples ----
function fromGenius(
  geniusId: string,
  category: PDBSubject['category'],
  subcategory: string,
): PDBSubject {
  const g = getGeniusById(geniusId);
  return {
    id: geniusId,
    slug: geniusId,
    name: g?.full_name ?? geniusId,
    category,
    subcategory,
    subtitle: g?.short_description ?? '',
    imageUrl: g?.profile_image_url ?? null,
    sourceType: 'genius',
    geniusId,
  };
}

function customSubject(
  id: string,
  name: string,
  category: PDBSubject['category'],
  subcategory: string,
  subtitle: string,
): PDBSubject {
  return {
    id,
    slug: id,
    name,
    category,
    subcategory,
    subtitle,
    imageUrl: null,
    sourceType: 'custom',
  };
}

export const PDB_SUBJECTS: PDBSubject[] = [
  fromGenius('albert-einstein', 'Historical Figure', 'Science'),
  fromGenius('nikola-tesla', 'Historical Figure', 'Science'),
  customSubject('marie-curie', 'Marie Curie', 'Historical Figure', 'Science', 'Pioneering physicist and chemist known for radioactivity research'),
  customSubject('leonardo-da-vinci', 'Leonardo da Vinci', 'Historical Figure', 'Art & Innovation', 'Renaissance polymath blending art, engineering, and invention'),
  customSubject('cleopatra', 'Cleopatra', 'Historical Figure', 'Politics', 'Last active ruler of the Ptolemaic Kingdom of Egypt'),
  customSubject('nelson-mandela', 'Nelson Mandela', 'Historical Figure', 'Activism', 'Anti-apartheid revolutionary and former President of South Africa'),
  customSubject('winston-churchill', 'Winston Churchill', 'Historical Figure', 'Politics', 'British wartime prime minister, writer, and statesman'),
  customSubject('joan-of-arc', 'Joan of Arc', 'Historical Figure', 'Faith & War', 'French heroine and military leader canonized as a saint'),

  fromGenius('elon-musk', 'Public Intellectual', 'Technology'),
  fromGenius('steve-jobs', 'Public Intellectual', 'Business'),
  customSubject('carl-jung', 'Carl Jung', 'Public Intellectual', 'Psychology', 'Founding analytical psychologist known for archetypes and individuation'),
  customSubject('carl-sagan', 'Carl Sagan', 'Public Intellectual', 'Science', 'Astronomer and science communicator who popularized cosmic thinking'),
  customSubject('yuval-noah-harari', 'Yuval Noah Harari', 'Public Intellectual', 'History & Ideas', 'Historian and author exploring civilization, technology, and culture'),
  customSubject('brene-brown', 'Brene Brown', 'Public Intellectual', 'Psychology', 'Research professor studying vulnerability, courage, and leadership'),
  customSubject('malcolm-gladwell', 'Malcolm Gladwell', 'Public Intellectual', 'Journalism & Ideas', 'Author and journalist known for narrative-driven social analysis'),
  customSubject('naval-ravikant', 'Naval Ravikant', 'Public Intellectual', 'Business', 'Entrepreneur and investor focused on wealth, leverage, and judgment'),

  fromGenius('sherlock-holmes', 'Fictional Character', 'Detective'),
  fromGenius('tony-stark', 'Fictional Character', 'Superhero'),
  fromGenius('hermione-granger', 'Fictional Character', 'Fantasy'),
  customSubject('naruto-uzumaki', 'Naruto Uzumaki', 'Fictional Character', 'Anime', 'Energetic ninja protagonist driven by loyalty, grit, and recognition'),
  customSubject('batman', 'Batman', 'Fictional Character', 'Superhero', 'Brooding vigilante strategist from Gotham City'),
  customSubject('walter-white', 'Walter White', 'Fictional Character', 'Crime Drama', 'Chemistry teacher turned ruthless meth kingpin'),
  customSubject('elsa', 'Elsa', 'Fictional Character', 'Fantasy', 'Reserved queen from Frozen learning to embrace her power'),
  customSubject('light-yagami', 'Light Yagami', 'Fictional Character', 'Anime', 'Gifted student whose god complex drives the Death Note story'),
  customSubject('katniss-everdeen', 'Katniss Everdeen', 'Fictional Character', 'Dystopian', 'Reluctant rebel and survivor from The Hunger Games'),
  customSubject('wednesday-addams', 'Wednesday Addams', 'Fictional Character', 'Gothic', 'Deadpan outsider with sharp wit and dark curiosity'),
  customSubject('frodo-baggins', 'Frodo Baggins', 'Fictional Character', 'Fantasy', 'Quiet hobbit tasked with carrying the One Ring to Mordor'),
  customSubject('darth-vader', 'Darth Vader', 'Fictional Character', 'Sci-Fi', 'Fallen Jedi enforcer torn between control, pain, and redemption'),

  customSubject('zendaya', 'Zendaya', 'Celebrity', 'Pop Culture', 'Actor and fashion icon with wide cross-generational appeal'),
  customSubject('oprah-winfrey', 'Oprah Winfrey', 'Celebrity', 'Media', 'Media mogul celebrated for influence, empathy, and storytelling'),
  customSubject('kim-kardashian', 'Kim Kardashian', 'Celebrity', 'Business & Fashion', 'Reality star turned brand builder and business personality'),
  customSubject('emma-watson', 'Emma Watson', 'Celebrity', 'Film & Activism', 'Actor and activist known for Harry Potter and advocacy work'),
  customSubject('tom-holland', 'Tom Holland', 'Celebrity', 'Film & TV', 'Actor known for his agile and personable Spider-Man portrayal'),
  customSubject('angelina-jolie', 'Angelina Jolie', 'Celebrity', 'Film & Humanitarian', 'Actor, director, and humanitarian with a global public profile'),
  customSubject('mrbeast', 'MrBeast', 'Celebrity', 'Creator Economy', 'YouTube creator known for large-scale stunts and philanthropy'),
  customSubject('ryan-reynolds', 'Ryan Reynolds', 'Celebrity', 'Comedy & Film', 'Actor and entrepreneur known for quick wit and self-aware branding'),

  customSubject('taylor-swift', 'Taylor Swift', 'Musician', 'Pop', 'Singer-songwriter known for autobiographical songwriting and reinvention'),
  customSubject('beyonce', 'Beyonce', 'Musician', 'Pop & Performance', 'Global performer recognized for precision, presence, and artistic control'),
  customSubject('drake', 'Drake', 'Musician', 'Hip-Hop', 'Chart-dominating rapper and singer balancing confidence and emotional candor'),
  customSubject('kendrick-lamar', 'Kendrick Lamar', 'Musician', 'Hip-Hop', 'Lyrically dense rapper known for introspection and social commentary'),
  customSubject('burna-boy', 'Burna Boy', 'Musician', 'Afrobeats', 'Afrofusion artist blending swagger, groove, and global ambition'),
  customSubject('billie-eilish', 'Billie Eilish', 'Musician', 'Alt Pop', 'Minimalist pop artist known for moody intimacy and experimentation'),
  customSubject('adele', 'Adele', 'Musician', 'Soul & Pop', 'Powerful vocalist known for emotionally direct ballads'),

  customSubject('cristiano-ronaldo', 'Cristiano Ronaldo', 'Athlete', 'Football', 'Elite footballer known for discipline, drive, and relentless ambition'),
  customSubject('lionel-messi', 'Lionel Messi', 'Athlete', 'Football', 'Visionary football playmaker with quiet intensity and effortless genius'),
  customSubject('lebron-james', 'LeBron James', 'Athlete', 'Basketball', 'Basketball superstar combining leadership, longevity, and versatility'),
  customSubject('serena-williams', 'Serena Williams', 'Athlete', 'Tennis', 'Tennis champion celebrated for dominance, resilience, and composure'),
  customSubject('simone-biles', 'Simone Biles', 'Athlete', 'Gymnastics', 'Gymnast redefining excellence through power, precision, and courage'),
  customSubject('kylian-mbappe', 'Kylian Mbappe', 'Athlete', 'Football', 'Explosive football forward with charisma and competitive flair'),
  customSubject('kobe-bryant', 'Kobe Bryant', 'Athlete', 'Basketball', 'Legendary competitor known for meticulous preparation and killer instinct'),
];

export function getSubjectBySlug(slug: string): PDBSubject | undefined {
  return PDB_SUBJECTS.find(s => s.slug === slug);
}

// ---- Mock vote tallies ----
function tallies(subjectId: string, systemId: PDBVoteTally['systemId'], dist: Record<string, number>): PDBVoteTally[] {
  return Object.entries(dist).map(([typeCode, votes]) => ({ subjectId, systemId, typeCode, votes }));
}

const MBTI_FUNCTION_STACKS: Record<MBTIType, [string, string, string, string]> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
};

const MBTI_TO_ENNEAGRAM: Record<MBTIType, Array<[string, number]>> = {
  INTJ: [['5', 0.45], ['1', 0.3], ['8', 0.25]],
  INTP: [['5', 0.5], ['9', 0.25], ['4', 0.25]],
  ENTJ: [['3', 0.4], ['8', 0.35], ['1', 0.25]],
  ENTP: [['7', 0.4], ['5', 0.35], ['3', 0.25]],
  INFJ: [['4', 0.35], ['1', 0.35], ['9', 0.3]],
  INFP: [['4', 0.45], ['9', 0.3], ['6', 0.25]],
  ENFJ: [['2', 0.4], ['3', 0.3], ['9', 0.3]],
  ENFP: [['7', 0.35], ['4', 0.35], ['2', 0.3]],
  ISTJ: [['1', 0.4], ['6', 0.35], ['5', 0.25]],
  ISFJ: [['2', 0.35], ['6', 0.35], ['9', 0.3]],
  ESTJ: [['3', 0.35], ['8', 0.35], ['1', 0.3]],
  ESFJ: [['2', 0.45], ['3', 0.3], ['9', 0.25]],
  ISTP: [['5', 0.4], ['9', 0.3], ['8', 0.3]],
  ISFP: [['4', 0.45], ['9', 0.3], ['2', 0.25]],
  ESTP: [['8', 0.4], ['7', 0.35], ['3', 0.25]],
  ESFP: [['7', 0.4], ['3', 0.3], ['2', 0.3]],
};

const MBTI_TO_TEMPERAMENT: Record<MBTIType, Array<[string, number]>> = {
  INTJ: [['Melancholic', 0.45], ['Choleric', 0.35], ['Phlegmatic', 0.2]],
  INTP: [['Phlegmatic', 0.4], ['Melancholic', 0.4], ['Sanguine', 0.2]],
  ENTJ: [['Choleric', 0.5], ['Melancholic', 0.3], ['Sanguine', 0.2]],
  ENTP: [['Sanguine', 0.4], ['Choleric', 0.35], ['Phlegmatic', 0.25]],
  INFJ: [['Melancholic', 0.4], ['Phlegmatic', 0.35], ['Sanguine', 0.25]],
  INFP: [['Phlegmatic', 0.4], ['Melancholic', 0.35], ['Sanguine', 0.25]],
  ENFJ: [['Sanguine', 0.4], ['Phlegmatic', 0.35], ['Choleric', 0.25]],
  ENFP: [['Sanguine', 0.5], ['Phlegmatic', 0.3], ['Choleric', 0.2]],
  ISTJ: [['Melancholic', 0.45], ['Phlegmatic', 0.35], ['Choleric', 0.2]],
  ISFJ: [['Phlegmatic', 0.45], ['Melancholic', 0.3], ['Sanguine', 0.25]],
  ESTJ: [['Choleric', 0.45], ['Melancholic', 0.35], ['Sanguine', 0.2]],
  ESFJ: [['Sanguine', 0.4], ['Phlegmatic', 0.35], ['Choleric', 0.25]],
  ISTP: [['Phlegmatic', 0.35], ['Choleric', 0.35], ['Melancholic', 0.3]],
  ISFP: [['Phlegmatic', 0.4], ['Sanguine', 0.35], ['Melancholic', 0.25]],
  ESTP: [['Sanguine', 0.45], ['Choleric', 0.4], ['Phlegmatic', 0.15]],
  ESFP: [['Sanguine', 0.5], ['Phlegmatic', 0.25], ['Choleric', 0.25]],
};

const MBTI_TO_SOCIONICS: Record<MBTIType, string> = {
  INTJ: 'ILI',
  INTP: 'LII',
  ENTJ: 'LIE',
  ENTP: 'ILE',
  INFJ: 'IEI',
  INFP: 'EII',
  ENFJ: 'EIE',
  ENFP: 'IEE',
  ISTJ: 'LSI',
  ISFJ: 'ESI',
  ESTJ: 'LSE',
  ESFJ: 'ESE',
  ISTP: 'SLI',
  ISFP: 'SEI',
  ESTP: 'SLE',
  ESFP: 'SEE',
};

const MBTI_TO_ATTITUDINAL_PSYCHE: Record<MBTIType, Array<[string, number]>> = {
  INTJ: [['VLFE', 1], ['VLEF', 0.68], ['LVEF', 0.42]],
  INTP: [['LVEF', 1], ['LVFE', 0.68], ['VELF', 0.42]],
  ENTJ: [['VLFE', 1], ['VFLE', 0.68], ['VLEF', 0.42]],
  ENTP: [['VELF', 1], ['EVLF', 0.68], ['VLEF', 0.42]],
  INFJ: [['ELVF', 1], ['LEVF', 0.68], ['LVEF', 0.42]],
  INFP: [['FLEV', 1], ['FELV', 0.68], ['ELFV', 0.42]],
  ENFJ: [['EVFL', 1], ['VEFL', 0.68], ['ELFV', 0.42]],
  ENFP: [['EFVL', 1], ['EVFL', 0.68], ['FELV', 0.42]],
  ISTJ: [['LVFE', 1], ['LFVE', 0.68], ['VLFE', 0.42]],
  ISFJ: [['FLEV', 1], ['FVEL', 0.68], ['FLVE', 0.42]],
  ESTJ: [['VLFE', 1], ['VFLE', 0.68], ['LFVE', 0.42]],
  ESFJ: [['VEFL', 1], ['FEVL', 0.68], ['FVEL', 0.42]],
  ISTP: [['LVFE', 1], ['VLFE', 0.68], ['LVEF', 0.42]],
  ISFP: [['FLEV', 1], ['FVLE', 0.68], ['FVEL', 0.42]],
  ESTP: [['VFLE', 1], ['VFEL', 0.68], ['VELF', 0.42]],
  ESFP: [['FEVL', 1], ['FVEL', 0.68], ['EFVL', 0.42]],
};

const ENNEAGRAM_TO_INSTINCTUAL_VARIANT: Record<string, [string, string, string]> = {
  '1': ['sp/so', 'so/sp', 'sp/sx'],
  '2': ['so/sx', 'sx/so', 'so/sp'],
  '3': ['so/sp', 'sp/so', 'sx/so'],
  '4': ['sx/sp', 'sp/sx', 'sx/so'],
  '5': ['sp/sx', 'sp/so', 'sx/sp'],
  '6': ['sp/so', 'so/sp', 'sx/so'],
  '7': ['so/sx', 'sx/so', 'sp/sx'],
  '8': ['sx/sp', 'sp/sx', 'so/sx'],
  '9': ['sp/so', 'sx/sp', 'so/sp'],
};

const ENNEAGRAM_TO_TRITYPE: Record<string, [string, string, string]> = {
  '1': ['163', '154', '136'],
  '2': ['279', '217', '268'],
  '3': ['378', '317', '358'],
  '4': ['459', '478', '469'],
  '5': ['541', '514', '531'],
  '6': ['629', '641', '648'],
  '7': ['793', '728', '749'],
  '8': ['837', '853', '826'],
  '9': ['946', '962', '973'],
};

function sumVotes(dist: Record<string, number>): number {
  return Object.values(dist).reduce((sum, votes) => sum + votes, 0);
}

function normalizeDistribution(entries: Array<[string, number]>, totalVotes: number): Record<string, number> {
  if (entries.length === 0 || totalVotes <= 0) return {};
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  const raw = entries.map(([code, weight]) => ({ code, rawVotes: (weight / totalWeight) * totalVotes }));
  const rounded = raw.map(item => ({
    code: item.code,
    votes: Math.max(1, Math.floor(item.rawVotes)),
    remainder: item.rawVotes - Math.floor(item.rawVotes),
  }));

  let remaining = totalVotes - rounded.reduce((sum, item) => sum + item.votes, 0);
  if (remaining > 0) {
    rounded
      .sort((a, b) => b.remainder - a.remainder)
      .forEach(item => {
        if (remaining > 0) {
          item.votes += 1;
          remaining -= 1;
        }
      });
  } else if (remaining < 0) {
    rounded
      .sort((a, b) => b.votes - a.votes)
      .forEach(item => {
        while (remaining < 0 && item.votes > 1) {
          item.votes -= 1;
          remaining += 1;
        }
      });
  }

  return Object.fromEntries(rounded.map(item => [item.code, item.votes]));
}

function aggregateMappedDistribution<T extends string>(
  sourceDist: Record<string, number>,
  mapping: Record<T, Array<[string, number]>>,
  targetTotal: number,
): Record<string, number> {
  const aggregate: Record<string, number> = {};
  Object.entries(sourceDist).forEach(([code, votes]) => {
    const mapped = mapping[code as T];
    mapped?.forEach(([targetCode, weight]) => {
      if (!Number.isFinite(weight)) return;
      aggregate[targetCode] = (aggregate[targetCode] ?? 0) + votes * weight;
    });
  });

  return normalizeDistribution(
    Object.entries(aggregate).sort((a, b) => b[1] - a[1]).slice(0, 4),
    targetTotal,
  );
}

function dominantCode(dist: Record<string, number>): string {
  return Object.entries(dist).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '5';
}

function clampScore(value: number): number {
  return Math.max(5, Math.min(95, Math.round(value)));
}

function shareForLetter(dist: Record<string, number>, index: number, letter: string): number {
  const total = sumVotes(dist);
  if (total === 0) return 50;
  const matching = Object.entries(dist)
    .filter(([code]) => code[index] === letter)
    .reduce((sum, [, votes]) => sum + votes, 0);
  return (matching / total) * 100;
}

function deriveEnneagramFromMbti(mbtiDist: Record<string, number>): Record<string, number> {
  return aggregateMappedDistribution(
    mbtiDist,
    MBTI_TO_ENNEAGRAM,
    Math.max(160, Math.round(sumVotes(mbtiDist) * 0.38)),
  );
}

function deriveTemperamentFromMbti(mbtiDist: Record<string, number>): Record<string, number> {
  return aggregateMappedDistribution(
    mbtiDist,
    MBTI_TO_TEMPERAMENT,
    Math.max(150, Math.round(sumVotes(mbtiDist) * 0.32)),
  );
}

function deriveClassicJungian(mbtiDist: Record<string, number>): Record<string, number> {
  const aggregate: Record<string, number> = {};
  Object.entries(mbtiDist).forEach(([code, votes]) => {
    const stack = MBTI_FUNCTION_STACKS[code as MBTIType];
    if (!stack) return;
    [1, 0.7, 0.45, 0.2].forEach((weight, index) => {
      const functionCode = stack[index];
      aggregate[functionCode] = (aggregate[functionCode] ?? 0) + votes * weight;
    });
  });

  return normalizeDistribution(
    Object.entries(aggregate).sort((a, b) => b[1] - a[1]).slice(0, 4),
    Math.max(170, Math.round(sumVotes(mbtiDist) * 0.42)),
  );
}

function deriveSocionics(mbtiDist: Record<string, number>): Record<string, number> {
  const aggregate: Record<string, number> = {};
  Object.entries(mbtiDist).forEach(([code, votes]) => {
    const socionics = MBTI_TO_SOCIONICS[code as MBTIType];
    if (!socionics) return;
    aggregate[socionics] = (aggregate[socionics] ?? 0) + votes;
  });

  return normalizeDistribution(
    Object.entries(aggregate).sort((a, b) => b[1] - a[1]).slice(0, 4),
    Math.max(150, Math.round(sumVotes(mbtiDist) * 0.34)),
  );
}

function deriveAttitudinalPsyche(mbtiDist: Record<string, number>): Record<string, number> {
  return aggregateMappedDistribution(
    mbtiDist,
    MBTI_TO_ATTITUDINAL_PSYCHE,
    Math.max(120, Math.round(sumVotes(mbtiDist) * 0.26)),
  );
}

function deriveInstinctualVariant(enneagramDist: Record<string, number>): Record<string, number> {
  const dominant = dominantCode(enneagramDist);
  return normalizeDistribution(
    ENNEAGRAM_TO_INSTINCTUAL_VARIANT[dominant].map((code, index) => [code, [1, 0.65, 0.35][index]]),
    Math.max(110, Math.round(sumVotes(enneagramDist) * 0.36)),
  );
}

function deriveTritype(enneagramDist: Record<string, number>): Record<string, number> {
  const dominant = dominantCode(enneagramDist);
  return normalizeDistribution(
    ENNEAGRAM_TO_TRITYPE[dominant].map((code, index) => [code, [1, 0.7, 0.4][index]]),
    Math.max(100, Math.round(sumVotes(enneagramDist) * 0.3)),
  );
}

function big5Scores(mbtiDist: Record<string, number>, enneagramDist: Record<string, number>) {
  const dominantEnneagram = dominantCode(enneagramDist);
  const extraversion = clampScore(
    shareForLetter(mbtiDist, 0, 'E') + ({ '2': 8, '3': 10, '7': 12, '8': 10, '5': -12, '9': -10, '4': -6 }[dominantEnneagram] ?? 0),
  );
  const openness = clampScore(
    shareForLetter(mbtiDist, 1, 'N') + ({ '4': 10, '5': 8, '7': 8, '1': -4, '6': -6 }[dominantEnneagram] ?? 0),
  );
  const agreeableness = clampScore(
    shareForLetter(mbtiDist, 2, 'F') + ({ '2': 15, '9': 12, '6': 8, '8': -12, '3': -8, '5': -6 }[dominantEnneagram] ?? 0),
  );
  const conscientiousness = clampScore(
    shareForLetter(mbtiDist, 3, 'J') + ({ '1': 15, '3': 12, '6': 10, '7': -10, '9': -8, '4': -4 }[dominantEnneagram] ?? 0),
  );
  const neuroticism = clampScore(
    45 + ({ '4': 22, '6': 18, '9': 4, '2': 6, '8': -10, '3': -8, '7': -6, '1': 4, '5': 2 }[dominantEnneagram] ?? 0)
      + (shareForLetter(mbtiDist, 2, 'F') - 50) * 0.15,
  );

  return { extraversion, neuroticism, agreeableness, conscientiousness, openness };
}

function deriveBig5Dimension(score: number, totalVotes: number): Record<string, number> {
  return normalizeDistribution(
    BIG5_BUCKET_CODES.map(code => {
      const bucketValue = Number.parseInt(code, 10);
      return [code, Math.max(1, 110 - Math.abs(score - bucketValue) * 2)];
    }),
    totalVotes,
  );
}

function flipSloanLetter(code: string, index: number): string {
  const pairs: Record<string, string> = { S: 'R', R: 'S', C: 'L', L: 'C', O: 'U', U: 'O', A: 'E', E: 'A', I: 'N', N: 'I' };
  return `${code.slice(0, index)}${pairs[code[index]]}${code.slice(index + 1)}`;
}

function deriveSloan(scores: ReturnType<typeof big5Scores>, totalVotes: number): Record<string, number> {
  const primary = `${scores.extraversion >= 50 ? 'S' : 'R'}${scores.neuroticism >= 50 ? 'L' : 'C'}${scores.conscientiousness >= 50 ? 'O' : 'U'}${scores.agreeableness >= 50 ? 'A' : 'E'}${scores.openness >= 50 ? 'I' : 'N'}`;
  const confidence = [
    Math.abs(scores.extraversion - 50),
    Math.abs(scores.neuroticism - 50),
    Math.abs(scores.conscientiousness - 50),
    Math.abs(scores.agreeableness - 50),
    Math.abs(scores.openness - 50),
  ];
  const weakestIndices = confidence
    .map((value, index) => ({ value, index }))
    .sort((a, b) => a.value - b.value)
    .map(item => item.index);
  const alternateOne = flipSloanLetter(primary, weakestIndices[0]);
  const alternateTwo = flipSloanLetter(alternateOne, weakestIndices[1] ?? weakestIndices[0]);
  return normalizeDistribution(
    [[primary, 1], [alternateOne, 0.6], [alternateTwo, 0.35]],
    totalVotes,
  );
}

function buildVoteTallies(seed: {
  subjectId: string;
  mbti: Record<string, number>;
  enneagram?: Record<string, number>;
  temperament?: Record<string, number>;
}): PDBVoteTally[] {
  const enneagram = seed.enneagram ?? deriveEnneagramFromMbti(seed.mbti);
  const temperament = seed.temperament ?? deriveTemperamentFromMbti(seed.mbti);
  const scores = big5Scores(seed.mbti, enneagram);
  const mbtiTotal = sumVotes(seed.mbti);
  const systemVotes: Partial<Record<PersonalitySystemId, Record<string, number>>> = {
    mbti: seed.mbti,
    enneagram,
    instinctualVariant: deriveInstinctualVariant(enneagram),
    tritype: deriveTritype(enneagram),
    classicJungian: deriveClassicJungian(seed.mbti),
    socionics: deriveSocionics(seed.mbti),
    attitudinalPsyche: deriveAttitudinalPsyche(seed.mbti),
    temperament,
    big5Extraversion: deriveBig5Dimension(scores.extraversion, Math.max(85, Math.round(mbtiTotal * 0.14))),
    big5Neuroticism: deriveBig5Dimension(scores.neuroticism, Math.max(85, Math.round(mbtiTotal * 0.14))),
    big5Agreeableness: deriveBig5Dimension(scores.agreeableness, Math.max(85, Math.round(mbtiTotal * 0.14))),
    big5Conscientiousness: deriveBig5Dimension(scores.conscientiousness, Math.max(85, Math.round(mbtiTotal * 0.14))),
    big5Openness: deriveBig5Dimension(scores.openness, Math.max(85, Math.round(mbtiTotal * 0.14))),
    big5Sloan: deriveSloan(scores, Math.max(95, Math.round(mbtiTotal * 0.18))),
  };

  return [
    ...Object.entries(systemVotes).flatMap(([systemId, dist]) =>
      dist ? tallies(seed.subjectId, systemId as PersonalitySystemId, dist) : [],
    ),
  ];
}

export const PDB_VOTE_TALLIES: PDBVoteTally[] = [
  ...buildVoteTallies({ subjectId: 'albert-einstein', mbti: { INTP: 812, INTJ: 301, ISTP: 64, ENTP: 40 }, enneagram: { '5': 640, '4': 210, '9': 90 }, temperament: { Melancholic: 700, Phlegmatic: 220 } }),
  ...buildVoteTallies({ subjectId: 'nikola-tesla', mbti: { INTJ: 905, INTP: 260, ISTJ: 30 }, enneagram: { '5': 500, '1': 300, '4': 150 } }),
  ...buildVoteTallies({ subjectId: 'marie-curie', mbti: { INTJ: 610, ISTJ: 280, INTP: 190 }, enneagram: { '1': 320, '5': 280, '6': 90 } }),
  ...buildVoteTallies({ subjectId: 'leonardo-da-vinci', mbti: { ENTP: 530, INTP: 280, INFP: 190 }, enneagram: { '7': 220, '5': 180, '4': 160 } }),
  ...buildVoteTallies({ subjectId: 'cleopatra', mbti: { ENTJ: 520, ENFJ: 260, ESTP: 180 }, enneagram: { '3': 260, '8': 220, '7': 90 } }),
  ...buildVoteTallies({ subjectId: 'nelson-mandela', mbti: { ENFJ: 640, INFJ: 260, ENTJ: 140 }, enneagram: { '9': 230, '1': 220, '2': 150 } }),
  ...buildVoteTallies({ subjectId: 'winston-churchill', mbti: { ENTJ: 590, ESTJ: 310, ENFJ: 100 }, enneagram: { '8': 300, '3': 210, '6': 80 } }),
  ...buildVoteTallies({ subjectId: 'joan-of-arc', mbti: { INFJ: 560, ENFJ: 230, ISFJ: 120 }, enneagram: { '1': 270, '6': 170, '2': 90 } }),

  ...buildVoteTallies({ subjectId: 'elon-musk', mbti: { INTJ: 540, INTP: 480, ENTJ: 190 }, enneagram: { '5': 300, '8': 280, '3': 150 } }),
  ...buildVoteTallies({ subjectId: 'steve-jobs', mbti: { ENTJ: 650, INTJ: 300, ENTP: 120 }, enneagram: { '3': 320, '8': 210, '1': 95 } }),
  ...buildVoteTallies({ subjectId: 'carl-jung', mbti: { INFJ: 610, INTJ: 250, INFP: 150 }, enneagram: { '5': 300, '4': 180, '9': 90 } }),
  ...buildVoteTallies({ subjectId: 'carl-sagan', mbti: { ENTP: 520, INTP: 330, ENFP: 110 }, enneagram: { '5': 240, '7': 160, '9': 80 } }),
  ...buildVoteTallies({ subjectId: 'yuval-noah-harari', mbti: { INTJ: 500, INTP: 290, INFJ: 100 }, enneagram: { '5': 260, '1': 150, '6': 70 } }),
  ...buildVoteTallies({ subjectId: 'brene-brown', mbti: { ENFJ: 590, INFJ: 240, ESFJ: 130 }, enneagram: { '2': 280, '6': 160, '9': 120 } }),
  ...buildVoteTallies({ subjectId: 'malcolm-gladwell', mbti: { ENTP: 470, ENFP: 230, INTP: 120 }, enneagram: { '7': 190, '5': 130, '3': 110 } }),
  ...buildVoteTallies({ subjectId: 'naval-ravikant', mbti: { INTP: 430, INTJ: 260, ENTP: 110 }, enneagram: { '5': 220, '3': 120, '9': 70 } }),

  ...buildVoteTallies({ subjectId: 'sherlock-holmes', mbti: { INTJ: 1100, INTP: 900, ISTP: 150 }, enneagram: { '5': 780, '1': 260 } }),
  ...buildVoteTallies({ subjectId: 'tony-stark', mbti: { ENTP: 980, ENTJ: 410, INTJ: 120 }, enneagram: { '7': 310, '3': 210, '8': 140 } }),
  ...buildVoteTallies({ subjectId: 'hermione-granger', mbti: { ISTJ: 620, INTJ: 400, ENFJ: 150 }, enneagram: { '1': 320, '6': 210, '2': 80 } }),
  ...buildVoteTallies({ subjectId: 'naruto-uzumaki', mbti: { ESFP: 700, ENFP: 480, ESTP: 90 }, temperament: { Sanguine: 820, Choleric: 210 } }),
  ...buildVoteTallies({ subjectId: 'batman', mbti: { INTJ: 860, ISTJ: 320, INFJ: 110 }, enneagram: { '1': 290, '5': 220, '8': 170 } }),
  ...buildVoteTallies({ subjectId: 'walter-white', mbti: { INTJ: 720, ISTJ: 250, ENTJ: 180 }, enneagram: { '5': 240, '1': 200, '6': 90 } }),
  ...buildVoteTallies({ subjectId: 'elsa', mbti: { INFJ: 520, ISFJ: 210, INTJ: 120 }, enneagram: { '4': 220, '1': 150, '6': 90 } }),
  ...buildVoteTallies({ subjectId: 'light-yagami', mbti: { INTJ: 760, ENTJ: 340, ISTJ: 120 }, enneagram: { '1': 280, '3': 210, '8': 110 } }),
  ...buildVoteTallies({ subjectId: 'katniss-everdeen', mbti: { ISTP: 530, INTJ: 260, ISFP: 150 }, enneagram: { '6': 260, '8': 140, '9': 90 } }),
  ...buildVoteTallies({ subjectId: 'wednesday-addams', mbti: { INTP: 540, INTJ: 280, ISTP: 140 }, enneagram: { '5': 260, '4': 150, '1': 70 } }),
  ...buildVoteTallies({ subjectId: 'frodo-baggins', mbti: { ISFJ: 430, INFP: 230, INFJ: 150 }, enneagram: { '9': 240, '6': 150, '2': 90 } }),
  ...buildVoteTallies({ subjectId: 'darth-vader', mbti: { ENTJ: 630, INTJ: 260, ISTJ: 140 }, enneagram: { '8': 310, '1': 180, '6': 80 } }),

  ...buildVoteTallies({ subjectId: 'zendaya', mbti: { ENFP: 460, ESFP: 260, ISFP: 120 }, enneagram: { '3': 180, '7': 140, '2': 90 } }),
  ...buildVoteTallies({ subjectId: 'oprah-winfrey', mbti: { ENFJ: 630, ESFJ: 240, ENFP: 90 }, enneagram: { '2': 260, '3': 180, '9': 70 } }),
  ...buildVoteTallies({ subjectId: 'kim-kardashian', mbti: { ESFP: 480, ESTP: 220, ENFJ: 90 }, enneagram: { '3': 240, '7': 130, '2': 60 } }),
  ...buildVoteTallies({ subjectId: 'emma-watson', mbti: { INFJ: 440, ENFJ: 250, INTJ: 120 }, enneagram: { '1': 180, '2': 120, '6': 80 } }),
  ...buildVoteTallies({ subjectId: 'tom-holland', mbti: { ENFP: 390, ESFP: 280, ISFP: 110 }, enneagram: { '7': 170, '2': 120, '6': 60 } }),
  ...buildVoteTallies({ subjectId: 'angelina-jolie', mbti: { ENFJ: 410, INTJ: 210, ISFP: 140 }, enneagram: { '8': 160, '2': 130, '4': 90 } }),
  ...buildVoteTallies({ subjectId: 'mrbeast', mbti: { ENTP: 520, ENFP: 260, ESTP: 120 }, enneagram: { '7': 260, '3': 150, '8': 70 } }),
  ...buildVoteTallies({ subjectId: 'ryan-reynolds', mbti: { ENTP: 540, ESFP: 210, ENTJ: 90 }, enneagram: { '7': 210, '3': 130, '8': 60 } }),

  ...buildVoteTallies({ subjectId: 'taylor-swift', mbti: { ENFP: 630, ISFP: 250, INFJ: 130 }, enneagram: { '4': 260, '3': 180, '2': 90 } }),
  ...buildVoteTallies({ subjectId: 'beyonce', mbti: { ENTJ: 460, ISFJ: 220, ENFJ: 150 }, enneagram: { '3': 260, '8': 120, '1': 90 } }),
  ...buildVoteTallies({ subjectId: 'drake', mbti: { ISFP: 390, ENTP: 200, ESFP: 180 }, enneagram: { '4': 140, '3': 120, '7': 90 } }),
  ...buildVoteTallies({ subjectId: 'kendrick-lamar', mbti: { INFJ: 420, INTJ: 240, INFP: 150 }, enneagram: { '4': 180, '5': 140, '1': 70 } }),
  ...buildVoteTallies({ subjectId: 'burna-boy', mbti: { ESTP: 340, ESFP: 260, ENTP: 120 }, enneagram: { '8': 170, '7': 130, '3': 80 } }),
  ...buildVoteTallies({ subjectId: 'billie-eilish', mbti: { ISFP: 500, INFP: 220, INTP: 90 }, enneagram: { '4': 240, '9': 90, '5': 80 } }),
  ...buildVoteTallies({ subjectId: 'adele', mbti: { ISFJ: 410, INFP: 210, ENFJ: 120 }, enneagram: { '2': 170, '4': 150, '6': 80 } }),

  ...buildVoteTallies({ subjectId: 'cristiano-ronaldo', mbti: { ESTJ: 520, ENTJ: 280, ESFP: 130 }, enneagram: { '3': 260, '8': 180, '1': 80 } }),
  ...buildVoteTallies({ subjectId: 'lionel-messi', mbti: { ISFJ: 350, ISTP: 280, INFP: 120 }, enneagram: { '9': 170, '3': 150, '5': 60 } }),
  ...buildVoteTallies({ subjectId: 'lebron-james', mbti: { ENTJ: 470, ENFJ: 260, ESTP: 120 }, enneagram: { '3': 240, '8': 140, '2': 70 } }),
  ...buildVoteTallies({ subjectId: 'serena-williams', mbti: { ENTJ: 430, ESTJ: 240, ENFJ: 110 }, enneagram: { '8': 220, '3': 150, '1': 70 } }),
  ...buildVoteTallies({ subjectId: 'simone-biles', mbti: { ESFP: 420, ESTP: 210, ISFP: 100 }, enneagram: { '7': 180, '3': 130, '6': 60 } }),
  ...buildVoteTallies({ subjectId: 'kylian-mbappe', mbti: { ENFP: 360, ESFP: 220, ESTP: 140 }, enneagram: { '7': 160, '3': 140, '8': 60 } }),
  ...buildVoteTallies({ subjectId: 'kobe-bryant', mbti: { INTJ: 390, ENTJ: 300, ISTJ: 150 }, enneagram: { '3': 220, '1': 140, '8': 80 } }),
];

export function getVoteResults(subjectId: string, systemId: string): PDBTypeResult[] {
  const system = getSystemById(systemId);
  if (!system) return [];
  const rows = PDB_VOTE_TALLIES.filter(t => t.subjectId === subjectId && t.systemId === systemId);
  const total = rows.reduce((sum, r) => sum + r.votes, 0);
  return rows
    .map(r => ({
      typeCode: r.typeCode,
      typeName: system.typeNames[r.typeCode] ?? r.typeCode,
      votes: r.votes,
      percentage: total > 0 ? Math.round((r.votes / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.votes - a.votes);
}

export function getTotalVotes(subjectId: string, systemId: string): number {
  return PDB_VOTE_TALLIES
    .filter(t => t.subjectId === subjectId && t.systemId === systemId)
    .reduce((sum, r) => sum + r.votes, 0);
}

export function getAvailableSystemsForSubject(subjectId: string): PersonalitySystemMeta[] {
  const systemIds = new Set(PDB_VOTE_TALLIES.filter(t => t.subjectId === subjectId).map(t => t.systemId));
  return PERSONALITY_SYSTEMS.filter(s => systemIds.has(s.id));
}

// ---- Mock comments (threaded, supports anonymous authors) ----
let commentIdCounter = 1000;
export function nextCommentId(): string {
  commentIdCounter += 1;
  return `c-${commentIdCounter}`;
}

export const PDB_COMMENTS: PDBComment[] = [
  {
    id: 'c-1', subjectId: 'albert-einstein', parentId: null,
    authorName: 'Anonymous', isAnonymous: true,
    text: "INTP fits his obsession with theory over practical application. Classic Ti-Ne loop.",
    createdAt: '2026-07-20T10:00:00.000Z', upvotes: 24, downvotes: 3,
  },
  {
    id: 'c-2', subjectId: 'albert-einstein', parentId: 'c-1',
    authorName: 'mbti_nerd', isAnonymous: false,
    text: "Disagree, his focus on grand unifying theories over abstract logic games feels more Ni than Ti.",
    createdAt: '2026-07-20T11:15:00.000Z', upvotes: 9, downvotes: 1,
  },
  {
    id: 'c-3', subjectId: 'albert-einstein', parentId: null,
    authorName: 'Anonymous', isAnonymous: true,
    text: "Enneagram 5 is obvious here — total withdrawal into the mind, detachment from material needs.",
    createdAt: '2026-07-21T08:30:00.000Z', upvotes: 15, downvotes: 2,
  },
  {
    id: 'c-4', subjectId: 'sherlock-holmes', parentId: null,
    authorName: 'deduction_fan', isAnonymous: false,
    text: "Ti-dom all day. He builds his own internal logic system and tests reality against it, not the other way around.",
    createdAt: '2026-07-22T09:00:00.000Z', upvotes: 31, downvotes: 4,
  },
  {
    id: 'c-5', subjectId: 'sherlock-holmes', parentId: null,
    authorName: 'Anonymous', isAnonymous: true,
    text: "Can't rule out INTP given how much he enjoys the puzzle itself over the actual justice served.",
    createdAt: '2026-07-22T12:00:00.000Z', upvotes: 12, downvotes: 2,
  },
];

function buildMockDiscussionSeed(subjectId: string): PDBComment[] {
  const subject = getSubjectBySlug(subjectId);
  const name = subject?.name ?? 'this personality';
  const primaryMbti = getVoteResults(subjectId, 'mbti')[0];
  const secondaryMbti = getVoteResults(subjectId, 'mbti')[1];
  const primaryEnneagram = getVoteResults(subjectId, 'enneagram')[0];
  const primarySocionics = getVoteResults(subjectId, 'socionics')[0];
  const primaryTemperament = getVoteResults(subjectId, 'temperament')[0];

  const mbtiLead = primaryMbti?.typeCode ?? 'INTJ';
  const mbtiAlt = secondaryMbti?.typeCode ?? 'INFJ';
  const enneagramLead = primaryEnneagram?.typeCode ?? '5';
  const socionicsLead = primarySocionics?.typeCode ?? mbtiLead;
  const temperamentLead = primaryTemperament?.typeCode ?? 'Phlegmatic';

  return [
    {
      id: `${subjectId}-mock-1`,
      subjectId,
      parentId: null,
      authorName: 'typewatcher',
      isAnonymous: false,
      text: `${mbtiLead} still makes the most sense for ${name}. The ${enneagramLead} fix explains the intensity way better than the usual ${mbtiAlt} arguments people keep making.`,
      createdAt: '2026-07-24T14:10:00.000Z',
      upvotes: 18,
      downvotes: 2,
    },
    {
      id: `${subjectId}-mock-2`,
      subjectId,
      parentId: `${subjectId}-mock-1`,
      authorName: 'patternseeker',
      isAnonymous: false,
      text: `I can also see the ${socionicsLead} case. The public style feels more deliberate than people expect, especially once you compare it with the runner-up types.`,
      createdAt: '2026-07-24T16:25:00.000Z',
      upvotes: 7,
      downvotes: 1,
    },
    {
      id: `${subjectId}-mock-3`,
      subjectId,
      parentId: null,
      authorName: 'contextmatters',
      isAnonymous: false,
      text: `Temperament-wise I lean ${temperamentLead}. The overall energy reads consistent there, even if the exact subtype debates are still all over the place.`,
      createdAt: '2026-07-25T09:40:00.000Z',
      upvotes: 11,
      downvotes: 1,
    },
  ];
}

export function getCommentsForSubject(subjectId: string, allComments: PDBComment[] = PDB_COMMENTS): PDBComment[] {
  const subjectComments = allComments.filter(comment => comment.subjectId === subjectId);
  return subjectComments.length > 0 ? subjectComments : buildMockDiscussionSeed(subjectId);
}

// Build a threaded tree of comments for a given subject
export function getCommentTree(subjectId: string, allComments: PDBComment[] = PDB_COMMENTS): PDBCommentNode[] {
  const forSubject = getCommentsForSubject(subjectId, allComments);
  const nodes = new Map<string, PDBCommentNode>();
  forSubject.forEach(c => nodes.set(c.id, { ...c, replies: [] }));

  const roots: PDBCommentNode[] = [];
  forSubject.forEach(c => {
    const node = nodes.get(c.id)!;
    if (c.parentId && nodes.has(c.parentId)) {
      nodes.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}
