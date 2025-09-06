// Footer year
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// Nav shadow on scroll
const topnav = document.getElementById('topnav');
const navShadow = () => topnav && topnav.classList.toggle('shadow-lg', window.scrollY > 4);
navShadow(); window.addEventListener('scroll', navShadow);

// Toasts
const toastHost = document.getElementById('toastHost');
function toast(msg, kind='info'){
  if (!toastHost) return;
  const base = document.createElement('div');
  base.className = `px-4 py-3 rounded-xl text-sm shadow-2xl border ${
    kind==='error' ? 'bg-rose-600/90 border-rose-400/40' :
    kind==='success' ? 'bg-emerald-600/90 border-emerald-400/40' :
    'bg-slate-800/90 border-white/10'
  }`;
  base.textContent = msg;
  toastHost.appendChild(base);
  setTimeout(()=>{ base.classList.add('opacity-0','translate-y-1'); }, 2400);
  setTimeout(()=>{ base.remove(); }, 3000);
}

// ------------------------
// Firebase (auth minimal)
// ------------------------
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

// Modal elements
const overlay      = document.getElementById('authOverlay');
const authClose    = document.getElementById('authClose');
const signInView   = document.getElementById('authSignIn');
const registerView = document.getElementById('authRegister');
const goRegister   = document.getElementById('goRegister');
const goSignIn     = document.getElementById('goSignIn');

// Nav elements
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

// Open modal buttons (skip if already logged in)
['navGetStarted','mobileGetStarted','ctaJoinNow'].forEach(id=>{
  const btn=document.getElementById(id); if(!btn) return;
  btn.addEventListener('click', (e)=>{
    if(auth.currentUser) return;
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

// Profile dropdown
profileBtn?.addEventListener('click', (e)=>{
  e.stopPropagation();
  profileMenu?.classList.toggle('hidden');
});
document.addEventListener('click', (e)=>{
  if(profileMenu && !profileMenu.classList.contains('hidden')){
    const within = profileMenu.contains(e.target) || profileBtn.contains(e.target);
    if(!within) profileMenu.classList.add('hidden');
  }
});

// Auth state → UI
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
    } catch {}

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    navGetStarted?.classList.add('hidden');
    profileBtn?.classList.remove('hidden');
    if (profileName) profileName.textContent = name;
    if (profileAvatar) profileAvatar.textContent = init;

    ctaJoinNow?.classList.add('hidden'); ctaAdmin?.classList.remove('hidden');
    mobileGetStarted?.classList.add('hidden');
    mobileWelcome?.classList.remove('hidden');
    if (mobileWelcome) mobileWelcome.textContent = `Welcome, ${name}`;
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

// Sign in
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

// Register
document.getElementById('register_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name  = document.getElementById('r_name').value.trim();
  const email = document.getElementById('r_email').value.trim();
  const msg   = document.getElementById('r_msg_modal');
  if (msg) { msg.style.color = ''; msg.textContent = ''; }
  const tempPw = Math.random().toString(36).slice(-10) + "Aa1!";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, tempPw);
    if (name) await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), { uid:cred.user.uid, name, email, role:'player', createdAt: serverTimestamp() });
    await sendPasswordResetEmail(auth, email);
    if (msg) { msg.style.color = 'lightgreen'; msg.textContent = 'Account created. Check your email to set your password.'; }
    toast('Account created. Reset link sent 📬', 'success');
    setTimeout(()=>{
      signInView?.classList.remove('hidden');
      registerView?.classList.add('hidden');
    }, 1500);
  } catch (err) {
    const m = (err?.message || 'Registration failed').replace('Firebase: ','');
    if (msg) { msg.style.color = 'salmon'; msg.textContent = m; }
    toast(m, 'error');
  }
});

// Forgot password
document.getElementById('getTempModal')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('tempMsgModal');
  if (msg) { msg.style.color=''; msg.textContent=''; }
  if (!email) { msg.style.color='salmon'; msg.textContent='Enter your email above first.'; return; }
  try {
    await sendPasswordResetEmail(auth, email);
    msg.style.color='lightgreen'; msg.textContent='Reset link sent. Check your inbox/spam.';
    toast('Reset link sent 📧', 'success');
  } catch (err) {
    const m = (err?.message || 'Could not send reset email').replace('Firebase: ','');
    msg.style.color='salmon'; msg.textContent=m;
    toast(m, 'error');
  }
});

