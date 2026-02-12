---
name: add-frontend-feature
description: |
  Create frontend pages and components for a feature using React 19, React Router,
  TanStack React Query, and shadcn/ui. Triggers: "add the frontend for projects,"
  "create pages for managing companies," "add UI for notes."
---

# Add Frontend Feature

Use this skill when adding frontend pages and components for a feature in the React frontend.

## Step 0 — Read references

Read the infrastructure files to understand the current app structure:

- `apps/frontend/src/routes.tsx` — route registration
- `apps/frontend/src/components/layout/AppSidebar.tsx` — `NAV_ITEMS` array
- `apps/frontend/src/components/layout/AppHeader.tsx` — `TITLE_BY_PATH` map
- `apps/frontend/src/client.ts` — Hono type-safe client
- `apps/frontend/src/components/ui/field.tsx` — custom Field component
- `apps/frontend/src/components/Pagination.tsx` — pagination component

Then read the code templates (these are the canonical patterns — follow them exactly):

- `.claude/skills/add-frontend-feature/stores-templates.md` — API client + React Query hooks
- `.claude/skills/add-frontend-feature/components-templates.md` — all 6 components
- `.claude/skills/add-frontend-feature/pages-templates.md` — all 4 pages

## Step 1 — Create feature directory

```
apps/frontend/src/features/<entities>/
  components/
  pages/
  stores/
```

## Step 2 — Create stores layer

Follow templates in `stores-templates.md`:

1. **`stores/<entities>Client.ts`** — raw API functions (list, get, add, edit). Each takes `token?: string | null`, uses Hono type-safe client, checks `response.ok`.
2. **`stores/use<Entities>.ts`** — React Query hooks. `useSuspenseQuery` for reads, `useMutation` for writes. Pagination from URL search params. Mutations invalidate list + `setQueryData` for single entity.

## Step 3 — Create components

Follow templates in `components-templates.md`:

1. **`<Entity>Header.tsx`** — back button + title + description + optional `children` action slot
2. **`<Entity>Search.tsx`** — ref-based input, URL search params, clear button
3. **`<Entity>Table.tsx`** — exports `<Entity>Table` + `<Entities>Skeleton` + `<Entities>Error`. Table with row links, view/edit icon buttons, `Pagination` at bottom
4. **`Add<Entity>Form.tsx`** — Card layout, `useForm` + `zodResolver`, `Controller` fields, `form id="form"` + submit button with `form="form"`
5. **`Edit<Entity>Form.tsx`** — same as Add but with `defaultValues: entity`. Also exports Skeleton and Error
6. **`View<Entity>Card.tsx`** — read-only Card with labeled fields. Also exports Skeleton and Error

## Step 4 — Create pages

Follow templates in `pages-templates.md`:

1. **`List<Entity>Page.tsx`** — header with title + "Add" button, Card wrapping search + triple-layer table (`QueryErrorResetBoundary` > `ErrorBoundary` > `Suspense`)
2. **`Add<Entity>Page.tsx`** — mutation hook, `toast.success` + navigate on success, `toast.error` on failure
3. **`Edit<Entity>Page.tsx`** — **inner component pattern**: page handles layout + error boundary, inner component calls `use<Entity>Suspense`
4. **`View<Entity>Page.tsx`** — same inner component pattern, Header includes Edit button via `children`

## Step 5 — Register routes

File: `apps/frontend/src/routes.tsx` — add route group under root layout children:

```tsx
{
  path: '<entities>',
  children: [
    { index: true, element: <List<Entity>Page /> },
    { path: 'new', element: <Add<Entity>Page /> },
    { path: ':<entityId>', element: <View<Entity>Page /> },
    { path: ':<entityId>/edit', element: <Edit<Entity>Page /> },
  ],
},
```

## Step 6 — Add sidebar entry

File: `apps/frontend/src/components/layout/AppSidebar.tsx` — add to `NAV_ITEMS`:

```ts
{ title: '<Entities>', to: '/<entities>', icon: SomeIcon },
```

## Step 7 — Add header title

File: `apps/frontend/src/components/layout/AppHeader.tsx` — add to `TITLE_BY_PATH`:

```ts
'/<entities>': '<Entities>',
```

## Checklist

- [ ] `stores/<entities>Client.ts` — raw API functions (list, get, add, edit)
- [ ] `stores/use<Entities>.ts` — React Query hooks (suspense queries + mutations)
- [ ] `components/<Entity>Header.tsx` — header with back button + children slot
- [ ] `components/<Entity>Search.tsx` — ref-based search form (or multi-field search)
- [ ] `components/<Entity>Table.tsx` — table + skeleton + error + pagination
- [ ] `components/Add<Entity>Form.tsx` — Card form with Controller fields
- [ ] `components/Edit<Entity>Form.tsx` — Card form + skeleton + error
- [ ] `components/View<Entity>Card.tsx` — read-only card with Field/FieldLabel/Input + skeleton + error
- [ ] `pages/List<Entity>Page.tsx` — list with search + triple-layer table
- [ ] `pages/Add<Entity>Page.tsx` — add with mutation + toast
- [ ] `pages/Edit<Entity>Page.tsx` — edit with inner component pattern
- [ ] `pages/View<Entity>Page.tsx` — view with inner component + edit button
- [ ] `routes.tsx` — routes registered
- [ ] `AppSidebar.tsx` — nav item added
- [ ] `AppHeader.tsx` — title added

### Optional (when applicable)

- [ ] `components/<Entity>Combobox.tsx` — searchable combobox (if entity is referenced as FK in other features)
- [ ] `stores/use<Entities>.ts` — `use<Entities>()` non-Suspense hook for combobox search
- [ ] `components/<Action>Button.tsx` — action button with dialog (for state transitions)
- [ ] `stores/use<Entities>.ts` — action mutation hooks (e.g., `useApprove<Entity>`)
- [ ] Status `Badge` with variants in table (for entities with workflow states)

## Critical rules

- **`useSuspenseQuery`** for page data fetching — `useQuery` only for combobox search hooks (with `enabled` prop)
- **`Controller` + `zodResolver`** — never `register()` for forms
- **`Field`, `FieldLabel`, `FieldError`** from `@/components/ui/field` — not shadcn `FormField`
- **Triple-layer wrapper**: `QueryErrorResetBoundary` > `ErrorBoundary` > `Suspense`
- **Inner component pattern** for pages that fetch by ID (View, Edit)
- **`@/` alias** for frontend src imports, **`#/`** alias for backend type imports
- **No `.js` extensions** on frontend imports (bundler resolution)
- **Named exports only** — no default exports (except `App.tsx`)
- **`import type`** for type-only imports
- **Clerk `getToken()`** passed to every API call
- **URL search params** for pagination (not component state)
- **`toast` from `sonner`** for success/error notifications
- **Card layout** for forms: `Card > CardHeader > CardContent > form > CardFooter`
- **`form id="form"`** + **`form="form"` on submit button** (button outside form element)
