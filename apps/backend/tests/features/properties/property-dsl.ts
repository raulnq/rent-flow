import { faker } from '@faker-js/faker';
import { testClient } from 'hono/testing';
import { app } from '#/app.js';
import type { ProblemDocument } from 'http-problem-details';
import { StatusCodes } from 'http-status-codes';
import assert from 'node:assert';
import { assertStrictEqualProblemDocument } from '../../assertions.js';
import type { Page } from '#/pagination.js';
import type {
  AddProperty,
  EditProperty,
  Property,
  ListProperties,
} from '#/features/properties/schemas.js';
import type { Property as DBProperty } from '#/features/properties/property.js';
import { addClient, alice } from '../clients/client-dsl.js';

export const createOwner = async (): Promise<string> => {
  const owner = await addClient(alice());
  return owner.clientId;
};

export const apartment = (overrides?: Partial<AddProperty>): AddProperty => {
  return {
    address: `Apt ${faker.location.streetAddress()}`,
    propertyType: 'Apartment',
    clientId: overrides?.clientId ?? '00000000-0000-0000-0000-000000000000',
    rentalPrice: Number(faker.commerce.price({ min: 100, max: 5000 })),
    numberOfRooms: faker.number.int({ min: 1, max: 10 }),
    numberOfBathrooms: faker.number.int({ min: 1, max: 5 }),
    numberOfGarages: faker.number.int({ min: 0, max: 3 }),
    totalArea: Number(faker.commerce.price({ min: 30, max: 500 })),
    description: faker.lorem.paragraph(),
    constraints: null,
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...overrides,
  };
};

export const house = (overrides?: Partial<AddProperty>): AddProperty => {
  return {
    address: `House ${faker.location.streetAddress()}`,
    propertyType: 'House',
    clientId: overrides?.clientId ?? '00000000-0000-0000-0000-000000000000',
    rentalPrice: Number(faker.commerce.price({ min: 500, max: 10000 })),
    numberOfRooms: faker.number.int({ min: 2, max: 15 }),
    numberOfBathrooms: faker.number.int({ min: 1, max: 8 }),
    numberOfGarages: faker.number.int({ min: 1, max: 5 }),
    totalArea: Number(faker.commerce.price({ min: 80, max: 1000 })),
    description: null,
    constraints: null,
    latitude: null,
    longitude: null,
    ...overrides,
  };
};

export async function addProperty(input: AddProperty): Promise<Property>;
export async function addProperty(
  input: AddProperty,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function addProperty(
  input: AddProperty,
  expectedProblemDocument?: ProblemDocument
): Promise<DBProperty | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.properties.$post({ json: input });

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

export async function getProperty(propertyId: string): Promise<Property>;
export async function getProperty(
  propertyId: string,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function getProperty(
  propertyId: string,
  expectedProblemDocument?: ProblemDocument
): Promise<Property | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.properties[':propertyId'].$get({
    param: { propertyId },
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

export async function editProperty(
  propertyId: string,
  input: EditProperty
): Promise<Property>;
export async function editProperty(
  propertyId: string,
  input: EditProperty,
  expectedProblemDocument: ProblemDocument
): Promise<ProblemDocument>;

export async function editProperty(
  propertyId: string,
  input: EditProperty,
  expectedProblemDocument?: ProblemDocument
): Promise<DBProperty | ProblemDocument> {
  const api = testClient(app);
  const response = await api.api.properties[':propertyId'].$put({
    param: { propertyId },
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

export async function listProperties(
  query: Partial<ListProperties>
): Promise<Page<Property>> {
  const api = testClient(app);
  const response = await api.api.properties.$get({
    query: {
      pageNumber: String(query.pageNumber ?? 1),
      pageSize: String(query.pageSize ?? 10),
      ...(query.address ? { address: query.address } : {}),
    },
  });

  assert.strictEqual(response.status, StatusCodes.OK);
  const page = await response.json();
  assert.ok(page);
  return page;
}

export const assertProperty = (item: Property) => {
  return {
    hasAddress(expected: string) {
      assert.strictEqual(
        item.address,
        expected,
        `Expected address to be ${expected}, got ${item.address}`
      );
      return this;
    },
    hasPropertyType(expected: string) {
      assert.strictEqual(
        item.propertyType,
        expected,
        `Expected propertyType to be ${expected}, got ${item.propertyType}`
      );
      return this;
    },
    hasClientId(expected: string) {
      assert.strictEqual(
        item.clientId,
        expected,
        `Expected clientId to be ${expected}, got ${item.clientId}`
      );
      return this;
    },
    hasRentalPrice(expected: number) {
      assert.strictEqual(
        item.rentalPrice,
        expected,
        `Expected rentalPrice to be ${expected}, got ${item.rentalPrice}`
      );
      return this;
    },
    hasNumberOfRooms(expected: number) {
      assert.strictEqual(
        item.numberOfRooms,
        expected,
        `Expected numberOfRooms to be ${expected}, got ${item.numberOfRooms}`
      );
      return this;
    },
    hasNumberOfBathrooms(expected: number) {
      assert.strictEqual(
        item.numberOfBathrooms,
        expected,
        `Expected numberOfBathrooms to be ${expected}, got ${item.numberOfBathrooms}`
      );
      return this;
    },
    hasNumberOfGarages(expected: number) {
      assert.strictEqual(
        item.numberOfGarages,
        expected,
        `Expected numberOfGarages to be ${expected}, got ${item.numberOfGarages}`
      );
      return this;
    },
    hasTotalArea(expected: number) {
      assert.strictEqual(
        item.totalArea,
        expected,
        `Expected totalArea to be ${expected}, got ${item.totalArea}`
      );
      return this;
    },
    hasDescription(expected: string | null) {
      assert.strictEqual(
        item.description,
        expected,
        `Expected description to be ${expected}, got ${item.description}`
      );
      return this;
    },
    hasConstraints(expected: string | null) {
      assert.strictEqual(
        item.constraints,
        expected,
        `Expected constraints to be ${expected}, got ${item.constraints}`
      );
      return this;
    },
    hasLatitude(expected: number | null) {
      assert.strictEqual(
        item.latitude,
        expected,
        `Expected latitude to be ${expected}, got ${item.latitude}`
      );
      return this;
    },
    hasLongitude(expected: number | null) {
      assert.strictEqual(
        item.longitude,
        expected,
        `Expected longitude to be ${expected}, got ${item.longitude}`
      );
      return this;
    },
    hasClientName(expected: string | null) {
      assert.strictEqual(
        item.clientName,
        expected,
        `Expected clientName to be ${expected}, got ${item.clientName}`
      );
      return this;
    },
    isTheSameOf(expected: Property) {
      return this.hasAddress(expected.address)
        .hasPropertyType(expected.propertyType)
        .hasClientId(expected.clientId)
        .hasRentalPrice(expected.rentalPrice)
        .hasNumberOfRooms(expected.numberOfRooms)
        .hasNumberOfBathrooms(expected.numberOfBathrooms)
        .hasNumberOfGarages(expected.numberOfGarages)
        .hasTotalArea(expected.totalArea)
        .hasDescription(expected.description)
        .hasConstraints(expected.constraints)
        .hasLatitude(expected.latitude)
        .hasLongitude(expected.longitude)
        .hasClientName(expected.clientName);
    },
  };
};
