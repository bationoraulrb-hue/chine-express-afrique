/* ============================================================
   CATALOGUE PRODUITS — Chine-Express-Afrique
   Pour ajouter un produit : copiez un bloc {...} et modifiez-le.
   - id        : identifiant unique (sans espaces ni accents)
   - nom       : nom affiché
   - cat       : "montres" | "audio" | "ordinateurs" | "stockage" | "peripheriques" | "objets" | "mode"
   - prix      : prix en CFA (nombre, sans points)
   - ancienPrix: prix barré si promo (mettre null sinon)
                 => la réduction en % s'affiche AUTOMATIQUEMENT sur le site
                 => 3 produits ont un ancienPrix d'EXEMPLE : remplacez-les par vos vrais prix
   - badge     : "Top vente" | "Promo" | "Nouveau" | null
   - img       : lien de l'image
   - desc      : description courte pour la fiche produit
   ============================================================ */

const CONFIG = {
  // ⚠️ REMPLACEZ par votre numéro WhatsApp (format international sans + ni espaces)
  whatsapp: "8615019496460",
  nomBoutique: "Chine-Express-Afrique"
};

const CATEGORIES = {
  montres:       "Montres",
  audio:         "Audio",
  ordinateurs:   "Ordinateurs",
  stockage:      "Stockage",
  peripheriques: "Périphériques",
  objets:        "Objets connectés",
  mode:          "Mode"
};

