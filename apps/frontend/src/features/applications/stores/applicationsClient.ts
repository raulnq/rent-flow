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
} from '#/features/applications/schemas';

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
  return response.json() as unknown as Page<Application>;
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
  return response.json() as unknown as Application;
}

export async function addApplication(
  data: AddApplication,
  token?: string | null
): Promise<Application> {
  const response = await client.api.applications.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add application');
  }
  return response.json() as unknown as Application;
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
  return response.json() as unknown as Application;
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
  return response.json() as unknown as Application;
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
  return response.json() as unknown as Application;
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
  return response.json() as unknown as Application;
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
  return response.json() as unknown as Application;
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
  return response.json() as unknown as Application;
}
