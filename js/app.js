/* ============================================================
   Chine-Express-Afrique — Logique du site
   Panier stocké dans le navigateur (localStorage) +
   finalisation de commande via WhatsApp.
   ============================================================ */

/* ---------- Produits : Supabase si configuré, sinon liste locale ---------- */
let PRODUITS_ACTIFS = PRODUITS; // repli par défaut = js/data.js

async function chargerProduits() {
  if (!window.supabase) return PRODUITS_ACTIFS; // Supabase non configuré : on garde la liste locale
  try {
    // On lit la vue "produits_affichage" : elle calcule les badges
    // (Top vente / Nouveau / Promo) à partir des vraies données.
    const { data, error } = await window.supabase
      .from("produits_affichage")
      .select("*")
      .order("nb_ventes", { ascending: false, nullsFirst: false });
    if (error || !data || !data.length) return PRODUITS_ACTIFS;
    PRODUITS_ACTIFS = data.map(p => ({
      id: p.id,
      nom: p.nom,
      cat: p.categorie,
      prix: p.prix,
      ancienPrix: p.ancien_prix,
      badge: p.badge_auto,        // badge calculé par la base, pas saisi à la main
      img: p.image,
      desc: p.description,
      nbVentes: p.nb_ventes || 0
    }));
    return PRODUITS_ACTIFS;
  } catch (e) {
    console.warn("Supabase indisponible, utilisation du catalogue local.", e);
    return PRODUITS_ACTIFS;
  }
}

/* ---------- Utilitaires ---------- */
function fmt(prix) {
  return prix.toLocaleString("fr-FR").replace(/\u202F|\s/g, ".") + " CFA";
}
function produitParId(id) {
  return PRODUITS_ACTIFS.find(p => p.id === id);
}
function badgeClasse(b) {
  if (b === "Promo") return "promo";
  if (b === "Nouveau") return "nouveau";
  return "top";
}

/* ---------- Panier (localStorage) ---------- */
const CLE_PANIER = "cea_panier";

function lirePanier() {
  try { return JSON.parse(localStorage.getItem(CLE_PANIER)) || {}; }
  catch (e) { return {}; }
}
function ecrirePanier(p) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(p));
  majBadgePanier();
}
function ajouterAuPanier(id, qte) {
  const panier = lirePanier();
  panier[id] = (panier[id] || 0) + (qte || 1);
  ecrirePanier(panier);
  toast("Ajouté au panier ✓");
}
function retirerDuPanier(id) {
  const panier = lirePanier();
  delete panier[id];
  ecrirePanier(panier);
}
function changerQte(id, delta) {
  const panier = lirePanier();
  panier[id] = (panier[id] || 0) + delta;
  if (panier[id] <= 0) delete panier[id];
  ecrirePanier(panier);
}
function totalPanier() {
  const panier = lirePanier();
  let total = 0, nb = 0;
  for (const id in panier) {
    const p = produitParId(id);
    if (p) { total += p.prix * panier[id]; nb += panier[id]; }
  }
  return { total, nb };
}
function majBadgePanier() {
  const b = document.querySelector(".panier-badge");
  if (b) b.textContent = totalPanier().nb;
}

/* ---------- Toast ---------- */
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("on"), 2200);
}

/* Calcule le pourcentage d'économie réel à partir de l'ancien prix */
function remise(p) {
  if (!p.ancienPrix || p.ancienPrix <= p.prix) return null;
  return Math.round((1 - p.prix / p.ancienPrix) * 100);
}

/* ---------- Rendu d'une carte produit ---------- */
function carteProduit(p) {
  const r = remise(p);
  return `
  <article class="prod">
    <a class="visu" href="produit.html?id=${p.id}">
      ${p.badge ? `<span class="badge ${badgeClasse(p.badge)}">${p.badge}</span>` : ""}
      <img src="${p.img}" alt="${p.nom}" loading="lazy">
    </a>
    <div class="infos">
      <span class="cat-lbl">${CATEGORIES[p.cat] || ""}</span>
      <a class="nom" href="produit.html?id=${p.id}">${p.nom}</a>
      <div class="prix-ligne">
        <span class="prix">${fmt(p.prix)}</span>
        ${p.ancienPrix ? `<span class="ancien">${fmt(p.ancienPrix)}</span>` : ""}
        ${r ? `<span class="remise">-${r}%</span>` : ""}
      </div>
      <button class="aj" onclick="ajouterAuPanier('${p.id}',1)">Ajouter au panier</button>
    </div>
  </article>`;
}

