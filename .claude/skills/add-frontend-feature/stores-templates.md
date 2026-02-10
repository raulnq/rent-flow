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
import { useSearchParams } from 'react-router';
import type { Add<Entity>, Edit<Entity>, List<Entities> } from '#/features/<entities>/schemas';

export function use<Entities>Suspense({
  pageNumber,
  pageSize,
  // ...filter params
}: Partial<List<Entities>> = {}) {
  const { getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = Math.max(1, Math.floor(Number(queryPage)) || 1);
  const params = {
    pageNumber: pageNumber ?? currentPage,
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
