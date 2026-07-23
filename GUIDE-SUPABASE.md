# Guide Supabase — Base de données & comptes clients

Ce guide vous permet d'activer une vraie base de données pour vos produits et des comptes clients, en 15-20 minutes, sans écrire de code serveur.

## 1. Créer votre projet Supabase (gratuit)

1. Allez sur **[supabase.com](https://supabase.com)** → **Start your project**
2. Connectez-vous avec GitHub (le compte que vous venez de créer) — c'est le plus rapide
3. Cliquez **New project**
4. Choisissez :
   - **Name** : `chine-express-afrique`
   - **Database Password** : générez-en un et **copiez-le dans un endroit sûr** (vous n'en aurez normalement plus besoin après, mais gardez-le au cas où)
   - **Region** : choisissez la plus proche de vos clients, par exemple `Europe (Frankfurt)` ou `Europe (Paris)`
5. Cliquez **Create new project** — patientez 1-2 minutes le temps que le projet se prépare

## 2. Créer les tables (produits, comptes clients, commandes)

1. Dans le menu de gauche, cliquez **SQL Editor**
2. Cliquez **New query**
3. Ouvrez le fichier `supabase-schema.sql` (fourni avec ce site), **copiez tout son contenu**
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez **Run** (ou Ctrl+Entrée)
6. Vous devriez voir "Success. No rows returned" — c'est normal, ça veut dire que les tables ont été créées
7. Vérifiez : dans le menu de gauche, cliquez **Table Editor** — vous devriez voir 3 tables : `produits`, `profils`, `commandes`

## 3. Récupérer vos clés de connexion

1. Dans le menu de gauche, cliquez l'icône **⚙️ Project Settings**
2. Cliquez **API** (dans la section "Configuration")
3. Vous voyez deux informations à copier :
   - **Project URL** (ressemble à `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** (une longue clé qui commence différemment selon les projets) — c'est une clé **publique**, elle est faite pour être visible dans le code du site, ce n'est pas un secret

## 4. Connecter votre site à Supabase

1. Ouvrez le fichier `js/supabase-config.js` dans votre projet
2. Remplacez :
   ```js
   const SUPABASE_URL = "VOTRE_URL_SUPABASE";
   const SUPABASE_ANON_KEY = "VOTRE_CLE_PUBLIQUE";
   ```
   par vos vraies valeurs copiées à l'étape 3, par exemple :
   ```js
   const SUPABASE_URL = "https://xxxxxxxxxxxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```
3. Enregistrez le fichier

## 5. Ajouter vos produits dans la base

Vous avez deux options :

**Option simple — directement dans Supabase** :
1. Dans Supabase, **Table Editor** → table `produits`
2. Cliquez **Insert** → **Insert row**
3. Remplissez les champs (id, nom, categorie, prix, image, description...) et validez
4. Répétez pour chaque produit

**Option rapide — importer tous les produits d'un coup** :
Revenez vers Claude avec ce projet et demandez : *"Peux-tu générer le script SQL pour importer mes produits de data.js dans Supabase ?"* — Claude peut transformer votre liste actuelle en un script d'import prêt à coller dans le SQL Editor.

## 6. Tester

1. Relancez votre site en local (`python3 -m http.server 8000` dans le dossier du site)
2. Ouvrez `boutique.html` — les produits doivent maintenant venir de Supabase
3. Ouvrez `compte.html` — essayez de créer un compte test avec votre email
4. Vérifiez dans Supabase → **Authentication** → **Users** que le compte apparaît bien

## Ce qui se passe si vous ne configurez pas encore Supabase

Rien de grave : tant que `js/supabase-config.js` garde ses valeurs par défaut (`VOTRE_URL_SUPABASE`), le site continue de fonctionner exactement comme avant, avec les produits du fichier `js/data.js`. Vous pouvez activer Supabase quand vous êtes prêt, sans casser le site en attendant.

## Limites du plan gratuit Supabase

Le plan gratuit convient largement à une boutique qui démarre : 500 Mo de base de données, 50 000 utilisateurs actifs par mois, projet mis en pause après 1 semaine d'inactivité totale (se réactive automatiquement à la première visite, avec quelques secondes de délai). Largement suffisant pour commencer.

## Besoin d'aide ?

Revenez vers Claude avec ce projet pour :
- Importer vos produits existants dans Supabase
- Ajouter l'historique des commandes sur la page "Mon compte"
- Créer une interface d'administration pour gérer les produits plus facilement
