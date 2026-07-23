-- ============================================================
-- Import des produits existants (depuis js/data.js) vers Supabase
-- À exécuter dans : Supabase → SQL Editor → New query
-- Peut être relancé sans risque : les produits existants (même id)
-- seront mis à jour plutôt que dupliqués.
-- ============================================================

insert into produits (id, nom, categorie, prix, ancien_prix, badge, image, description, actif)
values
  ('tvbox-tv98', 'TV Box Android TV98 ATV – 4K Ultra HD', 'objets', 16000, NULL, 'Top vente', 'https://chine-express-afrique.com/wp-content/uploads/2025/10/Weixin-Image_20250821235213_4_345.jpg', 'Transformez n''importe quel téléviseur en Smart TV : streaming 4K Ultra HD, applications Android, télécommande incluse. Branchez, connectez au WiFi, c''est prêt.', true),
  ('beats-studio-pro', 'Casque Audio Bluetooth Beats Studio Pro', 'audio', 16000, NULL, 'Top vente', 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250727063333.jpg', 'Casque circum-aural Bluetooth au son puissant et aux basses profondes. Confortable pour de longues sessions d''écoute, autonomie longue durée.', true),
  ('montre-onola-doree', 'Montre de Luxe ONOLA – Design Squeletté & Boîtier Doré', 'montres', 16900, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250302041155-300x300.jpg', 'Montre mécanique au cadran squeletté qui laisse voir le mouvement. Boîtier doré, bracelet acier — l''élégance à prix accessible.', true),
  ('c9-pro-smartwatch', 'C9 PRO Smart Watch', 'montres', 5900, NULL, 'Top vente', 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250728043244.jpg', 'Montre connectée complète : notifications, suivi d''activité, fréquence cardiaque, multiples cadrans. Compatible Android et iPhone.', true),
  ('ecouteurs-n35', 'Écouteurs Bluetooth N35 – Gaming, Basse Latence, IPX3', 'audio', 3900, NULL, 'Nouveau', 'https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802155252-300x300.jpg', 'Écouteurs sans fil pensés pour le jeu : latence réduite, Bluetooth 5.3, résistance à l''eau IPX3. Boîtier de charge compact.', true),
  ('hp-elitebook-840-g6', 'HP EliteBook 840 G6 – 14" Ultrabook Pro', 'ordinateurs', 211000, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250713104306.jpg', 'Ultrabook professionnel léger et puissant : écran 14", clavier rétroéclairé, robustesse HP. Idéal bureautique, études et déplacements.', true),
  ('hp-omen-15', 'HP OMEN 15 – PC Portable Gamer 15.6" | RTX 1650', 'ordinateurs', 399000, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250723002800.jpg', 'PC gamer équipé d''une carte graphique RTX : jouez aux titres récents, montez vos vidéos, créez sans limite. Écran 15.6" haute fluidité.', true),
  ('ssd-lexar-nq100', 'SSD Lexar NQ100 – 2.5" SATA III – 550 Mo/s', 'stockage', 17500, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250716151332.jpg', 'Donnez une seconde vie à votre PC : remplacez le disque dur par ce SSD et démarrez en quelques secondes. Jusqu''à 550 Mo/s. Plusieurs capacités disponibles — demandez-nous sur WhatsApp.', true),
  ('souris-gamer-dual', 'Souris Gamer Sans Fil Dual Mode – Bluetooth + 2.4GHz', 'peripheriques', 3900, NULL, 'Promo', 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250726091003-300x300.jpg', 'Double connexion Bluetooth et 2.4GHz, design gamer, précision au rendez-vous. Fonctionne sur PC, Mac et tablette.', true),
  ('cle-usb-wifi', 'Clé USB WiFi 2.4GHz – 150 Mbps', 'peripheriques', 1900, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250718045455-300x300.jpg', 'Ajoutez le WiFi à n''importe quel ordinateur fixe ou portable : branchez la clé USB et connectez-vous. Installation simple.', true),
  ('montre-t900-ultra', 'Montre Intelligente T900 Ultra', 'montres', 4800, NULL, 'Promo', 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20240826164856.jpg', 'Le meilleur rapport qualité-prix des montres connectées : grand écran, notifications, suivi sport et santé.', true),
  ('routeur-4g-5g', 'Routeur Mobile WiFi 4G/5G LTE', 'objets', 8900, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250718022333.jpg', 'Internet partout : insérez votre carte SIM et partagez la connexion 4G avec tous vos appareils. Batterie intégrée, format poche.', true),
  ('thinkpad-x390', 'Lenovo ThinkPad X390 – i5 8e Gén', 'ordinateurs', 179000, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250722215810.jpg', 'La fiabilité légendaire ThinkPad : Core i5 8e génération, format compact, clavier réputé le meilleur du marché. Parfait pour travailler.', true),
  ('montre-curren-femme', 'Montre Femme CURREN – Élégance Discrète', 'montres', 6000, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802104045.jpg', 'Montre féminine au design épuré et raffiné. Bracelet confortable, cadran lisible — pour tous les jours comme pour les grandes occasions.', true),
  ('ecouteurs-lp40', 'Thinkplus LP40 – Écouteurs Bluetooth 5.4', 'audio', 6000, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802161859-300x300.jpg', 'Écouteurs intra-auriculaires Bluetooth 5.4 : connexion stable, son clair, boîtier de charge de poche.', true),
  ('chaussures-derby', 'Chaussures Derby Habillées Homme – Cuir', 'mode', 19000, NULL, NULL, 'https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802085458-Copy.jpg', 'Chaussures habillées en cuir pour homme : élégance classique pour le bureau, les cérémonies et les grandes occasions. Précisez votre pointure lors de la commande WhatsApp.', true)
on conflict (id) do update set
  nom = excluded.nom,
  categorie = excluded.categorie,
  prix = excluded.prix,
  ancien_prix = excluded.ancien_prix,
  badge = excluded.badge,
  image = excluded.image,
  description = excluded.description,
  actif = true;

-- Vérification : compte le nombre de produits importés
select count(*) as total_produits from produits;
