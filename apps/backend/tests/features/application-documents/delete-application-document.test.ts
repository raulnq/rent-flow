import { test, describe } from 'node:test';
import {
  createApplicationDocument,
  deleteApplicationDocument,
  listApplicationDocuments,
} from './application-document-dsl.js';
import { assertPage } from '../../assertions.js';
import { createNotFoundError } from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Delete Application Document Endpoint', () => {
  test('should delete an existing document', async () => {
    const application = await createApplication();
    const doc = await createApplicationDocument(
      application.applicationId,
      'Pay stubs'
    );

    await deleteApplicationDocument(
      application.applicationId,
      doc.applicationDocumentId
    );

    // Verify document no longer exists in list
    const page = await listApplicationDocuments(application.applicationId, {
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasEmptyResult();
  });

  test('should only delete the specified document', async () => {
    const application = await createApplication();
    const doc1 = await createApplicationDocument(
      application.applicationId,
      'Pay stubs'
    );

    await createApplicationDocument(application.applicationId, 'Credit report');

    await deleteApplicationDocument(
      application.applicationId,
      doc1.applicationDocumentId
    );

    // Verify only doc1 was deleted
    const page = await listApplicationDocuments(application.applicationId, {
      pageSize: 10,
      pageNumber: 1,
    });

    assertPage(page).hasItemsCount(1).hasTotalCount(1);
  });

  test('should return 404 for non-existent document', async () => {
    const application = await createApplication();
    const documentId = '01940b6d-1234-7890-abcd-ef1234567890';

    await deleteApplicationDocument(
      application.applicationId,
      documentId,
      createNotFoundError(`Application document ${documentId} not found`)
    );
  });

  test('should return 404 when document belongs to different application', async () => {
    const app1 = await createApplication();
    const app2 = await createApplication();

    const doc = await createApplicationDocument(
      app1.applicationId,
      'Pay stubs'
    );

    await deleteApplicationDocument(
      app2.applicationId,
      doc.applicationDocumentId,
      createNotFoundError(
        `Application document ${doc.applicationDocumentId} not found`
      )
    );
  });
});
