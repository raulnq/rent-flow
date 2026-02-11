import { Hono } from 'hono';
import { listRoute } from './list-leads.js';
import { addRoute } from './add-lead.js';
import { getRoute } from './get-lead.js';
import { editRoute } from './edit-lead.js';

export const leadRoute = new Hono()
  .basePath('/leads')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
