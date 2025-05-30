const SUPABASE_URL = 'https://xbakgvmjukfqkmisqtht.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWtndm1qdWtmcWttaXNxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjQxODYsImV4cCI6MjA2NDE0MDE4Nn0.D_fIYb1bTBdulADUKxfB7syDm_KNXlz6AawhBban38o';

// Obtener ID desde la URL (por ejemplo: /menu.html?restaurante_id=abc123)
const params = new URLSearchParams(window.location.search);
const restauranteId = params.get('restaurante_id');

if (!restauranteId) {
  document.body.innerHTML = "<p>Error: restaurante_id no especificado</p>";
  throw new Error("ID no proporcionado");
}

// Fetch a Supabase
fetch(`${SUPABASE_URL}/rest/v1/menus?restaurante_id=eq.${restauranteId}`, {
  headers: {
    apikey: SUPABASE_API_KEY,
    Authorization: `Bearer ${SUPABASE_API_KEY}`
  }
})
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      document.body.innerHTML = "<p>Menú no encontrado</p>";
      return;
    }

    const menu = data[0];

    document.getElementById('nombre').textContent = menu.nombre;
    document.getElementById('descripcion').textContent = menu.descripcion;

    const lista = document.getElementById('lista-menu');
    menu.items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.nombre}</strong>: ${item.descripcion} - $${item.precio}`;
      lista.appendChild(li);
    });
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = "<p>Error cargando el menú</p>";
  });
