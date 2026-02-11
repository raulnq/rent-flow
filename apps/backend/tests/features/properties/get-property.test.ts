import { test, describe } from 'node:test';
import {
  addProperty,
  assertProperty,
  getProperty,
  apartment,
  createOwner,
} from './property-dsl.js';
import { addClient, alice } from '../clients/client-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Property Endpoint', () => {
  test('should get an existing property by ID', async () => {
    const clientId = await createOwner();
    const created = await addProperty(apartment({ clientId }));
    const retrieved = await getProperty(created.propertyId);
    assertProperty(retrieved)
      .hasAddress(created.address)
      .hasPropertyType(created.propertyType)
      .hasClientId(created.clientId)
      .hasRentalPrice(created.rentalPrice)
      .hasNumberOfRooms(created.numberOfRooms)
      .hasNumberOfBathrooms(created.numberOfBathrooms)
      .hasNumberOfGarages(created.numberOfGarages)
      .hasTotalArea(created.totalArea)
      .hasDescription(created.description)
      .hasConstraints(created.constraints)
      .hasLatitude(created.latitude)
      .hasLongitude(created.longitude);
  });

  test('should return 404 for non-existent property', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getProperty(id, createNotFoundError(`Property ${id} not found`));
  });

  test('should reject invalid UUID format', async () => {
    await getProperty(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('propertyId')])
    );
  });

  test('should include client name in the response', async () => {
    const client = await addClient(alice());
    const created = await addProperty(apartment({ clientId: client.clientId }));
    const retrieved = await getProperty(created.propertyId);
    assertProperty(retrieved).hasClientName(client.name);
  });
});
