// Conversion events for GA4: booking form submits and phone-number taps.
// Sends only when gtag (GA4) is installed on the page; otherwise does nothing.
(function () {
  function send(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches('#home-reserve-form, #reserve-form')) return;
    send('generate_lead', {
      form_id: form.id,
      coupon: form.elements.coupon ? form.elements.coupon.value || 'none' : 'none'
    });
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"]');
    if (link) send('tel_tap', { link_url: link.getAttribute('href'), page_path: location.pathname });
  });
})();
