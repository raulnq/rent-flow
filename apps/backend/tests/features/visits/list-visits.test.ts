import { test, describe } from 'node:test';
import {
  addVisit,
  assertVisit,
  listVisits,
  scheduledVisit,
  laterVisit,
} from './visit-dsl.js';
import { assertPage } from '../../assertions.js';
import { createApplication } from '../applications/application-dsl.js';

describe('List Visits Endpoint', () => {
  test('should list visits with default pagination', async () => {
    const application = await createApplication();
    await addVisit(application.applicationId, scheduledVisit());
    await addVisit(application.applicationId, laterVisit());

    const page = await listVisits(application.applicationId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assertPage(page).hasItemsCount(2).hasTotalCount(2).hasTotalPages(1);
    assertVisit(page.items[0]).hasApplicationId(application.applicationId);
    assertVisit(page.items[1]).hasApplicationId(application.applicationId);
  });

  test('should list visits with custom page size', async () => {
    const application = await createApplication();
    await addVisit(application.applicationId, scheduledVisit());
    await addVisit(application.applicationId, laterVisit());

    const page = await listVisits(application.applicationId, {
      pageNumber: 1,
      pageSize: 1,
    });

    assertPage(page).hasItemsCount(1).hasTotalCount(2).hasTotalPages(2);
  });

  test('should return empty list for application with no visits', async () => {
    const application = await createApplication();
    const page = await listVisits(application.applicationId, {
      pageNumber: 1,
      pageSize: 10,
    });

    assertPage(page).hasEmptyResult();
  });

  test('should paginate correctly with multiple pages', async () => {
    const application = await createApplication();

    for (let i = 0; i < 7; i++) {
      await addVisit(application.applicationId, scheduledVisit());
    }

    const page1 = await listVisits(application.applicationId, {
      pageNumber: 1,
      pageSize: 5,
    });
    assertPage(page1).hasItemsCount(5).hasTotalCount(7).hasTotalPages(2);

    const page2 = await listVisits(application.applicationId, {
      pageNumber: 2,
      pageSize: 5,
    });
    assertPage(page2).hasItemsCount(2).hasTotalCount(7).hasTotalPages(2);
  });

  test('should only show visits for the specified application', async () => {
    const app1 = await createApplication();
    const app2 = await createApplication();

    await addVisit(app1.applicationId, scheduledVisit());
    await addVisit(app1.applicationId, laterVisit());
    await addVisit(app2.applicationId, scheduledVisit());

    const page1 = await listVisits(app1.applicationId, {
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page1).hasItemsCount(2);

    const page2 = await listVisits(app2.applicationId, {
      pageNumber: 1,
      pageSize: 10,
    });
    assertPage(page2).hasItemsCount(1);
  });
});
