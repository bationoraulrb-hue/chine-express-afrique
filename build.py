#!/usr/bin/env python3
"""
Génère les pages HTML du site à partir d'un gabarit commun.
Lancer :  python3 build.py
Cela réécrit index.html, boutique.html, produit.html, panier.html,
compte.html, apropos.html, livraison.html et contact.html.

Modifier le header, le footer ou le menu ici met à jour TOUTES les pages
d'un coup — plus besoin de répéter la modification huit fois.
"""

PAYS = "Burkina Faso, Côte d'Ivoire &amp; Sénégal"

# ---------- Icônes (SVG en ligne, trait fin) ----------
IC = {
    "loupe": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    "panier": '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.6 12.5a2 2 0 0 0 2 1.5h8.8a2 2 0 0 0 2-1.6L22 6H6"/></svg>',
    "compte": '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    "wa": '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-1L3 20l1.1-5.4A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/></svg>',
    "wa_gros": '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-1L3 20l1.1-5.4A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/></svg>',
    "colis": '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    "check": '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    "tel": '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="10" y1="19" x2="14" y2="19"/></svg>',
}

MENU = [
    ("index.html", "Accueil"),
    ("boutique.html", "Toute la boutique"),
    ("boutique.html?cat=ordinateurs", "Ordinateurs"),
    ("boutique.html?cat=montres", "Montres"),
    ("boutique.html?cat=audio", "Audio"),
    ("boutique.html?cat=stockage", "Stockage"),
    ("apropos.html", "À propos"),
    ("livraison.html", "Livraison"),
    ("contact.html", "Contact"),
]


def entete(page_active):
    liens = "".join(
        f'<a href="{href}"{" class=\"on\"" if href == page_active else ""}>{txt}</a>'
        for href, txt in MENU
    )
    return f"""<div class="annonce">Livraison <b>{PAYS}</b> — commande et paiement confirmés sur WhatsApp</div>

<header>
  <div class="wrap header-in">
    <a href="index.html" class="brand">
      <span class="brand-mark">CE</span>
      <span class="brand-nom">Chine-Express-Afrique<small>Shenzhen → Afrique de l'Ouest</small></span>
    </a>
    <form class="search" id="form-recherche">
      <input type="text" name="q" placeholder="Rechercher un produit…" aria-label="Rechercher un produit">
      <button type="submit" aria-label="Lancer la recherche">{IC['loupe']}</button>
    </form>
    <div class="header-actions">
      <button class="h-action" id="btn-loupe" aria-label="Ouvrir la recherche" aria-expanded="false">{IC['loupe']}</button>
      <a href="compte.html" class="h-action" aria-label="Mon compte">{IC['compte']}<span class="lbl">Mon compte</span></a>
      <a href="panier.html" class="h-action" aria-label="Voir mon panier">{IC['panier']}<span class="lbl">Panier</span><span class="panier-badge">0</span></a>
    </div>
  </div>
  <form class="search-mobile cache" id="form-recherche-mobile">
    <input type="text" name="q" placeholder="Rechercher un produit…" aria-label="Rechercher un produit">
    <button type="submit" aria-label="Lancer la recherche">{IC['loupe']}</button>
  </form>
  <nav class="catnav" aria-label="Catégories">
    <div class="rail">{liens}</div>
  </nav>
</header>"""


