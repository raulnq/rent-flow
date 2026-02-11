import { test, describe } from 'node:test';
import { addLead, assertLead, listLeads, john } from './lead-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Leads Endpoint', () => {
  test('should filter leads by name', async () => {
    const item = await addLead(john());
    const page = await listLeads({
      name: item.name,
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(1);
    assertLead(page.items[0]).isTheSameOf(item);
  });

  test('should return empty items when no match', async () => {
    const page = await listLeads({
      name: 'nonexistent-xyz-999',
      pageSize: 10,
      pageNumber: 1,
    });
    assertPage(page).hasEmptyResult();
  });

  test('should return paginated results', async () => {
    const uniqueName = `Paginate ${Date.now()}`;
    await addLead(john({ name: `${uniqueName} 1` }));
    await addLead(john({ name: `${uniqueName} 2` }));
    await addLead(john({ name: `${uniqueName} 3` }));

    const page = await listLeads({
      name: uniqueName,
      pageSize: 2,
      pageNumber: 1,
    });
    assertPage(page).hasItemsCount(2).hasTotalCount(3).hasTotalPages(2);
  });
});
