import 'dotenv/config';

import app from './app.js';

import { env } from './config/env.js';

import { prisma } from './config/prisma.js';

async function bootstrap() {
  try {
    await prisma.$connect();

    console.log(
      'Database Connected'
    );

    app.listen(
      env.PORT,
      () => {
        console.log(
          `Server running on port ${env.PORT}`
        );
      }
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

bootstrap();