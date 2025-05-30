const SUPABASE_URL = 'https://xbakgvmjukfqkmisqtht.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWtndm1qdWtmcWttaXNxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjQxODYsImV4cCI6MjA2NDE0MDE4Nn0.D_fIYb1bTBdulADUKxfB7syDm_KNXlz6AawhBban38o';

// main.js
const app = document.getElementById('app');
const params = new URLSearchParams(window.location.search);
const urlModelo = params.get('modelo');
const restauranteId = params.get('restaurante_id');

if (!restauranteId) {
  app.innerHTML = '<p class="text-red-500">Falta el restaurante_id en la URL.</p>';
  throw new Error("Falta restaurante_id");
}

async function fetchMenu(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/menus?restaurante_id=eq.${id}`, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`
    }
  });
  const data = await res.json();
  return data[0];
}

(async () => {
  try {
    const menu = await fetchMenu(restauranteId);
    if (!menu) {
      app.innerHTML = '<p class="text-red-500">Menú no encontrado.</p>';
      return;
    }

    const modeloFinal = menu.modelo === -1 ? (urlModelo || '1') : String(menu.modelo);
    const modulo = await import(`./modelo${modeloFinal}.js`);
    modulo.render(menu, app);

  } catch (err) {
    console.error(err);
    app.innerHTML = '<p class="text-red-500">Error al cargar el menú.</p>';
  }
})();
