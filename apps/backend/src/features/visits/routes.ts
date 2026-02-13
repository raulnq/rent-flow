import { Hono } from 'hono';
import { listRoute } from './list-visits.js';
import { addRoute } from './add-visit.js';
import { editRoute } from './edit-visit.js';
import { completeRoute } from './complete-visit.js';
import { cancelRoute } from './cancel-visit.js';
import { noAttendRoute } from './no-attend-visit.js';

export const visitRoute = new Hono()
  .basePath('/applications/:applicationId/visits')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', editRoute)
  .route('/', completeRoute)
  .route('/', cancelRoute)
  .route('/', noAttendRoute);
