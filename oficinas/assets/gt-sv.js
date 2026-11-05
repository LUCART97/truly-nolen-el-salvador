// Conducta del encabezado y del pie de globaltni.com/es (main.js de globaltni) en las oficinas: menú de celular,
// desplegables (R18), búsqueda con lupa (R4, clase .gt-buscar), pie en acordeón y pasos de TEPS en celular.
// Sin selector de idioma ni franquicias. El índice de búsqueda sale de la página (#gt-indice), con rutas relativas a la oficina.
(() => {
  const menuButton = document.querySelector('.site-header .menu-toggle');
  const navigation = document.querySelector('#navigation');
  if (!menuButton || !navigation) return;
  const menuIconPath = menuButton.querySelector('svg path');
  const closedIconD = 'M 3 7h 18M 3 17h 18';
  const openIconD = 'M 6 6L 18 18M 18 6L 6 18';
  const triggers = [...document.querySelectorAll('.nav-trigger')];
  const closePanels = (except = null) => triggers.forEach(trigger => {
    if (trigger === except) return;
    trigger.setAttribute('aria-expanded', 'false');
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = true;
  });
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    document.documentElement.classList.remove('a-menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = 'Menú';
    if (menuIconPath) menuIconPath.setAttribute('d', closedIconD);
    closePanels();
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('a-menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? 'Cerrar' : 'Menú';
    if (menuIconPath) menuIconPath.setAttribute('d', open ? openIconD : closedIconD);
    if (!open) closePanels();
  });
  triggers.forEach(trigger => trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    closePanels(trigger);
    trigger.setAttribute('aria-expanded', String(open));
    document.getElementById(trigger.getAttribute('aria-controls')).hidden = !open;
  }));
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  const dialog = document.querySelector('.search-dialog');
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) {
      if (navigation.classList.contains('is-open') && !event.target.closest('.search-dialog')) closeMenu();
      else closePanels();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (dialog && dialog.open) { event.preventDefault(); dialog.close(); return; }
    if (navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus({preventScroll: true}); return; }
    const openTrigger = triggers.find(trigger => trigger.getAttribute('aria-expanded') === 'true');
    if (openTrigger) { closePanels(); openTrigger.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', closeMenu);

  // Búsqueda (R4): la lupa abre el diálogo y encuentra servicios, plagas, artículos y accesos de la oficina.
  const openButton = document.querySelector('.gt-buscar');
  const searchInput = document.querySelector('#site-search');
  const results = document.querySelector('.search-results');
  const count = document.querySelector('.search-count');
  if (!openButton || !dialog || !searchInput) return;
  const brand = document.querySelector('.site-header .brand');
  const home = new URL(brand ? brand.getAttribute('href') : './', location.href);
  if (home.hash) home.hash = '';
  let data = [];
  try { data = JSON.parse(document.getElementById('gt-indice').textContent); } catch (error) { data = []; }
  const index = data.map(([title, words, route, category]) => [title, words, /^https?:/.test(route) ? route : new URL(route, home).href, category]);
  const normalize = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const render = () => {
    const query = normalize(searchInput.value.trim());
    const terms = query.split(/\s+/).filter(Boolean);
    const score = item => {
      const title = normalize(item[0]);
      const hay = normalize(item[0] + ' ' + item[1] + ' ' + item[3]);
      if (!terms.every(term => hay.includes(term))) return -1;
      if (!query) return 0;
      return title === query ? 100 : title.startsWith(query) ? 80 : title.includes(query) ? 60 : 10;
    };
    const found = index.map((item, i) => ({item, i, rank: score(item)})).filter(r => r.rank >= 0)
      .sort((x, y) => y.rank - x.rank || x.i - y.i).map(r => r.item);
    results.replaceChildren();
    found.forEach(([title, , url, category]) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      const label = document.createElement('span');
      const type = document.createElement('small');
      label.textContent = title;
      type.textContent = category + (/^https?:/.test(url) && !url.startsWith(location.origin) ? ' ↗' : ' →');
      link.href = url;
      link.append(label, type);
      li.append(link);
      results.append(li);
    });
    count.textContent = found.length ? (found.length === 1 ? "1 página o acceso encontrado" : `${found.length} páginas y accesos encontrados`) : 'No encontramos coincidencias. Pruebe con un servicio o una plaga.';
  };
  openButton.addEventListener('click', () => { closePanels(); render(); dialog.showModal(); searchInput.focus(); });
  const closeButton = document.querySelector('.search-close');
  if (closeButton) closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  results.addEventListener('click', event => { if (event.target.closest('a')) dialog.close(); });
  searchInput.addEventListener('input', render);
  searchInput.addEventListener('keydown', event => {
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); (event.key === 'ArrowDown' ? links[0] : links.at(-1)).focus(); }
    else if (event.key === 'Enter') { event.preventDefault(); links[0].click(); }
  });
  dialog.addEventListener('close', () => openButton.focus());
})();
// Pie en acordeón en celular; mapa completo en pantallas grandes (como globaltni).
(() => {
  const compact = matchMedia('(max-width: 959px)');
  const groups = [...document.querySelectorAll('.footer-grid > details')];
  const sync = () => groups.forEach(group => {
    group.open = !compact.matches;
    group.querySelector('summary').tabIndex = compact.matches ? 0 : -1;
  });
  groups.forEach(group => group.querySelector('summary').addEventListener('click', event => { if (!compact.matches) event.preventDefault(); }));
  compact.addEventListener('change', sync);
  sync();
})();
// Pasos de TEPS: en celular se abren de a uno; en pantallas anchas se ven los cuatro.
(() => {
  const compact = matchMedia('(max-width:620px)');
  const steps = [...document.querySelectorAll('.teps-step')];
  const sync = () => steps.forEach((step, index) => {
    step.open = !compact.matches || index === 0;
    step.querySelector('summary').tabIndex = compact.matches ? 0 : -1;
  });
  steps.forEach(step => step.querySelector('summary').addEventListener('click', event => { if (!compact.matches) event.preventDefault(); }));
  compact.addEventListener('change', sync);
  sync();
})();
// Comercios (copia de globaltni): marca en el índice el sector que se está leyendo (commercial-editorial.js de globaltni).
(() => {
  const root = document.querySelector('.ct-commercial');
  if (!root) return;
  const links = [...root.querySelectorAll('.ct-sector-nav a')];
  const sectors = [...root.querySelectorAll('.ct-sector')];
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const line = Math.max(innerHeight * .3, (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0) + 32);
    const active = sectors.find(s => { const r = s.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
    for (const link of links) {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  update();
})();
