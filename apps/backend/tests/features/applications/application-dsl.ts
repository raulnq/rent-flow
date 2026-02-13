import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
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
} from '#/features/applications/schemas.js';
import { addLead, john } from '../leads/lead-dsl.js';
import {
  addProperty,
  apartment,
  createOwner,
} from '../properties/property-dsl.js';
import type { Application as DBApplication } from '#/features/applications/application.js';

// --- Helper functions ---

export const todayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const createLead = async (): Promise<string> => {
  const lead = await addLead(john());
  return lead.leadId;
};

export const createProperty = async (): Promise<string> => {
  const clientId = await createOwner();
  const property = await addProperty(apartment({ clientId }));
  return property.propertyId;
};

export const createApplication = async (
  overrides?: Partial<AddApplication>
): Promise<Application> => {
  const leadId = overrides?.leadId ?? (await createLead());
  const propertyId = overrides?.propertyId ?? (await createProperty());
  return await addApplication(newApplication({ leadId, propertyId }));
};

// --- Factory functions ---

export const newApplication = (
  overrides?: Partial<AddApplication>
): AddApplication => {
  return {
    leadId: overrides?.leadId ?? '00000000-0000-0000-0000-000000000000',
    propertyId: overrides?.propertyId ?? '00000000-0000-0000-0000-000000000000',
    ...overrides,
  };
};

// --- Action functions ---

export async function addApplication(
  input: AddApplication
): Promise<Application>;
export async function addApplication(
  input: AddApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addApplication(
  input: AddApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<DBApplication | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications.$post({ json: input });

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
      `Expected CREATED status but received ${response.status}`
    );
    assertStrictEqualProblemDocument(problemDocument, expectedProblemDocument);
    return problemDocument;
  }
}

