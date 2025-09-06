/* ============ Footer year ============ */
document.getElementById('year')?.textContent = new Date().getFullYear();

/* ============ Sections / Router ============ */
const sectionIds = ['home','franchises','fantasy','marketplace','live-stream','schedule'];

function showSection(id){
  sectionIds.forEach(s=>{
    const el = document.getElementById(s);
    if (el) el.classList.toggle('hidden', s!==id);
  });
  const m = document.getElementById('mobileMenu');
  if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
  document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
}

// Intercept any same-page link that contains a hash (supports "#home" and "index.html#home")
document.querySelectorAll('a[href*="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href') || '';
    const i = href.indexOf('#');
    if (i === -1) return;
    const id = href.slice(i+1);
    if (sectionIds.includes(id)) {
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      showSection(id);
    }
  });
});

// Keep UI in sync with the URL (back/forward/manual edits)
function handleHashChange(){
  const id = (location.hash || '#home').slice(1);
  showSection(sectionIds.includes(id) ? id : 'home');
}
window.addEventListener('hashchange', handleHashChange);
document.addEventListener('DOMContentLoaded', handleHashChange);

// Mobile menu helper
function toggleMobileMenu(){ document.getElementById('mobileMenu')?.classList.toggle('hidden'); }
window.toggleMobileMenu = toggleMobileMenu;

// Polished: nav shadow on scroll
const topnav = document.getElementById('topnav');
const navShadow = () => topnav?.classList.toggle('shadow-lg', window.scrollY > 4);
navShadow(); window.addEventListener('scroll', navShadow);

/* ============ Toasts ============ */
const toastHost = document.getElementById('toastHost');
function toast(msg, kind='info'){
  if (!toastHost) return;
  const base = document.createElement('div');
  base.className = `px-4 py-3 rounded-xl text-sm shadow-2xl border ${
    kind==='error'   ? 'bg-rose-600/90 border-rose-400/40' :
    kind==='success' ? 'bg-emerald-600/90 border-emerald-400/40' :
                       'bg-slate-800/90 border-white/10'
  } transition opacity-100`;
  base.textContent = msg;
  toastHost.appendChild(base);
  setTimeout(()=>{ base.classList.add('opacity-0','translate-y-1'); }, 2400);
  setTimeout(()=>{ base.remove(); }, 3000);
}

/* ============ Auth Modal DOM ============ */
const overlay          = document.getElementById('authOverlay');
const authClose        = document.getElementById('authClose');
const signInView       = document.getElementById('authSignIn');
const registerView     = document.getElementById('authRegister');
const goRegister       = document.getElementById('goRegister');
const goSignIn         = document.getElementById('goSignIn');

/* ============ Nav DOM ============ */
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

/* ============ Firebase ============ */
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

/* ============ Auth modal open/close ============ */
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

/* ============ Profile dropdown ============ */
profileBtn?.addEventListener('click', (e)=>{
  e.stopPropagation();
  profileMenu?.classList.toggle('hidden');
});
document.addEventListener('click', (e)=>{
  if (!profileMenu || !profileBtn) return;
  if(!profileMenu.classList.contains('hidden')){
    const within = profileMenu.contains(e.target) || profileBtn.contains(e.target);
    if(!within) profileMenu.classList.add('hidden');
  }
});

/* ============ Auth state → UI ============ */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Ensure user doc exists (ignore failures if rules are locked)
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
    } catch (_) {}

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    // Desktop: profile
    navGetStarted?.classList.add('hidden');
    profileBtn?.classList.remove('hidden');
    if (profileName)  profileName.textContent  = name;
    if (profileAvatar)profileAvatar.textContent = init;

    // Buttons/sections
    ctaJoinNow?.classList.add('hidden'); ctaAdmin?.classList.remove('hidden');
    mobileGetStarted?.classList.add('hidden');
    mobileWelcome?.classList.remove('hidden');
    if (mobileWelcome) mobileWelcome.textContent = `Welcome, ${name}`;
    mobileSignOut?.classList.remove('hidden');

    // Optional: keep fantasy/marketplace/live-stream gated if you like.
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

