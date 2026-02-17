# Stores Templates

## API Client (`stores/<entities>Client.ts`)

Every function takes `token?: string | null`, passes it as Bearer header, checks `response.ok`.

```ts
import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  Add<Entity>,
  Edit<Entity>,
  <Entity>,
  List<Entities>,
} from '#/features/<entities>/schemas';

export async function list<Entities>(
  params?: List<Entities>,
  token?: string | null
): Promise<Page<<Entity>>> {
  const response = await client.api.<entities>.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        // add filter query params as needed
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch <entities>');
  }
  return response.json();
}

export async function get<Entity>(
  <entityId>: string,
  token?: string | null
): Promise<<Entity>> {
  const response = await client.api.<entities>[':<entityId>'].$get(
    { param: { <entityId> } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch <entity>');
  }
  return response.json();
}

export async function add<Entity>(
  data: Add<Entity>,
  token?: string | null
): Promise<<Entity>> {
  const response = await client.api.<entities>.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add <entity>');
  }
  return response.json();
}

export async function edit<Entity>(
  <entityId>: string,
  data: Edit<Entity>,
  token?: string | null
): Promise<<Entity>> {
  const response = await client.api.<entities>[':<entityId>'].$put(
    {
      param: { <entityId> },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update <entity>');
  }
  return response.json();
}
```

## React Query Hooks (`stores/use<Entities>.ts`)

```ts
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { list<Entities>, get<Entity>, add<Entity>, edit<Entity> } from './<entities>Client';
import { useAuth } from '@clerk/clerk-react';
import type { Add<Entity>, Edit<Entity>, List<Entities> } from '#/features/<entities>/schemas';

export function use<Entities>Suspense({
  pageNumber,
  pageSize,
  // ...filter params
}: Partial<List<Entities>> = {}) {
  const { getToken } = useAuth();
  const params = {
    pageNumber: pageNumber ?? 1,
    pageSize: pageSize ?? 10,
  };
  return useSuspenseQuery({
    queryKey: ['<entities>', params],
    queryFn: async () => {
      const token = await getToken();
      return list<Entities>(params, token);
    },
  });
}

export function use<Entity>Suspense(<entityId>: string) {
  const { getToken } = useAuth();
  return useSuspenseQuery({
    queryKey: ['<entity>', <entityId>],
    queryFn: async () => {
      const token = await getToken();
      return get<Entity>(<entityId>, token);
    },
  });
}

export function useAdd<Entity>() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: Add<Entity>) => {
      const token = await getToken();
      return add<Entity>(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['<entities>'] });
    },
  });
}

export function useEdit<Entity>(<entityId>: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: Edit<Entity>) => {
      const token = await getToken();
      return edit<Entity>(<entityId>, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['<entities>'] });
      queryClient.setQueryData(['<entity>', <entityId>], data);
    },
  });
}
```

## Combobox Search Hook (non-Suspense)

When a feature has a searchable combobox (used in other features' forms to select a related entity), add a `useQuery` hook (NOT `useSuspenseQuery`). This is the **only** case where `useQuery` is used instead of `useSuspenseQuery`.

Add this to `stores/use<Entities>.ts`:

```ts
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

export function use<Entities>({
  name,
  enabled,
  pageNumber = 1,
  pageSize = 10,
}: {
  name?: string;
  enabled: boolean;
  pageNumber?: number;
  pageSize?: number;
}) {
  const { getToken } = useAuth();
  const params = { name, pageNumber, pageSize };
  return useQuery({
    queryKey: ['<entities>', 'search', params],
    queryFn: async () => {
      const token = await getToken();
      return list<Entities>(params, token);
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
```

Key differences from `useSuspenseQuery`:

- Uses `useQuery` (does NOT suspend — returns `isLoading`, `isError`, `data`)
- Has `enabled` prop to control when the query runs (e.g., only when popover is open)
- Uses `placeholderData: keepPreviousData` to keep previous results while fetching
- Query key includes `'search'` to avoid cache collisions with list page queries

## Action Mutation Hooks (state transitions)

When a feature has state transitions (e.g., approve, reject, withdraw), add mutation hooks for each action. Add the API client function and corresponding hook.

In `stores/<entities>Client.ts`:

```ts
export async function approve<Entity>(
  <entityId>: string,
  data: Approve<Entity>,
  token?: string | null
): Promise<<Entity>> {
  const response = await client.api.<entities>[':<entityId>'].approve.$post(
    { param: { <entityId> }, json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to approve <entity>');
  }
  return response.json();
}
```

In `stores/use<Entities>.ts`:

```ts
export function useApprove<Entity>(<entityId>: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: async (data: Approve<Entity>) => {
      const token = await getToken();
      return approve<Entity>(<entityId>, data, token);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['<entities>'] });
      queryClient.setQueryData(['<entity>', <entityId>], data);
    },
  });
}
```
