/* =========================
   Padel Pro — app.js
   ========================= */

/* ---------- Footer year ---------- */
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

/* ---------- Smooth section toggles (if sections exist on page) ---------- */
const sectionIds = ['home','franchises','fantasy','marketplace','live-stream','schedule'];
function showSection(id){
  sectionIds.forEach(s=>{
    const el=document.getElementById(s); if(!el) return;
    el.classList.toggle('hidden', s!==id);
  });
  const m=document.getElementById('mobileMenu');
  if(m && !m.classList.contains('hidden')) m.classList.add('hidden');
  document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id=a.getAttribute('href').slice(1);
    if(sectionIds.includes(id)){ e.preventDefault(); showSection(id); }
  });
});
function toggleMobileMenu(){ document.getElementById('mobileMenu')?.classList.toggle('hidden'); }
window.toggleMobileMenu = toggleMobileMenu;

/* ---------- Polished: nav shadow on scroll ---------- */
const topnav = document.getElementById('topnav');
const navShadow = () => topnav?.classList.toggle('shadow-lg', window.scrollY > 4);
navShadow(); window.addEventListener('scroll', navShadow);

/* ---------- Toast helper ---------- */
const toastHost = document.getElementById('toastHost');
function toast(msg, kind='info'){
  if (!toastHost) return;
  const base = document.createElement('div');
  base.className = `px-4 py-3 rounded-xl text-sm shadow-2xl border transition-all duration-300 ${
    kind==='error' ? 'bg-rose-600/90 border-rose-400/40' :
    kind==='success' ? 'bg-emerald-600/90 border-emerald-400/40' :
    'bg-slate-800/90 border-white/10'
  }`;
  base.textContent = msg;
  toastHost.appendChild(base);
  setTimeout(()=>{ base.classList.add('opacity-0','translate-y-1'); }, 2400);
  setTimeout(()=>{ base.remove(); }, 3000);
}

/* ---------- Modal DOM ---------- */
const overlay          = document.getElementById('authOverlay');
const authClose        = document.getElementById('authClose');
const signInView       = document.getElementById('authSignIn');
const registerView     = document.getElementById('authRegister');
const goRegister       = document.getElementById('goRegister');
const goSignIn         = document.getElementById('goSignIn');

/* ---------- Nav DOM ---------- */
const navGetStarted    = document.getElementById('navGetStarted');
const mobileGetStarted = document.getElementById('mobileGetStarted');
const ctaJoinNow       = document.getElementById('ctaJoinNow');
const ctaAdmin         = document.getElementById('ctaAdmin');

const profileBtn   = document.getElementById('profileBtn');
const profileMenu  = document.getElementById('profileMenu');
const profileName  = document.getElementById('profileName');
const profileAvatar= document.getElementById('profileAvatar');

const mobileWelcome= document.getElementById('mobileWelcome');
const mobileSignOut= document.getElementById('mobileSignOut');
const btnSignOut   = document.getElementById('btnSignOut');

/* ---------- Open/close auth modal ---------- */
['navGetStarted','mobileGetStarted','ctaJoinNow'].forEach(id=>{
  const btn=document.getElementById(id); if(!btn) return;
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    overlay?.classList.remove('hidden'); overlay?.classList.add('flex');
    signInView?.classList.remove('hidden'); registerView?.classList.add('hidden');
  });
});
authClose?.addEventListener('click', ()=>{
  overlay?.classList.add('hidden'); overlay?.classList.remove('flex');
});
goRegister?.addEventListener('click', ()=>{
  signInView?.classList.add('hidden'); registerView?.classList.remove('hidden');
});
goSignIn?.addEventListener('click', ()=>{
  registerView?.classList.add('hidden'); signInView?.classList.remove('hidden');
});

/* ---------- Profile dropdown ---------- */
profileBtn?.addEventListener('click', (e)=>{
  e.stopPropagation();
  profileMenu?.classList.toggle('hidden');
});
document.addEventListener('click', (e)=>{
  if(profileMenu && !profileMenu.classList.contains('hidden')){
    const within = profileMenu.contains(e.target) || profileBtn?.contains(e.target);
    if(!within) profileMenu.classList.add('hidden');
  }
});

