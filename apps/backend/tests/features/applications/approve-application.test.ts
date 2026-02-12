import { test, describe } from 'node:test';
import {
  createApplication,
  startReview,
  approve,
  assertApplication,
  todayDate,
} from './application-dsl.js';
import { createNotFoundError, createConflictError } from '../../errors.js';
import assert from 'node:assert';

describe('Approve Application Endpoint', () => {
  test('should approve application with status Under Review', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    const updated = await approve(created.applicationId, {
      approvedAt: todayDate(),
    });

    assertApplication(updated).hasStatus('Approved');
    assert.ok(updated.approvedAt);
  });

  test('should set approvedAt date', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    const updated = await approve(created.applicationId, {
      approvedAt: todayDate(),
    });

    assert.ok(updated.approvedAt);
    assert.strictEqual(typeof updated.approvedAt, 'string');
  });

  test('should reject approval with status New', async () => {
    const created = await createApplication();
    await approve(
      created.applicationId,
      { approvedAt: todayDate() },
      createConflictError(
        'Cannot approve application with status "New". Application must be in "Under Review" status.'
      )
    );
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await approve(
      id,
      { approvedAt: todayDate() },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