PIED = f"""<footer>
  <div class="wrap foot-in">
    <div>
      <h4>Chine-Express-Afrique</h4>
      <p>Nous achetons à la source en Chine et suivons chaque colis jusqu'à votre porte, au Burkina Faso, en Côte d'Ivoire et au Sénégal.</p>
      <div class="paiements">
        <span>Orange Money</span><span>Moov Money</span><span>Wave</span><span>MTN Money</span>
      </div>
    </div>
    <div>
      <h4>Boutique</h4>
      <ul>
        <li><a href="boutique.html?cat=ordinateurs">Ordinateurs portables</a></li>
        <li><a href="boutique.html?cat=montres">Montres</a></li>
        <li><a href="boutique.html?cat=audio">Audio</a></li>
        <li><a href="boutique.html">Tous les produits</a></li>
      </ul>
    </div>
    <div>
      <h4>Informations</h4>
      <ul>
        <li><a href="apropos.html">À propos de nous</a></li>
        <li><a href="livraison.html">Livraison et délais</a></li>
        <li><a href="compte.html">Mon compte</a></li>
        <li><a href="contact.html">Nous écrire</a></li>
      </ul>
    </div>
    <div>
      <h4>Nous joindre</h4>
      <ul>
        <li><a data-wa="Bonjour, j'ai une question." href="#">WhatsApp</a></li>
        <li><a href="mailto:contact@chine-express-afrique.com">contact@chine-express-afrique.com</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bas wrap">© 2026 Chine-Express-Afrique</div>
</footer>

<a class="wa-flot" data-wa="Bonjour, j'ai une question sur vos produits." href="#" aria-label="Nous écrire sur WhatsApp">{IC['wa_gros']}</a>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" onload="window.supabaseJs = supabase"></script>
<script src="js/supabase-config.js"></script>
<script src="js/data.js"></script>
<script src="js/app.js"></script>
<script src="js/compte.js"></script>"""


def page(titre, description, page_active, corps, page_titre=None):
    bloc_titre = ""
    if page_titre:
        h1, sous = page_titre
        bloc_titre = f"""
<div class="page-titre">
  <div class="wrap">
    <h1>{h1}</h1>
    <p>{sous}</p>
  </div>
</div>"""
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0E1A2B">
<title>{titre}</title>
<meta name="description" content="{description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

{entete(page_active)}
{bloc_titre}
{corps}

{PIED}
</body>
</html>
"""


# ============================================================
# ACCUEIL
# ============================================================
accueil_corps = f"""<div class="hero">
  <div class="wrap hero-in">
    <div>
      <span class="eyebrow">Achat direct en Chine</span>
      <h1>Le prix de Shenzhen, <em>livré chez vous</em></h1>
      <p class="sub">Ordinateurs, montres connectées, audio et accessoires. Nous achetons à la source, nous vérifions chaque article, et un conseiller suit votre colis jusqu'à votre porte.</p>
      <div class="hero-cta">
        <a class="btn btn-or" href="boutique.html">Voir les produits</a>
        <a class="btn btn-ghost" href="#marche">Comment commander</a>
      </div>
    </div>
    <div>
      <div class="hero-card">
        <span class="hc-tag">Le plus vendu</span>
        <img src="https://chine-express-afrique.com/wp-content/uploads/2025/10/Weixin-Image_20250821235213_4_345.jpg" alt="TV Box Android TV98 ATV 4K" loading="eager">
        <div class="hc-nom">TV Box Android TV98 ATV — 4K Ultra HD</div>
        <div class="hc-prix">16.000 CFA</div>
      </div>
    </div>
  </div>

  <div class="trajet">
    <div class="rail">
      <div class="escale"><span class="pt depart"></span><div><b>Shenzhen</b><span>Achat et contrôle</span></div></div>
      <div class="escale"><span class="pt"></span><div><b>Ouagadougou</b><span>Burkina Faso</span></div></div>
      <div class="escale"><span class="pt"></span><div><b>Abidjan</b><span>Côte d'Ivoire</span></div></div>
      <div class="escale"><span class="pt"></span><div><b>Dakar</b><span>Sénégal</span></div></div>
    </div>
  </div>
</div>

<div class="confiance">
  <div class="rail">
    <div class="conf-item"><span class="ic">{IC['colis']}</span><div><b>Suivi jusqu'à la livraison</b><span>Votre conseiller reste joignable du début à la fin</span></div></div>
    <div class="conf-item"><span class="ic">{IC['wa']}</span><div><b>Commande sur WhatsApp</b><span>Sans compte à créer, sans formulaire interminable</span></div></div>
    <div class="conf-item"><span class="ic">{IC['check']}</span><div><b>Chaque article vérifié</b><span>Contrôlé avant de quitter la Chine</span></div></div>
    <div class="conf-item"><span class="ic">{IC['tel']}</span><div><b>Paiement Mobile Money</b><span>Orange, Moov, Wave, MTN — confirmé avant l'envoi</span></div></div>
  </div>
</div>

