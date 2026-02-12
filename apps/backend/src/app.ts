import { Hono } from 'hono';
import { onError } from './middlewares/on-error.js';
import { onNotFound } from './middlewares/on-not-found.js';
import { clerkMiddleware, requireAuth } from './middlewares/auth.js';
import { ENV } from './env.js';
import { secureHeaders } from 'hono/secure-headers';
import { cors } from 'hono/cors';
import { pinoLogger } from 'hono-pino';
import { logger } from './logger.js';
import { applicationRoute } from './features/applications/routes.js';
import { clientRoute } from './features/clients/routes.js';
import { leadRoute } from './features/leads/routes.js';
import { propertyRoute } from './features/properties/routes.js';

export const app = new Hono({ strict: false })
  .use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }))
  .use(
    pinoLogger({
      pino: logger,
      http: {
        onReqBindings: c => ({
          req: {
            method: c.req.method,
            path: c.req.path,
          },
        }),
      },
    })
  )
  .use(secureHeaders())
  .use('*', clerkMiddleware())
  .use('/api/*', requireAuth)
  .get('/live', c =>
    c.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: Date.now(),
    })
  )
  .route('/api', applicationRoute)
  .route('/api', clientRoute)
  .route('/api', leadRoute)
  .route('/api', propertyRoute)
  .notFound(onNotFound)
  .onError(onError);

export type App = typeof app;
