const AMENITY_LIST=["WiFi","Parking","Aircon","Pet-friendly","Pool","Furnished","Security","Elevator"];
const GRADIENTS=["linear-gradient(135deg,#3E6B62,#8FB8AC)","linear-gradient(135deg,#B9812E,#E3C48A)","linear-gradient(135deg,#8F631E,#D9A55C)","linear-gradient(135deg,#17242F,#3E6B62)","linear-gradient(135deg,#B4482F,#E39C7F)","linear-gradient(135deg,#5B6B76,#B7C4C9)"];

function seed(){
  if(localStorage.getItem('haven_seeded'))return;
  const props=[
    {id:1,name:"Sunridge Studio",loc:"Makati City",price:18000,type:"Studio",occ:1,amen:["WiFi","Aircon","Security"],rules:"No smoking. No pets.",avail:"2026-10-01",contact:"0917-111-2222",desc:"Compact studio near the CBD, perfect for a young professional. Bright, quiet, and freshly repainted.",status:"approved",owner:"Lena Cruz",x:34,y:52},
    {id:2,name:"Palm Court 2BR",loc:"Quezon City",price:25000,type:"Apartment",occ:4,amen:["Parking","Aircon","Pet-friendly","Furnished"],rules:"Max 4 occupants. Pets under 15kg allowed.",avail:"2026-11-15",contact:"0917-333-4444",desc:"Spacious two-bedroom unit with a small balcony, close to schools and the market.",status:"approved",owner:"Rafael Tan",x:58,y:30},
    {id:3,name:"Marina View Condo",loc:"Pasay City",price:32000,type:"Condo",occ:3,amen:["Pool","Security","Elevator","Furnished","WiFi"],rules:"No overnight guests without notice.",avail:"2026-10-20",contact:"0917-555-6666",desc:"High-floor unit with partial bay views, fully furnished, walking distance to the mall.",status:"approved",owner:"Ana Dizon",x:22,y:70},
    {id:4,name:"Greenfield House",loc:"Antipolo City",price:22000,type:"House",occ:5,amen:["Parking","Pet-friendly","Aircon"],rules:"Family tenants preferred. No parties.",avail:"2026-12-01",contact:"0917-777-8888",desc:"A quiet two-storey house with a small yard, ideal for a family, 10 minutes from the highway.",status:"approved",owner:"Marco Reyes",x:75,y:44},
    {id:5,name:"Boho Loft",loc:"Taguig City",price:27000,type:"Apartment",occ:2,amen:["WiFi","Furnished","Elevator"],rules:"Couples or professionals only.",avail:"2026-10-10",contact:"0917-999-0000",desc:"Loft-style unit with high ceilings near BGC, great natural light in the afternoon.",status:"approved",owner:"Iris Santos",x:64,y:60},
    {id:6,name:"Riverside Studio",loc:"Marikina City",price:14000,type:"Studio",occ:1,amen:["Aircon","Security"],rules:"No pets.",avail:"2026-10-05",contact:"0917-222-3333",desc:"Budget-friendly studio a short walk from the river park, quiet residential street.",status:"approved",owner:"Ben Alonzo",x:47,y:20}
  ];
  localStorage.setItem('haven_properties',JSON.stringify(props));
  localStorage.setItem('haven_favorites',JSON.stringify([]));
  localStorage.setItem('haven_inquiries',JSON.stringify([]));
  localStorage.setItem('haven_reports',JSON.stringify([]));
  localStorage.setItem('haven_users',JSON.stringify([{name:"Demo Renter",email:"renter@demo.com",mobile:"0900-000-0001"}]));
  localStorage.setItem('haven_seeded','1');
}
function load(k){try{return JSON.parse(localStorage.getItem(k))||[];}catch(e){return [];}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
seed();
let selectedAmenities=[];
let currentUser=null; // {name, email, mobile}
let currentView='browse';

function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);}
function openModal(id){document.getElementById(id).classList.add('show');}
function closeModal(id){document.getElementById(id).classList.remove('show');}

/* --- amenity chips --- */
function renderAmenityRow(){
  const row=document.getElementById('amenityRow');
  row.innerHTML=AMENITY_LIST.map(a=>`<button class="chip ${selectedAmenities.includes(a)?'on':''}" data-a="${a}">${a}</button>`).join('');
  row.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{
    const a=c.dataset.a;
    selectedAmenities=selectedAmenities.includes(a)?selectedAmenities.filter(x=>x!==a):[...selectedAmenities,a];
    renderAmenityRow();renderGrid();
  });
}

