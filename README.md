# GreenFuel Portal UI

## Overview

This repository contains the employee portal for Green Fuel Corporation. The application is built with Next.js 15, TypeScript, Tailwind CSS, Shadcn UI components, and Framer Motion for animations. The design focuses on a clean, professional look aligned with the company's branding, emphasizing sustainability and eco-friendliness.

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

- **Authentication System**: Secure login with role-based access control
- **Dashboard Overview**: Dynamic statistics, charts, and status updates
- **Request Management**: Create and track budget and asset requests
- **Approval Workflow**: Multi-level approval system with notifications
- **Budget Allocation**: Complete budget management and tracking system
- **Business Unit Management**: Organization hierarchy management
- **Credential Management**: User credential administration
- **Reports & Analytics**: Data visualization and reporting capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Animated UI**: Rich animations and transitions using Framer Motion
- **Company Branding**: Consistent use of GreenFuel colors and identity
- **Type Safety**: Full TypeScript implementation for robust code
- **Accessibility**: Built following a11y best practices
- **Real-time Updates**: Dynamic data fetching and updates

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/your-organization/GreenFuel-Portal-UI.git
   cd GreenFuel-Portal-UI
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser to see the application

### Build for Production

```bash
npm run build
# or
yarn build
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Form Validation**: Zod
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Date Handling**: Date-fns, Dayjs
- **Document Generation**: jsPDF, DOCX, XLSX
- **File Management**: File-saver

## Project Structure

```
├── public/                # Static assets and images
│   └── images/            # Image assets
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── dashboard/     # Dashboard and feature pages
│   │   │   ├── approvals/         # Approval dashboards and details
│   │   │   ├── approval-access/    # Approval access management
│   │   │   ├── budget-allocation/  # Budget allocation system
│   │   │   ├── business-units/     # Business unit management
│   │   │   ├── category-management/ # Category management
│   │   │   ├── change-password/    # Password change functionality
│   │   │   ├── credentials/        # Credential management
│   │   │   ├── form/               # Request form
│   │   │   ├── manage-md/          # MD management
│   │   │   ├── profile/            # User profile
│   │   │   └── requests/           # Request listing and details
│   │   ├── hooks/         # Custom hooks
│   │   ├── unauthorized/  # Unauthorized access pages
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Login page
│   │   └── Provider.tsx   # Global providers
│   ├── components/        # React components
│   │   ├── custom/        # Custom components
│   │   │   ├── AssetRequestForm/   # Asset request form components
│   │   │   ├── Budget-allocation/  # Budget allocation components
│   │   │   ├── CategoryManagement/ # Category management components
│   │   │   ├── CredentialsManagement/ # Credential mgmt components
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   ├── LoginComponents/    # Login components
│   │   │   ├── PlantHierarchy/     # Plant hierarchy components
│   │   │   ├── ProgressBar/        # Progress bar components
│   │   │   └── Toaster/            # Toast notification components
│   │   └── ui/           # UI components (Shadcn)
│   ├── context/          # React context providers
│   │   ├── AuthContext.tsx         # Authentication context
│   │   └── NavigationContext.tsx   # Navigation context
│   ├── lib/              # Utility libraries
│   │   ├── axios.ts                # Axios instance configuration
│   │   ├── error-codes.ts          # Error code definitions
│   │   ├── roles.ts                # Role definitions
│   │   ├── security-constants.ts   # Security constants
│   │   ├── toast-util.ts           # Toast notification utilities
│   │   └── utils.ts                # General utilities
│   └── utils/            # Helper utilities
│       ├── error-code-map.ts       # Error code mapping
│       └── scroll-utils.ts         # Scroll utilities
├── components.json       # Shadcn UI configuration
├── eslint.config.mjs     # ESLint configuration
├── next-env.d.ts         # Next.js TypeScript declarations
├── next.config.ts        # Next.js configuration
├── package.json          # NPM dependencies
├── postcss.config.mjs    # PostCSS configuration
├── tsconfig.json         # TypeScript configuration
```

## Key Modules

### Dashboard

The main dashboard provides a comprehensive overview of the system with:
- Welcome banner with personalized user information
- Statistics cards showing approval status and activities
- Performance overview charts
- Recent requests table with status indicators
- Activity timeline showing recent actions
- Quick action buttons for common tasks

### Budget Allocation System

The Budget Allocation System has been refactored into modular components:

```
Budget-allocation/
├── types.ts - Type definitions used across components
├── BudgetHeader.tsx - Page header showing business units and departments
├── StatsCards.tsx - Overview statistics cards
├── AllocationForm.tsx - Form for creating new budget allocations
├── AllocationList.tsx - List of current budget allocations with progress indicators
├── AnalyticsCharts.tsx - Charts and visualizations for the analytics tab
├── TransactionList.tsx - Recent transactions list
├── ReportsView.tsx - Reports on department usage and budget alerts
└── TabManager.tsx - Tab navigation component
```

### Request Form System

The asset request form system provides a multi-step process for submitting requests:
- Employee information collection
- Asset selection and configuration
- Request details and justification
- Policy agreement and confirmation
- PDF generation for documentation
- Attachment handling for supporting documents

### Approval System

The approval system facilitates the review and processing of requests:
- Multi-level approval workflow
- Comments and communication between approvers
- Status tracking and visualization
- Document viewing and verification
- Approval/rejection capabilities with reason documentation

### Business Unit Management

The business unit management system allows for organization hierarchy configuration:
- Business unit creation and management
- Department configuration
- Designation management
- Employee assignment and organization

## Development Guidelines

For new developers working on this project:

1. All UI elements should use the existing component library from Shadcn UI or custom components
2. Maintain the established color theme for consistency across the application
3. Follow the component-based architecture for new features
4. Create reusable components in the appropriate folders:
   - UI components in `components/ui/`
   - Feature-specific components in `components/custom/[feature-name]/`
5. Define TypeScript interfaces for all component props
6. Leverage Framer Motion for animations when appropriate
7. Use the established context providers for authentication and navigation
8. Follow the modular approach for feature development:
   - Create a dedicated directory for the feature
   - Define types in a separate file
   - Break down complex UI into smaller components
   - Implement proper error handling and loading states

## Key Design Decisions

- **Modular Architecture**: Components are organized by feature to improve maintainability
- **Role-Based Access**: Different UI elements and actions based on user roles
- **Progressive Disclosure**: Complex forms broken into steps for better user experience
- **Data Visualization**: Charts and statistics provide at-a-glance insights
- **Consistent Styling**: Green theme throughout reinforces brand identity
- **Responsive Design**: Works across various device sizes
- **Animation**: Subtle animations enhance the user experience without being distracting
- **Error Handling**: Comprehensive error states and user feedback
- **Accessibility**: Focus management, semantic HTML, and ARIA attributes
- **Performance**: Optimized loading and rendering of components

## License

Copyright © 2025 Green Fuel Corporation. All rights reserved.
