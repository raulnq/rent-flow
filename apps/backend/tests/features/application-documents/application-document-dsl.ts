import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  ApplicationDocument,
  EditApplicationDocument,
  ListApplicationDocuments,
  DownloadUrl,
} from '#/features/application-documents/schemas.js';
import { createApplication } from '../applications/application-dsl.js';

// --- Helper functions ---

export const createApplicationDocument = async (
  applicationId?: string,
  documentType?: string,
  fileOverrides?: { name?: string; type?: string; size?: number }
): Promise<ApplicationDocument> => {
  const appId = applicationId ?? (await createApplication()).applicationId;
  const file = createMockFile(fileOverrides);
  return await addApplicationDocument(appId, documentType ?? 'Pay stubs', file);
};

export const createMockFile = (overrides?: {
  name?: string;
  type?: string;
  size?: number;
}): File => {
  const name = overrides?.name ?? 'test-document.pdf';
  const type = overrides?.type ?? 'application/pdf';
  const size = overrides?.size ?? 1024;
  const content = 'x'.repeat(size);
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

// --- Factory functions ---

export const pdfDocument = (): { type: string; file: File } => {
  return {
    type: 'Pay stubs',
    file: createMockFile({ name: 'paystub.pdf', type: 'application/pdf' }),
  };
};

export const imageDocument = (): { type: string; file: File } => {
  return {
    type: 'Identity document',
    file: createMockFile({ name: 'id.jpg', type: 'image/jpeg' }),
  };
};

export const wordDocument = (): { type: string; file: File } => {
  return {
    type: 'Credit report',
    file: createMockFile({
      name: 'credit.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }),
  };
};

export const oversizedFile = (): { type: string; file: File } => {
  return {
    type: 'Other',
    file: createMockFile({
      name: 'huge.pdf',
      type: 'application/pdf',
      size: 51 * 1024 * 1024,
    }),
  };
};

export const invalidFileType = (): { type: string; file: File } => {
  return {
    type: 'Other',
    file: createMockFile({
      name: 'script.exe',
      type: 'application/x-msdownload',
    }),
  };
};

// --- Action functions ---

export async function addApplicationDocument(
  applicationId: string,
  documentType: string,
  file: File
): Promise<ApplicationDocument>;
export async function addApplicationDocument(
  applicationId: string,
  documentType: string,
  file: File,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addApplicationDocument(
  applicationId: string,
  documentType: string,
  file: File,
  expectedProblemDocument?: ProblemDocument
): Promise<ApplicationDocument | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].documents.$post(
    {
      param: { applicationId },
      form: {
        file,
        documentType,
      },
    }
  );

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED status but received ${response.status}. Error: ${JSON.stringify(problemDocument)}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function listApplicationDocuments(
  applicationId: string,
  query?: Partial<ListApplicationDocuments>
): Promise<Page<ApplicationDocument>> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].documents.$get({
    param: { applicationId },
    query: {
      pageNumber: String(query?.pageNumber ?? 1),
      pageSize: String(query?.pageSize ?? 10),
    },
  });

  assert.strictEqual(response.status, StatusCodes.OK);
  const page = await response.json();
  assert.ok(page);
  return {
    ...page,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: page.items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    })),
  };
}

export async function editApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  input: EditApplicationDocument
): Promise<ApplicationDocument>;
export async function editApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  input: EditApplicationDocument,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  input: EditApplicationDocument,
  expectedProblemDocument?: ProblemDocument
): Promise<ApplicationDocument | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].documents[
    ':applicationDocumentId'
  ].$put({
    param: { applicationId, applicationDocumentId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      createdAt: new Date(item.createdAt),
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function deleteApplicationDocument(
  applicationId: string,
  applicationDocumentId: string
): Promise<void>;
export async function deleteApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function deleteApplicationDocument(
  applicationId: string,
  applicationDocumentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<void | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].documents[
    ':applicationDocumentId'
  ].$delete({
    param: { applicationId, applicationDocumentId },
  });

  if (response.status === StatusCodes.NO_CONTENT) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received NO_CONTENT status'
    );
    return;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected NO_CONTENT status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function getApplicationDocumentDownloadUrl(
  applicationId: string,
  applicationDocumentId: string
): Promise<DownloadUrl>;
export async function getApplicationDocumentDownloadUrl(
  applicationId: string,
  applicationDocumentId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getApplicationDocumentDownloadUrl(
  applicationId: string,
  applicationDocumentId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<DownloadUrl | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].documents[
    ':applicationDocumentId'
  ]['download-url'].$get({
    param: { applicationId, applicationDocumentId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const result = await response.json();
    assert.ok(result);
    return result;
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected OK status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

// --- Fluent assertion builder ---

export const assertApplicationDocument = (item: ApplicationDocument) => {
  return {
    hasApplicationId(expected: string) {
      assert.strictEqual(
        item.applicationId,
        expected,
        `Expected applicationId to be ${expected}, got ${item.applicationId}`
      );
      return this;
    },
    hasFileName(expected: string) {
      assert.strictEqual(
        item.fileName,
        expected,
        `Expected fileName to be ${expected}, got ${item.fileName}`
      );
      return this;
    },
    hasContentType(expected: string) {
      assert.strictEqual(
        item.contentType,
        expected,
        `Expected contentType to be ${expected}, got ${item.contentType}`
      );
      return this;
    },
    hasDocumentType(expected: string) {
      assert.strictEqual(
        item.documentType,
        expected,
        `Expected documentType to be ${expected}, got ${item.documentType}`
      );
      return this;
    },
    hasNotes(expected: string | null) {
      assert.strictEqual(
        item.notes,
        expected,
        `Expected notes to be ${expected}, got ${item.notes}`
      );
      return this;
    },
    hasFilePath() {
      assert.ok(
        item.filePath,
        `Expected filePath to be set, got ${item.filePath}`
      );
      assert.ok(
        item.filePath.length > 0,
        `Expected filePath to be non-empty, got ${item.filePath}`
      );
      return this;
    },
  };
};
