/**
 * SCRIPT DE CRÉATION D'UN ADMIN
 * 
 * Usage: node scripts/create-admin.js <email> <password> <fullName> <role>
 * 
 * Exemple:
 * node scripts/create-admin.js admin@example.com SecurePass123! "Super Admin" SUPER_ADMIN
 */

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.error('Usage: node create-admin.js <email> <password> <fullName> <role>');
    console.error('Roles: SUPER_ADMIN, ADMIN, SUPPORT');
    process.exit(1);
  }
  
  const [email, password, fullName, role] = args;
  
  // Valider le rôle
  const validRoles = ['SUPER_ADMIN', 'ADMIN', 'SUPPORT'];
  if (!validRoles.includes(role)) {
    console.error(`Rôle invalide. Rôles valides: ${validRoles.join(', ')}`);
    process.exit(1);
  }
  
  // Valider le mot de passe
  if (password.length < 12) {
    console.error('Le mot de passe doit contenir au moins 12 caractères');
    process.exit(1);
  }
  
  try {
    // Vérifier si l'admin existe déjà
    const existing = await prisma.admin.findUnique({
      where: { email }
    });
    
    if (existing) {
      console.error(`Un admin avec l'email ${email} existe déjà`);
      process.exit(1);
    }
    
    // Hasher le mot de passe
    console.log('Hachage du mot de passe...');
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    // Créer l'admin
    console.log('Création de l\'admin...');
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        isActive: true
      }
    });
    
    console.log('\n✅ Admin créé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ID: ${admin.id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Nom: ${admin.fullName}`);
    console.log(`Rôle: ${admin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Activez le 2FA après la première connexion !');
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
