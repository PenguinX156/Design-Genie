for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    const showAll = button.dataset.filter === 'all';
    for (const item of document.querySelectorAll('.campaign')) item.hidden = !showAll && item.dataset.status !== 'active';
    for (const control of document.querySelectorAll('[data-filter]')) control.setAttribute('aria-pressed', String(control === button));
  });
}
