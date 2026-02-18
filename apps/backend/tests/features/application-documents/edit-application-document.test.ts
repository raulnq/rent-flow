import { test, describe } from 'node:test';
import {
  createApplicationDocument,
  editApplicationDocument,
  assertApplicationDocument,
} from './application-document-dsl.js';
import { createNotFoundError } from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Edit Application Document Endpoint', () => {
  test('should update notes field', async () => {
    const application = await createApplication();
    const doc = await createApplicationDocument(
      application.applicationId,
      'Pay stubs'
    );

    const updatedDoc = await editApplicationDocument(
      application.applicationId,
      doc.applicationDocumentId,
      { notes: 'Updated notes for this document' }
    );

    assertApplicationDocument(updatedDoc)
      .hasApplicationId(application.applicationId)
      .hasFileName(doc.fileName)
      .hasNotes('Updated notes for this document');
  });

  test('should update notes to null', async () => {
    const application = await createApplication();
    const doc = await createApplicationDocument(
      application.applicationId,
      'Pay stubs'
    );

    // First set notes
    await editApplicationDocument(
      application.applicationId,
      doc.applicationDocumentId,
      { notes: 'Some notes' }
    );

    // Then set to null
    const updatedDoc = await editApplicationDocument(
      application.applicationId,
      doc.applicationDocumentId,
      { notes: null }
    );

    assertApplicationDocument(updatedDoc).hasNotes(null);
  });

  test('should preserve other fields when updating notes', async () => {
    const application = await createApplication();
    const doc = await createApplicationDocument(
      application.applicationId,
      'Credit report'
    );

    const updatedDoc = await editApplicationDocument(
      application.applicationId,
      doc.applicationDocumentId,
      { notes: 'New notes' }
    );

    assertApplicationDocument(updatedDoc)
      .hasFileName(doc.fileName)
      .hasContentType(doc.contentType)
      .hasDocumentType(doc.documentType)
      .hasFilePath();
  });

  test('should return 404 for non-existent document', async () => {
    const application = await createApplication();
    const documentId = '01940b6d-1234-7890-abcd-ef1234567890';

    await editApplicationDocument(
      application.applicationId,
      documentId,
      { notes: 'Some notes' },
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

    await editApplicationDocument(
      app2.applicationId,
      doc.applicationDocumentId,
      { notes: 'Some notes' },
      createNotFoundError(
        `Application document ${doc.applicationDocumentId} not found`
      )
    );
  });
});
