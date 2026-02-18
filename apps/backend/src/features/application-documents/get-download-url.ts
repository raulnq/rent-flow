import { Hono } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { applicationDocuments } from './application-document.js';
import { zValidator } from '#/validator.js';
import { client } from '#/database/client.js';
import { eq, and } from 'drizzle-orm';
import { applicationDocumentSchema } from './schemas.js';
import { applications } from '#/features/applications/application.js';
import { notFoundError } from '#/extensions.js';
import { getPresignedDownloadUrl } from './s3-client.js';

const paramSchema = applicationDocumentSchema.pick({
  applicationId: true,
  applicationDocumentId: true,
});

export const getDownloadUrlRoute = new Hono().get(
  '/:applicationDocumentId/download-url',
  zValidator('param', paramSchema),
  async c => {
    const { applicationId, applicationDocumentId } = c.req.valid('param');

    // Verify application exists
    const [application] = await client
      .select()
      .from(applications)
      .where(eq(applications.applicationId, applicationId))
      .limit(1);

    if (!application) {
      return notFoundError(c, `Application ${applicationId} not found`);
    }

    // Verify document exists and belongs to application
    const [document] = await client
      .select()
      .from(applicationDocuments)
      .where(
        and(
          eq(applicationDocuments.applicationDocumentId, applicationDocumentId),
          eq(applicationDocuments.applicationId, applicationId)
        )
      )
      .limit(1);

    if (!document) {
      return notFoundError(
        c,
        `Document ${applicationDocumentId} not found for application ${applicationId}`
      );
    }

    // Generate pre-signed URL (valid for 15 minutes)
    const url = await getPresignedDownloadUrl(document.filePath, 900);

    return c.json({ url, expiresIn: 900 }, StatusCodes.OK);
  }
);
