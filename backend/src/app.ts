import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '../swagger/swagger.js';

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import sessionRoutes from './routes/session.routes.js';
import uploadRoutes from './routes/upload.routes.js';

import {
    apiLimiter,
} from './middleware/rateLimit.middleware.js';

import {
    errorMiddleware,
} from './middleware/error.middleware.js';

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

/*
|--------------------------------------------------------------------------
| Rate Limit
|--------------------------------------------------------------------------
*/

app.use(apiLimiter);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server Running',
    });
});

/*
|--------------------------------------------------------------------------
| Swagger
|--------------------------------------------------------------------------
*/

app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use(
    '/api/auth',
    authRoutes
);

app.use(
    '/api/profile',
    profileRoutes
);

app.use(
    '/api/onboarding',
    onboardingRoutes
);

app.use(
    '/api/sessions',
    sessionRoutes
);

app.use(
    '/api/uploads',
    uploadRoutes
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use('*', (_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorMiddleware);

export default app;