<section>
  <div class="wrap">
    <div class="sec-head sec-head-ligne">
      <div><span class="fil">Parcourir</span><h2>Les rayons</h2></div>
      <a class="voir-tout" href="boutique.html">Tout voir</a>
    </div>
    <div class="cats">
      <a class="cat" href="boutique.html?cat=montres"><img src="https://chine-express-afrique.com/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-11_37_51-AM.png" alt="" loading="lazy"><b>Montres</b><span>dès 3.300 CFA</span></a>
      <a class="cat" href="boutique.html?cat=ordinateurs"><img src="https://chine-express-afrique.com/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-06_13_39-AM.png" alt="" loading="lazy"><b>Ordinateurs</b><span>dès 92.000 CFA</span></a>
      <a class="cat" href="boutique.html?cat=audio"><img src="https://chine-express-afrique.com/wp-content/uploads/2025/07/ChatGPT-Image-Jul-13-2025-09_35_54-PM.png" alt="" loading="lazy"><b>Audio</b><span>dès 1.900 CFA</span></a>
      <a class="cat" href="boutique.html?cat=stockage"><img src="https://chine-express-afrique.com/wp-content/uploads/2025/07/ChatGPT-Image-Jul-13-2025-09_04_44-PM.png" alt="" loading="lazy"><b>Stockage</b><span>dès 17.500 CFA</span></a>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="sec-head sec-head-ligne">
      <div><span class="fil">Ce qui part le plus</span><h2>Les plus commandés</h2></div>
      <a class="voir-tout" href="boutique.html">Tout voir</a>
    </div>
    <div class="grille" id="zone-meilleures-ventes"></div>
  </div>
</section>

<section class="marche" id="marche">
  <div class="wrap">
    <div class="sec-head"><span class="fil">Trois étapes</span><h2>Comment commander</h2></div>
    <div class="etapes">
      <div class="etape">
        <span class="num">1</span>
        <b>Remplissez votre panier</b>
        <p>Choisissez vos articles sur le site. Aucun compte n'est nécessaire pour commander.</p>
        <span class="duree">2 minutes</span>
      </div>
      <div class="etape">
        <span class="num">2</span>
        <b>Confirmez sur WhatsApp</b>
        <p>Votre panier s'envoie en un message. Un conseiller vous donne le prix final, le délai et le mode de paiement.</p>
        <span class="duree">Réponse le jour même</span>
      </div>
      <div class="etape">
        <span class="num">3</span>
        <b>Recevez votre colis</b>
        <p>Livraison à Ouagadougou, Abidjan, Dakar ou en point relais, avec le suivi communiqué à chaque étape.</p>
        <span class="duree">10 à 20 jours</span>
      </div>
    </div>
  </div>
</section>

<section class="apropos">
  <div class="wrap apropos-in">
    <div>
      <h2>Ce qui compte pour nous : <em>vous connaître</em></h2>
      <p>Beaucoup de sites Chine-Afrique se ressemblent : mêmes produits, mêmes prix, aucun visage derrière. Ici, quand vous écrivez sur WhatsApp, c'est une personne qui répond.</p>
      <ul class="points">
        <li><span class="ok">✓</span> Un conseiller suit votre commande du début à la fin</li>
        <li><span class="ok">✓</span> Si un délai change, vous êtes prévenu — pas de silence</li>
        <li><span class="ok">✓</span> Prix négociés directement auprès des fournisseurs de Shenzhen</li>
        <li><span class="ok">✓</span> Chaque article est contrôlé avant l'expédition</li>
      </ul>
    </div>
    <div class="stats">
      <div class="stat"><b class="chiffre">300+</b><span>références au catalogue</span></div>
      <div class="stat"><b class="chiffre">3 pays</b><span>Burkina Faso, Côte d'Ivoire, Sénégal</span></div>
      <div class="stat"><b class="chiffre">7j/7</b><span>conseillers joignables sur WhatsApp</span></div>
      <div class="stat"><b class="chiffre">100%</b><span>des colis contrôlés au départ</span></div>
    </div>
  </div>
</section>

<section class="wa-sec">
  <div class="wrap">
    <div class="wa-box">
      <div>
        <h3>Une question avant de commander ?</h3>
        <p>Écrivez-nous sur WhatsApp. Un conseiller répond, 7 jours sur 7.</p>
      </div>
      <a class="btn btn-wa" data-wa="Bonjour, j'ai une question avant de commander." href="#">{IC['wa']} Ouvrir WhatsApp</a>
    </div>
  </div>
