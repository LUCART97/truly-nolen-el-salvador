/* Service forms are simulated. Truly AI is an explicit, separate live conversation. */
(()=>{
 const pt=document.documentElement.lang==='pt',label=(es,br)=>pt?br:es;
 const banner=document.createElement('div');banner.className='machote-banner';banner.textContent=label('Machote de referencia · Los datos y servicios se adaptan a su oficina.','Modelo de referência · Os dados e serviços são adaptados ao seu escritório.');document.body.prepend(banner);
 const modal=document.createElement('dialog');modal.className='machote-modal';modal.innerHTML='<h2></h2><p></p><button type="button"></button>';modal.querySelector('button').textContent=label('Cerrar','Fechar');modal.querySelector('button').onclick=()=>modal.close();document.body.append(modal);
 const info=title=>{modal.querySelector('h2').textContent=title;modal.querySelector('p').textContent=label('Esta es una vista de referencia. En su sitio se configurará esta sección con los servicios, cobertura y canales de su oficina. No se enviaron mensajes ni se modificó ningún dato.','Esta é uma referência. No seu site, esta seção será configurada com os serviços, cobertura e canais do seu escritório. Nenhuma mensagem foi enviada e nenhum dado foi alterado.');modal.showModal()};
 document.addEventListener('click',e=>{const a=e.target.closest('a[data-demo-link]');if(a){e.preventDefault();info(a.dataset.demoLink)}});
 document.querySelectorAll('form:not(.tia-form)').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;const result=f.querySelector('.form-result');if(result)result.textContent=label('Prueba completada. No se envió ningún mensaje.','Teste concluído. Nenhuma mensagem foi enviada.');else info(label('Prueba completada','Teste concluído'))}));
 // One navigation controller for the country menus, Guatemala dialog and international megamenu.
 const menus=[...document.querySelectorAll('.menu-toggle')].map(button=>({button,panel:document.getElementById(button.getAttribute('aria-controls'))})).filter(x=>x.panel);
 const triggers=[...document.querySelectorAll('.nav-trigger')];
 const closePanels=()=>triggers.forEach(button=>{const panel=document.getElementById(button.getAttribute('aria-controls'));if(panel)panel.hidden=true;button.setAttribute('aria-expanded','false')});
 const setMenu=(menu,open,restore=false)=>{const {button,panel}=menu;button.setAttribute('aria-expanded',String(open));if(panel instanceof HTMLDialogElement){if(open&&!panel.open)panel.showModal();else if(!open&&panel.open)panel.close()}else{panel.hidden=!open&&getComputedStyle(button).display!=='none';panel.classList.toggle('is-open',open);if(panel.classList.contains('navigation'))panel.style.top=open?Math.max(0,button.closest('header').getBoundingClientRect().bottom)+'px':'';}if(!open)closePanels();if(restore)button.focus()};
 menus.forEach(menu=>{const {button,panel}=menu;button.addEventListener('click',()=>setMenu(menu,button.getAttribute('aria-expanded')!=='true'));panel.querySelector('.close-menu')?.addEventListener('click',()=>setMenu(menu,false,true));if(panel instanceof HTMLDialogElement){panel.addEventListener('close',()=>button.setAttribute('aria-expanded','false'));panel.addEventListener('click',event=>{if(event.target===panel){const r=panel.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)setMenu(menu,false,true)}})}panel.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(menu,false)});});
 triggers.forEach(button=>button.addEventListener('click',()=>{const panel=document.getElementById(button.getAttribute('aria-controls'));if(!panel)return;const open=button.getAttribute('aria-expanded')!=='true';closePanels();panel.hidden=!open;button.setAttribute('aria-expanded',String(open))}));
 document.querySelectorAll('.nav-menu').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)document.querySelectorAll('.nav-menu').forEach(other=>{if(other!==details)other.open=false})}));
 const closeDetails=()=>document.querySelectorAll('.nav-menu[open]').forEach(x=>x.open=false);
 document.addEventListener('click',event=>{if(!event.target.closest('header,.mobile-menu')){menus.forEach(menu=>{if(menu.button.getAttribute('aria-expanded')==='true')setMenu(menu,false)});closePanels();closeDetails()}if(event.target.closest('header a')){closePanels();closeDetails()}});
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const active=triggers.find(b=>b.getAttribute('aria-expanded')==='true');if(active){closePanels();active.focus();return}const detail=document.querySelector('.nav-menu[open]');if(detail){detail.open=false;detail.querySelector('summary').focus();return}menus.forEach(menu=>{if(menu.button.getAttribute('aria-expanded')==='true')setMenu(menu,false,true)})});
 window.addEventListener('resize',()=>{menus.forEach(menu=>{if(getComputedStyle(menu.button).display==='none'){setMenu(menu,false);if(!(menu.panel instanceof HTMLDialogElement))menu.panel.hidden=false}else if(menu.button.getAttribute('aria-expanded')==='true'&&menu.panel.classList.contains('navigation'))menu.panel.style.top=Math.max(0,menu.button.closest('header').getBoundingClientRect().bottom)+'px';});});
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),saveData=navigator.connection?.saveData;
 const videos=[...document.querySelectorAll('video')];
 videos.forEach(v=>{
  v.muted=true;v.playsInline=true;v.loop=true;v.preload='none';v.removeAttribute('autoplay');v.removeAttribute('controls');v.removeAttribute('src');
  let visible=false;const wrap=v.closest('.film,.hero-media,.car-media')||v.parentElement;
  const choose=()=>{if(v.dataset.film)return '/truly-nolen-el-salvador/machotes/assets/'+v.dataset.film+(v.dataset.filmShared!=='true'&&innerWidth<760?'-mobile.mp4':'-desktop.mp4')+(v.dataset.filmVersion?'?v='+v.dataset.filmVersion:'');if(document.body.dataset.machote==='international')return '/truly-nolen-el-salvador/machotes/assets/'+(v.dataset.scene||'car')+'-'+(innerWidth<760?'mobile':'desktop')+'.mp4';return v.dataset.src||v.dataset.mobileSrc};
  const sync=()=>{if(!visible||document.hidden||reduced.matches||saveData){v.pause();return}const src=choose();if(src&&!v.getAttribute('src'))v.src=src;if(src)v.play().catch(()=>{v.style.opacity='0'})};
  // Mexico's ant turns across the frame. Follow the reviewed trajectory on
  // narrow screens instead of cropping its head when the footage advances.
  if(v.dataset.film==='mexico'){
   const frame=()=>{
    const t=Math.min(8,Math.max(0,v.currentTime));
    const focus=t<1?76:t<4?76-(t-1)*(22/3):t<6?54-(t-4)*4:46;
    v.style.objectPosition=innerWidth<=760?focus+'% center':'';
   };
   if('requestVideoFrameCallback' in v){const next=()=>{frame();v.requestVideoFrameCallback(next)};v.requestVideoFrameCallback(next)}
   else v.addEventListener('timeupdate',frame);
   v.addEventListener('loadeddata',frame);
   window.addEventListener('resize',frame);
  }
  if(document.body.dataset.machote==='international'){v.loop=false;v.addEventListener('ended',()=>{v.dataset.scene=v.dataset.scene==='world'?'car':'world';v.src=choose();sync()})}
  matchMedia('(max-width:759px)').addEventListener('change',()=>{v.pause();v.removeAttribute('src');v.load();sync()});
  v.addEventListener('playing',()=>{wrap.dataset.mediaState='playing';wrap.dataset.playing='true';wrap.dataset.videoReady='true';v.style.opacity='1'});v.addEventListener('error',()=>{v.style.opacity='0';delete wrap.dataset.playing});
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync()},{threshold:.15}).observe(v);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 });
 // Reference-site consultation shortcuts prepare the demo form without sending anything.
 document.querySelectorAll('[data-inquiry]').forEach(link=>link.addEventListener('click',()=>{const field=document.querySelector('form textarea[name=mensaje]');if(field&&!field.value.trim())field.value=link.dataset.inquiry;setTimeout(()=>{if(document.activeElement===link||document.activeElement===document.body)document.querySelector('form input[name=nombre]')?.focus({preventScroll:true})},0)}));
 // Parent may personalize display text only. Country, links and forms never change through this message.
 window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='inbound-machote-preview')return;const name=String(e.data.name||'').slice(0,150);if(name)document.querySelectorAll('[data-preview-office]').forEach(x=>x.textContent=name)});
})();
