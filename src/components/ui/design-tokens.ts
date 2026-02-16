/**
 * CerebroLearn Design Tokens
 * Central source of truth for design system values
 * Use these constants to maintain consistency across the platform
 */

export const DESIGN_TOKENS = {
  // Spacing Scale (based on 4px base unit)
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border Radius
  radius: {
    sm: 'rounded-md',      // 6px - small elements, badges
    md: 'rounded-lg',      // 8px - buttons, inputs, most UI elements
    lg: 'rounded-xl',      // 12px - cards, containers
    full: 'rounded-full',  // pills, avatars
  },

  // Icon Sizes (context-based)
  iconSize: {
    xs: 'h-3 w-3',    // 12px - tiny indicators
    sm: 'h-4 w-4',    // 16px - inline icons, badges
    md: 'h-5 w-5',    // 20px - buttons, nav items
    lg: 'h-6 w-6',    // 24px - headings, feature icons
    xl: 'h-8 w-8',    // 32px - large feature icons
    '2xl': 'h-12 w-12', // 48px - hero icons, empty states
  },

  // Icon Container Sizes
  iconContainer: {
    sm: 'h-8 w-8',    // 32px
    md: 'h-10 w-10',  // 40px
    lg: 'h-12 w-12',  // 48px
    xl: 'h-16 w-16',  // 64px
  },

  // Shadows (elevation system)
  shadow: {
    sm: 'shadow-sm',       // Subtle lift
    md: 'shadow-md',       // Standard elevation
    lg: 'shadow-lg',       // Prominent elevation
    xl: 'shadow-xl',       // Maximum elevation
    none: 'shadow-none',
  },

  // Transitions
  transition: {
    fast: 'transition-all duration-150',
    base: 'transition-all duration-200',
    slow: 'transition-all duration-300',
    colors: 'transition-colors duration-200',
    shadow: 'transition-shadow duration-200',
    transform: 'transition-transform duration-200',
  },

  // Card Padding (based on context)
  cardPadding: {
    compact: 'p-4',     // 16px - tight spaces, mobile
    default: 'p-6',     // 24px - standard cards
    relaxed: 'p-8',     // 32px - feature cards, hero sections
  },

  // Gap/Spacing between elements
  gap: {
    xs: 'gap-1',      // 4px
    sm: 'gap-2',      // 8px
    md: 'gap-3',      // 12px - default for most layouts
    lg: 'gap-4',      // 16px
    xl: 'gap-6',      // 24px
    '2xl': 'gap-8',   // 32px
  },

  // Container spacing
  containerSpacing: {
    sm: 'py-4',       // 16px
    md: 'py-6',       // 24px
    lg: 'py-8',       // 32px - default
    xl: 'py-12',      // 48px
    '2xl': 'py-16',   // 64px
  },

  // Font Weights (semantic)
  fontWeight: {
    normal: 'font-normal',     // 400 - body text
    medium: 'font-medium',     // 500 - labels, UI elements
    semibold: 'font-semibold', // 600 - subheadings
    bold: 'font-bold',         // 700 - headings
  },

  // Text Sizes (semantic)
  textSize: {
    xs: 'text-xs',       // 12px - tiny labels
    sm: 'text-sm',       // 14px - secondary text, badges
    base: 'text-base',   // 16px - body text
    lg: 'text-lg',       // 18px - emphasized text
    xl: 'text-xl',       // 20px - subheadings
    '2xl': 'text-2xl',   // 24px - section headings
    '3xl': 'text-3xl',   // 30px - page headings
  },
} as const;

/**
 * Semantic color class helpers
 * These map to CSS variables defined in globals.css
 */
export const COLORS = {
  // Backgrounds
  bg: {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    destructive: 'bg-destructive',
    muted: 'bg-muted',
    accent: 'bg-accent',
    card: 'bg-card',
  },

  // Text colors
  text: {
    primary: 'text-primary',
    secondary: 'text-secondary',
    foreground: 'text-foreground',
    muted: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  },

  // Border colors
  border: {
    default: 'border-border',
    primary: 'border-primary',
    secondary: 'border-secondary',
    muted: 'border-muted',
    destructive: 'border-destructive',
  },

  // Opacity variants
  opacity: {
    primary: {
      5: 'bg-primary/5',
      10: 'bg-primary/10',
      20: 'bg-primary/20',
      50: 'bg-primary/50',
    },
    secondary: {
      5: 'bg-secondary/5',
      10: 'bg-secondary/10',
      20: 'bg-secondary/20',
      50: 'bg-secondary/50',
    },
    muted: {
      30: 'bg-muted/30',
      50: 'bg-muted/50',
      70: 'bg-muted/70',
    },
  },
} as const;

/**
 * Common component patterns
 */
export const PATTERNS = {
  // Icon containers
  iconContainer: {
    primary: 'rounded-lg bg-primary/10 flex items-center justify-center',
    secondary: 'rounded-lg bg-secondary/10 flex items-center justify-center',
    muted: 'rounded-lg bg-muted/50 flex items-center justify-center',
  },

  // Hover effects
  hover: {
    lift: 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
    brightness: 'hover:brightness-110 transition-all duration-200',
  },

  // Status indicators
  status: {
    active: 'bg-success/10 text-success border-success/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
    inactive: 'bg-muted text-muted-foreground border-border',
    error: 'bg-destructive/10 text-destructive border-destructive/20',
  },
} as const;
