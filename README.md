# Rent Flow

A full-stack rental property management platform built with TypeScript, Hono, React 19, PostgreSQL, and S3-compatible storage. Manages the complete rental workflow from lead capture through property visits to application processing with document uploads.

## Structure

```
rent-flow/
├── apps/
│   ├── backend/                # Hono API server
│   │   ├── src/
│   │   │   ├── database/       # Drizzle client, schemas, migrations
│   │   │   ├── features/
│   │   │   │   ├── clients/                # Client management
│   │   │   │   ├── leads/                  # Lead capture and tracking
│   │   │   │   ├── properties/             # Property listings
│   │   │   │   ├── applications/           # Rental applications
│   │   │   │   ├── visits/                 # Property visit scheduling
│   │   │   │   └── application-documents/  # Document uploads (S3)
│   │   │   ├── middlewares/    # Auth, error handling, not-found
│   │   │   ├── app.ts         # Hono app with route registration
│   │   │   ├── env.ts         # Environment validation (Zod)
│   │   │   ├── extensions.ts  # RFC 9457 error helpers
│   │   │   ├── logger.ts      # Pino logger
│   │   │   ├── pagination.ts  # Page type and createPage
│   │   │   ├── storage.ts     # S3 client configuration
│   │   │   └── validator.ts   # Custom zValidator wrapper
│   │   ├── tests/              # Integration tests (node:test) — 33 test files
│   │   ├── drizzle.config.ts   # Drizzle Kit config
│   │   └── Dockerfile          # Multi-stage build
│   └── frontend/               # React 19 + Vite app
│       └── src/
│           ├── components/     # Shared UI (shadcn/ui, layout)
│           ├── features/
│           │   ├── clients/                # Client pages, components, stores
│           │   ├── leads/                  # Lead pages, components, stores
│           │   ├── properties/             # Property pages with map view
│           │   ├── applications/           # Application workflow UI
│           │   ├── visits/                 # Visit scheduling UI
│           │   └── application-documents/  # Document upload/download UI
│           ├── hooks/          # Custom hooks
│           ├── lib/            # Utilities
│           ├── stores/         # Global stores (Zustand)
│           ├── client.ts       # Hono type-safe API client
│           └── routes.tsx      # React Router config
├── .claude/
│   └── skills/                 # Claude Code skills for code generation
├── docker-compose.yml          # PostgreSQL, MinIO (S3), API, migrations, Seq
├── tsconfig.base.json          # Shared TypeScript options
├── eslint.config.ts            # Shared ESLint config (flat config)
├── prettier.config.ts          # Shared Prettier config
├── commitlint.config.ts        # Commit linting config
├── CLAUDE.md                   # Claude Code conventions (auto-loaded)
└── package.json                # Root workspace config
```

## Features

Rent Flow implements 6 feature modules, each following the same full-stack pattern (Drizzle table, Zod schemas, Hono CRUD endpoints, React pages with TanStack Query):

