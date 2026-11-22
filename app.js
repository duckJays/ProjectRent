/* ---------- SAFETY: never let one bad entry in data.js break the page ---------- */
function showProblem(msg){let b=document.getElementById("problem");if(!b){b=document.createElement("div");b.id="problem";
  b.style.cssText="background:#B4482F;color:#fff;padding:12px 20px;font:14px/1.4 sans-serif;position:relative;z-index:500";document.body.prepend(b)}
  b.textContent="Problem: "+msg+" (press F12 and open Console for details)"}
window.addEventListener("error",e=>showProblem(e.message));
const fixPath=s=>String(s||"").replace(/\\/g,"/");
const arr=v=>Array.isArray(v)?v:(v?[v]:[]);
const DATA=(typeof LISTINGS!=="undefined"&&Array.isArray(LISTINGS)?LISTINGS:(showProblem("data.js did not load or has a typo - check commas and quotes"),[])).map((p,i)=>({
  id:p.id??i+1,name:p.name||"Untitled listing",location:p.location||"",lat:Number(p.lat)||null,lng:Number(p.lng)||null,
  price:Number(p.price)||0,type:p.type||"Apartment",occupants:Number(p.occupants)||1,amenities:arr(p.amenities),rules:p.rules||"None specified.",
  availability:p.availability||"Ask owner",owner:p.owner||"Owner",contact:p.contact||"",description:p.description||"",
  landmarks:arr(p.landmarks),link:p.link||"",photos:arr(p.photos).map(fixPath)}));

const AMENITY_LIST=["WiFi","Parking","Aircon","Pet-friendly","Pool","Furnished","Security","Elevator"];
const GRAD="linear-gradient(135deg,#3E6B62,#8FB8AC)";
const $=id=>document.getElementById(id);
const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hash=s=>{let h=5381;for(const c of s)h=(h*33)^c.charCodeAt(0);return String(h>>>0)}; // demo only - real apps hash on a server
const money=n=>"₱"+Number(n).toLocaleString();
const users=()=>load("haven2_users");
const me=()=>users().find(u=>u.email===load("haven2_session",null))||null;
const ukey=n=>`haven2_${n}_${me()?.email}`;
let selected=[],view="browse",gal={i:0,photos:[]},map=null,openId=null;

function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function openModal(id){$(id).classList.add("show")}
function closeModal(id){$(id).classList.remove("show");if(id==="detailOverlay"&&map){map.remove();map=null;openId=null}}
function needLogin(){if(me())return true;toast("Please log in or register first");openModal("authOverlay");return false}

/* ---------- AUTH ---------- */
document.querySelectorAll("#authOverlay .tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#authOverlay .tabs button").forEach(x=>x.classList.toggle("active",x===b));
  $("loginForm").style.display=b.dataset.tab==="login"?"block":"none";
  $("registerForm").style.display=b.dataset.tab==="register"?"block":"none";
});
$("registerForm").onsubmit=e=>{
  e.preventDefault();
  const name=$("r-name").value.trim(),email=$("r-email").value.trim().toLowerCase(),mobile=$("r-mobile").value.replace(/[\s-]/g,""),pass=$("r-pass").value;
  if(!/^(09|\+639)\d{9}$/.test(mobile))return toast("Enter a valid PH mobile number (e.g. 09171234567)");
  if(pass.length<6)return toast("Password must be at least 6 characters");
  const list=users();
  if(list.some(u=>u.email===email))return toast("That email is already registered - please log in");
  list.push({name,email,mobile,pass:hash(pass)});save("haven2_users",list);
  save("haven2_session",email);e.target.reset();closeModal("authOverlay");refresh();toast("Welcome, "+name+"!");
};
$("loginForm").onsubmit=e=>{
  e.preventDefault();
  const email=$("l-email").value.trim().toLowerCase();
  const u=users().find(x=>x.email===email);
  if(!u||u.pass!==hash($("l-pass").value))return toast("Incorrect email or password");
  save("haven2_session",email);e.target.reset();closeModal("authOverlay");refresh();toast("Welcome back, "+u.name+"!");
};
$("authBtn").onclick=()=>{
  if(me()){localStorage.removeItem("haven2_session");refresh();switchView("browse");toast("Logged out")}
  else openModal("authOverlay");
};
function refresh(){
  $("whoami").textContent=me()?me().name:"";
  $("authBtn").textContent=me()?"Log out":"Log in";
  renderGrid();if(view==="favorites")renderFavs();if(view==="activity")renderActivity();
}

