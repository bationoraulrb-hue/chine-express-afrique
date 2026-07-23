-- ============================================================
-- Badges automatiques : Top vente, Nouveau, Promo
-- À exécuter dans Supabase → SQL Editor → New query
--
-- Principe :
--   • Top vente = calculé depuis les commandes CONFIRMÉES
--   • Nouveau   = produit ajouté il y a moins de 30 jours
--   • Promo     = ancien_prix renseigné (déjà géré côté site)
--
-- Sans risque si relancé : tout est en "if not exists" / "or replace".
-- ============================================================


-- ============================================================
-- 1. COMPTEUR DE VENTES SUR CHAQUE PRODUIT
-- ============================================================

-- Nombre d'exemplaires vendus (mis à jour automatiquement)
alter table produits add column if not exists nb_ventes integer default 0;

-- Date d'ajout au catalogue, sert au badge "Nouveau"
alter table produits add column if not exists cree_le timestamp with time zone default now();


-- ============================================================
-- 2. LES COMMANDES
-- ============================================================

-- Permet d'enregistrer une commande même sans compte client
-- (le client commande par WhatsApp sans forcément s'inscrire)
alter table commandes alter column client_id drop not null;

-- Coordonnées saisies au moment de la commande
alter table commandes add column if not exists nom_client text;
alter table commandes add column if not exists telephone text;
alter table commandes add column if not exists ville text;
alter table commandes add column if not exists pays text;

-- Numéro de commande lisible communiqué au client (ex : CE-4F2A9)
alter table commandes add column if not exists reference text;

-- Statut : en_attente → confirmee → expediee → livree (ou annulee)
-- SEULES les commandes confirmées comptent dans les ventes.
alter table commandes add column if not exists statut text default 'en_attente';

-- Autorise l'enregistrement d'une commande par un visiteur non connecté
drop policy if exists "Un client crée ses propres commandes" on commandes;
create policy "Toute commande peut être enregistrée"
  on commandes for insert
  with check (true);

-- Un client connecté voit ses commandes ; les commandes anonymes restent privées
drop policy if exists "Un client voit ses propres commandes" on commandes;
create policy "Un client voit ses propres commandes"
  on commandes for select
  using (auth.uid() = client_id);


-- ============================================================
-- 3. MISE À JOUR AUTOMATIQUE DU COMPTEUR DE VENTES
-- ============================================================
-- Se déclenche quand une commande passe à "confirmee".
-- Ajoute les quantités commandées au compteur de chaque produit.

create or replace function public.maj_compteur_ventes()
returns trigger as $$
declare
  article jsonb;
begin
  -- On ne compte que le passage vers "confirmee"
  if new.statut = 'confirmee' and (old.statut is null or old.statut <> 'confirmee') then
    for article in select * from jsonb_array_elements(new.produits)
    loop
      update produits
      set nb_ventes = coalesce(nb_ventes, 0) + coalesce((article->>'quantite')::int, 1)
      where id = article->>'id';
    end loop;
  end if;

  -- Si une commande confirmée est annulée, on retire les ventes
  if old.statut = 'confirmee' and new.statut in ('annulee', 'en_attente') then
    for article in select * from jsonb_array_elements(new.produits)
    loop
      update produits
      set nb_ventes = greatest(0, coalesce(nb_ventes, 0) - coalesce((article->>'quantite')::int, 1))
      where id = article->>'id';
    end loop;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_commande_confirmee on commandes;
create trigger on_commande_confirmee
  after update on commandes
  for each row execute procedure public.maj_compteur_ventes();


-- ============================================================
-- 4. VUE : LES PRODUITS AVEC LEURS BADGES CALCULÉS
-- ============================================================
-- Le site lit cette vue au lieu de la table brute.
-- Le badge est décidé ici, une fois pour toutes.

create or replace view produits_affichage as
select
  p.*,
  -- Le badge, par ordre de priorité : Promo > Top vente > Nouveau
  case
    when p.ancien_prix is not null and p.ancien_prix > p.prix then 'Promo'
    when p.id in (
      select id from produits
      where actif = true and coalesce(nb_ventes, 0) > 0
      order by nb_ventes desc
      limit 5
    ) then 'Top vente'
    when p.cree_le > now() - interval '30 days' then 'Nouveau'
    else null
  end as badge_auto,
  -- Pourcentage de réduction, calculé côté base
  case
    when p.ancien_prix is not null and p.ancien_prix > p.prix
    then round((1 - p.prix::numeric / p.ancien_prix) * 100)
    else null
  end as remise_pct
from produits p
where p.actif = true;


-- ============================================================
-- 5. VÉRIFICATION
-- ============================================================
select id, nom, prix, ancien_prix, nb_ventes, badge_auto, remise_pct
from produits_affichage
order by nb_ventes desc nulls last
limit 10;
