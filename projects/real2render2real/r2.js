// Scan -> Track -> Render scrubber and click-to-load 3D replay.
(function () {
  var vid = document.getElementById('r2-trip');
  var range = document.getElementById('r2-range');
  var btn = document.getElementById('r2-play');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.r2-chip[data-t]'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Phones get the same timeline with the three panels stacked, so each stays legible.
  if (vid && vid.dataset.tall && window.matchMedia('(max-width: 720px)').matches) {
    var src = vid.querySelector('source');
    if (src) {
      src.src = vid.dataset.tall + '.mp4';
      vid.poster = vid.dataset.tall + '.jpg';
      vid.load();
    }
  }

  if (vid && range && btn) {
    var scrubbing = false;
    function setBtn() { btn.textContent = vid.paused ? 'Play' : 'Pause'; btn.setAttribute('aria-pressed', String(!vid.paused)); }
    function phaseAt(t) {
      var cur = chips[0];
      chips.forEach(function (c) { if (t >= parseFloat(c.dataset.t)) cur = c; });
      return cur;
    }
    function sync() {
      if (!vid.duration) return;
      if (!scrubbing) range.value = String(Math.round(1000 * vid.currentTime / vid.duration));
      var p = phaseAt(vid.currentTime);
      chips.forEach(function (c) { c.classList.toggle('on', c === p); });
    }
    btn.addEventListener('click', function () {
      if (vid.paused) { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); } else { vid.pause(); }
    });
    vid.addEventListener('play', setBtn);
    vid.addEventListener('pause', setBtn);
    vid.addEventListener('timeupdate', sync);
    vid.addEventListener('loadedmetadata', sync);
    range.addEventListener('input', function () {
      scrubbing = true;
      vid.pause();
      if (vid.duration) vid.currentTime = vid.duration * parseInt(range.value, 10) / 1000;
      sync();
    });
    range.addEventListener('change', function () { scrubbing = false; });
    chips.forEach(function (c) {
      c.addEventListener('click', function () { vid.pause(); vid.currentTime = parseFloat(c.dataset.t) + 0.05; sync(); });
    });
    // Autoplay only while visible, like the rest of the site; never with reduced motion.
    if ('IntersectionObserver' in window && !reduced.matches) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && vid.dataset.user !== '1') { var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else if (!e.isIntersecting) vid.pause();
        });
      }, { threshold: 0.3 }).observe(vid);
    }
    [btn, range].concat(chips).forEach(function (el) { el.addEventListener('pointerdown', function () { vid.dataset.user = '1'; }); });
    setBtn();
  }

  // 3D replays are several MB and need WebGL: load each one only on request.
  Array.prototype.slice.call(document.querySelectorAll('.r2-3d .r2-load3d')).forEach(function (load) {
    load.addEventListener('click', function () {
      var box = load.closest('.r2-3d');
      var f = document.createElement('iframe');
      f.src = box.dataset.src;
      f.title = box.dataset.title || 'Interactive 3D replay of the generated UR5e demonstration';
      f.setAttribute('allow', 'fullscreen');
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('live');
    });
  });

  // Embodiment chips: pick which arm the 3D view shows (swaps the poster, or the live replay).
  var emb = document.getElementById('r2-emb3d');
  Array.prototype.slice.call(document.querySelectorAll('.r2-emb')).forEach(function (chip, _, all) {
    chip.addEventListener('click', function () {
      all.forEach(function (c) { c.classList.toggle('on', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
      emb.dataset.src = chip.dataset.src;
      emb.dataset.title = chip.dataset.title;
      var f = emb.querySelector('iframe'), img = emb.querySelector('img');
      if (f) { f.src = chip.dataset.src; f.title = chip.dataset.title; }
      else if (img) { img.src = chip.dataset.poster; }
    });
  });
})();

// Task chips (Three Tasks, and the per-task panels of the later sections): in each section the
// chips pick which task's panel is shown; only visible clips play, and only while on screen.
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.slice.call(document.querySelectorAll('section')).forEach(function (sec) {
    var chips = Array.prototype.slice.call(sec.querySelectorAll('.r2-task'));
    var panels = Array.prototype.slice.call(sec.querySelectorAll('.r2-task-panel'));
    if (!chips.length || !panels.length) return;
    var inView = false;
    function vids(p) { return Array.prototype.slice.call(p.querySelectorAll('video')); }
    function sync() {
      panels.forEach(function (p) {
        vids(p).forEach(function (v) {
          if (!p.hidden && inView && !reduced) {
            if (v.preload === 'none') { v.preload = 'metadata'; v.load(); }
            var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
          } else { v.pause(); }
        });
      });
    }
    if (reduced) panels.forEach(function (p) { vids(p).forEach(function (v) { v.controls = true; }); });
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { var on = c === chip; c.classList.toggle('on', on); c.setAttribute('aria-selected', String(on)); });
        panels.forEach(function (p) {
          p.hidden = p.dataset.task !== chip.dataset.task;
          if (!p.hidden && reduced) vids(p).forEach(function (v) { if (v.preload === 'none') { v.preload = 'metadata'; v.load(); } });
        });
        sync();
      });
    });
    var box = panels[0].parentNode;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; }); sync(); }, { threshold: 0.15 }).observe(box);
    }
  });
})();

// Reveal technical appendices when following a link to a section inside one.
(function () {
  function reveal() {
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    var target = document.getElementById(id);
    if (!target) return;
    var parent = target.parentElement, opened = false;
    while (parent) {
      if (parent.tagName === 'DETAILS' && !parent.open) { parent.open = true; opened = true; }
      parent = parent.parentElement;
    }
    if (opened) requestAnimationFrame(function () { target.scrollIntoView(); });
  }
  window.addEventListener('hashchange', reveal);
  reveal();
})();
