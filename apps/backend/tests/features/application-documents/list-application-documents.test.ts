import { test, describe } from 'node:test';
import {
  createApplicationDocument,
  listApplicationDocuments,
  assertApplicationDocument,
} from './application-document-dsl.js';
import { assertPage } from '../../assertions.js';
import { createApplication } from '../applications/application-dsl.js';

describe('List Application Documents Endpoint', () => {
  test('should list documents for an application', async () => {
    const application = await createApplication();
    await createApplicationDocument(application.applicationId, 'Pay stubs');
    await createApplicationDocument(application.applicationId, 'Credit report');

    const page = await listApplicationDocuments(application.applicationId, {
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCount(2).hasTotalCount(2);
    assertApplicationDocument(page.items[0]).hasApplicationId(
      application.applicationId
    );
    assertApplicationDocument(page.items[1]).hasApplicationId(
      application.applicationId
    );
  });

  test('should return empty list when application has no documents', async () => {
    const application = await createApplication();

    const page = await listApplicationDocuments(application.applicationId, {
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasEmptyResult();
  });

  test('should paginate documents correctly', async () => {
    const application = await createApplication();

    // Create 6 documents
    for (let i = 0; i < 6; i++) {
      await createApplicationDocument(application.applicationId, 'Pay stubs');
    }

    // Get first page (pageSize=5)
    const page1 = await listApplicationDocuments(application.applicationId, {
      pageSize: 5,
      pageNumber: 1,
    });

    assertPage(page1).hasItemsCount(5).hasTotalCount(6).hasTotalPages(2);

    // Get second page
    const page2 = await listApplicationDocuments(application.applicationId, {
      pageSize: 5,
      pageNumber: 2,
    });

    assertPage(page2).hasItemsCount(1).hasTotalCount(6).hasTotalPages(2);
  });

  test('should only return documents for the specified application', async () => {
    const app1 = await createApplication();
    const app2 = await createApplication();

    await createApplicationDocument(app1.applicationId, 'Pay stubs');
    await createApplicationDocument(app2.applicationId, 'Credit report');

    const page1 = await listApplicationDocuments(app1.applicationId, {
      pageSize: 10,
      pageNumber: 1,
    });
    const page2 = await listApplicationDocuments(app2.applicationId, {
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page1).hasItemsCount(1);
    assertPage(page2).hasItemsCount(1);

    assertApplicationDocument(page1.items[0]).hasApplicationId(
      app1.applicationId
    );
    assertApplicationDocument(page2.items[0]).hasApplicationId(
      app2.applicationId
    );
  });
});