/* ---------- Page d'accueil : meilleures ventes ---------- */
function rendreAccueil() {
  const zone = document.getElementById("zone-meilleures-ventes");
  if (!zone) return;
  const selection = PRODUITS_ACTIFS.slice(0, 10);
  zone.innerHTML = selection.map(carteProduit).join("");
}

/* ---------- Page boutique : filtres + recherche ---------- */
function rendreBoutique() {
  const zone = document.getElementById("zone-boutique");
  if (!zone) return;

  const params = new URLSearchParams(location.search);
  let catActive = params.get("cat") || "toutes";
  let recherche = (params.get("q") || "").toLowerCase();

  const zoneFiltres = document.getElementById("zone-filtres");
  const cats = ["toutes", ...Object.keys(CATEGORIES)];
  zoneFiltres.innerHTML = cats.map(c =>
    `<button class="filtre ${c === catActive ? "on" : ""}" data-cat="${c}">
      ${c === "toutes" ? "Tout voir" : CATEGORIES[c]}
    </button>`).join("");

  zoneFiltres.querySelectorAll(".filtre").forEach(btn => {
    btn.addEventListener("click", () => {
      catActive = btn.dataset.cat;
      const url = new URL(location.href);
      if (catActive === "toutes") url.searchParams.delete("cat");
      else url.searchParams.set("cat", catActive);
      history.replaceState(null, "", url);
      zoneFiltres.querySelectorAll(".filtre").forEach(b => b.classList.toggle("on", b === btn));
      afficher();
    });
  });

  function afficher() {
    let liste = PRODUITS_ACTIFS;
    if (catActive !== "toutes") liste = liste.filter(p => p.cat === catActive);
    if (recherche) liste = liste.filter(p => p.nom.toLowerCase().includes(recherche));
    zone.innerHTML = liste.length
      ? liste.map(carteProduit).join("")
      : `<p class="vide">Aucun produit trouvé. Essayez une autre recherche, ou <a href="contact.html" style="color:var(--or-fonce);font-weight:600">demandez-nous sur WhatsApp</a> — nous pouvons sourcer presque tout en Chine.</p>`;
  }
  afficher();
}

/* ---------- Fiche produit ---------- */
function rendreFiche() {
  const zone = document.getElementById("zone-fiche");
  if (!zone) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = produitParId(id);
  if (!p) {
    zone.innerHTML = `<p class="vide">Produit introuvable. <a href="boutique.html" style="color:var(--or-fonce);font-weight:600">Retour à la boutique</a></p>`;
    return;
  }
  document.title = p.nom + " — " + CONFIG.nomBoutique;
  const r = remise(p);
  let qte = 1;
  zone.innerHTML = `
    <div class="fiche">
      <div class="fiche-visu">
        ${p.badge ? `<span class="badge ${badgeClasse(p.badge)}" style="position:static;display:inline-block;margin-bottom:12px">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.nom}">
      </div>
      <div class="fiche-infos">
        <span class="cat-lbl">${CATEGORIES[p.cat] || ""}</span>
        <h1>${p.nom}</h1>
        <div class="prix-ligne">
          <span class="prix">${fmt(p.prix)}</span>
          ${p.ancienPrix ? `<span class="ancien">${fmt(p.ancienPrix)}</span>` : ""}
          ${r ? `<span class="remise">-${r}%</span>` : ""}
        </div>
        ${r ? `<p class="economie">Vous économisez ${fmt(p.ancienPrix - p.prix)}</p>` : ""}
        <p class="desc">${p.desc}</p>
        <div class="fiche-actions">
          <div class="qte">
            <button id="q-moins" aria-label="Diminuer la quantité">−</button>
            <span id="q-val">1</span>
            <button id="q-plus" aria-label="Augmenter la quantité">+</button>
          </div>
          <button class="btn btn-or btn-bloc" id="btn-ajout">Ajouter au panier</button>
          <button class="btn btn-wa btn-bloc" id="btn-wa-direct">Commander sur WhatsApp</button>
        </div>
        <div class="fiche-garanties">
          <div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg><span>Livré au Burkina Faso, en Côte d'Ivoire et au Sénégal, avec suivi</span></div>
          <div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>Contrôlé avant l'expédition</span></div>
          <div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4-1L3 20l1.1-5.4A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/></svg><span>Une question ? Réponse le jour même sur WhatsApp</span></div>
        </div>
      </div>
    </div>`;

  const val = document.getElementById("q-val");
  document.getElementById("q-moins").onclick = () => { if (qte > 1) { qte--; val.textContent = qte; } };
  document.getElementById("q-plus").onclick = () => { qte++; val.textContent = qte; };
  document.getElementById("btn-ajout").onclick = () => ajouterAuPanier(p.id, qte);
  document.getElementById("btn-wa-direct").onclick = async () => {
    await enregistrerCommande(
      [{ id: p.id, nom: p.nom, quantite: qte, prix: p.prix }],
      p.prix * qte
    );
    const msg = `Bonjour ${CONFIG.nomBoutique}\nJe souhaite commander :\n\n• ${p.nom}\n  Quantité : ${qte}\n  Prix : ${fmt(p.prix)} l'unité\n\nTotal : ${fmt(p.prix * qte)}\n\nMerci de me confirmer la disponibilité et le délai de livraison.`;
    window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  };
}

