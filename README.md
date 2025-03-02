# Green Fuel Employee Portal

## Overview

This repository contains the employee portal for Green Fuel Corporation. The application is built with Next.js 14, TypeScript, Tailwind CSS, Shadcn UI components, and Framer Motion for animations. The design focuses on a clean, professional look aligned with the company's branding.

## Color Theme

The application uses a cohesive green-themed palette that emphasizes sustainability and eco-friendliness:

- **Primary Background**: Gradient from `#f0fdf4` (green-50) to `#ffffff` (white)
- **Secondary Background**: Gradient from `#f0fdf4` (green-50) to `#dcfce7` (green-100)
- **Primary Green**: `#22c55e` (green-500) for buttons and active elements
- **Dark Green**: `#15803d` (green-700) for hover states and accents
- **Light Green**: `#dcfce7` (green-100) for subtle backgrounds and cards
- **Green Gradient**: `from-green-600 to-green-700` for buttons and important UI elements
- **Accent**: Amber/yellow for warnings and alerts
- **Neutral Gray**: Various shades from gray-100 to gray-900 for text and borders
- **Dark Mode Background**: Gradient from gray-900 to green-900/20 (semi-transparent)

This color palette creates a professional, cohesive interface that emphasizes the eco-friendly brand identity of Green Fuel. The green theme is consistently applied across all pages, including dashboard, forms, and credential management interfaces.

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

### Dashboard Components

1. **StatCard**
   - Displays statistics with animation effects and visual indicators
   - Supports different status types with appropriate icons
   - File: `components/custom/dashboard/DashboardComponents/StatCard.tsx`

2. **WeeklyActivityChart**
   - Area chart showing weekly form activity data
   - Visual representation of trends over time
   - File: `components/custom/dashboard/DashboardComponents/WeeklyActivityChart.tsx`

3. **ApprovalStatusChart**
   - Bar chart showing approval status by level
   - Visual breakdown of form status across different approval stages
   - File: `components/custom/dashboard/DashboardComponents/ApprovalStatusChart.tsx`

4. **DashboardHeader**
   - Header component with date display and refresh button
   - Provides consistent UI across dashboard pages
   - File: `components/custom/dashboard/DashboardComponents/DashboardHeader.tsx`

5. **ProcessTracker**
   - Visual representation of process status
   - Tracks progress through workflow stages
   - File: `components/custom/dashboard/ProcessTracker.tsx`

6. **TrackingTable**
   - Tabular display of tracking data
   - Sortable and filterable
   - File: `components/custom/dashboard/TrackingTable.tsx`

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

## Pages

The application features multiple pages organized by functionality:

### Authentication
- **Login Page** (`app/page.tsx`): Main entry point with login form

### Dashboard
- **Main Dashboard** (`app/dashboard/page.tsx`): Overview with statistics and charts
- **Form Management** (`app/dashboard/form/page.tsx`): Form creation and submission
- **Requests** (`app/dashboard/requests/page.tsx`): List of pending and completed requests
- **Request Details** (`app/dashboard/requests/[id]/page.tsx`): Detailed view of individual requests
- **Credentials** (`app/dashboard/credentials/page.tsx`): Credential management interface

## Features

- **Responsive Design**: Works on all device sizes
- **Animated UI**: Smooth entrance and interaction animations
- **Company Branding**: Consistent use of Green Fuel colors and identity
- **Type Safety**: Full TypeScript implementation
- **Accessibility**: Built with a11y best practices
- **Form Validation**: Client-side validation for form inputs
- **Data Visualization**: Charts and statistics for monitoring activities
- **Request Tracking**: Workflow tracking for form submissions
- **Status Monitoring**: Visual indicators for approval status

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
- recharts (for dashboard charts)

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── credentials/
│   │   │   └── page.tsx       # Credentials management page
│   │   ├── form/
│   │   │   └── page.tsx       # Form management page
│   │   ├── requests/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx   # Individual request details page
│   │   │   └── page.tsx       # Requests listing page
│   │   └── page.tsx           # Main dashboard page
│   └── page.tsx               # Login page
├── components/
│   ├── custom/
│   │   └── dashboard/
│   │       ├── DashboardComponents/    # Modular dashboard components
│   │       │   ├── ApprovalStatusChart.tsx
│   │       │   ├── DashboardHeader.tsx
│   │       │   ├── StatCard.tsx
│   │       │   ├── WeeklyActivityChart.tsx
│   │       │   ├── index.ts            # Export file for easy importing
│   │       │   └── types.ts            # Type definitions
│   │       ├── ProcessTracker.tsx
│   │       └── TrackingTable.tsx
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
7. When adding new dashboard components, place them in the `components/custom/dashboard/DashboardComponents` directory and update the exports in `index.ts`

## Design Decisions

- **Gradient Elements**: Used for visual interest and to combine the green theme
- **Card Layout**: Provides a focused interface with clear visual hierarchy
- **Animated Interactions**: Enhances user experience and feels more responsive
- **Company Resources**: Quick access to important portals for employees
- **Modular Components**: Facilitates maintenance and future expansion
- **Dashboard Visualization**: Charts and statistics provide at-a-glance insights
- **Process Tracking**: Visual indicators help users understand workflow status

## License

Copyright 2025 GreenFuel Corporation. All rights reserved.
