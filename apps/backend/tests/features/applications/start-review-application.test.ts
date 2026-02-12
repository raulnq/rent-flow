import { test, describe } from 'node:test';
import {
  createApplication,
  startReview,
  assertApplication,
  todayDate,
} from './application-dsl.js';
import { createNotFoundError } from '../../errors.js';
import assert from 'node:assert';

describe('Start Review Application Endpoint', () => {
  test('should start review on application with status New', async () => {
    const created = await createApplication();
    const updated = await startReview(created.applicationId, {
      reviewStartedAt: todayDate(),
    });

    assertApplication(updated).hasStatus('Under Review');
    assert.ok(updated.reviewStartedAt);
  });

  test('should set reviewStartedAt date', async () => {
    const created = await createApplication();
    const updated = await startReview(created.applicationId, {
      reviewStartedAt: todayDate(),
    });

    assert.ok(updated.reviewStartedAt);
    assert.strictEqual(typeof updated.reviewStartedAt, 'string');
  });

  test('should return 404 for non-existent application', async () => {
    const id = '01940b6d-1234-7890-abcd-ef1234567890';
    await startReview(
      id,
      { reviewStartedAt: todayDate() },
      createNotFoundError(`Application ${id} not found`)
    );
  });
});
