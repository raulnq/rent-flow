import { test, describe } from 'node:test';
import {
  addApplicationDocument,
  assertApplicationDocument,
  pdfDocument,
  imageDocument,
  wordDocument,
  oversizedFile,
  invalidFileType,
  createMockFile,
} from './application-document-dsl.js';
import { createValidationError, createNotFoundError } from '../../errors.js';
import { createApplication } from '../applications/application-dsl.js';

describe('Add Application Document Endpoint', () => {
  test('should upload a PDF document with valid data', async () => {
    const application = await createApplication();
    const { type, file } = pdfDocument();
    const doc = await addApplicationDocument(
      application.applicationId,
      type,
      file
    );

    assertApplicationDocument(doc)
      .hasApplicationId(application.applicationId)
      .hasFileName(file.name)
      .hasContentType(file.type)
      .hasDocumentType(type)
      .hasNotes(null)
      .hasFilePath();
  });

  test('should upload an image document', async () => {
    const application = await createApplication();
    const { type, file } = imageDocument();
    const doc = await addApplicationDocument(
      application.applicationId,
      type,
      file
    );

    assertApplicationDocument(doc)
      .hasApplicationId(application.applicationId)
      .hasFileName(file.name)
      .hasContentType(file.type)
      .hasDocumentType(type)
      .hasFilePath();
  });

  test('should upload a Word document', async () => {
    const application = await createApplication();
    const { type, file } = wordDocument();
    const doc = await addApplicationDocument(
      application.applicationId,
      type,
      file
    );

    assertApplicationDocument(doc)
      .hasApplicationId(application.applicationId)
      .hasFileName(file.name)
      .hasContentType(file.type)
      .hasDocumentType(type)
      .hasFilePath();
  });

  test('should return 404 for non-existent application', async () => {
    const applicationId = '01940b6d-1234-7890-abcd-ef1234567890';
    const { type, file } = pdfDocument();

    await addApplicationDocument(
      applicationId,
      type,
      file,
      createNotFoundError(`Application ${applicationId} not found`)
    );
  });

  describe('File validation', () => {
    test('should reject file size exceeding 50MB', async () => {
      const application = await createApplication();
      const { type, file } = oversizedFile();

      await addApplicationDocument(
        application.applicationId,
        type,
        file,
        createValidationError([
          {
            path: 'file',
            message: 'File size must not exceed 50MB',
            code: 'custom',
          },
        ])
      );
    });

    test('should reject invalid file type', async () => {
      const application = await createApplication();
      const { type, file } = invalidFileType();

      await addApplicationDocument(
        application.applicationId,
        type,
        file,
        createValidationError([
          {
            path: 'file',
            message: 'File type must be an image, PDF, or Word document',
            code: 'custom',
          },
        ])
      );
    });
  });

  describe('Document type validation', () => {
    const testCases = [
      {
        name: 'should accept "Identity document"',
        documentType: 'Identity document',
      },
      {
        name: 'should accept "Credit report"',
        documentType: 'Credit report',
      },
      {
        name: 'should accept "Pay stubs"',
        documentType: 'Pay stubs',
      },
      {
        name: 'should accept "Other"',
        documentType: 'Other',
      },
    ];

    for (const { name, documentType } of testCases) {
      test(name, async () => {
        const application = await createApplication();
        const file = createMockFile();
        const doc = await addApplicationDocument(
          application.applicationId,
          documentType,
          file
        );
        assertApplicationDocument(doc).hasDocumentType(documentType);
      });
    }
  });
});
