import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddApplication,
  EditApplication,
  Application,
  ListApplications,
  RejectApplication,
  WithdrawApplication,
  StartReviewApplication,
  ApproveApplication,
  SignContractApplication,
  ReserveApplication,
} from '#/features/applications/schemas';
import type { Application as DBApplication } from '#/features/applications/application';

export async function listApplications(
  params?: ListApplications,
  token?: string | null
): Promise<Page<Application>> {
  const response = await client.api.applications.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        propertyId: params?.propertyId,
        leadId: params?.leadId,
        startCreatedAt: params?.startCreatedAt,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch applications');
  }
  const result = await response.json();
  return {
    ...result,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: result.items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    })),
  };
}

export async function getApplication(
  applicationId: string,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[':applicationId'].$get(
    { param: { applicationId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch application');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function addApplication(
  data: AddApplication,
  token?: string | null
): Promise<DBApplication> {
  const response = await client.api.applications.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add application');
  }

  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function editApplication(
  applicationId: string,
  data: EditApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[':applicationId'].$put(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update application');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function startReview(
  applicationId: string,
  data: StartReviewApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[':applicationId'][
    'start-review'
  ].$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to start review');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function approve(
  applicationId: string,
  data: ApproveApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[
    ':applicationId'
  ].approve.$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to approve application');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function reject(
  applicationId: string,
  data: RejectApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[':applicationId'].reject.$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to reject application');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function withdraw(
  applicationId: string,
  data: WithdrawApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[
    ':applicationId'
  ].withdraw.$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to withdraw application');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function signContract(
  applicationId: string,
  data: SignContractApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[':applicationId'][
    'sign-contract'
  ].$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to sign contract');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}

export async function reserve(
  applicationId: string,
  data: ReserveApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications[
    ':applicationId'
  ].reserve.$post(
    {
      param: { applicationId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to reserve application');
  }
  const result = await response.json();
  return {
    ...result,
    createdAt: new Date(result.createdAt),
  };
}
