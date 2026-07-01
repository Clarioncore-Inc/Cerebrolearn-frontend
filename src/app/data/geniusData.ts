import { Genius, GeniusExpertise, GeniusAchievement, GeniusContribution, GeniusProfileType } from '../types/genius';

const now = new Date().toISOString();

type GeniusSeed = Omit<
  Genius,
  | 'slug'
  | 'iq_score_label'
  | 'iq_score_note'
  | 'image_attribution'
  | 'profile_type'
  | 'is_fictional'
  | 'source_url'
  | 'editorial_note'
  | 'publication_status'
>;

// Historical Genius Profiles Database
const geniusSeeds: GeniusSeed[] = [
  // Physics & Mathematics
  {
    id: 'albert-einstein',
    full_name: 'Albert Einstein',
    iq_score: 160,
    birth_date: '1879-03-14',
    death_date: '1955-04-18',
    birth_place: 'Ulm, Kingdom of Württemberg, German Empire',
    zodiac_sign: 'Pisces',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. His work is also known for its influence on the philosophy of science. He is best known to the general public for his mass–energy equivalence formula E = mc², which has been dubbed "the world\'s most famous equation".',
    short_description: 'Theoretical physicist who developed the theory of relativity and mass-energy equivalence formula E=mc²',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'isaac-newton',
    full_name: 'Sir Isaac Newton',
    iq_score: 190,
    birth_date: '1643-01-04',
    death_date: '1727-03-31',
    birth_place: 'Woolsthorpe-by-Colsterworth, Lincolnshire, England',
    zodiac_sign: 'Capricorn',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Sir Isaac Newton was an English mathematician, physicist, astronomer, theologian, and author who is widely recognised as one of the most influential scientists of all time. His book Philosophiæ Naturalis Principia Mathematica established classical mechanics and laid the foundations for modern physics.',
    short_description: 'Mathematician and physicist who formulated the laws of motion and universal gravitation',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'stephen-hawking',
    full_name: 'Stephen Hawking',
    iq_score: 160,
    birth_date: '1942-01-08',
    death_date: '2018-03-14',
    birth_place: 'Oxford, England',
    zodiac_sign: 'Capricorn',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Stephen William Hawking was an English theoretical physicist, cosmologist, and author. He was director of research at the Centre for Theoretical Cosmology at the University of Cambridge and made groundbreaking contributions to the fields of cosmology, general relativity and quantum gravity.',
    short_description: 'Theoretical physicist known for his work on black holes and cosmology',
    era: 'Contemporary',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'marie-curie',
    full_name: 'Marie Curie',
    iq_score: 185,
    birth_date: '1867-11-07',
    death_date: '1934-07-04',
    birth_place: 'Warsaw, Poland',
    zodiac_sign: 'Scorpio',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Marie Skłodowska Curie was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the first person and the only woman to win the Nobel Prize twice, and the only person to win the Nobel Prize in two different scientific fields.',
    short_description: 'Pioneering physicist and chemist who discovered radium and polonium, first woman to win Nobel Prize',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'nikola-tesla',
    full_name: 'Nikola Tesla',
    iq_score: 195,
    birth_date: '1856-07-10',
    death_date: '1943-01-07',
    birth_place: 'Smiljan, Austrian Empire',
    zodiac_sign: 'Cancer',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Nikola Tesla was a Serbian-American inventor, electrical engineer, mechanical engineer, and futurist best known for his contributions to the design of the modern alternating current electricity supply system. His patents and theoretical work formed the basis of modern AC electricity.',
    short_description: 'Inventor and electrical engineer who pioneered alternating current (AC) electrical systems',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'galileo-galilei',
    full_name: 'Galileo Galilei',
    iq_score: 185,
    birth_date: '1564-02-15',
    death_date: '1642-01-08',
    birth_place: 'Pisa, Duchy of Florence, Italy',
    zodiac_sign: 'Aquarius',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Galileo di Vincenzo Bonaiuti de\' Galilei was an Italian astronomer, physicist and engineer. He has been called the "father of observational astronomy", the "father of modern physics", and the "father of the scientific method". His contributions to observational astronomy include telescopic confirmation of the phases of Venus.',
    short_description: 'Astronomer and physicist called the father of modern science and scientific method',
    era: 'Renaissance',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Computer Science & Technology
  {
    id: 'alan-turing',
    full_name: 'Alan Turing',
    iq_score: 185,
    birth_date: '1912-06-23',
    death_date: '1954-06-07',
    birth_place: 'Maida Vale, London, England',
    zodiac_sign: 'Cancer',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Alan Mathison Turing was an English mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist. Turing was highly influential in the development of theoretical computer science, providing a formalisation of the concepts of algorithm and computation with the Turing machine.',
    short_description: 'Father of computer science and artificial intelligence, broke the Enigma code in WWII',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ada-lovelace',
    full_name: 'Ada Lovelace',
    iq_score: 170,
    birth_date: '1815-12-10',
    death_date: '1852-11-27',
    birth_place: 'London, England',
    zodiac_sign: 'Sagittarius',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Augusta Ada King, Countess of Lovelace was an English mathematician and writer, chiefly known for her work on Charles Babbage\'s proposed mechanical general-purpose computer, the Analytical Engine. She is often regarded as the first computer programmer.',
    short_description: 'First computer programmer who wrote the first algorithm for a computing machine',
    era: 'Industrial',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'john-von-neumann',
    full_name: 'John von Neumann',
    iq_score: 190,
    birth_date: '1903-12-28',
    death_date: '1957-02-08',
    birth_place: 'Budapest, Austria-Hungary',
    zodiac_sign: 'Capricorn',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'John von Neumann was a Hungarian-American mathematician, physicist, computer scientist, engineer and polymath. Von Neumann made major contributions to many fields, including mathematics, physics, economics, computing, and statistics. He was a pioneer of the application of operator theory to quantum mechanics.',
    short_description: 'Polymath who pioneered computer architecture, game theory, and quantum mechanics',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Philosophy
  {
    id: 'aristotle',
    full_name: 'Aristotle',
    iq_score: 180,
    birth_date: '-0384-01-01',
    death_date: '-0322-01-01',
    birth_place: 'Stagira, Chalcidice, Greece',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Aristotle was a Greek philosopher and polymath during the Classical period in Ancient Greece. Taught by Plato, he was the founder of the Lyceum and the Peripatetic school of philosophy. His writings cover many subjects including physics, biology, zoology, metaphysics, logic, ethics, aesthetics, poetry, theatre, music, rhetoric, psychology, linguistics, economics, politics, and government.',
    short_description: 'Ancient Greek philosopher who studied under Plato and tutored Alexander the Great',
    era: 'Ancient',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plato',
    full_name: 'Plato',
    iq_score: 175,
    birth_date: '-0428-01-01',
    death_date: '-0348-01-01',
    birth_place: 'Athens, Greece',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Plato was an Athenian philosopher during the Classical period in Ancient Greece, founder of the Platonist school of thought and the Academy, the first institution of higher learning in the Western world. He is widely considered a pivotal figure in the history of Ancient Greek and Western philosophy.',
    short_description: 'Founder of the Academy and student of Socrates, developed theory of Forms',
    era: 'Ancient',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'socrates',
    full_name: 'Socrates',
    iq_score: 180,
    birth_date: '-0470-01-01',
    death_date: '-0399-01-01',
    birth_place: 'Athens, Greece',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Socrates was a Greek philosopher from Athens who is credited as one of the founders of Western philosophy, and as being the first moral philosopher of the Western ethical tradition of thought. An enigmatic figure, he made no writings, and is known chiefly through the accounts of classical writers composing after his lifetime.',
    short_description: 'Father of Western philosophy known for Socratic method of inquiry',
    era: 'Ancient',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'immanuel-kant',
    full_name: 'Immanuel Kant',
    iq_score: 175,
    birth_date: '1724-04-22',
    death_date: '1804-02-12',
    birth_place: 'Königsberg, Prussia',
    zodiac_sign: 'Taurus',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Immanuel Kant was a German philosopher and one of the central Enlightenment thinkers. His comprehensive and systematic works in epistemology, metaphysics, ethics, and aesthetics have made him one of the most influential figures in modern Western philosophy.',
    short_description: 'Enlightenment philosopher who developed categorical imperative and transcendental idealism',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'rene-descartes',
    full_name: 'René Descartes',
    iq_score: 180,
    birth_date: '1596-03-31',
    death_date: '1650-02-11',
    birth_place: 'La Haye en Touraine, France',
    zodiac_sign: 'Aries',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'René Descartes was a French philosopher, mathematician, and scientist. Dubbed the father of modern philosophy, much of subsequent Western philosophy is a response to his writings. He is famous for having made an important connection between geometry and algebra, which allowed for the solving of geometrical problems by way of algebraic equations.',
    short_description: 'Father of modern philosophy, known for "I think, therefore I am" and analytical geometry',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'friedrich-nietzsche',
    full_name: 'Friedrich Nietzsche',
    iq_score: 170,
    birth_date: '1844-10-15',
    death_date: '1900-08-25',
    birth_place: 'Röcken, Prussia',
    zodiac_sign: 'Libra',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Friedrich Wilhelm Nietzsche was a German philosopher, cultural critic, composer, poet, and philologist whose work has exerted a profound influence on modern intellectual history. His critiques of contemporary culture, religion, and philosophy centered on a basic question regarding the foundation of values and morality.',
    short_description: 'Philosopher who developed concepts of Übermensch and eternal recurrence',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Arts & Renaissance
  {
    id: 'leonardo-da-vinci',
    full_name: 'Leonardo da Vinci',
    iq_score: 200,
    birth_date: '1452-04-15',
    death_date: '1519-05-02',
    birth_place: 'Vinci, Republic of Florence',
    zodiac_sign: 'Aries',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Leonardo di ser Piero da Vinci was an Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor and architect. His areas of interest included invention, drawing, painting, sculpting, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, writing, history, and cartography.',
    short_description: 'Ultimate Renaissance polymath: artist, inventor, scientist, and visionary genius',
    era: 'Renaissance',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'michelangelo',
    full_name: 'Michelangelo Buonarroti',
    iq_score: 180,
    birth_date: '1475-03-06',
    death_date: '1564-02-18',
    birth_place: 'Caprese, Republic of Florence',
    zodiac_sign: 'Pisces',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Michelangelo di Lodovico Buonarroti Simoni, known best as simply Michelangelo, was an Italian sculptor, painter, architect and poet of the High Renaissance born in the Republic of Florence. His work demonstrated a blend of psychological insight, physical realism and intensity never before seen.',
    short_description: 'Renaissance sculptor, painter, and architect who created David and the Sistine Chapel ceiling',
    era: 'Renaissance',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'pablo-picasso',
    full_name: 'Pablo Picasso',
    iq_score: 175,
    birth_date: '1881-10-25',
    death_date: '1973-04-08',
    birth_place: 'Málaga, Spain',
    zodiac_sign: 'Scorpio',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Pablo Ruiz Picasso was a Spanish painter, sculptor, printmaker, ceramicist and theatre designer who spent most of his adult life in France. Regarded as one of the most influential artists of the 20th century, he is known for co-founding the Cubist movement and for the wide variety of styles that he helped develop and explore.',
    short_description: 'Co-founder of Cubism and one of the most influential artists of the 20th century',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Music
  {
    id: 'wolfgang-mozart',
    full_name: 'Wolfgang Amadeus Mozart',
    iq_score: 165,
    birth_date: '1756-01-27',
    death_date: '1791-12-05',
    birth_place: 'Salzburg, Austria',
    zodiac_sign: 'Aquarius',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Wolfgang Amadeus Mozart was a prolific and influential composer of the Classical period. Born in Salzburg, Mozart showed prodigious ability from his earliest childhood. Already competent on keyboard and violin, he composed from the age of five and performed before European royalty.',
    short_description: 'Prolific Classical composer who created over 600 works including operas, symphonies, and concertos',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'ludwig-beethoven',
    full_name: 'Ludwig van Beethoven',
    iq_score: 165,
    birth_date: '1770-12-17',
    death_date: '1827-03-26',
    birth_place: 'Bonn, Germany',
    zodiac_sign: 'Sagittarius',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Ludwig van Beethoven was a German composer and pianist. Beethoven remains one of the most admired composers in the history of Western music; his works rank amongst the most performed of the classical music repertoire. He continued to compose even after losing his hearing.',
    short_description: 'Revolutionary composer who bridged Classical and Romantic eras, composed while deaf',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'johann-bach',
    full_name: 'Johann Sebastian Bach',
    iq_score: 165,
    birth_date: '1685-03-31',
    death_date: '1750-07-28',
    birth_place: 'Eisenach, Germany',
    zodiac_sign: 'Aries',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Johann Sebastian Bach was a German composer and musician of the Baroque period. He is known for instrumental compositions such as the Brandenburg Concertos and the Goldberg Variations, and for vocal music such as the St Matthew Passion and the Mass in B minor.',
    short_description: 'Baroque composer whose works are fundamental to Western classical music',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Literature
  {
    id: 'william-shakespeare',
    full_name: 'William Shakespeare',
    iq_score: 210,
    birth_date: '1564-04-26',
    death_date: '1616-04-23',
    birth_place: 'Stratford-upon-Avon, England',
    zodiac_sign: 'Taurus',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world\'s greatest dramatist. He is often called England\'s national poet and the "Bard of Avon". His plays have been translated into every major living language and are performed more often than those of any other playwright.',
    short_description: 'Greatest English playwright and poet, wrote 37 plays and 154 sonnets',
    era: 'Renaissance',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'johann-goethe',
    full_name: 'Johann Wolfgang von Goethe',
    iq_score: 210,
    birth_date: '1749-08-28',
    death_date: '1832-03-22',
    birth_place: 'Frankfurt, Germany',
    zodiac_sign: 'Virgo',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Johann Wolfgang von Goethe was a German writer and statesman. His works include: four novels; epic and lyric poetry; prose and verse dramas; memoirs; an autobiography; literary and aesthetic criticism; and treatises on botany, anatomy, and colour. In addition, numerous literary and scientific fragments, more than 10,000 letters, and nearly 3,000 drawings by him have survived.',
    short_description: 'German polymath and author of Faust, considered the greatest German literary figure',
    era: 'Enlightenment',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'leo-tolstoy',
    full_name: 'Leo Tolstoy',
    iq_score: 170,
    birth_date: '1828-09-09',
    death_date: '1910-11-20',
    birth_place: 'Yasnaya Polyana, Russia',
    zodiac_sign: 'Virgo',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Count Lev Nikolayevich Tolstoy, usually referred to in English as Leo Tolstoy, was a Russian writer who is regarded as one of the greatest authors of all time. He received nominations for the Nobel Prize in Literature every year from 1902 to 1906 and for the Nobel Peace Prize in 1901, 1902, and 1909.',
    short_description: 'Russian author of War and Peace and Anna Karenina, master of realistic fiction',
    era: 'Modern',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Biology & Natural Sciences
  {
    id: 'charles-darwin',
    full_name: 'Charles Darwin',
    iq_score: 165,
    birth_date: '1809-02-12',
    death_date: '1882-04-19',
    birth_place: 'Shrewsbury, England',
    zodiac_sign: 'Aquarius',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Charles Robert Darwin was an English naturalist, geologist and biologist, best known for his contributions to the science of evolution. His proposition that all species of life have descended over time from common ancestors is now widely accepted and considered a foundational concept in science.',
    short_description: 'Naturalist who developed theory of evolution by natural selection',
    era: 'Industrial',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Modern Innovators
  {
    id: 'steve-jobs',
    full_name: 'Steve Jobs',
    iq_score: 160,
    birth_date: '1955-02-24',
    death_date: '2011-10-05',
    birth_place: 'San Francisco, California, USA',
    zodiac_sign: 'Pisces',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Steven Paul Jobs was an American entrepreneur, industrial designer, business magnate, media proprietor, and investor. He was the co-founder, chairman, and CEO of Apple Inc. Jobs is widely recognized as a pioneer of the personal computer revolution and for his influential career in the computer and consumer electronics fields.',
    short_description: 'Co-founder of Apple Inc., revolutionized personal computing, smartphones, and digital music',
    era: 'Contemporary',
    is_historical: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'elon-musk',
    full_name: 'Elon Musk',
    iq_score: 160,
    birth_date: '1971-06-28',
    death_date: null,
    birth_place: 'Pretoria, South Africa',
    zodiac_sign: 'Cancer',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Elon Reeve Musk is a business magnate and investor. He is the founder, CEO and chief engineer of SpaceX; angel investor, CEO and product architect of Tesla, Inc.; owner and CEO of Twitter; founder of the Boring Company; co-founder of Neuralink and OpenAI; and president of the philanthropic Musk Foundation.',
    short_description: 'Entrepreneur leading SpaceX, Tesla, and advancing sustainable energy and space exploration',
    era: 'Contemporary',
    is_historical: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bill-gates',
    full_name: 'Bill Gates',
    iq_score: 160,
    birth_date: '1955-10-28',
    death_date: null,
    birth_place: 'Seattle, Washington, USA',
    zodiac_sign: 'Scorpio',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'William Henry Gates III is an American business magnate, software developer, investor, author, and philanthropist. He is best known as the co-founder of Microsoft Corporation. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect.',
    short_description: 'Co-founder of Microsoft, pioneered personal computing revolution and global philanthropy',
    era: 'Contemporary',
    is_historical: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mark-zuckerberg',
    full_name: 'Mark Zuckerberg',
    iq_score: 152,
    birth_date: '1984-05-14',
    death_date: null,
    birth_place: 'White Plains, New York, USA',
    zodiac_sign: 'Taurus',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Mark Elliot Zuckerberg is an American media magnate, internet entrepreneur, and philanthropist. He is known for co-founding the social media website Facebook and its parent company Meta Platforms (formerly Facebook, Inc.), of which he is the chairman, chief executive officer, and controlling shareholder.',
    short_description: 'Co-founder and CEO of Meta (Facebook), transformed global social connectivity',
    era: 'Contemporary',
    is_historical: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const geniusImageUrls: Record<string, string> = {
  'albert-einstein': 'https://commons.wikimedia.org/wiki/Special:FilePath/Einstein_1921_by_F_Schmutzer_-_restoration.jpg',
  'isaac-newton': 'https://commons.wikimedia.org/wiki/Special:FilePath/GodfreyKneller-IsaacNewton-1689.jpg',
  'stephen-hawking': 'https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Hawking.StarChild.jpg',
  'marie-curie': 'https://commons.wikimedia.org/wiki/Special:FilePath/Marie_Curie_c1920.jpg',
  'nikola-tesla': 'https://commons.wikimedia.org/wiki/Special:FilePath/N.Tesla.JPG',
  'galileo-galilei': 'https://commons.wikimedia.org/wiki/Special:FilePath/Galileo.arp.300pix.jpg',
  'alan-turing': 'https://commons.wikimedia.org/wiki/Special:FilePath/Alan_Turing_Aged_16.jpg',
  'ada-lovelace': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ada_Lovelace_portrait.jpg',
  'john-von-neumann': 'https://commons.wikimedia.org/wiki/Special:FilePath/JohnvonNeumann-LosAlamos.gif',
  aristotle: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aristotle_Altemps_Inv8575.jpg',
  plato: 'https://commons.wikimedia.org/wiki/Special:FilePath/Plato_Silanion_Musei_Capitolini_MC1377.jpg',
  socrates: 'https://commons.wikimedia.org/wiki/Special:FilePath/Socrates_Louvre.jpg',
  'immanuel-kant': 'https://commons.wikimedia.org/wiki/Special:FilePath/Immanuel_Kant_%28painted_portrait%29.jpg',
  'rene-descartes': 'https://commons.wikimedia.org/wiki/Special:FilePath/Frans_Hals_-_Portret_van_Ren%C3%A9_Descartes.jpg',
  'friedrich-nietzsche': 'https://commons.wikimedia.org/wiki/Special:FilePath/Nietzsche187a.jpg',
  'leonardo-da-vinci': 'https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo_self.jpg',
  michelangelo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Michelangelo_Daniele_da_Volterra_%28dettaglio%29.jpg',
  'pablo-picasso': 'https://commons.wikimedia.org/wiki/Special:FilePath/Pablo_picasso_1.jpg',
  'wolfgang-mozart': 'https://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang-amadeus-mozart_1.jpg',
  'ludwig-beethoven': 'https://commons.wikimedia.org/wiki/Special:FilePath/Beethoven.jpg',
  'johann-bach': 'https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach.jpg',
  'william-shakespeare': 'https://commons.wikimedia.org/wiki/Special:FilePath/Chandos_portrait_of_William_Shakespeare.jpg',
  'johann-goethe': 'https://commons.wikimedia.org/wiki/Special:FilePath/Goethe_%28Stieler_1828%29.jpg',
  'leo-tolstoy': 'https://commons.wikimedia.org/wiki/Special:FilePath/L.N.Tolstoy_Prokudin-Gorsky.jpg',
  'charles-darwin': 'https://commons.wikimedia.org/wiki/Special:FilePath/Charles_Darwin_01.jpg',
  'steve-jobs': 'https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Jobs_Headshot_2010-CROP.jpg',
  'elon-musk': 'https://commons.wikimedia.org/wiki/Special:FilePath/Elon_Musk_Royal_Society_%28crop2%29.jpg',
  'bill-gates': 'https://commons.wikimedia.org/wiki/Special:FilePath/Bill_Gates_2018.jpg',
  'mark-zuckerberg': 'https://commons.wikimedia.org/wiki/Special:FilePath/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
  'noam-chomsky': 'https://commons.wikimedia.org/wiki/Special:FilePath/Noam_Chomsky_portrait_2017_retouched.png',
  'jane-goodall': 'https://commons.wikimedia.org/wiki/Special:FilePath/Jane_Goodall_2015.jpg',
  'yuval-noah-harari': 'https://commons.wikimedia.org/wiki/Special:FilePath/Yuval_Noah_Harari_cropped.jpg',
  'daniel-kahneman': 'https://commons.wikimedia.org/wiki/Special:FilePath/Daniel_Kahneman_%283282213567%29_%28cropped%29.jpg',
};

const profileTypes: Record<string, GeniusProfileType> = {
  'steve-jobs': 'public_intellectual',
  'elon-musk': 'public_intellectual',
  'bill-gates': 'public_intellectual',
  'mark-zuckerberg': 'public_intellectual',
};

const sourceNames: Record<string, string> = {
  'sherlock-holmes': 'Arthur Conan Doyle stories',
  'hermione-granger': 'Harry Potter series',
  'mr-spock': 'Star Trek',
  'tony-stark': 'Marvel fiction',
};

const fictionalProfiles: GeniusSeed[] = [
  {
    id: 'sherlock-holmes',
    full_name: 'Sherlock Holmes',
    iq_score: null,
    birth_date: null,
    death_date: null,
    birth_place: 'London, England',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Sherlock Holmes is a fictional consulting detective created by Arthur Conan Doyle. This profile is included as a literary benchmark for observation, deductive reasoning, pattern recognition, and analytical discipline rather than as a real-world IQ claim.',
    short_description: 'Fictional detective used as a benchmark for observation, deduction, and analytical reasoning',
    era: 'Modern',
    is_historical: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'hermione-granger',
    full_name: 'Hermione Granger',
    iq_score: null,
    birth_date: null,
    death_date: null,
    birth_place: 'Fictional United Kingdom',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Hermione Granger is a fictional character from the Harry Potter series. This profile frames her as a study-skills and applied-knowledge archetype, not as a real person or verified psychological profile.',
    short_description: 'Fictional learner archetype for disciplined study, memory, and applied problem solving',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'mr-spock',
    full_name: 'Spock',
    iq_score: null,
    birth_date: null,
    death_date: null,
    birth_place: 'Vulcan',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Spock is a fictional Star Trek character. This profile is used as a logic, composure, and systems-thinking archetype rather than a literal intelligence comparison.',
    short_description: 'Fictional logic archetype for systems thinking, composure, and analytical judgment',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'tony-stark',
    full_name: 'Tony Stark',
    iq_score: null,
    birth_date: null,
    death_date: null,
    birth_place: 'Fictional United States',
    zodiac_sign: null,
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Tony Stark is a fictional Marvel character. This profile represents a fictional engineering and invention archetype and should not be read as a real psychological assessment.',
    short_description: 'Fictional engineering archetype for invention, rapid prototyping, and technical creativity',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  }
];

const publicIntellectualProfiles: GeniusSeed[] = [
  {
    id: 'noam-chomsky',
    full_name: 'Noam Chomsky',
    iq_score: null,
    birth_date: '1928-12-07',
    death_date: null,
    birth_place: 'Philadelphia, Pennsylvania, USA',
    zodiac_sign: 'Sagittarius',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Noam Chomsky is a linguist, philosopher, cognitive scientist, historian, and public intellectual. This profile highlights publicly documented influence in linguistics and political analysis without making a verified IQ claim.',
    short_description: 'Public intellectual known for linguistics, cognitive science, and political analysis',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'jane-goodall',
    full_name: 'Jane Goodall',
    iq_score: null,
    birth_date: '1934-04-03',
    death_date: null,
    birth_place: 'London, England',
    zodiac_sign: 'Aries',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Jane Goodall is a primatologist, ethologist, and conservationist known for decades of chimpanzee research. This profile emphasizes expertise, research impact, and public education rather than IQ.',
    short_description: 'Primatologist and conservationist known for field research and public science education',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'yuval-noah-harari',
    full_name: 'Yuval Noah Harari',
    iq_score: null,
    birth_date: '1976-02-24',
    death_date: null,
    birth_place: 'Kiryat Ata, Israel',
    zodiac_sign: 'Pisces',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Yuval Noah Harari is a historian and author known for public writing on human history, technology, and society. This profile treats his ranking as an expertise and influence signal, not as a verified IQ score.',
    short_description: 'Historian and public author known for broad work on history, technology, and society',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  },
  {
    id: 'daniel-kahneman',
    full_name: 'Daniel Kahneman',
    iq_score: null,
    birth_date: '1934-03-05',
    death_date: '2024-03-27',
    birth_place: 'Tel Aviv, Mandatory Palestine',
    zodiac_sign: 'Pisces',
    profile_image_url: null,
    banner_image_url: null,
    biography: 'Daniel Kahneman was a psychologist and Nobel laureate whose work on judgment, decision-making, and behavioral economics shaped modern understanding of human cognition. This profile uses awards and research influence rather than IQ.',
    short_description: 'Psychologist and Nobel laureate known for judgment, decision-making, and behavioral economics',
    era: 'Contemporary',
    is_historical: false,
    created_at: now,
    updated_at: now
  }
];

const allProfileSeeds = [...geniusSeeds, ...publicIntellectualProfiles, ...fictionalProfiles];

const buildGeniusProfile = (seed: GeniusSeed): Genius => {
  const profileType = profileTypes[seed.id] ?? (seed.is_historical ? 'historical' : 'public_intellectual');
  const isFictional = sourceNames[seed.id] !== undefined || profileType === 'fictional';
  const resolvedType: GeniusProfileType = isFictional ? 'fictional' : profileType;

  return {
    ...seed,
    slug: seed.id,
    profile_image_url: geniusImageUrls[seed.id] ?? seed.profile_image_url,
    image_attribution: geniusImageUrls[seed.id] ? 'Wikimedia Commons public media URL' : null,
    profile_type: resolvedType,
    is_fictional: isFictional,
    iq_score_label: seed.iq_score
      ? resolvedType === 'historical'
        ? 'Estimated historical IQ'
        : 'Reported/estimated IQ'
      : 'No verified IQ score',
    iq_score_note: seed.iq_score
      ? 'IQ values shown here are estimates or widely circulated public figures, not verified clinical records.'
      : 'No verified IQ score is shown. This profile uses expertise, influence, and documented achievements instead.',
    source_url: sourceNames[seed.id]
      ? null
      : `https://en.wikipedia.org/wiki/${encodeURIComponent(seed.full_name.replace(/\s+/g, '_'))}`,
    editorial_note: isFictional
      ? `Fictional profile from ${sourceNames[seed.id]}. Use as an archetype, not a real person comparison.`
      : 'Editorial profile for learning inspiration. Intelligence labels are contextual and should be read as estimates where shown.',
    publication_status: 'published',
  };
};

export const geniuses: Genius[] = allProfileSeeds.map(buildGeniusProfile);

// Genius Expertise Data
export const geniusExpertise: GeniusExpertise[] = [
  // Einstein
  { id: 'exp-1', genius_id: 'albert-einstein', expertise: 'Theoretical Physics', proficiency_level: 10 },
  { id: 'exp-2', genius_id: 'albert-einstein', expertise: 'Mathematics', proficiency_level: 9 },
  { id: 'exp-3', genius_id: 'albert-einstein', expertise: 'Philosophy of Science', proficiency_level: 8 },

  // Newton
  { id: 'exp-4', genius_id: 'isaac-newton', expertise: 'Physics', proficiency_level: 10 },
  { id: 'exp-5', genius_id: 'isaac-newton', expertise: 'Mathematics', proficiency_level: 10 },
  { id: 'exp-6', genius_id: 'isaac-newton', expertise: 'Astronomy', proficiency_level: 9 },
  { id: 'exp-7', genius_id: 'isaac-newton', expertise: 'Theology', proficiency_level: 7 },

  // Leonardo da Vinci
  { id: 'exp-8', genius_id: 'leonardo-da-vinci', expertise: 'Painting', proficiency_level: 10 },
  { id: 'exp-9', genius_id: 'leonardo-da-vinci', expertise: 'Engineering', proficiency_level: 9 },
  { id: 'exp-10', genius_id: 'leonardo-da-vinci', expertise: 'Anatomy', proficiency_level: 9 },
  { id: 'exp-11', genius_id: 'leonardo-da-vinci', expertise: 'Architecture', proficiency_level: 8 },
  { id: 'exp-12', genius_id: 'leonardo-da-vinci', expertise: 'Mathematics', proficiency_level: 8 },

  // Marie Curie
  { id: 'exp-13', genius_id: 'marie-curie', expertise: 'Physics', proficiency_level: 10 },
  { id: 'exp-14', genius_id: 'marie-curie', expertise: 'Chemistry', proficiency_level: 10 },
  { id: 'exp-15', genius_id: 'marie-curie', expertise: 'Radioactivity', proficiency_level: 10 },
];

// Genius Achievements
export const geniusAchievements: GeniusAchievement[] = [
  // Einstein
  {
    id: 'ach-1',
    genius_id: 'albert-einstein',
    title: 'Theory of Special Relativity',
    description: 'Developed the theory that revolutionized our understanding of space and time',
    year: 1905,
    category: 'Theory'
  },
  {
    id: 'ach-2',
    genius_id: 'albert-einstein',
    title: 'Nobel Prize in Physics',
    description: 'Awarded for his explanation of the photoelectric effect',
    year: 1921,
    category: 'Award'
  },
  {
    id: 'ach-3',
    genius_id: 'albert-einstein',
    title: 'General Theory of Relativity',
    description: 'Published groundbreaking theory of gravitation',
    year: 1915,
    category: 'Theory'
  },

  // Newton
  {
    id: 'ach-4',
    genius_id: 'isaac-newton',
    title: 'Principia Mathematica',
    description: 'Published the foundational work of classical mechanics',
    year: 1687,
    category: 'Publication'
  },
  {
    id: 'ach-5',
    genius_id: 'isaac-newton',
    title: 'Laws of Motion',
    description: 'Formulated the three laws of motion',
    year: 1687,
    category: 'Discovery'
  },
  {
    id: 'ach-6',
    genius_id: 'isaac-newton',
    title: 'Law of Universal Gravitation',
    description: 'Discovered the law explaining gravitational force',
    year: 1687,
    category: 'Discovery'
  },

  // Marie Curie
  {
    id: 'ach-7',
    genius_id: 'marie-curie',
    title: 'Discovery of Radium',
    description: 'Discovered the radioactive element radium',
    year: 1898,
    category: 'Discovery'
  },
  {
    id: 'ach-8',
    genius_id: 'marie-curie',
    title: 'Nobel Prize in Physics',
    description: 'First woman to win Nobel Prize, shared with Pierre Curie',
    year: 1903,
    category: 'Award'
  },
  {
    id: 'ach-9',
    genius_id: 'marie-curie',
    title: 'Nobel Prize in Chemistry',
    description: 'Second Nobel Prize for discovery of radium and polonium',
    year: 1911,
    category: 'Award'
  },
];

// Genius Contributions
export const geniusContributions: GeniusContribution[] = [
  {
    id: 'con-1',
    genius_id: 'albert-einstein',
    field: 'Physics',
    contribution: 'Mass-energy equivalence (E=mc²)',
    impact_score: 10,
    year: 1905
  },
  {
    id: 'con-2',
    genius_id: 'isaac-newton',
    field: 'Mathematics',
    contribution: 'Development of Calculus',
    impact_score: 10,
    year: 1666
  },
  {
    id: 'con-3',
    genius_id: 'leonardo-da-vinci',
    field: 'Art',
    contribution: 'Mona Lisa and The Last Supper paintings',
    impact_score: 10,
    year: 1500
  },
  {
    id: 'con-4',
    genius_id: 'alan-turing',
    field: 'Computer Science',
    contribution: 'Turing Machine and foundations of AI',
    impact_score: 10,
    year: 1936
  },
];

// Helper function to get genius by ID
export function getGeniusById(id: string): Genius | undefined {
  return geniuses.find(g => g.id === id);
}

// Helper function to get expertise for a genius
export function getGeniusExpertise(geniusId: string): GeniusExpertise[] {
  return geniusExpertise.filter(e => e.genius_id === geniusId);
}

// Helper function to get achievements for a genius
export function getGeniusAchievements(geniusId: string): GeniusAchievement[] {
  return geniusAchievements.filter(a => a.genius_id === geniusId);
}

// Helper function to get contributions for a genius
export function getGeniusContributions(geniusId: string): GeniusContribution[] {
  return geniusContributions.filter(c => c.genius_id === geniusId);
}
