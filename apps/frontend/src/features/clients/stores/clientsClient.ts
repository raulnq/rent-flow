import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddClient,
  EditClient,
  Client,
  ListClients,
} from '#/features/clients/schemas';

export async function listClients(
  params?: ListClients,
  token?: string | null
): Promise<Page<Client>> {
  const response = await client.api.clients.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        name: params?.name,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch clients');
  }
  return response.json();
}

export async function getClient(
  clientId: string,
  token?: string | null
): Promise<Client> {
  const response = await client.api.clients[':clientId'].$get(
    { param: { clientId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch client');
  }
  return response.json();
}

export async function addClient(
  data: AddClient,
  token?: string | null
): Promise<Client> {
  const response = await client.api.clients.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add client');
  }
  return response.json();
}

export async function editClient(
  clientId: string,
  data: EditClient,
  token?: string | null
): Promise<Client> {
  const response = await client.api.clients[':clientId'].$put(
    {
      param: { clientId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update client');
  }
  return response.json();
}