/* ---------- Page panier ---------- */
function rendrePanier() {
  const zone = document.getElementById("zone-panier");
  if (!zone) return;

  function afficher() {
    const panier = lirePanier();
    const ids = Object.keys(panier).filter(id => produitParId(id));
    if (!ids.length) {
      zone.innerHTML = `<p class="vide">Votre panier est vide.<br><br><a class="btn btn-encre" href="boutique.html">Découvrir la boutique</a></p>`;
      return;
    }
    const { total, nb } = totalPanier();
    zone.innerHTML = `
      <div class="panier-grid">
        <div class="panier-liste">
          ${ids.map(id => {
            const p = produitParId(id);
            const q = panier[id];
            return `
            <div class="p-item">
              <img src="${p.img}" alt="${p.nom}" loading="lazy">
              <div class="corps">
                <div class="nom">${p.nom}</div>
                <div class="u">${fmt(p.prix)} l'unité</div>
                <div class="bas">
                  <div class="qte">
                    <button onclick="changerQte('${id}',-1);document.dispatchEvent(new Event('maj-panier'))" aria-label="Retirer un exemplaire">−</button>
                    <span>${q}</span>
                    <button onclick="changerQte('${id}',1);document.dispatchEvent(new Event('maj-panier'))" aria-label="Ajouter un exemplaire">+</button>
                  </div>
                  <span class="prix">${fmt(p.prix * q)}</span>
                </div>
                <button class="suppr" onclick="retirerDuPanier('${id}');document.dispatchEvent(new Event('maj-panier'))">Retirer du panier</button>
              </div>
            </div>`;
          }).join("")}
        </div>
        <aside class="panier-total">
          <h3>Récapitulatif</h3>
          <div class="pt-ligne"><span>Articles</span><span>${nb}</span></div>
          <div class="pt-ligne"><span>Livraison</span><span>Chiffrée sur WhatsApp</span></div>
          <div class="pt-ligne total"><span>Total articles</span><span class="prix">${fmt(total)}</span></div>
          <button class="btn btn-wa btn-bloc" style="margin-top:16px" onclick="commanderWhatsApp()">Commander sur WhatsApp</button>
          <p class="note-wa">WhatsApp s'ouvre avec votre commande déjà rédigée. Un conseiller confirme la disponibilité, les frais de livraison et le paiement.</p>
        </aside>
      </div>`;
  }
  document.addEventListener("maj-panier", afficher);
  afficher();
}

/* ---------- Commande WhatsApp depuis le panier ---------- */
async function commanderWhatsApp() {
  const panier = lirePanier();
  const ids = Object.keys(panier).filter(id => produitParId(id));
  if (!ids.length) return;

  let lignes = [], total = 0, articles = [];
  ids.forEach(id => {
    const p = produitParId(id);
    const q = panier[id];
    lignes.push(`• ${p.nom}\n  Quantité : ${q} — ${fmt(p.prix * q)}`);
    total += p.prix * q;
    articles.push({ id: p.id, nom: p.nom, quantite: q, prix: p.prix });
  });

  // Enregistre la commande (statut "en_attente") et récupère son numéro
  const ref = await enregistrerCommande(articles, total);

  const ligneRef = ref ? `\nNuméro de commande : ${ref}\n` : "";
  const msg = `Bonjour ${CONFIG.nomBoutique}\nJe souhaite passer la commande suivante :\n${ligneRef}\n${lignes.join("\n\n")}\n\nTotal produits : ${fmt(total)}\n\nMerci de me confirmer la disponibilité, les frais et le délai de livraison.`;
  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");

  // Le panier est vidé : la commande est partie, le client repart de zéro
  ecrirePanier({});
  afficherConfirmation(ref, total);
}