| Feature                   | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Clients**               | Manage tenant/client records with contact information                        |
| **Leads**                 | Capture and track prospective tenant leads                                   |
| **Properties**            | Property listings with address, details, and interactive map view (Leaflet)  |
| **Applications**          | Rental applications linking clients to properties with status workflow       |
| **Visits**                | Schedule and track property visits for leads                                 |
| **Application Documents** | Upload, download, and manage application documents via S3-compatible storage |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (for PostgreSQL, MinIO, and Seq)
- A [Clerk](https://clerk.com) account (for authentication)

### Installation

```bash
npm install
```

### Environment Setup

Copy the example env files and fill in your values:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

**Backend** (`apps/backend/.env`):

| Variable                | Description                     | Default                                              |
| ----------------------- | ------------------------------- | ---------------------------------------------------- |
| `PORT`                  | API server port                 | `5000`                                               |
| `DATABASE_URL`          | PostgreSQL connection string    | `postgresql://myuser:mypassword@localhost:5432/mydb` |
| `CORS_ORIGIN`           | Allowed CORS origin             | `http://localhost:5173`                              |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key           | —                                                    |
| `CLERK_SECRET_KEY`      | Clerk secret key                | —                                                    |
| `LOG_LEVEL`             | Pino log level                  | `info`                                               |
| `SEQ_URL`               | Seq logging URL (optional)      | —                                                    |
| `S3_ENDPOINT`           | S3-compatible storage endpoint  | `http://localhost:9000`                              |
| `S3_ACCESS_KEY_ID`      | S3 access key                   | `minioadmin`                                         |
| `S3_SECRET_ACCESS_KEY`  | S3 secret key                   | `minioadmin`                                         |
| `S3_BUCKET_NAME`        | S3 bucket for documents         | `rent-flow-documents`                                |
| `S3_FORCE_PATH_STYLE`   | Use path-style URLs (for MinIO) | `true`                                               |
| `S3_REGION`             | S3 region                       | `us-east-1`                                          |

**Frontend** (`apps/frontend/.env`):

| Variable                     | Description           | Default                 |
| ---------------------------- | --------------------- | ----------------------- |
| `VITE_API_BASE_URL`          | Backend API URL       | `http://localhost:5000` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | —                       |

### Database Setup

Start PostgreSQL via Docker:

```bash
npm run database:up
```

Generate and apply migrations:

```bash
npm run database:generate -w @node-monorepo/backend
npm run database:migrate -w @node-monorepo/backend
```

### Storage Setup

Start MinIO (S3-compatible storage) for document uploads:

```bash
npm run storage:up
```

MinIO Console is available at `http://localhost:9001` (credentials: `minioadmin`/`minioadmin`).

### Development

Run both backend and frontend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend only (http://localhost:5000)
npm run dev:backend

# Frontend only (http://localhost:5173)
npm run dev:frontend
```

### Build

```bash
npm run build
```

### Production (Docker)

```bash
docker-compose up
```

This starts PostgreSQL, MinIO (S3), runs migrations, and starts the API server. Seq is available for structured log viewing at `http://localhost:8080`.

## Available Scripts

| Script              | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `dev`               | Start both backend and frontend concurrently                  |
| `dev:backend`       | Start backend dev server                                      |
| `dev:frontend`      | Start frontend dev server                                     |
| `build`             | Build both apps                                               |
| `build:backend`     | Build backend                                                 |
| `build:frontend`    | Build frontend                                                |
| `start:backend`     | Start backend in production                                   |
| `preview:frontend`  | Preview frontend build                                        |
| `lint`              | Run ESLint                                                    |
| `lint:fix`          | Fix ESLint issues                                             |
| `format`            | Format code with Prettier                                     |
| `format:check`      | Check code formatting                                         |
| `lint:format`       | Fix lint + format in one step                                 |
| `commit`            | Interactive conventional commit                               |
| `database:up`       | Start PostgreSQL container                                    |
| `database:down`     | Stop and remove database container                            |
| `database:stop`     | Stop database container (without removing)                    |
| `database:generate` | Generate Drizzle migrations (use `-w @node-monorepo/backend`) |
| `database:migrate`  | Apply Drizzle migrations (use `-w @node-monorepo/backend`)    |
| `database:studio`   | Open Drizzle Studio (use `-w @node-monorepo/backend`)         |
| `storage:up`        | Start MinIO (S3) container                                    |
| `storage:down`      | Stop and remove MinIO container                               |
| `storage:stop`      | Stop MinIO container (without removing)                       |
| `seq:up`            | Start Seq logging service                                     |
| `test`              | Run backend tests (use `-w @node-monorepo/backend`)           |

## Tech Stack

### Backend

- **Framework**: [Hono](https://hono.dev) + @hono/node-server
- **Database**: PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- **Storage**: AWS SDK S3 + [MinIO](https://min.io) (S3-compatible, pre-signed URLs)
- **Validation**: [Zod](https://zod.dev) (v4) + custom zValidator wrapper
- **Auth**: [Clerk](https://clerk.com) (@hono/clerk-auth)
- **Error handling**: [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457) via http-problem-details
- **Logging**: Pino + pino-pretty + optional [Seq](https://datalust.co/seq)
- **Testing**: node:test + Hono testClient + @faker-js/faker

### Frontend

- **Framework**: [React 19](https://react.dev) + [Vite 7](https://vite.dev)
- **Routing**: [React Router v7](https://reactrouter.com)
- **Data fetching**: [TanStack React Query](https://tanstack.com/query) (useSuspenseQuery)
- **Forms**: [React Hook Form](https://react-hook-form.com) + zodResolver
- **UI**: [shadcn/ui](https://ui.shadcn.com) (New York style) + [Tailwind CSS v4](https://tailwindcss.com)
- **Maps**: [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) + leaflet-geosearch
- **Dates**: [date-fns](https://date-fns.org) + react-day-picker
- **Auth**: [Clerk React](https://clerk.com/docs/references/react/overview)
- **State**: [Zustand](https://zustand.docs.pmnd.rs) (client state)
- **Toasts**: [Sonner](https://sonner.emilkowal.dev)

### Tooling

- **Monorepo**: npm workspaces
- **Language**: TypeScript 5.9 (strict, verbatimModuleSyntax)
- **Linting**: ESLint 9 (flat config) + typescript-eslint
- **Formatting**: Prettier
- **Git Hooks**: Husky + commitlint
- **Containerization**: Docker + docker-compose

## Path Aliases

| Alias | Context  | Resolves to           | `.js` extension? |
| ----- | -------- | --------------------- | ---------------- |
| `#/*` | Backend  | `apps/backend/src/*`  | **Yes, always**  |
| `@/*` | Frontend | `apps/frontend/src/*` | No               |
| `#/*` | Frontend | `apps/backend/src/*`  | No               |

Backend uses `moduleResolution: "NodeNext"` — every import **must** end with `.js`. Frontend uses `moduleResolution: "bundler"` — never add `.js`.

```ts
// Backend
import { client } from '#/database/client.js';
import type { Property } from '#/features/properties/schemas.js';

// Frontend
import { Button } from '@/components/ui/button';
import type { Property } from '#/features/properties/schemas';
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) with enforced scopes:

```
<type>(<scope>): <subject>

# Examples:
feat(backend): add projects API endpoints
fix(frontend): correct pagination off-by-one error
chore(repo): update dependencies
```

**Allowed scopes**: `backend`, `frontend`, `repo`

**Allowed subject case**: `sentence-case` or `lower-case`

## Claude Code Skills

This project includes [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills that codify the project's coding patterns. When you use Claude Code in this repository, it automatically loads `CLAUDE.md` with the core conventions, and can use the skills below to generate consistent, pattern-compliant code.

### Available Skills

| Skill                    | Location                               | What it does                                                                                                                                                                                          |
| ------------------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **add-backend-feature**  | `.claude/skills/add-backend-feature/`  | Generates a complete backend API feature: Drizzle table, Zod schemas, CRUD endpoints (add, get, edit, list), route aggregator, and app registration                                                   |
| **add-frontend-feature** | `.claude/skills/add-frontend-feature/` | Generates a complete frontend feature: API client, React Query hooks, table/form/card components with skeletons and error states, CRUD pages with suspense boundaries, route and sidebar registration |
| **add-backend-tests**    | `.claude/skills/add-backend-tests/`    | Generates integration tests: DSL file with factory functions, overloaded action functions, fluent assertions, and test files for each endpoint                                                        |
| **add-db-schema**        | `.claude/skills/add-db-schema/`        | Guides database schema changes: new tables or column modifications, Zod schema sync, and migration commands                                                                                           |
| **review-code**          | `.claude/skills/review-code/`          | Reviews code for adherence to project conventions, common mistakes, and best practices in this Hono + React monorepo                                                                                  |

### Available Commands

| Command         | Location                          | What it does                                                                                                                                                      |
| --------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **add-feature** | `.claude/commands/add-feature.md` | End-to-end feature workflow: discovery, DB schema, backend API, test design, backend tests, frontend UI, and code review — all in a single guided 7-phase process |

The `add-feature` command orchestrates the individual skills into a complete workflow. Run it with:

```
/add-feature projects with name and description fields
```

It walks through these phases in order:

1. **Discovery** — determines if the feature is new or an extension, asks clarifying questions
2. **DB Schema** — creates/modifies the table and runs migrations (uses `add-db-schema` skill)
3. **Backend API** — creates Hono endpoints and route aggregator (uses `add-backend-feature` skill)
4. **Test Design** — presents planned test scenarios for user approval
5. **Backend Tests** — writes and runs integration tests (uses `add-backend-tests` skill)
6. **Frontend UI** — creates React pages, components, and stores (uses `add-frontend-feature` skill)
7. **Code Review** — verifies all files follow conventions (uses `review-code` skill)

Each phase has a gate condition that must pass before proceeding to the next.

### How to Use

1. **Install Claude Code** if you haven't already: https://docs.anthropic.com/en/docs/claude-code
2. **Open a terminal** in the repository root and run `claude`
3. **Use the command** to add a full feature end-to-end:

```
> /add-feature projects with name and description fields
```

4. Or **ask Claude directly** to use individual skills:

```
> Add a projects feature with name and description fields
> Add the frontend for the projects feature
> Add tests for the projects feature
> Add a status column to the projects table
```

Claude will read the relevant skill, follow the step-by-step checklist, and produce code that matches the established patterns exactly.

### What the Skills Enforce

The skills ensure every generated feature follows these non-obvious conventions:

- Each endpoint is a `new Hono()` sub-app, not a handler function
- Tables use `pgSchema('..._schema')`, not `pgTable()`
- Primary keys are UUIDv7 via `v7()` from `uuid`
- Validation uses a custom `zValidator` wrapper (not raw `@hono/zod-validator`)
- All errors are RFC 9457 Problem Details
- HTTP status codes use the `StatusCodes` enum, never raw numbers
- Frontend uses `useSuspenseQuery` (never `useQuery`) with triple-layer error boundaries
- Forms use `Controller` + `zodResolver` with a custom `Field` component (not shadcn FormField)
- Tests use `node:test` + `testClient(app)` with a DSL pattern for fluent assertions

## Debugging

VSCode debug configurations are included:

| Configuration        | Description                            |
| -------------------- | -------------------------------------- |
| **Debug Backend**    | Debug Node.js backend with source maps |
| **Debug Frontend**   | Debug React app in Chrome              |
| **Debug Full Stack** | Debug both simultaneously              |

### Debug Backend

1. Open Run and Debug panel (Ctrl+Shift+D)
2. Select "Debug Backend"
3. Press F5
4. Set breakpoints in `apps/backend/src/*.ts` files

### Debug Frontend

1. Start the frontend dev server first: `npm run dev:frontend`
2. Open Run and Debug panel (Ctrl+Shift+D)
3. Select "Debug Frontend"
4. Press F5 - Chrome will open
5. Set breakpoints in `apps/frontend/src/*.tsx` files

### Debug Full Stack

1. Open Run and Debug panel (Ctrl+Shift+D)
2. Select "Debug Full Stack"
3. Press F5 - starts both debuggers

## TypeScript Configuration

All TypeScript configurations extend from `tsconfig.base.json`:

```
tsconfig.base.json                    # Shared: strict, verbatimModuleSyntax, ESM
├── tsconfig.json                     # Root config files
├── apps/backend/tsconfig.json        # NodeNext module, Hono JSX
└── apps/frontend/
    ├── tsconfig.app.json             # Bundler resolution, React JSX, DOM types
    └── tsconfig.node.json            # Vite config (Node.js)
```

## License

MIT
