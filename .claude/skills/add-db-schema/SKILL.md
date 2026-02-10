---
name: add-db-schema
description: |
  Create or modify database tables and run Drizzle migrations. Triggers: "add a
  column," "create a new table," "modify the database schema," "run migrations."
---

# Add / Modify Database Schema

Use this skill for any database schema changes: new tables, new columns, column modifications, or running migrations.

## Step 0 — Read infrastructure files

Before making changes, read these files to understand the current DB setup:

- `apps/backend/src/database/schemas.ts` — re-export registry (see existing table exports)
- `apps/backend/src/database/client.ts` — Drizzle client setup
- `apps/backend/drizzle.config.ts` — migration config (check `migrations.schema` value)

The code templates below are the canonical patterns for table definitions — follow them exactly.

## Decision tree

### Creating a new table?

→ Go to **Path A: New Table**

### Adding/modifying columns on an existing table?

→ Go to **Path B: Modify Table**

### Just need to run migrations?

→ Go to **Step: Run Migrations**

---

## Path A: New Table

### A1. Create table definition

File: `apps/backend/src/features/<entities>/<entity>.ts`

```ts
import { varchar, pgSchema, uuid, boolean } from 'drizzle-orm/pg-core';

const dbSchema = pgSchema('<schema>');

export const <entities> = dbSchema.table('<entities>', {
  <entityId>: uuid('<entityId>').primaryKey(),
  name: varchar('name', { length: 1024 }).notNull(),
  // ... other columns
});
```

Key rules:

- **`pgSchema('<schema>')`** — The schema is the same in `migrations.schema`(`apps/backend/drizzle.config.ts`). Do NOT use `pgTable()` (which defaults to `public` schema).
- **UUID primary key**: `uuid('<entityId>').primaryKey()` — no `.defaultRandom()`
- **`varchar` with explicit length**: always specify `{ length: N }`
- **`.notNull()`** on all required columns
- Column name in quotes must match the property name exactly

### A2. Re-export from schema registry

File: `apps/backend/src/database/schemas.ts`

Add:

```ts
export { <entities> } from '#/features/<entities>/<entity>.js';
```

This is **required** — Drizzle Kit reads `schemas.ts` to discover all tables for migration generation.

### A3. Create Zod schemas

File: `apps/backend/src/features/<entities>/schemas.ts`

Zod schemas must stay in sync with the Drizzle table:

```ts
import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

export const <entity>Schema = z.object({
  <entityId>: z.uuidv7(),
  name: z.string().min(1).max(1024),
  // mirror every column
});

export type <Entity> = z.infer<typeof <entity>Schema>;

// Add, Edit, List schemas derived from base...
```

### A4. Run migrations

See **Step: Run Migrations** below.

---

## Path B: Modify Table

### B1. Edit the table definition

Modify the existing file in `apps/backend/src/features/<entities>/<entity>.ts`:

- Adding a column: add the new property to the table object
- Changing a column: update the type/constraints
- Removing a column: remove the property

### B2. Update Zod schemas

File: `apps/backend/src/features/<entities>/schemas.ts`

Keep Zod schemas in sync with the Drizzle table. Update:

- Base entity schema (add/remove/modify field)
- Add schema (if new field should be in creation payload)
- Edit schema (if new field should be editable)
- List schema (if new field should be a filter)

### B3. Update endpoints if needed

If a new column needs to be handled in endpoints (e.g., set defaults in add, include in edit), update the relevant endpoint files.

### B4. Run migrations

See **Step: Run Migrations** below.

---

## Step: Run Migrations

### Generate migration

```bash
npm run database:generate -w @node-monorepo/backend
```

This runs `drizzle-kit generate` which reads `drizzle.config.ts` → `schemas.ts` → all table definitions and produces SQL migration files in `apps/backend/src/database/migrations/`.

### Apply migration

```bash
npm run database:migrate -w @node-monorepo/backend
```

This runs `drizzle-kit migrate` which applies pending migrations to the database.

### Verify with Drizzle Studio (optional)

```bash
npm run database:studio -w @node-monorepo/backend
```

---

## Column type quick reference

```ts
import {
  varchar,
  uuid,
  boolean,
  integer,
  timestamp,
  text,
  pgSchema,
} from 'drizzle-orm/pg-core';

// Common column patterns:
uuid('columnId').primaryKey(); // UUID primary key
varchar('name', { length: 1024 }).notNull(); // Required string
varchar('description', { length: 4096 }); // Optional string
boolean('active').notNull(); // Required boolean
integer('quantity').notNull(); // Required integer
timestamp('createdAt').notNull(); // Required timestamp
text('content').notNull(); // Unlimited text
```

## Checklist

- [ ] Table definition created/updated in feature directory
- [ ] Re-exported from `apps/backend/src/database/schemas.ts`
- [ ] `drizzle.config.ts` updated if new schema name
- [ ] Zod schemas updated to match table changes
- [ ] Endpoints updated if column affects request/response
- [ ] Migration generated: `npm run database:generate -w @node-monorepo/backend`
- [ ] Migration applied: `npm run database:migrate -w @node-monorepo/backend`

## Critical rules

- **`pgSchema('...')`** — never `pgTable()` (avoids public schema)
- **No `.defaultRandom()`** on UUIDs — app generates UUIDv7 via `v7()` from `uuid`
- **`.js` extension** on all imports
- **Re-export required** in `database/schemas.ts` for Drizzle Kit discovery
- **Zod schemas must stay in sync** with Drizzle table after every change
