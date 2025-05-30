const SUPABASE_URL = 'https://xbakgvmjukfqkmisqtht.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWtndm1qdWtmcWttaXNxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjQxODYsImV4cCI6MjA2NDE0MDE4Nn0.D_fIYb1bTBdulADUKxfB7syDm_KNXlz6AawhBban38o';

// Obtener el restaurante_id de la URL
const params = new URLSearchParams(window.location.search);
const restauranteId = params.get('restaurante_id');

if (!restauranteId) {
  document.body.innerHTML = "<p class='text-center text-red-500'>Error: restaurante_id no especificado en la URL.</p>";
  throw new Error("restaurante_id no proporcionado");
}

// Realizar la solicitud a Supabase
fetch(`${SUPABASE_URL}/rest/v1/menus?restaurante_id=eq.${restauranteId}`, {
  headers: {
    apikey: SUPABASE_API_KEY,
    Authorization: `Bearer ${SUPABASE_API_KEY}`
  }
})
  .then(res => res.json())
  .then(data => {
    if (data.length === 0) {
      document.body.innerHTML = "<p class='text-center text-red-500'>Menú no encontrado para el restaurante especificado.</p>";
      return;
    }

    const menu = data[0];
    document.getElementById('nombre').textContent = menu.nombre || 'Menú del Restaurante';
    document.getElementById('descripcion').textContent = menu.descripcion || '';

    const lista = document.getElementById('lista-menu');
    lista.innerHTML = ''; // Limpiar contenido previo

    menu.items.forEach(item => {
      const itemHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-xl font-semibold text-gray-800">${item.nombre}</h3>
          <p class="text-gray-600 mt-1">${item.descripcion || ''}</p>
          <p class="text-gray-800 font-bold mt-2">${item.precio ? item.precio.toFixed(2) + ' €' : ''}</p>
        </div>
      `;
      lista.insertAdjacentHTML('beforeend', itemHTML);
    });
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = "<p class='text-center text-red-500'>Error al cargar el menú.</p>";
  });
