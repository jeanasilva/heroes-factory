import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler } from './interfaces/http/middlewares/error-handler.js';
import { routes } from './interfaces/http/routes.js';

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : true
    })
  );
  app.use(express.json());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(routes);
  app.use(errorHandler);

  return app;
}
