-- ============================================================
-- Chine-Express-Afrique — Schéma de base de données Supabase
-- À exécuter dans : Supabase → votre projet → SQL Editor → New query
-- Collez tout ce fichier, puis cliquez "Run".
-- ============================================================

-- ---------- Table des produits ----------
create table if not exists produits (
  id text primary key,                  -- identifiant unique, ex: "montre-onola-doree"
  nom text not null,
  categorie text not null,              -- montres | audio | ordinateurs | stockage | peripheriques | objets | mode
  prix integer not null,                -- prix en CFA (nombre entier)
  ancien_prix integer,                  -- prix barré si promo, sinon vide
  badge text,                           -- "Top vente" | "Promo" | "Nouveau" | vide
  image text not null,                  -- lien de l'image
  description text,
  actif boolean default true,           -- permet de masquer un produit sans le supprimer
  cree_le timestamp with time zone default now()
);

-- Lecture publique des produits actifs (n'importe qui peut voir la boutique)
alter table produits enable row level security;

create policy "Produits visibles par tous"
  on produits for select
  using (actif = true);

-- ---------- Table des profils clients ----------
-- Complète la table "auth.users" fournie automatiquement par Supabase
-- (qui gère déjà email + mot de passe de façon sécurisée)
create table if not exists profils (
  id uuid references auth.users on delete cascade primary key,
  nom_complet text,
  telephone text,
  ville text,                            -- Ouagadougou, Dakar, etc.
  pays text,                             -- Burkina Faso, Sénégal, etc.
  cree_le timestamp with time zone default now()
);

alter table profils enable row level security;

-- Chaque client ne voit et ne modifie que son propre profil
create policy "Un client voit son propre profil"
  on profils for select
  using (auth.uid() = id);

create policy "Un client modifie son propre profil"
  on profils for update
  using (auth.uid() = id);

create policy "Un client crée son propre profil"
  on profils for insert
  with check (auth.uid() = id);

-- Crée automatiquement un profil vide à chaque inscription
create or replace function public.creer_profil_auto()
returns trigger as $$
begin
  insert into public.profils (id, nom_complet, telephone, ville, pays)
  values (
    new.id,
    new.raw_user_meta_data->>'nom_complet',
    new.raw_user_meta_data->>'telephone',
    new.raw_user_meta_data->>'ville',
    new.raw_user_meta_data->>'pays'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_nouvel_utilisateur
  after insert on auth.users
  for each row execute procedure public.creer_profil_auto();

-- ---------- Table des commandes (pour plus tard : historique client) ----------
create table if not exists commandes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references auth.users on delete set null,
  produits jsonb not null,               -- liste des produits commandés (id, nom, quantité, prix)
  total integer not null,
  statut text default 'en_attente',      -- en_attente | confirmee | expediee | livree
  cree_le timestamp with time zone default now()
);

alter table commandes enable row level security;

create policy "Un client voit ses propres commandes"
  on commandes for select
  using (auth.uid() = client_id);

create policy "Un client crée ses propres commandes"
  on commandes for insert
  with check (auth.uid() = client_id);

-- ============================================================
-- Une fois ce script exécuté avec succès, allez dans l'onglet
-- "Table Editor" de Supabase pour voir vos 3 tables : produits,
-- profils, commandes. Ajoutez vos produits directement là,
-- ou demandez à Claude de les importer depuis js/data.js.
-- ============================================================
