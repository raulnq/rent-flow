import { test, describe } from 'node:test';
import { addClient, assertClient, listClients, alice } from './client-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Clients Endpoint', () => {
  test('should filter clients by name', async () => {
    const item = await addClient(alice());
    const page = await listClients({
      name: item.name,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertClient(page.items[0]).isTheSameOf(item);
  });

  test('should return empty items when no match', async () => {
    const page = await listClients({
      name: 'nonexistent-xyz-999',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should return paginated results', async () => {
    const uniqueName = `Paginate ${Date.now()}`;
    await addClient(alice({ name: `${uniqueName} 1` }));
    await addClient(alice({ name: `${uniqueName} 2` }));
    await addClient(alice({ name: `${uniqueName} 3` }));

    const page = await listClients({
      name: uniqueName,
      pageSize: 2,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(2).hasTotalCount(3).hasTotalPages(2);
  });
});
