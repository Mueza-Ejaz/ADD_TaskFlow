# Design System Documentation for ADD_TaskFlow-App

This document outlines the core design tokens and UI components that form the visual language of the ADD_TaskFlow-App. Adhering to these guidelines ensures consistency and a cohesive user experience across the application.

## 1. Colors

Our color palette is defined in `frontend/tailwind.config.ts` and leverages Tailwind CSS for easy utility class usage.

### Primary Gradient
Used for primary actions, branding, and active states.
- **Start:** `#3b82f6` (Blue-500)
- **End:** `#8b5cf6` (Purple-600)
- **Usage:** `bg-gradient-primary`

### Semantic Colors
Used to convey specific meanings like success, error, or warnings.
- **Success:** `#10b981` (Green-500)
- **Warning:** `#f59e0b` (Yellow-500)
- **Error:** `#ef4444` (Red-500)

### Secondary / Grayscale
Used for backgrounds, text, borders, and less prominent UI elements.
- **Scale:** Tailwind's default grayscale (50-900)
- **Background Gradient:** `linear-gradient(to bottom, #f8fafc, #f1f5f9)` (`bg-gradient-background`)

## 2. Typography

The application uses the **Inter** font, sourced from Google Fonts, for all text.

### Font Family
- **Primary:** Inter (`font-sans` in Tailwind)
- **Fallback:** `sans-serif`

### Font Weights
Available weights are configured in `frontend/src/app/layout.tsx`.
- Light: `400` (Regular)
- Medium: `500`
- Semibold: `600`
- Bold: `700`

### Font Sizes
Defined in `frontend/tailwind.config.ts` and available as Tailwind utility classes.
- `text-xs`: 12px
- `text-sm`: 14px
- `text-base`: 16px (Default)
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px
- `text-3xl`: 32px

## 3. Spacing System

Our spacing is based on a **4px baseline grid**, ensuring harmonious alignment and consistent visual rhythm.

### Base Unit
- `4px`

### Scale
Defined in `frontend/tailwind.config.ts` and available as Tailwind utility classes (e.g., `p-4` for 4px padding, `m-16` for 16px margin).
- `4` (4px)
- `8` (8px)
- `12` (12px)
- `16` (16px)
- `20` (20px)
- `24` (24px)
- `32` (32px)
- `40` (40px)
- `48` (48px)
- `64` (64px)
- `80` (80px)
- `96` (96px)

## 4. Animations

Animations are powered by **Framer Motion** for smooth and engaging user interactions.

### Libraries
- **Core:** `framer-motion` (installed in `frontend/package.json`)
- **Utilities:** `frontend/lib/animations.ts`

### Default Parameters (configured in `frontend/lib/animations.ts` examples)
- **Duration:** 300ms (common transition duration)
- **Easing:** `easeInOut` (default for many animations, custom `cubic-bezier(0.4, 0, 0.2, 1)` is available)

### Common Animation Types
- `fadeAnimation` (opacity changes)
- `slideAnimation` (horizontal movement)
- `scaleAnimation` (size changes)

## 5. UI Components

Core reusable UI components are located in `frontend/components/ui/`. These components are built with Tailwind CSS and adhere to the design tokens.

-   **Button (`Button.tsx`):** Interactive element for triggering actions. Supports primary, secondary, and ghost variants, with customizable sizes.
-   **Card (`Card.tsx`):** Container for grouping related content. Supports a `glassmorphism` effect for modern UI.
-   **Input (`Input.tsx`):** Form input field with support for labels and error messages.
-   **Modal (`Modal.tsx`):** Overlay dialog for displaying critical information or requiring user interaction. Features animated entry/exit.
-   **LoadingSpinner (`LoadingSpinner.tsx`):** Animated spinner to indicate loading states. Customizable size and color.
-   **Toast (`Toast.tsx`):** Ephemeral notification messages appearing at the top-right. Supports success, error, warning, and info types with customizable duration.

---

*This document is a living guide and will evolve with the project.*
