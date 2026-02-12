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
    rooms: faker.number.int({ min: 1, max: 10 }),
    bathrooms: faker.number.int({ min: 1, max: 5 }),
    parkingSpaces: faker.number.int({ min: 0, max: 3 }),
    totalArea: Number(faker.commerce.price({ min: 30, max: 500 })),
    builtArea: Number(faker.commerce.price({ min: 25, max: 450 })),
    floorNumber: faker.number.int({ min: 0, max: 30 }),
    yearBuilt: faker.number.int({ min: 1950, max: 2024 }),
    description: faker.lorem.paragraph(),
    notes: null,
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    maintenanceFee: Number(faker.commerce.price({ min: 50, max: 500 })),
    minimumContractMonths: faker.number.int({ min: 6, max: 24 }),
    depositMonths: faker.number.int({ min: 1, max: 3 }),
    hasElevator: faker.datatype.boolean(),
    allowPets: faker.datatype.boolean(),
    allowKids: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(['Available', 'InProcess', 'Rented']),
    ...overrides,
  };
};

export const house = (overrides?: Partial<AddProperty>): AddProperty => {
  return {
    address: `House ${faker.location.streetAddress()}`,
    propertyType: 'House',
    clientId: overrides?.clientId ?? '00000000-0000-0000-0000-000000000000',
    rentalPrice: Number(faker.commerce.price({ min: 500, max: 10000 })),
    rooms: faker.number.int({ min: 2, max: 15 }),
    bathrooms: faker.number.int({ min: 1, max: 8 }),
    parkingSpaces: faker.number.int({ min: 1, max: 5 }),
    totalArea: Number(faker.commerce.price({ min: 80, max: 1000 })),
    builtArea: Number(faker.commerce.price({ min: 75, max: 950 })),
    floorNumber: faker.number.int({ min: 1, max: 3 }),
    yearBuilt: faker.number.int({ min: 1950, max: 2024 }),
    description: null,
    notes: null,
    latitude: null,
    longitude: null,
    maintenanceFee: Number(faker.commerce.price({ min: 100, max: 1000 })),
    minimumContractMonths: faker.number.int({ min: 12, max: 36 }),
    depositMonths: faker.number.int({ min: 2, max: 4 }),
    hasElevator: false,
    allowPets: faker.datatype.boolean(),
    allowKids: true,
    status: faker.helpers.arrayElement(['Available', 'InProcess', 'Rented']),
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
    hasRooms(expected: number) {
      assert.strictEqual(
        item.rooms,
        expected,
        `Expected rooms to be ${expected}, got ${item.rooms}`
      );
      return this;
    },
    hasBathrooms(expected: number) {
      assert.strictEqual(
        item.bathrooms,
        expected,
        `Expected bathrooms to be ${expected}, got ${item.bathrooms}`
      );
      return this;
    },
    hasParkingSpaces(expected: number) {
      assert.strictEqual(
        item.parkingSpaces,
        expected,
        `Expected parkingSpaces to be ${expected}, got ${item.parkingSpaces}`
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
    hasBuiltArea(expected: number) {
      assert.strictEqual(
        item.builtArea,
        expected,
        `Expected builtArea to be ${expected}, got ${item.builtArea}`
      );
      return this;
    },
    hasFloorNumber(expected: number) {
      assert.strictEqual(
        item.floorNumber,
        expected,
        `Expected floorNumber to be ${expected}, got ${item.floorNumber}`
      );
      return this;
    },
    hasYearBuilt(expected: number) {
      assert.strictEqual(
        item.yearBuilt,
        expected,
        `Expected yearBuilt to be ${expected}, got ${item.yearBuilt}`
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
    hasNotes(expected: string | null) {
      assert.strictEqual(
        item.notes,
        expected,
        `Expected notes to be ${expected}, got ${item.notes}`
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
    hasMaintenanceFee(expected: number) {
      assert.strictEqual(
        item.maintenanceFee,
        expected,
        `Expected maintenanceFee to be ${expected}, got ${item.maintenanceFee}`
      );
      return this;
    },
    hasMinimumContractMonths(expected: number) {
      assert.strictEqual(
        item.minimumContractMonths,
        expected,
        `Expected minimumContractMonths to be ${expected}, got ${item.minimumContractMonths}`
      );
      return this;
    },
    hasDepositMonths(expected: number) {
      assert.strictEqual(
        item.depositMonths,
        expected,
        `Expected depositMonths to be ${expected}, got ${item.depositMonths}`
      );
      return this;
    },
    hasElevator(expected: boolean) {
      assert.strictEqual(
        item.hasElevator,
        expected,
        `Expected hasElevator to be ${expected}, got ${item.hasElevator}`
      );
      return this;
    },
    allowsPets(expected: boolean) {
      assert.strictEqual(
        item.allowPets,
        expected,
        `Expected allowPets to be ${expected}, got ${item.allowPets}`
      );
      return this;
    },
    allowsKids(expected: boolean) {
      assert.strictEqual(
        item.allowKids,
        expected,
        `Expected allowKids to be ${expected}, got ${item.allowKids}`
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
        .hasRooms(expected.rooms)
        .hasBathrooms(expected.bathrooms)
        .hasParkingSpaces(expected.parkingSpaces)
        .hasTotalArea(expected.totalArea)
        .hasBuiltArea(expected.builtArea)
        .hasFloorNumber(expected.floorNumber)
        .hasYearBuilt(expected.yearBuilt)
        .hasDescription(expected.description)
        .hasNotes(expected.notes)
        .hasLatitude(expected.latitude)
        .hasLongitude(expected.longitude)
        .hasMaintenanceFee(expected.maintenanceFee)
        .hasMinimumContractMonths(expected.minimumContractMonths)
        .hasDepositMonths(expected.depositMonths)
        .hasElevator(expected.hasElevator)
        .allowsPets(expected.allowPets)
        .allowsKids(expected.allowKids)
        .hasStatus(expected.status)
        .hasClientName(expected.clientName);
    },
  };
};
