const SUPABASE_URL = 'https://xbakgvmjukfqkmisqtht.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYWtndm1qdWtmcWttaXNxdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjQxODYsImV4cCI6MjA2NDE0MDE4Nn0.D_fIYb1bTBdulADUKxfB7syDm_KNXlz6AawhBban38o';

const params = new URLSearchParams(window.location.search);
const restauranteId = params.get('restaurante_id');

const body = document.getElementById('main-body');
const vistaHome = document.getElementById('vista-home');
const vistaCategoria = document.getElementById('vista-categoria');
const nombre = document.getElementById('nombre');
const descripcion = document.getElementById('descripcion');

let menuData = null;

if (!restauranteId) {
  body.innerHTML = '<p class="text-center text-red-500">Error: restaurante_id no especificado.</p>';
  throw new Error("Falta restaurante_id");
}

function mostrarHome() {
  vistaHome.classList.remove('hidden');
  vistaCategoria.classList.add('hidden');

  const categorias = {};
  menuData.items.forEach(item => {
    const cat = item.categoria || 'Otros';
    if (!categorias[cat]) categorias[cat] = [];
    categorias[cat].push(item);
  });

  vistaHome.innerHTML = '';
  Object.keys(categorias).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'block w-full text-left py-3 border-b border-gray-700 hover:bg-gray-800 px-4';
    btn.innerHTML = `<span class='text-orange-400 font-bold uppercase'>${cat}</span>`;
    btn.onclick = () => mostrarCategoria(cat, categorias[cat]);
    vistaHome.appendChild(btn);
  });
}

function mostrarCategoria(nombreCat, items) {
  vistaHome.classList.add('hidden');
  vistaCategoria.classList.remove('hidden');

  vistaCategoria.innerHTML = `
    <button class="text-sm mb-4 text-orange-400" onclick="mostrarHome()">&#8592; Volver</button>
    <h2 class="text-xl font-bold mb-2">${nombreCat}</h2>
    <div class="space-y-4">
      ${items.map(item => `
        <div class="flex justify-between border-b border-gray-700 pb-1">
          <span class="font-medium">${item.nombre}</span>
          <span class="text-orange-400">${item.precio.toFixed(2)} €</span>
        </div>
        <p class="text-sm text-gray-400 mb-2">${item.descripcion || ''}</p>
      `).join('')}
    </div>
  `;
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
      body.innerHTML = '<p class="text-center text-red-500">Menú no encontrado.</p>';
      return;
    }
    menuData = data[0];
    nombre.textContent = menuData.nombre;
    descripcion.textContent = menuData.descripcion;
    mostrarHome();
  })
  .catch(err => {
    console.error(err);
    body.innerHTML = '<p class="text-center text-red-500">Error al cargar el menú.</p>';
  });