/* =========================================================
   Firebase (auth only; schedule is public & rendered anyway)
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqJkzXzw9MgLFBZRvbnp8OthXWzSr2aBs",
  authDomain: "padelpro-c24b0.firebaseapp.com",
  projectId: "padelpro-c24b0",
  storageBucket: "padelpro-c24b0.firebasestorage.app",
  messagingSenderId: "882509576352",
  appId: "1:882509576352:web:353877bde27dc6416971c5"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* ---------- Auth state → UI (Schedule stays visible!) ---------- */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const uref = doc(db, 'users', user.uid);
      const snap = await getDoc(uref);
      if (!snap.exists()) {
        await setDoc(uref, {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          role: 'player',
          createdAt: serverTimestamp()
        });
      }
    } catch { /* ignore if rules readonly */ }

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    navGetStarted?.classList.add('hidden');
    profileBtn?.classList.remove('hidden');
    if (profileName) profileName.textContent = name;
    if (profileAvatar) profileAvatar.textContent = init;

    ctaJoinNow?.classList.add('hidden'); ctaAdmin?.classList.remove('hidden');
    mobileGetStarted?.classList.add('hidden');
    if (mobileWelcome){ mobileWelcome.classList.remove('hidden'); mobileWelcome.textContent = `Welcome, ${name}`; }
    mobileSignOut?.classList.remove('hidden');
  } else {
    profileBtn?.classList.add('hidden');
    profileMenu?.classList.add('hidden');
    navGetStarted?.classList.remove('hidden');

    ctaJoinNow?.classList.remove('hidden'); ctaAdmin?.classList.add('hidden');
    mobileGetStarted?.classList.remove('hidden');
    mobileWelcome?.classList.add('hidden');
    mobileSignOut?.classList.add('hidden');
  }
});

/* ---------- Sign in ---------- */
document.getElementById('signin_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pw    = document.getElementById('password').value;
  const box   = document.getElementById('error');
  if (box) box.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    overlay?.classList.add('hidden'); overlay?.classList.remove('flex');
    toast('Signed in ✅', 'success');
  } catch (err) {
    const msg = (err?.message || 'Sign-in failed').replace('Firebase: ','');
    if (box) box.textContent = msg;
    toast(msg, 'error');
  }
});

/* ---------- Register ---------- */
document.getElementById('register_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name  = document.getElementById('r_name').value.trim();
  const email = document.getElementById('r_email').value.trim();
  const msg   = document.getElementById('r_msg_modal');
  if (msg){ msg.style.color = ''; msg.textContent = ''; }
  const tempPw = Math.random().toString(36).slice(-10) + "Aa1!";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, tempPw);
    if (name) await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), { uid:cred.user.uid, name, email, role:'player', createdAt: serverTimestamp() });
    await sendPasswordResetEmail(auth, email);
    if (msg){ msg.style.color = 'lightgreen'; msg.textContent = 'Account created. Check your email to set your password.'; }
    toast('Account created. Reset link sent 📬', 'success');
    setTimeout(()=>{
      signInView?.classList.remove('hidden');
      registerView?.classList.add('hidden');
    }, 1500);
  } catch (err) {
    const m = (err?.message || 'Registration failed').replace('Firebase: ','');
    if (msg){ msg.style.color = 'salmon'; msg.textContent = m; }
    toast(m, 'error');
  }
});

/* ---------- Forgot password ---------- */
document.getElementById('getTempModal')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('tempMsgModal');
  if (msg){ msg.style.color=''; msg.textContent=''; }
  if (!email) { if (msg){ msg.style.color='salmon'; msg.textContent='Enter your email above first.'; } return; }
  try {
    await sendPasswordResetEmail(auth, email);
    if (msg){ msg.style.color='lightgreen'; msg.textContent='Reset link sent. Check your inbox/spam.'; }
    toast('Reset link sent 📧', 'success');
  } catch (err) {
    const m = (err?.message || 'Could not send reset email').replace('Firebase: ','');
    if (msg){ msg.style.color='salmon'; msg.textContent=m; }
    toast(m, 'error');
  }
});

/* ---------- Sign out ---------- */
btnSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  toast('Signed out', 'info');
});
mobileSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  document.getElementById('mobileMenu')?.classList.add('hidden');
  toast('Signed out', 'info');
});

/* =========================================================
   SCHEDULE (public) — EXACTLY your two fixture lists
   ========================================================= */

/** Parse "Monday, 15 September 2025" → Date */
function parsePrettyDate(label){
  if (!label) return null;
  // Example: "Monday, 15 September 2025"
  const parts = label.split(',')[1]?.trim() ?? label.trim(); // "15 September 2025"
  const [d, monthName, y] = parts.split(' ');
  const months = {
    January:0, February:1, March:2, April:3, May:4, June:5,
    July:6, August:7, September:8, October:9, November:10, December:11
  };
  const m = months[monthName];
  if (m==null) return null;
  return new Date(Number(y), m, Number(d));
}

