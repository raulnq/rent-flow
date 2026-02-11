import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddLead,
  EditLead,
  Lead,
  ListLeads,
} from '#/features/leads/schemas';

export async function listLeads(
  params?: ListLeads,
  token?: string | null
): Promise<Page<Lead>> {
  const response = await client.api.leads.$get(
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
    throw new Error(error.detail || 'Failed to fetch leads');
  }
  return response.json();
}

export async function getLead(
  leadId: string,
  token?: string | null
): Promise<Lead> {
  const response = await client.api.leads[':leadId'].$get(
    { param: { leadId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch lead');
  }
  return response.json();
}

export async function addLead(
  data: AddLead,
  token?: string | null
): Promise<Lead> {
  const response = await client.api.leads.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add lead');
  }
  return response.json();
}

export async function editLead(
  leadId: string,
  data: EditLead,
  token?: string | null
): Promise<Lead> {
  const response = await client.api.leads[':leadId'].$put(
    {
      param: { leadId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update lead');
  }
  return response.json();
}
