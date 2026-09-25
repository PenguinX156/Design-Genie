import './style.css';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.hero-art');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const stage = document.querySelector('.stage');
const description = document.querySelector('#study-description');
const options = [...document.querySelectorAll('.study-option')];

const descriptions = {
  fold: 'A single surface bends until inside and outside become the same place.',
  current: 'A restless current gives invisible forces a shape you can almost touch.',
  afterimage: 'Light leaves a trace of what was there, and what might come next.'
};

let sculpture = null;
let sculpturePromise = null;
let selectedStudy = 'fold';
let stageVisible = false;

async function ensureSculpture() {
  if (sculpture) return sculpture;
  if (sculpturePromise) return sculpturePromise;
  sculpturePromise = import('./sculpture.js').then(({ createSculpture }) => {
    sculpture = createSculpture(stage, reducedMotion);
    sculpture.setStudy(selectedStudy);
    sculpture.setVisible(stageVisible);
    stage.classList.add('is-ready');
    return sculpture;
  }).catch(error => {
    stage.classList.add('is-fallback');
    console.info('Lumenfield is displaying the static sculpture fallback.', error.message);
    return null;
  });
  return sculpturePromise;
}

const engageStage = () => {
  stage.classList.add('is-engaged');
  if (stageVisible) void ensureSculpture();
};
stage.addEventListener('pointerdown', engageStage);
stage.addEventListener('keydown', event => {
  if (event.key.startsWith('Arrow')) engageStage();
});

function closeMenu() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

options.forEach(option => {
  option.addEventListener('click', () => {
    const next = option.dataset.study;
    if (next === selectedStudy) return;
    selectedStudy = next;
    options.forEach(button => {
      const active = button === option;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    description.classList.add('is-changing');
    engageStage();
    window.setTimeout(() => {
      description.textContent = descriptions[next];
      description.classList.remove('is-changing');
    }, reducedMotion.matches ? 0 : 170);
    sculpture?.setStudy(next);
  });
});

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

if (!reducedMotion.matches && window.matchMedia('(pointer:fine)').matches) {
  let frame = 0;
  hero.addEventListener('pointermove', event => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.width / 2) / bounds.width;
      const y = (event.clientY - bounds.height / 2) / bounds.height;
      heroArt.style.setProperty('--parallax-x', `${x * -22}px`);
      heroArt.style.setProperty('--parallax-y', `${y * -18}px`);
      frame = 0;
    });
  });
}

const stageObserver = new IntersectionObserver(entries => {
  stageVisible = entries[0].isIntersecting;
  if (stageVisible && (!reducedMotion.matches || stage.classList.contains('is-engaged'))) void ensureSculpture();
  sculpture?.setVisible(stageVisible);
}, { rootMargin: '220px 0px' });
stageObserver.observe(stage);
