// modelo2.js
export function render(menu, container) {
  container.innerHTML = `
    <h1 class="text-3xl font-extrabold text-orange-400 mb-4">${menu.nombre}</h1>
    <p class="italic text-sm mb-4">${menu.descripcion}</p>
    <div class="divide-y divide-gray-700">
      ${menu.items.map(item => `
        <div class="py-2">
          <div class="flex justify-between font-semibold">
            <span>${item.nombre}</span>
            <span>${item.precio.toFixed(2)} €</span>
          </div>
          <p class="text-sm text-gray-400">${item.descripcion || ''}</p>
        </div>
      `).join('')}
    </div>
  `;
}
