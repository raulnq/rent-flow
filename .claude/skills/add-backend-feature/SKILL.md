---
name: add-backend-feature
description: |
  Create a new backend API feature with CRUD endpoints following the established
  Hono sub-app pattern. Triggers: "add a projects feature," "create API endpoints
  for companies," "add a new entity," "add backend for X."
---

# Add Backend Feature

Use this skill when adding a new API feature (entity with CRUD endpoints) to the Hono backend.

## Step 0 — Read infrastructure files

Before writing any code, read these files to understand the current app structure:

- `apps/backend/src/app.ts` — route registration (see where to add your new route)
- `apps/backend/src/database/schemas.ts` — schema re-exports (see existing entries)
- `apps/backend/src/extensions.ts` — error helpers (RFC 9457 Problem Details)
- `apps/backend/src/validator.ts` — custom `zValidator` wrapper
- `apps/backend/src/pagination.ts` — `Page` type, `createPage`, `paginationSchema`
- `apps/backend/drizzle.config.ts` — migration config (check `migrations.schema`)

The code templates below are the canonical patterns — follow them exactly.

## Step 1 — Create feature directory

```
apps/backend/src/features/<entities>/
```

Use the **plural** form (e.g., `projects`, `companies`, `notes`).

## Step 2 — Create the Drizzle table (`<entity>.ts`)

File: `apps/backend/src/features/<entities>/<entity>.ts`

Key rules:

- Import `pgSchema` from `drizzle-orm/pg-core` and create a schema constant:
  ```ts
  const dbSchema = pgSchema('<entities>_schema');
  ```
- Define the table with `dbSchema.table('<entities>', { ... })`
- Use `uuid('<entityId>').primaryKey()` — no `.defaultRandom()`
- Use `varchar('column', { length: N }).notNull()` with explicit length
- Use `.notNull()` on all required columns
- Export the table constant

## Step 3 — Re-export from schemas registry

File: `apps/backend/src/database/schemas.ts`

Add a re-export line:

```ts
export { <entities> } from '#/features/<entities>/<entity>.js';
```

This is required for Drizzle Kit migration discovery.

## Step 4 — Create Zod schemas (`schemas.ts`)

File: `apps/backend/src/features/<entities>/schemas.ts`

Pattern:

```ts
import { paginationSchema } from '#/pagination.js';
import { z } from 'zod';

// Base entity schema — mirrors every column in the Drizzle table
export const <entity>Schema = z.object({
  <entityId>: z.uuidv7(),
  name: z.string().min(1).max(1024),
  // ... other fields
});

export type <Entity> = z.infer<typeof <entity>Schema>;

// Add schema — omit server-generated fields
export const add<Entity>Schema = <entity>Schema.omit({ <entityId>: true });
export type Add<Entity> = z.infer<typeof add<Entity>Schema>;

// Edit schema — pick only editable fields
export const edit<Entity>Schema = <entity>Schema.pick({ name: true /* ... */ });
export type Edit<Entity> = z.infer<typeof edit<Entity>Schema>;

// List schema — extend paginationSchema with optional filters
export const list<Entities>Schema = paginationSchema.extend({
  name: z.string().optional(),
});
export type List<Entities> = z.infer<typeof list<Entities>Schema>;
```

## Step 5 — Create endpoint files

Each endpoint is a **separate file** exporting a `new Hono()` sub-app (NOT a handler function).

### `add-<entity>.ts`

```ts
import { Hono } from 'hono';
import { v7 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { add<Entity>Schema } from './schemas.js';

export const addRoute = new Hono().post(
  '/',
  zValidator('json', add<Entity>Schema),
  async c => {
    const data = c.req.valid('json');
    const [item] = await client
      .insert(<entities>)
      .values({ ...data, <entityId>: v7() })
      .returning();
    return c.json(item, StatusCodes.CREATED);
  }
);
```

### `get-<entity>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const schema = <entity>Schema.pick({ <entityId>: true });

