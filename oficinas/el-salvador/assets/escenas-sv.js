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
    v.preload = 'none';  // 6-nov: el archivo se baja completo con bajar() y recién ahí se le da al video
    film.appendChild(v); return v;
  }
  // Receta (regla 9): el carro va en 4K en la web, sin excepción.
  var grande = (window.innerWidth || 0) * (window.devicePixelRatio || 1) > 1920;
  // Celular: videos recortados al formato del teléfono (carro completo y el monumento).
  var movil = (window.innerWidth || 0) <= 1023;  // mismo corte que globaltni (car-hero.js: max-width 1023 = foto y video verticales)
  // El video vertical se lee de data-movil (gen.py lo pone solo cuando el archivo existe); sin él, en celular sigue la foto del carro con el mundo (escenas-foto.js).
  if (movil && !film.getAttribute('data-movil')) return;
  var inicio = document.getElementById('inicio');
  var CARRO_SRC = movil ? film.getAttribute('data-movil') : '/truly-nolen-el-salvador/oficinas/el-salvador/assets/el-salvador-desktop.mp4?v=gemini-6nov-liviano';
  var carro = video('', 1);
  var MUNDO_SRC = movil ? '/truly-nolen-el-salvador/oficinas/assets/mundo-movil.mp4?v=4k' : '/truly-nolen-el-salvador/oficinas/assets/mundo-desktop.mp4?v=4k';
  if (movil) { carro.style.objectPosition = '50% 50%'; }
  var mundo = video('', 2);
  if (movil) { mundo.style.objectPosition = '50% 50%'; }
  var enMundo = false, cambiando = false;
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  // 6-nov-2026 (Cesar: «se queda pegado el video»): con conexión lenta el video arrancaba y se trababa esperando datos.
  // Ahora cada video se reproduce SOLO cuando está descargado completo; mientras, queda la foto (o sigue el carro).
  // Chrome no baja el video entero mientras está en pausa: se baja con fetch completo y se le da como blob.
  function bajar(v, src, fn) {
    var dar = function (u) { v.src = u; v.load(); v.__listo = true; if (fn) v.addEventListener('canplay', fn, { once: true }); };
    if (!window.fetch || !window.URL || !URL.createObjectURL) return dar(src);
    fetch(src).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) { dar(URL.createObjectURL(b)); }).catch(function () { dar(src); });
  }
  function listo(v) { return !!v.__listo && v.readyState >= 3; }
  var pedidoMundo = false;
  function cargar() { if (!pedidoMundo) { pedidoMundo = true; bajar(mundo, MUNDO_SRC); } }
  function aMundo() {
    if (enMundo || cambiando) return; cargar();
    if (!listo(mundo)) { carro.currentTime = 0; play(carro); return; }  // el mundo aún no bajó completo: el carro vuelve a empezar, sin trabarse
    cambiando = true;
    mundo.currentTime = 0; play(mundo); mundo.style.opacity = '1'; if (inicio) { inicio.classList.add('en-mundo'); inicio.dataset.scene = 'world'; }
    setTimeout(function () { carro.pause(); enMundo = true; cambiando = false; }, FUNDIDO * 1000);
  }
  function aCarro() {
    if (!enMundo || cambiando) return; cambiando = true;
    carro.currentTime = 0; play(carro); mundo.style.opacity = '0'; if (inicio) { inicio.classList.remove('en-mundo'); inicio.dataset.scene = 'car'; }
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
  bajar(carro, CARRO_SRC, function () { play(carro); cargar(); });
})();
