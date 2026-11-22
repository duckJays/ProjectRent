/* paper.js - changes that make the site match the DormNook paper. Load LAST (after pages.js).
   Adds: accommodation types, deposits, featured listings (P199/month), occupied/available toggle,
   disclaimer, and paper-accurate FAQ + support hours. */
(function(){
const TYPES=["Dormitory","Boarding house","Bedspace","Private room","Apartment"];
const ALIAS={dorm:"Dormitory",dormitory:"Dormitory","boarding house":"Boarding house",boardinghouse:"Boarding house",bedspace:"Bedspace","bed space":"Bedspace","private room":"Private room",room:"Private room",apartment:"Apartment"};
const normType=t=>ALIAS[String(t||"").trim().toLowerCase()]||t;
const NOTE="DormNook is an information and rental-search service. It does not process rental payments or guarantee the legitimacy, safety, or availability of every property. Please verify property details and rental agreements directly with the property owner.";
const PN=window.PN={};
const saveOwner=l=>put("haven2_owner_listings",l);

/* keep the extra data.js fields that the base code drops (deposit, featured, occupied) */
BASE.forEach(p=>{const r=(typeof LISTINGS!=="undefined"?LISTINGS:[]).find(x=>x.id===p.id)||{};p.deposit=r.deposit;p.featured=!!r.featured;p.occupied=!!r.occupied;p.type=normType(p.type)});

/* hide occupied listings, float featured ones to the top, keep the type filter in sync */
function refreshTypes(){
  const sel=$("f-type");if(!sel)return;const cur=sel.value;
  const extra=[...new Set([...BASE,...ownerL()].map(p=>p.type))].filter(t=>t&&!TYPES.includes(t));
  sel.innerHTML=`<option value="">Any type</option>`+[...TYPES,...extra].map(t=>`<option>${esc(t)}</option>`).join("");sel.value=cur;
}
const _sync=syncData;
syncData=function(){_sync();
  for(let i=DATA.length-1;i>=0;i--){const p=DATA[i];p._feat=!!p.featured&&(!p.featUntil||p.featUntil>Date.now());if(p.occupied)DATA.splice(i,1)}
  DATA.sort((a,b)=>(b._feat?1:0)-(a._feat?1:0));refreshTypes()};
const lbl=$("f-type").parentElement.querySelector("label");if(lbl)lbl.textContent="Accommodation type";

/* cards: featured badge */
const _card=cardHTML;
cardHTML=function(p){let h=_card(p);
  if(p._feat)h=h.replace('<span class="type-badge">','<span class="type-badge" style="background:#B9812E;margin-right:6px">★ Featured</span><span class="type-badge">');return h};

/* listing page: deposit + featured tag + disclaimer */
const _od=openDetail;
openDetail=function(id){_od(id);const p=DATA.find(x=>x.id===id);if(!p)return;const b=$("detailBody"),d=p.deposit;
  const n=(d===undefined||d===null||d==="")?null:Number(d);
  const dep=n===null?"Ask the owner":isNaN(n)?esc(d):n>0?money(n):"No deposit";
  const pr=b.querySelector(".price");
  if(pr)pr.insertAdjacentHTML("afterend",`<div class="muted" style="margin:-2px 0 8px">Deposit: <b style="color:var(--ink)">${dep}</b></div>`+(p._feat?`<span class="status st-pending">★ Featured listing</span>`:""));
  const ac=b.querySelector(".actions");
  if(ac)ac.insertAdjacentHTML("beforebegin",`<p class="muted" style="background:var(--teal-soft);border-radius:10px;padding:10px 12px;margin:16px 0 0;font-size:.82rem">${NOTE}</p>`)};
$("agr-summary").insertAdjacentHTML("afterend",`<p class="muted" style="font-size:.82rem;margin:0 0 12px">${NOTE}</p>`);

/* owner form: paper's types, deposit field, PUP hint */
const _of=oForm;
oForm=function(){_of();
  $("o-type").innerHTML=TYPES.map(x=>`<option>${x}</option>`).join("");
  const tl=$("o-type").previousElementSibling;if(tl)tl.textContent="Accommodation type";
  $("o-price").parentElement.insertAdjacentHTML("afterend",`<div><label>Deposit (₱, enter 0 if none)</label><input type="number" min="0" id="o-deposit" value="0"></div>`);
  $("o-lm").placeholder="Include the distance to PUP Sta. Mesa, e.g. PUP Sta. Mesa - 10 min walk";
  const h=$("ownForm").onsubmit;
  $("ownForm").onsubmit=async e=>{const dv=$("o-deposit").value,before=ownerL().length;await h(e);
    const l=ownerL();if(l.length>before){l[l.length-1].deposit=dv===""?0:+dv;saveOwner(l)}}};

/* owner dashboard: occupied/available + featured request */
PN.occ=id=>{const l=ownerL(),p=l.find(x=>x.id===id);if(!p)return;p.occupied=!p.occupied;saveOwner(l);syncData();renderGrid();ownerRender();
  toast(p.occupied?"Marked as occupied - hidden from search":"Marked as available - visible again")};
PN.reqFeat=id=>{if(!confirm("Featured placement is ₱199 per month. DormNook will contact you to arrange payment, then place your listing at the top of the search results. Send the request?"))return;
  const l=ownerL(),p=l.find(x=>x.id===id);if(!p)return;p.featReq=Date.now();saveOwner(l);ownerRender();toast("Request sent. The admin will confirm it.")};
oListings=function(mine){
  $("oBody").innerHTML=mine.length?mine.map(p=>{
    const feat=p.featured&&p.featUntil>Date.now();
    return `<div class="box"><div class="top"><div><h3 style="margin:0">${esc(p.name)}</h3><div class="muted">${esc(p.location)} · ${esc(p.type)} · ${money(p.price)} / month</div></div>
      <div class="ra">${p.occupied?`<span class="status st-removed">Occupied</span>`:""}${feat?`<span class="status st-pending">★ Featured until ${new Date(p.featUntil).toLocaleDateString()}</span>`:""}${chip(p.status)}</div></div>
      ${p.status==="rejected"?`<p class="muted" style="color:var(--danger)">Admin note: ${esc(p.note)}</p>`:""}
      ${p.status==="pending"?`<p class="muted">Submitted ${new Date(p.submitted).toLocaleDateString()} - waiting for the admin to review your listing.</p>`:""}
      ${p.status==="approved"?`<p class="muted">${p.occupied?"Hidden from search while marked occupied.":"Live on the site. Renters can send you inquiries."}</p>
      <div class="ra"><button class="btn btn-ghost btn-sm" onclick="PN.occ(${p.id})">${p.occupied?"Mark as available":"Mark as occupied"}</button>
      ${feat?"":p.featReq?`<span class="status st-pending">Featured request sent</span>`:`<button class="btn btn-teal btn-sm" onclick="PN.reqFeat(${p.id})">Request featured placement (₱199/month)</button>`}</div>`:""}</div>`}).join(""):
    `<div class="empty">You haven't submitted a property yet.</div>`};

/* admin: confirm featured requests, see featured revenue */
const act=(id,fn,msg)=>{const l=ownerL(),p=l.find(x=>x.id===id);if(!p)return;fn(p);saveOwner(l);syncData();renderGrid();adminRender();toast(msg)};
PN.featOk=id=>act(id,p=>{p.featured=true;p.featUntil=Date.now()+30*864e5;p.featReq=null},"Listing featured for 30 days");
PN.featNo=id=>act(id,p=>{p.featReq=null},"Request declined");
PN.featOff=id=>act(id,p=>{p.featured=false},"Featured placement removed");
const _ap=aPending;
aPending=function(pend){_ap(pend);
  const req=ownerL().filter(p=>p.featReq&&!p.featured&&p.status==="approved"),on=ownerL().filter(p=>p.featured&&p.featUntil>Date.now());
  $("aBody").insertAdjacentHTML("beforeend",`<h3 style="margin:26px 0 10px">Featured listing requests (₱199/month)</h3>`+
    (req.length?req.map(p=>`<div class="box top"><div><b>${esc(p.name)}</b><div class="muted">${esc(p.owner)} · ${esc(p.contact)}</div></div><div class="ra"><button class="btn btn-teal btn-sm" onclick="PN.featOk(${p.id})">Payment received - feature for 30 days</button><button class="btn btn-ghost btn-sm" onclick="PN.featNo(${p.id})">Decline</button></div></div>`).join(""):`<div class="muted">No requests.</div>`)+
    (on.length?`<h3 style="margin:22px 0 10px">Currently featured</h3>`+on.map(p=>`<div class="box top"><div><b>${esc(p.name)}</b><div class="muted">Until ${new Date(p.featUntil).toLocaleDateString()}</div></div><button class="btn btn-ghost btn-sm" onclick="PN.featOff(${p.id})">Remove featured</button></div>`).join(""):""))};
const _ao=aOverview;
aOverview=function(pend,reps){_ao(pend,reps);
  const n=DATA.filter(p=>p._feat&&p.featUntil).length,row=$("aBody").querySelector(".statrow");
  if(row)row.insertAdjacentHTML("beforeend",`<div class="stat"><b>${n}</b>Paid featured listings</div><div class="stat"><b>₱${(n*199).toLocaleString()}</b>Featured revenue / month</div>`)};

/* contact page: paper-accurate support hours + FAQ */
(function(){
  document.querySelectorAll("#view-contact .crow").forEach(r=>{const b=r.querySelector("b");
    if(b&&b.textContent==="Office hours"){const t=b.parentElement.lastChild;if(t&&/Monday to Friday, 9:00 AM - 5:00 PM/.test(t.textContent))t.textContent="Customer support: Monday to Saturday, 8:00 AM - 5:00 PM"}});
  const faq=document.querySelector("#view-contact .faq");if(!faq)return;
  faq.querySelectorAll("details").forEach(d=>{const s=d.querySelector("summary");
    if(s&&/real/.test(s.textContent)){s.textContent="How are listings reviewed?";d.querySelector("p").textContent="Owners submit property details and photos. DormNook reviews them for completeness before publishing. This review does not guarantee that a property is legitimate or safe, so please verify details and agreements directly with the owner."}});
  faq.insertAdjacentHTML("beforeend",`<details><summary>Does DormNook process rental payments?</summary><p>No. DormNook is an information and rental-search service. Arrange rental payments and agreements directly with the property owner.</p></details>`);
})();

syncData();renderGrid();
if(typeof view!=="undefined"&&view==="owner")ownerRender();
})();
