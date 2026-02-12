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
      .hasRooms(created.rooms)
      .hasBathrooms(created.bathrooms)
      .hasParkingSpaces(created.parkingSpaces)
      .hasTotalArea(created.totalArea)
      .hasBuiltArea(created.builtArea)
      .hasFloorNumber(created.floorNumber)
      .hasYearBuilt(created.yearBuilt)
      .hasDescription(created.description)
      .hasNotes(created.notes)
      .hasLatitude(created.latitude)
      .hasLongitude(created.longitude)
      .hasMaintenanceFee(created.maintenanceFee)
      .hasMinimumContractMonths(created.minimumContractMonths)
      .hasDepositMonths(created.depositMonths)
      .hasElevator(created.hasElevator)
      .allowsPets(created.allowPets)
      .allowsKids(created.allowKids)
      .hasStatus(created.status);
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
