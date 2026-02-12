import { test, describe } from 'node:test';
import {
  createApplication,
  editApplication,
  assertApplication,
} from './application-dsl.js';
import { createNotFoundError } from '../../errors.js';

describe('Edit Application Endpoint', () => {
  test('should edit notes on an existing application', async () => {
    const created = await createApplication();
    const updated = await editApplication(created.applicationId, {
      applicationId: created.applicationId,
      notes: 'Updated notes',
    });

    assertApplication(updated).hasNotes('Updated notes');
  });

  test('should allow setting notes to null', async () => {
    const created = await createApplication();
    const updated = await editApplication(created.applicationId, {
      applicationId: created.applicationId,
      notes: null,
    });

    assertApplication(updated).hasNotes(null);
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await editApplication(
      id,
      { applicationId: id, notes: 'Test' },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
