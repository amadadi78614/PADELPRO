/* ============================================================================
   Padel Pro — app.js (one file only)
   - Navbar polish (shadow on scroll, mobile menu)
   - Firebase Auth (Sign in / Register / Reset / Sign out)
   - Schedule (Premier + Championship) with filters + CSV export
   - Home page Round 1 tiles (logos + “vs”) — runs only if containers exist
   - Keeps Schedule visible for everyone
   ==========================================================================*/

// ---------- Helpers ----------
const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
const on  = (el, ev, fn) => el && el.addEventListener(ev, fn);

// Footer year
on(window, 'DOMContentLoaded', () => {
  const year = qs('#year');
  if (year) year.textContent = new Date().getFullYear();
});

// ---------- Mobile menu + nav shadow ----------
function toggleMobileMenu() {
  const m = qs('#mobileMenu');
  if (m) m.classList.toggle('hidden');
}
window.toggleMobileMenu = toggleMobileMenu;

const topnav = qs('#topnav');
const navShadow = () => topnav && topnav.classList.toggle('shadow-lg', window.scrollY > 4);
navShadow();
on(window, 'scroll', navShadow);

// Close mobile menu on anchor click
qsa('a[href^="#"]').forEach(a => {
  on(a, 'click', () => {
    const m = qs('#mobileMenu');
    if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
  });
});

// ---------- Toasts ----------
const toastHost = qs('#toastHost');
function toast(msg, kind='info'){
  if (!toastHost) return;
  const base = document.createElement('div');
  base.className = `px-4 py-3 rounded-xl text-sm shadow-2xl border transition-all
    ${ kind==='error'   ? 'bg-rose-600/90 border-rose-400/40' :
       kind==='success' ? 'bg-emerald-600/90 border-emerald-400/40' :
                          'bg-slate-800/90 border-white/10' }`;
  base.textContent = msg;
  toastHost.appendChild(base);
  setTimeout(()=> base.classList.add('opacity-0','translate-y-1'), 2400);
  setTimeout(()=> base.remove(), 3000);
}

// ---------- Auth modal DOM ----------
const overlay          = qs('#authOverlay');
const authClose        = qs('#authClose');
const signInView       = qs('#authSignIn');
const registerView     = qs('#authRegister');
const goRegister       = qs('#goRegister');
const goSignIn         = qs('#goSignIn');

// Navbar DOM
const navGetStarted    = qs('#navGetStarted');
const mobileGetStarted = qs('#mobileGetStarted');
const ctaJoinNow       = qs('#ctaJoinNow');
const ctaAdmin         = qs('#ctaAdmin');

const profileBtn       = qs('#profileBtn');
const profileMenu      = qs('#profileMenu');
const profileName      = qs('#profileName');
const profileAvatar    = qs('#profileAvatar');

const mobileWelcome    = qs('#mobileWelcome');
const mobileSignOut    = qs('#mobileSignOut');
const btnSignOut       = qs('#btnSignOut');

// Open/close modal
['navGetStarted','mobileGetStarted','ctaJoinNow'].forEach(id=>{
  const btn = qs('#'+id);
  on(btn, 'click', (e)=>{
    if (auth.currentUser) return;
    e.preventDefault();
    overlay?.classList.remove('hidden'); overlay?.classList.add('flex');
    signInView?.classList.remove('hidden'); registerView?.classList.add('hidden');
  });
});
on(authClose, 'click', ()=>{
  overlay?.classList.add('hidden'); overlay?.classList.remove('flex');
});
on(goRegister, 'click', ()=>{
  signInView?.classList.add('hidden'); registerView?.classList.remove('hidden');
});
on(goSignIn, 'click', ()=>{
  registerView?.classList.add('hidden'); signInView?.classList.remove('hidden');
});

// Profile dropdown
on(profileBtn, 'click', (e)=>{
  e.stopPropagation();
  profileMenu?.classList.toggle('hidden');
});
on(document, 'click', (e)=>{
  if (!profileMenu || profileMenu.classList.contains('hidden')) return;
  const within = profileMenu.contains(e.target) || profileBtn.contains(e.target);
  if (!within) profileMenu.classList.add('hidden');
});

// ---------- Firebase ----------
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

