import { Hono } from 'hono';
import { listRoute } from './list-applications.js';
import { addRoute } from './add-application.js';
import { getRoute } from './get-application.js';
import { editRoute } from './edit-application.js';
import { startReviewRoute } from './start-review-application.js';
import { approveRoute } from './approve-application.js';
import { rejectRoute } from './reject-application.js';
import { withdrawRoute } from './withdraw-application.js';
import { signContractRoute } from './sign-contract-application.js';

export const applicationRoute = new Hono()
  .basePath('/applications')
  .route('/', listRoute)
  .route('/', addRoute)
  .route('/', getRoute)
  .route('/', editRoute)
  .route('/', startReviewRoute)
  .route('/', approveRoute)
  .route('/', rejectRoute)
  .route('/', withdrawRoute)
  .route('/', signContractRoute);
