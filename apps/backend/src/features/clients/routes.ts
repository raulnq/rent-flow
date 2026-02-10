import { Hono } from 'hono';
import { listRoute } from './list-clients.js';
import { addRoute } from './add-client.js';
import { getRoute } from './get-client.js';
import { editRoute } from './edit-client.js';

export const clientRoute = new Hono()
  .basePath('/clients')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
