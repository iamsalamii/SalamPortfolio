# 🚀 Moussa Abdou Salam — Portfolio & CMS Full-Stack .NET

> Portfolio professionnel haute performance et Système de Gestion de Contenu (Headless CMS) sur-mesure pour **Moussa Abdou Salam**, Développeur Full Stack .NET (C#, ASP.NET Core, EF Core, React, TypeScript).

---

## ✨ Points Forts & Fonctionnalités

* ⚡ **Architecture Full-Stack Hybride :** Backend API RESTful sécurisé sous Node.js & TypeScript avec persistance PostgreSQL et fallback disque JSON autonome.
* 🎨 **Design Épuré & Studio Graphique :** Typographie suisse moderne, modes Sombre 🌙 et Clair ☀️, adaptation bilingue instantanée (**Français / Anglais**).
* 🌊 **Canvas Liquide & Particules Réactives :** Physique ondulatoire fluide sous le curseur avec transitions cinématiques et micro-transforms 3D.
* 🎬 **Écran de Chargement Cinématique (Kinetic Intro) :** Typographie dynamique présentant les piliers de conception logicielle.
* 🛡️ **Console d'Administration Complète (CMS) :** Gestion en temps réel de votre profil, photo d'identité, biographie, piliers d'ingénierie, projets, technologies, expériences, formations, accréditations et messages reçus.

---

## 🔒 Blindage de Sécurité & Robustesse (17/17)

1. **Secrets & Clés d'API dans `.env` :** Aucun secret codé en dur dans le code source (`.env.example` fourni).
2. **Protection Git :** `.env` et fichiers sensibles systématiquement exclus via `.gitignore`.
3. **Rate Limiting Anti-Bruteforce :** Protection stricte sur `/api/auth/login` (5 essais max / 15 min) et sur le formulaire de contact.
4. **Requêtes Paramétrées & Anti-SQLi :** Requêtes PostgreSQL préparées `$1, $2` garantissant l'étanchéité des données.
5. **Hachage Fort Bcrypt :** Mots de passe administrateur chiffrés avec 10 tours de sel (Salt Rounds).
6. **Vérification Côté Serveur (RBAC) :** Middleware `requireAdminAuth` validant l'authenticité et la signature HMAC des tokens.
7. **HTTPS & En-têtes de Sécurité :** HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, CSP.
8. **Sessions à Expiration :** Tokens cryptographiques limités à 8 heures de validité.
9. **Assainissement des Entrées & Anti-XSS :** Validation stricte des types et expressions régulières avant écriture.
10. **Taille Maximale des Payloads :** Plafond d'upload sécurisé à 5 Mo max.
11. **Protection Anti-Spam Honeypot :** Piège invisible bloquant automatiquement les robots sur le formulaire de contact.
12. **CORS Restreint :** Configuration d'origines autorisées en production via `ALLOWED_ORIGINS`.
13. **Messages d'Erreur Génériques :** Aucun détail technique ni stack trace divulgué en cas d'erreur.
14. **Mode Production Non-Verbeux :** Suppression automatique des logs verbeux en environnement de production.

---

## 🛠️ Installation & Lancement Local

### Prérequis
* **Node.js** (v18+ recommandé)
* **npm** ou **bun**

### 1. Cloner le dépôt
```bash
git clone https://github.com/iamsalamii/SalamPortfolio.git
cd SalamPortfolio
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement
Copiez le fichier de configuration exemple :
```bash
cp .env.example .env
```

### 4. Démarrer en mode développement
```bash
npm run dev
```
L'application est accessible sur : `http://localhost:3000`

### 5. Compiler et lancer en production
```bash
npm run build
npm start
```

---

## 🔐 Identifiants d'Accès CMS (Espace Administration)

Pour accéder à la console de gestion :
* Cliquez sur le bouclier 🛡️ dans la barre de navigation ou rendez-vous sur `http://localhost:3000/#admin`.
* **Identifiant / Email :** `salam@portfolios.com`
* **Mot de passe :** `Adm!n123@`

*(Vous pouvez modifier ces identifiants à tout moment dans votre fichier `.env` via `ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH`).*

---

## 🌐 Guide Complet de Mise en Ligne (Déploiement en Production)

```mermaid
flowchart LR
    A["1. Dépôt GitHub"] --> B["2. Hébergeur Cloud (Render / Railway / VPS)"]
    B --> C["3. Base PostgreSQL (Neon / Supabase)"]
    C --> D["4. Nom de Domaine & SSL (ex: moussasalam.dev)"]
```

### Étape 1 : Nom de Domaine Personnalisé
1. Achetez votre nom de domaine sur **Namecheap**, **OVH**, **Porkbun** ou **Hostinger** (ex: `moussasalam.dev` ou `salam-developer.com`).

---

### Étape 2 : Déploiement sur un Hébergeur Cloud (Render / Railway)

#### Méthode Recommandée : Render.com (Simple & Automatisé)
1. Créez un compte gratuit sur [Render.com](https://render.com).
2. Cliquez sur **New +** ➔ **Web Service**.
3. Connectez votre dépôt GitHub `https://github.com/iamsalamii/SalamPortfolio.git`.
4. Configurez les paramètres :
   * **Runtime :** Node
   * **Build Command :** `npm install && npm run build`
   * **Start Command :** `npm start`
5. Dans l'onglet **Environment Variables**, ajoutez :
   * `NODE_ENV` = `production`
   * `PORT` = `3000`
   * `JWT_SECRET` = *(Une chaîne aléatoire sécurisée de plus de 32 caractères)*
   * `ADMIN_EMAIL` = `salam@portfolios.com`
   * `ADMIN_PASSWORD_HASH` = *(Hash Bcrypt de votre mot de passe)*
   * `DATABASE_URL` = *(URL de votre base PostgreSQL)*

---

### Étape 3 : Base de Données PostgreSQL Cloud (Gratuite)
1. Créez un compte sur [Neon.tech](https://neon.tech) ou [Supabase.com](https://supabase.com).
2. Créez un nouveau projet PostgreSQL.
3. Copiez la chaîne de connexion (`Connection String`) :
   ```env
   DATABASE_URL=postgresql://neondb_owner:password@ep-cool-mountain.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Collez cette valeur dans les variables d'environnement sur Render. **Le serveur créera et migrera automatiquement les tables de données au premier lancement.**

---

### Étape 4 : Lier votre Nom de Domaine & Activer le SSL (HTTPS)
1. Sur Render, allez dans la section **Custom Domains** et saisissez votre domaine (ex: `moussasalam.dev` et `www.moussasalam.dev`).
2. Rendez-vous dans la zone de gestion DNS de votre registrar (Namecheap / OVH) :
   * **Enregistrement CNAME :**
     * Hôte : `www`
     * Valeur : `votre-app.onrender.com`
   * **Enregistrement A / ALIAS :**
     * Hôte : `@`
     * Valeur : IP fournie par Render / Hébergeur.
3. Le certificat SSL (HTTPS 🔒) est généré et renouvelé **automatiquement et gratuitement** par l'hébergeur.

---

## 👨‍💻 Auteur

**Moussa Abdou Salam**
* **Rôle :** Développeur Full Stack .NET (C#, ASP.NET Core, React)
* **Expérience :** +2 ans d'expérience (GROUPE DIRECTSOFT)
* **LinkedIn :** [Abdou salam Moussa](https://linkedin.com/in/abdou-salam-moussa)
* **Email :** `moussasalam86@gmail.com`
* **Localisation :** Abidjan, Côte d'Ivoire
