# Dainty Dream - Inventory Management System

## Design Overview

This is a modern inventory management application built with **Next.js** and **React**, featuring a comprehensive stock tracking and management system for suppliers, items, categories, and staff.

### Architecture

**Frontend & Backend Integration:**
- **Framework**: Next.js with TypeScript for full-stack development
- **API Routes**: RESTful API endpoints (`app/api/`) handling all server-side logic
- **UI Framework**: React components with Shadcn UI component library and Tailwind CSS styling

### Key Design Components

#### 1. **API Layer** (`app/api/`)
Modular API routes for:
- **Authentication**: User login and session management
- **Categories**: CRUD operations for item categories
- **Items**: Inventory item management
- **Staff**: Employee/staff member management
- **Suppliers**: Vendor/supplier information management
- **Stock Operations**: Stock-in and stock-out transactions
- **Health**: System health checks

#### 2. **State Management** (`app/context/`)
- **AuthContext**: Manages user authentication and session state
- **InventoryContext**: Manages inventory data and operations across the application

#### 3. **Page Structure** (`app/context/`)
Feature-based pages:
- Dashboard: Central hub for overview and quick stats
- Inventory management (items, categories, suppliers)
- Stock movements (stock-in, stock-out)
- Staff management
- Reporting and analytics

#### 4. **UI Components** (`components/`)
- **Reusable UI Components**: Shadcn component library (buttons, forms, tables, dialogs, etc.)
- **Layout**: AppLayout wrapper with Topbar and Sidebar navigation
- **Pages**: Specialized components (LoginPage, ExportReport)
- **Theme Provider**: Centralized theme management

#### 5. **Utilities & Database**
- **Database**: Configured in `lib/db.ts` for data persistence
- **Utils**: Helper functions in `lib/utils.ts` for common operations

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS with PostCSS
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **Database**: Custom db.ts configuration
- **Package Manager**: pnpm

### Design Patterns Used
- **Component-based Architecture**: Reusable, modular components
- **Separation of Concerns**: Clear division between API, pages, and UI components
- **Context-based State**: Global state management for auth and inventory
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API-driven**: Frontend consumes backend APIs for data operations