/* Progressive enhancement: content never depends on animation or IntersectionObserver. */
(()=>{
 // The iframe cannot call the hub as origin "null". A narrow MessageChannel
 // uses the portal's public chat connection without relaxing its sandbox.
 if(window.parent!==window){
  const nativeFetch=window.fetch.bind(window),hub='https://iefvhkckwcuvroidfswq.supabase.co/functions/v1/platform-web-chat';
  window.fetch=(input,options)=>{
   if(String(input)!==hub)return nativeFetch(input,options);
   return new Promise((resolve,reject)=>{
    const channel=new MessageChannel();let done=false;
    const finish=(fn,value)=>{if(done)return;done=true;clearTimeout(timer);channel.port1.close();options?.signal?.removeEventListener('abort',cancel);fn(value)};
    const cancel=()=>finish(reject,new DOMException('Aborted','AbortError'));
    const timer=setTimeout(cancel,20000);
    if(options?.signal?.aborted){cancel();return}options?.signal?.addEventListener('abort',cancel,{once:true});
    channel.port1.onmessage=event=>{const data=event.data;if(!data||!Number.isInteger(data.status)||data.status<200||data.status>599){finish(reject,new Error('Invalid chat response'));return}finish(resolve,new Response(JSON.stringify(data.body),{status:data.status,headers:{'Content-Type':'application/json'}}))};
    try{const body=JSON.parse(options?.body||'{}');window.parent.postMessage({type:'machote:chat',body},location.origin,[channel.port2])}catch(error){finish(reject,error)}
   });
  };
 }

 const header=document.querySelector('body>header');
 const progress=document.createElement('div');progress.className='machote-reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let pending=false;const draw=()=>{pending=false;header?.classList.toggle('is-scrolled',scrollY>32);const total=document.documentElement.scrollHeight-innerHeight;progress.style.setProperty('--reading-progress',String(total>0?Math.min(1,Math.max(0,scrollY/total)):0))};
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(draw)}},{passive:true});addEventListener('resize',draw);draw();
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){if(!reduced.matches)entry.target.classList.add('chapter-enter');observer.unobserve(entry.target)}},{threshold:.1});document.querySelectorAll('main>section>div:not(.film,.hero-media,.car-media)').forEach(e=>observer.observe(e));}
 // Original-site entry points all open the same real Truly AI widget.
 document.querySelectorAll('[data-franchise-chat-open],[data-marco-open],.chat-open,.search-toggle,.search-open,.marco-quick button').forEach(button=>button.setAttribute('data-abrir-chat',''));
 // Distinguish this demo before sending, without inventing a regional WhatsApp number.
 const host=document.querySelector('.machote-chat-host');
 if(host){const root=host.querySelector('[data-chat]');root?.setAttribute('data-quiet','true');}
})();
