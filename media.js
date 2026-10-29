// Play looping clips only while on screen; honour reduced-motion.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video'));
  if (!vids.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function apply() {
    vids.forEach(function (v) {
      if (reduced.matches) { v.pause(); v.setAttribute('controls', ''); }
      else { v.removeAttribute('controls'); }
    });
  }
  if (!('IntersectionObserver' in window)) { apply(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting && !reduced.matches) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.setAttribute('controls', ''); });
      } else { v.pause(); }
    });
  }, { rootMargin: '250px 0px', threshold: 0.15 });

  vids.forEach(function (v) { io.observe(v); });
  apply();
  if (reduced.addEventListener) reduced.addEventListener('change', apply);

  // <details> media starts paused; play it when opened.
  document.querySelectorAll('details.more').forEach(function (d) {
    d.addEventListener('toggle', function () {
      d.querySelectorAll('video').forEach(function (v) {
        if (d.open && !reduced.matches) { var p = v.play(); if (p && p.catch) p.catch(function(){}); }
        else v.pause();
      });
    });
  });
})();
