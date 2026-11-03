// Pie en acordeón (como globaltni.com/es): en celular las columnas de enlaces empiezan cerradas y se abren al tocar
// el título; en computadora quedan siempre abiertas.
(function () {
  var movil = matchMedia('(max-width:760px)');
  var cols = document.querySelectorAll('.pie-col');
  function ajustar() { cols.forEach(function (d) { d.open = !movil.matches; }); }
  ajustar();
  if (movil.addEventListener) movil.addEventListener('change', ajustar);
  cols.forEach(function (d) {
    d.querySelector('summary').addEventListener('click', function (ev) { if (!movil.matches) ev.preventDefault(); });
  });
})();
