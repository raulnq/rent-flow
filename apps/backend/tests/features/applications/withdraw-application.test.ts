import { test, describe } from 'node:test';
import {
  createApplication,
  startReview,
  approve,
  reserve,
  reject,
  withdraw,
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

describe('Withdraw Application Endpoint', () => {
  test('should withdraw application with status New', async () => {
    const created = await createApplication();
    const updated = await withdraw(created.applicationId, {
      withdrawnReason: 'Changed mind',
      withdrawnAt: todayDate(),
    });

    assertApplication(updated)
      .hasStatus('Withdrawn')
      .hasWithdrawnReason('Changed mind');
    assert.ok(updated.withdrawnAt);
  });

  test('should withdraw application with status Under Review', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    const updated = await withdraw(created.applicationId, {
      withdrawnReason: 'Found another property',
      withdrawnAt: todayDate(),
    });

    assertApplication(updated)
      .hasStatus('Withdrawn')
      .hasWithdrawnReason('Found another property');
    assert.ok(updated.withdrawnAt);
  });

  test('should withdraw application with status Approved', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });
    const updated = await withdraw(created.applicationId, {
      withdrawnReason: 'Personal reasons',
      withdrawnAt: todayDate(),
    });

    assertApplication(updated)
      .hasStatus('Withdrawn')
      .hasWithdrawnReason('Personal reasons');
    assert.ok(updated.withdrawnAt);
  });

  test('should withdraw application with status Reserved', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });
    await reserve(created.applicationId, {
      reservedAt: todayDate(),
      reservedAmount: 1500,
    });
    const updated = await withdraw(created.applicationId, {
      withdrawnReason: 'Changed circumstances',
      withdrawnAt: todayDate(),
    });

    assertApplication(updated)
      .hasStatus('Withdrawn')
      .hasWithdrawnReason('Changed circumstances');
    assert.ok(updated.withdrawnAt);
  });

  test('should set withdrawnAt date', async () => {
    const created = await createApplication();
    const updated = await withdraw(created.applicationId, {
      withdrawnReason: 'Test reason',
      withdrawnAt: todayDate(),
    });

    assert.ok(updated.withdrawnAt);
    assert.strictEqual(typeof updated.withdrawnAt, 'string');
  });

  test('should reject withdrawal with status Rejected', async () => {
    const created = await createApplication();
    await reject(created.applicationId, {
      rejectedReason: 'Test',
      rejectedAt: todayDate(),
    });

    await withdraw(
      created.applicationId,
      { withdrawnReason: 'Test', withdrawnAt: todayDate() },
      createConflictError(
        'Cannot withdraw application with status "Rejected". Application must be in "New", "Under Review", "Approved", or "Reserved" status.'
      )
    );
  });

  test('should require withdrawnReason', async () => {
    const created = await createApplication();
    await withdraw(
      created.applicationId,
      { withdrawnReason: emptyText, withdrawnAt: todayDate() },
      createValidationError([validationError.tooSmall('withdrawnReason', 1)])
    );
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await withdraw(
      id,
      { withdrawnReason: 'Test', withdrawnAt: todayDate() },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
