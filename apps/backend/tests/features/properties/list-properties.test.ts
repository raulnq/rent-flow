import { test, describe } from 'node:test';
import {
  addProperty,
  assertProperty,
  listProperties,
  apartment,
  createOwner,
} from './property-dsl.js';
import { addClient, alice } from '../clients/client-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Properties Endpoint', () => {
  test('should filter properties by address', async () => {
    const clientId = await createOwner();
    const input = apartment({ clientId });
    const item = await addProperty(input);
    const page = await listProperties({
      address: item.address,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertProperty(page.items[0])
      .hasAddress(item.address)
      .hasPropertyType(item.propertyType)
      .hasClientId(item.clientId)
      .hasRentalPrice(item.rentalPrice)
      .hasNumberOfRooms(item.numberOfRooms)
      .hasNumberOfBathrooms(item.numberOfBathrooms)
      .hasNumberOfGarages(item.numberOfGarages)
      .hasTotalArea(item.totalArea)
      .hasDescription(item.description)
      .hasConstraints(item.constraints)
      .hasLatitude(item.latitude)
      .hasLongitude(item.longitude);
  });

  test('should return empty items when no match', async () => {
    const page = await listProperties({
      address: 'nonexistent-address-xyz-12345',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should include client name in the response', async () => {
    const client = await addClient(alice());
    const created = await addProperty(apartment({ clientId: client.clientId }));
    const page = await listProperties({
      address: created.address,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertProperty(page.items[0]).hasClientName(client.name);
  });
});
