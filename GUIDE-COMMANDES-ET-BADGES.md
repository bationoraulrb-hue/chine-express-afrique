# Gérer vos commandes et vos badges

Ce guide explique comment le site calcule tout seul les badges **Top vente**, **Nouveau** et **Promo**, et ce que vous avez à faire au quotidien.

---

## Mise en place (une seule fois)

1. Ouvrez Supabase → **SQL Editor** → **New query**
2. Copiez tout le contenu du fichier `supabase-badges-automatiques.sql`
3. Collez et cliquez **Run**
4. Vous devriez voir apparaître la liste de vos produits avec les colonnes `nb_ventes`, `badge_auto` et `remise_pct`

C'est tout. Les badges sont désormais automatiques.

---

## Ce qui se passe à chaque commande

1. Le client remplit son panier et clique **Commander sur WhatsApp**
2. Le site enregistre la commande dans Supabase avec le statut **`en_attente`** et lui attribue un numéro lisible (ex : `CE-4F2A9`)
3. WhatsApp s'ouvre avec le message pré-rempli, **numéro de commande inclus**
4. Le client voit sur le site un écran de confirmation : « Commande envoyée », son numéro, le montant et les étapes suivantes
5. Son panier est vidé automatiquement
6. Vous discutez avec lui sur WhatsApp, il paie

Le numéro de commande vous permet de retrouver instantanément la commande dans Supabase quand le client vous écrit : cherchez sa référence dans la colonne `reference`.

**Important** : tant que la commande est en `en_attente`, elle **ne compte pas** dans les ventes. C'est voulu : sinon un client qui clique sans jamais payer ferait grimper un produit dans vos "Top ventes" sans qu'aucune vente n'ait eu lieu.

---

## Votre geste quotidien : confirmer les commandes payées

Quand un client a réellement payé :

1. Supabase → **Table Editor** → table **`commandes`**
2. Trouvez la commande (elles sont triées par date, la plus récente en haut)
3. Double-cliquez sur la case **`statut`**
4. Remplacez `en_attente` par **`confirmee`**
5. Appuyez sur Entrée

À cet instant, le compteur `nb_ventes` de chaque produit de la commande augmente automatiquement, et les badges "Top vente" se recalculent tout seuls.

### Les statuts disponibles

| Statut | Quand l'utiliser | Compte dans les ventes ? |
|---|---|---|
| `en_attente` | Commande reçue, paiement pas encore fait | Non |
| `confirmee` | Le client a payé | **Oui** |
| `expediee` | Le colis est parti de Chine | Oui |
| `livree` | Le client a reçu son colis | Oui |
| `annulee` | Commande abandonnée ou remboursée | Non (retire la vente) |

Si vous passez une commande de `confirmee` à `annulee`, les ventes sont automatiquement retirées du compteur. Rien à faire manuellement.

---

## Comment chaque badge est décidé

Le site n'affiche **qu'un seul badge par produit**, dans cet ordre de priorité :

### 1. Promo (priorité la plus haute)
S'affiche dès que la colonne **`ancien_prix`** est remplie et supérieure au prix actuel.
Le pourcentage (`-32%`) est calculé automatiquement.

**Pour mettre un produit en promotion** :
- Table Editor → `produits` → colonne `ancien_prix` → saisissez l'ancien prix
- Pour retirer la promo : videz la case (laissez vide)

⚠️ N'inventez pas d'anciens prix. Afficher une réduction sur un prix qui n'a jamais existé est illégal dans la plupart des pays et détruit la confiance des clients qui s'en aperçoivent.

### 2. Top vente
S'affiche automatiquement sur les **5 produits les plus commandés** (commandes confirmées uniquement).
Rien à faire : le classement se met à jour à chaque commande confirmée.

Pour changer le nombre de produits concernés, modifiez `limit 5` dans le fichier SQL et relancez-le.

### 3. Nouveau
S'affiche sur les produits ajoutés il y a **moins de 30 jours**.
La date vient de la colonne `cree_le`, remplie automatiquement à l'ajout du produit.

Pour changer la durée, modifiez `interval '30 days'` dans le fichier SQL et relancez-le.

---

## Ajouter un nouveau produit

Table Editor → `produits` → **Insert row**, puis remplissez :

| Colonne | Exemple | Obligatoire |
|---|---|---|
| `id` | `casque-jbl-tune` (sans espace ni accent) | Oui |
| `nom` | `Casque JBL Tune 510BT` | Oui |
| `categorie` | `audio` | Oui |
| `prix` | `18500` (nombre seul, sans "CFA") | Oui |
| `image` | lien vers la photo | Oui |
| `description` | texte de présentation | Non |
| `ancien_prix` | à remplir seulement si vraie promo | Non |
| `actif` | `true` | Oui |

Le badge "Nouveau" apparaîtra tout seul pendant 30 jours. Ne remplissez pas de colonne `badge` à la main : elle n'est plus utilisée.

---

## Consulter vos ventes

Dans **SQL Editor**, collez cette requête pour voir votre classement :

```sql
select nom, prix, nb_ventes, badge_auto
from produits_affichage
order by nb_ventes desc nulls last;
```

Pour voir les commandes en attente de confirmation :

```sql
select cree_le, reference, nom_client, telephone, ville, total, statut
from commandes
where statut = 'en_attente'
order by cree_le desc;
```

Pour retrouver une commande précise dont le client vous donne le numéro :

```sql
select * from commandes where reference = 'CE-4F2A9';
```

---

## Si quelque chose ne marche pas

**Les badges ne changent pas** → vérifiez que la commande est bien passée en `confirmee`, puis rechargez le site avec Ctrl+Shift+R (le navigateur garde souvent l'ancienne version en mémoire).

**Les commandes n'apparaissent pas dans la table** → vérifiez que `js/supabase-config.js` contient bien votre vraie clé publique. Tant qu'il affiche `VOTRE_CLE_PUBLIQUE`, le site fonctionne sans base de données et n'enregistre rien.

**Un produit garde le badge "Nouveau" trop longtemps** → vérifiez sa colonne `cree_le` ; si elle est vide, mettez-y une date.