/* ============ Sign in / Register / Reset / Sign out ============ */
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

btnSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  toast('Signed out', 'info');
});
mobileSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  document.getElementById('mobileMenu')?.classList.add('hidden');
  toast('Signed out', 'info');
});

/* ============ Schedules ============ */
/* Premier (exactly as provided) */
const PREMIER_FIXTURES = [
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

  {round:29, match:1, tier:'Premier', venue:'Play360', date:'Monday, 24 November 2025', fixture:'Play off 1'},
  {round:30, match:1, tier:'Premier', venue:'Play360', date:'Tuesday, 25 November 2025', fixture:'Play off 2'},
  {round:31, match:1, tier:'Premier', venue:'Play360', date:'Monday, 01 December 2025', fixture:'Play off 3'},
  {round:32, match:1, tier:'Premier', venue:'Play360', date:'Saturday, 06 December 2025', fixture:'FINALS: Premier'},
].map(x=>({...x, status:'Scheduled'}));

/* Championship (exactly as provided) */
const CHAMP_FIXTURES = [
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

  {round:29, match:1, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 1'},
  {round:30, match:1, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 2'},
  {round:31, match:1, tier:'Championship', venue:'PADEL24', date:'Tuesday, 02 December 2025', fixture:'Play off 3'},
  {round:32, match:1, tier:'Championship', venue:'Play360', date:'Saturday, 06 December 2025', fixture:'FINALS: Championship'},
].map(x=>({...x, status:'Scheduled'}));

const ALL_FIXTURES = [...PREMIER_FIXTURES, ...CHAMP_FIXTURES];

/* ============ Schedule rendering + filters ============ */
const tbody = document.querySelector('#schedule-table tbody');
const tierSel   = document.getElementById('filter-tier');
const statusSel = document.getElementById('filter-status');
const venueSel  = document.getElementById('filter-venue');

function renderSchedule(list){
  if (!tbody) return;
  tbody.innerHTML = '';
  list
    .slice()
    .sort((a,b)=> (a.round - b.round) || (a.match - b.match))
    .forEach(row=>{
      const tr = document.createElement('tr');
      tr.className = 'border-b border-white/5 hover:bg-white/5';
      tr.innerHTML = `
        <td class="p-4">${row.round ?? ''}</td>
        <td class="p-4">${row.match ?? ''}</td>
        <td class="p-4">${row.tier}</td>
        <td class="p-4">${row.venue}</td>
        <td class="p-4 whitespace-nowrap">${row.date}</td>
        <td class="p-4">${row.fixture}</td>
        <td class="p-4">${row.status || 'Scheduled'}</td>
      `;
      tbody.appendChild(tr);
    });
}

function applyFilters(){
  let list = ALL_FIXTURES;
  const t = tierSel?.value || 'all';
  const s = statusSel?.value || 'all';
  const v = venueSel?.value || 'all';

  if (t !== 'all')  list = list.filter(x=>x.tier === t);
  if (s !== 'all')  list = list.filter(x=>(x.status||'Scheduled') === s);
  if (v !== 'all')  list = list.filter(x=>x.venue === v);

  renderSchedule(list);
}

tierSel?.addEventListener('change', applyFilters);
statusSel?.addEventListener('change', applyFilters);
venueSel?.addEventListener('change', applyFilters);

// Initial schedule paint
document.addEventListener('DOMContentLoaded', ()=> {
  renderSchedule(ALL_FIXTURES);
});

/* ============ CSV export ============ */
document.getElementById('export-csv')?.addEventListener('click', ()=>{
  if (!tbody) return;
  const rows = [...tbody.querySelectorAll('tr')];
  if (!rows.length) { alert('No schedule rows to export yet.'); return; }
  const headers = [...document.querySelectorAll('#schedule-table thead th')].map(th=>th.textContent.trim());
  const data = [headers];
  rows.forEach(tr=>{
    data.push([...tr.querySelectorAll('td')].map(td=>td.textContent.trim()));
  });
  const csv = data.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  const a = document.createElement('a'); a.href=url; a.download='schedule.csv'; a.click(); URL.revokeObjectURL(url);
});
