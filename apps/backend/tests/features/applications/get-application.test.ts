import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  createApplication,
  getApplication,
  assertApplication,
} from './application-dsl.js';
import {
  createNotFoundError,
  createValidationError,
  validationError,
} from '../../errors.js';

describe('Get Application Endpoint', () => {
  test('should get an existing application by ID', async () => {
    const created = await createApplication();
    const retrieved = await getApplication(created.applicationId);

    assertApplication(retrieved)
      .hasLeadId(created.leadId)
      .hasPropertyId(created.propertyId)
      .hasStatus(created.status);
  });

  test('should include joined lead name and property address', async () => {
    const created = await createApplication();
    const retrieved = await getApplication(created.applicationId);

    assert.ok(retrieved.leadName);
    assert.ok(retrieved.propertyAddress);
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await getApplication(
      id,
      createNotFoundError(`Application ${id} not found`)
    );
  });

  test('should reject invalid UUID format', async () => {
    await getApplication(
      'invalid-uuid',
      createValidationError([validationError.invalidUuid('applicationId')])
    );
  });
});
