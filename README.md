<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🚀 Déploiement sur Vercel (Guide Étape par Étape)

Le projet a été spécialement configuré pour un déploiement Serverless sur **Vercel** avec API Express (Routes Serverless `/api/*`) et Frontend React Vite.

---

### 📋 1. Importation sur GitHub & Vercel
1. Poussez votre code sur un dépôt **GitHub** (via l'export AI Studio ou `git push`).
2. Rendez-vous sur votre dashboard **Vercel** (`https://vercel.com/new`) et importez le dépôt.
3. Vercel détectera automatiquement la configuration grâce aux fichiers `vercel.json` et `api/index.ts`.

---

### 🔑 2. Variables d'environnement à configurer sur Vercel
Dans les paramètres de votre projet Vercel (*Settings > Environment Variables*), ajoutez les clés suivantes :

| Variable | Description / Exemple |
| :--- | :--- |
| `BREVO_API_KEY` | Clé API Brevo pour l'envoi d'e-mails réels (`xkeysib-...`) |
| `SENDER_EMAIL` | Adresse expéditeur validée sur Brevo (`ecole22102@gmail.com`) |
| `DATABASE_URL` | URL PostgreSQL Neon / Supabase pour la BDD Prisma |
| `CLOUDINARY_CLOUD_NAME` | Identifiant Cloudinary (`djp423xyr`) |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary |
| `CLOUDINARY_UPLOAD_PRESET` | Preset d'envoi (`ml_default`) |
| `REDIS_URL` | URL Upstash Redis pour le cache |
| `GEMINI_API_KEY` | Clé API Gemini Google AI Studio |

---

### 🛠️ 3. Structure des Fichiers de Déploiement Vercel
- **`vercel.json`** : Redirige tout le trafic `/api/*` vers la fonction Serverless Express `/api/index.ts` et le reste vers le build Vite (`dist/`).
- **`api/index.ts`** : Point d'entrée Serverless Express exportant le routeur global de l'application.

---

### ⚡ 4. Lancer le déploiement
Cliquez sur **Deploy** sur Vercel. En moins de 2 minutes, votre application sera en ligne avec son API backend active et fonctionnelle !

