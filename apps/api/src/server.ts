import { env } from './config/env.js';
import { prisma } from './infra/database/prisma/prisma-client.js';
import { buildApp } from './app.js';

const app = buildApp();

const server = app.listen(env.API_PORT, env.API_HOST, () => {
  console.log(`HTTP server running on http://${env.API_HOST}:${env.API_PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Closing server...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