/* Écran de confirmation : le client voit que sa commande est bien partie */
function afficherConfirmation(ref, total) {
  const zone = document.getElementById("zone-panier");
  if (!zone) return;

  zone.innerHTML = `
    <div class="confirmation">
      <div class="conf-coche" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h2>Commande envoyée</h2>
      ${ref ? `<p class="conf-ref">Numéro de commande : <b>${ref}</b></p>` : ""}
      <p class="conf-montant">${fmt(total)}</p>

      <div class="conf-suite">
        <p><b>Et maintenant ?</b></p>
        <ol>
          <li>WhatsApp vient de s'ouvrir avec votre commande. <b>Envoyez le message</b> pour la transmettre.</li>
          <li>Un conseiller vous répond avec le prix final, les frais de livraison et le délai.</li>
          <li>Vous réglez par Mobile Money, puis nous expédions.</li>
        </ol>
        <p class="conf-note">Votre commande n'est définitive qu'après confirmation par notre conseiller sur WhatsApp.</p>
      </div>

      <div class="conf-actions">
        <a class="btn btn-wa btn-bloc" data-wa="Bonjour, je viens de passer une commande sur le site${ref ? ' (numéro ' + ref + ')' : ''}." href="#">Rouvrir WhatsApp</a>
        <a class="btn btn-encre btn-bloc" href="boutique.html">Continuer mes achats</a>
      </div>
    </div>`;

  initLiensWa();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Enregistre une commande dans Supabase et renvoie son numéro.
   Silencieux en cas d'échec : le client doit pouvoir commander
   même si la base est momentanément indisponible. */
async function enregistrerCommande(articles, total) {
  // Numéro court et lisible, du type CE-4F2A9  (utilisable même hors ligne)
  const ref = "CE-" + Date.now().toString(36).slice(-5).toUpperCase();

  if (!window.supabase) return ref;
  try {
    const { data: { user } } = await window.supabase.auth.getUser();
    let infos = { client_id: user ? user.id : null };

    if (user) {
      const { data: profil } = await window.supabase
        .from("profils").select("nom_complet, telephone, ville, pays")
        .eq("id", user.id).single();
      if (profil) {
        infos.nom_client = profil.nom_complet;
        infos.telephone = profil.telephone;
        infos.ville = profil.ville;
        infos.pays = profil.pays;
      }
    }

    await window.supabase.from("commandes").insert({
      ...infos,
      reference: ref,
      produits: articles,
      total: total,
      statut: "en_attente"
    });
  } catch (e) {
    console.warn("Commande non enregistrée en base :", e);
  }
  return ref;
}

/* ---------- Recherche : formulaire bureau + formulaire mobile ---------- */
function initRecherche() {
  ["form-recherche", "form-recherche-mobile"].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const q = form.querySelector("input").value.trim();
      location.href = "boutique.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    });
  });

  // Le bouton loupe déplie la barre de recherche sur mobile
  const loupe = document.getElementById("btn-loupe");
  const barre = document.getElementById("form-recherche-mobile");
  if (loupe && barre) {
    loupe.addEventListener("click", () => {
      const ouverte = !barre.classList.contains("cache");
      barre.classList.toggle("cache", ouverte);
      loupe.setAttribute("aria-expanded", String(!ouverte));
      if (!ouverte) barre.querySelector("input").focus();
    });
  }
}

/* ---------- Liens WhatsApp génériques ---------- */
function initLiensWa() {
  document.querySelectorAll("[data-wa]").forEach(el => {
    const msg = el.dataset.wa || "Bonjour, j'ai une question sur vos produits.";
    el.setAttribute("href", "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* ---------- Initialisation ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  majBadgePanier();
  initRecherche();
  initLiensWa();
  await chargerProduits();
  rendreAccueil();
  rendreBoutique();
  rendreFiche();
  rendrePanier();
  if (typeof initCompte === "function") initCompte();
});