</section>"""

# ============================================================
# AUTRES PAGES
# ============================================================
boutique_corps = """<section>
  <div class="wrap">
    <div class="filtres"><div class="rail" id="zone-filtres"></div></div>
    <div class="grille" id="zone-boutique"></div>
  </div>
</section>"""

produit_corps = """<section>
  <div class="wrap" id="zone-fiche"></div>
</section>"""

panier_corps = """<section>
  <div class="wrap" id="zone-panier"></div>
</section>"""

compte_corps = """<section>
  <div class="wrap" id="zone-compte"></div>
</section>"""

apropos_corps = f"""<section>
  <div class="wrap contenu">
    <div class="carte">
      <p>Chine-Express-Afrique est né d'un constat simple : entre l'usine chinoise et le client ouest-africain, chaque intermédiaire ajoute sa marge. Nous avons supprimé les intermédiaires.</p>
      <p>Notre équipe travaille entre la Chine, où nous achetons directement auprès des fournisseurs, et l'Afrique de l'Ouest, où nous accompagnons chaque client jusqu'à la réception de son colis.</p>
    </div>

    <h2>Nos engagements</h2>
    <ul>
      <li><b>Prix justes</b> — nous négocions à la source, sans intermédiaire superflu.</li>
      <li><b>Articles vérifiés</b> — chaque produit est contrôlé avant l'expédition.</li>
      <li><b>Un interlocuteur</b> — la même personne vous suit du choix du produit à la livraison.</li>
      <li><b>Délais annoncés</b> — les coûts et durées sont donnés avant paiement, pas après.</li>
    </ul>

    <h2>Commander chez nous</h2>
    <p>Aucun compte n'est requis. Parcourez la boutique, remplissez votre panier, puis confirmez sur WhatsApp. Un conseiller vous répond avec le prix final, le délai et le mode de paiement.</p>

    <h2>Où nous livrons</h2>
    <p>Nous livrons au <b>Burkina Faso</b>, en <b>Côte d'Ivoire</b> et au <b>Sénégal</b>. Pour un autre pays d'Afrique de l'Ouest, écrivez-nous : nous étudions chaque demande.</p>

    <div class="carte">
      <p style="margin-bottom:14px">Une question sur un produit ou une commande en cours ?</p>
      <a class="btn btn-wa btn-bloc" data-wa="Bonjour, j'aimerais en savoir plus." href="#">{IC['wa']} Écrire sur WhatsApp</a>
    </div>
  </div>
</section>"""

livraison_corps = f"""<section>
  <div class="wrap contenu">
    <div class="carte" style="border-left:4px solid var(--or)">
      <p style="margin:0"><b>À vérifier avant publication :</b> les délais et frais ci-dessous sont des exemples de mise en page. Remplacez-les par vos chiffres réels.</p>
    </div>

    <h2>Délais par pays</h2>
    <ul>
      <li><b>Burkina Faso</b> — Ouagadougou et environs : 10 à 15 jours ouvrés après confirmation.</li>
      <li><b>Côte d'Ivoire</b> — Abidjan et environs : 12 à 18 jours ouvrés après confirmation.</li>
      <li><b>Sénégal</b> — Dakar et environs : 12 à 18 jours ouvrés après confirmation.</li>
      <li>Hors grandes villes, comptez 2 à 5 jours supplémentaires.</li>
    </ul>

    <h2>Le parcours de votre commande</h2>
    <ul>
      <li><b>Confirmation</b> — après votre message WhatsApp, le conseiller valide la disponibilité, le prix final et les frais.</li>
      <li><b>Paiement</b> — Mobile Money (Orange Money, Moov Money, Wave, MTN Money) ou auprès d'un agent local.</li>
      <li><b>Expédition</b> — l'article est contrôlé puis expédié depuis la Chine. Vous recevez le numéro de suivi.</li>
      <li><b>Livraison</b> — à votre adresse ou en point relais, selon votre ville.</li>
    </ul>

    <h2>Frais de livraison</h2>
    <p>Ils dépendent du poids, du volume et de la destination. Ils vous sont communiqués avant tout paiement. Aucun frais n'est ajouté à la réception.</p>

    <h2>Suivi</h2>
    <p>Dès l'expédition, votre conseiller vous transmet le numéro de suivi et reste joignable sur WhatsApp jusqu'à la réception.</p>

    <div class="carte">
      <p style="margin-bottom:14px">Une question sur une livraison en cours ?</p>
      <a class="btn btn-wa btn-bloc" data-wa="Bonjour, j'ai une question sur ma livraison." href="#">{IC['wa']} Écrire sur WhatsApp</a>
    </div>
  </div>
