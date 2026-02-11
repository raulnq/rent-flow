import { test, describe } from 'node:test';
import {
  addProperty,
  assertProperty,
  apartment,
  house,
  createOwner,
} from './property-dsl.js';
import {
  emptyText,
  bigText,
  createValidationError,
  createNotFoundError,
  validationError,
} from '../../errors.js';

describe('Add Property Endpoint', () => {
  test('should create a property with all fields (apartment)', async () => {
    const clientId = await createOwner();
    const input = apartment({ clientId });
    const item = await addProperty(input);
    assertProperty(item)
      .hasAddress(input.address)
      .hasPropertyType('Apartment')
      .hasClientId(clientId)
      .hasRentalPrice(input.rentalPrice)
      .hasNumberOfRooms(input.numberOfRooms)
      .hasNumberOfBathrooms(input.numberOfBathrooms)
      .hasNumberOfGarages(input.numberOfGarages)
      .hasTotalArea(input.totalArea)
      .hasDescription(input.description)
      .hasLatitude(input.latitude)
      .hasLongitude(input.longitude);
  });

  test('should create a property with only required fields (house)', async () => {
    const clientId = await createOwner();
    const input = house({ clientId });
    const item = await addProperty(input);
    assertProperty(item)
      .hasAddress(input.address)
      .hasPropertyType('House')
      .hasClientId(clientId)
      .hasDescription(null)
      .hasConstraints(null)
      .hasLatitude(null)
      .hasLongitude(null);
  });

  test('should return 404 for non-existent client', async () => {
    const fakeClientId = '01940b6d-1234-7890-abcd-ef1234567890';
    const input = apartment({ clientId: fakeClientId });
    await addProperty(
      input,
      createNotFoundError(`Client ${fakeClientId} not found`)
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
        name: 'should reject missing address',
        override: { address: undefined },
        expectedError: createValidationError([
          validationError.requiredString('address'),
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
      {
        name: 'should reject latitude below -90',
        override: { latitude: -91 },
        expectedError: createValidationError([
          validationError.tooSmallNumber('latitude', -90),
        ]),
      },
      {
        name: 'should reject latitude above 90',
        override: { latitude: 91 },
        expectedError: createValidationError([
          validationError.tooBigNumber('latitude', 90),
        ]),
      },
      {
        name: 'should reject longitude below -180',
        override: { longitude: -181 },
        expectedError: createValidationError([
          validationError.tooSmallNumber('longitude', -180),
        ]),
      },
      {
        name: 'should reject longitude above 180',
        override: { longitude: 181 },
        expectedError: createValidationError([
          validationError.tooBigNumber('longitude', 180),
        ]),
      },
      {
        name: 'should reject description longer than 5000 characters',
        override: { description: bigText(5001) },
        expectedError: createValidationError([
          validationError.tooBig('description', 5000),
        ]),
      },
      {
        name: 'should reject constraints longer than 5000 characters',
        override: { constraints: bigText(5001) },
        expectedError: createValidationError([
          validationError.tooBig('constraints', 5000),
        ]),
      },
    ];

    for (const { name, override, expectedError } of testCases) {
      test(name, async () => {
        const clientId = await createOwner();
        await addProperty(apartment({ clientId, ...override }), expectedError);
      });
    }
  });
});
