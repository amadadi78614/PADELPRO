// -------------------------------
// Tailwind helpers are in CSS
// -------------------------------

// ========= Shared Header / Footer (injected on every page)
const headerHTML = `
<nav class="bg-black/70 backdrop-blur-sm fixed w-full z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <a href="index.html" class="flex items-center gap-2">
        <span class="text-2xl">🏓</span>
        <span class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Padel Pro
        </span>
      </a>

      <div class="hidden md:flex items-center space-x-8">
        <a class="hover:text-blue-400 transition-colors" href="index.html">Home</a>
        <a class="hover:text-blue-400 transition-colors" href="franchises.html">Franchises</a>
        <a class="hover:text-blue-400 transition-colors" href="fantasy.html">Fantasy</a>
        <a class="hover:text-blue-400 transition-colors" href="marketplace.html">Marketplace</a>
        <a class="hover:text-blue-400 transition-colors" href="live.html">Live Stream</a>
        <a class="hover:text-blue-400 transition-colors" href="schedule.html">Schedule</a>

        <a id="navGetStarted"
           href="#"
           class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
          Sign In / Register
        </a>

        <div class="relative">
          <button id="profileBtn" class="hidden group relative flex items-center gap-3 rounded-full px-3 py-1.5 hover:bg-white/10 transition">
            <span id="profileAvatar" class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center font-semibold">U</span>
            <span id="profileName" class="text-sm"></span>
            <svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
          </button>
          <div id="profileMenu"
               class="hidden absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0b0f1a]/95 backdrop-blur shadow-2xl overflow-hidden">
            <a href="dashboard.html" class="block px-4 py-2.5 hover:bg-white/5 text-sm">Dashboard</a>
            <button id="btnSignOut" class="w-full text-left px-4 py-2.5 hover:bg-white/5 text-sm">Sign out</button>
          </div>
        </div>
      </div>

      <div class="md:hidden flex items-center">
        <button id="mobileOpen" class="text-white" aria-label="Open menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div id="mobileMenu" class="hidden md:hidden bg-black/95 border-t border-white/10">
    <div class="px-3 pt-2 pb-3 space-y-1">
      <a class="block px-3 py-2 hover:bg-white/5 rounded" href="index.html">Home</a>
      <a class="block px-3 py-2 hover:bg-white/5 rounded" href="franchises.html">Franchises</a>
      <a class="block px-3 py-2 hover:bg-white/5 rounded" href="fantasy.html">Fantasy</a>
      <a class="block px-3 py-2 hover:bg-white/5 rounded" href="marketplace.html">Marketplace</a>
      <a class="block px-3 py-2 hover:bg-white/5 rounded" href="live.html">Live Stream</a>
      <a class="block px-3 py-2 hover:bg-white/5 rounded" href="schedule.html">Schedule</a>

      <a id="mobileGetStarted" href="#"
         class="block w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-center">
        Sign In / Register
      </a>
      <div id="mobileWelcome" class="hidden px-3 text-sm text-gray-300"></div>
      <button id="mobileSignOut" class="hidden w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-left">
        Sign out
      </button>
    </div>
  </div>
</nav>
`;

const footerHTML = `
<footer class="site-footer">
  <div class="max-w-7xl mx-auto px-4 text-center text-gray-400">
    © <span id="year"></span> Nomz. All rights reserved.
  </div>
</footer>
`;