function statusForDate(label){
  const dt = parsePrettyDate(label);
  if (!dt) return 'Scheduled';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const game  = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  if (game.getTime() === today.getTime()) return 'Today';
  if (game < today) return 'Completed';
  return 'Scheduled';
}

/* ----- FIXTURES (order is intentional; do not sort) ----- */
const FIXTURES = [
  /* Premier */
  {round:1, match:1,  tier:'Premier', venue:'Play360', date:'Monday, 15 September 2025', fixture:'Rulo Apaches - Samurai Kick Smashers'},
  {round:1, match:2,  tier:'Premier', venue:'Play360', date:'Tuesday, 16 September 2025', fixture:'Desert Falcons - Baltic Blades'},
  {round:1, match:3,  tier:'Premier', venue:'Play360', date:'Wednesday, 17 September 2025', fixture:'Globo Boomerangs - Sonic Viboras'},
  {round:1, match:4,  tier:'Premier', venue:'Play360', date:'Thursday, 18 September 2025', fixture:'Ice Breakers - Avalanche Aces'},

  {round:2, match:5,  tier:'Premier', venue:'Play360', date:'Thursday, 25 September 2025', fixture:'Samurai Kick Smashers - Desert Falcons'},
  {round:2, match:6,  tier:'Premier', venue:'Play360', date:'Monday, 22 September 2025', fixture:'Avalanche Aces - Rulo Apaches'},
  {round:2, match:7,  tier:'Premier', venue:'Play360', date:'Tuesday, 23 September 2025', fixture:'Sonic Viboras - Ice Breakers'},
  {round:2, match:8,  tier:'Premier', venue:'Play360', date:'Friday, 26 September 2025', fixture:'Baltic Blades - Globo Boomerangs'},

  {round:3, match:9,  tier:'Premier', venue:'Play360', date:'Tuesday, 30 September 2025', fixture:'Desert Falcons - Avalanche Aces'},
  {round:3, match:10, tier:'Premier', venue:'Play360', date:'Wednesday, 15 October 2025', fixture:'Samurai Kick Smashers - Baltic Blades'},
  {round:3, match:11, tier:'Premier', venue:'Play360', date:'Monday, 29 September 2025', fixture:'Rulo Apaches - Sonic Viboras'},
  {round:3, match:12, tier:'Premier', venue:'Play360', date:'Tuesday, 14 October 2025', fixture:'Ice Breakers - Globo Boomerangs'},

  {round:4, match:13, tier:'Premier', venue:'Play360', date:'Thursday, 23 October 2025', fixture:'Baltic Blades - Sonic Viboras'},
  {round:4, match:14, tier:'Premier', venue:'Play360', date:'Wednesday, 22 October 2025', fixture:'Desert Falcons - Rulo Apaches'},
  {round:4, match:15, tier:'Premier', venue:'Play360', date:'Tuesday, 21 October 2025', fixture:'Avalanche Aces - Globo Boomerangs'},
  {round:4, match:16, tier:'Premier', venue:'Play360', date:'Monday, 20 October 2025', fixture:'Samurai Kick Smashers - Ice Breakers'},

  {round:5, match:17, tier:'Premier', venue:'Play360', date:'Thursday, 30 October 2025', fixture:'Rulo Apaches - Baltic Blades'},
  {round:5, match:18, tier:'Premier', venue:'Play360', date:'Monday, 27 October 2025', fixture:'Globo Boomerangs - Samurai Kick Smashers'},
  {round:5, match:19, tier:'Premier', venue:'Play360', date:'Tuesday, 28 October 2025', fixture:'Ice Breakers - Desert Falcons'},
  {round:5, match:20, tier:'Premier', venue:'Play360', date:'Wednesday, 29 October 2025', fixture:'Sonic Viboras - Avalanche Aces'},

  {round:6, match:21, tier:'Premier', venue:'Play360', date:'Thursday, 06 November 2025', fixture:'Baltic Blades - Avalanche Aces'},
  {round:6, match:22, tier:'Premier', venue:'Play360', date:'Monday, 03 November 2025', fixture:'Desert Falcons - Globo Boomerangs'},
  {round:6, match:23, tier:'Premier', venue:'Play360', date:'Wednesday, 05 November 2025', fixture:'Rulo Apaches - Ice Breakers'},
  {round:6, match:24, tier:'Premier', venue:'Play360', date:'Tuesday, 04 November 2025', fixture:'Samurai Kick Smashers - Sonic Viboras'},

  {round:7, match:25, tier:'Premier', venue:'Play360', date:'Wednesday, 12 November 2025', fixture:'Globo Boomerangs - Rulo Apaches'},
  {round:7, match:26, tier:'Premier', venue:'Play360', date:'Monday, 10 November 2025', fixture:'Baltic Blades - Ice Breakers'},
  {round:7, match:27, tier:'Premier', venue:'Play360', date:'Tuesday, 11 November 2025', fixture:'Sonic Viboras - Desert Falcons'},
  {round:7, match:28, tier:'Premier', venue:'Play360', date:'Thursday, 13 November 2025', fixture:'Avalanche Aces - Samurai Kick Smashers'},

  {round:'', match:29, tier:'Premier', venue:'Play360', date:'Monday, 24 November 2025', fixture:'Play off 1'},
  {round:'', match:30, tier:'Premier', venue:'Play360', date:'Tuesday, 25 November 2025', fixture:'Play off 2'},
  {round:'', match:31, tier:'Premier', venue:'Play360', date:'Monday, 01 December 2025', fixture:'Play off 3'},
  {round:'', match:32, tier:'Premier', venue:'Play360', date:'Saturday, 06 December 2025', fixture:'FINALS: Premier'},

  /* Championship */
  {round:1, match:1,  tier:'Championship', venue:'PADEL24', date:'Monday, 15 September 2025', fixture:'Globo Boomerangs - Sonic Viboras'},
  {round:1, match:2,  tier:'Championship', venue:'PADEL24', date:'Monday, 15 September 2025', fixture:'Ice Breakers - Avalanche Aces'},
  {round:1, match:3,  tier:'Championship', venue:'PADEL24', date:'Wednesday, 17 September 2025', fixture:'Rulo Apaches - Samurai Kicksmashers'},
  {round:1, match:4,  tier:'Championship', venue:'PADEL24', date:'Wednesday, 17 September 2025', fixture:'Desert Falcons - Baltic Blades'},

  {round:2, match:5,  tier:'Championship', venue:'PADEL24', date:'Thursday, 25 September 2025', fixture:'Avalanche Aces - Rulo Apaches'},
  {round:2, match:6,  tier:'Championship', venue:'PADEL24', date:'Thursday, 25 September 2025', fixture:'Sonic Viboras - Ice Breakers'},
  {round:2, match:7,  tier:'Championship', venue:'PADEL24', date:'Monday, 22 September 2025', fixture:'Samurai Kicksmashers  - Desert Falcons'},
  {round:2, match:8,  tier:'Championship', venue:'PADEL24', date:'Monday, 22 September 2025', fixture:'Baltic Blades - Globo Boomerangs'},

  {round:3, match:9,  tier:'Championship', venue:'PADEL24', date:'Monday, 29 September 2025', fixture:'Ice Breakers - Globo Boomerangs'},
  {round:3, match:10, tier:'Championship', venue:'PADEL24', date:'Monday, 29 September 2025', fixture:'Samurai Kicksmashers - Baltic Blades'},
  {round:3, match:11, tier:'Championship', venue:'PADEL24', date:'Thursday, 16 October 2025', fixture:'Rulo Apaches - Sonic Viboras'},
  {round:3, match:12, tier:'Championship', venue:'PADEL24', date:'Thursday, 16 October 2025', fixture:'Desert Falcons - Avalanche Aces'},

  {round:4, match:13, tier:'Championship', venue:'PADEL24', date:'Monday, 20 October 2025', fixture:'Desert Falcons - Rulo Apaches'},
  {round:4, match:14, tier:'Championship', venue:'PADEL24', date:'Monday, 20 October 2025', fixture:'Baltic Blades - Sonic Viboras'},
  {round:4, match:15, tier:'Championship', venue:'PADEL24', date:'Wednesday, 22 October 2025', fixture:'Samurai Kicksmashers  - Ice Breakers'},
  {round:4, match:16, tier:'Championship', venue:'PADEL24', date:'Wednesday, 22 October 2025', fixture:'Avalanche Aces - Globo Boomerangs'},

  {round:5, match:17, tier:'Championship', venue:'PADEL24', date:'Monday, 27 October 2025', fixture:'Sonic Viboras - Avalanche Aces'},
  {round:5, match:18, tier:'Championship', venue:'PADEL24', date:'Monday, 27 October 2025', fixture:'Rulo Apaches - Baltic Blades'},
  {round:5, match:19, tier:'Championship', venue:'PADEL24', date:'Wednesday, 29 October 2025', fixture:'Globo Boomerangs - Samurai Kicksmashers'},
  {round:5, match:20, tier:'Championship', venue:'PADEL24', date:'Wednesday, 29 October 2025', fixture:'Ice Breakers - Desert Falcons'},

  {round:6, match:21, tier:'Championship', venue:'PADEL24', date:'Monday, 03 November 2025', fixture:'Rulo Apaches - Ice Breakers'},
  {round:6, match:22, tier:'Championship', venue:'PADEL24', date:'Monday, 03 November 2025', fixture:'Baltic Blades - Avalanche Aces'},
  {round:6, match:23, tier:'Championship', venue:'PADEL24', date:'Wednesday, 05 November 2025', fixture:'Desert Falcons - Globo Boomerangs'},
  {round:6, match:24, tier:'Championship', venue:'PADEL24', date:'Wednesday, 05 November 2025', fixture:'Samurai Kicksmashers - Sonic Viboras'},

  {round:7, match:25, tier:'Championship', venue:'PADEL24', date:'Monday, 10 November 2025', fixture:'Globo Boomerangs - Rulo Apaches'},
  {round:7, match:26, tier:'Championship', venue:'PADEL24', date:'Monday, 10 November 2025', fixture:'Avalanche Aces - Samurai Kicksmashers'},
  {round:7, match:27, tier:'Championship', venue:'PADEL24', date:'Wednesday, 12 November 2025', fixture:'Baltic Blades - Ice Breakers'},
  {round:7, match:28, tier:'Championship', venue:'PADEL24', date:'Wednesday, 12 November 2025', fixture:'Sonic Viboras - Desert Falcons'},

  {round:'', match:29, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 1'},
  {round:'', match:30, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 2'},
  {round:'', match:31, tier:'Championship', venue:'PADEL24', date:'Tuesday, 02 December 2025', fixture:'Play off 3'},
  {round:'', match:32, tier:'Championship', venue:'Play360', date:'Saturday, 06 December 2025', fixture:'FINALS: Championship'},
];

/* ---------- Rendering & filters ---------- */
const tb = document.querySelector('#schedule-table tbody');
const selTier   = document.getElementById('filter-tier');
const selStatus = document.getElementById('filter-status');
const selVenue  = document.getElementById('filter-venue');

function renderSchedule(){
  if (!tb) return; // Not on a page with the schedule table.

  const tier   = selTier?.value ?? 'all';
  const status = selStatus?.value ?? 'all';
  const venue  = selVenue?.value ?? 'all';

  // We do NOT sort; we keep your order as declared above.
  const filtered = FIXTURES.filter(item=>{
    const st = statusForDate(item.date);
    const tierOk   = (tier==='all'   || item.tier===tier);
    const venueOk  = (venue==='all'  || item.venue===venue);
    const statusOk = (status==='all' || st===status);
    return tierOk && venueOk && statusOk;
  });

  tb.innerHTML = '';
  const frag = document.createDocumentFragment();
  filtered.forEach(row=>{
    const tr = document.createElement('tr');
    tr.className = 'border-b border-white/5 hover:bg-white/5';
    const st = statusForDate(row.date);
    tr.innerHTML = `
      <td class="p-3">${row.round || ''}</td>
      <td class="p-3">${row.match}</td>
      <td class="p-3">${row.tier}</td>
      <td class="p-3">${row.venue}</td>
      <td class="p-3">${row.date}</td>
      <td class="p-3">${row.fixture}</td>
      <td class="p-3">${st}</td>
    `;
    frag.appendChild(tr);
  });
  tb.appendChild(frag);
}

selTier?.addEventListener('change', renderSchedule);
selStatus?.addEventListener('change', renderSchedule);
selVenue?.addEventListener('change', renderSchedule);

/* ---------- CSV export ---------- */
document.getElementById('export-csv')?.addEventListener('click', ()=>{
  if (!tb) { alert('No schedule on this page.'); return; }
  const rows = tb.querySelectorAll('tr');
  if (!rows.length) { alert('No schedule rows to export yet.'); return; }
  const headers = Array.from(document.querySelectorAll('#schedule-table thead th')).map(th=>th.textContent.trim());
  const data = [headers];
  rows.forEach(tr=>{
    data.push(Array.from(tr.querySelectorAll('td')).map(td=>td.textContent.trim()));
  });
  const csv = data.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  const a = document.createElement('a'); a.href=url; a.download='schedule.csv'; a.click(); URL.revokeObjectURL(url);
});

/* ---------- One single call to render ---------- */
document.addEventListener('DOMContentLoaded', renderSchedule);
