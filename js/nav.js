// Start a newly opened page at the top (or at its #anchor). When the site is shown inside a
// frame whose outer page scrolls (e.g. an embedded preview), the outer scroll position would
// otherwise carry over and the next page would open part-way down. scrollIntoView also
// scrolls those outer frames. Back/forward keeps the browser's own scroll restoration.
(function () {
  var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (!nav || nav.type !== 'navigate' || window.self === window.top) return;
  function toStart() {
    var target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    (target || document.documentElement).scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  toStart();
  window.addEventListener('load', toStart);
})();

// Mobile / tablet menu: the MENU button opens the header nav as a full-screen overlay (≤1023px).
(function () {
  var header = document.querySelector('.site-header');
  var button = header && header.querySelector('.site-header__menu');
  if (!button) return;
  var nav = document.getElementById(button.getAttribute('aria-controls'));

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'CLOSE' : 'MENU';
  }

  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  // Close after choosing a link (needed for same-page anchors such as menu.html#coupon).
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
  // Reset when the viewport grows back to the desktop layout.
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();
