// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth section toggles
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
function toggleMobileMenu(){ document.getElementById('mobileMenu').classList.toggle('hidden'); }
window.toggleMobileMenu = toggleMobileMenu;

// Nav shadow on scroll
const topnav = document.getElementById('topnav');
const navShadow = () => topnav.classList.toggle('shadow-lg', window.scrollY > 4);
navShadow(); window.addEventListener('scroll', navShadow);

// Toasts
const toastHost = document.getElementById('toastHost');
function toast(msg, kind='info'){
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

/* ----------------------------------------------------------------
   SCHEDULE DATA — EXACTLY AS YOU PROVIDED
   Note: playoffs have round:null so the Round cell renders blank
-----------------------------------------------------------------*/
const PREMIER = [
  {round:1, match:1,  tier:'Premier', venue:'Play360', date:'Monday, 15 September 2025', fixture:'Rulo Apaches - Samurai Kick Smashers'},
  {round:1, match:2,  tier:'Premier', venue:'Play360', date:'Tuesday, 16 September 2025',  fixture:'Desert Falcons - Baltic Blades'},
  {round:1, match:3,  tier:'Premier', venue:'Play360', date:'Wednesday, 17 September 2025',fixture:'Globo Boomerangs - Sonic Viboras'},
  {round:1, match:4,  tier:'Premier', venue:'Play360', date:'Thursday, 18 September 2025',  fixture:'Ice Breakers - Avalanche Aces'},

  {round:2, match:5,  tier:'Premier', venue:'Play360', date:'Thursday, 25 September 2025',  fixture:'Samurai Kick Smashers - Desert Falcons'},
  {round:2, match:6,  tier:'Premier', venue:'Play360', date:'Monday, 22 September 2025',   fixture:'Avalanche Aces - Rulo Apaches'},
  {round:2, match:7,  tier:'Premier', venue:'Play360', date:'Tuesday, 23 September 2025',   fixture:'Sonic Viboras - Ice Breakers'},
  {round:2, match:8,  tier:'Premier', venue:'Play360', date:'Friday, 26 September 2025',    fixture:'Baltic Blades - Globo Boomerangs'},

  {round:3, match:9,  tier:'Premier', venue:'Play360', date:'Tuesday, 30 September 2025',   fixture:'Desert Falcons - Avalanche Aces'},
  {round:3, match:10, tier:'Premier', venue:'Play360', date:'Wednesday, 15 October 2025',   fixture:'Samurai Kick Smashers - Baltic Blades'},
  {round:3, match:11, tier:'Premier', venue:'Play360', date:'Monday, 29 September 2025',    fixture:'Rulo Apaches - Sonic Viboras'},
  {round:3, match:12, tier:'Premier', venue:'Play360', date:'Tuesday, 14 October 2025',     fixture:'Ice Breakers - Globo Boomerangs'},

  {round:4, match:13, tier:'Premier', venue:'Play360', date:'Thursday, 23 October 2025',    fixture:'Baltic Blades - Sonic Viboras'},
  {round:4, match:14, tier:'Premier', venue:'Play360', date:'Wednesday, 22 October 2025',   fixture:'Desert Falcons - Rulo Apaches'},
  {round:4, match:15, tier:'Premier', venue:'Play360', date:'Tuesday, 21 October 2025',     fixture:'Avalanche Aces - Globo Boomerangs'},
  {round:4, match:16, tier:'Premier', venue:'Play360', date:'Monday, 20 October 2025',      fixture:'Samurai Kick Smashers - Ice Breakers'},

  {round:5, match:17, tier:'Premier', venue:'Play360', date:'Thursday, 30 October 2025',    fixture:'Rulo Apaches - Baltic Blades'},
  {round:5, match:18, tier:'Premier', venue:'Play360', date:'Monday, 27 October 2025',      fixture:'Globo Boomerangs - Samurai Kick Smashers'},
  {round:5, match:19, tier:'Premier', venue:'Play360', date:'Tuesday, 28 October 2025',     fixture:'Ice Breakers - Desert Falcons'},
  {round:5, match:20, tier:'Premier', venue:'Play360', date:'Wednesday, 29 October 2025',   fixture:'Sonic Viboras - Avalanche Aces'},

  {round:6, match:21, tier:'Premier', venue:'Play360', date:'Thursday, 06 November 2025',   fixture:'Baltic Blades - Avalanche Aces'},
  {round:6, match:22, tier:'Premier', venue:'Play360', date:'Monday, 03 November 2025',     fixture:'Desert Falcons - Globo Boomerangs'},
  {round:6, match:23, tier:'Premier', venue:'Play360', date:'Wednesday, 05 November 2025',  fixture:'Rulo Apaches - Ice Breakers'},
  {round:6, match:24, tier:'Premier', venue:'Play360', date:'Tuesday, 04 November 2025',    fixture:'Samurai Kick Smashers - Sonic Viboras'},

  {round:7, match:25, tier:'Premier', venue:'Play360', date:'Wednesday, 12 November 2025',  fixture:'Globo Boomerangs - Rulo Apaches'},
  {round:7, match:26, tier:'Premier', venue:'Play360', date:'Monday, 10 November 2025',     fixture:'Baltic Blades - Ice Breakers'},
  {round:7, match:27, tier:'Premier', venue:'Play360', date:'Tuesday, 11 November 2025',    fixture:'Sonic Viboras - Desert Falcons'},
  {round:7, match:28, tier:'Premier', venue:'Play360', date:'Thursday, 13 November 2025',   fixture:'Avalanche Aces - Samurai Kick Smashers'},

  {round:null, match:29, tier:'Premier', venue:'Play360', date:'Monday, 24 November 2025',    fixture:'Play off 1'},
  {round:null, match:30, tier:'Premier', venue:'Play360', date:'Tuesday, 25 November 2025',   fixture:'Play off 2'},
  {round:null, match:31, tier:'Premier', venue:'Play360', date:'Monday, 01 December 2025',    fixture:'Play off 3'},
  {round:null, match:32, tier:'Premier', venue:'Play360', date:'Saturday, 06 December 2025',  fixture:'FINALS: Premier'},
];

const CHAMPIONSHIP = [
  {round:1, match:1,  tier:'Championship', venue:'PADEL24', date:'Monday, 15 September 2025', fixture:'Globo Boomerangs - Sonic Viboras'},
  {round:1, match:2,  tier:'Championship', venue:'PADEL24', date:'Monday, 15 September 2025', fixture:'Ice Breakers - Avalanche Aces'},
  {round:1, match:3,  tier:'Championship', venue:'PADEL24', date:'Wednesday, 17 September 2025', fixture:'Rulo Apaches - Samurai Kicksmashers'},
  {round:1, match:4,  tier:'Championship', venue:'PADEL24', date:'Wednesday, 17 September 2025', fixture:'Desert Falcons - Baltic Blades'},

  {round:2, match:5,  tier:'Championship', venue:'PADEL24', date:'Thursday, 25 September 2025', fixture:'Avalanche Aces - Rulo Apaches'},
  {round:2, match:6,  tier:'Championship', venue:'PADEL24', date:'Thursday, 25 September 2025', fixture:'Sonic Viboras - Ice Breakers'},
  {round:2, match:7,  tier:'Championship', venue:'PADEL24', date:'Monday, 22 September 2025',  fixture:'Samurai Kicksmashers  - Desert Falcons'},
  {round:2, match:8,  tier:'Championship', venue:'PADEL24', date:'Monday, 22 September 2025',  fixture:'Baltic Blades - Globo Boomerangs'},

  {round:3, match:9,  tier:'Championship', venue:'PADEL24', date:'Monday, 29 September 2025',  fixture:'Ice Breakers - Globo Boomerangs'},
  {round:3, match:10, tier:'Championship', venue:'PADEL24', date:'Monday, 29 September 2025',  fixture:'Samurai Kicksmashers - Baltic Blades'},
  {round:3, match:11, tier:'Championship', venue:'PADEL24', date:'Thursday, 16 October 2025',  fixture:'Rulo Apaches - Sonic Viboras'},
  {round:3, match:12, tier:'Championship', venue:'PADEL24', date:'Thursday, 16 October 2025',  fixture:'Desert Falcons - Avalanche Aces'},

  {round:4, match:13, tier:'Championship', venue:'PADEL24', date:'Monday, 20 October 2025',    fixture:'Desert Falcons - Rulo Apaches'},
  {round:4, match:14, tier:'Championship', venue:'PADEL24', date:'Monday, 20 October 2025',    fixture:'Baltic Blades - Sonic Viboras'},
  {round:4, match:15, tier:'Championship', venue:'PADEL24', date:'Wednesday, 22 October 2025', fixture:'Samurai Kicksmashers  - Ice Breakers'},
  {round:4, match:16, tier:'Championship', venue:'PADEL24', date:'Wednesday, 22 October 2025', fixture:'Avalanche Aces - Globo Boomerangs'},

  {round:5, match:17, tier:'Championship', venue:'PADEL24', date:'Monday, 27 October 2025',    fixture:'Sonic Viboras - Avalanche Aces'},
  {round:5, match:18, tier:'Championship', venue:'PADEL24', date:'Monday, 27 October 2025',    fixture:'Rulo Apaches - Baltic Blades'},
  {round:5, match:19, tier:'Championship', venue:'PADEL24', date:'Wednesday, 29 October 2025', fixture:'Globo Boomerangs - Samurai Kicksmashers'},
  {round:5, match:20, tier:'Championship', venue:'PADEL24', date:'Wednesday, 29 October 2025', fixture:'Ice Breakers - Desert Falcons'},

  {round:6, match:21, tier:'Championship', venue:'PADEL24', date:'Monday, 03 November 2025',   fixture:'Rulo Apaches - Ice Breakers'},
  {round:6, match:22, tier:'Championship', venue:'PADEL24', date:'Monday, 03 November 2025',   fixture:'Baltic Blades - Avalanche Aces'},
  {round:6, match:23, tier:'Championship', venue:'PADEL24', date:'Wednesday, 05 November 2025',fixture:'Desert Falcons - Globo Boomerangs'},
  {round:6, match:24, tier:'Championship', venue:'PADEL24', date:'Wednesday, 05 November 2025',fixture:'Samurai Kicksmashers - Sonic Viboras'},

  {round:7, match:25, tier:'Championship', venue:'PADEL24', date:'Monday, 10 November 2025',   fixture:'Globo Boomerangs - Rulo Apaches'},
  {round:7, match:26, tier:'Championship', venue:'PADEL24', date:'Monday, 10 November 2025',   fixture:'Avalanche Aces - Samurai Kicksmashers'},
  {round:7, match:27, tier:'Championship', venue:'PADEL24', date:'Wednesday, 12 November 2025',fixture:'Baltic Blades - Ice Breakers'},
  {round:7, match:28, tier:'Championship', venue:'PADEL24', date:'Wednesday, 12 November 2025',fixture:'Sonic Viboras - Desert Falcons'},

  {round:null, match:29, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025',fixture:'Play off 1'},
  {round:null, match:30, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025',fixture:'Play off 2'},
  {round:null, match:31, tier:'Championship', venue:'PADEL24', date:'Tuesday, 02 December 2025',fixture:'Play off 3'},
  {round:null, match:32, tier:'Championship', venue:'Play360', date:'Saturday, 06 December 2025',fixture:'FINALS: Championship'},
];

const ALL_FIXTURES = [...PREMIER, ...CHAMPIONSHIP].map(x => ({...x, status:'Scheduled'}));

/* ----------------------------------------------------------------
   RENDER + FILTERS (strict numeric sort by MATCH)
-----------------------------------------------------------------*/
const tbody = document.querySelector('#schedule-table tbody');
const tierSel   = document.getElementById('filter-tier');
const statusSel = document.getElementById('filter-status');
const venueSel  = document.getElementById('filter-venue');

const filters = { tier:'all', status:'all', venue:'all' };

[tierSel, statusSel, venueSel].forEach(sel=>{
  sel?.addEventListener('change', ()=>{
    filters.tier   = tierSel.value;
    filters.status = statusSel.value;
    filters.venue  = venueSel.value;
    renderSchedule();
  });
});

const tierOrder = t => (t === 'Premier' ? 0 : 1);

function renderSchedule(){
  const rows = ALL_FIXTURES.filter(f=>{
    if(filters.tier   !== 'all' && f.tier   !== filters.tier) return false;
    if(filters.status !== 'all' && f.status !== filters.status) return false;
    if(filters.venue  !== 'all' && f.venue  !== filters.venue) return false;
    return true;
  }).sort((a,b)=>{
    // Always sort by tier, then numeric match (1..32)
    const to = tierOrder(a.tier) - tierOrder(b.tier);
    if (filters.tier === 'all' && to !== 0) return to;
    const am = Number(a.match), bm = Number(b.match);
    return am - bm;
  });

  tbody.innerHTML = '';
  for(const r of rows){
    const tr = document.createElement('tr');
    tr.className = 'border-b border-white/5 hover:bg-white/5';
    tr.innerHTML = `
      <td class="p-4">${Number.isFinite(r.round) ? r.round : ''}</td>
      <td class="p-4">${r.match}</td>
      <td class="p-4">${r.tier}</td>
      <td class="p-4">${r.venue}</td>
      <td class="p-4">${r.date}</td>
      <td class="p-4">${r.fixture}</td>
      <td class="p-4">${r.status}</td>
    `;
    tbody.appendChild(tr);
  }
}
renderSchedule();

/* ----------------------------------------------------------------
   AUTH / MODAL (unchanged; schedule stays visible when logged out)
-----------------------------------------------------------------*/

// Modal DOM
const overlay          = document.getElementById('authOverlay');
const authClose        = document.getElementById('authClose');
const signInView       = document.getElementById('authSignIn');
const registerView     = document.getElementById('authRegister');
const goRegister       = document.getElementById('goRegister');
const goSignIn         = document.getElementById('goSignIn');

// Nav DOM
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

// Firebase
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

// Open/close auth modal
['navGetStarted','mobileGetStarted','ctaJoinNow'].forEach(id=>{
  const btn=document.getElementById(id); if(!btn) return;
  btn.addEventListener('click', (e)=>{
    if(auth.currentUser) return;
    e.preventDefault();
    overlay.classList.remove('hidden'); overlay.classList.add('flex');
    signInView.classList.remove('hidden'); registerView.classList.add('hidden');
  });
});
authClose?.addEventListener('click', ()=>{
  overlay.classList.add('hidden'); overlay.classList.remove('flex');
});
goRegister?.addEventListener('click', ()=>{
  signInView.classList.add('hidden'); registerView.classList.remove('hidden');
});
goSignIn?.addEventListener('click', ()=>{
  registerView.classList.add('hidden'); signInView.classList.remove('hidden');
});

// Profile dropdown
profileBtn?.addEventListener('click', (e)=>{
  e.stopPropagation();
  profileMenu.classList.toggle('hidden');
});
document.addEventListener('click', (e)=>{
  if(!profileMenu.classList.contains('hidden')){
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
    } catch (e) { /* ignore */ }

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    navGetStarted.classList.add('hidden');
    profileBtn.classList.remove('hidden');
    profileName.textContent = name;
    profileAvatar.textContent = init;

    ctaJoinNow?.classList.add('hidden'); ctaAdmin?.classList.remove('hidden');
    mobileGetStarted.classList.add('hidden');
    mobileWelcome.classList.remove('hidden');
    mobileWelcome.textContent = `Welcome, ${name}`;
    mobileSignOut.classList.remove('hidden');
  } else {
    profileBtn.classList.add('hidden');
    profileMenu.classList.add('hidden');
    navGetStarted.classList.remove('hidden');

    ctaJoinNow?.classList.remove('hidden'); ctaAdmin?.classList.add('hidden');
    mobileGetStarted.classList.remove('hidden');
    mobileWelcome.classList.add('hidden');
    mobileSignOut.classList.add('hidden');
  }
});

// Sign in
document.getElementById('signin_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pw    = document.getElementById('password').value;
  const box   = document.getElementById('error');
  box.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    overlay.classList.add('hidden'); overlay.classList.remove('flex');
    toast('Signed in ✅', 'success');
  } catch (err) {
    const msg = (err?.message || 'Sign-in failed').replace('Firebase: ','');
    box.textContent = msg;
    toast(msg, 'error');
  }
});

