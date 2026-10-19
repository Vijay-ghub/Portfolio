const menuToggle=document.getElementById('menuToggle'),nav=document.getElementById('nav');
menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open);menuToggle.textContent=open?'×':'☰';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const filters=document.querySelectorAll('.filter'),projects=document.querySelectorAll('.project');
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;projects.forEach(p=>{p.hidden=f!=='all'&&!p.dataset.category.split(' ').includes(f);});}));
const sections=[...document.querySelectorAll('main section[id]')],links=[...nav.querySelectorAll('a')];
const activeObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>activeObserver.observe(s));
document.getElementById('year').textContent=new Date().getFullYear();
// Lightweight typewriter: cycles through professional roles without an external library.
const typedRole=document.getElementById('typedRole');
if(typedRole){
  const roles=['Game Developer','UI/UX Designer','XR Developer','Business Development Executive','Frontend Developer'];
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion){typedRole.textContent=roles[0];}
  else {
    let roleIndex=0,charIndex=roles[0].length,deleting=true;
    const typeNext=()=>{
      const word=roles[roleIndex];
      if(deleting){charIndex--;typedRole.textContent=word.slice(0,Math.max(0,charIndex));}
      else {charIndex++;typedRole.textContent=word.slice(0,charIndex);}
      let delay=deleting?48:88;
      if(deleting&&charIndex<=0){deleting=false;roleIndex=(roleIndex+1)%roles.length;delay=350;}
      else if(!deleting&&charIndex>=roles[roleIndex].length){deleting=true;delay=1450;}
      window.setTimeout(typeNext,delay);
    };
    window.setTimeout(typeNext,1600);
  }
}
// Theme and accent controls. Settings are intentionally lightweight and remembered locally.
const root=document.documentElement,themeToggle=document.getElementById('themeToggle'),themeIcon=document.getElementById('themeIcon');
const themeMeta=document.getElementById('themeColorMeta');
function applyTheme(theme){root.dataset.theme=theme;const light=theme==='light';themeIcon.textContent=light?'☾':'☼';themeToggle.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');themeMeta.content=light?'#eef3f8':'#0a0d12';}
let savedTheme='dark';try{savedTheme=localStorage.getItem('vijay-portfolio-theme')||'dark';}catch(e){}applyTheme(savedTheme);
themeToggle.addEventListener('click',()=>{const next=root.dataset.theme==='light'?'dark':'light';applyTheme(next);try{localStorage.setItem('vijay-portfolio-theme',next);}catch(e){}});
const paletteButtons=document.querySelectorAll('.palette-option'),paletteTrigger=document.getElementById('paletteTrigger'),paletteOptions=document.getElementById('paletteOptions'),paletteCurrent=document.getElementById('paletteCurrent');
function applyAccent(hex){const clean=hex.replace('#','');const r=parseInt(clean.slice(0,2),16),g=parseInt(clean.slice(2,4),16),b=parseInt(clean.slice(4,6),16);root.style.setProperty('--accent',hex);root.style.setProperty('--accent-rgb',`${r},${g},${b}`);paletteButtons.forEach(btn=>{const active=btn.dataset.accent.toLowerCase()===hex.toLowerCase();btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',active?'true':'false');});if(paletteCurrent)paletteCurrent.style.background=hex;try{localStorage.setItem('vijay-portfolio-accent',hex);}catch(e){}}
function closePalette(){paletteOptions.hidden=true;paletteTrigger.setAttribute('aria-expanded','false');}
paletteTrigger.addEventListener('click',()=>{const opening=paletteOptions.hidden;paletteOptions.hidden=!opening;paletteTrigger.setAttribute('aria-expanded',String(opening));});
document.addEventListener('click',e=>{if(!document.getElementById('paletteMenu').contains(e.target))closePalette();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePalette();});
let savedAccent='#c8ff42';try{savedAccent=localStorage.getItem('vijay-portfolio-accent')||savedAccent;}catch(e){}if([...paletteButtons].some(b=>b.dataset.accent.toLowerCase()===savedAccent.toLowerCase()))applyAccent(savedAccent);
paletteButtons.forEach(btn=>btn.addEventListener('click',()=>{applyAccent(btn.dataset.accent);closePalette();}));
// A small, responsive canvas particle field evokes a game engine / digital world without a heavy 3D library.
(()=>{const canvas=document.getElementById('gameParticles');if(!canvas||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const ctx=canvas.getContext('2d');if(!ctx)return;let w=0,h=0,particles=[],raf=0,last=0;const mobile=()=>window.innerWidth<700;function resize(){const dpr=Math.min(window.devicePixelRatio||1,1.5);w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(mobile()?28:65,Math.max(16,Math.floor(w*h/(mobile()?25000:18000))));particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22,vy:-(.08+Math.random()*.24),r:.6+Math.random()*1.5,a:.15+Math.random()*.5}));}function draw(t){raf=0;if(document.hidden)return;if(t-last<32){raf=requestAnimationFrame(draw);return;}last=t;ctx.clearRect(0,0,w,h);const styles=getComputedStyle(root),accent=styles.getPropertyValue('--accent').trim()||'#c8ff42';particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.y<-5){p.y=h+5;p.x=Math.random()*w;}if(p.x<-5)p.x=w+5;if(p.x>w+5)p.x=-5;ctx.globalAlpha=p.a;ctx.fillStyle=accent;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy;if(d<95*95){ctx.globalAlpha=(1-d/(95*95))*.12;ctx.strokeStyle=accent;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}});ctx.globalAlpha=1;raf=requestAnimationFrame(draw);}function start(){if(!raf&&!document.hidden)raf=requestAnimationFrame(draw);}function stop(){if(raf)cancelAnimationFrame(raf);raf=0;}resize();start();window.addEventListener('resize',()=>{resize();start();},{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});})();

