// Utility to reset the course database
// This will clear existing courses and reload the default 26 science & engineering courses

export function resetCourseDatabase() {
  // Clear all course-related localStorage
  localStorage.removeItem('cerebrolearn_courses');
  localStorage.removeItem('cerebrolearn_drafts');
  localStorage.removeItem('cerebrolearn_enrollments');
  
  // Force re-initialization
  const { initializeDummyData } = require('./dummyData');
  initializeDummyData();
  
  console.log('✅ Database reset complete! 26 science & engineering courses loaded.');
  
  // Return success message
  return {
    success: true,
    message: 'Database reset successfully. Please refresh the page to see all 26 science & engineering courses.',
    coursesLoaded: 26
  };
}

// Function to check current database state
export function checkDatabaseStatus() {
  try {
    const courses = JSON.parse(localStorage.getItem('cerebrolearn_courses') || '[]');
    const drafts = JSON.parse(localStorage.getItem('cerebrolearn_drafts') || '[]');
    const enrollments = JSON.parse(localStorage.getItem('cerebrolearn_enrollments') || '[]');
    
    return {
      publishedCourses: courses.length,
      draftCourses: drafts.length,
      totalCourses: courses.length + drafts.length,
      enrollments: enrollments.length,
      courses: courses.map((c: any) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        instructor: c.instructorName
      }))
    };
  } catch {
    return {
      publishedCourses: 0,
      draftCourses: 0,
      totalCourses: 0,
      enrollments: 0,
      courses: []
    };
  }
}
