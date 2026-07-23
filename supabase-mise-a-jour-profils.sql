-- ============================================================
-- Mise à jour : ajoute le champ "pays" et met à jour le formulaire
-- d'inscription pour enregistrer téléphone/ville/pays automatiquement.
-- À exécuter UNE FOIS dans Supabase → SQL Editor → New query
-- (sans risque si déjà exécuté : les "if not exists"/"or replace"
-- évitent les erreurs de doublon)
-- ============================================================

-- Ajoute la colonne "pays" si elle n'existe pas déjà
alter table profils add column if not exists pays text;

-- Met à jour la fonction qui crée le profil automatiquement à l'inscription
-- pour qu'elle enregistre aussi téléphone, ville et pays
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

-- Vérification
select column_name from information_schema.columns where table_name = 'profils';