// Auth state → UI (Schedule stays visible for everyone)
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
    } catch (_) { /* ignore */ }

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    navGetStarted?.classList.add('hidden');
    profileBtn?.classList.remove('hidden');
    if (profileName)  profileName.textContent = name;
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
on(qs('#signin_modal'), 'submit', async (e)=>{
  e.preventDefault();
  const email = qs('#email')?.value.trim();
  const pw    = qs('#password')?.value;
  const box   = qs('#error');
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
on(qs('#register_modal'), 'submit', async (e)=>{
  e.preventDefault();
  const name  = qs('#r_name')?.value.trim();
  const email = qs('#r_email')?.value.trim();
  const msg   = qs('#r_msg_modal');
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
on(qs('#getTempModal'), 'click', async (e)=>{
  e.preventDefault();
  const email = qs('#email')?.value.trim();
  const msg   = qs('#tempMsgModal');
  if (msg) { msg.style.color=''; msg.textContent=''; }
  if (!email) { if (msg) { msg.style.color='salmon'; msg.textContent='Enter your email above first.'; } return; }
  try {
    await sendPasswordResetEmail(auth, email);
    if (msg) { msg.style.color='lightgreen'; msg.textContent='Reset link sent. Check your inbox/spam.'; }
    toast('Reset link sent 📧', 'success');
  } catch (err) {
    const m = (err?.message || 'Could not send reset email').replace('Firebase: ','');
    if (msg) { msg.style.color='salmon'; msg.textContent=m; }
    toast(m, 'error');
  }
});

// Sign out
on(btnSignOut, 'click', async ()=>{
  await signOut(auth);
  toast('Signed out', 'info');
});
on(mobileSignOut, 'click', async ()=>{
  await signOut(auth);
  qs('#mobileMenu')?.classList.add('hidden');
  toast('Signed out', 'info');
});

// ---------- Schedule Data (exactly as provided) ----------
const PREMIER = [
  {round:1, match:1,  tier:'Premier', venue:'Play360', date:'Monday, 15 September 2025',  fixture:'Rulo Apaches - Samurai Kick Smashers'},
  {round:1, match:2,  tier:'Premier', venue:'Play360', date:'Tuesday, 16 September 2025',  fixture:'Desert Falcons - Baltic Blades'},
  {round:1, match:3,  tier:'Premier', venue:'Play360', date:'Wednesday, 17 September 2025',fixture:'Globo Boomerangs - Sonic Viboras'},
  {round:1, match:4,  tier:'Premier', venue:'Play360', date:'Thursday, 18 September 2025', fixture:'Ice Breakers - Avalanche Aces'},

  {round:2, match:5,  tier:'Premier', venue:'Play360', date:'Thursday, 25 September 2025', fixture:'Samurai Kick Smashers - Desert Falcons'},
  {round:2, match:6,  tier:'Premier', venue:'Play360', date:'Monday, 22 September 2025',  fixture:'Avalanche Aces - Rulo Apaches'},
  {round:2, match:7,  tier:'Premier', venue:'Play360', date:'Tuesday, 23 September 2025',  fixture:'Sonic Viboras - Ice Breakers'},
  {round:2, match:8,  tier:'Premier', venue:'Play360', date:'Friday, 26 September 2025',   fixture:'Baltic Blades - Globo Boomerangs'},

  {round:3, match:9,  tier:'Premier', venue:'Play360', date:'Tuesday, 30 September 2025',  fixture:'Desert Falcons - Avalanche Aces'},
  {round:3, match:10, tier:'Premier', venue:'Play360', date:'Wednesday, 15 October 2025', fixture:'Samurai Kick Smashers - Baltic Blades'},
  {round:3, match:11, tier:'Premier', venue:'Play360', date:'Monday, 29 September 2025',  fixture:'Rulo Apaches - Sonic Viboras'},
  {round:3, match:12, tier:'Premier', venue:'Play360', date:'Tuesday, 14 October 2025',   fixture:'Ice Breakers - Globo Boomerangs'},

  {round:4, match:13, tier:'Premier', venue:'Play360', date:'Thursday, 23 October 2025',  fixture:'Baltic Blades - Sonic Viboras'},
  {round:4, match:14, tier:'Premier', venue:'Play360', date:'Wednesday, 22 October 2025', fixture:'Desert Falcons - Rulo Apaches'},
  {round:4, match:15, tier:'Premier', venue:'Play360', date:'Tuesday, 21 October 2025',   fixture:'Avalanche Aces - Globo Boomerangs'},
  {round:4, match:16, tier:'Premier', venue:'Play360', date:'Monday, 20 October 2025',    fixture:'Samurai Kick Smashers - Ice Breakers'},

  {round:5, match:17, tier:'Premier', venue:'Play360', date:'Thursday, 30 October 2025',  fixture:'Rulo Apaches - Baltic Blades'},
  {round:5, match:18, tier:'Premier', venue:'Play360', date:'Monday, 27 October 2025',    fixture:'Globo Boomerangs - Samurai Kick Smashers'},
  {round:5, match:19, tier:'Premier', venue:'Play360', date:'Tuesday, 28 October 2025',   fixture:'Ice Breakers - Desert Falcons'},
  {round:5, match:20, tier:'Premier', venue:'Play360', date:'Wednesday, 29 October 2025', fixture:'Sonic Viboras - Avalanche Aces'},

  {round:6, match:21, tier:'Premier', venue:'Play360', date:'Thursday, 06 November 2025', fixture:'Baltic Blades - Avalanche Aces'},
  {round:6, match:22, tier:'Premier', venue:'Play360', date:'Monday, 03 November 2025',   fixture:'Desert Falcons - Globo Boomerangs'},
  {round:6, match:23, tier:'Premier', venue:'Play360', date:'Wednesday, 05 November 2025',fixture:'Rulo Apaches - Ice Breakers'},
  {round:6, match:24, tier:'Premier', venue:'Play360', date:'Tuesday, 04 November 2025',  fixture:'Samurai Kick Smashers - Sonic Viboras'},

  {round:7, match:25, tier:'Premier', venue:'Play360', date:'Wednesday, 12 November 2025',fixture:'Globo Boomerangs - Rulo Apaches'},
  {round:7, match:26, tier:'Premier', venue:'Play360', date:'Monday, 10 November 2025',   fixture:'Baltic Blades - Ice Breakers'},
  {round:7, match:27, tier:'Premier', venue:'Play360', date:'Tuesday, 11 November 2025',  fixture:'Sonic Viboras - Desert Falcons'},
  {round:7, match:28, tier:'Premier', venue:'Play360', date:'Thursday, 13 November 2025', fixture:'Avalanche Aces - Samurai Kick Smashers'},

  {round:29, match:29, tier:'Premier', venue:'Play360', date:'Monday, 24 November 2025',  fixture:'Play off 1'},
  {round:30, match:30, tier:'Premier', venue:'Play360', date:'Tuesday, 25 November 2025', fixture:'Play off 2'},
  {round:31, match:31, tier:'Premier', venue:'Play360', date:'Monday, 01 December 2025',  fixture:'Play off 3'},
  {round:32, match:32, tier:'Premier', venue:'Play360', date:'Saturday, 06 December 2025',fixture:'FINALS: Premier'},
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

  {round:29, match:29, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 1'},
  {round:30, match:30, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 2'},
  {round:31, match:31, tier:'Championship', venue:'PADEL24', date:'Tuesday, 02 December 2025',  fixture:'Play off 3'},
  {round:32, match:32, tier:'Championship', venue:'Play360', date:'Saturday, 06 December 2025',  fixture:'FINALS: Championship'},
];

const ALL_MATCHES = [...PREMIER, ...CHAMPIONSHIP].map(x => ({...x, status:'Scheduled'}));

// ---------- Schedule render + filters ----------
const scheduleTableBody = qs('#schedule-table tbody');
const ftTier   = qs('#filter-tier');
const ftStatus = qs('#filter-status');
const ftVenue  = qs('#filter-venue');

function passesFilters(m){
  const tierOk   = !ftTier || ftTier.value==='all'   || m.tier===ftTier.value;
  const statusOk = !ftStatus || ftStatus.value==='all' || m.status===ftStatus.value;
  const venueOk  = !ftVenue || ftVenue.value==='all'  || m.venue===ftVenue.value;
  return tierOk && statusOk && venueOk;
}

function renderSchedule(){
  if (!scheduleTableBody) return;
  const rows = ALL_MATCHES.filter(passesFilters);
  scheduleTableBody.innerHTML = rows.map(m => `
    <tr class="border-b border-white/5 hover:bg-white/5 transition">
      <td class="p-4">${m.round}</td>
      <td class="p-4">${m.match}</td>
      <td class="p-4">${m.tier}</td>
      <td class="p-4">${m.venue}</td>
      <td class="p-4">${m.date}</td>
      <td class="p-4">${m.fixture.replace(' - ',' vs ')}</td>
      <td class="p-4">${m.status}</td>
    </tr>
  `).join('');
}
on(ftTier,   'change', renderSchedule);
on(ftStatus, 'change', renderSchedule);
on(ftVenue,  'change', renderSchedule);

// CSV export
on(qs('#export-csv'), 'click', ()=>{
  if (!scheduleTableBody) return;
  const rows = qsa('tr', scheduleTableBody);
  if (!rows.length) { alert('No schedule rows to export yet.'); return; }
  const headers = qsa('#schedule-table thead th').map(th=>th.textContent.trim());
  const data = [headers];
  rows.forEach(tr=>{
    data.push(qsa('td', tr).map(td=>td.textContent.trim()));
  });
  const csv = data.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  const a = document.createElement('a'); a.href=url; a.download='schedule.csv'; a.click(); URL.revokeObjectURL(url);
});

// Render schedule on load (if table exists)
on(window, 'DOMContentLoaded', renderSchedule);

// ---------- Home page: Round 1 tiles ----------
(() => {
  const premierHost = qs('#homePremier');
  const champHost   = qs('#homeChampionship');
  if (!premierHost || !champHost) return; // Not on Home

  const LOGO = {
    "Desert Falcons": "assets/logos/desert-falcons.jpeg",
    "Globo Boomerangs": "assets/logos/globo-boomerangs.jpeg",
    "Ice Breakers": "assets/logos/ice-breakers.jpeg",
    "Baltic Blades": "assets/logos/baltic-blades.jpeg",
    "Avalanche Aces": "assets/logos/avalanche-aces.jpeg",
    "Rulo Apaches": "assets/logos/rulo-apaches.jpeg",
    "Samurai Kick Smashers": "assets/logos/samurai-kicksmashers.jpeg",
    "Samurai Kicksmashers": "assets/logos/samurai-kicksmashers.jpeg",
    "Sonic Viboras": "assets/logos/sonic-viboras.jpeg",
  };

  const R1_PREMIER = PREMIER.filter(m => m.round === 1).sort((a,b)=>a.match-b.match);
  const R1_CHAMP   = CHAMPIONSHIP.filter(m => m.round === 1).sort((a,b)=>a.match-b.match);

  const card = (m) => `
    <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 hover:ring-white/20 transition">
      <div class="flex items-center justify-between text-[11px] sm:text-xs text-white/60 mb-3">
        <div>${m.date}</div>
        <div class="px-2 py-0.5 rounded-full bg-white/10 text-white/70">${m.venue}</div>
      </div>
      <div class="flex items-center gap-3 sm:gap-5">
        <div class="flex items-center gap-3 min-w-0">
          <img src="${LOGO[m.fixture.split(' - ')[0]]||''}" class="h-10 w-10 sm:h-12 sm:w-12 rounded-full ring-2 ring-white/10 object-cover" alt="">
          <div class="font-semibold text-sm sm:text-base leading-tight whitespace-normal break-words">
            ${m.fixture.split(' - ')[0]}
          </div>
        </div>
        <div class="px-2 py-0.5 rounded-full text-[11px] sm:text-xs bg-white/10 text-white/80 shrink-0">vs</div>
        <div class="flex items-center gap-3 min-w-0">
          <img src="${LOGO[m.fixture.split(' - ')[1]]||''}" class="h-10 w-10 sm:h-12 sm:w-12 rounded-full ring-2 ring-white/10 object-cover" alt="">
          <div class="font-semibold text-sm sm:text-base leading-tight whitespace-normal break-words">
            ${m.fixture.split(' - ')[1]}
          </div>
        </div>
      </div>
    </div>
  `;

  premierHost.innerHTML = R1_PREMIER.map(card).join('');
  champHost.innerHTML   = R1_CHAMP.map(card).join('');

  // Optional: “View full schedule” button on home
  on(qs('#btnViewSchedule'), 'click', (e)=>{
    e.preventDefault();
    window.location.hash = '#schedule';
    const sc = qs('#schedule');
    sc?.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();
