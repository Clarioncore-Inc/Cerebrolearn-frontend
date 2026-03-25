import React, { useState } from 'react';
import { coursesApi, lessonsApi } from '../../utils/api-client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Database } from 'lucide-react';
import { toast } from 'sonner';

export function SeedData() {
  const [loading, setLoading] = useState(false);

  const sampleCourses = [
    {
      title: 'Introduction to Python Programming',
      description:
        'Learn Python from scratch with interactive exercises and real-world projects. Perfect for beginners!',
      category: 'programming',
      level: 'beginner',
      public: true,
      lessons: [
        {
          title: 'Variables and Data Types',
          kind: 'interactive',
          content: {
            steps: [
              {
                title: 'What are Variables?',
                text: "Variables are containers for storing data values. In Python, you don't need to declare variable types explicitly.",
                example: "x = 5\nname = 'John'\nis_student = True",
              },
              {
                title: 'Try it Yourself',
                description:
                  "Create a variable called 'age' and set it to your age",
                interactive: true,
                hint: 'Use the format: age = your_age_number',
              },
            ],
          },
        },
        {
          title: 'Control Flow - If Statements',
          kind: 'interactive',
          content: {
            steps: [
              {
                title: 'Making Decisions in Code',
                text: 'If statements allow your program to make decisions based on conditions.',
                code: "if age >= 18:\n    print('You are an adult')\nelse:\n    print('You are a minor')",
              },
            ],
          },
        },
        {
          title: 'Python Basics Quiz',
          kind: 'quiz',
          content: {
            questions: [
              {
                question:
                  'Which of the following is the correct way to create a variable in Python?',
                options: ['int x = 5', 'x = 5', 'var x = 5', 'let x = 5'],
                correctAnswer: 'x = 5',
                explanation:
                  'Python uses simple assignment without type declarations',
              },
              {
                question: 'What data type is the value True?',
                options: ['String', 'Integer', 'Boolean', 'Float'],
                correctAnswer: 'Boolean',
                explanation: 'True and False are Boolean values',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Web Development Fundamentals',
      description:
        'Master HTML, CSS, and JavaScript to build beautiful, interactive websites.',
      category: 'programming',
      level: 'beginner',
      public: true,
      lessons: [
        {
          title: 'HTML Structure',
          kind: 'interactive',
          content: {
            steps: [
              {
                title: 'Building Blocks of Web Pages',
                text: 'HTML (HyperText Markup Language) provides the structure for web pages using elements and tags.',
              },
            ],
          },
        },
        {
          title: 'CSS Styling Basics',
          kind: 'interactive',
          content: {
            steps: [
              {
                title: 'Making Pages Beautiful',
                text: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Data Science with Python',
      description:
        'Learn data analysis, visualization, and machine learning fundamentals.',
      category: 'programming',
      level: 'intermediate',
      public: true,
      lessons: [
        {
          title: 'Introduction to NumPy',
          kind: 'interactive',
          content: {
            steps: [
              {
                title: 'Working with Arrays',
                text: 'NumPy is the fundamental package for scientific computing in Python.',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Mathematics for Machine Learning',
      description:
        'Build a strong mathematical foundation for understanding machine learning algorithms.',
      category: 'mathematics',
      level: 'intermediate',
      public: true,
      lessons: [
        {
          title: 'Linear Algebra Basics',
          kind: 'interactive',
          content: {
            steps: [
              {
                title: 'Vectors and Matrices',
                text: 'Understanding vectors and matrices is crucial for machine learning.',
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Digital Marketing Essentials',
      description:
        'Learn SEO, content marketing, and social media strategies to grow your business.',
      category: 'business',
      level: 'beginner',
      public: true,
      lessons: [
        {
          title: 'SEO Fundamentals',
          kind: 'article',
          content: {
            text: 'Search Engine Optimization (SEO) helps your website rank higher in search results.',
          },
        },
      ],
    },
  ];

  const seedDatabase = async () => {
    setLoading(true);
    try {
      let successCount = 0;

      for (const courseData of sampleCourses) {
        try {
          // Create course
          const { lessons, ...courseInfo } = courseData;
          const courseResult = await coursesApi.create(courseInfo);

          // Create lessons for this course
          for (const lessonData of lessons) {
            await lessonsApi.create({
              course_id: courseResult.id,
              title: lessonData.title,
              kind: lessonData.kind || 'text',
              content: lessonData.content || {},
            });
          }

          // Publish the course
          await coursesApi.update(courseResult.id, {
            status: 'published',
          } as any);

          successCount++;
        } catch (error) {
          console.error(`Error creating course ${courseData.title}:`, error);
        }
      }

      toast.success(
        `Successfully created ${successCount} courses with lessons!`,
      );
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Database className='h-5 w-5' />
          Seed Sample Data
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Populate the platform with sample courses and lessons to get started
          quickly.
        </p>
        <Button onClick={seedDatabase} disabled={loading} className='w-full'>
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Creating Courses...
            </>
          ) : (
            'Seed Database'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
