# Category Management System

## Overview
CerebroLearn now includes a comprehensive category management system that allows administrators to create, edit, and delete course categories and subcategories dynamically.

## Features

### Admin Category Management
- **Add Categories**: Create new top-level categories with optional subcategories
- **Edit Categories**: Modify category names and their subcategories
- **Delete Categories**: Remove categories that are no longer needed
- **Reset to Defaults**: Restore the default set of categories

### Default Categories
The platform comes with 8 default categories:
1. **Science** - Physics, Astronomy, Chemistry, Biology
2. **Computer Science** - Artificial Intelligence, Software Development, Scientific Computing, Data Structures
3. **Technology** - Neurotechnology, Web Development, Mobile Development, Data Science, Cybersecurity
4. **Engineering** - Mechanical Engineering, Electrical Engineering, Bioengineering, Aerospace Engineering
5. **Mathematics** - Algebra, Geometry, Trigonometry, Calculus, Statistics
6. **Philosophy & Occult Sciences** - Philosophy, Occult Sciences, Ethics, Logic
7. **Business** - Marketing, Entrepreneurship, Management, Finance, Sales
8. **Design** - Graphic Design, UI/UX, Video Editing, 3D Animation, Photography

## How to Access

### For Admins
1. Log in as an admin user
2. Navigate to the Admin Portal
3. Click on "Category Management" in the sidebar
4. You'll see all existing categories with their subcategories

## Technical Implementation

### Storage
- Categories are stored in localStorage under the key `cerebrolearn_categories`
- The system automatically syncs across all components when categories are updated
- Categories persist across browser sessions

### React Hook
All components use the `useCategories()` hook to access the latest category data:

```tsx
import { useCategories } from '../../hooks/useCategories';

function MyComponent() {
  const { categories, loading } = useCategories();
  
  // categories is an array of { name: string, subcategories: string[] }
  // loading is a boolean indicating if categories are being loaded
}
```

### Components Updated
The following components now use dynamic categories from localStorage:
- `CourseCreationWizard.tsx` - Course creation form
- `CourseCreationWizardPage.tsx` - Full course creation wizard
- `AdvancedSearch.tsx` - Search filters
- `CategoryManagementPage.tsx` - Admin category management

### Event System
When categories are updated, a custom event `categoriesUpdated` is dispatched:

```javascript
window.dispatchEvent(new Event('categoriesUpdated'));
```

All components using `useCategories()` automatically listen for this event and reload the category data.

## Usage Guidelines

### Adding a New Category
1. Click "Add Category" button
2. Enter the category name (e.g., "Health & Wellness")
3. Enter subcategories separated by commas (e.g., "Nutrition, Fitness, Mental Health")
4. Click "Add Category"

### Editing a Category
1. Click the edit icon on any category card
2. Modify the category name or subcategories
3. Click "Save Changes"

### Deleting a Category
1. Click the trash icon on any category card
2. Confirm the deletion
3. Note: Courses in this category will need to be recategorized

### Resetting Categories
1. Click "Reset to Defaults" button
2. Confirm the action
3. All custom categories will be removed and default categories will be restored

## Best Practices

1. **Category Naming**: Use clear, descriptive names that are easily understood
2. **Subcategories**: Group related topics under appropriate subcategories
3. **Avoid Duplicates**: The system prevents duplicate category names
4. **Plan Before Deleting**: Consider the impact on existing courses before deleting categories
5. **Regular Review**: Periodically review and clean up unused categories

## Future Enhancements

Potential improvements for future versions:
- Course count per category
- Automatic migration of courses when categories are deleted
- Category icons and colors
- Hierarchical subcategory support (nested subcategories)
- Import/export category configurations
- Category usage analytics
