// Carro vertical en celular: va sin defer, justo después de la portada, para cambiar el video antes de que
// preview.js lo cargue. En computadora no hace nada.
(function () {
  var v = document.querySelector('#inicio .film video[data-src-movil]');
  if (v && matchMedia('(max-width:760px)').matches) { v.dataset.src = v.dataset.srcMovil; v.style.objectPosition = 'center'; }
})();
