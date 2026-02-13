import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddVisit,
  EditVisit,
  Visit,
  ListVisits,
  CancelVisit,
} from '#/features/visits/schemas.js';
import { createApplication } from '../applications/application-dsl.js';
import type { Visit as DBVisit } from '#/features/visits/visit.js';

// --- Helper functions ---

export const tomorrow = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString();
};

export const nextWeek = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
};

export const createVisit = async (
  applicationId?: string,
  overrides?: Partial<AddVisit>
): Promise<Visit> => {
  const appId = applicationId ?? (await createApplication()).applicationId;
  return await addVisit(appId, scheduledVisit(overrides));
};

// --- Factory functions ---

export const scheduledVisit = (overrides?: Partial<AddVisit>): AddVisit => {
  return {
    scheduledAt: tomorrow(),
    ...overrides,
  };
};

export const laterVisit = (overrides?: Partial<AddVisit>): AddVisit => {
  return {
    scheduledAt: nextWeek(),
    ...overrides,
  };
};

// --- Action functions ---

export async function addVisit(
  applicationId: string,
  input: AddVisit
): Promise<Visit>;
export async function addVisit(
  applicationId: string,
  input: AddVisit,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addVisit(
  applicationId: string,
  input: AddVisit,
  expectedProblemDocument?: ProblemDocument
): Promise<DBVisit | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].visits.$post({
    param: { applicationId },
    json: input,
  });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return {
      ...item,
      scheduledAt: new Date(item.scheduledAt),
      createdAt: new Date(item.createdAt),
    };
  } else {
    const problemDocument = await response.json();
    assert.ok(problemDocument);
    assert.ok(
      expectedProblemDocument,
      `Expected CREATED status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function listVisits(
  applicationId: string,
  query?: Partial<ListVisits>
): Promise<Page<Visit>> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].visits.$get({
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
      scheduledAt: new Date(item.scheduledAt),
      createdAt: new Date(item.createdAt),
    })),
  };
}

export async function editVisit(
  applicationId: string,
  visitId: string,
  input: EditVisit
): Promise<Visit>;
export async function editVisit(
  applicationId: string,
  visitId: string,
  input: EditVisit,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editVisit(
  applicationId: string,
  visitId: string,
  input: EditVisit,
  expectedProblemDocument?: ProblemDocument
): Promise<Visit | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].visits[
    ':visitId'
  ].$put({
    param: { applicationId, visitId },
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
      scheduledAt: new Date(item.scheduledAt),
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

export async function completeVisit(
  applicationId: string,
  visitId: string
): Promise<Visit>;
export async function completeVisit(
  applicationId: string,
  visitId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function completeVisit(
  applicationId: string,
  visitId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Visit | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].visits[
    ':visitId'
  ].complete.$post({
    param: { applicationId, visitId },
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
      scheduledAt: new Date(item.scheduledAt),
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

export async function cancelVisit(
  applicationId: string,
  visitId: string,
  input: CancelVisit
): Promise<Visit>;
export async function cancelVisit(
  applicationId: string,
  visitId: string,
  input: CancelVisit,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function cancelVisit(
  applicationId: string,
  visitId: string,
  input: CancelVisit,
  expectedProblemDocument?: ProblemDocument
): Promise<Visit | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].visits[
    ':visitId'
  ].cancel.$post({
    param: { applicationId, visitId },
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
      scheduledAt: new Date(item.scheduledAt),
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

export async function noAttendVisit(
  applicationId: string,
  visitId: string
): Promise<Visit>;
export async function noAttendVisit(
  applicationId: string,
  visitId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function noAttendVisit(
  applicationId: string,
  visitId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Visit | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].visits[
    ':visitId'
  ]['no-attend'].$post({
    param: { applicationId, visitId },
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
      scheduledAt: new Date(item.scheduledAt),
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

// --- Fluent assertion builder ---

export const assertVisit = (item: Visit) => {
  return {
    hasApplicationId(expected: string) {
      assert.strictEqual(
        item.applicationId,
        expected,
        `Expected applicationId to be ${expected}, got ${item.applicationId}`
      );
      return this;
    },
    hasStatus(expected: string) {
      assert.strictEqual(
        item.status,
        expected,
        `Expected status to be ${expected}, got ${item.status}`
      );
      return this;
    },
    hasScheduledAt(expected: Date) {
      assert.deepStrictEqual(
        item.scheduledAt,
        expected,
        `Expected scheduledAt to be ${expected}, got ${item.scheduledAt}`
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
    hasCancellationReason(expected: string | null) {
      assert.strictEqual(
        item.cancellationReason,
        expected,
        `Expected cancellationReason to be ${expected}, got ${item.cancellationReason}`
      );
      return this;
    },
  };
};
