import { test, describe } from 'node:test';
import { createVisit, editVisit, assertVisit, nextWeek } from './visit-dsl.js';
import {
  emptyText,
  createValidationError,
  validationError,
  createNotFoundError,
} from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Edit Visit Endpoint', () => {
  test('should update scheduledAt and notes', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    const newScheduledAt = nextWeek();
    const updated = await editVisit(application.applicationId, visit.visitId, {
      scheduledAt: newScheduledAt,
      notes: 'Updated notes',
    });

    assertVisit(updated)
      .hasScheduledAt(new Date(newScheduledAt))
      .hasNotes('Updated notes');
  });

  test('should update only scheduledAt', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    const newScheduledAt = nextWeek();
    const updated = await editVisit(application.applicationId, visit.visitId, {
      scheduledAt: newScheduledAt,
      notes: visit.notes,
    });

    assertVisit(updated)
      .hasScheduledAt(new Date(newScheduledAt))
      .hasNotes(null);
  });

  test('should clear notes by setting to null', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    await editVisit(application.applicationId, visit.visitId, {
      scheduledAt: visit.scheduledAt.toISOString(),
      notes: 'Some notes',
    });

    const updated = await editVisit(application.applicationId, visit.visitId, {
      scheduledAt: visit.scheduledAt.toISOString(),
      notes: null,
    });

    assertVisit(updated).hasNotes(null);
  });

  test('should return 404 for non-existent visit', async () => {
    const application = await createApplication();
    const visitId = '01940b6d-1234-7890-abcd-ef1234567890';

    await editVisit(
      application.applicationId,
      visitId,
      { scheduledAt: nextWeek(), notes: null },
      createNotFoundError(`Visit ${visitId} not found`)
    );
  });

  test('should return 404 when visit belongs to different application', async () => {
    const app1 = await createApplication();
    const app2 = await createApplication();
    const visit = await createVisit(app1.applicationId);

    await editVisit(
      app2.applicationId,
      visit.visitId,
      { scheduledAt: nextWeek(), notes: null },
      createNotFoundError(`Visit ${visit.visitId} not found`)
    );
  });

  describe('Property validations', () => {
    const testCases = [
      {
        name: 'should reject invalid datetime format',
        input: { scheduledAt: 'invalid-datetime', notes: null },
        expectedError: createValidationError([
          {
            path: 'scheduledAt',
            message: 'Invalid datetime format',
            code: 'custom',
          },
        ]),
      },
      {
        name: 'should reject empty scheduledAt',
        input: { scheduledAt: emptyText, notes: null },
        expectedError: createValidationError([
          validationError.tooSmall('scheduledAt', 1),
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
        const visit = await createVisit(application.applicationId);
        await editVisit(
          application.applicationId,
          visit.visitId,
          input,
          expectedError
        );
      });
    }
  });
});
