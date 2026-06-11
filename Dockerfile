# Étape 1 : Build de l'application Angular
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copie des fichiers de dépendances et installation propre
COPY package*.json ./
RUN npm ci

# Copie du reste du code source
COPY . .

# Build du projet Angular (génère dist/collector-front/browser et dist/collector-front/server)
RUN npm run build

# Étape 2 : Image de production Node.js légère pour le SSR
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Exécution en tant qu'utilisateur non-root pour la sécurité
USER node

# Copie des artefacts de build depuis l'étape builder
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --chown=node:node package*.json ./

# Installation uniquement des dépendances de production (allège considérablement l'image)
RUN npm ci --omit=dev

# Configuration de l'environnement
ENV NODE_ENV=production
ENV PORT=4000

# Port par défaut du serveur SSR Angular
EXPOSE 4000

# Démarrage du serveur Node.js SSR
CMD ["node", "dist/collector-front/server/server.mjs"]
