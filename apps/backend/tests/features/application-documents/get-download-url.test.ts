import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  createApplicationDocument,
  getApplicationDocumentDownloadUrl,
} from './application-document-dsl.js';
import { createApplication } from '../applications/application-dsl.js';
import { createNotFoundError } from '../../errors.js';

describe('Get Application Document Download URL Endpoint', () => {
  test('should return pre-signed URL for a document', async () => {
    const application = await createApplication();
    const document = await createApplicationDocument(
      application.applicationId,
      'Pay stubs'
    );

    const result = await getApplicationDocumentDownloadUrl(
      application.applicationId,
      document.applicationDocumentId
    );

    assert.ok(result.url, 'Expected URL to be present');
    assert.ok(result.url.length > 0, 'Expected URL to be non-empty');
    assert.strictEqual(result.expiresIn, 900, 'Expected URL to expire in 900s');
    assert.ok(
      result.url.includes(document.filePath),
      'Expected URL to contain the file path'
    );
  });

  test('should return 404 when application does not exist', async () => {
    const nonExistentApplicationId = '01940b6d-1234-7890-abcd-ef1234567890';
    const nonExistentDocumentId = '01940b6d-5678-7890-abcd-ef1234567890';

    await getApplicationDocumentDownloadUrl(
      nonExistentApplicationId,
      nonExistentDocumentId,
      createNotFoundError(`Application ${nonExistentApplicationId} not found`)
    );
  });

  test('should return 404 when document does not exist', async () => {
    const application = await createApplication();
    const nonExistentDocumentId = '01940b6d-5678-7890-abcd-ef1234567890';

    await getApplicationDocumentDownloadUrl(
      application.applicationId,
      nonExistentDocumentId,
      createNotFoundError(
        `Document ${nonExistentDocumentId} not found for application ${application.applicationId}`
      )
    );
  });

  test('should return 404 when document belongs to different application', async () => {
    const application1 = await createApplication();
    const application2 = await createApplication();

    const document = await createApplicationDocument(
      application1.applicationId,
      'Pay stubs'
    );

    await getApplicationDocumentDownloadUrl(
      application2.applicationId,
      document.applicationDocumentId,
      createNotFoundError(
        `Document ${document.applicationDocumentId} not found for application ${application2.applicationId}`
      )
    );
  });
});
