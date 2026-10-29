// Play looping clips only while on screen; honour reduced-motion.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- generic autoplay-on-screen (carousel clips are driven separately) ----
  var vids = Array.prototype.slice.call(document.querySelectorAll('video'))
    .filter(function (v) { return !v.closest('.slide'); });

  function apply() {
    vids.forEach(function (v) {
      if (reduced.matches) { v.pause(); v.setAttribute('controls', ''); }
      else { v.removeAttribute('controls'); }
    });
  }

  if ('IntersectionObserver' in window) {
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
  }
  apply();
  if (reduced.addEventListener) reduced.addEventListener('change', apply);

  // <details> media starts paused; play it when opened.
  document.querySelectorAll('details.more').forEach(function (d) {
    d.addEventListener('toggle', function () {
      d.querySelectorAll('video').forEach(function (v) {
        if (d.open && !reduced.matches) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    });
  });

  // ---- rotating highlight ----
  var sc = document.getElementById('showcase');
  if (!sc) return;
  var slides = Array.prototype.slice.call(sc.querySelectorAll('.slide'));
  if (slides.length < 2) return;

  var DUR = 9000;
  var dots = sc.querySelector('.dots');
  var bar = sc.querySelector('.sc-bar');
  var nav = sc.querySelector('.sc-nav');
  var i = 0, timer = null, onScreen = true, held = false;

  sc.classList.add('js-on');
  if (nav) nav.hidden = false;
  if (bar) { bar.hidden = false; bar.style.setProperty('--sc-dur', DUR + 'ms'); }

  slides.forEach(function (s, n) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'slide-' + n);
    b.setAttribute('aria-label', (s.querySelector('h3') || {}).textContent || 'Highlight ' + (n + 1));
    b.addEventListener('click', function () { go(n); restart(); });
    dots.appendChild(b);
  });
  var dotEls = Array.prototype.slice.call(dots.children);

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) {
      var on = k === i;
      s.classList.toggle('is-active', on);
      var v = s.querySelector('video');
      if (v) {
        if (on && !reduced.matches) { v.currentTime = 0; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      }
    });
    dotEls.forEach(function (d, k) { d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
  }

  function paint() {
    if (!bar) return;
    bar.classList.remove('run');
    void bar.offsetWidth;                       // restart the fill animation
    if (!held && onScreen && !reduced.matches) bar.classList.add('run');
  }

  function restart() {
    clearTimeout(timer);
    paint();
    if (held || !onScreen || reduced.matches) return;
    timer = setTimeout(function () { go(i + 1); restart(); }, DUR);
  }

  sc.querySelectorAll('.sc-btn').forEach(function (b) {
    b.addEventListener('click', function () { go(i + Number(b.dataset.dir)); restart(); });
  });

  sc.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { go(i + 1); restart(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { go(i - 1); restart(); e.preventDefault(); }
  });

  function hold(on) { held = on; restart(); }
  sc.addEventListener('mouseenter', function () { hold(true); });
  sc.addEventListener('mouseleave', function () { hold(false); });
  sc.addEventListener('focusin', function () { hold(true); });
  sc.addEventListener('focusout', function () {
    if (!sc.contains(document.activeElement)) hold(false);
  });
  document.addEventListener('visibilitychange', function () { hold(document.hidden); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      onScreen = es[0].isIntersecting;
      restart();
    }, { threshold: 0.25 }).observe(sc);
  }

  if (reduced.addEventListener) reduced.addEventListener('change', restart);

  go(0);
  restart();
})();
