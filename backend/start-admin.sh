#!/bin/bash

# Script de démarrage automatique du panneau admin

echo "🚀 Démarrage du Panneau Admin..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo -e "${RED}❌ Fichier .env non trouvé${NC}"
    echo "Création du fichier .env depuis env.example..."
    cp env.example .env
    echo -e "${YELLOW}⚠️  Veuillez éditer .env avec vos configurations avant de continuer${NC}"
    exit 1
fi

# Vérifier si Prisma est installé
if [ ! -f node_modules/.bin/prisma ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
fi

# Générer le client Prisma
echo -e "${GREEN}🔧 Génération du client Prisma...${NC}"
npx prisma generate

# Vérifier la connexion à la base de données
echo -e "${GREEN}🔍 Vérification de la connexion à la base de données...${NC}"
if npx prisma db pull > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connexion à la base de données OK${NC}"
else
    echo -e "${RED}❌ Impossible de se connecter à la base de données${NC}"
    echo -e "${YELLOW}⚠️  Vérifiez votre DATABASE_URL dans .env${NC}"
    echo ""
    echo "Pour créer la base de données PostgreSQL :"
    echo "  createdb admin_db"
    echo "  ou"
    echo "  psql -c 'CREATE DATABASE admin_db;'"
    exit 1
fi

# Appliquer les migrations
echo -e "${GREEN}📊 Application des migrations...${NC}"
npx prisma migrate dev --name init 2>&1 | tail -5

# Vérifier si un admin existe
ADMIN_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM admins;" 2>/dev/null | grep -o '[0-9]*' || echo "0")

if [ "$ADMIN_COUNT" = "0" ] || [ -z "$ADMIN_COUNT" ]; then
    echo -e "${YELLOW}⚠️  Aucun admin trouvé${NC}"
    echo ""
    echo "Création d'un admin de test..."
    echo "Email: admin@test.com"
    echo "Password: Admin123!"
    echo ""
    node scripts/create-admin.js admin@test.com "Admin123!" "Admin Test" SUPER_ADMIN || {
        echo -e "${RED}❌ Erreur lors de la création de l'admin${NC}"
        echo "Vous pouvez créer un admin manuellement avec :"
        echo "  node scripts/create-admin.js <email> <password> <fullName> <role>"
    }
fi

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

echo ""
echo -e "${GREEN}✅ Configuration terminée !${NC}"
echo ""
echo "Pour démarrer le serveur :"
echo "  npm run dev"
echo ""
echo "Le serveur sera accessible sur : http://localhost:3001"
echo "L'API sera accessible sur : http://localhost:3001/api"
