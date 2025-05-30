const SUPABASE_URL = 'https://xbakgvmjukfqkmisqtht.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWtndm1qdWtmcWttaXNxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjQxODYsImV4cCI6MjA2NDE0MDE4Nn0.D_fIYb1bTBdulADUKxfB7syDm_KNXlz6AawhBban38o';

const params = new URLSearchParams(window.location.search);
const restauranteId = params.get('restaurante_id');

const body = document.getElementById('main-body');
const toggleBtn = document.getElementById('toggle-theme');

// Tema oscuro
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark', 'bg-gray-900', 'text-white');
  toggleBtn.textContent = '☀️ Modo claro';
}
toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  body.classList.toggle('bg-gray-900', isDark);
  body.classList.toggle('bg-gray-100', !isDark);
  body.classList.toggle('text-white', isDark);
  body.classList.toggle('text-gray-800', !isDark);
  toggleBtn.textContent = isDark ? '☀️ Modo claro' : '🌙 Modo oscuro';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

if (!restauranteId) {
  document.body.innerHTML = "<p class='text-center text-red-500'>Error: restaurante_id no especificado en la URL.</p>";
  throw new Error("ID no especificado");
}

fetch(`${SUPABASE_URL}/rest/v1/menus?restaurante_id=eq.${restauranteId}`, {
  headers: {
    apikey: SUPABASE_API_KEY,
    Authorization: `Bearer ${SUPABASE_API_KEY}`
  }
})
  .then(res => res.json())
  .then(data => {
    if (!data.length) {
      document.body.innerHTML = "<p class='text-center text-red-500'>Menú no encontrado.</p>";
      return;
    }

    const menu = data[0];
    document.getElementById('nombre').textContent = menu.nombre || 'Menú';
    document.getElementById('descripcion').textContent = menu.descripcion || '';

    const lista = document.getElementById('lista-menu');
    lista.innerHTML = '';

    const agrupado = {};
    menu.items.forEach(item => {
      const cat = item.categoria || 'Otros';
      if (!agrupado[cat]) agrupado[cat] = [];
      agrupado[cat].push(item);
    });

    for (const categoria in agrupado) {
      const platos = agrupado[categoria];

      const wrapper = document.createElement('div');
      wrapper.className = 'border-b pb-2 mb-4';

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'w-full text-left text-xl font-bold py-2 dark:text-white flex justify-between items-center';
      toggleBtn.innerHTML = `
        ${categoria}
        <span class="text-gray-500 dark:text-gray-300 transition-transform">&#9660;</span>
      `;

      const platosContainer = document.createElement('div');
      platosContainer.className = 'mt-2 hidden space-y-4 transition-all duration-300';

      platos.forEach(plato => {
        const itemHTML = `
          <div class="border-b pb-2">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold dark:text-white">${plato.nombre}</h3>
              <span class="text-gray-700 dark:text-gray-300 font-medium">${plato.precio.toFixed(2)} €</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm">${plato.descripcion || ''}</p>
          </div>
        `;
        platosContainer.insertAdjacentHTML('beforeend', itemHTML);
      });

      toggleBtn.addEventListener('click', () => {
        const expanded = !platosContainer.classList.contains('hidden');
        platosContainer.classList.toggle('hidden');
        toggleBtn.querySelector('span').style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
      });

      wrapper.appendChild(toggleBtn);
      wrapper.appendChild(platosContainer);
      lista.appendChild(wrapper);
    }
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = "<p class='text-center text-red-500'>Error cargando el menú.</p>";
  });
