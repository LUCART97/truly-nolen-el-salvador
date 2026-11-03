/* ── Truly AI · el chat del sitio ──────────────────────────────────────────────
   Habla SOLO con `platform-web-chat` del hub: es el MISMO cerebro que atiende por
   WhatsApp. Un widget con cerebro propio serían dos respuestas distintas a la misma
   persona, cada una correcta por separado, y nada lo delataría.
   La llave es la PUBLICABLE del hub — pensada para viajar al navegador, como en Londri. */
// Copia del chat de trulytech.ai (tech-immersive-20260910/web/chat.js) para trulyinbound.ai, 8-oct-2026.
// Mismo hub, mismo tenant: Truly AI responde igual en los dos sitios. Los textos vienen de #tia-textos.
// 8-oct-2026 · también vive en la entrada del portal (React): la app no trae el chat en su HTML, pide el
// fragmento de su idioma (`/landing/chat/<ruta>.json`, generado por construir.mjs) y lo monta con
// `window.trulyIA.montar(raiz)`, que devuelve cómo desmontarlo al cambiar de idioma o de pantalla.
const HUB='https://iefvhkckwcuvroidfswq.supabase.co/functions/v1/platform-web-chat';
const LLAVE='sb_publishable_aetGp-MtqTN3y9zu0vyNdQ_ZNdi8dDt';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function montar(tia){
 const scope=tia.parentElement;
 const c=JSON.parse((scope?.querySelector('#tia-textos')||document.querySelector('#tia-textos'))?.textContent||'{}');
 const t={chatSaludo:c.saludo,chatEscribiendo:c.escribiendo,chatEnLinea:c.enLinea,chatCerrar:c.cerrar,chatAbrir:c.abrir,chatTrabado:c.trabado,chatCaido:c.caido};
 const fuera=new AbortController(),senal={signal:fuera.signal};
 // landing.css esconde el chat con `html:not(.js)` (sin JS no sirve); la app no pone esa clase, la pone el chat al montarse.
 document.documentElement.classList.add('js');
 const q=s=>tia.querySelector(s);
 const panel=q('.tia-panel'),fab=q('.tia-fab'),hilo=q('[data-hilo]'),campo=q('.tia-campo'),
       form=q('.tia-form'),enviar=q('.tia-send'),atajos=q('[data-atajos]'),nudge=q('.tia-nudge'),
       badge=q('.tia-badge'),estadoTxt=q('[data-estado]'),marcaHead=q('.tia-head .tia-marca'),
       reset=q('.tia-reset');
 const clave=k=>tia.dataset.storageScope?'tia-portal:'+encodeURIComponent(tia.dataset.storageScope)+':'+k:k;
 const guarda=(k,v)=>{try{sessionStorage.setItem(clave(k),v)}catch{}};
 const lee=k=>{try{return sessionStorage.getItem(clave(k))}catch{return null}};
 const sesion=()=>{let s=lee('tia-sesion');if(!s){s='w-'+Math.random().toString(36).slice(2)+Date.now().toString(36);guarda('tia-sesion',s)}return s};
 let id=sesion(),turnos=[],abierto=false,pensando=false,noLeidos=0,tocado=tia.dataset.quiet==='true'||lee('tia-quieta')==='1';
 try{turnos=JSON.parse(lee('tia-hilo')||'[]')}catch{}

 /* El cerebro escribe **negritas** en el dialecto de WhatsApp. Se pintan en PIEZAS de texto,
    nunca como HTML: un innerHTML acá convierte cualquier respuesta en un hueco por donde entra
    lo que sea. */
 const negritas=(nodo,texto)=>{
   for(const parte of String(texto).split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g)){
     if(!parte)continue;
     if(parte.startsWith('**')&&parte.endsWith('**')&&parte.length>4){
       const f=document.createElement('strong');f.textContent=parte.slice(2,-2);nodo.appendChild(f);
     } else if(parte.startsWith('*')&&parte.endsWith('*')&&parte.length>2){
       const f=document.createElement('em');f.textContent=parte.slice(1,-1);nodo.appendChild(f);
     } else nodo.appendChild(document.createTextNode(parte));
   }
 };
 const marca=e=>{marcaHead.className='tia-marca tia-marca--'+e};
 const pinta=()=>{
   hilo.replaceChildren(...turnos.map(m=>{const p=document.createElement('p');
     p.className='tia-msg'+(m.de==='yo'?' tia-msg--yo':'');negritas(p,m.texto);return p}));
   // Los atajos viven DENTRO del hilo, pegados al saludo — pinchados al pie se leen
   // como una barra de la interfaz y no como lo que son: lo que Truly AI propone.
   if(!(turnos.length>1||pensando))hilo.appendChild(atajos);
   if(pensando){const s=document.createElement('span');s.className='tia-puntos';s.setAttribute('role','status');
     s.setAttribute('aria-label',t.chatEscribiendo);for(let k=0;k<3;k++)s.appendChild(document.createElement('i'));hilo.appendChild(s)}
   atajos.hidden=turnos.length>1||pensando;
   reset.hidden=turnos.length<2;
   estadoTxt.textContent=pensando?t.chatEscribiendo:t.chatEnLinea;
   hilo.scrollTop=hilo.scrollHeight;
   guarda('tia-hilo',JSON.stringify(turnos.slice(-40)));
 };
 if(!turnos.length)turnos=[{de:'ia',texto:t.chatSaludo}];

 let origen=null;
 function abrir(v){
   if(v&&!abierto)origen=document.activeElement;
   abierto=v;tia.classList.toggle('tia--on',v);panel.setAttribute('aria-hidden',String(!v));
   fab.setAttribute('aria-expanded',String(v));fab.setAttribute('aria-label',v?t.chatCerrar:t.chatAbrir);
   if(v){tocado=true;nudge.hidden=true;noLeidos=0;badge.hidden=true;marca('saludo');
     setTimeout(()=>{try{campo.focus({preventScroll:true})}catch{campo.focus()}},60);
     setTimeout(()=>marca('neutral'),1300);}
   // El foco vuelve a quien abrió el chat (el botón del pie, por ejemplo). Si ya no está, o no se ve, al botón flotante.
   else{const o=origen;origen=null;const visible=o instanceof HTMLElement&&o!==document.body&&o.isConnected&&o.getClientRects().length>0&&getComputedStyle(o).visibility!=='hidden';const fallback=tia.dataset.portal==='inbound'?document.querySelector('[data-abrir-chat], .sop-boton'):fab;(visible?o:fallback||fab).focus()}
   pinta();
 }
 window.addEventListener('truly-ai:close',()=>{if(abierto)abrir(false)},senal);
 fab.addEventListener('click',()=>abrir(!abierto));
 q('.tia-close').addEventListener('click',()=>abrir(false));
 q('.tia-nudge-open').addEventListener('click',()=>abrir(true));
 q('.tia-nudge-x').addEventListener('click',()=>{nudge.hidden=true;tocado=true;guarda('tia-quieta','1');tia.classList.add('tia--quieta')});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&abierto)abrir(false)},senal);
 reset.addEventListener('click',()=>{if(pensando)return;turnos=[{de:'ia',texto:t.chatSaludo}];
   try{sessionStorage.removeItem(clave('tia-hilo'));sessionStorage.removeItem(clave('tia-sesion'))}catch{}
   id=sesion();pinta();campo.focus()});

 // La invitación aparece una sola vez, a los 6 s, y sólo si nadie la tocó antes.
 const invitacion=!tocado&&!reduced.matches?setTimeout(()=>{if(!tocado&&!abierto){nudge.hidden=false}},6000):0;
 if(tocado)tia.classList.add('tia--quieta');

 campo.addEventListener('input',()=>{enviar.disabled=!campo.value.trim()||pensando});
 atajos.addEventListener('click',ev=>{const b=ev.target.closest('.tia-atajo');if(b)mandar(b.textContent)});
 form.addEventListener('submit',ev=>{ev.preventDefault();mandar(campo.value)});

 async function mandar(texto){
   const msg=(texto||'').trim();
   if(!msg||pensando)return;
   campo.value='';enviar.disabled=true;
   turnos.push({de:'yo',texto:msg});pensando=true;marca('pensando');pinta();
   let respuesta;
   const solicitud=new AbortController(),cancelar=()=>solicitud.abort();
   fuera.signal.addEventListener('abort',cancelar,{once:true});
   const limite=setTimeout(cancelar,20000);
   try{
     // Lo que el hub sabe de ESTA página (platform-web-chat → «CONTEXTO DE ESTA PÁGINA»): el sitio,
     // la ruta y, si la página lo declara en #tia-contexto, qué es. Sin esto Truly AI no distingue la
     // página de expectativa del sitio completo (medido el 23-sep: no llegaba nada).
     const declarado=((scope?.querySelector('#tia-contexto')||document.getElementById('tia-contexto'))?.textContent||'').trim();
     const pregunta=tia.dataset.portal==='inbound'?(document.getElementById('inbound-question-context')?.textContent||''):'';
     const page_context=[pregunta,declarado,`Ruta: ${location.pathname}`].filter(Boolean).join('\n').slice(0,1500);
     // El saludo se siembra en la conversación con el primer mensaje: sin él, en la Bandeja el hilo
     // empieza por una respuesta a algo que nadie ve.
     const primero=turnos.filter(x=>x.de==='yo').length===1;
     const utm=Object.fromEntries([...new URLSearchParams(location.search)].filter(([k])=>k.startsWith('utm_')).map(([k,v])=>[k,v.slice(0,200)]));
     const r=await fetch(HUB,{method:'POST',headers:{'Content-Type':'application/json',apikey:LLAVE},
       signal:solicitud.signal,body:JSON.stringify({tenant_slug:'trulynolen-intl',session_id:id,message:msg,page_context,
         ...(primero?{greeting:t.chatSaludo}:{}),...(Object.keys(utm).length?{attribution:utm}:{})})});
     const d=await r.json().catch(()=>null);
     // Un fallo NO puede quedar en silencio: el silencio se lee como «me ignoraron».
     respuesta=(r.ok&&d&&typeof d.reply==='string'&&d.reply.trim())||t.chatTrabado;
   }catch{if(fuera.signal.aborted)return;respuesta=t.chatCaido}
   finally{clearTimeout(limite);fuera.signal.removeEventListener('abort',cancelar)}
   if(fuera.signal.aborted)return;
   pensando=false;turnos.push({de:'ia',texto:respuesta});
   marca('celebrando');setTimeout(()=>marca('neutral'),1100);
   if(!abierto){noLeidos++;badge.textContent=String(noLeidos);badge.hidden=false}
   pinta();
 }
 pinta();
 document.addEventListener('click',ev=>{
   if(!(ev.target instanceof Element))return;
   const wa=ev.target.closest('.tia-wa');if(!wa||!tia.contains(wa))return;
   const url=new URL(wa.href),ultimo=turnos.filter(m=>m.de==='yo').at(-1)?.texto||'';
   const origen=wa.dataset.origenWa||(url.searchParams.get('text')||`Truly Inbound (${location.pathname})`);
   wa.dataset.origenWa=origen;url.searchParams.set('text',[origen,ultimo.slice(0,800)].filter(Boolean).join('\n'));wa.href=url.href;
 },senal);
 // Delegado en el documento: los botones «Hablar con Truly AI» de la app los vuelve a pintar React.
 document.addEventListener('click',ev=>{if(!(ev.target instanceof Element))return;const trigger=ev.target.closest('[data-abrir-chat]');if(!trigger)return;if(!abierto)abrir(true);if(trigger.dataset.chatPrompt&&!pensando){campo.value=trigger.dataset.chatPrompt.slice(0,800);enviar.disabled=!campo.value.trim();}},senal);
 return()=>{fuera.abort();clearTimeout(invitacion)};
}
const fija=document.querySelector('[data-chat]');
if(fija)montar(fija);
window.trulyIA={montar};
