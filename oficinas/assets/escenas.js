// Película de la portada en dos escenas, como globaltni.com/es: el carro se ve completo una vez, el mundo entra encima
// con un fundido de 0,8 s, corre 10 s y se desvanece dejando el carro desde el inicio. Nunca se ve el salto del bucle.
// El video del mundo se crea aquí (después de preview.js) para que preview.js no lo arranque ni lo ponga en bucle.
(function () {
  var film = document.querySelector('#inicio .film');
  var carro = film && film.querySelector('video');
  if (!carro || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var FUNDIDO = 0.8, MUNDO = 10;
  var mundo = document.createElement('video');
  mundo.muted = true; mundo.playsInline = true; mundo.preload = 'none';
  mundo.setAttribute('aria-hidden', 'true'); mundo.dataset.escena = 'mundo';
  mundo.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity ' + FUNDIDO + 's linear;z-index:1';
  film.appendChild(mundo);
  var enMundo = false, cambiando = false;
  function cargar() { if (!mundo.getAttribute('src')) { mundo.src = '/truly-nolen-el-salvador/oficinas/assets/mundo-desktop.mp4'; mundo.load(); } }
  function aMundo() {
    if (enMundo || cambiando) return; cambiando = true; cargar();
    mundo.currentTime = 0; var p = mundo.play(); if (p && p.catch) p.catch(function () {});
    mundo.style.opacity = '1';
    setTimeout(function () { carro.pause(); enMundo = true; cambiando = false; }, FUNDIDO * 1000);
  }
  function aCarro() {
    if (!enMundo || cambiando) return; cambiando = true;
    carro.currentTime = 0; var p = carro.play(); if (p && p.catch) p.catch(function () {});
    mundo.style.opacity = '0';
    setTimeout(function () { mundo.pause(); enMundo = false; cambiando = false; }, FUNDIDO * 1000);
  }
  carro.addEventListener('playing', function () { carro.loop = false; });
  carro.addEventListener('timeupdate', function () {
    if (!enMundo && carro.duration && carro.currentTime >= carro.duration - FUNDIDO) aMundo();
  });
  carro.addEventListener('ended', aMundo);
  mundo.addEventListener('timeupdate', function () {
    var fin = Math.min(MUNDO, mundo.duration || MUNDO);
    if (enMundo && mundo.currentTime >= fin - FUNDIDO) aCarro();
  });
  setTimeout(cargar, 4000);
})();
