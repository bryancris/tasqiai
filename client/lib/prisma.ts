import { PrismaClient } from '@prisma/client';


declare global {
// eslint-disable-next-line no-var
// eslint-disable-next-line vars-on-top
  var prismaGlobal: PrismaClient | undefined;
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line vars-on-top
}

export const prisma = global.prismaGlobal || new PrismaClient({
// eslint-disable-next-line no-var
// eslint-disable-next-line vars-on-top
  log: ['query', 'error', 'warn'],
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line vars-on-top
});

if (process.env.NODE_ENV === 'development') {
  global.prismaGlobal = prisma;
}

export default prisma;

