// Portada de El Salvador en dos escenas, como globaltni.com/es, mientras el video del carro no existe: la foto del carro
// frente al Salvador del Mundo se ve 10 s, el mundo de Truly entra encima con un fundido de 0,8 s, gira 10 s y se
// desvanece dejando otra vez el carro. En celular (≤760 px) el mundo es el vertical. Con «reducir movimiento» no se anima.
(function () {
  var film = document.querySelector('#inicio .film');
  if (!film || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var FUNDIDO = 0.8, CARRO = 10, MUNDO = 10;
  var movil = matchMedia('(max-width:760px)').matches;
  var inicio = document.getElementById('inicio');
  var mundo = document.createElement('video');
  mundo.muted = true; mundo.playsInline = true; mundo.preload = 'none'; mundo.loop = false;
  mundo.setAttribute('aria-hidden', 'true'); mundo.setAttribute('tabindex', '-1');
  mundo.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity ' + FUNDIDO + 's linear;z-index:1;pointer-events:none';
  film.appendChild(mundo);
  var listo = false;
  function cargar() {
    if (mundo.getAttribute('src')) return;
    mundo.src = movil ? '/truly-nolen-el-salvador/oficinas/assets/mundo-movil.mp4' : '/truly-nolen-el-salvador/oficinas/assets/mundo-desktop.mp4';
    mundo.load();
  }
  mundo.addEventListener('canplay', function () { listo = true; }, { once: true });
  function aMundo() {
    if (!listo) { setTimeout(aMundo, 1000); return; }   // si el mundo aún no bajó, la foto sigue un poco más
    mundo.currentTime = 0;
    var p = mundo.play(); if (p && p.catch) p.catch(function () {});
    mundo.style.opacity = '1';
    if (inicio) inicio.classList.add('en-mundo');
    setTimeout(aCarro, MUNDO * 1000);
  }
  function aCarro() {
    mundo.style.opacity = '0';
    if (inicio) inicio.classList.remove('en-mundo');
    setTimeout(function () { mundo.pause(); }, FUNDIDO * 1000);
    setTimeout(aMundo, CARRO * 1000);
  }
  // el mundo baja después de que la página ya cargó (no compite con la foto del carro)
  setTimeout(cargar, 1000);
  setTimeout(aMundo, CARRO * 1000);
})();
