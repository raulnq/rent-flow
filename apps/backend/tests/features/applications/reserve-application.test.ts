import { test, describe } from 'node:test';
import {
  createApplication,
  startReview,
  approve,
  reserve,
  reject,
  withdraw,
  signContract,
  assertApplication,
  todayDate,
} from './application-dsl.js';
import {
  createNotFoundError,
  createConflictError,
  createValidationError,
  validationError,
} from '../../errors.js';
import assert from 'node:assert';

describe('Reserve Application Endpoint', () => {
  test('should reserve application with status Approved', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });

    const updated = await reserve(created.applicationId, {
      reservedAt: todayDate(),
      reservedAmount: 1500.5,
    });

    assertApplication(updated).hasStatus('Reserved');
    assert.ok(updated.reservedAt);
    assert.strictEqual(updated.reservedAmount, 1500.5);
  });

  test('should set reservedAt date and reservedAmount', async () => {
    const created = await createApplication();
    await startReview(created.applicationId, { reviewStartedAt: todayDate() });
    await approve(created.applicationId, { approvedAt: todayDate() });

    const reservedDate = '2024-05-15';
    const amount = 2500.75;
    const updated = await reserve(created.applicationId, {
      reservedAt: reservedDate,
      reservedAmount: amount,
    });

    assertApplication(updated)
      .hasReservedAt(reservedDate)
      .hasReservedAmount(amount);
    assert.strictEqual(typeof updated.reservedAt, 'string');
    assert.strictEqual(typeof updated.reservedAmount, 'number');
  });

  describe('Property validations', () => {
    test('should reject missing reservedAt', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await approve(created.applicationId, { approvedAt: todayDate() });

      await reserve(
        created.applicationId,
        { reservedAt: undefined, reservedAmount: 1000 } as never,
        createValidationError([validationError.requiredString('reservedAt')])
      );
    });

    test('should reject empty reservedAt', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await approve(created.applicationId, { approvedAt: todayDate() });

      await reserve(
        created.applicationId,
        { reservedAt: '', reservedAmount: 1000 },
        createValidationError([validationError.tooSmall('reservedAt', 1)])
      );
    });

    test('should reject missing reservedAmount', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await approve(created.applicationId, { approvedAt: todayDate() });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: undefined } as never,
        createValidationError([
          validationError.requiredNumber('reservedAmount'),
        ])
      );
    });

    test('should reject zero reservedAmount', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await approve(created.applicationId, { approvedAt: todayDate() });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: 0 },
        createValidationError([validationError.notPositive('reservedAmount')])
      );
    });

    test('should reject negative reservedAmount', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await approve(created.applicationId, { approvedAt: todayDate() });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: -100 },
        createValidationError([validationError.notPositive('reservedAmount')])
      );
    });
  });

  describe('Business rule validations', () => {
    test('should reject reservation with status New', async () => {
      const created = await createApplication();
      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: 1000 },
        createConflictError(
          'Cannot reserve application with status "New". Application must be in "Approved" status.'
        )
      );
    });

    test('should reject reservation with status Under Review', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: 1000 },
        createConflictError(
          'Cannot reserve application with status "Under Review". Application must be in "Approved" status.'
        )
      );
    });

    test('should reject reservation with status Rejected', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await reject(created.applicationId, {
        rejectedReason: 'Test rejection',
        rejectedAt: todayDate(),
      });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: 1000 },
        createConflictError(
          'Cannot reserve application with status "Rejected". Application must be in "Approved" status.'
        )
      );
    });

    test('should reject reservation with status Withdrawn', async () => {
      const created = await createApplication();
      await withdraw(created.applicationId, {
        withdrawnReason: 'Test withdrawal',
        withdrawnAt: todayDate(),
      });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: 1000 },
        createConflictError(
          'Cannot reserve application with status "Withdrawn". Application must be in "Approved" status.'
        )
      );
    });

    test('should reject reservation with status Contract Signed', async () => {
      const created = await createApplication();
      await startReview(created.applicationId, {
        reviewStartedAt: todayDate(),
      });
      await approve(created.applicationId, { approvedAt: todayDate() });
      await signContract(created.applicationId, {
        contractSignedAt: todayDate(),
      });

      await reserve(
        created.applicationId,
        { reservedAt: todayDate(), reservedAmount: 1000 },
        createConflictError(
          'Cannot reserve application with status "Contract Signed". Application must be in "Approved" status.'
        )
      );
    });
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await reserve(
      id,
      { reservedAt: todayDate(), reservedAmount: 1000 },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
