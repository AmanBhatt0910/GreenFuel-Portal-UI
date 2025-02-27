# Green Fuel Employee Portal

## Overview

This repository contains the employee portal login interface for Green Fuel Corporation. The application is built with Next.js 14, TypeScript, Tailwind CSS, Shadcn UI components, and Framer Motion for animations. The design focuses on a clean, professional look aligned with the company's branding.

## Color Theme

The application follows a specific color theme:

- **Primary Color**: `#6552D0` (Purple)
- **Secondary Color**: `#41a350` (Green)
- **Neutral/Gray**: `#A5A5A5` (Gray)
- **Background**: Gradient from `#f8f9fa` to `#e9ecef`
- **Text**: Black for primary text, Gray for secondary text

This color palette combines the corporate identity of Green Fuel with a modern, clean aesthetic that emphasizes professionalism and sustainability.

## Component Structure

The application follows a component-based architecture to promote reusability and maintainability. Here's an overview of the main components:

### UI Components

1. **GreenFuelButton**
   - Custom button component with animation effects
   - Supports primary (gradient) and outline variants
   - Includes hover animations with Framer Motion
   - File: `components/ui/GreenFuelButton.tsx`

2. **GreenFuelInput**
   - Enhanced input field with optional label
   - Special password variant with show/hide toggle
   - Animations for form entrance
   - File: `components/ui/GreenFuelInput.tsx`

3. **GreenFuelCheckbox**
   - Custom checkbox with label
   - Branded styling for checked state
   - File: `components/ui/GreenFuelCheckbox.tsx`

4. **GreenFuelLogo**
   - Company logo component with the leaf icon
   - Multiple size options (sm, md, lg)
   - Entrance animation
   - File: `components/ui/GreenFuelLogo.tsx`

5. **GreenFuelTitle**
   - Special title component that automatically styles "GreenFuel" with brand colors
   - Optional subtitle support
   - File: `components/ui/GreenFuelTitle.tsx`

### Form Components

1. **LoginForm**
   - Manages form state and submission
   - Handles validation
   - Combines input, checkbox, and button components
   - File: `components/login/LoginForm.tsx`

2. **FooterLinks**
   - Displays company resources and links
   - Dynamic link generation from props
   - Copyright information
   - File: `components/login/FooterLinks.tsx`

### Page Component

The main login page (`app/login/page.tsx`) assembles all components and manages the overall layout, including:
- Background elements
- Card container
- Animation orchestration
- Version display

## Features

- **Responsive Design**: Works on all device sizes
- **Animated UI**: Smooth entrance and interaction animations
- **Company Branding**: Consistent use of Green Fuel colors and identity
- **Type Safety**: Full TypeScript implementation
- **Accessibility**: Built with a11y best practices
- **Form Validation**: Client-side validation for form inputs

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Required Packages

- next
- react
- react-dom
- typescript
- tailwindcss
- framer-motion
- lucide-react
- shadcn/ui components

## Project Structure

```
├── app/
│   └── login/
│       └── page.tsx       # Main login page
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── GreenFuelButton.tsx
│   │   ├── GreenFuelCheckbox.tsx
│   │   ├── GreenFuelInput.tsx
│   │   ├── GreenFuelLogo.tsx
│   │   └── GreenFuelTitle.tsx
│   └── login/             # Login specific components
│       ├── LoginForm.tsx
│       └── FooterLinks.tsx
├── lib/
│   └── utils.ts           # Utility functions
├── public/
│   └── assets/            # Static assets
└── styles/
    └── globals.css        # Global styles
```

## Extending the Project

For new developers working on this project:

1. All UI elements should use the existing component library
2. Maintain the established color theme for consistency
3. Follow the component-based architecture for new features
4. Add new reusable components to the appropriate folders
5. Use TypeScript interfaces for all props
6. Leverage Framer Motion for animations when appropriate

## Design Decisions

- **Gradient Elements**: Used for visual interest and to combine the green and purple theme
- **Card Layout**: Provides a focused interface with clear visual hierarchy
- **Animated Interactions**: Enhances user experience and feels more responsive
- **Company Resources**: Quick access to important portals for employees
- **Modular Components**: Facilitates maintenance and future expansion

## License

Copyright © 2025 GreenFuel Corporation. All rights reserved.
