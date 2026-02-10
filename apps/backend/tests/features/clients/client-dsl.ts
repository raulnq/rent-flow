import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddClient,
  EditClient,
  Client,
  ListClients,
} from '#/features/clients/schemas.js';

// --- Factory functions ---

export const alice = (overrides?: Partial<AddClient>): AddClient => {
  return {
    name: `Alice ${faker.string.uuid()}`,
    dni: faker.string.alphanumeric(10),
    phone: faker.string.numeric(9),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    ...overrides,
  };
};

export const bob = (overrides?: Partial<AddClient>): AddClient => {
  return {
    name: `Bob ${faker.string.uuid()}`,
    dni: faker.string.alphanumeric(10),
    phone: faker.string.numeric(9),
    email: null,
    address: null,
    ...overrides,
  };
};

// --- Action functions ---

export async function addClient(input: AddClient): Promise<Client>;
export async function addClient(
  input: AddClient,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addClient(
  input: AddClient,
  expectedProblemDocument?: ProblemDocument
): Promise<Client | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.clients.$post({ json: input });

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

export async function getClient(clientId: string): Promise<Client>;
export async function getClient(
  clientId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getClient(
  clientId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Client | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.clients[':clientId'].$get({
    param: { clientId },
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

export async function editClient(
  clientId: string,
  input: EditClient
): Promise<Client>;
export async function editClient(
  clientId: string,
  input: EditClient,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editClient(
  clientId: string,
  input: EditClient,
  expectedProblemDocument?: ProblemDocument
): Promise<Client | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.clients[':clientId'].$put({
    param: { clientId },
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

export async function listClients(
  query: Partial<ListClients>
): Promise<Page<Client>> {
  const api = testClient(app);
  const response = await api.api.clients.$get({
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

export const assertClient = (item: Client) => {
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
    isTheSameOf(expected: Client) {
      return this.hasName(expected.name)
        .hasDni(expected.dni)
        .hasPhone(expected.phone)
        .hasEmail(expected.email)
        .hasAddress(expected.address);
    },
  };
};
