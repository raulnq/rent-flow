import { Hono } from 'hono';
import { listRoute } from './list-application-documents.js';
import { addRoute } from './add-application-document.js';
import { editRoute } from './edit-application-document.js';
import { deleteRoute } from './delete-application-document.js';

export const applicationDocumentRoute = new Hono()
  .basePath('/applications/:applicationId/documents')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', editRoute)
  .route('/', deleteRoute);
