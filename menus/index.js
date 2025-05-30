const SUPABASE_URL = 'https://xbakgvmjukfqkmisqtht.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWtndm1qdWtmcWttaXNxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjQxODYsImV4cCI6MjA2NDE0MDE4Nn0.D_fIYb1bTBdulADUKxfB7syDm_KNXlz6AawhBban38o';
const params = new URLSearchParams(window.location.search);
const restauranteId = params.get('restaurante_id');

const body = document.getElementById('main-body');
const toggleBtn = document.getElementById('toggle-theme');

// Activar tema oscuro si estaba guardado
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark', 'bg-gray-900', 'text-white');
  toggleBtn.textContent = '☀️ Modo claro';
}

// Alternar tema
toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  if (isDark) {
    body.classList.replace('bg-gray-100', 'bg-gray-900');
    body.classList.replace('text-gray-800', 'text-white');
    toggleBtn.textContent = '☀️ Modo claro';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace('bg-gray-900', 'bg-gray-100');
    body.classList.replace('text-white', 'text-gray-800');
    toggleBtn.textContent = '🌙 Modo oscuro';
    localStorage.setItem('theme', 'light');
  }
});

if (!restauranteId) {
  document.body.innerHTML = "<p class='text-center text-red-500'>Error: restaurante_id no especificado en la URL.</p>";
  throw new Error("restaurante_id no proporcionado");
}

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
    lista.innerHTML = '';

    menu.items.forEach(item => {
      const itemHTML = `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">${item.nombre}</h3>
          <p class="text-gray-600 dark:text-gray-300 mt-1">${item.descripcion || ''}</p>
          <p class="text-gray-800 dark:text-gray-100 font-bold mt-2">${item.precio.toFixed(2)} €</p>
        </div>
      `;
      lista.insertAdjacentHTML('beforeend', itemHTML);
    });
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = "<p class='text-center text-red-500'>Error al cargar el menú.</p>";
  });