const PRODUITS = [
  {
    id: "tvbox-tv98",
    nom: "TV Box Android TV98 ATV – 4K Ultra HD",
    cat: "objets",
    prix: 16000,
    ancienPrix: null,
    badge: "Top vente",
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/10/Weixin-Image_20250821235213_4_345.jpg",
    desc: "Transformez n'importe quel téléviseur en Smart TV : streaming 4K Ultra HD, applications Android, télécommande incluse. Branchez, connectez au WiFi, c'est prêt."
  },
  {
    id: "beats-studio-pro",
    nom: "Casque Audio Bluetooth Beats Studio Pro",
    cat: "audio",
    prix: 16000,
    ancienPrix: null,
    badge: "Top vente",
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250727063333.jpg",
    desc: "Casque circum-aural Bluetooth au son puissant et aux basses profondes. Confortable pour de longues sessions d'écoute, autonomie longue durée."
  },
  {
    id: "montre-onola-doree",
    nom: "Montre de Luxe ONOLA – Design Squeletté & Boîtier Doré",
    cat: "montres",
    prix: 16900,
    ancienPrix: 24900,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250302041155-300x300.jpg",
    desc: "Montre mécanique au cadran squeletté qui laisse voir le mouvement. Boîtier doré, bracelet acier — l'élégance à prix accessible."
  },
  {
    id: "c9-pro-smartwatch",
    nom: "C9 PRO Smart Watch",
    cat: "montres",
    prix: 5900,
    ancienPrix: null,
    badge: "Top vente",
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250728043244.jpg",
    desc: "Montre connectée complète : notifications, suivi d'activité, fréquence cardiaque, multiples cadrans. Compatible Android et iPhone."
  },
  {
    id: "ecouteurs-n35",
    nom: "Écouteurs Bluetooth N35 – Gaming, Basse Latence, IPX3",
    cat: "audio",
    prix: 3900,
    ancienPrix: null,
    badge: "Nouveau",
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802155252-300x300.jpg",
    desc: "Écouteurs sans fil pensés pour le jeu : latence réduite, Bluetooth 5.3, résistance à l'eau IPX3. Boîtier de charge compact."
  },
  {
    id: "hp-elitebook-840-g6",
    nom: "HP EliteBook 840 G6 – 14\" Ultrabook Pro",
    cat: "ordinateurs",
    prix: 211000,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250713104306.jpg",
    desc: "Ultrabook professionnel léger et puissant : écran 14\", clavier rétroéclairé, robustesse HP. Idéal bureautique, études et déplacements."
  },
  {
    id: "hp-omen-15",
    nom: "HP OMEN 15 – PC Portable Gamer 15.6\" | RTX 1650",
    cat: "ordinateurs",
    prix: 399000,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250723002800.jpg",
    desc: "PC gamer équipé d'une carte graphique RTX : jouez aux titres récents, montez vos vidéos, créez sans limite. Écran 15.6\" haute fluidité."
  },
  {
    id: "ssd-lexar-nq100",
    nom: "SSD Lexar NQ100 – 2.5\" SATA III – 550 Mo/s",
    cat: "stockage",
    prix: 17500,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250716151332.jpg",
    desc: "Donnez une seconde vie à votre PC : remplacez le disque dur par ce SSD et démarrez en quelques secondes. Jusqu'à 550 Mo/s. Plusieurs capacités disponibles — demandez-nous sur WhatsApp."
  },
  {
    id: "souris-gamer-dual",
    nom: "Souris Gamer Sans Fil Dual Mode – Bluetooth + 2.4GHz",
    cat: "peripheriques",
    prix: 3900,
    ancienPrix: 5900,
    badge: "Promo",
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250726091003-300x300.jpg",
    desc: "Double connexion Bluetooth et 2.4GHz, design gamer, précision au rendez-vous. Fonctionne sur PC, Mac et tablette."
  },
  {
    id: "cle-usb-wifi",
    nom: "Clé USB WiFi 2.4GHz – 150 Mbps",
    cat: "peripheriques",
    prix: 1900,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250718045455-300x300.jpg",
    desc: "Ajoutez le WiFi à n'importe quel ordinateur fixe ou portable : branchez la clé USB et connectez-vous. Installation simple."
  },
  {
    id: "montre-t900-ultra",
    nom: "Montre Intelligente T900 Ultra",
    cat: "montres",
    prix: 4800,
    ancienPrix: 7500,
    badge: "Promo",
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20240826164856.jpg",
    desc: "Le meilleur rapport qualité-prix des montres connectées : grand écran, notifications, suivi sport et santé."
  },
  {
    id: "routeur-4g-5g",
    nom: "Routeur Mobile WiFi 4G/5G LTE",
    cat: "objets",
    prix: 8900,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250718022333.jpg",
    desc: "Internet partout : insérez votre carte SIM et partagez la connexion 4G avec tous vos appareils. Batterie intégrée, format poche."
  },
  {
    id: "thinkpad-x390",
    nom: "Lenovo ThinkPad X390 – i5 8e Gén",
    cat: "ordinateurs",
    prix: 179000,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/07/Weixin-Image_20250722215810.jpg",
    desc: "La fiabilité légendaire ThinkPad : Core i5 8e génération, format compact, clavier réputé le meilleur du marché. Parfait pour travailler."
  },
  {
    id: "montre-curren-femme",
    nom: "Montre Femme CURREN – Élégance Discrète",
    cat: "montres",
    prix: 6000,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802104045.jpg",
    desc: "Montre féminine au design épuré et raffiné. Bracelet confortable, cadran lisible — pour tous les jours comme pour les grandes occasions."
  },
  {
    id: "ecouteurs-lp40",
    nom: "Thinkplus LP40 – Écouteurs Bluetooth 5.4",
    cat: "audio",
    prix: 6000,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802161859-300x300.jpg",
    desc: "Écouteurs intra-auriculaires Bluetooth 5.4 : connexion stable, son clair, boîtier de charge de poche."
  },
  {
    id: "chaussures-derby",
    nom: "Chaussures Derby Habillées Homme – Cuir",
    cat: "mode",
    prix: 19000,
    ancienPrix: null,
    badge: null,
    img: "https://chine-express-afrique.com/wp-content/uploads/2025/08/Weixin-Image_20250802085458-Copy.jpg",
    desc: "Chaussures habillées en cuir pour homme : élégance classique pour le bureau, les cérémonies et les grandes occasions. Précisez votre pointure lors de la commande WhatsApp."
  }
];
