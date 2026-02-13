import { test, describe } from 'node:test';
import assert from 'node:assert';
import { addVisit, assertVisit, scheduledVisit } from './visit-dsl.js';
import {
  emptyText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Add Visit Endpoint', () => {
  test('should create a new visit with valid scheduledAt', async () => {
    const application = await createApplication();
    const input = scheduledVisit();
    const visit = await addVisit(application.applicationId, input);

    assertVisit(visit)
      .hasApplicationId(application.applicationId)
      .hasStatus('Scheduled')
      .hasScheduledAt(new Date(input.scheduledAt))
      .hasNotes(null)
      .hasCancellationReason(null);
  });

  test('should auto-set status to Scheduled', async () => {
    const application = await createApplication();
    const visit = await addVisit(application.applicationId, scheduledVisit());
    assertVisit(visit).hasStatus('Scheduled');
  });

  test('should auto-generate createdAt', async () => {
    const application = await createApplication();
    const visit = await addVisit(application.applicationId, scheduledVisit());
    assert.ok(visit.createdAt instanceof Date);
  });

  test('should return 404 for non-existent application', async () => {
    const applicationId = '01940b6d-1234-7890-abcd-ef1234567890';
    await addVisit(
      applicationId,
      scheduledVisit(),
      createNotFoundError(`Application ${applicationId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty scheduledAt',
        input: { scheduledAt: emptyText },
        expectedError: createValidationError([
          validationError.tooSmall('scheduledAt', 1),
          {
            path: 'scheduledAt',
            message: 'Invalid datetime format',
            code: 'custom',
          },
        ]),
      },
      {
        name: 'should reject invalid datetime format',
        input: { scheduledAt: 'invalid-datetime' },
        expectedError: createValidationError([
          {
            path: 'scheduledAt',
            message: 'Invalid datetime format',
            code: 'custom',
          },
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const application = await createApplication();
        await addVisit(application.applicationId, input, expectedError);
      });
    }
  });
});