// Sign out
btnSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  toast('Signed out', 'info');
});
mobileSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  document.getElementById('mobileMenu')?.classList.add('hidden');
  toast('Signed out', 'info');
});

// -----------------------------
// FIXTURES (exact order & text)
// -----------------------------

// Helper to make item
const fx = (round, match, tier, venue, date, fixture, status='Scheduled') =>
  ({ round, match, tier, venue, date, fixture, status });

window.PREMIER = [
  fx(1,1,'Premier','Play360','Monday, 15 September 2025','Rulo Apaches vs Samurai Kicksmashers'),
  fx(1,2,'Premier','Play360','Tuesday, 16 September 2025','Desert Falcons vs Baltic Blades'),
  fx(1,3,'Premier','Play360','Wednesday, 17 September 2025','Globo Boomerangs vs Sonic Viboras'),
  fx(1,4,'Premier','Play360','Thursday, 18 September 2025','Ice Breakers vs Avalanche Aces'),

  fx(2,5,'Premier','Play360','Thursday, 25 September 2025','Samurai Kicksmashers vs Desert Falcons'),
  fx(2,6,'Premier','Play360','Monday, 22 September 2025','Avalanche Aces vs Rulo Apaches'),
  fx(2,7,'Premier','Play360','Tuesday, 23 September 2025','Sonic Viboras vs Ice Breakers'),
  fx(2,8,'Premier','Play360','Friday, 26 September 2025','Baltic Blades vs Globo Boomerangs'),

  fx(3,9,'Premier','Play360','Tuesday, 30 September 2025','Desert Falcons vs Avalanche Aces'),
  fx(3,10,'Premier','Play360','Wednesday, 15 October 2025','Samurai Kicksmashers vs Baltic Blades'),
  fx(3,11,'Premier','Play360','Monday, 29 September 2025','Rulo Apaches vs Sonic Viboras'),
  fx(3,12,'Premier','Play360','Tuesday, 14 October 2025','Ice Breakers vs Globo Boomerangs'),

  fx(4,13,'Premier','Play360','Thursday, 23 October 2025','Baltic Blades vs Sonic Viboras'),
  fx(4,14,'Premier','Play360','Wednesday, 22 October 2025','Desert Falcons vs Rulo Apaches'),
  fx(4,15,'Premier','Play360','Tuesday, 21 October 2025','Avalanche Aces vs Globo Boomerangs'),
  fx(4,16,'Premier','Play360','Monday, 20 October 2025','Samurai Kicksmashers vs Ice Breakers'),

  fx(5,17,'Premier','Play360','Thursday, 30 October 2025','Rulo Apaches vs Baltic Blades'),
  fx(5,18,'Premier','Play360','Monday, 27 October 2025','Globo Boomerangs vs Samurai Kicksmashers'),
  fx(5,19,'Premier','Play360','Tuesday, 28 October 2025','Ice Breakers vs Desert Falcons'),
  fx(5,20,'Premier','Play360','Wednesday, 29 October 2025','Sonic Viboras vs Avalanche Aces'),

  fx(6,21,'Premier','Play360','Thursday, 06 November 2025','Baltic Blades vs Avalanche Aces'),
  fx(6,22,'Premier','Play360','Monday, 03 November 2025','Desert Falcons vs Globo Boomerangs'),
  fx(6,23,'Premier','Play360','Wednesday, 05 November 2025','Rulo Apaches vs Ice Breakers'),
  fx(6,24,'Premier','Play360','Tuesday, 04 November 2025','Samurai Kicksmashers vs Sonic Viboras'),

  fx(7,25,'Premier','Play360','Wednesday, 12 November 2025','Globo Boomerangs vs Rulo Apaches'),
  fx(7,26,'Premier','Play360','Monday, 10 November 2025','Baltic Blades vs Ice Breakers'),
  fx(7,27,'Premier','Play360','Tuesday, 11 November 2025','Sonic Viboras vs Desert Falcons'),
  fx(7,28,'Premier','Play360','Thursday, 13 November 2025','Avalanche Aces vs Samurai Kicksmashers'),

  fx(29,1,'Premier','Play360','Monday, 24 November 2025','Play off 1'),
  fx(30,1,'Premier','Play360','Tuesday, 25 November 2025','Play off 2'),
  fx(31,1,'Premier','Play360','Monday, 01 December 2025','Play off 3'),
  fx(32,1,'Premier','Play360','Saturday, 06 December 2025','FINALS: Premier'),
];