// Auth modal (injected once)
const authModalHTML = `
<div id="toastHost" class="fixed top-4 right-4 z-[200] space-y-2"></div>
<div id="authOverlay" class="fixed inset-0 bg-black/70 backdrop-blur-sm hidden items-center justify-center z-[100]">
  <div class="w-full max-w-md mx-4">
    <div class="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-2xl p-6">
      <button id="authClose" class="absolute top-3 right-3 text-white/70 hover:text-white" aria-label="Close">✕</button>

      <div id="authSignIn">
        <h2 class="text-xl font-semibold mb-4">Sign In</h2>
        <form id="signin_modal" class="space-y-4">
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input id="email" type="email" class="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
          </div>
          <div>
            <label class="block text-sm mb-1">Password</label>
            <input id="password" type="password" class="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
          </div>
          <p id="error" class="text-rose-300 text-sm min-h-[1.25rem]"></p>
          <button class="w-full py-2 rounded bg-blue-500/80 hover:bg-blue-500">Sign In</button>
        </form>
        <button id="getTempModal" type="button" class="mt-3 text-sm underline underline-offset-2 hover:no-underline opacity-90">
          Forgot password? Send reset link
        </button>
        <p id="tempMsgModal" class="text-emerald-300 text-sm min-h-[1.25rem] mt-1"></p>
        <div class="mt-4 text-sm text-center opacity-90">
          Not registered? <button id="goRegister" class="underline hover:no-underline text-blue-300">Register Now</button>
        </div>
        <p class="text-xs opacity-75 mt-3">Tip: click “Send reset link” to set your password.</p>
      </div>

      <div id="authRegister" class="hidden">
        <h2 class="text-xl font-semibold mb-4">Create Account</h2>
        <form id="register_modal" class="space-y-4">
          <div>
            <label class="block text-sm mb-1">Full Name</label>
            <input id="r_name" type="text" class="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
          </div>
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input id="r_email" type="email" class="w-full px-3 py-2 rounded bg-white/5 border border-white/10" required />
          </div>
          <button class="w-full py-2 rounded bg-emerald-500/80 hover:bg-emerald-500">Create Account</button>
          <p id="r_msg_modal" class="text-sm mt-2 min-h-[1.25rem]"></p>
        </form>
        <div class="mt-4 text-sm text-center opacity-90">
          Already have an account? <button id="goSignIn" class="underline hover:no-underline text-blue-300">Sign In</button>
        </div>
      </div>

    </div>
  </div>
</div>
`;

// Inject header/footer/modal once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const h = document.getElementById('siteHeader');
  if (h) h.innerHTML = headerHTML;

  const f = document.getElementById('siteFooter');
  if (f) f.innerHTML = footerHTML;

  if (!document.getElementById('authOverlay')) {
    document.body.insertAdjacentHTML('beforeend', authModalHTML);
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  wireNavBasics();
});

// Simple mobile toggle
function wireNavBasics() {
  const mm = document.getElementById('mobileMenu');
  const open = document.getElementById('mobileOpen');
  if (open && mm) open.onclick = () => mm.classList.toggle('hidden');

  // Close on route change (basic)
  document.querySelectorAll('#mobileMenu a').forEach(a => {
    a.addEventListener('click', () => mm.classList.add('hidden'));
  });
}

// ========= Toasts
function toast(msg, kind='info'){
  const host = document.getElementById('toastHost'); if(!host) return;
  const base = document.createElement('div');
  base.className = `px-4 py-3 rounded-xl text-sm shadow-2xl border ${
    kind==='error' ? 'bg-rose-600/90 border-rose-400/40' :
    kind==='success' ? 'bg-emerald-600/90 border-emerald-400/40' :
    'bg-slate-800/90 border-white/10'
  }`;
  base.textContent = msg;
  host.appendChild(base);
  setTimeout(()=>{ base.classList.add('opacity-0','translate-y-1'); }, 2400);
  setTimeout(()=>{ base.remove(); }, 3000);
}

// ========= Firebase (Auth only)
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Modal handles
function openAuth() {
  const overlay = document.getElementById('authOverlay');
  const signInView = document.getElementById('authSignIn');
  const registerView = document.getElementById('authRegister');
  overlay.classList.remove('hidden'); overlay.classList.add('flex');
  signInView.classList.remove('hidden'); registerView.classList.add('hidden');
}

document.addEventListener('click', e=>{
  if (e.target?.id === 'navGetStarted' || e.target?.id === 'mobileGetStarted' || e.target?.id === 'ctaJoinNow') {
    e.preventDefault();
    if (!auth.currentUser) openAuth();
  }
});

