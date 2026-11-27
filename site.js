// Site behaviour: nav border on scroll, current-section highlight, offscreen video
// pausing, reduced motion, and chart tooltips. No dependencies.
(function () {
  var nav = document.querySelector('.topnav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Looping clips (data-loop) play only while visible; reduced motion shows controls instead.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var loops = Array.prototype.slice.call(document.querySelectorAll('video[data-loop]'));
  loops.forEach(function (v) { v.muted = true; v.setAttribute('playsinline', ''); });
  function applyMotion() {
    loops.forEach(function (v) { if (reduced.matches) { v.pause(); v.setAttribute('controls', ''); } });
  }
  if ('IntersectionObserver' in window && loops.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduced.matches) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { v.setAttribute('controls', ''); });
        } else if (!e.isIntersecting) { v.pause(); }
      });
    }, { rootMargin: '200px 0px', threshold: 0.2 });
    loops.forEach(function (v) { io.observe(v); });
  }
  applyMotion();
  if (reduced.addEventListener) reduced.addEventListener('change', applyMotion);

  // Highlight the nav link of the section in view (in-page links only).
  var links = Array.prototype.slice.call(document.querySelectorAll('.topnav nav a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) map[s.id] = a; });
    var current = null;
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (current) current.classList.remove('on');
        current = map[e.target.id];
        if (current) current.classList.add('on');
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    Object.keys(map).forEach(function (id) { so.observe(document.getElementById(id)); });
  }

  // Chart tooltips: any element with data-tip inside .chart.
  document.querySelectorAll('.chart').forEach(function (chart) {
    var tip = document.createElement('div');
    tip.className = 'tip';
    tip.setAttribute('role', 'status');
    chart.appendChild(tip);
    function show(el, x, y) {
      tip.textContent = el.getAttribute('data-tip');
      var r = chart.getBoundingClientRect();
      tip.style.left = (x - r.left) + 'px';
      tip.style.top = (y - r.top) + 'px';
      tip.classList.add('on');
    }
    chart.querySelectorAll('[data-tip]').forEach(function (el) {
      el.addEventListener('mouseenter', function (ev) { show(el, ev.clientX, ev.clientY); });
      el.addEventListener('mousemove', function (ev) { show(el, ev.clientX, ev.clientY); });
      el.addEventListener('mouseleave', function () { tip.classList.remove('on'); });
      el.addEventListener('focus', function () { var b = el.getBoundingClientRect(); show(el, b.left + b.width / 2, b.top); });
      el.addEventListener('blur', function () { tip.classList.remove('on'); });
    });
  });
})();
