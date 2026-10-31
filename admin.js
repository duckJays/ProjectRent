/* admin.js - property-owner submission + admin dashboard (DEMO, saved in this browser only).
   Load it AFTER app.js. Demo admin login: admin@haven.demo / admin123 */
const HV={};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const BASE=DATA.slice();                                   // listings from data.js
const ownerL=()=>load("haven2_owner_listings");
const removed=()=>load("haven2_removed");
const U=email=>users().find(u=>u.email===email);
const roleOf=()=>me()?.role||"renter";
const allL=()=>[...BASE.map(p=>({p,src:"Admin (data.js)",status:removed().includes(p.id)?"removed":"approved"})),...ownerL().map(p=>({p,src:"Owner: "+p.owner,status:p.status}))];
const lname=id=>allL().find(x=>x.p.id===id)?.p.name||"(deleted listing)";
const uname=e=>U(e)?.name||e;
const STAT={pending:"Pending admin review",approved:"Published",rejected:"Rejected",removed:"Removed"};
const chip=s=>`<span class="status st-${s}">${STAT[s]||s}</span>`;
function syncData(){DATA.length=0;BASE.filter(p=>!removed().includes(p.id)).forEach(p=>DATA.push(p));ownerL().filter(p=>p.status==="approved").forEach(p=>DATA.push(p))}
const readImg=(f,max)=>new Promise(res=>{if(!f.type.startsWith("image/"))return res(null);const r=new FileReader();
  r.onerror=()=>res(null);r.onload=()=>{const im=new Image();im.onerror=()=>res(null);im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");
  c.width=Math.max(1,im.width*k);c.height=Math.max(1,im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.72))};im.src=r.result};r.readAsDataURL(f)});
const countAll=k=>users().reduce((n,u)=>n+load(`haven2_${k}_${u.email}`).length,0);

/* demo admin account */
(function(){const l=users();if(!l.some(u=>u.role==="admin")){l.push({name:"Site Admin",email:"admin@haven.demo",mobile:"09000000000",pass:hash("admin123"),role:"admin"});put("haven2_users",l)}})();

/* styles, views, nav buttons */
document.head.insertAdjacentHTML("beforeend",`<style>
.tabrow{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.tabrow button{border:1px solid var(--line);background:var(--card);color:var(--ink-soft);border-radius:20px;padding:7px 16px;font-weight:600;font-size:.85rem}
.tabrow button.on{background:var(--teal);color:#fff;border-color:var(--teal)}
.statrow{display:flex;gap:14px;flex-wrap:wrap}.stat{flex:1;min-width:140px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:18px;color:var(--ink-soft);font-size:.85rem}
.stat b{display:block;font-size:1.7rem;font-family:'Fraunces',serif;color:var(--ink)}
.box{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:18px;margin-bottom:14px}
.tbl{width:100%;border-collapse:collapse;font-size:.88rem}.tbl th,.tbl td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line);vertical-align:top}.tbl th{color:var(--ink-soft)}
.st-pending{background:#F4E4CB;color:#8F631E}.st-rejected,.st-removed{background:#F6D9D1;color:#B4482F}
.thumbs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 10px}.thumbs img{height:64px;border-radius:8px;border:1px solid var(--line);cursor:zoom-in}.thumbs img.big{height:260px;cursor:zoom-out}
.chk{display:inline-flex;gap:6px;align-items:center;border:1px solid var(--line);border-radius:20px;padding:6px 12px;font-size:.82rem;color:var(--ink);margin:0 6px 6px 0}
.ra{display:flex;gap:6px;flex-wrap:wrap}.top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
</style>`);
document.querySelector("main").insertAdjacentHTML("beforeend",`<section id="view-owner" style="display:none"><div class="wrap" style="padding:32px 24px 48px;max-width:900px" id="ownerBox"></div></section>
<section id="view-admin" style="display:none"><div class="wrap" style="padding:32px 24px 48px;max-width:1000px" id="adminBox"></div></section>`);
const nav=document.querySelector(".navlinks");
nav.insertAdjacentHTML("beforeend",`<button data-view="owner">List your place</button><button data-view="admin" id="navAdmin" style="display:none">Admin</button>`);
nav.querySelectorAll('[data-view="owner"],[data-view="admin"]').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
$("registerForm").querySelector(".formgrid").insertAdjacentHTML("beforeend",`<div class="full"><label>I am a</label><select id="r-role" style="width:100%"><option value="renter">Renter - looking for a place</option><option value="owner">Property owner - I want to list a place</option></select></div>`);
$("loginForm").insertAdjacentHTML("beforeend",`<p class="muted" style="margin-top:12px">Demo admin: admin@haven.demo / admin123</p>`);
const _reg=$("registerForm").onsubmit;
$("registerForm").onsubmit=e=>{const email=$("r-email").value.trim().toLowerCase(),isNew=!U(email),r=$("r-role").value;_reg(e);
  if(isNew){const l=users(),u=l.find(x=>x.email===email);if(u&&!u.role){u.role=r;put("haven2_users",l);refresh()}}};

