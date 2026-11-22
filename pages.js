/* pages.js - "About Us" and "Contact" pages for DormNook. Load AFTER app.js and admin.js.
   >>> EDIT YOUR REAL CONTACT DETAILS in the CONTACT block below. <<< */
(function(){
const CONTACT={
  email:"dormnook@email.com",
  phone:"0900-000-0000",
  facebook:"facebook.com/dormnook",
  address:"PUP Sta. Mesa",
  hours:"Monday to Friday, 9:00 AM - 5:00 PM"
};
const TEAM_NAME="the DormNook team";

document.head.insertAdjacentHTML("beforeend",`<style>
.pg{padding:36px 24px 56px;max-width:960px;margin:0 auto}
.pg h1{font-size:clamp(1.7rem,4vw,2.4rem);font-weight:600;margin:0 0 10px}
.pg .lead{color:var(--ink-soft);max-width:640px;margin:0 0 28px;font-size:1.05rem}
.pg h2{font-size:1.3rem;margin:34px 0 12px}
.cards3{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.pcard{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:18px}
.pcard b{display:block;margin-bottom:4px}.pcard .muted{margin:0}
.pcard .num{display:inline-flex;width:30px;height:30px;border-radius:50%;background:var(--brass);color:#fff;font-weight:700;align-items:center;justify-content:center;margin-bottom:10px}
.contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:20px;align-items:start}
@media(max-width:760px){.contact-grid{grid-template-columns:1fr}.pg{padding:24px 16px 48px}}
.crow{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)}.crow:last-child{border:0}
.crow .ic{font-size:1.2rem}.crow b{display:block;font-size:.85rem;color:var(--ink-soft);font-weight:600}
.faq details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px;margin-bottom:8px}
.faq summary{cursor:pointer;font-weight:600}.faq p{margin:8px 0 0;color:var(--ink-soft);font-size:.92rem}
</style>`);

document.querySelector("main").insertAdjacentHTML("beforeend",`
<section id="view-about" style="display:none"><div class="pg">
  <h1>About DormNook</h1>
  <p class="lead">DormNook helps students find a safe, affordable place to stay without the stress of searching through scattered posts and messages. We bring dormitories, boarding houses, bedspaces, and apartments near schools into one organized, easy-to-read platform.</p>
  <h2>What we do</h2>
  <div class="cards3">
    <div class="pcard"><b>🔎 Easy search</b><p class="muted">Search by location, accommodation type, rental budget, number of occupants, and amenities.</p></div>
    <div class="pcard"><b>🏠 Clear property details</b><p class="muted">Every listing shows rent, photos, amenities, house rules, nearby schools and landmarks, and contact information.</p></div>
    <div class="pcard"><b>✅ Reviewed listings</b><p class="muted">Property owners submit their details and supporting documents, and an admin reviews them before a listing goes live.</p></div>
    <div class="pcard"><b>🚩 Safer renting</b><p class="muted">Anyone can report a suspicious, inaccurate, or outdated listing so it can be checked and removed.</p></div>
  </div>
  <h2>How it works</h2>
  <div class="cards3">
    <div class="pcard"><span class="num">1</span><b>Search</b><p class="muted">Browse listings and apply filters to find places that fit your budget and location.</p></div>
    <div class="pcard"><span class="num">2</span><b>Compare &amp; save</b><p class="muted">Open a listing, check the photos and map, and save your favorites for later.</p></div>
    <div class="pcard"><span class="num">3</span><b>Contact &amp; visit</b><p class="muted">Send an inquiry to the owner, schedule a visit, then move on to the rental agreement.</p></div>
  </div>
  <h2>Our purpose</h2>
  <p class="muted" style="font-size:1rem">DormNook was created by ${TEAM_NAME} to make accommodation information readable, organized, and accessible to students on any device, so finding a place to live is one less thing to worry about while studying.</p>
  <div style="margin-top:22px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-brass" onclick="switchView('browse')">Start searching</button><button class="btn btn-ghost" onclick="switchView('contact')">Contact us</button></div>
</div></section>

<section id="view-contact" style="display:none"><div class="pg">
  <h1>Contact us</h1>
  <p class="lead">Have a question, concern, or need help with a listing? Reach out and we'll get back to you.</p>
  <div class="contact-grid">
    <div class="pcard">
      <div class="crow"><span class="ic">✉️</span><div><b>Email</b>${esc(CONTACT.email)}</div></div>
      <div class="crow"><span class="ic">📞</span><div><b>Phone</b>${esc(CONTACT.phone)}</div></div>
      <div class="crow"><span class="ic">💬</span><div><b>Facebook</b>${esc(CONTACT.facebook)}</div></div>
      <div class="crow"><span class="ic">📍</span><div><b>Address</b>${esc(CONTACT.address)}</div></div>
      <div class="crow"><span class="ic">🕘</span><div><b>Office hours</b>${esc(CONTACT.hours)}</div></div>
    </div>
    <form class="pcard" id="contactForm">
      <h3 style="margin:0 0 12px">Send us a message</h3>
      <div style="margin-bottom:12px"><label>Your name</label><input required id="c-name" style="width:100%"></div>
      <div style="margin-bottom:12px"><label>Your email</label><input required type="email" id="c-email" style="width:100%"></div>
      <div style="margin-bottom:12px"><label>Topic</label><select id="c-topic" style="width:100%"><option>Question about a listing</option><option>Problem with my account</option><option>Report a concern</option><option>I want to list my property</option><option>Other</option></select></div>
      <div style="margin-bottom:12px"><label>Message</label><textarea required id="c-msg" rows="4" style="width:100%"></textarea></div>
      <button class="btn btn-brass" style="width:100%" type="submit">Send message</button>
    </form>
  </div>
  <h2>Frequently asked questions</h2>
  <div class="faq">
    <details><summary>How do I contact a property owner?</summary><p>Create a free account or log in, open a listing, and click "Send inquiry". You can also schedule a visit from the same page.</p></details>
    <details><summary>How do you check that listings are real?</summary><p>Owners submit property details and supporting documents. An admin reviews them and only approved listings are published.</p></details>
    <details><summary>I found a suspicious or outdated listing. What do I do?</summary><p>Open the listing and click "Report listing", then tell us what is wrong. Our admin will review it.</p></details>
    <details><summary>I own a property. How do I list it?</summary><p>Register with a Property owner account, open "List your place", and submit your details, photos, and documents for review.</p></details>
  </div>
  <div id="msgInbox"></div>
</div></section>`);

/* nav buttons */
const nav=document.querySelector(".navlinks"),adminBtn=document.getElementById("navAdmin");
["about:About","contact:Contact"].forEach(s=>{const [v,l]=s.split(":"),b=document.createElement("button");b.dataset.view=v;b.textContent=l;b.onclick=()=>switchView(v);
  adminBtn?nav.insertBefore(b,adminBtn):nav.appendChild(b)});

/* switching: our views on top, everything else handled by the earlier code */
const MINE=["about","contact"],_prev=switchView;
switchView=function(v){
  if(MINE.includes(v)){
    ["browse","favorites","activity","owner","admin","about","contact"].forEach(x=>{const el=document.getElementById("view-"+x);if(el)el.style.display=x===v?"block":"none"});
    document.querySelectorAll(".navlinks button[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));
    view=v;if(v==="contact")fillContact();window.scrollTo(0,0);
  }else{MINE.forEach(x=>document.getElementById("view-"+x).style.display="none");_prev(v)}
};

/* contact form */
function fillContact(){
  const u=me();if(u){$("c-name").value=$("c-name").value||u.name;$("c-email").value=$("c-email").value||u.email}
  const box=$("msgInbox");
  if(u&&u.role==="admin"){const m=load("haven2_contact_msgs");
    box.innerHTML=`<h2>Messages received <span class="status">admin only</span></h2>`+(m.length?m.slice().reverse().map(x=>`<div class="pcard" style="margin-bottom:10px"><b>${esc(x.topic)}</b><div class="muted">${esc(x.name)} · ${esc(x.email)} · ${esc(x.date)}</div><p style="margin:8px 0 0">${esc(x.msg)}</p></div>`).join(""):`<div class="muted">No messages yet.</div>`)}
  else box.innerHTML="";
}
$("contactForm").onsubmit=e=>{
  e.preventDefault();const l=load("haven2_contact_msgs");
  l.push({id:Date.now(),name:$("c-name").value.trim(),email:$("c-email").value.trim(),topic:$("c-topic").value,msg:$("c-msg").value.trim(),date:new Date().toISOString().slice(0,16).replace("T"," ")});
  save("haven2_contact_msgs",l);$("c-msg").value="";toast("Message sent! We'll get back to you soon.");fillContact();
};
})();