document.addEventListener('click', e=>{
  if (e.target?.id === 'authClose') {
    const overlay = document.getElementById('authOverlay');
    overlay.classList.add('hidden'); overlay.classList.remove('flex');
  }
  if (e.target?.id === 'goRegister') {
    document.getElementById('authSignIn').classList.add('hidden');
    document.getElementById('authRegister').classList.remove('hidden');
  }
  if (e.target?.id === 'goSignIn') {
    document.getElementById('authRegister').classList.add('hidden');
    document.getElementById('authSignIn').classList.remove('hidden');
  }
});

// Profile dropdown
document.addEventListener('click', (e)=>{
  const btn = document.getElementById('profileBtn');
  const menu= document.getElementById('profileMenu');
  if (!btn || !menu) return;
  if (e.target === btn || btn.contains(e.target)) {
    menu.classList.toggle('hidden');
  } else if (!menu.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// Auth state → UI
onAuthStateChanged(auth, async (user) => {
  const navGetStarted = document.getElementById('navGetStarted');
  const profileBtn    = document.getElementById('profileBtn');
  const profileName   = document.getElementById('profileName');
  const profileAvatar = document.getElementById('profileAvatar');
  const mobileGet     = document.getElementById('mobileGetStarted');
  const mobileWelcome = document.getElementById('mobileWelcome');
  const mobileSignOut = document.getElementById('mobileSignOut');
  const ctaJoin       = document.getElementById('ctaJoinNow');
  const ctaAdmin      = document.getElementById('ctaAdmin');

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

    if (navGetStarted) navGetStarted.classList.add('hidden');
    if (profileBtn) profileBtn.classList.remove('hidden');
    if (profileName) profileName.textContent = name;
    if (profileAvatar) profileAvatar.textContent = init;

    if (ctaJoin) ctaJoin.classList.add('hidden');
    if (ctaAdmin) ctaAdmin.classList.remove('hidden');

    if (mobileGet) mobileGet.classList.add('hidden');
    if (mobileWelcome) { mobileWelcome.classList.remove('hidden'); mobileWelcome.textContent = `Welcome, ${name}`; }
    if (mobileSignOut) mobileSignOut.classList.remove('hidden');

  } else {
    if (profileBtn) profileBtn.classList.add('hidden');
    const pm = document.getElementById('profileMenu'); if (pm) pm.classList.add('hidden');
    if (navGetStarted) navGetStarted.classList.remove('hidden');

    if (ctaJoin) ctaJoin.classList.remove('hidden');
    if (ctaAdmin) ctaAdmin.classList.add('hidden');

    if (mobileGet) mobileGet.classList.remove('hidden');
    if (mobileWelcome) mobileWelcome.classList.add('hidden');
    if (mobileSignOut) mobileSignOut.classList.add('hidden');
  }
});

// Sign in
document.addEventListener('submit', async (e)=>{
  if (e.target?.id !== 'signin_modal') return;
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pw    = document.getElementById('password').value;
  const box   = document.getElementById('error');
  box.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    document.getElementById('authOverlay').classList.add('hidden');
    document.getElementById('authOverlay').classList.remove('flex');
    toast('Signed in ✅', 'success');
  } catch (err) {
    const msg = (err?.message || 'Sign-in failed').replace('Firebase: ','');
    box.textContent = msg;
    toast(msg, 'error');
  }
});

// Register
document.addEventListener('submit', async (e)=>{
  if (e.target?.id !== 'register_modal') return;
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
      document.getElementById('authSignIn').classList.remove('hidden');
      document.getElementById('authRegister').classList.add('hidden');
    }, 1200);
  } catch (err) {
    const m = (err?.message || 'Registration failed').replace('Firebase: ','');
    msg.style.color = 'salmon';
    msg.textContent = m;
    toast(m, 'error');
  }
});

