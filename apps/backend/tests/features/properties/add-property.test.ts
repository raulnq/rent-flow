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
      .hasRooms(input.rooms)
      .hasBathrooms(input.bathrooms)
      .hasParkingSpaces(input.parkingSpaces)
      .hasTotalArea(input.totalArea)
      .hasBuiltArea(input.builtArea)
      .hasFloorNumber(input.floorNumber)
      .hasYearBuilt(input.yearBuilt)
      .hasDescription(input.description)
      .hasNotes(input.notes)
      .hasLatitude(input.latitude)
      .hasLongitude(input.longitude)
      .hasMaintenanceFee(input.maintenanceFee)
      .hasMinimumContractMonths(input.minimumContractMonths)
      .hasDepositMonths(input.depositMonths)
      .hasElevator(input.hasElevator)
      .allowsPets(input.allowPets)
      .allowsKids(input.allowKids)
      .hasStatus(input.status);
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
      .hasNotes(null)
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
        name: 'should reject negative rooms',
        override: { rooms: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('rooms'),
        ]),
      },
      {
        name: 'should reject negative bathrooms',
        override: { bathrooms: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('bathrooms'),
        ]),
      },
      {
        name: 'should reject negative parkingSpaces',
        override: { parkingSpaces: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('parkingSpaces'),
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
        name: 'should reject negative builtArea',
        override: { builtArea: -25 },
        expectedError: createValidationError([
          validationError.nonNegative('builtArea'),
        ]),
      },
      {
        name: 'should reject negative floorNumber',
        override: { floorNumber: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('floorNumber'),
        ]),
      },
      {
        name: 'should reject yearBuilt before 1950',
        override: { yearBuilt: 1949 },
        expectedError: createValidationError([
          validationError.tooSmallNumber('yearBuilt', 1950),
        ]),
      },
      {
        name: 'should reject negative maintenanceFee',
        override: { maintenanceFee: -50 },
        expectedError: createValidationError([
          validationError.nonNegative('maintenanceFee'),
        ]),
      },
      {
        name: 'should reject negative minimumContractMonths',
        override: { minimumContractMonths: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('minimumContractMonths'),
        ]),
      },
      {
        name: 'should reject negative depositMonths',
        override: { depositMonths: -1 },
        expectedError: createValidationError([
          validationError.nonNegative('depositMonths'),
        ]),
      },
      {
        name: 'should reject status longer than 25 characters',
        override: { status: bigText(26) },
        expectedError: createValidationError([
          validationError.tooBig('status', 25),
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
    ];

    for (const { name, override, expectedError } of testCases) {
      test(name, async () => {
        const clientId = await createOwner();
        await addProperty(apartment({ clientId, ...override }), expectedError);
      });
    }
  });
});
