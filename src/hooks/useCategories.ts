import { useState, useEffect } from 'react';

export interface Category {
  name: string;
  subcategories: string[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Science', subcategories: ['Physics', 'Astronomy', 'Chemistry', 'Biology'] },
  { name: 'Computer Science', subcategories: ['Artificial Intelligence', 'Software Development', 'Scientific Computing', 'Data Structures'] },
  { name: 'Technology', subcategories: ['Neurotechnology', 'Web Development', 'Mobile Development', 'Data Science', 'Cybersecurity'] },
  { name: 'Engineering', subcategories: ['Mechanical Engineering', 'Electrical Engineering', 'Bioengineering', 'Aerospace Engineering'] },
  { name: 'Mathematics', subcategories: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'] },
  { name: 'Philosophy & Occult Sciences', subcategories: ['Philosophy', 'Occult Sciences', 'Ethics', 'Logic'] },
  { name: 'Business', subcategories: ['Marketing', 'Entrepreneurship', 'Management', 'Finance', 'Sales'] },
  { name: 'Design', subcategories: ['Graphic Design', 'UI/UX', 'Video Editing', '3D Animation', 'Photography'] }
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = () => {
    const stored = localStorage.getItem('cerebrolearn_categories');
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories(DEFAULT_CATEGORIES);
        localStorage.setItem('cerebrolearn_categories', JSON.stringify(DEFAULT_CATEGORIES));
      }
    } else {
      // Initialize with default categories
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('cerebrolearn_categories', JSON.stringify(DEFAULT_CATEGORIES));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();

    // Listen for category updates
    const handleCategoriesUpdated = () => {
      loadCategories();
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdated);

    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdated);
    };
  }, []);

  return { categories, loading };
}

// Function to get categories synchronously (for components that need it immediately)
export function getCategories(): Category[] {
  const stored = localStorage.getItem('cerebrolearn_categories');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading categories:', error);
      localStorage.setItem('cerebrolearn_categories', JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
  } else {
    localStorage.setItem('cerebrolearn_categories', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
}
