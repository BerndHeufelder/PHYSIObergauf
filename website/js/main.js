// Terminanfrage form — sends via FormSubmit AJAX, stays on the page (no mail client)
const anfrageForm = document.getElementById('anfrageForm');
if (anfrageForm) {
  anfrageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = anfrageForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';
    status.className = 'form-status';
    try {
      const res = await fetch('https://formsubmit.co/ajax/therapie@physiobergauf.at', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(anfrageForm),
      });
      const data = await res.json();
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'send failed');
      anfrageForm.reset();
      status.textContent = 'Vielen Dank! Deine Anfrage wurde gesendet — ich melde mich so rasch wie möglich bei dir.';
      status.classList.add('ok');
    } catch (err) {
      // FormSubmit returns "This form needs Activation" until the one-time
      // activation link (emailed to the practice) has been clicked
      status.textContent = /activat/i.test(err && err.message ? err.message : '')
        ? 'Das Formular ist gerade nicht verfügbar. Bitte kontaktiere mich direkt: +43 664 9624672 · therapie@physiobergauf.at'
        : 'Senden fehlgeschlagen. Bitte versuch es später erneut oder kontaktiere mich direkt: +43 664 9624672 · therapie@physiobergauf.at';
      status.classList.add('err');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Anfrage senden';
    }
  });
}

// Nav-Logo + Wortmarke im Hero ausblenden — sie erscheinen zusammen mit der
// Leiste, sobald gescrollt wird (Sichtbarkeit steuert nav.scrolled im CSS)
if (document.getElementById('hero')) {
  const navLogoEl = document.querySelector('.nav-logo');
  if (navLogoEl) navLogoEl.classList.add('logo-waiting');
}

// Sanfte Scroll-Einblendungen (einmalig, dezent; respektiert reduced motion)
const revealTargets = document.querySelectorAll(
  '.willkommen-head, .willkommen-img, .willkommen-text, .fakten-item, ' +
  '.ueber-grid > *, .leistungen-intro, .cat-card, .zusatz, .step, .ablauf-card, ' +
  '.kontakt-grid > *, .anfrage, .link-card'
);
if ('IntersectionObserver' in window && revealTargets.length) {
  const revealIo = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIo.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  revealTargets.forEach((el) => { el.classList.add('reveal'); revealIo.observe(el); });
}

// Galerie-Lightbox (Praxisfotos groß ansehen)
const lbSources = [...document.querySelectorAll('.willkommen-gallery img, .willkommen-img img')];
if (lbSources.length) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.hidden = true;
  lb.innerHTML =
    '<button class="lb-close" aria-label="Schließen">✕</button>' +
    '<button class="lb-prev" aria-label="Vorheriges Bild">‹</button>' +
    '<img alt="" />' +
    '<button class="lb-next" aria-label="Nächstes Bild">›</button>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  let lbIdx = 0;
  const lbShow = (i) => {
    lbIdx = (i + lbSources.length) % lbSources.length;
    lbImg.src = lbSources[lbIdx].src;
    lbImg.alt = lbSources[lbIdx].alt;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const lbHide = () => { lb.hidden = true; document.body.style.overflow = ''; };
  lbSources.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => lbShow(i));
  });
  lb.querySelector('.lb-close').addEventListener('click', lbHide);
  lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); lbShow(lbIdx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); lbShow(lbIdx + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) lbHide(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbHide();
    if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });
}

// Logo click on the start page: always scroll to the very top (no reload, no #-URL)
const navLogo = document.querySelector('.nav-logo[href="#"]');
if (navLogo) {
  navLogo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Praxis-Galerie: mobil eingeklappt, „Mehr zeigen" blendet die restlichen Bilder ein
const galleryToggle = document.getElementById('galleryToggle');
if (galleryToggle) {
  const gallery = document.getElementById('praxisGalerie');
  galleryToggle.addEventListener('click', () => {
    const expanded = gallery.classList.toggle('expanded');
    galleryToggle.textContent = expanded ? 'Weniger zeigen' : 'Mehr zeigen';
    galleryToggle.setAttribute('aria-expanded', String(expanded));
    if (!expanded) gallery.scrollIntoView(); // Zuklappen: zurück zum Anfang statt Scroll-Sprung
  });
}

// Leistungs-Karten: einzeln aufklappbar (Titelzeile anklicken/antippen)
document.querySelectorAll('.cat-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const open = btn.closest('.cat-card').classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

// „Mehr anzeigen"-Toggles (mobil): Kurztexte (Willkommen, Über mich) und Leistungs-Details
document.querySelectorAll('.text-toggle').forEach((btn) => {
  const target = btn.dataset.target ? document.getElementById(btn.dataset.target) : btn.parentElement;
  const more = btn.dataset.more || 'Mehr anzeigen';
  const less = btn.dataset.less || 'Weniger anzeigen';
  btn.addEventListener('click', () => {
    const expanded = target.classList.toggle('expanded');
    btn.textContent = expanded ? less : more;
    btn.setAttribute('aria-expanded', String(expanded));
    if (!expanded) target.scrollIntoView(); // Zuklappen: zurück zum Anfang statt Scroll-Sprung
  });
});

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