export async function getApplication(
  applicationId: string
): Promise<Application>;
export async function getApplication(
  applicationId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getApplication(
  applicationId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].$get({
    param: { applicationId },
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

export async function editApplication(
  applicationId: string,
  input: EditApplication
): Promise<Application>;
export async function editApplication(
  applicationId: string,
  input: EditApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editApplication(
  applicationId: string,
  input: EditApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].$put({
    param: { applicationId },
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

export async function listApplications(
  query: Partial<ListApplications>
): Promise<Page<Application>> {
  const api = testClient(app);
  const response = await api.api.applications.$get({
    query: {
      pageNumber: String(query.pageNumber ?? 1),
      pageSize: String(query.pageSize ?? 10),
      ...(query.propertyId ? { propertyId: query.propertyId } : {}),
      ...(query.leadId ? { leadId: query.leadId } : {}),
      ...(query.startCreatedAt ? { startCreatedAt: query.startCreatedAt } : {}),
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

export async function startReview(
  applicationId: string,
  input: StartReviewApplication
): Promise<Application>;
export async function startReview(
  applicationId: string,
  input: StartReviewApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function startReview(
  applicationId: string,
  input: StartReviewApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);

  const response = await api.api.applications[':applicationId'][
    'start-review'
  ].$post({
    param: { applicationId },
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

export async function approve(
  applicationId: string,
  input: ApproveApplication
): Promise<Application>;
export async function approve(
  applicationId: string,
  input: ApproveApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function approve(
  applicationId: string,
  input: ApproveApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);

  const response = await api.api.applications[':applicationId'].approve.$post({
    param: { applicationId },
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

export async function reject(
  applicationId: string,
  input: RejectApplication
): Promise<Application>;
export async function reject(
  applicationId: string,
  input: RejectApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function reject(
  applicationId: string,
  input: RejectApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].reject.$post({
    param: { applicationId },
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

export async function withdraw(
  applicationId: string,
  input: WithdrawApplication
): Promise<Application>;
export async function withdraw(
  applicationId: string,
  input: WithdrawApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function withdraw(
  applicationId: string,
  input: WithdrawApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.applications[':applicationId'].withdraw.$post({
    param: { applicationId },
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

export async function signContract(
  applicationId: string,
  input: SignContractApplication
): Promise<Application>;
export async function signContract(
  applicationId: string,
  input: SignContractApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function signContract(
  applicationId: string,
  input: SignContractApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);

  const response = await api.api.applications[':applicationId'][
    'sign-contract'
  ].$post({
    param: { applicationId },
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

export async function reserve(
  applicationId: string,
  input: ReserveApplication
): Promise<Application>;
export async function reserve(
  applicationId: string,
  input: ReserveApplication,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function reserve(
  applicationId: string,
  input: ReserveApplication,
  expectedProblemDocument?: ProblemDocument
): Promise<Application | ProblemDocument> {
  const api = testClient(app);

  const response = await api.api.applications[':applicationId'].reserve.$post({
    param: { applicationId },
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

// --- Fluent assertion builder ---

export const assertApplication = (item: Application) => {
  return {
    hasLeadId(expected: string) {
      assert.strictEqual(
        item.leadId,
        expected,
        `Expected leadId to be ${expected}, got ${item.leadId}`
      );
      return this;
    },
    hasPropertyId(expected: string) {
      assert.strictEqual(
        item.propertyId,
        expected,
        `Expected propertyId to be ${expected}, got ${item.propertyId}`
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
    hasNotes(expected: string | null) {
      assert.strictEqual(
        item.notes,
        expected,
        `Expected notes to be ${expected}, got ${item.notes}`
      );
      return this;
    },
    hasReviewStartedAt(expected: string | null) {
      assert.strictEqual(
        item.reviewStartedAt,
        expected,
        `Expected reviewStartedAt to be ${expected}, got ${item.reviewStartedAt}`
      );
      return this;
    },
    hasApprovedAt(expected: string | null) {
      assert.strictEqual(
        item.approvedAt,
        expected,
        `Expected approvedAt to be ${expected}, got ${item.approvedAt}`
      );
      return this;
    },
    hasRejectedAt(expected: string | null) {
      assert.strictEqual(
        item.rejectedAt,
        expected,
        `Expected rejectedAt to be ${expected}, got ${item.rejectedAt}`
      );
      return this;
    },
    hasRejectedReason(expected: string | null) {
      assert.strictEqual(
        item.rejectedReason,
        expected,
        `Expected rejectedReason to be ${expected}, got ${item.rejectedReason}`
      );
      return this;
    },
    hasWithdrawnAt(expected: string | null) {
      assert.strictEqual(
        item.withdrawnAt,
        expected,
        `Expected withdrawnAt to be ${expected}, got ${item.withdrawnAt}`
      );
      return this;
    },
    hasWithdrawnReason(expected: string | null) {
      assert.strictEqual(
        item.withdrawnReason,
        expected,
        `Expected withdrawnReason to be ${expected}, got ${item.withdrawnReason}`
      );
      return this;
    },
    hasContractSignedAt(expected: string | null) {
      assert.strictEqual(
        item.contractSignedAt,
        expected,
        `Expected contractSignedAt to be ${expected}, got ${item.contractSignedAt}`
      );
      return this;
    },
    hasReservedAt(expected: string | null) {
      assert.strictEqual(
        item.reservedAt,
        expected,
        `Expected reservedAt to be ${expected}, got ${item.reservedAt}`
      );
      return this;
    },
    hasReservedAmount(expected: number | null) {
      assert.strictEqual(
        item.reservedAmount,
        expected,
        `Expected reservedAmount to be ${expected}, got ${item.reservedAmount}`
      );
      return this;
    },
    hasLeadName(expected: string | null) {
      assert.strictEqual(
        item.leadName,
        expected,
        `Expected leadName to be ${expected}, got ${item.leadName}`
      );
      return this;
    },
    hasPropertyAddress(expected: string | null) {
      assert.strictEqual(
        item.propertyAddress,
        expected,
        `Expected propertyAddress to be ${expected}, got ${item.propertyAddress}`
      );
      return this;
    },
  };
};
