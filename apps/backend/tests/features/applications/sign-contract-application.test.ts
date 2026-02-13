import { test, describe } from 'node:test';
import {
  createApplication,
  startReview,
  approve,
  reserve,
  signContract,
  assertApplication,
  todayDate,
} from './application-dsl.js';
import { createNotFoundError, createConflictError } from '../../errors.js';
import assert from 'node:assert';

describe('Sign Contract Application Endpoint', () => {
  test('should sign contract for application with status Approved', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });
    const updated = await signContract(created.applicationId, {
      contractSignedAt: todayDate(),
    });

    assertApplication(updated).hasStatus('Contract Signed');
    assert.ok(updated.contractSignedAt);
  });

  test('should set contractSignedAt date', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });
    const updated = await signContract(created.applicationId, {
      contractSignedAt: todayDate(),
    });

    assert.ok(updated.contractSignedAt);
    assert.strictEqual(typeof updated.contractSignedAt, 'string');
  });

  test('should sign contract for application with status Reserved', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });
    await reserve(created.applicationId, {
      reservedAt: todayDate(),
      reservedAmount: 1500,
    });
    const updated = await signContract(created.applicationId, {
      contractSignedAt: todayDate(),
    });

    assertApplication(updated).hasStatus('Contract Signed');
    assert.ok(updated.contractSignedAt);
  });

  test('should reject signing contract with status New', async () => {
    const created = await createApplication();
    await signContract(
      created.applicationId,
      { contractSignedAt: todayDate() },
      createConflictError(
        'Cannot sign contract for application with status "New". Application must be in "Approved" or "Reserved" status.'
      )
    );
  });

  test('should reject signing contract with status Under Review', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await signContract(
      created.applicationId,
      { contractSignedAt: todayDate() },
      createConflictError(
        'Cannot sign contract for application with status "Under Review". Application must be in "Approved" or "Reserved" status.'
      )
    );
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await signContract(
      id,
      { contractSignedAt: todayDate() },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
