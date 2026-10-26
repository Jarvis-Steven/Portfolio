'use strict';
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preferredTheme = null;
try { preferredTheme = localStorage.getItem('portfolio-theme'); } catch {}
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}
setTheme(preferredTheme === 'dark' || preferredTheme === 'light' ? preferredTheme : systemTheme.matches ? 'dark' : 'light');
themeButton.hidden = false;
themeButton.addEventListener('click', () => {
  preferredTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(preferredTheme);
  try { localStorage.setItem('portfolio-theme', preferredTheme); } catch {}
});
systemTheme.addEventListener('change', event => { if (!preferredTheme) setTheme(event.matches ? 'dark' : 'light'); });

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 800px)');
function closeMenu() {
  navigation.hidden = mobile.matches;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}
function syncMenu() { menuButton.hidden = !mobile.matches; closeMenu(); }
syncMenu();
mobile.addEventListener('change', syncMenu);
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
});
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || !mobile.matches) return;
  closeMenu();
  const target = document.querySelector(link.hash);
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobile.matches && !navigation.hidden) { closeMenu(); menuButton.focus(); }
});

const sections = [...document.querySelectorAll('main > section[id]')];
const links = [...navigation.querySelectorAll('a')];
const backTop = document.querySelector('.back-top');
let scheduled = false;
function updateScroll() {
  let current = sections[0].id;
  for (const section of sections) { if (section.getBoundingClientRect().top <= 190) current = section.id; }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) current = sections.at(-1).id;
  links.forEach(link => { if (link.hash === '#' + current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  backTop.hidden = window.scrollY < 550;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
  document.querySelector('.reading-progress span').style.transform = `scaleX(${progress})`;
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
}
document.querySelector('#year').textContent = new Date().getFullYear();

// Project browsing: controls appear only when JavaScript is available.
const projectCards = [...document.querySelectorAll('.project[data-stage]')];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCount = document.querySelector('.project-count');
const expandProjects = document.querySelector('.expand-projects');
const visibleProjects = () => projectCards.filter(card => !card.hidden);
function syncExpansionLabel() {
  const allOpen = visibleProjects().every(card => card.querySelector('details').open);
  expandProjects.textContent = allOpen ? 'Collapse visible details' : 'Expand visible details';
}
function filterProjects(filter) {
  projectCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.stage !== filter; });
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  const count = visibleProjects().length;
  projectCount.textContent = `${count} of ${projectCards.length} projects shown`;
  syncExpansionLabel();
  requestAnimationFrame(updateScroll);
}
filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
expandProjects.addEventListener('click', () => {
  const cards = visibleProjects();
  const shouldOpen = !cards.every(card => card.querySelector('details').open);
  cards.forEach(card => { card.querySelector('details').open = shouldOpen; });
  syncExpansionLabel();
});
projectCards.forEach(card => card.querySelector('details').addEventListener('toggle', () => {
  syncExpansionLabel();
  requestAnimationFrame(updateScroll);
}));
document.querySelector('.project-toolbar').hidden = false;
projectCount.hidden = false;
filterProjects('all');

// Recalculate after expanding content, filtering, image load, or window resize.
if ('ResizeObserver' in window) {
  new ResizeObserver(() => requestAnimationFrame(updateScroll)).observe(document.body);
}

// One-time typewriter reveal. Full text remains available to screen readers.
const typingMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-typewriter]').forEach(block => {
  if (typingMotion.matches) return;
  const visual = block.querySelector('.typing-visual');
  const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const characters = [];
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    for (const character of node.textContent) {
      const span = document.createElement('span');
      span.className = 'typing-char is-pending';
      span.textContent = character;
      characters.push(span);
      fragment.append(span);
    }
    node.replaceWith(fragment);
  });
  let position = 0;
  let timer;
  let observer;
  let started = false;
  function finish() {
    clearTimeout(timer);
    characters.forEach(span => span.classList.remove('is-pending', 'is-cursor'));
    observer?.disconnect();
    typingMotion.removeEventListener('change', onMotionChange);
  }
  function onMotionChange(event) { if (event.matches) finish(); }
  function tick() {
    if (typingMotion.matches || position >= characters.length) { finish(); return; }
    characters[position - 1]?.classList.remove('is-cursor');
    characters[position].classList.remove('is-pending');
    characters[position].classList.add('is-cursor');
    position++;
    timer = setTimeout(tick, block.tagName === 'H1' ? 75 : 45);
  }
  function start() { if (!started) { started = true; tick(); } }
  typingMotion.addEventListener('change', onMotionChange);
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { start(); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(block);
  } else { start(); }
});