// Register
document.getElementById('register_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name  = document.getElementById('r_name').value.trim();
  const email = document.getElementById('r_email').value.trim();
  const msg   = document.getElementById('r_msg_modal');
  msg.style.color = ''; msg.textContent = '';
  const tempPw = Math.random().toString(36).slice(-10) + "Aa1!";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, tempPw);
    if (name) await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), { uid:cred.user.uid, name, email, role:'player', createdAt: serverTimestamp() });
    await sendPasswordResetEmail(auth, email);
    msg.style.color = 'lightgreen';
    msg.textContent = 'Account created. Check your email to set your password.';
    toast('Account created. Reset link sent 📬', 'success');
    setTimeout(()=>{
      signInView.classList.remove('hidden');
      registerView.classList.add('hidden');
    }, 1500);
  } catch (err) {
    const m = (err?.message || 'Registration failed').replace('Firebase: ','');
    msg.style.color = 'salmon';
    msg.textContent = m;
    toast(m, 'error');
  }
});

// Forgot password
document.getElementById('getTempModal')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('tempMsgModal');
  msg.style.color=''; msg.textContent='';
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
document.getElementById('btnSignOut')?.addEventListener('click', async ()=>{
  await getAuth().signOut();
  toast('Signed out', 'info');
});
document.getElementById('mobileSignOut')?.addEventListener('click', async ()=>{
  await getAuth().signOut();
  document.getElementById('mobileMenu')?.classList.add('hidden');
  toast('Signed out', 'info');
});

// CSV export
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