/* --- nav --- */
document.querySelectorAll('.navlinks button[data-view]').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
function switchView(v){
  currentView=v;
  document.querySelectorAll('.navlinks button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  ['browse','favorites'].forEach(x=>document.getElementById('view-'+x).style.display=x===v?'block':'none');
  if(v==='favorites')renderFavGrid();
  window.scrollTo({top:0,behavior:'instant'});
}

/* --- auth --- */
document.getElementById('authBtn').onclick=()=>openModal('authOverlay');
document.querySelectorAll('#authOverlay .tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#authOverlay .tabs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById('loginForm').style.display=b.dataset.tab==='login'?'block':'none';
  document.getElementById('registerForm').style.display=b.dataset.tab==='register'?'block':'none';
});
document.getElementById('loginForm').onsubmit=e=>{
  e.preventDefault();
  const email=document.getElementById('l-email').value;
  const users=load('haven_users');
  const match=users.find(u=>u.email.toLowerCase()===email.toLowerCase());
  currentUser=match||{name:email.split('@')[0],email};
  updateWhoAmI();closeModal('authOverlay');e.target.reset();toast('Welcome back, '+currentUser.name+'!');
};
document.getElementById('registerForm').onsubmit=e=>{
  e.preventDefault();
  const name=document.getElementById('r-name').value,email=document.getElementById('r-email').value,mobile=document.getElementById('r-mobile').value;
  const users=load('haven_users');users.push({name,email,mobile});save('haven_users',users);
  currentUser={name,email,mobile};
  updateWhoAmI();closeModal('authOverlay');e.target.reset();toast('Account created — welcome, '+name+'!');
};
function updateWhoAmI(){
  document.getElementById('whoami').textContent=currentUser?currentUser.name:'';
  document.getElementById('authBtn').textContent=currentUser?'Log out':'Log in';
}
document.getElementById('authBtn').addEventListener('click',()=>{
  if(currentUser){currentUser=null;updateWhoAmI();switchView('browse');toast('Logged out');}
});

/* --- browse / filter --- */
function matchesFilter(p){
  const loc=document.getElementById('f-location').value.trim().toLowerCase();
  const price=parseFloat(document.getElementById('f-price').value);
  const type=document.getElementById('f-type').value;
  const occ=document.getElementById('f-occ').value;
  if(p.status!=='approved')return false;
  if(loc&&!p.loc.toLowerCase().includes(loc))return false;
  if(price&&p.price>price)return false;
  if(type&&p.type!==type)return false;
  if(occ&&p.occ<parseInt(occ))return false;
  if(selectedAmenities.length&&!selectedAmenities.every(a=>p.amen.includes(a)))return false;
  return true;
}
function cardHTML(p,i){
  const favs=load('haven_favorites');
  const isFav=favs.includes(p.id);
  return `<div class="card">
    <div class="photo" style="background:${GRADIENTS[i%GRADIENTS.length]}">
      <span class="type-badge">${p.type}</span>
      <button class="fav-btn ${isFav?'saved':''}" onclick="toggleFav(${p.id})">${isFav?'♥':'♡'}</button>
    </div>
    <div class="card-body">
      <h3>${p.name}</h3>
      <div class="loc">📍 ${p.loc} · up to ${p.occ} occupant${p.occ>1?'s':''}</div>
      <div class="price">₱${p.price.toLocaleString()} / month</div>
      <div class="card-foot">
        <button class="btn btn-ghost btn-sm" onclick="openDetail(${p.id})">View listing</button>
        ${p.status!=='approved'?'<span class="pending-tag">Pending review</span>':''}
      </div>
    </div>
  </div>`;
}
function renderGrid(){
  const props=load('haven_properties').filter(matchesFilter);
  document.getElementById('grid').innerHTML=props.length?props.map((p,i)=>cardHTML(p,i)).join(''):'<div class="empty">No rentals match those filters yet. Try widening your search.</div>';
  document.getElementById('listCount').textContent=props.length+' found';
}
document.getElementById('searchBtn').onclick=renderGrid;
['f-location','f-price','f-type','f-occ'].forEach(id=>document.getElementById(id).addEventListener('input',()=>{}));

function toggleFav(id){
  let favs=load('haven_favorites');
  favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];
  save('haven_favorites',favs);
  renderGrid();if(currentView==='favorites')renderFavGrid();
  if(document.getElementById('detailOverlay').classList.contains('show'))openDetail(id,true);
}
function renderFavGrid(){
  const favs=load('haven_favorites');
  const props=load('haven_properties').filter(p=>favs.includes(p.id));
  document.getElementById('favGrid').innerHTML=props.length?props.map((p,i)=>cardHTML(p,i)).join(''):'<div class="empty">You haven\'t saved any properties yet. Tap the heart on a listing to save it here.</div>';
  document.getElementById('favCount').textContent=props.length+' saved';
}

