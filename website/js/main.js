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

// Logo click on the start page: always scroll to the very top (no reload, no #-URL)
const navLogo = document.querySelector('.nav-logo[href="#"]');
if (navLogo) {
  navLogo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

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
