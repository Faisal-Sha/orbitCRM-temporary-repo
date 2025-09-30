# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

OrbitCRM is a comprehensive Customer Relationship Management system built as a React TypeScript application with Supabase as the backend. It's designed for healthcare and service organizations with features for client management, staff coordination, scheduling, communications, and business operations.

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Build Tool**: Vite

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Database (Supabase)
```bash
# Start Supabase locally (if configured)
supabase start

# Generate TypeScript types from database
supabase gen types typescript --project-id=nmgtsstkoqepxoadulzu > src/integrations/supabase/types.ts
```

## Architecture Overview

### Core Application Structure

The application follows a modular architecture organized by feature domains:

1. **Authentication & Authorization**: Role-based access control with Supabase Auth
2. **Dashboard**: Central hub with analytics and quick access
3. **People Management**: Leads, Clients, Staff, and Audiences
4. **Communication**: Email, Chat, Phone, Video, Social, and Feedback systems
5. **Scheduling**: Appointments, Calendar management, and CAL integration
6. **Development**: Training and onboarding for clients, staff, and personal growth
7. **Records**: Client and staff record management with forms
8. **Finance**: Billing, Claims, Payouts, and Transaction tracking
9. **Marketing**: Campaign management across multiple channels
10. **Automation**: Workflow automation and communication flows
11. **Forms**: Dynamic form builder with submissions management
12. **Files**: Document and media management

### Key Architectural Patterns

**Component Organization**: Components are organized by feature domain in `/src/components/[feature]/`

**Page Structure**: All pages follow the same pattern with main pages in `/src/pages/` and sub-pages in feature subdirectories

**Layout System**: Uses a main `AppLayout` with collapsible sidebar and top navigation

**Data Management**: 
- TanStack Query for server state management
- Custom hooks for common data operations (e.g., `useAuthz`, `useActiveClients`)
- Supabase client for database operations

**Permission System**: Role-based permissions with the `RequirePermission` component and `useAuthz` hook

### Important Directories

- `/src/components/`: Reusable UI components organized by feature
- `/src/pages/`: Main application pages
- `/src/hooks/`: Custom React hooks for data management
- `/src/integrations/supabase/`: Database client and type definitions  
- `/src/lib/`: Utility functions
- `/src/types/`: TypeScript type definitions

## Development Guidelines

### Component Development

- Use TypeScript for all components with proper type definitions
- Follow the established pattern: feature-based organization under `/components/[feature]/`
- Use shadcn/ui components as base building blocks
- Implement proper error boundaries and loading states

### Data Management

- Use TanStack Query for all server state management
- Create custom hooks for reusable data operations
- Implement proper error handling and loading states
- Use the established permission system for access control

### Styling

- Use Tailwind CSS classes exclusively
- Follow the established design system with shadcn/ui components
- Use the `cn()` utility function for conditional class names
- Maintain responsive design patterns

### Forms

- Use React Hook Form with Zod validation for all forms
- Follow the pattern established in existing form components
- Implement proper error handling and validation messages

### Routing

- All routes are defined in `/src/App.tsx`
- Use nested routing structure that matches the component hierarchy
- Protected routes should use the `RequirePermission` wrapper

### Database Integration

- All database operations go through the Supabase client
- Use RPC functions for complex operations
- Type all database operations using the generated types
- Handle authentication state changes properly

### Testing & Quality

- Run `npm run lint` before committing changes
- Ensure components handle loading and error states
- Test responsive design across different screen sizes
- Verify permission-based access control works correctly

## Key Features

### Role-Based Access Control
The application implements a comprehensive permission system with roles like Owner, Admin, Staff, Client, and Lead. Use the `useAuthz` hook and `RequirePermission` component for access control.

### Multi-Calendar Management
Advanced scheduling system with multiple calendar types, availability management, and Cal.com integration for external booking.

### Communication Flows & Automation
Sophisticated workflow automation system with email, SMS, and call sequences. The drag-and-drop workflow builder allows complex automation creation.

### Dynamic Form Builder
Comprehensive form builder with conditional logic, custom fields, PDF generation, and submission management.

### Financial Management
Complete billing and financial tracking with Stripe integration, transaction management, and financial reporting.

### Development Tracking
Training and certification tracking for staff, clients, and personal development with milestone management.

## Environment Configuration

The application uses Supabase for backend services. The Supabase configuration is in `/supabase/config.toml` with the project ID `nmgtsstkoqepxoadulzu`.

Key environment considerations:
- Development server runs on port 8080
- Supabase client is configured in `/src/integrations/supabase/client.ts`
- Authentication uses localStorage for session persistence

## Common Development Tasks

### Adding New Features
1. Create components in appropriate `/src/components/[feature]/` directory
2. Add page routes in `/src/App.tsx`
3. Create custom hooks for data management if needed
4. Implement proper permission checks
5. Follow established patterns for forms and data handling

### Database Schema Changes
1. Make changes in Supabase dashboard or via migrations
2. Regenerate TypeScript types: `supabase gen types typescript --project-id=nmgtsstkoqepxoadulzu`
3. Update affected components and hooks

### Adding New Permissions
1. Add permission to database via `app_user_permissions` table
2. Update permission checks in components using `useAuthz`
3. Test with different user roles
