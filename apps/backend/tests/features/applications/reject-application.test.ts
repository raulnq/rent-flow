import { test, describe } from 'node:test';
import {
  createApplication,
  startReview,
  approve,
  reject,
  assertApplication,
  todayDate,
} from './application-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
  emptyText,
} from '../../errors.js';
import assert from 'node:assert';

describe('Reject Application Endpoint', () => {
  test('should reject application with status New', async () => {
    const created = await createApplication();
    const updated = await reject(created.applicationId, {
      rejectedReason: 'Incomplete documents',
      rejectedAt: todayDate(),
    });

    assertApplication(updated)
      .hasStatus('Rejected')
      .hasRejectedReason('Incomplete documents');
    assert.ok(updated.rejectedAt);
  });

  test('should reject application with status Under Review', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    const updated = await reject(created.applicationId, {
      rejectedReason: 'Failed background check',
      rejectedAt: todayDate(),
    });

    assertApplication(updated)
      .hasStatus('Rejected')
      .hasRejectedReason('Failed background check');
    assert.ok(updated.rejectedAt);
  });

  test('should set rejectedAt date', async () => {
    const created = await createApplication();
    const updated = await reject(created.applicationId, {
      rejectedReason: 'Test reason',
      rejectedAt: todayDate(),
    });

    assert.ok(updated.rejectedAt);
    assert.strictEqual(typeof updated.rejectedAt, 'string');
  });

  test('should reject with status Approved', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });

    await reject(
      created.applicationId,
      { rejectedReason: 'Test', rejectedAt: todayDate() },
      createConflictError(
        'Cannot reject application with status "Approved". Application must be in "New" or "Under Review" status.'
      )
    );
  });

  test('should require rejectedReason', async () => {
    const created = await createApplication();
    await reject(
      created.applicationId,
      { rejectedReason: emptyText, rejectedAt: todayDate() },
      createValidationError([validationError.tooSmall('rejectedReason', 1)])
    );
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await reject(
      id,
      { rejectedReason: 'Test', rejectedAt: todayDate() },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
