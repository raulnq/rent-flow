import { client } from '../../../client';
import type { Page } from '#/pagination';
import type {
  AddProperty,
  EditProperty,
  Property,
  ListProperties,
} from '#/features/properties/schemas';
import type { Property as DBProperty } from '#/features/properties/property';

export async function listProperties(
  params?: ListProperties,
  token?: string | null
): Promise<Page<Property>> {
  const response = await client.api.properties.$get(
    {
      query: {
        pageNumber: params?.pageNumber?.toString(),
        pageSize: params?.pageSize?.toString(),
        address: params?.address,
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch properties');
  }
  return response.json();
}

export async function getProperty(
  propertyId: string,
  token?: string | null
): Promise<Property> {
  const response = await client.api.properties[':propertyId'].$get(
    { param: { propertyId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch property');
  }
  return response.json();
}

export async function addProperty(
  data: AddProperty,
  token?: string | null
): Promise<DBProperty> {
  const response = await client.api.properties.$post(
    { json: data },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to add property');
  }
  return response.json();
}

export async function editProperty(
  propertyId: string,
  data: EditProperty,
  token?: string | null
): Promise<DBProperty> {
  const response = await client.api.properties[':propertyId'].$put(
    {
      param: { propertyId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update property');
  }
  return response.json();
}
