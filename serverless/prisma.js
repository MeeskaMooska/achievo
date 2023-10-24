// prisma.js
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  // In production, create a single instance of Prisma Client
  prisma = new PrismaClient();
} else {
  // In development, reuse the existing instance if available or create a new one
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