</section>"""

contact_corps = f"""<section>
  <div class="wrap contenu">
    <div class="carte" style="text-align:center;padding:32px 20px">
      <div style="color:var(--wa);display:flex;justify-content:center;margin-bottom:10px">{IC['wa_gros']}</div>
      <h2 style="margin-top:0">WhatsApp, le plus rapide</h2>
      <p>Nos conseillers répondent en priorité sur WhatsApp, 7 jours sur 7 : question produit, commande en cours, livraison.</p>
      <a class="btn btn-wa btn-bloc" style="margin-top:14px" data-wa="Bonjour, j'ai une question." href="#">Ouvrir WhatsApp</a>
    </div>

    <h2>Par email</h2>
    <p>Pour une demande moins urgente : <a href="mailto:contact@chine-express-afrique.com" style="color:var(--or-fonce);font-weight:600">contact@chine-express-afrique.com</a></p>

    <h2>Disponibilité</h2>
    <p>Le support WhatsApp fonctionne 7j/7. Les réponses sont les plus rapides pendant les heures de bureau en Afrique de l'Ouest.</p>
  </div>
</section>"""


PAGES = [
    ("index.html", page(
        "Chine-Express-Afrique — high-tech livrée au Burkina Faso, en Côte d'Ivoire et au Sénégal",
        "Ordinateurs, montres connectées, audio et accessoires achetés en Chine et livrés au Burkina Faso, en Côte d'Ivoire et au Sénégal. Commande par WhatsApp, paiement Mobile Money.",
        "index.html", accueil_corps)),

    ("boutique.html", page(
        "Boutique — Chine-Express-Afrique",
        "Tous nos produits : ordinateurs, montres connectées, audio, stockage et accessoires livrés en Afrique de l'Ouest.",
        "boutique.html", boutique_corps,
        ("La boutique", "Filtrez par rayon ou lancez une recherche."))),

    ("produit.html", page(
        "Produit — Chine-Express-Afrique",
        "Fiche produit Chine-Express-Afrique.",
        "boutique.html", produit_corps)),

    ("panier.html", page(
        "Mon panier — Chine-Express-Afrique",
        "Votre panier Chine-Express-Afrique.",
        "", panier_corps,
        ("Mon panier", "Vérifiez votre commande, puis confirmez-la sur WhatsApp."))),

    ("compte.html", page(
        "Mon compte — Chine-Express-Afrique",
        "Connectez-vous ou créez votre compte Chine-Express-Afrique.",
        "", compte_corps,
        ("Mon compte", "Connectez-vous pour retrouver vos commandes."))),

    ("apropos.html", page(
        "À propos — Chine-Express-Afrique",
        "Qui nous sommes : une équipe entre la Chine et l'Afrique de l'Ouest, sans intermédiaire.",
        "apropos.html", apropos_corps,
        ("À propos", "Qui nous sommes et comment nous travaillons."))),

    ("livraison.html", page(
        "Livraison et délais — Chine-Express-Afrique",
        "Délais, frais et zones de livraison au Burkina Faso, en Côte d'Ivoire et au Sénégal.",
        "livraison.html", livraison_corps,
        ("Livraison et délais", "Ce qu'il faut savoir avant de commander."))),

    ("contact.html", page(
        "Contact — Chine-Express-Afrique",
        "Joignez notre équipe par WhatsApp ou par email.",
        "contact.html", contact_corps,
        ("Nous joindre", "Une question ? Nous répondons vite sur WhatsApp."))),
]

if __name__ == "__main__":
    for nom, contenu in PAGES:
        with open(nom, "w", encoding="utf-8") as f:
            f.write(contenu)
        print(f"{nom} — {len(contenu)} caractères")
    print(f"\n{len(PAGES)} pages générées.")
