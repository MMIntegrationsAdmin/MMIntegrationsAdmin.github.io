// modelo1.js
export function render(menu, container) {
  container.innerHTML = `
    <h1 class="text-2xl font-bold mb-2">${menu.nombre}</h1>
    <p class="text-gray-500 mb-6">${menu.descripcion}</p>
    <ul>
      ${menu.items.map(item => `
        <li class="mb-1">
          <strong>${item.nombre}</strong> - ${item.precio.toFixed(2)} €<br>
          <span class="text-sm text-gray-400">${item.descripcion || ''}</span>
        </li>
      `).join('')}
    </ul>
  `;
}
