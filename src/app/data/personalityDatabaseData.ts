import {
  PDBSubject,
  PDBVoteTally,
  PDBComment,
  PDBCommentNode,
  PDBTypeResult,
  PersonalitySystemMeta,
} from '../types/personalityDatabase';
import { MBTIType, MBTI_PROFILES } from './mbtiData';
import { getGeniusById } from './geniusData';

// ---- Personality systems (pluggable, MBTI is priority but not the only one) ----
export const PERSONALITY_SYSTEMS: PersonalitySystemMeta[] = [
  {
    id: 'mbti',
    label: 'Myers-Briggs (MBTI)',
    shortLabel: 'MBTI',
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
    typeNames: {
      '1': 'The Reformer', '2': 'The Helper', '3': 'The Achiever',
      '4': 'The Individualist', '5': 'The Investigator', '6': 'The Loyalist',
      '7': 'The Enthusiast', '8': 'The Challenger', '9': 'The Peacemaker',
    },
  },
  {
    id: 'temperament',
    label: 'Four Temperaments',
    shortLabel: 'Temperament',
    typeCodes: ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic'],
    typeNames: {
      Sanguine: 'Sanguine', Choleric: 'Choleric',
      Melancholic: 'Melancholic', Phlegmatic: 'Phlegmatic',
    },
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

function buildVoteTallies(seed: {
  subjectId: string;
  mbti: Record<string, number>;
  enneagram?: Record<string, number>;
  temperament?: Record<string, number>;
}): PDBVoteTally[] {
  return [
    ...tallies(seed.subjectId, 'mbti', seed.mbti),
    ...(seed.enneagram ? tallies(seed.subjectId, 'enneagram', seed.enneagram) : []),
    ...(seed.temperament ? tallies(seed.subjectId, 'temperament', seed.temperament) : []),
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
    createdAt: '2026-07-20T10:00:00.000Z', upvotes: 24,
  },
  {
    id: 'c-2', subjectId: 'albert-einstein', parentId: 'c-1',
    authorName: 'mbti_nerd', isAnonymous: false,
    text: "Disagree, his focus on grand unifying theories over abstract logic games feels more Ni than Ti.",
    createdAt: '2026-07-20T11:15:00.000Z', upvotes: 9,
  },
  {
    id: 'c-3', subjectId: 'albert-einstein', parentId: null,
    authorName: 'Anonymous', isAnonymous: true,
    text: "Enneagram 5 is obvious here — total withdrawal into the mind, detachment from material needs.",
    createdAt: '2026-07-21T08:30:00.000Z', upvotes: 15,
  },
  {
    id: 'c-4', subjectId: 'sherlock-holmes', parentId: null,
    authorName: 'deduction_fan', isAnonymous: false,
    text: "Ti-dom all day. He builds his own internal logic system and tests reality against it, not the other way around.",
    createdAt: '2026-07-22T09:00:00.000Z', upvotes: 31,
  },
  {
    id: 'c-5', subjectId: 'sherlock-holmes', parentId: null,
    authorName: 'Anonymous', isAnonymous: true,
    text: "Can't rule out INTP given how much he enjoys the puzzle itself over the actual justice served.",
    createdAt: '2026-07-22T12:00:00.000Z', upvotes: 12,
  },
];

// Build a threaded tree of comments for a given subject
export function getCommentTree(subjectId: string, allComments: PDBComment[] = PDB_COMMENTS): PDBCommentNode[] {
  const forSubject = allComments.filter(c => c.subjectId === subjectId);
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