export const getRoute = new Hono().get(
  '/:<entityId>',
  zValidator('param', schema),
  async c => {
    const { <entityId> } = c.req.valid('param');
    const [item] = await client
      .select()
      .from(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>))
      .limit(1);
    if (!item) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }
    return c.json(item, StatusCodes.OK);
  }
);
```

### `edit-<entity>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq } from 'drizzle-orm';
import { edit<Entity>Schema, <entity>Schema } from './schemas.js';
import { notFoundError } from '#/extensions.js';

const paramSchema = <entity>Schema.pick({ <entityId>: true });

export const editRoute = new Hono().put(
  '/:<entityId>',
  zValidator('param', paramSchema),
  zValidator('json', edit<Entity>Schema),
  async c => {
    const { <entityId> } = c.req.valid('param');
    const data = c.req.valid('json');
    const existing = await client
      .select()
      .from(<entities>)
      .where(eq(<entities>.<entityId>, <entityId>))
      .limit(1);
    if (existing.length === 0) {
      return notFoundError(c, `<Entity> ${<entityId>} not found`);
    }
    const [item] = await client
      .update(<entities>)
      .set(data)
      .where(eq(<entities>.<entityId>, <entityId>))
      .returning();
    return c.json(item, StatusCodes.OK);
  }
);
```

### `list-<entities>.ts`

```ts
import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { <entities> } from './<entity>.js';
import { createPage } from '#/pagination.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { like, count, SQL, and } from 'drizzle-orm';
import { list<Entities>Schema } from './schemas.js';

export const listRoute = new Hono().get(
  '/',
  zValidator('query', list<Entities>Schema),
  async c => {
    const { pageNumber, pageSize, name } = c.req.valid('query');
    const filters: SQL[] = [];
    const offset = (pageNumber - 1) * pageSize;
    if (name) filters.push(like(<entities>.name, `%${name}%`));

    const [{ totalCount }] = await client
      .select({ totalCount: count() })
      .from(<entities>)
      .where(and(...filters));

    const items = await client
      .select()
      .from(<entities>)
      .where(and(...filters))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      createPage(items, totalCount, pageNumber, pageSize),
      StatusCodes.OK
    );
  }
);
```

## Step 6 — Create the route aggregator (`routes.ts`)

File: `apps/backend/src/features/<entities>/routes.ts`

```ts
import { Hono } from 'hono';
import { listRoute } from './list-<entities>.js';
import { addRoute } from './add-<entity>.js';
import { getRoute } from './get-<entity>.js';
import { editRoute } from './edit-<entity>.js';

export const <entity>Route = new Hono()
  .basePath('/<entities>')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
```

## Step 7 — Register the route in the app

File: `apps/backend/src/app.ts`

1. Import the route:
   ```ts
   import { <entity>Route } from './features/<entities>/routes.js';
   ```
2. Chain it onto the app:
   ```ts
   .route('/api', <entity>Route)
   ```

## Checklist

- [ ] `apps/backend/src/features/<entities>/<entity>.ts` — Drizzle table
- [ ] `apps/backend/src/database/schemas.ts` — re-export added
- [ ] `apps/backend/src/features/<entities>/schemas.ts` — Zod schemas
- [ ] `apps/backend/src/features/<entities>/add-<entity>.ts` — POST endpoint
- [ ] `apps/backend/src/features/<entities>/get-<entity>.ts` — GET /:id endpoint
- [ ] `apps/backend/src/features/<entities>/edit-<entity>.ts` — PUT /:id endpoint
- [ ] `apps/backend/src/features/<entities>/list-<entities>.ts` — GET / endpoint
- [ ] `apps/backend/src/features/<entities>/routes.ts` — route aggregator
- [ ] `apps/backend/src/app.ts` — route registered

## Critical rules

- **All imports use `.js` extension** (NodeNext module resolution)
- **Use `#/` alias** for `./src/` imports (e.g., `#/validator.js`, `#/database/client.js`)
- **`zValidator`** from `#/validator.js` (NOT from `@hono/zod-validator` directly)
- **`StatusCodes` enum** from `http-status-codes` (never raw numbers like `200`, `404`)
- **Error helpers** from `#/extensions.js` (`notFoundError`, `validationError`, etc.)
- **UUIDv7** via `v7()` from `uuid` package for primary keys
- **Named exports only** — no default exports
- **`import type`** for type-only imports (`verbatimModuleSyntax: true`)
