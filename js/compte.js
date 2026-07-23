/* ============================================================
   Comptes clients — Supabase Auth
   ============================================================ */

function initCompte() {
  const zone = document.getElementById("zone-compte");
  if (!zone) return;

  if (!window.supabase) {
    zone.innerHTML = `<div class="carte">
      <h2 style="margin-top:0">Bientôt disponible</h2>
      <p>Les comptes clients ne sont pas encore activés. En attendant, commandez directement par WhatsApp — c'est tout aussi rapide.</p>
      <a class="btn btn-wa btn-bloc" style="margin-top:12px" data-wa="Bonjour, je souhaite commander." href="#">Commander sur WhatsApp</a>
    </div>`;
    initLiensWa();
    return;
  }

  afficherEtatCompte();

  async function afficherEtatCompte() {
    const { data: { user } } = await window.supabase.auth.getUser();

    if (user) {
      const { data: profil } = await window.supabase
        .from("profils").select("*").eq("id", user.id).single();

      const lieu = [profil?.ville, profil?.pays].filter(Boolean).join(", ");
      zone.innerHTML = `
        <div class="carte" style="max-width:440px">
          <h2 style="margin-top:0">Bonjour ${profil?.nom_complet || ""}</h2>
          <p>${user.email}</p>
          ${profil?.telephone ? `<p>Téléphone : <b>${profil.telephone}</b></p>` : ""}
          ${lieu ? `<p>Livraison à : <b>${lieu}</b></p>` : ""}
          <button class="btn btn-encre btn-bloc" style="margin-top:14px" id="btn-deco">Se déconnecter</button>
        </div>`;
      document.getElementById("btn-deco").onclick = async () => {
        await window.supabase.auth.signOut();
        afficherEtatCompte();
      };
      return;
    }

    zone.innerHTML = `
      <div class="carte" style="max-width:440px">
        <div class="rail" id="onglets" style="margin-bottom:18px">
          <button class="filtre on" data-onglet="connexion" type="button">Se connecter</button>
          <button class="filtre" data-onglet="inscription" type="button">Créer un compte</button>
        </div>

        <form id="form-compte" style="display:grid;gap:13px">
          <div class="champ inscription-seul" hidden>
            <label for="c-nom">Nom complet</label>
            <input id="c-nom" type="text" name="nom" autocomplete="name">
          </div>
          <div class="champ inscription-seul" hidden>
            <label for="c-tel">Téléphone WhatsApp</label>
            <input id="c-tel" type="tel" name="telephone" placeholder="70 00 00 00" autocomplete="tel">
          </div>
          <div class="champ inscription-seul" hidden>
            <label for="c-pays">Pays de livraison</label>
            <select id="c-pays" name="pays">
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div class="champ inscription-seul" hidden>
            <label for="c-ville">Ville</label>
            <input id="c-ville" type="text" name="ville" placeholder="Ouagadougou, Abidjan, Dakar…" autocomplete="address-level2">
          </div>
          <div class="champ">
            <label for="c-email">Email</label>
            <input id="c-email" type="email" name="email" required autocomplete="email">
          </div>
          <div class="champ">
            <label for="c-mdp">Mot de passe</label>
            <input id="c-mdp" type="password" name="motdepasse" required minlength="6" autocomplete="current-password">
          </div>
          <button type="submit" class="btn btn-or btn-bloc" id="btn-valider">Se connecter</button>
          <p id="msg-compte" style="font-size:.84rem;color:var(--texte-doux);min-height:1.2em"></p>
        </form>
      </div>`;

    let mode = "connexion";
    const champsInscription = zone.querySelectorAll(".inscription-seul");

    zone.querySelectorAll("#onglets .filtre").forEach(btn => {
      btn.onclick = () => {
        mode = btn.dataset.onglet;
        const inscription = mode === "inscription";
        zone.querySelectorAll("#onglets .filtre")
            .forEach(b => b.classList.toggle("on", b === btn));
        champsInscription.forEach(c => { c.hidden = !inscription; });
        document.getElementById("btn-valider").textContent =
          inscription ? "Créer mon compte" : "Se connecter";
        document.getElementById("c-mdp").autocomplete =
          inscription ? "new-password" : "current-password";
        document.getElementById("msg-compte").textContent = "";
      };
    });

    document.getElementById("form-compte").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      const msg = document.getElementById("msg-compte");
      const bouton = document.getElementById("btn-valider");
      const email = f.email.value.trim();
      const motdepasse = f.motdepasse.value;

      bouton.disabled = true;
      msg.textContent = "Un instant…";

      try {
        if (mode === "inscription") {
          const { error } = await window.supabase.auth.signUp({
            email,
            password: motdepasse,
            options: {
              data: {
                nom_complet: f.nom.value.trim(),
                telephone: f.telephone.value.trim(),
                ville: f.ville.value.trim(),
                pays: f.pays.value
              }
            }
          });
          if (error) throw error;
          msg.textContent = "Compte créé. Ouvrez votre boîte mail pour confirmer l'inscription.";
        } else {
          const { error } = await window.supabase.auth
            .signInWithPassword({ email, password: motdepasse });
          if (error) throw error;
          afficherEtatCompte();
          return;
        }
      } catch (err) {
        msg.textContent = traduireErreur(err.message);
      } finally {
        bouton.disabled = false;
      }
    });
  }
}

/* Traduit les messages d'erreur Supabase en français clair */
function traduireErreur(message) {
  const m = (message || "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (m.includes("user already registered")) return "Un compte existe déjà avec cet email. Connectez-vous.";
  if (m.includes("password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (m.includes("unable to validate email")) return "Cette adresse email n'est pas valide.";
  if (m.includes("email not confirmed")) return "Confirmez d'abord votre email : le lien vous a été envoyé.";
  return "Une erreur est survenue : " + message;
}
