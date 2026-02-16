import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

export function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategories, setNewSubcategories] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

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
  };

  const saveCategories = (updatedCategories: Category[]) => {
    localStorage.setItem('cerebrolearn_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('categoriesUpdated'));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    // Check for duplicates
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast.error('A category with this name already exists');
      return;
    }

    const subcategoryArray = newSubcategories
      .split(',')
      .map(sub => sub.trim())
      .filter(sub => sub.length > 0);

    const newCategory: Category = {
      name: newCategoryName.trim(),
      subcategories: subcategoryArray
    };

    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);

    toast.success(`Category "${newCategory.name}" added successfully`);
    setIsAddDialogOpen(false);
    setNewCategoryName('');
    setNewSubcategories('');
  };

  const handleEditCategory = () => {
    if (!currentCategory || !newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    // Check for duplicates (excluding current category)
    if (categories.some(cat => 
      cat.name.toLowerCase() === newCategoryName.trim().toLowerCase() && 
      cat.name !== currentCategory.name
    )) {
      toast.error('A category with this name already exists');
      return;
    }

    const subcategoryArray = newSubcategories
      .split(',')
      .map(sub => sub.trim())
      .filter(sub => sub.length > 0);

    const updatedCategories = categories.map(cat =>
      cat.name === currentCategory.name
        ? { name: newCategoryName.trim(), subcategories: subcategoryArray }
        : cat
    );

    saveCategories(updatedCategories);

    toast.success(`Category updated successfully`);
    setIsEditDialogOpen(false);
    setCurrentCategory(null);
    setNewCategoryName('');
    setNewSubcategories('');
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;

    const updatedCategories = categories.filter(cat => cat.name !== categoryToDelete);
    saveCategories(updatedCategories);

    toast.success(`Category "${categoryToDelete}" deleted successfully`);
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setNewCategoryName(category.name);
    setNewSubcategories(category.subcategories.join(', '));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setIsDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    setNewCategoryName('');
    setNewSubcategories('');
    setIsAddDialogOpen(true);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all categories to defaults? This will remove any custom categories you\'ve created.')) {
      saveCategories(DEFAULT_CATEGORIES);
      toast.success('Categories reset to defaults');
    }
  };

  return (
    <div className="container py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2">Category Management</h1>
          <p className="text-muted-foreground">
            Manage course categories and subcategories for the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 size-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Categories</CardTitle>
            <FolderOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Main course categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Subcategories</CardTitle>
            <Tag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {categories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                How Categories Work
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Categories you create here will be immediately available in course creation forms</li>
                <li>• Course creators can select these categories when creating new courses</li>
                <li>• Changes sync automatically across all components in real-time</li>
                <li>• Categories are stored locally and persist across browser sessions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="size-5 text-primary" />
                    {category.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {category.subcategories.length} subcategories
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(category.name)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((sub, subIndex) => (
                    <Badge key={subIndex} variant="secondary">
                      {sub}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No subcategories
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing courses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="e.g., Science, Technology, Arts"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategories">
                Subcategories (comma-separated)
              </Label>
              <Input
                id="subcategories"
                placeholder="e.g., Physics, Chemistry, Biology"
                value={newSubcategories}
                onChange={(e) => setNewSubcategories(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate subcategories with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              <Plus className="mr-2 size-4" />
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category name and subcategories
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                placeholder="e.g., Science, Technology, Arts"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subcategories">
                Subcategories (comma-separated)
              </Label>
              <Input
                id="edit-subcategories"
                placeholder="e.g., Physics, Chemistry, Biology"
                value={newSubcategories}
                onChange={(e) => setNewSubcategories(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate subcategories with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>
              <Save className="mr-2 size-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{categoryToDelete}"? This action cannot be undone.
              Courses in this category will need to be recategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}