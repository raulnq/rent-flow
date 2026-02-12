import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  createApplication,
  listApplications,
  assertApplication,
  createLead,
  createProperty,
} from './application-dsl.js';
import { assertPage } from '../../assertions.js';

describe('List Applications Endpoint', () => {
  test('should list all applications with pagination', async () => {
    await createApplication();
    const page = await listApplications({ pageSize: 10, pageNumber: 1 });

    assertPage(page).hasItemsCountAtLeast(1);
  });

  test('should filter applications by propertyId', async () => {
    const propertyId = await createProperty();
    const leadId = await createLead();
    await createApplication({ leadId, propertyId });

    const page = await listApplications({
      propertyId,
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCountAtLeast(1);
    assertApplication(page.items[0]).hasPropertyId(propertyId);
  });

  test('should filter applications by leadId', async () => {
    const leadId = await createLead();
    const propertyId = await createProperty();
    await createApplication({ leadId, propertyId });

    const page = await listApplications({
      leadId,
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCountAtLeast(1);
    assertApplication(page.items[0]).hasLeadId(leadId);
  });

  test('should include lead name and property address in list', async () => {
    const created = await createApplication();
    const page = await listApplications({
      leadId: created.leadId,
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCountAtLeast(1);
    const app = page.items.find(a => a.applicationId === created.applicationId);
    assert.ok(app);
    assert.ok(app.leadName);
    assert.ok(app.propertyAddress);
  });

  test('should return empty items when no match', async () => {
    const page = await listApplications({
      leadId: '01940b6d-1234-7890-abcd-ef1234567890',
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasEmptyResult();
  });
});
