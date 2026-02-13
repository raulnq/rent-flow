import { test, describe } from 'node:test';
import { createVisit, completeVisit, assertVisit } from './visit-dsl.js';
import { createNotFoundError } from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Complete Visit Endpoint', () => {
  test('should mark visit as Completed', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    const updated = await completeVisit(
      application.applicationId,
      visit.visitId
    );

    assertVisit(updated).hasStatus('Completed');
  });

  test('should only update status field', async () => {
    const application = await createApplication();
    const visit = await createVisit(application.applicationId);

    const updated = await completeVisit(
      application.applicationId,
      visit.visitId
    );

    assertVisit(updated)
      .hasStatus('Completed')
      .hasScheduledAt(visit.scheduledAt)
      .hasNotes(null)
      .hasCancellationReason(null);
  });

  test('should return 404 for non-existent visit', async () => {
    const application = await createApplication();
    const visitId = '01940b6d-1234-7890-abcd-ef1234567890';

    await completeVisit(
      application.applicationId,
      visitId,
      createNotFoundError(`Visit ${visitId} not found`)
    );
  });

  test('should return 404 when visit belongs to different application', async () => {
    const app1 = await createApplication();
    const app2 = await createApplication();
    const visit = await createVisit(app1.applicationId);

    await completeVisit(
      app2.applicationId,
      visit.visitId,
      createNotFoundError(`Visit ${visit.visitId} not found`)
    );
  });
});
