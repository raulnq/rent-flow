import { client } from '@/client';
import type { Page } from '#/pagination';
import type {
  ApplicationDocument,
  EditApplicationDocument,
  DownloadUrl,
} from '#/features/application-documents/schemas';

export async function listApplicationDocuments(
  applicationId: string,
  pageNumber: number,
  pageSize: number,
  token?: string | null
): Promise<Page<ApplicationDocument>> {
  const response = await client.api.applications[
    ':applicationId'
  ].documents.$get(
    {
      param: { applicationId },
      query: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch documents');
  }
  const data = await response.json();
  return {
    ...data,
    items: data.items.map(
      (item: {
        applicationDocumentId: string;
        applicationId: string;
        fileName: string;
        contentType: string;
        filePath: string;
        documentType: string;
        notes: string | null;
        createdAt: string;
      }) => ({
        ...item,
        documentType: item.documentType as ApplicationDocument['documentType'],
        createdAt: new Date(item.createdAt),
      })
    ),
  };
}

export async function addApplicationDocument(
  applicationId: string,
  documentType: string,
  file: File,
  token?: string | null
): Promise<ApplicationDocument> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const url = `${API_BASE_URL}/api/applications/${applicationId}/documents`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upload document');
  }
  const data = await response.json();
  return {
    ...data,
    documentType: data.documentType as ApplicationDocument['documentType'],
    createdAt: new Date(data.createdAt),
  };
}

export async function editApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  data: EditApplicationDocument,
  token?: string | null
): Promise<ApplicationDocument> {
  const response = await client.api.applications[':applicationId'].documents[
    ':applicationDocumentId'
  ].$put(
    {
      param: { applicationId, applicationDocumentId },
      json: data,
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update document');
  }
  const document = await response.json();
  return {
    ...document,
    createdAt: new Date(document.createdAt),
  };
}

export async function deleteApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  token?: string | null
): Promise<void> {
  const response = await client.api.applications[':applicationId'].documents[
    ':applicationDocumentId'
  ].$delete(
    {
      param: { applicationId, applicationDocumentId },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete document');
  }
}

export async function getDownloadUrl(
  applicationId: string,
  applicationDocumentId: string,
  token?: string | null
): Promise<DownloadUrl> {
  const response = await client.api.applications[':applicationId'].documents[
    ':applicationDocumentId'
  ]['download-url'].$get(
    {
      param: { applicationId, applicationDocumentId },
    },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get download URL');
  }
  return await response.json();
}
