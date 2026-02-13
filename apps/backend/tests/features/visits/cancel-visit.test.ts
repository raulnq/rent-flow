import { test, describe } from 'node:test';
import { createVisit, cancelVisit, assertVisit } from './visit-dsl.js';
import {
  emptyText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Cancel Visit Endpoint', () => {
  test('should cancel visit with cancellationReason', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    const updated = await cancelVisit(
      application.applicationId,
      visit.visitId,
      { cancellationReason: 'Client requested cancellation' }
    );

    assertVisit(updated)
      .hasStatus('Cancelled')
      .hasCancellationReason('Client requested cancellation');
  });

  test('should preserve other fields when cancelling', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    const updated = await cancelVisit(
      application.applicationId,
      visit.visitId,
      { cancellationReason: 'Weather conditions' }
    );

    assertVisit(updated)
      .hasStatus('Cancelled')
      .hasScheduledAt(visit.scheduledAt)
      .hasNotes(null)
      .hasCancellationReason('Weather conditions');
  });

  test('should return 404 for non-existent visit', async () => {
    const application = await createApplication();
    const visitId = '01940b6d-1234-7890-abcd-ef1234567890';

    await cancelVisit(
      application.applicationId,
      visitId,
      { cancellationReason: 'Test' },
      createNotFoundError(`Visit ${visitId} not found`)
    );
  });

  test('should return 404 when visit belongs to different application', async () => {
    const app1 = await createApplication();
    const app2 = await createApplication();
    const visit = await createVisit(app1.applicationId);

    await cancelVisit(
      app2.applicationId,
      visit.visitId,
      { cancellationReason: 'Test' },
      createNotFoundError(`Visit ${visit.visitId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject empty cancellationReason',
        input: { cancellationReason: emptyText },
        expectedError: createValidationError([
          validationError.tooSmall('cancellationReason', 1),
        ]),
      },
    ];

    for (const { name, input, expectedError } of testCases) {
      test(name, async () => {
        const application = await createApplication();
        const visit = await createVisit(application.applicationId);
        await cancelVisit(
          application.applicationId,
          visit.visitId,
          input,
          expectedError
        );
      });
    }
  });
});