window.CHAMPIONSHIP = [
  fx(1,1,'Championship','PADEL24','Monday, 15 September 2025','Globo Boomerangs vs Sonic Viboras'),
  fx(1,2,'Championship','PADEL24','Monday, 15 September 2025','Ice Breakers vs Avalanche Aces'),
  fx(1,3,'Championship','PADEL24','Wednesday, 17 September 2025','Rulo Apaches vs Samurai Kicksmashers'),
  fx(1,4,'Championship','PADEL24','Wednesday, 17 September 2025','Desert Falcons vs Baltic Blades'),

  fx(2,5,'Championship','PADEL24','Thursday, 25 September 2025','Avalanche Aces vs Rulo Apaches'),
  fx(2,6,'Championship','PADEL24','Thursday, 25 September 2025','Sonic Viboras vs Ice Breakers'),
  fx(2,7,'Championship','PADEL24','Monday, 22 September 2025','Samurai Kicksmashers vs Desert Falcons'),
  fx(2,8,'Championship','PADEL24','Monday, 22 September 2025','Baltic Blades vs Globo Boomerangs'),

  fx(3,9,'Championship','PADEL24','Monday, 29 September 2025','Ice Breakers vs Globo Boomerangs'),
  fx(3,10,'Championship','PADEL24','Monday, 29 September 2025','Samurai Kicksmashers vs Baltic Blades'),
  fx(3,11,'Championship','PADEL24','Thursday, 16 October 2025','Rulo Apaches vs Sonic Viboras'),
  fx(3,12,'Championship','PADEL24','Thursday, 16 October 2025','Desert Falcons vs Avalanche Aces'),

  fx(4,13,'Championship','PADEL24','Monday, 20 October 2025','Desert Falcons vs Rulo Apaches'),
  fx(4,14,'Championship','PADEL24','Monday, 20 October 2025','Baltic Blades vs Sonic Viboras'),
  fx(4,15,'Championship','PADEL24','Wednesday, 22 October 2025','Samurai Kicksmashers vs Ice Breakers'),
  fx(4,16,'Championship','PADEL24','Wednesday, 22 October 2025','Avalanche Aces vs Globo Boomerangs'),

  fx(5,17,'Championship','PADEL24','Monday, 27 October 2025','Sonic Viboras vs Avalanche Aces'),
  fx(5,18,'Championship','PADEL24','Monday, 27 October 2025','Rulo Apaches vs Baltic Blades'),
  fx(5,19,'Championship','PADEL24','Wednesday, 29 October 2025','Globo Boomerangs vs Samurai Kicksmashers'),
  fx(5,20,'Championship','PADEL24','Wednesday, 29 October 2025','Ice Breakers vs Desert Falcons'),

  fx(6,21,'Championship','PADEL24','Monday, 03 November 2025','Rulo Apaches vs Ice Breakers'),
  fx(6,22,'Championship','PADEL24','Monday, 03 November 2025','Baltic Blades vs Avalanche Aces'),
  fx(6,23,'Championship','PADEL24','Wednesday, 05 November 2025','Desert Falcons vs Globo Boomerangs'),
  fx(6,24,'Championship','PADEL24','Wednesday, 05 November 2025','Samurai Kicksmashers vs Sonic Viboras'),

  fx(7,25,'Championship','PADEL24','Monday, 10 November 2025','Globo Boomerangs vs Rulo Apaches'),
  fx(7,26,'Championship','PADEL24','Monday, 10 November 2025','Avalanche Aces vs Samurai Kicksmashers'),
  fx(7,27,'Championship','PADEL24','Wednesday, 12 November 2025','Baltic Blades vs Ice Breakers'),
  fx(7,28,'Championship','PADEL24','Wednesday, 12 November 2025','Sonic Viboras vs Desert Falcons'),

  fx(29,1,'Championship','PADEL24','Wednesday, 26 November 2025','Play off 1'),
  fx(30,1,'Championship','PADEL24','Wednesday, 26 November 2025','Play off 2'),
  fx(31,1,'Championship','PADEL24','Tuesday, 02 December 2025','Play off 3'),
  fx(32,1,'Championship','Play360','Saturday, 06 December 2025','FINALS: Championship'),
];

// -----------------------------
// HOME: Round 1 fixtures cards
// -----------------------------