// Forgot password
document.addEventListener('click', async (e)=>{
  if (e.target?.id !== 'getTempModal') return;
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

// Sign out (desktop + mobile)
document.addEventListener('click', async (e)=>{
  if (e.target?.id === 'btnSignOut' || e.target?.id === 'mobileSignOut') {
    await signOut(auth);
    const mm = document.getElementById('mobileMenu');
    if (mm) mm.classList.add('hidden');
    toast('Signed out', 'info');
  }
});

// ========= Teams map for logos (jpeg files)
const TEAMS = {
  "desert-falcons": { name: "Desert Falcons", logo: "assets/logos/desert-falcons.jpeg" },
  "globo-boomerangs": { name: "Globo Boomerangs", logo: "assets/logos/globo-boomerangs.jpeg" },
  "ice-breakers": { name: "Ice Breakers", logo: "assets/logos/ice-breakers.jpeg" },
  "baltic-blades": { name: "Baltic Blades", logo: "assets/logos/baltic-blades.jpeg" },
  "avalanche-aces": { name: "Avalanche Aces", logo: "assets/logos/avalanche-aces.jpeg" },
  "rulo-apaches": { name: "Rulo Apaches", logo: "assets/logos/rulo-apaches.jpeg" },
  "samurai-kicksmashers": { name: "Samurai Kicksmashers", logo: "assets/logos/samurai-kicksmashers.jpeg" },
  "sonic-viboras": { name: "Sonic Viboras", logo: "assets/logos/sonic-viboras.jpeg" }
};

// ========= Fixtures Data (exactly as you supplied)
const PREMIER = [
  [1,1,"Play360","Monday, 15 September 2025","Rulo Apaches","Samurai Kick Smashers"],
  [1,2,"Play360","Tuesday, 16 September 2025","Desert Falcons","Baltic Blades"],
  [1,3,"Play360","Wednesday, 17 September 2025","Globo Boomerangs","Sonic Viboras"],
  [1,4,"Play360","Thursday, 18 September 2025","Ice Breakers","Avalanche Aces"],
  [2,5,"Play360","Thursday, 25 September 2025","Samurai Kick Smashers","Desert Falcons"],
  [2,6,"Play360","Monday, 22 September 2025","Avalanche Aces","Rulo Apaches"],
  [2,7,"Play360","Tuesday, 23 September 2025","Sonic Viboras","Ice Breakers"],
  [2,8,"Play360","Friday, 26 September 2025","Baltic Blades","Globo Boomerangs"],
  [3,9,"Play360","Tuesday, 30 September 2025","Desert Falcons","Avalanche Aces"],
  [3,10,"Play360","Wednesday, 15 October 2025","Samurai Kick Smashers","Baltic Blades"],
  [3,11,"Play360","Monday, 29 September 2025","Rulo Apaches","Sonic Viboras"],
  [3,12,"Play360","Tuesday, 14 October 2025","Ice Breakers","Globo Boomerangs"],
  [4,13,"Play360","Thursday, 23 October 2025","Baltic Blades","Sonic Viboras"],
  [4,14,"Play360","Wednesday, 22 October 2025","Desert Falcons","Rulo Apaches"],
  [4,15,"Play360","Tuesday, 21 October 2025","Avalanche Aces","Globo Boomerangs"],
  [4,16,"Play360","Monday, 20 October 2025","Samurai Kick Smashers","Ice Breakers"],
  [5,17,"Play360","Thursday, 30 October 2025","Rulo Apaches","Baltic Blades"],
  [5,18,"Play360","Monday, 27 October 2025","Globo Boomerangs","Samurai Kick Smashers"],
  [5,19,"Play360","Tuesday, 28 October 2025","Ice Breakers","Desert Falcons"],
  [5,20,"Play360","Wednesday, 29 October 2025","Sonic Viboras","Avalanche Aces"],
  [6,21,"Play360","Thursday, 06 November 2025","Baltic Blades","Avalanche Aces"],
  [6,22,"Play360","Monday, 03 November 2025","Desert Falcons","Globo Boomerangs"],
  [6,23,"Play360","Wednesday, 05 November 2025","Rulo Apaches","Ice Breakers"],
  [6,24,"Play360","Tuesday, 04 November 2025","Samurai Kick Smashers","Sonic Viboras"],
  [7,25,"Play360","Wednesday, 12 November 2025","Globo Boomerangs","Rulo Apaches"],
  [7,26,"Play360","Monday, 10 November 2025","Baltic Blades","Ice Breakers"],
  [7,27,"Play360","Tuesday, 11 November 2025","Sonic Viboras","Desert Falcons"],
  [7,28,"Play360","Thursday, 13 November 2025","Avalanche Aces","Samurai Kick Smashers"],
  ["",29,"Play360","Monday, 24 November 2025","Play off 1",""],
  ["",30,"Play360","Tuesday, 25 November 2025","Play off 2",""],
  ["",31,"Play360","Monday, 01 December 2025","Play off 3",""],
  ["",32,"Play360","Saturday, 06 December 2025","FINALS: Premier",""]
];

const CHAMPS = [
  [1,1,"PADEL24","Monday, 15 September 2025","Globo Boomerangs","Sonic Viboras"],
  [1,2,"PADEL24","Monday, 15 September 2025","Ice Breakers","Avalanche Aces"],
  [1,3,"PADEL24","Wednesday, 17 September 2025","Rulo Apaches","Samurai Kicksmashers"],
  [1,4,"PADEL24","Wednesday, 17 September 2025","Desert Falcons","Baltic Blades"],
  [2,5,"PADEL24","Thursday, 25 September 2025","Avalanche Aces","Rulo Apaches"],
  [2,6,"PADEL24","Thursday, 25 September 2025","Sonic Viboras","Ice Breakers"],
  [2,7,"PADEL24","Monday, 22 September 2025","Samurai Kicksmashers","Desert Falcons"],
  [2,8,"PADEL24","Monday, 22 September 2025","Baltic Blades","Globo Boomerangs"],
  [3,9,"PADEL24","Monday, 29 September 2025","Ice Breakers","Globo Boomerangs"],
  [3,10,"PADEL24","Monday, 29 September 2025","Samurai Kicksmashers","Baltic Blades"],
  [3,11,"PADEL24","Thursday, 16 October 2025","Rulo Apaches","Sonic Viboras"],
  [3,12,"PADEL24","Thursday, 16 October 2025","Desert Falcons","Avalanche Aces"],
  [4,13,"PADEL24","Monday, 20 October 2025","Desert Falcons","Rulo Apaches"],
  [4,14,"PADEL24","Monday, 20 October 2025","Baltic Blades","Sonic Viboras"],
  [4,15,"PADEL24","Wednesday, 22 October 2025","Samurai Kicksmashers","Ice Breakers"],
  [4,16,"PADEL24","Wednesday, 22 October 2025","Avalanche Aces","Globo Boomerangs"],
  [5,17,"PADEL24","Monday, 27 October 2025","Sonic Viboras","Avalanche Aces"],
  [5,18,"PADEL24","Monday, 27 October 2025","Rulo Apaches","Baltic Blades"],
  [5,19,"PADEL24","Wednesday, 29 October 2025","Globo Boomerangs","Samurai Kicksmashers"],
  [5,20,"PADEL24","Wednesday, 29 October 2025","Ice Breakers","Desert Falcons"],
  [6,21,"PADEL24","Monday, 03 November 2025","Rulo Apaches","Ice Breakers"],
  [6,22,"PADEL24","Monday, 03 November 2025","Baltic Blades","Avalanche Aces"],
  [6,23,"PADEL24","Wednesday, 05 November 2025","Desert Falcons","Globo Boomerangs"],
  [6,24,"PADEL24","Wednesday, 05 November 2025","Samurai Kicksmashers","Sonic Viboras"],
  [7,25,"PADEL24","Monday, 10 November 2025","Globo Boomerangs","Rulo Apaches"],
  [7,26,"PADEL24","Monday, 10 November 2025","Avalanche Aces","Samurai Kicksmashers"],
  [7,27,"PADEL24","Wednesday, 12 November 2025","Baltic Blades","Ice Breakers"],
  [7,28,"PADEL24","Wednesday, 12 November 2025","Sonic Viboras","Desert Falcons"],
  ["",29,"PADEL24","Wednesday, 26 November 2025","Play off 1",""],
  ["",30,"PADEL24","Wednesday, 26 November 2025","Play off 2",""],
  ["",31,"PADEL24","Tuesday, 02 December 2025","Play off 3",""],
  ["",32,"Play360","Saturday, 06 December 2025","FINALS: Championship",""]
];

// ========= Render Home Round 1 fixtures
function teamLogoByName(name) {
  const key = Object.keys(TEAMS).find(k => TEAMS[k].name.toLowerCase() === name.toLowerCase());
  return key ? TEAMS[key].logo : 'assets/logos/desert-falcons.jpeg';
}

function round1CardsBlock(title, data, venueFilter=null) {
  // pick the first four rows for round 1 (match 1..4)
  const r1 = data.filter(r => r[0]===1).slice(0,4);
  const cards = r1.map(([round,match,venue,date,home,away])=>{
    const hLogo = teamLogoByName(home);
    const aLogo = teamLogoByName(away);
    return `
      <div class="fixture-card">
        <div class="text-xs text-gray-300 mb-1">${date}</div>
        <div class="text-[11px] text-gray-400 mb-2">${venue}</div>
        <div class="fixture-row">
          <img class="logo32" src="${hLogo}" alt="${home}">
          <div class="team-name">${home}</div>
          <span class="vs-chip">vs</span>
          <div class="team-name">${away}</div>
          <img class="logo32" src="${aLogo}" alt="${away}">
        </div>
      </div>`;
  }).join('');

  return `
    <div class="round-wrap">
      <div class="round-title">${title}</div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${cards}
      </div>
    </div>
  `;
}

function renderHomeRound1() {
  const host = document.getElementById('homeRound1'); if (!host) return;
  host.innerHTML = [
    round1CardsBlock('Premier', PREMIER),
    round1CardsBlock('Championship', CHAMPS)
  ].join('');
}
renderHomeRound1();

// ========= Render full schedule (if schedule table exists)
function renderSchedulePage() {
  const tbody = document.querySelector('#schedule-table tbody'); if (!tbody) return;
  const tierSel = document.getElementById('filter-tier');
  const venueSel= document.getElementById('filter-venue');

  const all = [
    ...PREMIER.map(([round,match,venue,date,h,a])=>({round,match,tier:'Premier',venue,date,fixture:`${h} vs ${a}`})),
    ...CHAMPS.map(([round,match,venue,date,h,a])=>({round,match,tier:'Championship',venue,date,fixture:`${h} vs ${a}`}))
  ];

  function paint() {
    const t = tierSel.value, v = venueSel.value;
    const rows = all.filter(r =>
      (t==='all'||r.tier===t) && (v==='all'||r.venue===v)
    );
    tbody.innerHTML = rows.map(r=>`
      <tr class="border-b border-white/5 hover:bg-white/5">
        <td class="p-4">${r.round||''}</td>
        <td class="p-4">${r.match}</td>
        <td class="p-4">${r.tier}</td>
        <td class="p-4">${r.venue}</td>
        <td class="p-4">${r.date}</td>
        <td class="p-4">${r.fixture}</td>
        <td class="p-4">Scheduled</td>
      </tr>`).join('');
  }

  tierSel.onchange = paint;
  venueSel.onchange= paint;
  paint();

  // CSV export
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) exportBtn.onclick = ()=>{
    const rows = [['Round','Match','Tier','Venue','Date','Fixture','Status']].concat(
      [...tbody.querySelectorAll('tr')].map(tr=>
        [...tr.querySelectorAll('td')].map(td=>td.textContent.trim())
      )
    );
    const csv = rows.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
    const a = document.createElement('a'); a.href=url; a.download='schedule.csv'; a.click(); URL.revokeObjectURL(url);
  };
}
renderSchedulePage();
