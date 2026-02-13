import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddVisit,
  EditVisit,
  Visit,
  ListVisits,
  CancelVisit,
} from '#/features/visits/schemas';

export async function listVisits(
  applicationId: string,
  params?: ListVisits,
  token?: string | null
): Promise<Page<Visit>> {
  const response = await client.api.applications[':applicationId'].visits.$get(
    {
      param: { applicationId },
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch visits');
  }
  const page = await response.json();
  return {
    ...page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: page.items.map((item: any) => ({
      ...item,
      scheduledAt: new Date(item.scheduledAt),
      createdAt: new Date(item.createdAt),
    })),
  };
}

export async function addVisit(
  applicationId: string,
  data: AddVisit,
  token?: string | null
): Promise<Visit> {
  const response = await client.api.applications[':applicationId'].visits.$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add visit');
  }
  const visit = await response.json();
  return {
    ...visit,
    scheduledAt: new Date(visit.scheduledAt),
    createdAt: new Date(visit.createdAt),
  };
}

export async function editVisit(
  applicationId: string,
  visitId: string,
  data: EditVisit,
  token?: string | null
): Promise<Visit> {
  const response = await client.api.applications[':applicationId'].visits[
    ':visitId'
  ].$put(
    {
      param: { applicationId, visitId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update visit');
  }
  const visit = await response.json();
  return {
    ...visit,
    scheduledAt: new Date(visit.scheduledAt),
    createdAt: new Date(visit.createdAt),
  };
}

export async function completeVisit(
  applicationId: string,
  visitId: string,
  token?: string | null
): Promise<Visit> {
  const response = await client.api.applications[':applicationId'].visits[
    ':visitId'
  ].complete.$post(
    {
      param: { applicationId, visitId },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to complete visit');
  }
  const visit = await response.json();
  return {
    ...visit,
    scheduledAt: new Date(visit.scheduledAt),
    createdAt: new Date(visit.createdAt),
  };
}

export async function cancelVisit(
  applicationId: string,
  visitId: string,
  data: CancelVisit,
  token?: string | null
): Promise<Visit> {
  const response = await client.api.applications[':applicationId'].visits[
    ':visitId'
  ].cancel.$post(
    {
      param: { applicationId, visitId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to cancel visit');
  }
  const visit = await response.json();
  return {
    ...visit,
    scheduledAt: new Date(visit.scheduledAt),
    createdAt: new Date(visit.createdAt),
  };
}

export async function noAttendVisit(
  applicationId: string,
  visitId: string,
  token?: string | null
): Promise<Visit> {
  const response = await client.api.applications[':applicationId'].visits[
    ':visitId'
  ]['no-attend'].$post(
    {
      param: { applicationId, visitId },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to mark visit as no attend');
  }
  const visit = await response.json();
  return {
    ...visit,
    scheduledAt: new Date(visit.scheduledAt),
    createdAt: new Date(visit.createdAt),
  };
}
