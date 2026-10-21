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
