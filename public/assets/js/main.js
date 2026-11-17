/* Lindley Hotel – small progressive enhancements. The site works without JavaScript. */
(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

/* Photo lightbox: links with data-gallery="name" open full-size in a dialog.
   Without JavaScript the links simply open the image. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-gallery]'));
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Photo viewer');
  dlg.innerHTML = '<div class="lightbox-inner"><img alt=""></div>' +
    '<p class="lightbox-caption"></p>' +
    '<button type="button" class="lightbox-close" aria-label="Close">×</button>' +
    '<button type="button" class="lightbox-prev" aria-label="Previous photo">‹</button>' +
    '<button type="button" class="lightbox-next" aria-label="Next photo">›</button>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector('img');
  var cap = dlg.querySelector('.lightbox-caption');
  var set = [], idx = 0;

  function altOf(a) { var i = a.querySelector('img'); return (i && i.alt) || a.getAttribute('aria-label') || ''; }
  function show(i) {
    idx = (i + set.length) % set.length;
    img.src = set[idx].href;
    img.alt = altOf(set[idx]);
    cap.textContent = img.alt + (set.length > 1 ? '  ·  ' + (idx + 1) + ' / ' + set.length : '');
    dlg.querySelector('.lightbox-prev').hidden = dlg.querySelector('.lightbox-next').hidden = set.length < 2;
  }

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var name = a.getAttribute('data-gallery');
      set = links.filter(function (l) { return l.getAttribute('data-gallery') === name; });
      show(set.indexOf(a));
      dlg.showModal();
    });
  });

  dlg.querySelector('.lightbox-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lightbox-prev').addEventListener('click', function () { show(idx - 1); });
  dlg.querySelector('.lightbox-next').addEventListener('click', function () { show(idx + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lightbox-inner')) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  var startX = null;
  dlg.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

/* Room photo sliders: arrows + swipe (native scroll-snap), with a "1 / 3" counter. */
(function () {
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-slides]');
    var prev = slider.querySelector('[data-prev]');
    var next = slider.querySelector('[data-next]');
    var count = slider.querySelector('[data-count]');
    var total = track.children.length;
    if (total < 2) return;
    function index() { return Math.round(track.scrollLeft / track.clientWidth); }
    function update() {
      var i = index();
      if (count) count.textContent = (i + 1) + ' / ' + total;
      prev.disabled = i === 0;
      next.disabled = i === total - 1;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -track.clientWidth }); });
    next.addEventListener('click', function () { track.scrollBy({ left: track.clientWidth }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    update();
  });
})();
