import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddLead,
  EditLead,
  Lead,
  ListLeads,
} from '#/features/leads/schemas.js';

// --- Factory functions ---

export const john = (overrides?: Partial<AddLead>): AddLead => {
  return {
    name: `John ${faker.string.uuid()}`,
    dni: faker.string.alphanumeric(10),
    phone: faker.string.numeric(9),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    birthDate: '1990-05-15',
    occupation: 'Software Engineer',
    notes: 'Very interested in rental properties',
    nationality: 'Peruvian',
    ...overrides,
  };
};

export const jane = (overrides?: Partial<AddLead>): AddLead => {
  return {
    name: `Jane ${faker.string.uuid()}`,
    dni: faker.string.alphanumeric(10),
    phone: faker.string.numeric(9),
    email: null,
    address: null,
    birthDate: null,
    occupation: null,
    notes: null,
    nationality: null,
    ...overrides,
  };
};

// --- Action functions ---

export async function addLead(input: AddLead): Promise<Lead>;
export async function addLead(
  input: AddLead,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addLead(
  input: AddLead,
  expectedProblemDocument?: ProblemDocument
): Promise<Lead | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.leads.$post({ json: input });

  if (response.status === StatusCodes.CREATED) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received CREATED status'
    );
    const item = await response.json();
    assert.ok(item);
    return item;
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

export async function getLead(leadId: string): Promise<Lead>;
export async function getLead(
  leadId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getLead(
  leadId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Lead | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.leads[':leadId'].$get({
    param: { leadId },
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return item;
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

export async function editLead(leadId: string, input: EditLead): Promise<Lead>;
export async function editLead(
  leadId: string,
  input: EditLead,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editLead(
  leadId: string,
  input: EditLead,
  expectedProblemDocument?: ProblemDocument
): Promise<Lead | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.leads[':leadId'].$put({
    param: { leadId },
    json: input,
  });

  if (response.status === StatusCodes.OK) {
    assert.ok(
      !expectedProblemDocument,
      'Expected a problem document but received OK status'
    );
    const item = await response.json();
    assert.ok(item);
    return item;
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

export async function listLeads(
  query: Partial<ListLeads>
): Promise<Page<Lead>> {
  const api = testClient(app);
  const response = await api.api.leads.$get({
    query: {
      pageNumber: String(query.pageNumber ?? 1),
      pageSize: String(query.pageSize ?? 10),
      ...(query.name ? { name: query.name } : {}),
    },
  });

  assert.strictEqual(response.status, StatusCodes.OK);
  const page = await response.json();
  assert.ok(page);
  return page;
}

// --- Fluent assertion builder ---

export const assertLead = (item: Lead) => {
  return {
    hasName(expected: string) {
      assert.strictEqual(
        item.name,
        expected,
        `Expected name to be ${expected}, got ${item.name}`
      );
      return this;
    },
    hasDni(expected: string) {
      assert.strictEqual(
        item.dni,
        expected,
        `Expected dni to be ${expected}, got ${item.dni}`
      );
      return this;
    },
    hasPhone(expected: string) {
      assert.strictEqual(
        item.phone,
        expected,
        `Expected phone to be ${expected}, got ${item.phone}`
      );
      return this;
    },
    hasEmail(expected: string | null) {
      assert.strictEqual(
        item.email,
        expected,
        `Expected email to be ${expected}, got ${item.email}`
      );
      return this;
    },
    hasAddress(expected: string | null) {
      assert.strictEqual(
        item.address,
        expected,
        `Expected address to be ${expected}, got ${item.address}`
      );
      return this;
    },
    hasBirthDate(expected: string | null) {
      assert.strictEqual(
        item.birthDate,
        expected,
        `Expected birthDate to be ${expected}, got ${item.birthDate}`
      );
      return this;
    },
    hasOccupation(expected: string | null) {
      assert.strictEqual(
        item.occupation,
        expected,
        `Expected occupation to be ${expected}, got ${item.occupation}`
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
    hasNationality(expected: string | null) {
      assert.strictEqual(
        item.nationality,
        expected,
        `Expected nationality to be ${expected}, got ${item.nationality}`
      );
      return this;
    },
    isTheSameOf(expected: Lead) {
      return this.hasName(expected.name)
        .hasDni(expected.dni)
        .hasPhone(expected.phone)
        .hasEmail(expected.email)
        .hasAddress(expected.address)
        .hasBirthDate(expected.birthDate)
        .hasOccupation(expected.occupation)
        .hasNotes(expected.notes)
        .hasNationality(expected.nationality);
    },
  };
};
