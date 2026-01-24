# AI Coding Assistant Instructions for uHomes Monorepo

## Project Overview

uHomes is a student housing platform built as a Turborepo monorepo with pnpm workspaces. It consists of:

- **API** (`apps/api`): Express.js backend with TypeScript, MongoDB/Mongoose, JWT authentication
- **Web** (`apps/web`): React frontend with Vite, TypeScript, Tailwind CSS
- **Landing** (`apps/landing`): Marketing page with React/Vite
- **Shared packages**: TypeScript configs, ESLint config, UI components, shared types/utilities

## Architecture Patterns

### Backend (API)

- **Controllers** (`src/controllers/`): Handle HTTP requests, delegate to services, use `ResponseHelper` for responses
- **Services** (`src/service/`): Business logic layer, interact with models
- **Models** (`src/models/`): Mongoose schemas with TypeScript interfaces
- **Middleware**: Auth (`auth.middleware.ts`), validation (`validate.middleware.ts`), error handling (`error.middlewere.ts`)
- **Validation**: Zod schemas in `src/validation/`
- **Logging**: Winston with Morgan for HTTP requests
- **Documentation**: Swagger/OpenAPI at `/api-docs`

### Frontend (Web)

- **Routing**: React Router with nested routes, protected/public route components
- **State**: React contexts for auth (`AuthProvider`) and notifications (`NotificationProvider`)
- **API calls**: Axios services in `src/services/`, using shared types from `@uhomes/shared`
- **Components**: Custom UI kit (`@uhomes/ui-kit`), Tailwind CSS classes
- **Forms**: React Hook Form with validation
- **Animations**: Framer Motion for transitions

### User Types

- **Students**: Book properties, view hostels, manage profile
- **Agents**: List/manage properties, handle bookings/payments
- **Admins**: Platform management, escrow oversight

## Development Workflow

### Commands

```bash
# Full dev environment
pnpm dev

# Individual apps
pnpm api:dev      # API on :7000
pnpm web:dev      # Web on :5173
pnpm landing:dev  # Landing on :3001

# Build & quality
pnpm build        # All apps
pnpm lint         # ESLint check
pnpm type-check   # TypeScript validation
pnpm format       # Prettier formatting

# Testing (API only)
pnpm test         # Jest tests
```

### Commit Convention

Use conventional commits with scopes:

```
feat(api): add user registration endpoint
fix(web): resolve booking form validation
chore(shared): update dependencies
```

Run `pnpm commit` for interactive commit creation.

### Code Quality

- **ESLint**: Custom config allows unused vars prefixed with `_`, warns on `any` types
- **TypeScript**: Strict mode with shared configs (`@uhomes/typescript-config`)
- **Imports**: Use `@/` aliases for absolute imports in web app
- **Error handling**: Try/catch with `next(err)` in controllers, custom error middleware

## Key Files & Directories

### API Structure

```
apps/api/src/
├── app.ts              # Express app setup, middleware, routes
├── server.ts           # Server entry point, DB connection
├── controllers/        # HTTP handlers (user, property, booking, etc.)
├── service/           # Business logic
├── models/            # Mongoose schemas
├── middlewares/       # Auth, validation, error handling
├── routers/           # Route definitions
├── validation/        # Zod schemas
├── config/            # DB, Swagger, Multer, etc.
└── utils/             # Helpers (response, logger, etc.)
```

### Web Structure

```
apps/web/src/
├── App.tsx            # Root component with providers
├── routes/            # React Router configuration
├── layouts/           # Page layouts (auth, student, agent, admin)
├── pages/             # Page components organized by user type
├── components/        # Reusable components
├── services/          # API service functions
├── contexts/          # React contexts (auth, notifications)
├── utils/             # Utilities (token management, etc.)
└── shared/            # Shared components/constants
```

### Shared Packages

- `@uhomes/shared`: Common types (`User`, `ApiResponse`), utilities, API endpoints
- `@uhomes/ui-kit`: Reusable React components with Tailwind styling
- `@uhomes/eslint-config`: Shared linting rules
- `@uhomes/typescript-config`: Base/React TS configs

## Integration Points

### Authentication

- JWT tokens stored in localStorage via `token` utility
- Refresh tokens for session management
- Protected routes check auth context

### API Communication

- Base URL configured in services (likely `http://localhost:7000/api`)
- Request interceptors for auth headers
- Response types match `@uhomes/shared` interfaces

### Data Flow

1. Frontend calls service functions (e.g., `authService.login()`)
2. Services make axios requests to API endpoints
3. API controllers validate input, call services
4. Services interact with MongoDB via Mongoose models
5. Responses formatted with `ResponseHelper` utility

### File Uploads

- Multer middleware for handling file uploads
- Cloudinary integration for image storage
- Separate upload directories for different file types

## Common Patterns

### API Response Format

```typescript
// Success
{ success: true, data: T, message?: string }

// Error
{ success: false, error: string, message?: string }
```

### Controller Pattern

```typescript
async createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await this.bookingService.create(req.body);
    return ResponseHelper.created(res, result);
  } catch (err) {
    next(err);
  }
}
```

### Service Pattern

```typescript
class UserService {
  async register(input: UserCreateInput): Promise<User> {
    // Validation, business logic, DB operations
  }
}
```

### React Component Structure

```tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    // API calls, side effects
  }, []);

  return <div className="p-4">{/* Tailwind-styled JSX */}</div>;
}
```

### Form Handling

```tsx
import { useForm } from 'react-hook-form';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await authService.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      {errors.email && <span>Required</span>}
    </form>
  );
}
```

## Environment & Deployment

- **Environment variables**: `.env` files for API config (DB URL, JWT secrets, etc.)
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Independent deployment of apps, shared packages published to npm
- **CI/CD**: Turborepo caching for efficient builds

Focus on maintaining separation between student/agent/admin user experiences while leveraging shared components and types.</content>
<parameter name="filePath">c:\Users\user\OneDrive\Desktop\NewProject\uHomes\.github\copilot-instructions.md