/* hook into app.js */
let oTab=null,aTab="overview";
const _refresh=refresh;
refresh=function(){_refresh();const u=me();if(!u){oTab=null;aTab="overview"}
  $("navAdmin").style.display=roleOf()==="admin"?"inline-block":"none";
  if(u&&u.role&&u.role!=="renter")$("whoami").textContent=u.name+" · "+(u.role==="admin"?"Admin":"Owner");
  if(view==="owner")ownerRender();if(view==="admin")adminRender()};
const _sv=switchView;
switchView=function(v){
  if(v==="owner"||v==="admin"){const u=me();
    if(!u){toast("Please log in first");openModal("authOverlay");return}
    if(v==="owner"&&u.role!=="owner"&&u.role!=="admin"){toast("Listing a place needs a Property owner account - register one and choose 'Property owner'.");return}
    if(v==="admin"&&u.role!=="admin"){toast("Admins only");return}
    ["browse","favorites","activity","owner","admin"].forEach(x=>$("view-"+x).style.display=x===v?"block":"none");
    document.querySelectorAll(".navlinks button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
    view=v;v==="owner"?ownerRender():adminRender();window.scrollTo(0,0);
  }else{$("view-owner").style.display="none";$("view-admin").style.display="none";_sv(v)}};

/* ================= PROPERTY OWNER ================= */
HV.otab=t=>{oTab=t;ownerRender()};
function ownerRender(){
  const u=me(),box=$("ownerBox");if(!u||(u.role!=="owner"&&u.role!=="admin")){box.innerHTML="";return}
  const mine=ownerL().filter(p=>p.ownerEmail===u.email);if(!oTab)oTab=mine.length?"listings":"submit";
  const tabs=[["listings",`My listings (${mine.length})`],["submit","Submit a property"],["received","Inquiries &amp; requests"]];
  box.innerHTML=`<h2 style="margin:0">Property owner</h2><div class="tabrow">${tabs.map(([k,l])=>`<button class="${oTab===k?"on":""}" onclick="HV.otab('${k}')">${l}</button>`).join("")}</div><div id="oBody"></div>`;
  ({listings:oListings,submit:oForm,received:oReceived})[oTab](mine);
}
function oListings(mine){
  $("oBody").innerHTML=mine.length?mine.map(p=>`<div class="box"><div class="top"><div><h3 style="margin:0">${esc(p.name)}</h3><div class="muted">${esc(p.location)} · ${money(p.price)} / month</div></div>${chip(p.status)}</div>
    ${p.status==="rejected"?`<p class="muted" style="color:var(--danger)">Admin note: ${esc(p.note)}</p>`:""}
    ${p.status==="pending"?`<p class="muted">Submitted ${new Date(p.submitted).toLocaleDateString()} - waiting for the admin to review your documents.</p>`:""}
    ${p.status==="approved"?`<p class="muted">Live on the site. Renters can now send you inquiries.</p>`:""}</div>`).join(""):`<div class="empty">You haven't submitted a property yet.</div>`;
}
function oForm(){
  const u=me();
  $("oBody").innerHTML=`<form id="ownForm" class="box"><p class="muted" style="margin-top:0">Every listing is reviewed by an admin before it goes live. Upload proof that you own or may rent out the property (title, tax declaration, ID, authorization letter).</p>
  <div class="formgrid">
  <div class="full"><label>Property name *</label><input required id="o-name"></div>
  <div><label>Location *</label><input required id="o-loc" placeholder="Street, barangay, city"></div>
  <div><label>Coordinates (from Google Maps, optional)</label><input id="o-coords" placeholder="14.6215, 121.0030"></div>
  <div><label>Monthly rent (₱) *</label><input required type="number" min="1" id="o-price"></div>
  <div><label>Property type</label><select id="o-type"><option>Apartment</option><option>Condo</option><option>Studio</option><option>House</option></select></div>
  <div><label>Max occupants</label><input type="number" min="1" value="1" id="o-occ"></div>
  <div><label>Available from</label><input type="date" id="o-avail"></div>
  <div><label>Contact number *</label><input required id="o-contact" value="${esc(u.mobile)}"></div>
  <div><label>Link to your website / listing post</label><input id="o-link" placeholder="https://"></div>
  <div class="full"><label>Amenities</label>${AMENITY_LIST.map(a=>`<label class="chk"><input type="checkbox" name="oam" value="${a}"> ${a}</label>`).join("")}</div>
  <div class="full"><label>Details / description *</label><textarea required id="o-desc" rows="3"></textarea></div>
  <div class="full"><label>Landmarks, nearby schools &amp; establishments (one per line)</label><textarea id="o-lm" rows="3" placeholder="Ateneo de Manila University - 5 min walk"></textarea></div>
  <div class="full"><label>House rules</label><textarea id="o-rules" rows="2"></textarea></div>
  <div class="full"><label>Photos * (up to 5)</label><input type="file" id="o-photos" accept="image/*" multiple></div>
  <div class="full"><label>Verification documents * (image or PDF)</label><input type="file" id="o-docs" accept="image/*,.pdf" multiple></div></div>
  <button class="btn btn-brass" id="o-submit" type="submit" style="margin-top:14px">Submit for admin review</button></form>`;
  $("ownForm").onsubmit=async e=>{
    e.preventDefault();const btn=$("o-submit"),reset=()=>{btn.disabled=false;btn.textContent="Submit for admin review"};
    const ph=[...$("o-photos").files].slice(0,5),dc=[...$("o-docs").files].slice(0,5);
    if(!ph.length||!dc.length)return toast("Please add at least 1 photo and 1 verification document");
    btn.disabled=true;btn.textContent="Uploading...";
    const photos=(await Promise.all(ph.map(f=>readImg(f,900)))).filter(Boolean);
    const docs=await Promise.all(dc.map(async f=>({name:f.name,data:await readImg(f,700)})));
    if(!photos.length){reset();return toast("Photos must be image files (JPG or PNG)")}
    const m=($("o-coords").value.match(/-?\d+(\.\d+)?/g)||[]).map(Number),lk=$("o-link").value.trim();
    const L={id:Date.now(),name:$("o-name").value.trim(),location:$("o-loc").value.trim(),lat:m.length>=2?m[0]:null,lng:m.length>=2?m[1]:null,
      price:+$("o-price").value,type:$("o-type").value,occupants:+$("o-occ").value||1,amenities:[...document.querySelectorAll("[name=oam]:checked")].map(x=>x.value),
      rules:$("o-rules").value.trim()||"None specified.",availability:$("o-avail").value||"Ask owner",owner:u.name,contact:$("o-contact").value.trim(),
      description:$("o-desc").value.trim(),landmarks:$("o-lm").value.split("\n").map(s=>s.trim()).filter(Boolean),link:lk==="https://"?"":lk,
      photos,docs,ownerEmail:u.email,status:"pending",submitted:Date.now(),note:""};
    const l=ownerL();l.push(L);
    if(!put("haven2_owner_listings",l)){reset();return toast("Browser storage is full - try fewer or smaller photos")}
    oTab="listings";toast("Submitted! Your listing is pending admin review.");ownerRender();
  };
}
function received(pids){const out=[];
  users().forEach(u=>[["inq","Inquiry"],["visits","Visit request"],["agr","Rental agreement"]].forEach(([k,label])=>load(`haven2_${k}_${u.email}`).forEach(x=>{if(pids.includes(x.pid))out.push({t:x.id||0,label,u,x,k})})));
  return out.sort((a,b)=>b.t-a.t)}
function oReceived(mine){
  const r=received(mine.map(p=>p.id));
  $("oBody").innerHTML=r.length?r.map(({label,u,x,k})=>`<div class="box"><div class="top"><div><b>${label}</b> · ${esc(lname(x.pid))}<div class="muted">From ${esc(u.name)} · ${esc(u.email)} · ${esc(u.mobile||"")}</div></div><span class="status">${x.date||""}</span></div>
    <p style="margin:8px 0 0">${k==="inq"?esc(x.msg):k==="visits"?`Wants to visit on ${esc(x.date)} at ${esc(x.time)}`:`Move-in ${esc(x.move)} · ${esc(x.months)} months`}</p></div>`).join(""):
    `<div class="empty">No inquiries yet. Once your listing is approved, renter messages, visit requests and agreements show up here.</div>`;
}

/* ================= ADMIN ================= */
function afterAdmin(msg){syncData();renderGrid();adminRender();toast(msg)}
function setStatus(id,st,note){const l=ownerL(),p=l.find(x=>x.id===id);if(!p)return;p.status=st;p.reviewed=Date.now();if(note!==undefined)p.note=note;put("haven2_owner_listings",l);afterAdmin("Listing "+(STAT[st]||st).toLowerCase())}
function doRemove(id){if(BASE.some(p=>p.id===id)){const r=removed();r.push(id);put("haven2_removed",r);afterAdmin("Listing removed")}else setStatus(id,"removed")}
HV.approve=id=>setStatus(id,"approved","");
HV.reject=id=>{const n=prompt("Reason for rejection (the owner will see this):");if(n===null)return;setStatus(id,"rejected",n.trim()||"Does not meet listing requirements.")};
HV.remove=id=>{if(confirm("Remove this listing from the site?"))doRemove(id)};
HV.restore=id=>{if(BASE.some(p=>p.id===id)){put("haven2_removed",removed().filter(x=>x!==id));afterAdmin("Listing restored")}else setStatus(id,"approved","")};
HV.rep=(i,st)=>{const r=load("haven2_reports");r[i].status=st;put("haven2_reports",r);adminRender();toast("Report "+st)};
HV.repRemove=i=>{if(!confirm("Remove the reported listing from the site?"))return;const r=load("haven2_reports");r[i].status="resolved";put("haven2_reports",r);doRemove(r[i].pid)};
HV.rmUser=i=>{const l=users(),u=l[i];if(!u||u.role==="admin"||!confirm(`Remove ${u.name}'s account and their activity?`))return;
  ["favs","inq","visits","agr"].forEach(k=>localStorage.removeItem(`haven2_${k}_${u.email}`));
  const ol=ownerL();ol.forEach(p=>{if(p.ownerEmail===u.email)p.status="removed"});put("haven2_owner_listings",ol);
  put("haven2_users",l.filter((_,k)=>k!==i));afterAdmin("User removed")};
HV.atab=t=>{aTab=t;adminRender()};
function adminRender(){
  const box=$("adminBox");if(roleOf()!=="admin"){box.innerHTML="";return}
  const pend=ownerL().filter(p=>p.status==="pending"),reps=load("haven2_reports"),open=reps.filter(r=>!r.status).length;
  const tabs=[["overview","Overview"],["pending",`Pending (${pend.length})`],["listings","All listings"],["reports",`Reports (${open})`],["users","Users"],["activity","Activity"]];
  box.innerHTML=`<h2 style="margin:0">Admin dashboard</h2><div class="tabrow">${tabs.map(([k,l])=>`<button class="${aTab===k?"on":""}" onclick="HV.atab('${k}')">${l}</button>`).join("")}</div><div id="aBody"></div>`;
  ({overview:aOverview,pending:aPending,listings:aListings,reports:aReports,users:aUsers,activity:aActivity})[aTab](pend,reps);
}
function aOverview(pend,reps){
  const A=allL(),us=users();
  $("aBody").innerHTML=`<div class="statrow">${[[A.filter(x=>x.status==="approved").length,"Live listings"],[pend.length,"Awaiting review"],[us.length,"Registered users"],[us.filter(u=>u.role==="owner").length,"Property owners"],
    [countAll("inq"),"Inquiries sent"],[countAll("visits"),"Visits requested"],[countAll("agr"),"Agreements"],[reps.filter(r=>!r.status).length,"Open reports"]].map(([n,l])=>`<div class="stat"><b>${n}</b>${l}</div>`).join("")}</div>
    <p class="muted" style="margin-top:16px">Use <b>Pending</b> to approve or reject owner submissions, <b>Reports</b> to handle flagged listings, and <b>Activity</b> to see what's happening on the site.</p>`;
}
function aPending(pend){
  $("aBody").innerHTML=pend.length?pend.map(p=>`<div class="box"><div class="top"><div><h3 style="margin:0">${esc(p.name)}</h3><div class="muted">${esc(p.location)} · ${money(p.price)} · ${esc(p.type)} · up to ${p.occupants}</div>
    <div class="muted">Owner: ${esc(p.owner)} (${esc(p.ownerEmail)}) · ${esc(p.contact)}</div></div>
    <div class="ra"><button class="btn btn-teal btn-sm" onclick="HV.approve(${p.id})">Approve</button><button class="btn btn-danger btn-sm" onclick="HV.reject(${p.id})">Reject</button></div></div>
    <p>${esc(p.description)}</p><div class="muted">Photos (click to enlarge)</div><div class="thumbs">${p.photos.map(s=>`<img src="${esc(s)}" alt="" onclick="this.classList.toggle('big')">`).join("")}</div>
    <div class="muted">Verification documents</div><div class="thumbs">${p.docs.map(d=>d.data?`<img src="${esc(d.data)}" alt="${esc(d.name)}" title="${esc(d.name)}" onclick="this.classList.toggle('big')">`:`<span class="pill">📄 ${esc(d.name)}</span>`).join("")}</div></div>`).join(""):
    `<div class="empty">Nothing waiting for review.</div>`;
}
function aListings(){
  $("aBody").innerHTML=`<div class="box" style="overflow-x:auto"><table class="tbl"><tr><th>Listing</th><th>Source</th><th>Rent</th><th>Status</th><th></th></tr>${allL().map(({p,src,status})=>`<tr><td>${esc(p.name)}<div class="muted">${esc(p.location)}</div></td><td>${esc(src)}</td><td>${money(p.price)}</td><td>${chip(status)}</td>
    <td>${status==="approved"?`<button class="btn btn-danger btn-sm" onclick="HV.remove(${p.id})">Remove</button>`:status==="removed"?`<button class="btn btn-ghost btn-sm" onclick="HV.restore(${p.id})">Restore</button>`:status==="pending"?`<button class="btn btn-ghost btn-sm" onclick="HV.atab('pending')">Review</button>`:""}</td></tr>`).join("")}</table></div>`;
}
function aReports(_,reps){
  $("aBody").innerHTML=reps.length?`<div class="box" style="overflow-x:auto"><table class="tbl"><tr><th>Listing</th><th>Reason</th><th>Reported by</th><th>Status</th><th></th></tr>${reps.map((r,i)=>`<tr><td>${esc(lname(r.pid))}</td><td>${esc(r.reason)}<div class="muted">${esc(r.details||"")}</div></td><td>${esc(uname(r.by))}<div class="muted">${esc(r.date)}</div></td>
    <td>${r.status?`<span class="status">${esc(r.status)}</span>`:`<span class="status st-pending">Open</span>`}</td>
    <td>${r.status?"":`<div class="ra"><button class="btn btn-danger btn-sm" onclick="HV.repRemove(${i})">Remove listing</button><button class="btn btn-ghost btn-sm" onclick="HV.rep(${i},'resolved')">Resolve</button><button class="btn btn-ghost btn-sm" onclick="HV.rep(${i},'dismissed')">Dismiss</button></div>`}</td></tr>`).join("")}</table></div>`:`<div class="empty">No reports yet.</div>`;
}
function aUsers(){
  $("aBody").innerHTML=`<div class="box" style="overflow-x:auto"><table class="tbl"><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th><th></th></tr>${users().map((u,i)=>`<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.mobile||"")}</td><td>${esc(u.role||"renter")}</td>
    <td>${u.role==="admin"?"":`<button class="btn btn-danger btn-sm" onclick="HV.rmUser(${i})">Remove</button>`}</td></tr>`).join("")}</table></div>`;
}
function aActivity(){
  const ev=[];
  users().forEach(u=>{[["inq","sent an inquiry about"],["visits","requested a visit to"],["agr","submitted a rental agreement for"]].forEach(([k,t])=>load(`haven2_${k}_${u.email}`).forEach(x=>ev.push({t:x.id,s:`${u.name} ${t} <b>${esc(lname(x.pid))}</b>`})))});
  load("haven2_reports").forEach(r=>ev.push({t:Date.parse(r.date)||0,s:`${esc(uname(r.by))} reported <b>${esc(lname(r.pid))}</b> (${esc(r.reason)})`}));
  ownerL().forEach(p=>{ev.push({t:p.submitted,s:`${esc(p.owner)} submitted <b>${esc(p.name)}</b> for review`});if(p.reviewed)ev.push({t:p.reviewed,s:`Admin set <b>${esc(p.name)}</b> to ${(STAT[p.status]||p.status).toLowerCase()}`})});
  ev.sort((a,b)=>b.t-a.t);
  $("aBody").innerHTML=ev.length?ev.slice(0,40).map(e=>`<div class="box" style="padding:12px 16px"><span class="muted">${e.t?new Date(e.t).toLocaleString():""}</span><div>${e.s}</div></div>`).join(""):`<div class="empty">No activity yet.</div>`;
}

syncData();refresh();
