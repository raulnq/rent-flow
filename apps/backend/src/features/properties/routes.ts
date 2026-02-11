import { Hono } from 'hono';
import { listRoute } from './list-properties.js';
import { addRoute } from './add-property.js';
import { getRoute } from './get-property.js';
import { editRoute } from './edit-property.js';

export const propertyRoute = new Hono()
  .basePath('/properties')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute);
