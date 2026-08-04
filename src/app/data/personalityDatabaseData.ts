import { PDBSubject } from '../types/personalityDatabase';
import { MBTIType } from './mbtiData';
import { getGeniusById } from './geniusData';

// ---- Subjects: reuse Genius profiles where available, plus standalone examples ----
function fromGenius(
  geniusId: string,
  category: PDBSubject['category'],
  subcategory: string,
  mbtiType?: MBTIType,
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
    mbtiType,
  };
}

function customSubject(
  id: string,
  name: string,
  category: PDBSubject['category'],
  subcategory: string,
  subtitle: string,
  mbtiType?: MBTIType,
  imageUrl: string | null = null,
): PDBSubject {
  return {
    id,
    slug: id,
    name,
    category,
    subcategory,
    subtitle,
    imageUrl,
    sourceType: 'custom',
    mbtiType,
  };
}

export const PDB_SUBJECTS: PDBSubject[] = [
  fromGenius('albert-einstein', 'Historical Figure', 'Science', 'INTP'),
  fromGenius('nikola-tesla', 'Historical Figure', 'Science', 'INTJ'),
  fromGenius('marie-curie', 'Historical Figure', 'Science', 'INTJ'),
  fromGenius('leonardo-da-vinci', 'Historical Figure', 'Art & Innovation', 'ENTP'),
  customSubject('cleopatra', 'Cleopatra', 'Historical Figure', 'Politics', 'Last active ruler of the Ptolemaic Kingdom of Egypt', 'ENTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Kleopatra-VII.-Altes-Museum-Berlin1.jpg/330px-Kleopatra-VII.-Altes-Museum-Berlin1.jpg'),
  customSubject('nelson-mandela', 'Nelson Mandela', 'Historical Figure', 'Activism', 'Anti-apartheid revolutionary and former President of South Africa', 'ENFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/330px-Nelson_Mandela_1994.jpg'),
  customSubject('winston-churchill', 'Winston Churchill', 'Historical Figure', 'Politics', 'British wartime prime minister, writer, and statesman', 'ENTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg/330px-Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg'),
  customSubject('joan-of-arc', 'Joan of Arc', 'Historical Figure', 'Faith & War', 'French heroine and military leader canonized as a saint', 'INFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Joan_of_Arc_miniature_graded.jpg/330px-Joan_of_Arc_miniature_graded.jpg'),

  fromGenius('elon-musk', 'Public Intellectual', 'Technology', 'INTJ'),
  fromGenius('steve-jobs', 'Public Intellectual', 'Business', 'ENTJ'),
  customSubject('carl-jung', 'Carl Jung', 'Public Intellectual', 'Psychology', 'Founding analytical psychologist known for archetypes and individuation', 'INFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif/lossy-page1-330px-ETH-BIB-Jung%2C_Carl_Gustav_%281875-1961%29-Portrait-Portr_14163_%28cropped%29.tif.jpg'),
  customSubject('carl-sagan', 'Carl Sagan', 'Public Intellectual', 'Science', 'Astronomer and science communicator who popularized cosmic thinking', 'ENTP', 'https://upload.wikimedia.org/wikipedia/commons/b/be/Carl_Sagan_Planetary_Society.JPG'),
  customSubject('yuval-noah-harari', 'Yuval Noah Harari', 'Public Intellectual', 'History & Ideas', 'Historian and author exploring civilization, technology, and culture', 'INTJ'),
  customSubject('brene-brown', 'Brene Brown', 'Public Intellectual', 'Psychology', 'Research professor studying vulnerability, courage, and leadership', 'ENFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Bren%C3%A9_Brown_and_Malcolm_Gladwell_at_SXSW_2025_06_%28cropped%29.jpg/330px-Bren%C3%A9_Brown_and_Malcolm_Gladwell_at_SXSW_2025_06_%28cropped%29.jpg'),
  customSubject('malcolm-gladwell', 'Malcolm Gladwell', 'Public Intellectual', 'Journalism & Ideas', 'Author and journalist known for narrative-driven social analysis', 'ENTP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Malcolm_Gladwell%2C_author%2C_at_SXSW_2025_02_%28cropped%29.jpg/330px-Malcolm_Gladwell%2C_author%2C_at_SXSW_2025_02_%28cropped%29.jpg'),
  customSubject('naval-ravikant', 'Naval Ravikant', 'Public Intellectual', 'Business', 'Entrepreneur and investor focused on wealth, leverage, and judgment', 'INTP', 'https://upload.wikimedia.org/wikipedia/commons/5/55/Naval_Ravikant_%28cropped%29.jpg'),

  fromGenius('sherlock-holmes', 'Fictional Character', 'Detective', 'INTJ'),
  fromGenius('tony-stark', 'Fictional Character', 'Superhero', 'ENTP'),
  fromGenius('hermione-granger', 'Fictional Character', 'Fantasy', 'ISTJ'),
  customSubject('naruto-uzumaki', 'Naruto Uzumaki', 'Fictional Character', 'Anime', 'Energetic ninja protagonist driven by loyalty, grit, and recognition', 'ESFP'),
  customSubject('batman', 'Batman', 'Fictional Character', 'Superhero', 'Brooding vigilante strategist from Gotham City', 'INTJ'),
  customSubject('walter-white', 'Walter White', 'Fictional Character', 'Crime Drama', 'Chemistry teacher turned ruthless meth kingpin', 'INTJ'),
  customSubject('elsa', 'Elsa', 'Fictional Character', 'Fantasy', 'Reserved queen from Frozen learning to embrace her power', 'INFJ'),
  customSubject('light-yagami', 'Light Yagami', 'Fictional Character', 'Anime', 'Gifted student whose god complex drives the Death Note story', 'INTJ'),
  customSubject('katniss-everdeen', 'Katniss Everdeen', 'Fictional Character', 'Dystopian', 'Reluctant rebel and survivor from The Hunger Games', 'ISTP'),
  customSubject('wednesday-addams', 'Wednesday Addams', 'Fictional Character', 'Gothic', 'Deadpan outsider with sharp wit and dark curiosity', 'INTP'),
  customSubject('frodo-baggins', 'Frodo Baggins', 'Fictional Character', 'Fantasy', 'Quiet hobbit tasked with carrying the One Ring to Mordor', 'ISFJ'),
  customSubject('darth-vader', 'Darth Vader', 'Fictional Character', 'Sci-Fi', 'Fallen Jedi enforcer torn between control, pain, and redemption', 'ENTJ'),

  customSubject('zendaya', 'Zendaya', 'Celebrity', 'Pop Culture', 'Actor and fashion icon with wide cross-generational appeal', 'ENFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Zendaya-byPhilipRomano.jpg/330px-Zendaya-byPhilipRomano.jpg'),
  customSubject('oprah-winfrey', 'Oprah Winfrey', 'Celebrity', 'Media', 'Media mogul celebrated for influence, empathy, and storytelling', 'ENFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Oprah_Winfrey_2016.jpg/330px-Oprah_Winfrey_2016.jpg'),
  customSubject('kim-kardashian', 'Kim Kardashian', 'Celebrity', 'Business & Fashion', 'Reality star turned brand builder and business personality', 'ESFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Kim_Kardashian_West_2014.jpg/330px-Kim_Kardashian_West_2014.jpg'),
  customSubject('emma-watson', 'Emma Watson', 'Celebrity', 'Film & Activism', 'Actor and activist known for Harry Potter and advocacy work', 'INFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/330px-Emma_Watson_2013.jpg'),
  customSubject('tom-holland', 'Tom Holland', 'Celebrity', 'Film & TV', 'Actor known for his agile and personable Spider-Man portrayal', 'ENFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/TomHolland-byPhilipRomano.jpg/330px-TomHolland-byPhilipRomano.jpg'),
  customSubject('angelina-jolie', 'Angelina Jolie', 'Celebrity', 'Film & Humanitarian', 'Actor, director, and humanitarian with a global public profile', 'ENFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Angelina_Jolie-643531_%28cropped%29.jpg/330px-Angelina_Jolie-643531_%28cropped%29.jpg'),
  customSubject('mrbeast', 'MrBeast', 'Celebrity', 'Creator Economy', 'YouTube creator known for large-scale stunts and philanthropy', 'ENTP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/MrBeast_in_2026_%28cropped_4%29.png/330px-MrBeast_in_2026_%28cropped_4%29.png'),
  customSubject('ryan-reynolds', 'Ryan Reynolds', 'Celebrity', 'Comedy & Film', 'Actor and entrepreneur known for quick wit and self-aware branding', 'ENTP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg/330px-Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg'),

  customSubject('taylor-swift', 'Taylor Swift', 'Musician', 'Pop', 'Singer-songwriter known for autobiographical songwriting and reinvention', 'ENFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/330px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png'),
  customSubject('beyonce', 'Beyonce', 'Musician', 'Pop & Performance', 'Global performer recognized for precision, presence, and artistic control', 'ENTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg/330px-Beyonc%C3%A9_-_Tottenham_Hotspur_Stadium_-_1st_June_2023_%2810_of_118%29_%2852946364598%29_%28best_crop%29.jpg'),
  customSubject('drake', 'Drake', 'Musician', 'Hip-Hop', 'Chart-dominating rapper and singer balancing confidence and emotional candor', 'ISFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg/330px-Drake_at_The_Carter_Effect_2017_%2836818935200%29_%28cropped%29.jpg'),
  customSubject('kendrick-lamar', 'Kendrick Lamar', 'Musician', 'Hip-Hop', 'Lyrically dense rapper known for introspection and social commentary', 'INFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg/330px-KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg'),
  customSubject('burna-boy', 'Burna Boy', 'Musician', 'Afrobeats', 'Afrofusion artist blending swagger, groove, and global ambition', 'ESTP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Untold_2024_-Burna_Boy_%2853926047977%29_%28cropped%29.jpg/330px-Untold_2024_-Burna_Boy_%2853926047977%29_%28cropped%29.jpg'),
  customSubject('billie-eilish', 'Billie Eilish', 'Musician', 'Alt Pop', 'Minimalist pop artist known for moody intimacy and experimentation', 'ISFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg/330px-BillieEilishO2140725-39_-_54665577407_%28cropped%29.jpg'),
  customSubject('adele', 'Adele', 'Musician', 'Soul & Pop', 'Powerful vocalist known for emotionally direct ballads', 'ISFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/330px-Adele_2016.jpg'),

  customSubject('cristiano-ronaldo', 'Cristiano Ronaldo', 'Athlete', 'Football', 'Elite footballer known for discipline, drive, and relentless ambition', 'ESTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/330px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg'),
  customSubject('lionel-messi', 'Lionel Messi', 'Athlete', 'Football', 'Visionary football playmaker with quiet intensity and effortless genius', 'ISFJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/330px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg'),
  customSubject('lebron-james', 'LeBron James', 'Athlete', 'Basketball', 'Basketball superstar combining leadership, longevity, and versatility', 'ENTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg/330px-LeBron_James_%2851959977144%29_%28cropped2%29.jpg'),
  customSubject('serena-williams', 'Serena Williams', 'Athlete', 'Tennis', 'Tennis champion celebrated for dominance, resilience, and composure', 'ENTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg/330px-Guests_at_the_2026_Met_Gala_209_%28cropped%29.jpg'),
  customSubject('simone-biles', 'Simone Biles', 'Athlete', 'Gymnastics', 'Gymnast redefining excellence through power, precision, and courage', 'ESFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Simone_Biles_National_Team_2024.jpg/330px-Simone_Biles_National_Team_2024.jpg'),
  customSubject('kylian-mbappe', 'Kylian Mbappe', 'Athlete', 'Football', 'Explosive football forward with charisma and competitive flair', 'ENFP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg/330px-Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg'),
  customSubject('kobe-bryant', 'Kobe Bryant', 'Athlete', 'Basketball', 'Legendary competitor known for meticulous preparation and killer instinct', 'INTJ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kobe_Bryant_Dec_2014.jpg/330px-Kobe_Bryant_Dec_2014.jpg'),
];

export function getSubjectBySlug(slug: string): PDBSubject | undefined {
  return PDB_SUBJECTS.find(s => s.slug === slug);
}
