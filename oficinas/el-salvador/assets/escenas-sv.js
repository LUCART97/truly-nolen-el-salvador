// Portada de El Salvador en dos escenas, como globaltni.com/es: el carro frente al
// Salvador del Mundo corre una vez completo, el mundo de Truly girando entra encima con un fundido de 0,8 s, corre 10 s y se
// desvanece dejando el carro desde el inicio. No se detiene con «reducir movimiento» (decisión del dueño). Los dos videos se crean acá, después de preview.js, para que preview.js no los pause ni los ponga en bucle.
(function () {
  var film = document.querySelector('#inicio .film');
  if (!film) return;
  var FUNDIDO = 0.8, MUNDO = 10, CARRO_FIN = 10;

  function video(src, z) {
    var v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.setAttribute('aria-hidden', 'true');
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity ' + FUNDIDO + 's linear;z-index:' + z;
    if (src) { v.preload = 'auto'; v.src = src; } else { v.preload = 'none'; }
    film.appendChild(v); return v;
  }
  // Receta (regla 9): el carro va en 4K en la web, sin excepción.
  var grande = (window.innerWidth || 0) * (window.devicePixelRatio || 1) > 1920;
  // Celular: videos recortados al formato del teléfono (carro completo y el monumento).
  var movil = (window.innerWidth || 0) <= 760;
  // El video vertical se lee de data-movil (gen.py lo pone solo cuando el archivo existe); sin él, en celular sigue la foto del carro con el mundo (escenas-foto.js).
  if (movil && !film.getAttribute('data-movil')) return;
  var inicio = document.getElementById('inicio');
  var carro = video(movil ? film.getAttribute('data-movil') : '/truly-nolen-el-salvador/oficinas/el-salvador/assets/el-salvador-desktop.mp4', 1);
  var MUNDO_SRC = movil ? '/truly-nolen-el-salvador/oficinas/assets/mundo-movil.mp4?v=4k' : '/truly-nolen-el-salvador/oficinas/assets/mundo-desktop.mp4?v=4k';
  if (movil) { carro.style.objectPosition = '50% 50%'; }
  var mundo = video('', 2);
  if (movil) { mundo.style.objectPosition = '50% 50%'; }
  var enMundo = false, cambiando = false;
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function cargar() { if (!mundo.getAttribute('src')) { mundo.src = MUNDO_SRC; mundo.load(); } }
  function aMundo() {
    if (enMundo || cambiando) return; cambiando = true; cargar();
    mundo.currentTime = 0; play(mundo); mundo.style.opacity = '1'; if (inicio) inicio.classList.add('en-mundo');
    setTimeout(function () { carro.pause(); enMundo = true; cambiando = false; }, FUNDIDO * 1000);
  }
  function aCarro() {
    if (!enMundo || cambiando) return; cambiando = true;
    carro.currentTime = 0; play(carro); mundo.style.opacity = '0'; if (inicio) inicio.classList.remove('en-mundo');
    setTimeout(function () { mundo.pause(); enMundo = false; cambiando = false; }, FUNDIDO * 1000);
  }
  carro.addEventListener('playing', function () { carro.style.opacity = '1'; }, { once: true });
  carro.addEventListener('timeupdate', function () {
    var fin = Math.min(CARRO_FIN, carro.duration || CARRO_FIN);
    if (!enMundo && carro.currentTime >= fin - FUNDIDO) aMundo();
  });
  carro.addEventListener('ended', aMundo);
  mundo.addEventListener('timeupdate', function () {
    var fin = Math.min(MUNDO, mundo.duration || MUNDO);
    if (enMundo && mundo.currentTime >= fin - FUNDIDO) aCarro();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { carro.pause(); mundo.pause(); } else { play(enMundo ? mundo : carro); }
  });
  play(carro);
  setTimeout(cargar, 4000);
})();
