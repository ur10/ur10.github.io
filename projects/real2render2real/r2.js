// Scan -> Track -> Render scrubber and click-to-load 3D replay.
(function () {
  var vid = document.getElementById('r2-trip');
  var range = document.getElementById('r2-range');
  var btn = document.getElementById('r2-play');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.r2-chip'));
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

  // The 3D replay is ~10 MB and needs WebGL: load it only on request.
  var load = document.getElementById('r2-load3d');
  if (load) {
    load.addEventListener('click', function () {
      var box = document.getElementById('r2-3d');
      var f = document.createElement('iframe');
      f.src = box.dataset.src;
      f.title = 'Interactive 3D replay of the generated UR5e demonstration';
      f.setAttribute('loading', 'lazy');
      f.setAttribute('allow', 'fullscreen');
      box.innerHTML = '';
      box.appendChild(f);
      box.classList.add('live');
    });
  }
})();
