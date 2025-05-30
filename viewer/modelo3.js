// modelo3.js
export function render(menu, container) {
  container.innerHTML = `
    <h1 class="text-xl uppercase tracking-wide border-b pb-2 mb-4">${menu.nombre}</h1>
    ${menu.items.map(item => `
      <div class="text-sm flex justify-between py-1">
        <span>${item.nombre}</span><span>${item.precio.toFixed(2)} €</span>
      </div>
    `).join('')}
  `;
}