const TEAM_LOGOS = {
  "Desert Falcons": "assets/logos/desert-falcons.jpeg",
  "Globo Boomerangs": "assets/logos/globo-boomerangs.jpeg",
  "Ice Breakers": "assets/logos/ice-breakers.jpeg",
  "Baltic Blades": "assets/logos/baltic-blades.jpeg",
  "Avalanche Aces": "assets/logos/avalanche-aces.jpeg",
  "Rulo Apaches": "assets/logos/rulo-apaches.jpeg",
  "Samurai Kicksmashers": "assets/logos/samurai-kicksmashers.jpeg",
  "Sonic Viboras": "assets/logos/sonic-viboras.jpeg",
};

function parseTeams(f) {
  const clean = f.replace(" - ", " vs ");
  const [home, away] = clean.split(" vs ").map(s => s.trim());
  return [home, away];
}

function cardHTML(item) {
  const [home, away] = parseTeams(item.fixture);
  const homeLogo = TEAM_LOGOS[home] || TEAM_LOGOS["Desert Falcons"];
  const awayLogo = TEAM_LOGOS[away] || TEAM_LOGOS["Globo Boomerangs"];

  return `
    <div class="rounded-xl bg-white/[0.03] ring-1 ring-white/10 hover:ring-white/20 p-4 transition">
      <div class="text-xs text-white/70 mb-1">${item.date}</div>
      <div class="text-[11px] text-white/60 mb-3">${item.venue}</div>
      <div class="flex items-center gap-3">
        <img src="${homeLogo}" alt="${home}" class="w-10 h-10 rounded-full ring-2 ring-white/10 object-cover">
        <div class="text-sm font-medium truncate">${home}</div>
        <div class="mx-2 text-white/60 text-xs">vs</div>
        <img src="${awayLogo}" alt="${away}" class="w-10 h-10 rounded-full ring-2 ring-white/10 object-cover">
        <div class="text-sm font-medium truncate">${away}</div>
      </div>
    </div>
  `;
}

function renderRound1Home() {
  const premWrap = document.getElementById('round1-premier');
  const champWrap = document.getElementById('round1-champ');
  if (!premWrap || !champWrap) return;

  const premR1 = (window.PREMIER || []).filter(x => x.round === 1).sort((a,b)=>a.match-b.match);
  const champR1 = (window.CHAMPIONSHIP || []).filter(x => x.round === 1).sort((a,b)=>a.match-b.match);

  premWrap.innerHTML  = premR1.map(cardHTML).join('');
  champWrap.innerHTML = champR1.map(cardHTML).join('');
}
document.addEventListener('DOMContentLoaded', renderRound1Home);

// -----------------------------
// SCHEDULE PAGE: render + filter
// -----------------------------

function renderScheduleTable() {
  const tableBody = document.querySelector('#schedule-table tbody');
  if (!tableBody) return;

  const tierSel   = document.getElementById('filter-tier');
  const statusSel = document.getElementById('filter-status');
  const venueSel  = document.getElementById('filter-venue');

  const all = [...window.PREMIER, ...window.CHAMPIONSHIP]
    .sort((a,b)=> a.round-b.round || a.match-b.match);

  const tier   = tierSel?.value || 'all';
  const status = statusSel?.value || 'all';
  const venue  = venueSel?.value || 'all';

  const rows = all.filter(r=>{
    if (tier!=='all' && r.tier!==tier) return false;
    if (status!=='all' && (r.status||'Scheduled')!==status) return false;
    if (venue!=='all' && r.venue!==venue) return false;
    return true;
  });

  tableBody.innerHTML = rows.map(r=>`
    <tr class="border-b border-white/5 hover:bg-white/[0.03]">
      <td class="p-4">${r.round}</td>
      <td class="p-4">${r.match}</td>
      <td class="p-4">${r.tier}</td>
      <td class="p-4">${r.venue}</td>
      <td class="p-4">${r.date}</td>
      <td class="p-4">${r.fixture}</td>
      <td class="p-4">${r.status||'Scheduled'}</td>
    </tr>
  `).join('');
}

['filter-tier','filter-status','filter-venue'].forEach(id=>{
  const el=document.getElementById(id);
  el && el.addEventListener('change', renderScheduleTable);
});
document.addEventListener('DOMContentLoaded', renderScheduleTable);

// CSV export (schedule page)
document.getElementById('export-csv')?.addEventListener('click', ()=>{
  const rows = document.querySelectorAll('#schedule-table tbody tr');
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
