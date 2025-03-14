# Utilisation de l'image officielle Node.js
FROM node:18-alpine

# Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement package.json et package-lock.json pour optimiser la mise en cache
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install
# Installer explicitement framer-motion et react-icons
RUN npm install framer-motion react-icons

# Copier tout le projet dans le conteneur
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port sur lequel Next.js fonctionne
EXPOSE 3000

# Commande de démarrage de l'application
CMD ["npm", "run", "start"]
