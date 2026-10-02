/* ============================================================
   CONFIGURAÇÃO — troque pelo WhatsApp real da academia
   Formato: 55 + DDD + número (somente dígitos)
   ============================================================ */
const WA_NUMBER = "5521992635225";
const WA_DEFAULT_MSG = "Olá! Vim pelo site da SC Academia e gostaria de mais informações.";

const waLink = msg => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

/* Links de WhatsApp */
document.querySelectorAll("[data-wa]").forEach(a=>{
  let msg = a.dataset.msg || WA_DEFAULT_MSG;
  if(a.dataset.unit) msg = `Olá! Tenho interesse na unidade ${a.dataset.unit} da SC Academia.`;
  a.href = waLink(msg);
});

/* Menu mobile */
const burger = document.getElementById("burger"), drawer = document.getElementById("drawer");
function toggleMenu(open){
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", !open);
  document.body.classList.toggle("no-scroll", open);
}
burger.addEventListener("click",()=>toggleMenu(burger.getAttribute("aria-expanded")!=="true"));
drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggleMenu(false)));
window.addEventListener("resize",()=>{ if(innerWidth>950) toggleMenu(false); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") toggleMenu(false); });

/* Header, botão topo e link ativo */
const header = document.getElementById("header"), totop = document.getElementById("totop");
const links = [...document.querySelectorAll("nav.main a")];
const secs = links.map(a=>document.querySelector(a.getAttribute("href")));
function onScroll(){
  header.classList.toggle("scrolled", scrollY>20);
  totop.classList.toggle("show", scrollY>700);
  const y = scrollY + innerHeight*0.35;
  let cur = -1; secs.forEach((s,i)=>{ if(s && s.offsetTop<=y) cur=i; });
  links.forEach((a,i)=>a.classList.toggle("active", i===cur));
}
addEventListener("scroll", onScroll, {passive:true}); onScroll();
totop.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

/* Revelar ao rolar */
const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* Aberto agora (horário de Brasília) */
(function(){
  const sched = {1:[6,23],2:[6,23],3:[6,23],4:[6,23],5:[6,23],6:[8,16],0:[8,14]};
  const parts = new Intl.DateTimeFormat("en-US",{timeZone:"America/Sao_Paulo",weekday:"short",hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date());
  const get = t=>parts.find(p=>p.type===t).value;
  const day = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[get("weekday")];
  const h = (+get("hour"))%24 + (+get("minute"))/60;
  const [o,c] = sched[day];
  const el = document.getElementById("status"), txt = el.querySelector("span");
  if(h>=o && h<c){ el.classList.add("open"); txt.textContent = `Aberto agora • fecha às ${c}h`; }
  else { el.classList.add("closed"); txt.textContent = "Fechado agora • confira os horários"; }
  document.querySelectorAll(".hour").forEach(el=>{
    if(el.dataset.days.split(",").includes(String(day))) el.classList.add("today");
  });
})();

/* Formulário -> WhatsApp */
document.getElementById("leadForm").addEventListener("submit",e=>{
  e.preventDefault();
  const f = e.target, nome = f.nome.value.trim();
  if(!nome){ f.nome.focus(); f.nome.style.borderColor="#ed1118"; return; }
  const msg = `Olá! Meu nome é ${nome}. Gostaria de agendar uma aula experimental na unidade ${f.unidade.value}. Interesse: ${f.interesse.value}.`;
  window.open(waLink(msg),"_blank","noopener");
});
