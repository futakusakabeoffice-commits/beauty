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