// Contact form: validate user input before POSTing to FormSubmit. Its CAPTCHA remains enabled.
(()=>{
 const form=document.getElementById('contactForm');
 if(!form)return;
 const nameInput=document.getElementById('name');
 const emailInput=document.getElementById('email');
 const subjectInput=document.getElementById('subject');
 const messageInput=document.getElementById('message');
 const count=document.getElementById('messageCount');
 const note=document.getElementById('formNote');
 const emailSubject=document.getElementById('formEmailSubject');
 const submit=document.getElementById('contactSubmit');
 // Reject URLs, domain-like text, HTML tags, and common link markup in text fields.
 const linkPattern=/(https?:\/\/|ftp:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|co|in|dev|app|gg|me|info|biz|xyz|link|site)\b|<\/?\s*a\b|\[url\s*=)/i;
 const suspiciousPattern=/(viagra|casino|crypto giveaway|earn money fast|buy followers)/i;
 const updateCount=()=>{count.textContent=messageInput.value.length+'/180';count.classList.toggle('limit-reached',messageInput.value.length>=180);};
 messageInput.addEventListener('input',updateCount);updateCount();
 [nameInput,subjectInput,messageInput].forEach(input=>input.addEventListener('input',()=>{
   input.setCustomValidity(linkPattern.test(input.value)?'Links and website addresses are not allowed.':suspiciousPattern.test(input.value)?'Please remove promotional or spam-like wording.':'');
 }));
 form.addEventListener('submit',event=>{
   const textFields=[nameInput,subjectInput,messageInput];
   for(const input of textFields){
     const value=input.value.trim();
     if(!value){event.preventDefault();input.setCustomValidity('Please complete this field.');input.reportValidity();return;}
     if(linkPattern.test(value)){event.preventDefault();input.setCustomValidity('Links and website addresses are not allowed.');input.reportValidity();note.textContent='Please remove links, URLs, and website addresses before sending.';return;}
     if(suspiciousPattern.test(value)){event.preventDefault();input.setCustomValidity('Please remove promotional or spam-like wording.');input.reportValidity();note.textContent='Please revise the message and try again.';return;}
     input.value=value;
   }
   if(messageInput.value.length>180){event.preventDefault();note.textContent='Your message must be 180 characters or fewer.';return;}
   if(!emailInput.checkValidity()){event.preventDefault();emailInput.reportValidity();return;}
   emailSubject.value='Portfolio enquiry: '+subjectInput.value.trim().slice(0,80);
   submit.disabled=true;
   submit.innerHTML='Sending… <span>↗</span>';
   note.textContent='Submitting securely… If this is your first submission, FormSubmit may email the recipient an activation link.';
   // Do not preventDefault: browser submits the form to FormSubmit over HTTPS.
 });
})();

