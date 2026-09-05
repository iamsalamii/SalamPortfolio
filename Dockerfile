# ===================================================================
# DOCKERFILE - PORTFOLIO CMS SALAM.DEV (PRODUCTION COOLIFY)
# Multi-stage build: Node.js 22 Alpine (Optimisé & Ultra-Léger)
# ===================================================================

# --- ÉTAPE 1 : BUILD ---
FROM node:22-alpine AS builder

WORKDIR /app

# Installation des dépendances système requises pour le build
RUN apk add --no-cache libc6-compat

# Copie des fichiers de configuration de paquets
COPY package.json package-lock.json* ./

# Installation complète des dépendances (y compris dev pour build)
RUN npm ci

# Copie du code source complet
COPY . .

# Compilation Vite (Frontend React) + esbuild (Backend Server)
RUN npm run build

# --- ÉTAPE 2 : RUNNER PRODUCTION ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextuser

# Copie des dépendances de production uniquement
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copie des artefacts compilés depuis l'étape de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/portfolio-cms-data.json ./portfolio-cms-data.json

# Attribution des droits à l'utilisateur de sécurité
RUN chown -R nextuser:nodejs /app

USER nextuser

# Exposition du port d'écoute HTTP
EXPOSE 3000

# Health check automatique du conteneur
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Démarrage du serveur Node.js compilé
CMD ["node", "dist/server.cjs"]
