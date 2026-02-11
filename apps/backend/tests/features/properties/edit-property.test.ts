import { test, describe } from 'node:test';
import {
  addProperty,
  editProperty,
  apartment,
  house,
  assertProperty,
  createOwner,
} from './property-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Edit Property Endpoint', () => {
  test('should edit an existing property with valid data', async () => {
    const clientId = await createOwner();
    const created = await addProperty(apartment({ clientId }));
    const input = house({ clientId });
    const updated = await editProperty(created.propertyId, {
      propertyId: created.propertyId,
      ...input,
    });
    assertProperty(updated)
      .hasAddress(input.address)
      .hasPropertyType('House')
      .hasClientId(clientId)
      .hasRentalPrice(input.rentalPrice)
      .hasNumberOfRooms(input.numberOfRooms)
      .hasNumberOfBathrooms(input.numberOfBathrooms)
      .hasNumberOfGarages(input.numberOfGarages)
      .hasTotalArea(input.totalArea);
  });

  test('should return 404 for non-existent property', async () => {
    const clientId = await createOwner();
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    const input = apartment({ clientId });
    await editProperty(
      id,
      { propertyId: id, ...input },
      createNotFoundError(`Property ${id} not found`)
    );
  });

  test('should return 404 for non-existent client in edit', async () => {
    const clientId = await createOwner();
    const created = await addProperty(apartment({ clientId }));
    const fakeClientId = '01940b6d-1234-7890-abcd-ef1234567890';
    await editProperty(
      created.propertyId,
      {
        propertyId: created.propertyId,
        ...apartment({ clientId: fakeClientId }),
      },
      createNotFoundError(`Client ${fakeClientId} not found`)
    );
  });

  test('should reject invalid UUID in param', async () => {
    const clientId = await createOwner();
    const input = apartment({ clientId });
    await editProperty(
      'invalid-uuid',
      { propertyId: 'invalid-uuid', ...input },
      createValidationError([validationError.invalidUuid('propertyId')])
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty address',
        override: { address: emptyText },
        expectedError: createValidationError([
          validationError.tooSmall('address', 1),
        ]),
      },
      {
        name: 'should reject address longer than 1000 characters',
        override: { address: bigText(1001) },
        expectedError: createValidationError([
          validationError.tooBig('address', 1000),
        ]),
      },
      {
        name: 'should reject negative rentalPrice',
        override: { rentalPrice: -100 },
        expectedError: createValidationError([
          validationError.nonNegative('rentalPrice'),
        ]),
      },
      {
        name: 'should reject negative numberOfRooms',
        override: { numberOfRooms: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('numberOfRooms'),
        ]),
      },
      {
        name: 'should reject negative numberOfBathrooms',
        override: { numberOfBathrooms: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('numberOfBathrooms'),
        ]),
      },
      {
        name: 'should reject negative numberOfGarages',
        override: { numberOfGarages: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('numberOfGarages'),
        ]),
      },
      {
        name: 'should reject negative totalArea',
        override: { totalArea: -50 },
        expectedError: createValidationError([
          validationError.nonNegative('totalArea'),
        ]),
      },
    ];

    for (const { name, override, expectedError } of testCases) {
      test(name, async () => {
        const clientId = await createOwner();
        const created = await addProperty(apartment({ clientId }));
        await editProperty(
          created.propertyId,
          {
            propertyId: created.propertyId,
            ...apartment({ clientId, ...override }),
          },
          expectedError
        );
      });
    }
  });
});
