// Comprehensive dummy data system for CerebroLearn - Science & Engineering Focus
// This replaces all API calls with localStorage-based mock data

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  subcategory?: string;
  level: string;
  language: string;
  instructorId: string;
  instructorName: string;
  status: 'draft' | 'published';
  public: boolean;
  price: number;
  priceType: 'free' | 'paid';
  currency?: string;
  discountPrice?: number | null;
  image: string;
  enrollments: number;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  sections?: any[];
  learningObjectives?: string[];
  requirements?: string[];
  targetAudience?: string;
  allowReviews?: boolean;
  enableCertificate?: boolean;
  enableDiscussions?: boolean;
  maxStudents?: number | null;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress: number;
  completed: boolean;
}

// Initialize default courses if none exist
export function initializeDummyData() {
  if (!localStorage.getItem('cerebrolearn_courses')) {
    const defaultCourses: Course[] = [
      // ========================================
      // 🧪 SCIENCE CATEGORY
      // ========================================
      
      // PHYSICS SECTION
      {
        id: 'course-sci-phys-1',
        title: 'Fundamental Physics',
        subtitle: 'The foundation of how matter, energy, force, and motion govern the universe',
        description: 'Explore the foundational principles that govern the physical world—from motion and forces to electricity and magnetism, to waves, light, and heat. This course builds the essential framework of classical physics for aspiring engineers and scientists.',
        category: 'Science',
        subcategory: 'Physics',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-dominique-davenport',
        instructorName: 'Dr. Dominique Davenport',
        status: 'published',
        public: true,
        price: 89.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop',
        enrollments: 2847,
        rating: 4.9,
        reviews: 1243,
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString(),
        sections: [],
        learningObjectives: [
          'Master Newton\'s laws of motion and classical mechanics',
          'Understand electricity, magnetism, and electromagnetic waves',
          'Explore thermodynamics and heat transfer principles',
          'Analyze wave behavior, optics, and light phenomena'
        ],
        requirements: ['Basic algebra and trigonometry', 'Scientific curiosity'],
        targetAudience: 'Aspiring engineers, physicists, and science enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-sci-phys-2',
        title: 'Theoretical Physics',
        subtitle: 'General Relativity, Quantum Mechanics, and Modern Physics Theories',
        description: 'Jump into the deep end of contemporary physics with Einstein\'s General Relativity, the mysteries of quantum mechanics, and relevant discussions of String Theory and Loop Quantum Gravity. Compare and contrast their implications, logical differences, and epistemological foundations for your own opinion on an accurate description of the universe.',
        category: 'Science',
        subcategory: 'Physics',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-dominique-davenport',
        instructorName: 'Dr. Dominique Davenport',
        status: 'published',
        public: true,
        price: 149.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
        enrollments: 1456,
        rating: 5.0,
        reviews: 687,
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-03-18').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand Einstein\'s Theory of General Relativity and spacetime curvature',
          'Master quantum mechanics principles and wave-particle duality',
          'Explore String Theory and Loop Quantum Gravity frameworks',
          'Develop critical thinking about competing physics theories'
        ],
        requirements: ['Fundamental Physics or equivalent', 'Strong calculus and linear algebra', 'Advanced mathematical reasoning'],
        targetAudience: 'Advanced physics students and theoretical physics enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-sci-phys-3',
        title: 'Quantum Computing',
        subtitle: 'Harness quantum superposition and entanglement for revolutionary computation',
        description: 'Learn how information processing is being revolutionized by quantum bits, or qubits. Discover how new algorithms that outperform classical computers are powered by quantum concepts like superposition and entanglement.',
        category: 'Science',
        subcategory: 'Physics',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-dominique-davenport',
        instructorName: 'Dr. Dominique Davenport',
        status: 'published',
        public: true,
        price: 169.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 139.99,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
        enrollments: 987,
        rating: 4.8,
        reviews: 423,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-03-20').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand quantum bits (qubits) and quantum gates',
          'Master quantum superposition and entanglement principles',
          'Implement quantum algorithms like Shor\'s and Grover\'s',
          'Compare quantum vs classical computational advantages'
        ],
        requirements: ['Linear algebra proficiency', 'Quantum mechanics basics', 'Programming experience helpful'],
        targetAudience: 'Computer scientists, physicists, and quantum technology enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ASTRONOMY SECTION
      {
        id: 'course-sci-astro-1',
        title: 'Astrophysics',
        subtitle: 'Explore black holes, neutron stars, and gravitational waves',
        description: 'Uncover the secrets of the cosmos through phenomena like black holes, neutron stars, and gravitational waves. Study the most energetic and mysterious objects in the universe.',
        category: 'Science',
        subcategory: 'Astronomy',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-caitlin-kepple',
        instructorName: 'Caitlin Kepple, M.S.',
        status: 'published',
        public: true,
        price: 99.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop',
        enrollments: 1834,
        rating: 4.9,
        reviews: 892,
        createdAt: new Date('2024-01-12').toISOString(),
        updatedAt: new Date('2024-03-14').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand black hole formation and properties',
          'Explore neutron stars and pulsars',
          'Learn about gravitational wave detection',
          'Study high-energy cosmic phenomena'
        ],
        requirements: ['Basic physics knowledge', 'Calculus recommended but not required'],
        targetAudience: 'Astronomy enthusiasts and physics students',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-sci-astro-2',
        title: 'Cosmology',
        subtitle: 'The birth, evolution, and fate of the universe',
        description: 'Explore the birth, evolution, and fate of the universe. Learn about the Big Bang, cosmic inflation, dark energy, and multiverse theories in an accessible, visual format.',
        category: 'Science',
        subcategory: 'Astronomy',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-caitlin-kepple',
        instructorName: 'Caitlin Kepple, M.S.',
        status: 'published',
        public: true,
        price: 94.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 74.99,
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&auto=format&fit=crop',
        enrollments: 2156,
        rating: 4.8,
        reviews: 1034,
        createdAt: new Date('2024-01-18').toISOString(),
        updatedAt: new Date('2024-03-16').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand the Big Bang theory and cosmic inflation',
          'Explore dark matter and dark energy',
          'Learn about the cosmic microwave background',
          'Examine multiverse theories and the fate of the universe'
        ],
        requirements: ['High school physics', 'Interest in cosmology'],
        targetAudience: 'Science enthusiasts and aspiring cosmologists',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-sci-astro-3',
        title: 'Space Engineering & Instrumentation',
        subtitle: 'Design satellites and telescopes for space exploration',
        description: 'Understand how satellites and telescopes are designed to operate in space. Learn about optics, electronics, and engineering challenges faced in space environments.',
        category: 'Science',
        subcategory: 'Astronomy',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-caitlin-kepple',
        instructorName: 'Caitlin Kepple, M.S.',
        status: 'published',
        public: true,
        price: 129.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&auto=format&fit=crop',
        enrollments: 745,
        rating: 4.9,
        reviews: 356,
        createdAt: new Date('2024-02-05').toISOString(),
        updatedAt: new Date('2024-03-22').toISOString(),
        sections: [],
        learningObjectives: [
          'Design optical systems for space telescopes',
          'Understand satellite engineering principles',
          'Master thermal and radiation protection',
          'Learn about space electronics and instrumentation'
        ],
        requirements: ['Engineering fundamentals', 'Physics background', 'Optics knowledge helpful'],
        targetAudience: 'Aerospace engineers and space technology enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-sci-astro-4',
        title: 'Space Weather & Solar Physics',
        subtitle: 'Solar activity, space weather forecasting, and radiation shielding',
        description: 'Learn how solar activity affects satellites, astronauts, and electronics. Understand space weather forecasting and shielding technology for deep space exploration.',
        category: 'Science',
        subcategory: 'Astronomy',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-caitlin-kepple',
        instructorName: 'Caitlin Kepple, M.S.',
        status: 'published',
        public: true,
        price: 84.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 64.99,
        image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=800&auto=format&fit=crop',
        enrollments: 923,
        rating: 4.7,
        reviews: 478,
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-03-19').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand solar flares and coronal mass ejections',
          'Learn space weather forecasting techniques',
          'Study radiation effects on electronics and biology',
          'Design shielding for deep space missions'
        ],
        requirements: ['Basic physics', 'Interest in space exploration'],
        targetAudience: 'Space scientists, engineers, and astronomy enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ========================================
      // 💻 COMPUTER SCIENCE CATEGORY
      // ========================================
      
      {
        id: 'course-cs-1',
        title: 'Artificial Intelligence & Machine Learning',
        subtitle: 'Neural networks, search algorithms, and knowledge representation',
        description: 'Understand the fundamentals of AI and how machines learn from data. Explore search algorithms, knowledge representation, neural networks, and how AI mimics human intelligence.',
        category: 'Computer Science',
        subcategory: 'Artificial Intelligence',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-ai-specialist',
        instructorName: 'Dr. Alicia Kim',
        status: 'published',
        public: true,
        price: 159.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 129.99,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
        enrollments: 3421,
        rating: 4.9,
        reviews: 1876,
        createdAt: new Date('2024-01-08').toISOString(),
        updatedAt: new Date('2024-03-12').toISOString(),
        sections: [],
        learningObjectives: [
          'Master AI search algorithms and heuristics',
          'Understand knowledge representation systems',
          'Build and train neural networks',
          'Implement machine learning models from scratch'
        ],
        requirements: ['Strong Python programming', 'Linear algebra and calculus', 'Data structures knowledge'],
        targetAudience: 'Computer science students and AI engineers',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-cs-2',
        title: 'Software Engineering',
        subtitle: 'Master Python programming and build real-world applications',
        description: 'Gain hands-on coding experience in Python. Learn to build software using core programming, data structures, and algorithms that solve real-world problems efficiently.',
        category: 'Computer Science',
        subcategory: 'Software Development',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-software-dev',
        instructorName: 'Marcus Williams',
        status: 'published',
        public: true,
        price: 79.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 59.99,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
        enrollments: 4567,
        rating: 4.8,
        reviews: 2134,
        createdAt: new Date('2024-01-05').toISOString(),
        updatedAt: new Date('2024-03-10').toISOString(),
        sections: [],
        learningObjectives: [
          'Master Python programming fundamentals',
          'Understand data structures and algorithms',
          'Build real-world software applications',
          'Apply software engineering best practices'
        ],
        requirements: ['Basic computer skills', 'No prior programming experience needed'],
        targetAudience: 'Aspiring software developers and programmers',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-cs-3',
        title: 'Scientific Computing',
        subtitle: 'Numerical methods, modeling, and data analysis with Python & MATLAB',
        description: 'Learn how scientists and engineers use Python and MATLAB to model real-world systems, analyze data, and solve equations numerically and graphically.',
        category: 'Computer Science',
        subcategory: 'Scientific Computing',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-scientific-computing',
        instructorName: 'Dr. Rebecca Chen',
        status: 'published',
        public: true,
        price: 109.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 89.99,
        image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&auto=format&fit=crop',
        enrollments: 1456,
        rating: 4.9,
        reviews: 687,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString(),
        sections: [],
        learningObjectives: [
          'Master numerical methods for scientific problems',
          'Use Python and MATLAB for modeling',
          'Analyze and visualize scientific data',
          'Solve differential equations numerically'
        ],
        requirements: ['Python basics', 'Calculus and linear algebra', 'Scientific background helpful'],
        targetAudience: 'Scientists, engineers, and researchers',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ========================================
      // 🧠 TECHNOLOGY CATEGORY
      // ========================================
      
      {
        id: 'course-tech-1',
        title: 'Neurotechnology',
        subtitle: 'Brain-computer interfaces and neural signal processing',
        description: 'Study how brain signals are read, interpreted, and connected to machines. Learn about brain-computer interfaces, neural signal processing, and AI for the mind.',
        category: 'Technology',
        subcategory: 'Neurotechnology',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-neurotech',
        instructorName: 'Dr. Samuel Park',
        status: 'published',
        public: true,
        price: 139.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 109.99,
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&auto=format&fit=crop',
        enrollments: 834,
        rating: 4.9,
        reviews: 412,
        createdAt: new Date('2024-02-08').toISOString(),
        updatedAt: new Date('2024-03-18').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand brain signal acquisition and processing',
          'Learn EEG, fMRI, and neural recording techniques',
          'Design brain-computer interfaces',
          'Apply machine learning to neural data'
        ],
        requirements: ['Neuroscience basics', 'Signal processing knowledge', 'Programming experience'],
        targetAudience: 'Neuroscientists, engineers, and BCI developers',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ========================================
      // ⚙️ ENGINEERING CATEGORY
      // ========================================
      
      // MECHANICAL ENGINEERING SECTION
      {
        id: 'course-eng-mech-1',
        title: 'Mechanical Engineering Fundamentals 1',
        subtitle: 'Statics, dynamics, thermodynamics, and fluid mechanics',
        description: 'Master the physical principles behind mechanical systems—from static forces and dynamic motion to heat transfer, fluid mechanics, and thermodynamics.',
        category: 'Engineering',
        subcategory: 'Mechanical Engineering',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-mech-eng',
        instructorName: 'Prof. David Thompson',
        status: 'published',
        public: true,
        price: 99.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop',
        enrollments: 2345,
        rating: 4.8,
        reviews: 1123,
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-03-14').toISOString(),
        sections: [],
        learningObjectives: [
          'Master statics and force analysis',
          'Understand dynamics and motion',
          'Learn thermodynamics principles',
          'Analyze fluid mechanics problems'
        ],
        requirements: ['Calculus proficiency', 'Physics fundamentals'],
        targetAudience: 'Aspiring mechanical engineers and engineering students',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ELECTRICAL ENGINEERING SECTION
      {
        id: 'course-eng-elec-1',
        title: 'Circuit Analysis 1',
        subtitle: 'Ohm\'s Law, Kirchhoff\'s Laws, and AC circuit analysis',
        description: 'Begin your journey into electrical engineering by analyzing basic circuits using Ohm\'s Law, Kirchhoff\'s Laws, Thevenin/Norton equivalents, and an optional introduction to AC phasor analysis.',
        category: 'Engineering',
        subcategory: 'Electrical Engineering',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-elec-eng',
        instructorName: 'Dr. Jennifer Lee',
        status: 'published',
        public: true,
        price: 89.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
        enrollments: 1987,
        rating: 4.9,
        reviews: 934,
        createdAt: new Date('2024-01-25').toISOString(),
        updatedAt: new Date('2024-03-16').toISOString(),
        sections: [],
        learningObjectives: [
          'Master Ohm\'s Law and Kirchhoff\'s Laws',
          'Analyze DC and AC circuits',
          'Apply Thevenin and Norton theorems',
          'Understand phasor analysis fundamentals'
        ],
        requirements: ['Algebra and trigonometry', 'Basic physics'],
        targetAudience: 'Electrical engineering students and electronics enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // BIOENGINEERING SECTION
      {
        id: 'course-eng-bio-1',
        title: 'Neuroengineering',
        subtitle: 'Neural modeling, signal analysis, and brain-machine interfaces',
        description: 'Blend neuroscience and engineering by modeling neurons electrically, analyzing neural signals, and exploring the basics of brain-machine interfaces.',
        category: 'Engineering',
        subcategory: 'Bioengineering',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-chris-nguyen',
        instructorName: 'Chris Nguyen, M.S.',
        status: 'published',
        public: true,
        price: 129.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop',
        enrollments: 756,
        rating: 4.9,
        reviews: 389,
        createdAt: new Date('2024-02-12').toISOString(),
        updatedAt: new Date('2024-03-20').toISOString(),
        sections: [],
        learningObjectives: [
          'Model neurons using electrical circuit analogs',
          'Analyze neural signals and action potentials',
          'Design basic brain-machine interfaces',
          'Understand neural engineering principles'
        ],
        requirements: ['Electrical circuits knowledge', 'Neuroscience basics', 'Signal processing helpful'],
        targetAudience: 'Biomedical engineers and neuroscience students',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // AEROSPACE ENGINEERING SECTION
      {
        id: 'course-eng-aero-1',
        title: 'Introduction to Aerospace Engineering (Spacecraft)',
        subtitle: 'Avionics, propulsion, rockets, and astrodynamics',
        description: 'Understand spacecraft engineering, including avionics, propulsion, rockets, and astrodynamics; ideal for an introductory course for future spacecraft engineers.',
        category: 'Engineering',
        subcategory: 'Aerospace Engineering',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-aerospace',
        instructorName: 'Dr. Robert Martinez',
        status: 'published',
        public: true,
        price: 119.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 94.99,
        image: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop',
        enrollments: 1234,
        rating: 4.8,
        reviews: 623,
        createdAt: new Date('2024-02-15').toISOString(),
        updatedAt: new Date('2024-03-22').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand spacecraft systems and avionics',
          'Learn rocket propulsion fundamentals',
          'Master orbital mechanics and astrodynamics',
          'Design basic spacecraft missions'
        ],
        requirements: ['Physics and calculus', 'Engineering fundamentals'],
        targetAudience: 'Aerospace engineering students and space enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ========================================
      // 📐 MATHEMATICS CATEGORY
      // ========================================
      
      {
        id: 'course-math-1',
        title: 'Algebra',
        subtitle: 'Equations, variables, and mathematical patterns',
        description: 'Learn the core language of mathematics—solve equations, work with variables, and interpret graphs that describe real-world patterns and relationships.',
        category: 'Mathematics',
        subcategory: 'Algebra',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-erik-medina',
        instructorName: 'Dr. Erik Medina',
        status: 'published',
        public: true,
        price: 0,
        priceType: 'free',
        currency: 'USD',
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=800&auto=format&fit=crop',
        enrollments: 5678,
        rating: 4.7,
        reviews: 2345,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-03-08').toISOString(),
        sections: [],
        learningObjectives: [
          'Master linear and quadratic equations',
          'Understand functions and graphing',
          'Work with polynomials and factoring',
          'Apply algebra to real-world problems'
        ],
        requirements: ['Basic arithmetic'],
        targetAudience: 'High school and college students',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-math-2',
        title: 'Geometry',
        subtitle: 'Shapes, space, and spatial reasoning',
        description: 'Understand the properties of shapes, space, and measurement. Study angles, areas, volumes, and coordinate systems that form the backbone of spatial reasoning.',
        category: 'Mathematics',
        subcategory: 'Geometry',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-geometry',
        instructorName: 'Prof. Lisa Anderson',
        status: 'published',
        public: true,
        price: 0,
        priceType: 'free',
        currency: 'USD',
        discountPrice: null,
        image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&auto=format&fit=crop',
        enrollments: 4234,
        rating: 4.6,
        reviews: 1876,
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-03-09').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand geometric shapes and properties',
          'Calculate areas, perimeters, and volumes',
          'Master the Pythagorean theorem',
          'Work with coordinate geometry'
        ],
        requirements: ['Basic algebra'],
        targetAudience: 'Students learning foundational mathematics',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-math-3',
        title: 'Trigonometry',
        subtitle: 'Angles, triangles, and wave functions',
        description: 'Explore the relationships between angles and distances using sine, cosine, and tangent. Learn how triangles describe rotation, waves, and real-world designs.',
        category: 'Mathematics',
        subcategory: 'Trigonometry',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-trig',
        instructorName: 'Dr. Michael Roberts',
        status: 'published',
        public: true,
        price: 49.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&auto=format&fit=crop',
        enrollments: 2987,
        rating: 4.8,
        reviews: 1234,
        createdAt: new Date('2024-01-10').toISOString(),
        updatedAt: new Date('2024-03-12').toISOString(),
        sections: [],
        learningObjectives: [
          'Master sine, cosine, and tangent functions',
          'Solve right and oblique triangles',
          'Understand unit circle and radians',
          'Apply trigonometry to waves and oscillations'
        ],
        requirements: ['Algebra and geometry'],
        targetAudience: 'Students preparing for calculus and physics',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-math-4',
        title: 'Calculus',
        subtitle: 'Limits, derivatives, and integrals',
        description: 'Understand how things change over time. Learn the basics of limits, derivatives, and integrals in an intuitive, real-world-focused way.',
        category: 'Mathematics',
        subcategory: 'Calculus',
        level: 'Advanced',
        language: 'English',
        instructorId: 'instructor-erik-medina',
        instructorName: 'Dr. Erik Medina',
        status: 'published',
        public: true,
        price: 89.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
        enrollments: 3456,
        rating: 4.9,
        reviews: 1678,
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-03-18').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand limits and continuity',
          'Master differentiation techniques',
          'Learn integration and area under curves',
          'Apply calculus to physics and engineering'
        ],
        requirements: ['Algebra and trigonometry', 'Strong math foundation'],
        targetAudience: 'STEM students and professionals',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // ========================================
      // 📜 PHILOSOPHY & OCCULT SCIENCES CATEGORY
      // ========================================
      
      // PHILOSOPHY SECTION
      {
        id: 'course-phil-1',
        title: 'Philosophy of Science',
        subtitle: 'Truth, bias, logic, and the nature of scientific knowledge',
        description: 'Explore what science is, how we define truth, and how bias, logic, and culture shape scientific knowledge. Learn the philosophical backbone of discovery.',
        category: 'Philosophy & Occult Sciences',
        subcategory: 'Philosophy',
        level: 'Intermediate',
        language: 'English',
        instructorId: 'instructor-philosophy',
        instructorName: 'Dr. Rachel Green',
        status: 'published',
        public: true,
        price: 69.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 54.99,
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
        enrollments: 1456,
        rating: 4.8,
        reviews: 723,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-03-15').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand epistemology and scientific method',
          'Examine bias and objectivity in science',
          'Explore paradigm shifts and scientific revolutions',
          'Analyze the relationship between science and society'
        ],
        requirements: ['Interest in philosophy', 'Critical thinking skills'],
        targetAudience: 'Scientists, philosophers, and critical thinkers',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      // OCCULT SCIENCES SECTION
      {
        id: 'course-occult-1',
        title: 'Fundamentals of Astrology',
        subtitle: 'Zodiac signs, planets, houses, and birth chart interpretation',
        description: 'Study the symbolic system of astrology through the zodiac signs, planets, houses, and birth charts. Learn how to interpret charts through logic and tradition.',
        category: 'Philosophy & Occult Sciences',
        subcategory: 'Occult Sciences',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-jayden-brown',
        instructorName: 'Jayden Alexander Brown',
        status: 'published',
        public: true,
        price: 59.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 44.99,
        image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&auto=format&fit=crop',
        enrollments: 2134,
        rating: 4.7,
        reviews: 987,
        createdAt: new Date('2024-02-05').toISOString(),
        updatedAt: new Date('2024-03-17').toISOString(),
        sections: [],
        learningObjectives: [
          'Understand the 12 zodiac signs and their meanings',
          'Learn planetary influences and aspects',
          'Master the 12 houses of astrology',
          'Interpret birth charts accurately'
        ],
        requirements: ['Open mind', 'Interest in symbolic systems'],
        targetAudience: 'Astrology enthusiasts and spiritual seekers',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      },
      
      {
        id: 'course-occult-2',
        title: 'Numerology',
        subtitle: 'Life Path, Destiny, and Personal Year Numbers',
        description: 'Decode the spiritual and psychological meanings of numbers using your name and birthdate. Learn Life Path, Destiny, and Personal Year Numbers.',
        category: 'Philosophy & Occult Sciences',
        subcategory: 'Occult Sciences',
        level: 'Beginner',
        language: 'English',
        instructorId: 'instructor-jayden-brown',
        instructorName: 'Jayden Alexander Brown',
        status: 'published',
        public: true,
        price: 49.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&auto=format&fit=crop',
        enrollments: 1678,
        rating: 4.6,
        reviews: 834,
        createdAt: new Date('2024-02-10').toISOString(),
        updatedAt: new Date('2024-03-19').toISOString(),
        sections: [],
        learningObjectives: [
          'Calculate Life Path numbers',
          'Understand Destiny and Soul Urge numbers',
          'Learn Personal Year cycles',
          'Apply numerology to self-understanding'
        ],
        requirements: ['Basic arithmetic', 'Openness to symbolic interpretation'],
        targetAudience: 'Spiritual seekers and numerology enthusiasts',
        allowReviews: true,
        enableCertificate: true,
        enableDiscussions: true,
        maxStudents: null
      }
    ];
    localStorage.setItem('cerebrolearn_courses', JSON.stringify(defaultCourses));
  }

  if (!localStorage.getItem('cerebrolearn_enrollments')) {
    localStorage.setItem('cerebrolearn_enrollments', JSON.stringify([]));
  }

  if (!localStorage.getItem('cerebrolearn_drafts')) {
    localStorage.setItem('cerebrolearn_drafts', JSON.stringify([]));
  }
  
  // Initialize mock users
  if (!localStorage.getItem('cerebrolearn_users')) {
    const mockUsers = [
      { id: 'user-1', name: 'Alice Johnson', email: 'alice@example.com', avatar: null },
      { id: 'user-2', name: 'Bob Smith', email: 'bob@example.com', avatar: null },
      { id: 'user-3', name: 'Carol Williams', email: 'carol@example.com', avatar: null },
      { id: 'user-4', name: 'David Brown', email: 'david@example.com', avatar: null },
      { id: 'user-5', name: 'Emma Davis', email: 'emma@example.com', avatar: null },
      { id: 'user-6', name: 'Frank Miller', email: 'frank@example.com', avatar: null },
      { id: 'user-7', name: 'Grace Wilson', email: 'grace@example.com', avatar: null },
      { id: 'user-8', name: 'Henry Taylor', email: 'henry@example.com', avatar: null },
      { id: 'user-9', name: 'Isabella Martinez', email: 'isabella@example.com', avatar: null },
      { id: 'user-10', name: 'Jack Anderson', email: 'jack@example.com', avatar: null },
      { id: 'user-11', name: 'Katie Thompson', email: 'katie@example.com', avatar: null },
      { id: 'user-12', name: 'Liam Garcia', email: 'liam@example.com', avatar: null },
      { id: 'user-13', name: 'Mia Rodriguez', email: 'mia@example.com', avatar: null },
      { id: 'user-14', name: 'Noah Lee', email: 'noah@example.com', avatar: null },
      { id: 'user-15', name: 'Olivia White', email: 'olivia@example.com', avatar: null },
      { id: 'user-16', name: 'Peter Harris', email: 'peter@example.com', avatar: null },
      { id: 'user-17', name: 'Quinn Clark', email: 'quinn@example.com', avatar: null },
      { id: 'user-18', name: 'Rachel Lewis', email: 'rachel@example.com', avatar: null },
      { id: 'user-19', name: 'Samuel Walker', email: 'samuel@example.com', avatar: null },
      { id: 'user-20', name: 'Tina Hall', email: 'tina@example.com', avatar: null },
      { id: 'user-21', name: 'Uma Allen', email: 'uma@example.com', avatar: null },
      { id: 'user-22', name: 'Victor Young', email: 'victor@example.com', avatar: null },
      { id: 'user-23', name: 'Wendy King', email: 'wendy@example.com', avatar: null },
      { id: 'user-24', name: 'Xavier Scott', email: 'xavier@example.com', avatar: null },
      { id: 'user-25', name: 'Yara Green', email: 'yara@example.com', avatar: null },
    ];
    localStorage.setItem('cerebrolearn_users', JSON.stringify(mockUsers));
  }
  
  // Initialize some mock enrollments if none exist (for demo purposes)
  if (!localStorage.getItem('cerebrolearn_enrollments') || JSON.parse(localStorage.getItem('cerebrolearn_enrollments') || '[]').length === 0) {
    const mockEnrollments: Enrollment[] = [
      // Fundamental Physics course - 15 learners
      { id: 'enrollment-1', user_id: 'user-1', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-15T10:00:00Z', progress: 75, completed: false },
      { id: 'enrollment-2', user_id: 'user-2', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-20T14:30:00Z', progress: 45, completed: false },
      { id: 'enrollment-3', user_id: 'user-3', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-10T09:00:00Z', progress: 90, completed: false },
      { id: 'enrollment-4', user_id: 'user-4', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-01T16:45:00Z', progress: 20, completed: false },
      { id: 'enrollment-5', user_id: 'user-5', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-05T11:20:00Z', progress: 60, completed: false },
      { id: 'enrollment-6', user_id: 'user-6', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-08T13:15:00Z', progress: 30, completed: false },
      { id: 'enrollment-7', user_id: 'user-7', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-25T08:30:00Z', progress: 85, completed: false },
      { id: 'enrollment-8', user_id: 'user-8', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-10T15:00:00Z', progress: 55, completed: false },
      { id: 'enrollment-9', user_id: 'user-9', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-30T12:45:00Z', progress: 70, completed: false },
      { id: 'enrollment-10', user_id: 'user-10', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-12T10:30:00Z', progress: 40, completed: false },
      { id: 'enrollment-11', user_id: 'user-11', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-18T09:15:00Z', progress: 95, completed: true },
      { id: 'enrollment-12', user_id: 'user-12', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-15T14:20:00Z', progress: 25, completed: false },
      { id: 'enrollment-13', user_id: 'user-13', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-03T11:45:00Z', progress: 80, completed: false },
      { id: 'enrollment-14', user_id: 'user-14', course_id: 'course-sci-phys-1', enrolled_at: '2024-01-22T16:00:00Z', progress: 65, completed: false },
      { id: 'enrollment-15', user_id: 'user-15', course_id: 'course-sci-phys-1', enrolled_at: '2024-02-18T13:30:00Z', progress: 15, completed: false },
      
      // AI & Machine Learning course - 12 learners
      { id: 'enrollment-16', user_id: 'user-1', course_id: 'course-cs-1', enrolled_at: '2024-01-12T08:00:00Z', progress: 40, completed: false },
      { id: 'enrollment-17', user_id: 'user-5', course_id: 'course-cs-1', enrolled_at: '2024-01-28T10:30:00Z', progress: 65, completed: false },
      { id: 'enrollment-18', user_id: 'user-8', course_id: 'course-cs-1', enrolled_at: '2024-02-05T14:00:00Z', progress: 50, completed: false },
      { id: 'enrollment-19', user_id: 'user-10', course_id: 'course-cs-1', enrolled_at: '2024-01-15T09:30:00Z', progress: 88, completed: false },
      { id: 'enrollment-20', user_id: 'user-12', course_id: 'course-cs-1', enrolled_at: '2024-02-10T11:00:00Z', progress: 45, completed: false },
      { id: 'enrollment-21', user_id: 'user-14', course_id: 'course-cs-1', enrolled_at: '2024-01-20T15:45:00Z', progress: 72, completed: false },
      { id: 'enrollment-22', user_id: 'user-16', course_id: 'course-cs-1', enrolled_at: '2024-02-08T12:30:00Z', progress: 30, completed: false },
      { id: 'enrollment-23', user_id: 'user-18', course_id: 'course-cs-1', enrolled_at: '2024-01-25T10:15:00Z', progress: 92, completed: true },
      { id: 'enrollment-24', user_id: 'user-20', course_id: 'course-cs-1', enrolled_at: '2024-02-12T14:00:00Z', progress: 38, completed: false },
      { id: 'enrollment-25', user_id: 'user-21', course_id: 'course-cs-1', enrolled_at: '2024-01-18T11:30:00Z', progress: 78, completed: false },
      { id: 'enrollment-26', user_id: 'user-23', course_id: 'course-cs-1', enrolled_at: '2024-02-15T09:00:00Z', progress: 25, completed: false },
      { id: 'enrollment-27', user_id: 'user-25', course_id: 'course-cs-1', enrolled_at: '2024-02-01T16:20:00Z', progress: 55, completed: false },
      
      // Software Engineering course - 10 learners
      { id: 'enrollment-28', user_id: 'user-2', course_id: 'course-cs-2', enrolled_at: '2024-01-18T12:00:00Z', progress: 85, completed: false },
      { id: 'enrollment-29', user_id: 'user-4', course_id: 'course-cs-2', enrolled_at: '2024-02-02T10:45:00Z', progress: 42, completed: false },
      { id: 'enrollment-30', user_id: 'user-7', course_id: 'course-cs-2', enrolled_at: '2024-01-22T14:30:00Z', progress: 68, completed: false },
      { id: 'enrollment-31', user_id: 'user-9', course_id: 'course-cs-2', enrolled_at: '2024-02-06T09:15:00Z', progress: 55, completed: false },
      { id: 'enrollment-32', user_id: 'user-11', course_id: 'course-cs-2', enrolled_at: '2024-01-30T11:00:00Z', progress: 90, completed: false },
      { id: 'enrollment-33', user_id: 'user-15', course_id: 'course-cs-2', enrolled_at: '2024-02-14T15:30:00Z', progress: 20, completed: false },
      { id: 'enrollment-34', user_id: 'user-17', course_id: 'course-cs-2', enrolled_at: '2024-01-26T13:45:00Z', progress: 75, completed: false },
      { id: 'enrollment-35', user_id: 'user-19', course_id: 'course-cs-2', enrolled_at: '2024-02-09T10:30:00Z', progress: 48, completed: false },
      { id: 'enrollment-36', user_id: 'user-22', course_id: 'course-cs-2', enrolled_at: '2024-01-14T16:00:00Z', progress: 95, completed: true },
      { id: 'enrollment-37', user_id: 'user-24', course_id: 'course-cs-2', enrolled_at: '2024-02-17T12:15:00Z', progress: 35, completed: false },
      
      // Quantum Computing course - 8 learners
      { id: 'enrollment-38', user_id: 'user-3', course_id: 'course-sci-phys-3', enrolled_at: '2024-02-01T09:00:00Z', progress: 60, completed: false },
      { id: 'enrollment-39', user_id: 'user-6', course_id: 'course-sci-phys-3', enrolled_at: '2024-02-08T11:30:00Z', progress: 45, completed: false },
      { id: 'enrollment-40', user_id: 'user-10', course_id: 'course-sci-phys-3', enrolled_at: '2024-01-28T14:00:00Z', progress: 72, completed: false },
      { id: 'enrollment-41', user_id: 'user-13', course_id: 'course-sci-phys-3', enrolled_at: '2024-02-12T10:15:00Z', progress: 38, completed: false },
      { id: 'enrollment-42', user_id: 'user-16', course_id: 'course-sci-phys-3', enrolled_at: '2024-01-24T15:45:00Z', progress: 85, completed: false },
      { id: 'enrollment-43', user_id: 'user-18', course_id: 'course-sci-phys-3', enrolled_at: '2024-02-16T12:30:00Z', progress: 28, completed: false },
      { id: 'enrollment-44', user_id: 'user-21', course_id: 'course-sci-phys-3', enrolled_at: '2024-02-04T09:45:00Z', progress: 65, completed: false },
      { id: 'enrollment-45', user_id: 'user-25', course_id: 'course-sci-phys-3', enrolled_at: '2024-01-19T13:00:00Z', progress: 90, completed: false },
      
      // Astrophysics course - 9 learners
      { id: 'enrollment-46', user_id: 'user-2', course_id: 'course-sci-astro-1', enrolled_at: '2024-01-16T10:30:00Z', progress: 52, completed: false },
      { id: 'enrollment-47', user_id: 'user-5', course_id: 'course-sci-astro-1', enrolled_at: '2024-02-03T14:15:00Z', progress: 70, completed: false },
      { id: 'enrollment-48', user_id: 'user-8', course_id: 'course-sci-astro-1', enrolled_at: '2024-01-21T11:00:00Z', progress: 44, completed: false },
      { id: 'enrollment-49', user_id: 'user-11', course_id: 'course-sci-astro-1', enrolled_at: '2024-02-11T15:30:00Z', progress: 82, completed: false },
      { id: 'enrollment-50', user_id: 'user-14', course_id: 'course-sci-astro-1', enrolled_at: '2024-01-27T09:45:00Z', progress: 36, completed: false },
      { id: 'enrollment-51', user_id: 'user-17', course_id: 'course-sci-astro-1', enrolled_at: '2024-02-07T13:20:00Z', progress: 88, completed: false },
      { id: 'enrollment-52', user_id: 'user-20', course_id: 'course-sci-astro-1', enrolled_at: '2024-01-13T16:10:00Z', progress: 62, completed: false },
      { id: 'enrollment-53', user_id: 'user-23', course_id: 'course-sci-astro-1', enrolled_at: '2024-02-19T10:00:00Z', progress: 18, completed: false },
      { id: 'enrollment-54', user_id: 'user-24', course_id: 'course-sci-astro-1', enrolled_at: '2024-01-09T12:45:00Z', progress: 95, completed: true },
      
      // Calculus course - 11 learners
      { id: 'enrollment-55', user_id: 'user-1', course_id: 'course-math-4', enrolled_at: '2024-01-11T08:30:00Z', progress: 78, completed: false },
      { id: 'enrollment-56', user_id: 'user-4', course_id: 'course-math-4', enrolled_at: '2024-01-23T10:00:00Z', progress: 56, completed: false },
      { id: 'enrollment-57', user_id: 'user-7', course_id: 'course-math-4', enrolled_at: '2024-02-05T13:15:00Z', progress: 42, completed: false },
      { id: 'enrollment-58', user_id: 'user-9', course_id: 'course-math-4', enrolled_at: '2024-01-29T15:45:00Z', progress: 84, completed: false },
      { id: 'enrollment-59', user_id: 'user-12', course_id: 'course-math-4', enrolled_at: '2024-02-13T11:30:00Z', progress: 38, completed: false },
      { id: 'enrollment-60', user_id: 'user-15', course_id: 'course-math-4', enrolled_at: '2024-01-17T14:00:00Z', progress: 92, completed: true },
      { id: 'enrollment-61', user_id: 'user-16', course_id: 'course-math-4', enrolled_at: '2024-02-09T09:30:00Z', progress: 65, completed: false },
      { id: 'enrollment-62', user_id: 'user-19', course_id: 'course-math-4', enrolled_at: '2024-01-25T12:15:00Z', progress: 50, completed: false },
      { id: 'enrollment-63', user_id: 'user-21', course_id: 'course-math-4', enrolled_at: '2024-02-16T16:00:00Z', progress: 26, completed: false },
      { id: 'enrollment-64', user_id: 'user-22', course_id: 'course-math-4', enrolled_at: '2024-01-08T10:45:00Z', progress: 88, completed: false },
      { id: 'enrollment-65', user_id: 'user-25', course_id: 'course-math-4', enrolled_at: '2024-02-20T13:30:00Z', progress: 32, completed: false },
    ];
    localStorage.setItem('cerebrolearn_enrollments', JSON.stringify(mockEnrollments));
  }
}

// ========================================
// HELPER FUNCTIONS FOR DATA MANAGEMENT
// ========================================

// Get all published courses
export function getCourses(): Course[] {
  const coursesJson = localStorage.getItem('cerebrolearn_courses');
  if (!coursesJson) return [];
  try {
    const courses = JSON.parse(coursesJson);
    return courses.filter((c: Course) => c.status === 'published');
  } catch (error) {
    console.error('Error parsing courses:', error);
    return [];
  }
}

// Get a specific course by ID
export function getCourse(courseId: string): Course | null {
  const coursesJson = localStorage.getItem('cerebrolearn_courses');
  if (!coursesJson) return null;
  try {
    const courses = JSON.parse(coursesJson);
    return courses.find((c: Course) => c.id === courseId) || null;
  } catch (error) {
    console.error('Error parsing courses:', error);
    return null;
  }
}

// Get all courses for a creator (including drafts)
export function getCreatorCourses(userId: string): Course[] {
  const coursesJson = localStorage.getItem('cerebrolearn_courses');
  const draftsJson = localStorage.getItem('cerebrolearn_drafts');
  
  let courses: Course[] = [];
  
  try {
    if (coursesJson) {
      const publishedCourses = JSON.parse(coursesJson);
      courses = [...publishedCourses];
    }
    if (draftsJson) {
      const draftCourses = JSON.parse(draftsJson);
      courses = [...courses, ...draftCourses];
    }
    
    // For demo purposes, return all courses
    // In production, filter by instructorId === userId
    return courses;
  } catch (error) {
    console.error('Error parsing courses:', error);
    return [];
  }
}

// Add a new course
export function addCourse(courseData: Partial<Course>): Course {
  const newCourse: Course = {
    id: `course-${Date.now()}`,
    title: courseData.title || 'Untitled Course',
    description: courseData.description || '',
    category: courseData.category || 'Other',
    subcategory: courseData.subcategory,
    level: courseData.level || 'Beginner',
    language: courseData.language || 'English',
    instructorId: courseData.instructorId || 'demo-instructor',
    instructorName: courseData.instructorName || 'Demo Instructor',
    status: courseData.status || 'draft',
    public: courseData.public !== undefined ? courseData.public : true,
    price: courseData.price || 0,
    priceType: courseData.priceType || 'free',
    currency: courseData.currency || 'USD',
    discountPrice: courseData.discountPrice || null,
    image: courseData.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    enrollments: 0,
    rating: 0,
    reviews: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: courseData.sections || [],
    learningObjectives: courseData.learningObjectives || [],
    requirements: courseData.requirements || [],
    targetAudience: courseData.targetAudience,
    allowReviews: courseData.allowReviews !== undefined ? courseData.allowReviews : true,
    enableCertificate: courseData.enableCertificate !== undefined ? courseData.enableCertificate : true,
    enableDiscussions: courseData.enableDiscussions !== undefined ? courseData.enableDiscussions : true,
    maxStudents: courseData.maxStudents || null
  };

  // Add to appropriate storage based on status
  if (newCourse.status === 'draft') {
    const draftsJson = localStorage.getItem('cerebrolearn_drafts') || '[]';
    const drafts = JSON.parse(draftsJson);
    drafts.push(newCourse);
    localStorage.setItem('cerebrolearn_drafts', JSON.stringify(drafts));
  } else {
    const coursesJson = localStorage.getItem('cerebrolearn_courses') || '[]';
    const courses = JSON.parse(coursesJson);
    courses.push(newCourse);
    localStorage.setItem('cerebrolearn_courses', JSON.stringify(courses));
  }

  return newCourse;
}

// Update an existing course
export function updateCourse(courseId: string, updates: Partial<Course>): Course | null {
  // Try published courses first
  const coursesJson = localStorage.getItem('cerebrolearn_courses');
  if (coursesJson) {
    try {
      const courses = JSON.parse(coursesJson);
      const index = courses.findIndex((c: Course) => c.id === courseId);
      if (index !== -1) {
        courses[index] = { ...courses[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem('cerebrolearn_courses', JSON.stringify(courses));
        return courses[index];
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }

  // Try drafts
  const draftsJson = localStorage.getItem('cerebrolearn_drafts');
  if (draftsJson) {
    try {
      const drafts = JSON.parse(draftsJson);
      const index = drafts.findIndex((c: Course) => c.id === courseId);
      if (index !== -1) {
        drafts[index] = { ...drafts[index], ...updates, updatedAt: new Date().toISOString() };
        
        // If status changed to published, move to courses
        if (updates.status === 'published') {
          const course = drafts.splice(index, 1)[0];
          localStorage.setItem('cerebrolearn_drafts', JSON.stringify(drafts));
          
          const coursesJson = localStorage.getItem('cerebrolearn_courses') || '[]';
          const courses = JSON.parse(coursesJson);
          courses.push(course);
          localStorage.setItem('cerebrolearn_courses', JSON.stringify(courses));
          return course;
        }
        
        localStorage.setItem('cerebrolearn_drafts', JSON.stringify(drafts));
        return drafts[index];
      }
    } catch (error) {
      console.error('Error updating draft course:', error);
    }
  }

  return null;
}

// Delete a course
export function deleteCourse(courseId: string): boolean {
  // Try published courses
  const coursesJson = localStorage.getItem('cerebrolearn_courses');
  if (coursesJson) {
    try {
      const courses = JSON.parse(coursesJson);
      const filteredCourses = courses.filter((c: Course) => c.id !== courseId);
      if (filteredCourses.length < courses.length) {
        localStorage.setItem('cerebrolearn_courses', JSON.stringify(filteredCourses));
        return true;
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }

  // Try drafts
  const draftsJson = localStorage.getItem('cerebrolearn_drafts');
  if (draftsJson) {
    try {
      const drafts = JSON.parse(draftsJson);
      const filteredDrafts = drafts.filter((c: Course) => c.id !== courseId);
      if (filteredDrafts.length < drafts.length) {
        localStorage.setItem('cerebrolearn_drafts', JSON.stringify(filteredDrafts));
        return true;
      }
    } catch (error) {
      console.error('Error deleting draft course:', error);
    }
  }

  return false;
}

// Get user enrollments
export function getEnrollments(userId: string): Enrollment[] {
  const enrollmentsJson = localStorage.getItem('cerebrolearn_enrollments');
  if (!enrollmentsJson) return [];
  try {
    const enrollments = JSON.parse(enrollmentsJson);
    return enrollments.filter((e: Enrollment) => e.user_id === userId);
  } catch (error) {
    console.error('Error parsing enrollments:', error);
    return [];
  }
}

// Enroll user in a course
export function enrollInCourse(userId: string, courseId: string): Enrollment {
  const enrollmentsJson = localStorage.getItem('cerebrolearn_enrollments') || '[]';
  const enrollments = JSON.parse(enrollmentsJson);

  // Check if already enrolled
  const existing = enrollments.find(
    (e: Enrollment) => e.user_id === userId && e.course_id === courseId
  );
  if (existing) {
    return existing;
  }

  // Create new enrollment
  const newEnrollment: Enrollment = {
    id: `enrollment-${Date.now()}`,
    user_id: userId,
    course_id: courseId,
    enrolled_at: new Date().toISOString(),
    progress: 0,
    completed: false
  };

  enrollments.push(newEnrollment);
  localStorage.setItem('cerebrolearn_enrollments', JSON.stringify(enrollments));

  return newEnrollment;
}

// Get all enrollments for a specific course
export function getEnrollmentsByCourseId(courseId: string): any[] {
  const enrollmentsJson = localStorage.getItem('cerebrolearn_enrollments') || '[]';
  const usersJson = localStorage.getItem('cerebrolearn_users') || '[]';
  
  try {
    const enrollments = JSON.parse(enrollmentsJson);
    const users = JSON.parse(usersJson);
    
    // Filter enrollments for this course and enrich with user data
    return enrollments
      .filter((e: Enrollment) => e.course_id === courseId)
      .map((enrollment: Enrollment) => {
        const user = users.find((u: any) => u.id === enrollment.user_id);
        return {
          ...enrollment,
          user_name: user?.name || 'Unknown User',
          user_email: user?.email || 'unknown@example.com',
          user_avatar: user?.avatar || null
        };
      });
  } catch (error) {
    console.error('Error getting course enrollments:', error);
    return [];
  }
}

// Unenroll a learner from a course
export function unenrollLearner(enrollmentId: string): boolean {
  const enrollmentsJson = localStorage.getItem('cerebrolearn_enrollments') || '[]';
  
  try {
    const enrollments = JSON.parse(enrollmentsJson);
    const filteredEnrollments = enrollments.filter((e: any) => e.id !== enrollmentId);
    
    if (filteredEnrollments.length === enrollments.length) {
      // Enrollment not found
      return false;
    }
    
    localStorage.setItem('cerebrolearn_enrollments', JSON.stringify(filteredEnrollments));
    return true;
  } catch (error) {
    console.error('Error unenrolling learner:', error);
    return false;
  }
}