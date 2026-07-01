// Comprehensive dummy data system for CerebroLearn - Science & Engineering Focus
// This replaces all API calls with localStorage-based mock data

// Enhanced module structure with learning outcomes
export interface Module {
  id: string;
  title: string;
  description?: string;
  outcome?: string; // What learners will achieve by completing this module
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'code' | 'assignment' | 'interactive' | 'discussion';
  duration?: string;
  content?: string;
  order: number;
}

export interface Assessment {
  type: 'quiz' | 'challenge' | 'project' | 'discussion';
  title: string;
  description: string;
}

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
  sections?: any[]; // Legacy support - kept for backward compatibility
  modules?: Module[]; // New enhanced module structure
  courseGoals?: string[]; // High-level learner outcomes for the entire course
  learningObjectives?: string[];
  prerequisites?: string[]; // Detailed prerequisites (replaces "requirements" conceptually)
  requirements?: string[]; // Kept for backward compatibility
  targetAudience?: string;
  assessments?: Assessment[]; // Course-level assessments
  tags?: string[]; // Additional tags like "Emerging Technology"
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
        subtitle: 'From quantum principles to real-world quantum programming',
        description: 'Master quantum computing from fundamental principles to practical implementation. Understand how quantum computers fundamentally differ from classical computers, grasp core quantum principles, learn quantum algorithms, write quantum circuits, and explore real-world applications while maintaining realistic expectations about current limitations.',
        category: 'Science',
        subcategory: 'Physics',
        level: 'Intermediate to Advanced',
        language: 'English',
        instructorId: 'instructor-dominique-davenport',
        instructorName: 'Dr. Dominique Davenport',
        status: 'published',
        public: true,
        price: 179.99,
        priceType: 'paid',
        currency: 'USD',
        discountPrice: 149.99,
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
        enrollments: 987,
        rating: 4.8,
        reviews: 423,
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date('2024-03-20').toISOString(),
        sections: [],
        tags: ['Advanced', 'Emerging Technology', 'Quantum Mechanics', 'Programming'],
        prerequisites: [
          'Basic algebra and linear algebra concepts',
          'Understanding of classical computing fundamentals',
          'Programming experience (any language) recommended',
          'Familiarity with complex numbers helpful but not required'
        ],
        courseGoals: [
          'Understand how quantum computers fundamentally differ from classical computers',
          'Grasp core quantum principles that enable quantum advantage',
          'Learn how quantum algorithms work conceptually',
          'Be able to write and simulate simple quantum circuits',
          'Understand real-world applications and current limitations'
        ],
        learningObjectives: [
          'Explain the limitations of classical computing and why quantum computing exists',
          'Describe quantum superposition, measurement, entanglement, and quantum states',
          'Design and implement quantum circuits using single and multi-qubit gates',
          'Understand key quantum algorithms including Deutsch-Jozsa, Grover\'s, and Shor\'s',
          'Write quantum programs using Qiskit or equivalent SDK',
          'Evaluate realistic quantum computing applications and limitations'
        ],
        requirements: ['Linear algebra proficiency', 'Quantum mechanics basics', 'Programming experience helpful'],
        targetAudience: 'Computer scientists, physicists, software engineers, and technology enthusiasts interested in quantum computing',
        modules: [
          {
            id: 'qc-module-1',
            title: 'Why Quantum Computing Exists',
            description: 'Build motivation before diving into the mathematics. Understand the fundamental reasons why quantum computing is being developed.',
            outcome: 'Learners understand why quantum computing matters and the problems it can solve',
            order: 1,
            lessons: [
              {
                id: 'qc-m1-l1',
                title: 'Limits of Classical Computing',
                type: 'video',
                duration: '18 min',
                content: 'Explore Moore\'s Law and its slowdown, understand exponential scaling problems',
                order: 1
              },
              {
                id: 'qc-m1-l2',
                title: 'What Makes Quantum Computing Different',
                type: 'interactive',
                duration: '25 min',
                content: 'Interactive comparison: Bits vs Qubits, Deterministic vs Probabilistic computation',
                order: 2
              },
              {
                id: 'qc-m1-l3',
                title: 'Real Problems That Need Quantum Solutions',
                type: 'text',
                duration: '15 min',
                content: 'Case studies of cryptography, optimization, and simulation problems',
                order: 3
              },
              {
                id: 'qc-m1-quiz',
                title: 'Module 1 Assessment',
                type: 'quiz',
                duration: '10 min',
                content: 'Concept quiz on classical vs quantum computing fundamentals',
                order: 4
              }
            ]
          },
          {
            id: 'qc-module-2',
            title: 'Foundations of Quantum Mechanics',
            description: 'Learn only what\'s needed - no physics overload. Build intuition before diving into mathematics.',
            outcome: 'Learners can describe how a qubit behaves and understand basic quantum states',
            order: 2,
            lessons: [
              {
                id: 'qc-m2-l1',
                title: 'Superposition: Being in Multiple States',
                type: 'video',
                duration: '22 min',
                content: 'Visual explanation of superposition with real-world analogies',
                order: 1
              },
              {
                id: 'qc-m2-l2',
                title: 'Measurement and Probability',
                type: 'interactive',
                duration: '20 min',
                content: 'Interactive simulation showing quantum measurement and wavefunction collapse',
                order: 2
              },
              {
                id: 'qc-m2-l3',
                title: 'Quantum States: Intuition First',
                type: 'video',
                duration: '18 min',
                content: 'Build intuition about |0⟩, |1⟩, and superposition states',
                order: 3
              },
              {
                id: 'qc-m2-l4',
                title: 'The Bloch Sphere',
                type: 'interactive',
                duration: '25 min',
                content: '3D interactive visualization of the Bloch sphere',
                order: 4
              },
              {
                id: 'qc-m2-quiz',
                title: 'Quantum States Quiz',
                type: 'quiz',
                duration: '12 min',
                content: 'Visual and scenario-based quiz on quantum mechanics basics',
                order: 5
              }
            ]
          },
          {
            id: 'qc-module-3',
            title: 'Entanglement & Quantum Power',
            description: 'Understand where the quantum "magic" starts making sense and how it enables computational advantages.',
            outcome: 'Learners understand non-classical correlations and entanglement',
            order: 3,
            lessons: [
              {
                id: 'qc-m3-l1',
                title: 'What Entanglement Is (and Is Not)',
                type: 'video',
                duration: '20 min',
                content: 'Demystifying quantum entanglement without sci-fi myths',
                order: 1
              },
              {
                id: 'qc-m3-l2',
                title: 'Bell States',
                type: 'interactive',
                duration: '22 min',
                content: 'Conceptual understanding of Bell states and EPR pairs',
                order: 2
              },
              {
                id: 'qc-m3-l3',
                title: 'Why Entanglement Enables Speedups',
                type: 'video',
                duration: '18 min',
                content: 'How entanglement creates quantum computational advantage',
                order: 3
              },
              {
                id: 'qc-m3-challenge',
                title: 'Entanglement Challenge',
                type: 'quiz',
                duration: '15 min',
                content: 'Scenario-based problems testing entanglement understanding',
                order: 4
              }
            ]
          },
          {
            id: 'qc-module-4',
            title: 'Quantum Gates & Circuits',
            description: 'Transform quantum ideas into structured circuits. Learn the building blocks of quantum computation.',
            outcome: 'Learners can read and design basic quantum circuits',
            order: 4,
            lessons: [
              {
                id: 'qc-m4-l1',
                title: 'Single-Qubit Gates',
                type: 'video',
                duration: '25 min',
                content: 'X, Y, Z, H gates - what they do and why they matter',
                order: 1
              },
              {
                id: 'qc-m4-l2',
                title: 'Gate Visualization and Matrix Representation',
                type: 'interactive',
                duration: '20 min',
                content: 'Interactive gate simulator with Bloch sphere visualization',
                order: 2
              },
              {
                id: 'qc-m4-l3',
                title: 'Multi-Qubit Gates',
                type: 'video',
                duration: '22 min',
                content: 'CNOT, Controlled operations, and quantum logic',
                order: 3
              },
              {
                id: 'qc-m4-l4',
                title: 'Building Quantum Circuits',
                type: 'interactive',
                duration: '30 min',
                content: 'Hands-on circuit builder tool - create your first circuits',
                order: 4
              },
              {
                id: 'qc-m4-l5',
                title: 'Measurement & Readout',
                type: 'video',
                duration: '16 min',
                content: 'How measurement works in quantum circuits',
                order: 5
              },
              {
                id: 'qc-m4-challenge',
                title: 'Circuit Building Challenge',
                type: 'code',
                duration: '20 min',
                content: 'Build circuits to create specific quantum states',
                order: 6
              }
            ]
          },
          {
            id: 'qc-module-5',
            title: 'Quantum Algorithms (Conceptual Mastery)',
            description: 'Focus on intuition over memorization. Understand how quantum algorithms achieve computational advantages.',
            outcome: 'Learners understand how quantum algorithms gain advantage over classical approaches',
            order: 5,
            lessons: [
              {
                id: 'qc-m5-l1',
                title: 'Deutsch-Jozsa Algorithm',
                type: 'video',
                duration: '28 min',
                content: 'First quantum speedup - understanding oracle queries',
                order: 1
              },
              {
                id: 'qc-m5-l2',
                title: 'Grover\'s Search Algorithm',
                type: 'video',
                duration: '32 min',
                content: 'Quadratic speedup for unstructured search',
                order: 2
              },
              {
                id: 'qc-m5-l3',
                title: 'Grover\'s Algorithm Visualization',
                type: 'interactive',
                duration: '25 min',
                content: 'Interactive visualization of amplitude amplification',
                order: 3
              },
              {
                id: 'qc-m5-l4',
                title: 'Shor\'s Algorithm (High-level)',
                type: 'video',
                duration: '30 min',
                content: 'Factoring large numbers - the cryptography implications',
                order: 4
              },
              {
                id: 'qc-m5-l5',
                title: 'Algorithm Comparison',
                type: 'text',
                duration: '15 min',
                content: 'When to use which algorithm - complexity analysis',
                order: 5
              },
              {
                id: 'qc-m5-quiz',
                title: 'Algorithm Mastery Quiz',
                type: 'quiz',
                duration: '18 min',
                content: 'Scenario-based questions on algorithm selection and performance',
                order: 6
              }
            ]
          },
          {
            id: 'qc-module-6',
            title: 'Hands-On Quantum Programming',
            description: 'Bridge theory to practice. Learn to write quantum programs and run them on simulators.',
            outcome: 'Learners can experiment with quantum code using industry-standard tools',
            order: 6,
            lessons: [
              {
                id: 'qc-m6-l1',
                title: 'Quantum Simulators vs Real Hardware',
                type: 'video',
                duration: '20 min',
                content: 'Understanding the differences and when to use each',
                order: 1
              },
              {
                id: 'qc-m6-l2',
                title: 'Introduction to Qiskit',
                type: 'video',
                duration: '25 min',
                content: 'Setup and overview of IBM\'s quantum programming framework',
                order: 2
              },
              {
                id: 'qc-m6-l3',
                title: 'Writing Your First Quantum Program',
                type: 'code',
                duration: '35 min',
                content: 'Step-by-step coding tutorial - create a Bell state',
                order: 3
              },
              {
                id: 'qc-m6-l4',
                title: 'Running Circuits on Simulators',
                type: 'code',
                duration: '30 min',
                content: 'Execute quantum programs and analyze results',
                order: 4
              },
              {
                id: 'qc-m6-l5',
                title: 'Implementing Grover\'s Algorithm',
                type: 'code',
                duration: '40 min',
                content: 'Code walkthrough of a complete quantum algorithm',
                order: 5
              },
              {
                id: 'qc-m6-project',
                title: 'Programming Project',
                type: 'assignment',
                duration: '2 hours',
                content: 'Build and simulate a quantum circuit demonstrating superposition and entanglement',
                order: 6
              }
            ]
          },
          {
            id: 'qc-module-7',
            title: 'Real-World Applications & Limitations',
            description: 'Avoid hype, build credibility. Understand actual use cases and current technological limitations.',
            outcome: 'Learners gain realistic expectations about quantum computing capabilities',
            order: 7,
            lessons: [
              {
                id: 'qc-m7-l1',
                title: 'Quantum Cryptography',
                type: 'video',
                duration: '22 min',
                content: 'QKD, post-quantum cryptography, and security implications',
                order: 1
              },
              {
                id: 'qc-m7-l2',
                title: 'Optimization Problems',
                type: 'video',
                duration: '20 min',
                content: 'Supply chain, financial modeling, and combinatorial optimization',
                order: 2
              },
              {
                id: 'qc-m7-l3',
                title: 'Drug Discovery and Molecular Simulation',
                type: 'video',
                duration: '18 min',
                content: 'Quantum chemistry simulations for pharmaceutical research',
                order: 3
              },
              {
                id: 'qc-m7-l4',
                title: 'Noise, Decoherence, and Error Rates',
                type: 'video',
                duration: '25 min',
                content: 'Understanding the current technical challenges',
                order: 4
              },
              {
                id: 'qc-m7-l5',
                title: 'Why We Don\'t Have Quantum PCs Yet',
                type: 'text',
                duration: '15 min',
                content: 'Scalability challenges and engineering hurdles',
                order: 5
              },
              {
                id: 'qc-m7-discussion',
                title: 'Discussion: Realistic Applications',
                type: 'discussion',
                duration: '30 min',
                content: 'Forum discussion: Which industries will benefit first from quantum computing?',
                order: 6
              }
            ]
          },
          {
            id: 'qc-module-8',
            title: 'The Future of Quantum Computing',
            description: 'Inspire without misleading. Understand the roadmap and career opportunities in quantum computing.',
            outcome: 'Learners see where they fit in the quantum computing ecosystem',
            order: 8,
            lessons: [
              {
                id: 'qc-m8-l1',
                title: 'Near-Term Quantum Devices (NISQ Era)',
                type: 'video',
                duration: '20 min',
                content: 'What we can do with 50-1000 qubit systems',
                order: 1
              },
              {
                id: 'qc-m8-l2',
                title: 'Quantum Error Correction (Conceptual)',
                type: 'video',
                duration: '22 min',
                content: 'The path to fault-tolerant quantum computing',
                order: 2
              },
              {
                id: 'qc-m8-l3',
                title: 'Industry Landscape',
                type: 'text',
                duration: '18 min',
                content: 'IBM, Google, IonQ, Rigetti - who\'s building what',
                order: 3
              },
              {
                id: 'qc-m8-l4',
                title: 'Careers in Quantum Computing',
                type: 'video',
                duration: '25 min',
                content: 'Quantum software engineer, researcher, algorithm designer pathways',
                order: 4
              },
              {
                id: 'qc-m8-l5',
                title: 'Your Learning Path Forward',
                type: 'text',
                duration: '12 min',
                content: 'Resources, communities, and next steps',
                order: 5
              },
              {
                id: 'qc-m8-discussion',
                title: 'Course Discussion',
                type: 'discussion',
                duration: '30 min',
                content: 'Will quantum computing replace classical computing? Share your perspective',
                order: 6
              }
            ]
          }
        ],
        assessments: [
          {
            type: 'quiz',
            title: 'Concept Quizzes',
            description: 'Visual and scenario-based quizzes throughout each module testing conceptual understanding'
          },
          {
            type: 'challenge',
            title: 'Circuit-Building Challenges',
            description: 'Hands-on exercises where you design quantum circuits to solve specific problems'
          },
          {
            type: 'project',
            title: 'Capstone Project',
            description: 'Build and simulate a quantum circuit that demonstrates superposition and entanglement. Document your design choices and analyze results'
          },
          {
            type: 'discussion',
            title: 'Discussion Forums',
            description: 'Engage in thoughtful discussions about quantum computing\'s future, ethics, and real-world impact'
          }
        ],
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
}