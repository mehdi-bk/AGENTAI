/**
 * ROUTES DE GESTION DES ADMINS
 * 
 * Gère les opérations sur les comptes admin
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { requireRole } from '../middleware/authMiddleware.js';
import { logAdminAction } from '../middleware/auditLog.js';

const router = express.Router();
const prisma = new PrismaClient();
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * GET /api/admin/admins
 * Liste tous les admins (Super Admin uniquement)
 */
router.get('/admins', requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        twoFactorEnabled: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des admins:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des admins'
    });
  }
});

/**
 * GET /api/admin/audit-logs
 * Récupère les logs d'audit
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      adminId,
      action,
      resource,
      startDate,
      endDate
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    
    if (adminId) {
      where.adminId = adminId;
    }
    
    if (action) {
      where.action = action;
    }
    
    if (resource) {
      where.resource = resource;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          }
        }
      }),
      prisma.auditLog.count({ where })
    ]);
    
    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logs'
    });
  }
});

/**
 * GET /api/admin/profile
 * Récupère le profil de l'admin connecté
 */
router.get('/profile', async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        twoFactorEnabled: true,
        lastLogin: true,
        createdAt: true
      }
    });
    
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

/**
 * POST /api/admin/create-admin
 * Crée un nouveau compte admin (Super Admin uniquement)
 */
router.post('/create-admin',
  requireRole('SUPER_ADMIN'),
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 12 }),
    body('fullName').notEmpty(),
    body('role').isIn(['ADMIN', 'SUPPORT'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors: errors.array()
        });
      }
      
      const { email, password, fullName, role } = req.body;
      
      // Vérifier si l'email existe déjà
      const existing = await prisma.admin.findUnique({
        where: { email }
      });
      
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Un admin avec cet email existe déjà'
        });
      }
      
      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      
      // Créer l'admin
      const admin = await prisma.admin.create({
        data: {
          email,
          passwordHash,
          fullName,
          role
        }
      });
      
      await logAdminAction(
        req.admin.id,
        'CREATE',
        'ADMIN',
        admin.id,
        { email, role }
      );
      
      res.status(201).json({
        success: true,
        data: {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'admin'
      });
    }
  }
);

export default router;
