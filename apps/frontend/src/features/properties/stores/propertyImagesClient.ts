import { client } from '../../../client';
import type { PropertyImage } from '#/features/properties/schemas';

export type PropertyImageItem = Pick<
  PropertyImage,
  'propertyImageId' | 'imageName' | 'contentType' | 'imagePath' | 'propertyId'
> & { createdAt: Date };

export async function listPropertyImages(
  propertyId: string,
  token?: string | null
): Promise<PropertyImageItem[]> {
  const response = await client.api.properties[':propertyId'].images.$get(
    { param: { propertyId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to fetch images'
    );
  }
  const items = await response.json();
  return items.map(item => ({ ...item, createdAt: new Date(item.createdAt) }));
}

export async function addPropertyImage(
  propertyId: string,
  file: File,
  token?: string | null
): Promise<PropertyImageItem> {
  const response = await client.api.properties[':propertyId'].images.$post(
    { param: { propertyId }, form: { file } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to upload image'
    );
  }
  const item = await response.json();
  return { ...item, createdAt: new Date(item.createdAt) };
}

export async function deletePropertyImage(
  propertyId: string,
  propertyImageId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.properties[':propertyId'].images[
    ':propertyImageId'
  ].$delete(
    { param: { propertyId, propertyImageId } },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      (error as { detail?: string }).detail || 'Failed to delete image'
    );
  }
}