// Scroll progress and subtle pointer lighting (disabled on touch-first devices).
const progressBar=document.getElementById('scrollProgress');
const stickyHeader=document.querySelector('.topbar');
const updateProgress=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progressBar.style.width=(max>0?(window.scrollY/max)*100:0)+'%';if(stickyHeader)stickyHeader.classList.toggle('is-scrolled',window.scrollY>18);};
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  let pointerTick=false;
  window.addEventListener('pointermove',e=>{if(pointerTick)return;pointerTick=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--pointer-x',e.clientX+'px');document.documentElement.style.setProperty('--pointer-y',e.clientY+'px');pointerTick=false;});},{passive:true});
}
// Lightweight custom cursor for desktop mouse/trackpad; native touch behavior stays intact.
const cursorDot=document.getElementById('customCursor'),cursorRing=document.getElementById('customCursorRing');
const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
if(finePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('cursor-ready');
  let cursorFrame=0,lastX=window.innerWidth/2,lastY=window.innerHeight/2;
  const moveCursor=e=>{lastX=e.clientX;lastY=e.clientY;if(cursorFrame)return;cursorFrame=requestAnimationFrame(()=>{cursorDot.style.transform=`translate(${lastX}px,${lastY}px) translate(-50%,-50%)`;cursorRing.style.transform=`translate(${lastX}px,${lastY}px) translate(-50%,-50%)`;cursorDot.classList.add('visible');cursorRing.classList.add('visible');cursorFrame=0;});};
  window.addEventListener('pointermove',moveCursor,{passive:true});
  document.addEventListener('pointerleave',()=>{cursorDot.classList.remove('visible');cursorRing.classList.remove('visible')});
  document.querySelectorAll('a,button,input,textarea,[role="button"]').forEach(el=>{el.addEventListener('pointerenter',()=>cursorRing.classList.add('cursor-hover'));el.addEventListener('pointerleave',()=>cursorRing.classList.remove('cursor-hover'));});
}

// Gentle tilt on cards for mouse/trackpad only.
if(window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion: no-preference)').matches){
  document.querySelectorAll('.project,.service').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      card.style.transform=`perspective(900px) rotateX(${(0.5-y)*3}deg) rotateY(${(x-0.5)*3}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}
// Keep animations light for reduced-motion users and avoid off-screen animation work.

(()=>{
 const modal=document.getElementById('projectModal');
 if(!modal)return;
 const closeBtn=document.getElementById('projectModalClose');
 const preview=document.getElementById('projectModalPreview');
 const title=document.getElementById('projectModalTitle');
 const description=document.getElementById('projectModalDescription');
 const tags=document.getElementById('projectModalTags');
 const kicker=document.getElementById('projectModalKicker');
 const demo=document.getElementById('projectDemoLink');
 const source=document.getElementById('projectSourceLink');
 const note=document.getElementById('projectModalNote');
 let previousFocus=null;
 function openProject(card){
   previousFocus=document.activeElement;
   const heading=card.querySelector('.project-info h3');
   const paragraph=card.querySelector('.project-info p');
   const visual=card.querySelector('.project-visual');
   title.textContent=heading?heading.textContent:'Project details';
   description.textContent=paragraph?paragraph.textContent:'';
   const number=card.querySelector('.project-number');
   kicker.textContent=number?number.textContent+' · DETAILS':'PROJECT DETAILS';
   preview.replaceChildren();
   if(visual){
     const clone=visual.cloneNode(true);
     clone.classList.add('project-modal-preview');
     clone.querySelectorAll('.project-arrow,.project-number').forEach(el=>el.remove());
     preview.appendChild(clone);
   }
   tags.replaceChildren();
   card.querySelectorAll('.project-tags .tag-chip').forEach(tag=>{
     const chip=document.createElement('span');chip.className='tag-chip';chip.textContent=tag.textContent;tags.appendChild(chip);
   });
   const demoUrl=card.dataset.projectUrl||card.dataset.demoUrl||'';
   const sourceUrl=card.dataset.sourceUrl||'';
   demo.hidden=!/^https?:\/\//i.test(demoUrl);
   source.hidden=!/^https?:\/\//i.test(sourceUrl);
   if(!demo.hidden)demo.href=demoUrl;
   if(!source.hidden)source.href=sourceUrl;
   note.hidden=!demo.hidden&&!source.hidden;
   modal.hidden=false;
   requestAnimationFrame(()=>{modal.classList.add('open');closeBtn.focus();});
   document.body.style.overflow='hidden';
 }
 function closeProject(){
   modal.classList.remove('open');
   document.body.style.overflow='';
   window.setTimeout(()=>{modal.hidden=true;preview.replaceChildren();if(previousFocus&&previousFocus.focus)previousFocus.focus();},220);
 }
 document.querySelectorAll('#work .project').forEach(card=>{
   const arrow=card.querySelector('.project-arrow');
   if(!arrow)return;
   arrow.setAttribute('role','button');arrow.setAttribute('tabindex','0');
   arrow.setAttribute('aria-label','Open project details: '+(card.querySelector('h3')?.textContent||'project'));
   arrow.setAttribute('aria-haspopup','dialog');
   arrow.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openProject(card);});
   arrow.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(card);}});
 });
 closeBtn.addEventListener('click',closeProject);
 modal.addEventListener('click',e=>{if(e.target===modal)closeProject();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeProject();});
})();

// Add scroll-triggered entrance to individual education and experience entries.
(()=>{
 const items=[...document.querySelectorAll('#resume .timeline-item')];
 if(!items.length)return;
 if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('visible'));return;}
 const timelineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');timelineObserver.unobserve(entry.target);}
 }),{threshold:.14,rootMargin:'0px 0px -24px 0px'});
 items.forEach(el=>timelineObserver.observe(el));
})();
