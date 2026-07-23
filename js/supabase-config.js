/* ============================================================
   Connexion à Supabase (base de données + comptes clients)
   ⚠️ À remplir après avoir créé votre projet sur supabase.com
   Voir GUIDE-SUPABASE.md pour les instructions pas à pas.
   ============================================================ */

const SUPABASE_URL = "https://ouziusslqigzubsruqgk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eml1c3NscWlnenVic3J1cWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTcxODAsImV4cCI6MjEwMDMzMzE4MH0.LgtieIEKMXsJz8ZAohOqXtDmSm0jebZ1EtwJSlbO04A";  // ⚠️ collez ici la clé complète "Publishable key" copiée depuis Supabase

// Ne pas modifier en dessous de cette ligne
window.supabase = null;
if (typeof window.supabaseJs !== "undefined" && SUPABASE_URL !== "VOTRE_URL_SUPABASE" && SUPABASE_ANON_KEY !== "VOTRE_CLE_PUBLIQUE") {
  window.supabase = window.supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
