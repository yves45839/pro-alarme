import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

const createPrismaClient = (url: string) =>
  new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

const prisma =
  globalForPrisma.prisma ??
  (databaseUrl
    ? createPrismaClient(databaseUrl)
    : new Proxy({} as PrismaClient, {
        get() {
          throw new Error(
            'DATABASE_URL is not defined. Set it in your environment before using the database client.',
          );
        },
      }));

if (databaseUrl && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