/* ---------- NAV ---------- */
document.querySelectorAll(".navlinks button[data-view]").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
function switchView(v){
  view=v;
  document.querySelectorAll(".navlinks button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
  ["browse","favorites","activity"].forEach(x=>$("view-"+x).style.display=x===v?"block":"none");
  if(v==="favorites")renderFavs();if(v==="activity")renderActivity();
  window.scrollTo(0,0);
}

/* ---------- SEARCH ---------- */
function renderAmenityRow(){
  $("amenityRow").innerHTML=AMENITY_LIST.map(a=>`<button class="chip ${selected.includes(a)?"on":""}" data-a="${a}">${a}</button>`).join("");
  $("amenityRow").querySelectorAll(".chip").forEach(c=>c.onclick=()=>{
    selected=selected.includes(c.dataset.a)?selected.filter(x=>x!==c.dataset.a):[...selected,c.dataset.a];
    renderAmenityRow();renderGrid();
  });
}
function matches(p){
  const q=$("f-location").value.trim().toLowerCase(),price=parseFloat($("f-price").value),type=$("f-type").value,occ=parseInt($("f-occ").value);
  if(q&&!(p.location+" "+p.landmarks.join(" ")).toLowerCase().includes(q))return false;
  if(price&&p.price>price)return false;
  if(type&&p.type!==type)return false;
  if(occ&&p.occupants<occ)return false;
  return selected.every(a=>p.amenities.includes(a));
}
const favIds=()=>me()?load(ukey("favs")):[];
function cardHTML(p){
  const f=favIds().includes(p.id);
  return `<div class="card"><div class="photo" style="background:${GRAD}">
    <img src="${esc(p.photos[0]||"")}" alt="" loading="lazy" onerror="this.style.display='none'">
    <span class="type-badge">${esc(p.type)}</span>
    <button class="fav-btn ${f?"saved":""}" aria-label="Save" onclick="toggleFav(${p.id})">${f?"♥":"♡"}</button></div>
    <div class="card-body"><h3>${esc(p.name)}</h3>
    <div class="loc">📍 ${esc(p.location)} · up to ${p.occupants} occupant${p.occupants>1?"s":""}</div>
    <div class="price">${money(p.price)} / month</div>
    <div class="card-foot"><button class="btn btn-ghost btn-sm" onclick="openDetail(${p.id})">View listing</button>
    <span class="count">${p.photos.length} photos</span></div></div></div>`;
}
function renderGrid(){
  const r=DATA.filter(matches);
  $("grid").innerHTML=r.length?r.map(cardHTML).join(""):`<div class="empty">No rentals match those filters. Try widening your search.</div>`;
  $("listCount").textContent=r.length+" found";
}
$("searchBtn").onclick=renderGrid;
["f-location","f-price"].forEach(i=>$(i).addEventListener("keydown",e=>{if(e.key==="Enter")renderGrid()}));
["f-type","f-occ"].forEach(i=>$(i).addEventListener("change",renderGrid));

/* ---------- FAVORITES ---------- */
function toggleFav(id){
  if(!needLogin())return;
  let f=load(ukey("favs"));f=f.includes(id)?f.filter(x=>x!==id):[...f,id];save(ukey("favs"),f);
  renderGrid();if(view==="favorites")renderFavs();if(openId===id)openDetail(id);
}
function renderFavs(){
  if(!me()){$("favGrid").innerHTML=`<div class="empty">Log in to see your saved properties.</div>`;$("favCount").textContent="";return}
  const r=DATA.filter(p=>favIds().includes(p.id));
  $("favGrid").innerHTML=r.length?r.map(cardHTML).join(""):`<div class="empty">No saved properties yet. Tap the heart on a listing to save it.</div>`;
  $("favCount").textContent=r.length+" saved";
}

/* ---------- DETAIL: gallery, landmarks, map ---------- */
function gSet(i){
  const n=gal.photos.length;if(!n)return;gal.i=(i+n)%n;
  $("gImg").style.display="";$("gImg").src=gal.photos[gal.i];
  $("gCount").textContent=`${gal.i+1} / ${n}`;
  document.querySelectorAll(".g-thumbs div").forEach((d,k)=>d.classList.toggle("on",k===gal.i));
}
const gGo=d=>gSet(gal.i+d);
function openDetail(id){
  const p=DATA.find(x=>x.id===id);if(!p)return;
  openId=id;gal={i:0,photos:p.photos};const f=favIds().includes(id);
  $("detailBody").innerHTML=`<button class="modal-close" onclick="closeModal('detailOverlay')">✕</button>
  <div class="gallery"><div class="g-main"><img id="gImg" src="${esc(p.photos[0]||"")}" alt="" onerror="this.style.display='none'">
    <button class="g-nav prev" aria-label="Previous photo" onclick="gGo(-1)">‹</button>
    <button class="g-nav next" aria-label="Next photo" onclick="gGo(1)">›</button><span class="g-count" id="gCount"></span></div>
    <div class="g-thumbs">${p.photos.map((s,k)=>`<div class="${k?"":"on"}" onclick="gSet(${k})"><img src="${esc(s)}" alt="" onerror="this.style.display='none'"></div>`).join("")}</div></div>
  <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><h2 style="margin:0 0 4px">${esc(p.name)}</h2>
    <button class="fav-btn ${f?"saved":""}" style="position:static;border:1px solid var(--line)" onclick="toggleFav(${p.id})">${f?"♥":"♡"}</button></div>
  <div class="loc">📍 ${esc(p.location)} · ${esc(p.type)} · up to ${p.occupants} occupants</div>
  <div class="price" style="margin:8px 0">${money(p.price)} / month</div>
  <h3 class="sub">Details</h3><p>${esc(p.description)}</p>
  <h3 class="sub">Amenities</h3><div class="pillrow">${p.amenities.map(a=>`<span class="pill">${esc(a)}</span>`).join("")}</div>
  <h3 class="sub">Landmarks &amp; nearby</h3><ul class="lm">${p.landmarks.map(l=>`<li>📌 ${esc(l)}</li>`).join("")}</ul>
  <h3 class="sub">House rules</h3><p class="muted">${esc(p.rules)}</p>
  <h3 class="sub">Availability</h3><p class="muted">Available from ${esc(p.availability)}</p>
  ${p.lat&&p.lng?`<h3 class="sub">Approximate location</h3><iframe class="gmap" style="width:100%;height:260px;border:0;border-radius:14px;display:block;margin:8px 0 6px" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map" src="https://www.google.com/maps?q=${p.lat},${p.lng}&z=15&output=embed"></iframe><a class="muted" href="https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>`:""}
  <h3 class="sub">Contact</h3>
  ${me()?`<p class="muted">${esc(p.owner)} · ${esc(p.contact)}</p>`:`<p class="muted">Log in to see the owner's contact details.</p>`}
  <div class="actions"><button class="btn btn-brass" onclick="openInquiry(${p.id})">Send inquiry</button>
    <button class="btn btn-teal" onclick="openVisit(${p.id})">Schedule a visit</button>
    ${p.link?`<a class="btn btn-ghost" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">View original post ↗</a>`:""}
    <button class="btn btn-ghost btn-sm" onclick="openReport(${p.id})">Report listing</button></div>`;
  gSet(0);openModal("detailOverlay");
}

/* ---------- INQUIRY / VISIT / REPORT / AGREEMENT ---------- */
const pname=id=>DATA.find(p=>p.id===id)?.name||"(listing)";
function openInquiry(id){if(!needLogin())return;$("inq-pid").value=id;$("inq-name").value=me().name;$("inq-email").value=me().email;openModal("inquiryOverlay")}
$("inquiryForm").onsubmit=e=>{
  e.preventDefault();const l=load(ukey("inq"));
  l.push({id:Date.now(),pid:+$("inq-pid").value,msg:$("inq-msg").value.trim(),date:new Date().toISOString().slice(0,10)});
  save(ukey("inq"),l);$("inq-msg").value="";closeModal("inquiryOverlay");toast("Inquiry sent! Track it under My activity.");
};
function openVisit(id){if(!needLogin())return;$("vis-pid").value=id;$("vis-date").min=new Date().toISOString().slice(0,10);openModal("visitOverlay")}
$("visitForm").onsubmit=e=>{
  e.preventDefault();const l=load(ukey("visits"));
  l.push({id:Date.now(),pid:+$("vis-pid").value,date:$("vis-date").value,time:$("vis-time").value});
  save(ukey("visits"),l);closeModal("visitOverlay");toast("Visit requested! Track it under My activity.");
};
function openReport(id){if(!needLogin())return;$("rep-pid").value=id;openModal("reportOverlay")}
$("reportForm").onsubmit=e=>{
  e.preventDefault();const l=load("haven2_reports");
  l.push({pid:+$("rep-pid").value,reason:$("rep-reason").value,details:$("rep-details").value.trim(),by:me().email,date:new Date().toISOString().slice(0,10)});
  save("haven2_reports",l);e.target.reset();closeModal("reportOverlay");toast("Thanks - your report was submitted for review.");
};
function openAgreement(vid){
  const v=load(ukey("visits")).find(x=>x.id===vid),p=DATA.find(x=>x.id===v.pid);
  $("agr-vid").value=vid;$("agr-move").min=new Date().toISOString().slice(0,10);
  $("agr-summary").innerHTML=`<b>${esc(p.name)}</b><br>${esc(p.location)}<br>Monthly rent: <b>${money(p.price)}</b><br>House rules: ${esc(p.rules)}`;
  openModal("agreementOverlay");
}
$("agreementForm").onsubmit=e=>{
  e.preventDefault();const vid=+$("agr-vid").value,v=load(ukey("visits")).find(x=>x.id===vid),l=load(ukey("agr"));
  l.push({id:Date.now(),vid,pid:v.pid,move:$("agr-move").value,months:$("agr-term").value,date:new Date().toISOString().slice(0,10)});
  save(ukey("agr"),l);e.target.reset();closeModal("agreementOverlay");renderActivity();toast("Rental agreement submitted to the owner.");
};

/* ---------- MY ACTIVITY ---------- */
function renderActivity(){
  const box=$("activityBox");
  if(!me()){box.innerHTML=`<div class="empty">Log in to see your inquiries, visits and agreements.</div>`;return}
  const inq=load(ukey("inq")),vis=load(ukey("visits")),agr=load(ukey("agr"));
  const sec=(t,items,empty)=>`<h3 class="sub" style="margin-top:28px">${t}</h3>${items.length?items.join(""):`<div class="muted">${empty}</div>`}`;
  box.innerHTML=
    sec("Inquiries sent",inq.map(i=>`<div class="act-item"><div><b>${esc(pname(i.pid))}</b><div class="muted">${esc(i.msg)}</div></div><span class="status">Sent ${i.date}</span></div>`),"No inquiries yet.")+
    sec("Property visits",vis.map(v=>{const a=agr.find(x=>x.vid===v.id);return `<div class="act-item"><div><b>${esc(pname(v.pid))}</b><div class="muted">${v.date} at ${esc(v.time)}</div></div>${a?`<span class="status">Agreement submitted</span>`:`<button class="btn btn-brass btn-sm" onclick="openAgreement(${v.id})">Proceed to rental agreement</button>`}</div>`}),"No visits scheduled yet.")+
    sec("Rental agreements",agr.map(a=>`<div class="act-item"><div><b>${esc(pname(a.pid))}</b><div class="muted">Move-in ${a.move} · ${a.months} months</div></div><span class="status">Awaiting owner confirmation</span></div>`),"No agreements yet.");
}

renderAmenityRow();refresh();

/* close any popup with Esc or by clicking the dark area outside it */
document.querySelectorAll(".overlay").forEach(o=>o.addEventListener("mousedown",e=>{if(e.target===o)closeModal(o.id)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".overlay.show").forEach(o=>closeModal(o.id))});

document.querySelector("footer").textContent+=" · Google map v3";