/* --- detail modal with map --- */
function openDetail(id){
  const p=load('haven_properties').find(x=>x.id===id);
  if(!p)return;
  const favs=load('haven_favorites');const isFav=favs.includes(id);
  document.getElementById('detailBody').innerHTML=`
    <button class="modal-close" onclick="closeModal('detailOverlay')">✕</button>
    <div class="detail-photo" style="background:${GRADIENTS[id%GRADIENTS.length]};display:flex;align-items:flex-end;padding:14px">
      <span class="type-badge" style="background:rgba(23,36,47,.6);color:#fff;padding:5px 12px;border-radius:20px;font-size:.78rem">${p.type}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
      <h2 style="margin:0 0 4px">${p.name}</h2>
      <button class="fav-btn ${isFav?'saved':''}" style="position:static" onclick="toggleFav(${p.id})">${isFav?'♥':'♡'}</button>
    </div>
    <div class="loc">📍 ${p.loc}</div>
    <div class="price" style="margin:8px 0">₱${p.price.toLocaleString()} / month</div>
    <p>${p.desc}</p>
    <h3 style="font-size:1rem;margin-bottom:4px">Amenities</h3>
    <div class="pillrow">${p.amen.map(a=>`<span class="pill">${a}</span>`).join('')}</div>
    <h3 style="font-size:1rem;margin-bottom:4px">House rules</h3>
    <p style="color:var(--ink-soft);font-size:.9rem">${p.rules||'None specified.'}</p>
    <h3 style="font-size:1rem;margin-bottom:4px">Availability</h3>
    <p style="color:var(--ink-soft);font-size:.9rem">Available from ${p.avail}</p>
    <h3 style="font-size:1rem;margin-bottom:4px">Approximate location</h3>
    <div class="mapbox">${mapSVG(p.x,p.y)}</div>
    <h3 style="font-size:1rem;margin-bottom:4px">Contact</h3>
    <p style="color:var(--ink-soft);font-size:.9rem">${p.owner} · ${p.contact}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
      <button class="btn btn-brass" onclick="openInquiry(${p.id})">Send inquiry</button>
      <button class="btn btn-ghost btn-sm" onclick="openReport(${p.id})">Report this listing</button>
    </div>`;
  openModal('detailOverlay');
}
function mapSVG(x,y){
  return `<svg viewBox="0 0 400 180" width="100%" height="180" style="display:block;background:var(--teal-soft)">
    <g stroke="var(--line)" stroke-width="2">
      <line x1="0" y1="60" x2="400" y2="60"/><line x1="0" y1="120" x2="400" y2="120"/>
      <line x1="90" y1="0" x2="90" y2="180"/><line x1="230" y1="0" x2="230" y2="180"/><line x1="320" y1="0" x2="320" y2="180"/>
    </g>
    <circle cx="${x/100*400}" cy="${y/100*180}" r="9" fill="var(--danger)" stroke="#fff" stroke-width="2"/>
    <circle cx="${x/100*400}" cy="${y/100*180}" r="16" fill="var(--danger)" opacity=".25"/>
  </svg>`;
}

/* --- inquiry --- */
function openInquiry(id){document.getElementById('inq-pid').value=id;openModal('inquiryOverlay');}
document.getElementById('inquiryForm').onsubmit=e=>{
  e.preventDefault();
  const inquiries=load('haven_inquiries');
  inquiries.push({pid:+document.getElementById('inq-pid').value,name:document.getElementById('inq-name').value,email:document.getElementById('inq-email').value,msg:document.getElementById('inq-msg').value,date:new Date().toISOString()});
  save('haven_inquiries',inquiries);
  e.target.reset();closeModal('inquiryOverlay');toast('Inquiry sent to the owner!');
};

/* --- report --- */
function openReport(id){document.getElementById('rep-pid').value=id;openModal('reportOverlay');}
document.getElementById('reportForm').onsubmit=e=>{
  e.preventDefault();
  const reports=load('haven_reports');
  reports.push({pid:+document.getElementById('rep-pid').value,reason:document.getElementById('rep-reason').value,details:document.getElementById('rep-details').value,date:new Date().toISOString(),resolved:false});
  save('haven_reports',reports);
  e.target.reset();closeModal('reportOverlay');toast('Thanks — our team will review this listing.');
};

/* Property owner submission and admin dashboard land in a later phase */

/* init */
renderAmenityRow();renderGrid();updateWhoAmI();
