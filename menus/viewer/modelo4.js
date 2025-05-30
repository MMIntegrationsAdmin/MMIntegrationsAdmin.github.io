// modelo4.js
export function render(menu, container) {
  container.innerHTML = `
    <h1 class="text-2xl font-bold mb-4">${menu.nombre}</h1>
    <p class="mb-4 text-gray-400">${menu.descripcion}</p>
    <div class="space-y-4">
      ${getCategorias(menu.items).map(([cat, items], idx) => `
        <div class="border rounded-md">
          <button onclick="document.getElementById('cat-${idx}').classList.toggle('hidden')" class="w-full text-left px-4 py-2 font-semibold bg-gray-200 dark:bg-gray-700">${cat}</button>
          <div id="cat-${idx}" class="hidden px-4 py-2">
            ${items.map(item => `
              <div class="py-2 border-b">
                <div class="flex justify-between">
                  <span>${item.nombre}</span>
                  <span>${item.precio.toFixed(2)} €</span>
                </div>
                <p class="text-sm text-gray-400">${item.descripcion || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function getCategorias(items) {
  const map = {};
  items.forEach(i => {
    const c = i.categoria || 'Otros';
    if (!map[c]) map[c] = [];
    map[c].push(i);
  });
  return Object.entries(map);
}
