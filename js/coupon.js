// Coupon selection for the booking forms (index.html / reserve.html).
// "このクーポンを使う" links pass ?coupon=<value>; the matching option in the form's
// coupon select is chosen and an "適用中" banner shows which coupon is applied.
(function () {
  var forms = document.querySelectorAll('form[data-coupon-form]');
  if (!forms.length) return;

  function selectedName(select) {
    return select.value ? select.options[select.selectedIndex].text : '';
  }

  function showCoupon(el, name) {
    el.querySelector('.coupon-applied__name').textContent = name;
    el.hidden = !name;
  }

  function sync(form) {
    showCoupon(form.querySelector('.coupon-applied'), selectedName(form.elements.coupon));
  }

  function apply(value) {
    Array.prototype.forEach.call(forms, function (form) {
      var select = form.elements.coupon;
      var known = Array.prototype.some.call(select.options, function (o) { return o.value === value; });
      if (value && known) {
        select.value = value;
        sync(form);
      }
    });
  }

  Array.prototype.forEach.call(forms, function (form) {
    form.elements.coupon.addEventListener('change', function () {
      sync(form);
      // A manual choice wins over the link, so a reload doesn't re-apply the old coupon.
      if (location.search) history.replaceState(null, '', location.pathname + location.hash);
    });
    // Keep the coupon visible on the completion screen (reserve.html).
    form.addEventListener('submit', function () {
      var summary = document.querySelector('[data-coupon-summary]');
      if (summary) showCoupon(summary, selectedName(form.elements.coupon));
    });
    sync(form);
  });

  apply(new URLSearchParams(location.search).get('coupon'));

  // Coupon links on the same page (index.html) apply without reloading.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="coupon="]');
    if (!link) return;
    var url = new URL(link.href);
    if (url.pathname !== location.pathname) return;
    var target = url.hash && document.getElementById(url.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    apply(url.searchParams.get('coupon'));
    history.replaceState(null, '', url.search + url.hash);
    target.scrollIntoView();
  });
})();
