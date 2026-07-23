# Chine-Express-Afrique — Site web

Site e-commerce statique (HTML/CSS/JS pur, sans framework ni base de données).
Le panier fonctionne dans le navigateur du client, et chaque commande se finalise par un message WhatsApp pré-rempli envoyé à votre numéro.

Livraison : **Burkina Faso, Côte d'Ivoire et Sénégal**.

## Structure du projet

```
site/
├── index.html         page d'accueil
├── boutique.html       liste des produits avec filtres
├── produit.html         fiche produit (détail)
├── panier.html          panier + bouton "Commander sur WhatsApp"
├── apropos.html         page à propos
├── livraison.html       délais et infos de livraison
├── contact.html         page contact
├── compte.html          connexion / création de compte client
├── build.py             ⭐ génère les 8 pages (header, menu, pied de page communs)
├── css/style.css        toute la mise en forme du site
└── js/
    ├── data.js          ⭐ vos produits + réglages (numéro WhatsApp, etc.)
    └── app.js           logique du site (panier, filtres, affichage)
```

## ⚠️ Avant de publier : 2 réglages obligatoires

Ouvrez `js/data.js` et modifiez :

1. **Le numéro WhatsApp** (ligne `whatsapp: "8615019496460"`) — remplacez par votre vrai numéro, format international sans le `+` ni espaces. Exemple pour le Burkina Faso : `22670000000`.
2. **Les produits** — la liste `PRODUITS` contient des exemples tirés de votre ancien site. Ajoutez, modifiez ou supprimez des produits en suivant le modèle (chaque produit est un bloc entre `{ }`).

## Tester le site en local

Vous avez besoin de Python (déjà installé sur Mac et la plupart des PC) ou de l'extension VS Code "Live Server".

**Avec Python**, ouvrez un terminal dans le dossier `site/` et lancez :
```bash
python3 -m http.server 8000
```
Puis ouvrez votre navigateur sur **http://localhost:8000**

**Sans terminal** : double-cliquer sur `index.html` fonctionne aussi pour un premier aperçu, mais certaines fonctionnalités (comme le panier) sont plus fiables via un vrai serveur local — préférez la méthode Python si possible.

## Publier sur GitHub (gratuit, pour tester en ligne avant Hostinger)

1. Créez un compte sur [github.com](https://github.com) si vous n'en avez pas
2. Créez un nouveau dépôt (bouton vert "New"), nommez-le par exemple `chine-express-afrique`
3. Dans le dossier `site/` sur votre ordinateur, ouvrez un terminal et lancez :
   ```bash
   git init
   git add .
   git commit -m "Premier version du site"
   git branch -M main
   git remote add origin https://github.com/VOTRE-NOM/chine-express-afrique.git
   git push -u origin main
   ```
4. Sur GitHub, allez dans **Settings → Pages**, choisissez la branche `main` et le dossier `/ (root)`, cliquez Save
5. Après 1-2 minutes, votre site est visible sur `https://VOTRE-NOM.github.io/chine-express-afrique/`

C'est un excellent moyen de partager le site pour relecture avant de le mettre en ligne définitivement.

## Transférer vers Hostinger (hébergement final)

Une fois satisfait du site testé en local ou sur GitHub :

1. Connectez-vous à votre panneau Hostinger (hPanel)
2. Ouvrez le **Gestionnaire de fichiers** (File Manager) de votre hébergement
3. Allez dans le dossier `public_html` (c'est la racine de votre domaine `chine-express-afrique.com`)
4. Supprimez ou sauvegardez l'ancien contenu WordPress si vous ne le gardez pas
5. Importez (upload) **tout le contenu du dossier `site/`** directement dans `public_html` (pas le dossier `site` lui-même, son contenu)
6. Vérifiez que `index.html` se trouve bien à la racine de `public_html`
7. Visitez `https://chine-express-afrique.com` — le nouveau site est en ligne

Alternative plus technique : connecter le dépôt GitHub à Hostinger via Git (disponible sur certains plans Hostinger, dans hPanel → Git).

## Ajouter le paiement Mobile Money plus tard

Le bouton "Commander" utilise actuellement WhatsApp. Quand vous aurez un compte marchand CinetPay (ou équivalent), on pourra ajouter un vrai bouton de paiement Mobile Money sur la page panier, en plus ou à la place de WhatsApp. Cela nécessite une petite partie "serveur" (Hostinger propose PHP, ce qui suffira) — on la construira à ce moment-là.

## Modifier le menu, l'en-tête ou le pied de page

Ces éléments sont identiques sur les 8 pages. Pour éviter de répéter huit fois la même modification, ils sont écrits une seule fois dans `build.py`.

Pour changer le menu, le bandeau du haut ou le pied de page :
1. Ouvrez `build.py`
2. Modifiez la liste `MENU`, la fonction `entete()` ou la variable `PIED`
3. Lancez `python3 build.py` — les 8 pages sont réécrites d'un coup

Le contenu propre à chaque page (textes de l'accueil, de la page livraison…) se trouve aussi dans `build.py`, dans les variables `accueil_corps`, `livraison_corps`, etc.

## Besoin d'aide ?

Revenez vers Claude avec ce projet pour :
- Ajouter/modifier des produits ou des catégories
- Changer les couleurs, textes ou images
- Brancher le paiement Mobile Money (CinetPay) une fois le compte créé
- Préparer la mise en ligne sur Hostinger
