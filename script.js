'use strict';
document.body.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuButton.focus();
  }
});
const rows = [...document.querySelectorAll('.command-row')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#command-search');
let category = 'all';
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filterCommands() {
  const term = normalize(search.value.trim());
  let count = 0;
  rows.forEach(row => {
    const show = (category === 'all' || row.dataset.category === category) && normalize(row.textContent).includes(term);
    row.hidden = !show;
    if (show) count += 1;
  });
  document.querySelector('#command-count').textContent = `${count} ${count === 1 ? 'comando disponível' : 'comandos disponíveis'}`;
  document.querySelector('.empty-state').hidden = count > 0;
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  category = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  filterCommands();
}));
search.addEventListener('input', filterCommands);
document.querySelector('.command-controls').hidden = false;
filterCommands();
const copyStatus = document.querySelector('.copy-status');
document.querySelectorAll('.copy-button').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const code = button.closest('.command-row').querySelector('code');
    try {
      await Promise.race([
        navigator.clipboard.writeText(code.textContent),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Clipboard timeout')), 1500))
      ]);
      button.textContent = 'Copiado';
      copyStatus.textContent = 'Comando copiado. Para comandos por menção, selecione o RevolutX no Discord.';
      setTimeout(() => { button.textContent = 'Copiar'; }, 2200);
    } catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      copyStatus.textContent = 'Não foi possível copiar automaticamente. O comando foi selecionado para você copiar.';
    }
  });
});
