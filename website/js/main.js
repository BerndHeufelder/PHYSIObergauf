// Nav shadow via IntersectionObserver (no per-frame scroll handler)
const navbar = document.getElementById('navbar');
const sentinel = document.getElementById('nav-sentinel');
if (navbar && sentinel) {
  // sentinel sits at the very top; once it scrolls out of view, add the shadow
  const io = new IntersectionObserver(
    ([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting)
  );
  io.observe(sentinel);
}

// Mobile burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// Expandable Werdegang timeline(s) — supports multiple instances (A/B variants)
document.querySelectorAll('.tl-toggle').forEach((toggle) => {
  const collapse = toggle.previousElementSibling; // the .vtl2-collapse right before the button
  const label = toggle.querySelector('.tl-toggle-label');
  if (!collapse) return;
  toggle.addEventListener('click', () => {
    const expanded = collapse.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    if (label) label.textContent = expanded ? 'Weniger anzeigen' : 'Mehr anzeigen';
  });
});
