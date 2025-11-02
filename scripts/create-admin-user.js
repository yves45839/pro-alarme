#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Administrateur';
  const role = process.env.ADMIN_ROLE ?? UserRole.ADMIN;

  if (!email || !password) {
    console.error('ADMIN_EMAIL et ADMIN_PASSWORD sont requis pour créer un utilisateur.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existingUser) {
    console.info(`Un utilisateur existe déjà avec l'email ${normalizedEmail}.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email: normalizedEmail,
      name,
      role,
      hashedPassword,
    },
  });

  console.info(`Utilisateur ${normalizedEmail} créé avec succès.`);
  console.info('Changez immédiatement le mot de passe après la première connexion.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
