# Design System Documentation for ADD_TaskFlow-App

This document outlines the core design tokens and UI components that form the visual language of the ADD_TaskFlow-App. The design system has been overhauled to a **Dark Theme** with **Glassmorphism** aesthetics.

## 1. Colors

Our color palette is defined in `frontend/tailwind.config.ts` and leverages Tailwind CSS.

### Theme Colors
- **Background:** `#000000` (Pure Black)
- **Foreground:** `#ffffff` (White)

### Primary Actions (Emerald)
Used for primary buttons, active states, and success indicators.
- **Base:** `#10b981` (Emerald-500)
- **Hover:** `#059669` (Emerald-600)
- **Glows:** `bg-emerald-500/20`

### Secondary Actions (Glass/Gray)
Used for secondary buttons, cards, and borders.
- **Glass Background:** `bg-white/5` or `bg-white/10`
- **Glass Border:** `border-white/10` or `border-white/20`
- **Text Muted:** `text-gray-400`

### Gradients
Used for background glows.
- **Teal/Green Glow:** Combination of Emerald-500 and Teal-500 with high blur (`blur-2xl` or `blur-[100px]`).

## 2. Typography

The application uses the **Inter** font, sourced from Google Fonts.

### Font Family
- **Primary:** Inter (`font-sans` in Tailwind)

### Text Styles
- **Headings:** Bold (`font-bold`), White (`text-white`)
- **Body:** Regular (`font-normal`), Gray-300 (`text-gray-300`) for readability against dark backgrounds.

## 3. Glassmorphism & Effects

The core visual style relies heavily on glassmorphism.

### Glass Card Standard
- **Background:** `bg-white/5` or `bg-white/10`
- **Backdrop Blur:** `backdrop-blur-md` or `backdrop-blur-lg`
- **Border:** `border border-white/10`
- **Shadow:** `shadow-xl`

### Glow Effects
- Fixed background glows use `AnimatedBackground` component.
- Interactive elements (like buttons) use `shadow-emerald-500/20`.

## 4. Animations

Powered by **Framer Motion** and CSS Transitions.

### Motion Primitives
- **Page Transitions:** Fade in/up (`opacity: 0 -> 1`, `y: 20 -> 0`).
- **Hover:** Scale up (`scale: 1.02`).
- **Lists:** `AnimatePresence` for item addition/removal.

### Reduced Motion
- Animations respect `prefers-reduced-motion`.
- Complex background animations are simplified or disabled.

## 5. UI Components

Located in `frontend/components/ui/`.

### Core Components
- **`GlassCard.tsx`**: The fundamental container component.
- **`AnimatedBackground.tsx`**: Full-screen ambient background with moving gradient orbs.
- **`AnimatedButton.tsx`**: Button with hover scaling and variant support.
- **`ParticleEffect.tsx`**: subtle floating particles for the login/landing pages.
- **`FloatingActionButton.tsx`**: Primary action button for mobile.
- **`PageTransition.tsx`**: Wrapper for smooth route transitions.

### Forms & Interactive
- **`Button.tsx`**: Updated with glass and emerald variants.
- **`Modal.tsx`**: Dark theme modal with backdrop blur.
- **`Input.tsx`**: Dark background inputs with white/20 borders.

---

*This document reflects the "Phase 4 UI/UX Overhaul" state.*