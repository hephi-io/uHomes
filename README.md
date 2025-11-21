# uHomes Monorepo

A modern monorepo for the uHomes application, managed with Turborepo and pnpm.

## 🏗️ Architecture

This monorepo contains:

- **`apps/api`** - Node.js/Express API server with TypeScript
- **`apps/web`** - React frontend application with Vite
- **`apps/landing`** - Marketing landing page with React and Vite
- **`packages/shared`** - Shared types and utilities
- **`packages/typescript-config`** - Shared TypeScript configurations
- **`packages/eslint-config`** - Shared ESLint configurations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific apps
pnpm api:dev      # API server only
pnpm web:dev      # Web app only
pnpm landing:dev  # Landing page only
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm turbo build --filter=@uhomes/api
pnpm turbo build --filter=@uhomes/web
pnpm turbo build --filter=@uhomes/landing
```

### Other Commands

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Clean all build artifacts
pnpm clean

# Format code
pnpm format
```

## 📁 Project Structure

```
uHomes/
├── apps/
│   ├── api/                 # API server
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── web/                 # React web app
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── landing/             # Landing page
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── shared/              # Shared types and utilities
│   ├── typescript-config/   # Shared TypeScript configs
│   └── eslint-config/       # Shared ESLint configs
├── package.json             # Root package.json
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── .npmrc                  # pnpm configuration
```

## 🔧 Configuration

### Turborepo

The monorepo uses Turborepo for task orchestration and caching. Configuration is in `turbo.json`.

### pnpm Workspaces

Workspaces are defined in `pnpm-workspace.yaml` and include all `apps/*` and `packages/*` directories.

### TypeScript

Shared TypeScript configurations are available:

- `@uhomes/typescript-config/base.json` - Base configuration
- `@uhomes/typescript-config/node.json` - Node.js configuration
- `@uhomes/typescript-config/react.json` - React configuration

### ESLint

Shared ESLint configuration is available as `@uhomes/eslint-config`.

## 📦 Shared Packages

### @uhomes/shared

Contains shared types and utilities:

```typescript
import { User, ApiResponse, API_ENDPOINTS } from "@uhomes/shared";
```

Available exports:

- `User`, `UserCreateInput`, `UserLoginInput` - User-related types
- `ApiResponse`, `AuthResponse` - API response types
- `API_ENDPOINTS` - API endpoint constants
- Utility functions for date formatting, email validation, etc.

## 🌐 Applications

### API Server (`apps/api`)

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Port**: 3000

### Web App (`apps/web`)

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Port**: 5173

### Landing Page (`apps/landing`)

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Port**: 3001

## 🔄 Development Workflow

1. Make changes in any app or package
2. Use `pnpm dev` to run all apps in development mode
3. Use `pnpm build` to build all apps
4. Use `pnpm lint` to check code quality
5. Use `pnpm type-check` to validate TypeScript types

## 🚀 Deployment

Each app can be deployed independently:

```bash
# Build specific app for production
pnpm turbo build --filter=@uhomes/api
pnpm turbo build --filter=@uhomes/web
pnpm turbo build --filter=@uhomes/landing
```

## 📝 Scripts

### Root Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean build artifacts
- `pnpm format` - Format code with Prettier

### App-specific Scripts

- `pnpm api:dev` - Start API server only
- `pnpm web:dev` - Start web app only
- `pnpm landing:dev` - Start landing page only

## 🤝 Contributing

1. Make changes in the appropriate app or package
2. Ensure all builds pass: `pnpm build`
3. Ensure linting passes: `pnpm lint`
4. Ensure type checking passes: `pnpm type-check`
5. Commit your changes

## 📄 License

This project is private and proprietary.
