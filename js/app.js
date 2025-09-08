// =========================
// Shared UI + Firebase + Data + Rendering
// =========================

// Firebase (client-side)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// --- Your Firebase config (already provided earlier) ---
const firebaseConfig = {
  apiKey: "AIzaSyCqJkzXzw9MgLFBZRvbnp8OthXWzSr2aBs",
  authDomain: "padelpro-c24b0.firebaseapp.com",
  projectId: "padelpro-c24b0",
  storageBucket: "padelpro-c24b0.firebasestorage.app",
  messagingSenderId: "882509576352",
  appId: "1:882509576352:web:353877bde27dc6416971c5"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// =========================
// Header/Footer Injection (consistent across pages)
// =========================
const headerHTML = `
<nav id="topnav" class="bg-black/70 backdrop-blur-sm fixed w-full z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <a href="index.html" class="flex items-center gap-2">
        <span class="text-2xl">🏓</span>
        <span class="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Padel Pro</span>
      </a>
      <div class="hidden md:flex items-center gap-6">
        <a href="index.html" class="hover:text-blue-400">Home</a>
        <a href="index.html#franchises" class="hover:text-blue-400">Franchises</a>
        <a href="schedules.html" class="hover:text-blue-400">Schedules</a>
        <a href="live.html" class="hover:text-blue-400">Live</a>
        <a href="fantasy.html" class="hover:text-blue-400">Fantasy</a>
        <a href="marketplace.html" class="hover:text-blue-400">Marketplace</a>

        <!-- Logged OUT -->
        <a href="#" id="navGetStarted"
           class="hidden md:inline-flex bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition">
          Sign In / Register
        </a>

        <!-- Logged IN -->
        <div class="relative">
          <button id="profileBtn" class="hidden group relative flex items-center gap-3 rounded-full px-3 py-1.5 hover:bg-white/10 transition">
            <span id="profileAvatar" class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 grid place-items-center font-semibold">U</span>
            <span id="profileName" class="text-sm"></span>
            <i class="fa-solid fa-chevron-down text-xs opacity-70"></i>
          </button>
          <div id="profileMenu"
               class="hidden absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0b0f1a]/95 backdrop-blur shadow-2xl overflow-hidden">
            <a href="index.html#franchises" class="block px-4 py-2.5 hover:bg-white/5 text-sm">Franchises</a>
            <a href="schedules.html" class="block px-4 py-2.5 hover:bg-white/5 text-sm">Schedules</a>
            <a href="live.html" class="block px-4 py-2.5 hover:bg-white/5 text-sm">Live</a>
            <a href="dashboard.html" class="block px-4 py-2.5 hover:bg-white/5 text-sm">Dashboard</a>
            <button id="btnSignOut" class="w-full text-left px-4 py-2.5 hover:bg-white/5 text-sm">Sign out</button>
          </div>
        </div>

      </div>

      <!-- Mobile -->
      <div class="md:hidden flex items-center">
        <button id="mobileToggle" class="text-white" aria-label="Open menu">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
  </div>

  <div id="mobileMenu" class="hidden md:hidden bg-black/95 border-t border-white/10">
    <div class="px-3 pt-2 pb-3 space-y-1">
      <a href="index.html" class="block px-3 py-2 hover:bg-white/5 rounded">Home</a>
      <a href="index.html#franchises" class="block px-3 py-2 hover:bg-white/5 rounded">Franchises</a>
      <a href="schedules.html" class="block px-3 py-2 hover:bg-white/5 rounded">Schedules</a>
      <a href="live.html" class="block px-3 py-2 hover:bg-white/5 rounded">Live</a>
      <a href="fantasy.html" class="block px-3 py-2 hover:bg-white/5 rounded">Fantasy</a>
      <a href="marketplace.html" class="block px-3 py-2 hover:bg-white/5 rounded">Marketplace</a>

      <a href="#" id="mobileGetStarted" class="block w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-center">
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
<footer class="bg-black/80 mt-14">
  <div class="max-w-7xl mx-auto px-4 py-10 text-center text-gray-400">
    © <span id="year"></span> Nomz. All rights reserved.
  </div>
</footer>
`;

// Inject on all pages
document.getElementById('siteHeader')?.insertAdjacentHTML('afterbegin', headerHTML);
document.getElementById('siteFooter')?.insertAdjacentHTML('afterbegin', footerHTML);

// Small helpers
const byId = (id) => document.getElementById(id);
const setYear = () => { const y = byId('year'); if (y) y.textContent = new Date().getFullYear(); };
setYear();

// Mobile toggle
byId('mobileToggle')?.addEventListener('click', ()=>{
  byId('mobileMenu')?.classList.toggle('hidden');
});

// Profile dropdown
byId('profileBtn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  byId('profileMenu')?.classList.toggle('hidden');
});
document.addEventListener('click', (e)=>{
  const menu = byId('profileMenu');
  const btn  = byId('profileBtn');
  if (menu && btn && !menu.classList.contains('hidden')) {
    const inside = menu.contains(e.target) || btn.contains(e.target);
    if (!inside) menu.classList.add('hidden');
  }
});

// =========================
// Auth Modal (constructed once)
// =========================
const authModal = `
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
if (!byId('authOverlay')) {
  document.body.insertAdjacentHTML('beforeend', authModal);
}

// Open/close modal
['navGetStarted','mobileGetStarted'].forEach(id=>{
  const btn = byId(id); if(!btn) return;
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    byId('authOverlay').classList.remove('hidden');
    byId('authOverlay').classList.add('flex');
    byId('authSignIn').classList.remove('hidden');
    byId('authRegister').classList.add('hidden');
  });
});
byId('authClose')?.addEventListener('click', ()=>{
  const o=byId('authOverlay'); o.classList.add('hidden'); o.classList.remove('flex');
});
byId('goRegister')?.addEventListener('click', ()=>{
  byId('authSignIn').classList.add('hidden');
  byId('authRegister').classList.remove('hidden');
});
byId('goSignIn')?.addEventListener('click', ()=>{
  byId('authRegister').classList.add('hidden');
  byId('authSignIn').classList.remove('hidden');
});

// =========================
// Auth state → header UI
// =========================
onAuthStateChanged(auth, async (user) => {
  const navGetStarted = byId('navGetStarted');
  const profileBtn    = byId('profileBtn');
  const profileName   = byId('profileName');
  const profileAvatar = byId('profileAvatar');
  const mobileGet     = byId('mobileGetStarted');
  const mobileWelcome = byId('mobileWelcome');
  const mobileSignOut = byId('mobileSignOut');

  if (user) {
    // ensure user doc
    try {
      const uref = doc(db, 'users', user.uid);
      const snap = await getDoc(uref);
      if (!snap.exists()) {
        await setDoc(uref, {
          uid: user.uid, name: user.displayName || '', email: user.email || '',
          role: 'player', createdAt: serverTimestamp()
        });
      }
    } catch { /* ignore */ }

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    if (navGetStarted) navGetStarted.classList.add('hidden');
    if (profileBtn)    profileBtn.classList.remove('hidden');
    if (profileName)   profileName.textContent = name;
    if (profileAvatar) profileAvatar.textContent = init;

    if (mobileGet)     mobileGet.classList.add('hidden');
    if (mobileWelcome) { mobileWelcome.classList.remove('hidden'); mobileWelcome.textContent = `Welcome, ${name}`; }
    if (mobileSignOut) mobileSignOut.classList.remove('hidden');
  } else {
    if (profileBtn)    profileBtn.classList.add('hidden');
    byId('profileMenu')?.classList.add('hidden');
    if (navGetStarted) navGetStarted.classList.remove('hidden');

    if (mobileGet)     mobileGet.classList.remove('hidden');
    if (mobileWelcome) mobileWelcome.classList.add('hidden');
    if (mobileSignOut) mobileSignOut.classList.add('hidden');
  }
});

// Sign in
byId('signin_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = byId('email').value.trim();
  const pw    = byId('password').value;
  const box   = byId('error');
  box.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    const o=byId('authOverlay'); o.classList.add('hidden'); o.classList.remove('flex');
  } catch (err) {
    box.textContent = (err?.message || 'Sign-in failed').replace('Firebase: ','');
  }
});

// Register
byId('register_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name  = byId('r_name').value.trim();
  const email = byId('r_email').value.trim();
  const msg   = byId('r_msg_modal');
  msg.style.color=''; msg.textContent='';
  const tempPw = Math.random().toString(36).slice(-10) + "Aa1!";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, tempPw);
    if (name) await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), { uid:cred.user.uid, name, email, role:'player', createdAt: serverTimestamp() });
    await sendPasswordResetEmail(auth, email);
    msg.style.color='lightgreen';
    msg.textContent = 'Account created. Check your email to set your password.';
    // swap back to sign-in
    setTimeout(()=>{
      byId('authSignIn').classList.remove('hidden');
      byId('authRegister').classList.add('hidden');
    }, 1200);
  } catch (err) {
    msg.style.color='salmon';
    msg.textContent = (err?.message || 'Registration failed').replace('Firebase: ','');
  }
});

// Forgot password
byId('getTempModal')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = byId('email').value.trim();
  const msg   = byId('tempMsgModal');
  msg.style.color=''; msg.textContent='';
  if (!email) { msg.style.color='salmon'; msg.textContent='Enter your email above first.'; return; }
  try {
    await sendPasswordResetEmail(auth, email);
    msg.style.color='lightgreen'; msg.textContent='Reset link sent. Check your inbox/spam.';
  } catch (err) {
    msg.style.color='salmon'; msg.textContent=(err?.message || 'Could not send reset email').replace('Firebase: ','');
  }
});

// Sign out
byId('btnSignOut')?.addEventListener('click', async ()=>{ await signOut(auth); });
byId('mobileSignOut')?.addEventListener('click', async ()=>{
  await signOut(auth);
  byId('mobileMenu')?.classList.add('hidden');
});

// =========================
// Schedule Data (EXACTLY as you provided) + helpers
// =========================

// Utility: team slug mapping for logo files
const teamSlug = (name)=>{
  const map = {
    "Rulo Apaches":"rulo-apaches",
    "Samurai Kick Smashers":"samurai-kicksmashers",
    "Samurai Kicksmashers":"samurai-kicksmashers",
    "Desert Falcons":"desert-falcons",
    "Baltic Blades":"baltic-blades",
    "Globo Boomerangs":"globo-boomerangs",
    "Sonic Viboras":"sonic-viboras",
    "Ice Breakers":"ice-breakers",
    "Avalanche Aces":"avalanche-aces"
  };
  return map[name] || "desert-falcons";
};

// Championship fixtures (1..32) EXACT TEXT
const CHAMPIONSHIP = [
  { round:1, match:1,  tier:"Championship", venue:"PADEL24", date:"Monday, 15 September 2025", fixture:"Globo Boomerangs - Sonic Viboras" },
  { round:1, match:2,  tier:"Championship", venue:"PADEL24", date:"Monday, 15 September 2025", fixture:"Ice Breakers - Avalanche Aces" },
  { round:1, match:3,  tier:"Championship", venue:"PADEL24", date:"Wednesday, 17 September 2025", fixture:"Rulo Apaches - Samurai Kicksmashers" },
  { round:1, match:4,  tier:"Championship", venue:"PADEL24", date:"Wednesday, 17 September 2025", fixture:"Desert Falcons - Baltic Blades" },
  { round:2, match:5,  tier:"Championship", venue:"PADEL24", date:"Thursday, 25 September 2025", fixture:"Avalanche Aces - Rulo Apaches" },
  { round:2, match:6,  tier:"Championship", venue:"PADEL24", date:"Thursday, 25 September 2025", fixture:"Sonic Viboras - Ice Breakers" },
  { round:2, match:7,  tier:"Championship", venue:"PADEL24", date:"Monday, 22 September 2025", fixture:"Samurai Kicksmashers  - Desert Falcons" },
  { round:2, match:8,  tier:"Championship", venue:"PADEL24", date:"Monday, 22 September 2025", fixture:"Baltic Blades - Globo Boomerangs" },
  { round:3, match:9,  tier:"Championship", venue:"PADEL24", date:"Monday, 29 September 2025", fixture:"Ice Breakers - Globo Boomerangs" },
  { round:3, match:10, tier:"Championship", venue:"PADEL24", date:"Monday, 29 September 2025", fixture:"Samurai Kicksmashers - Baltic Blades" },
  { round:3, match:11, tier:"Championship", venue:"PADEL24", date:"Thursday, 16 October 2025", fixture:"Rulo Apaches - Sonic Viboras" },
  { round:3, match:12, tier:"Championship", venue:"PADEL24", date:"Thursday, 16 October 2025", fixture:"Desert Falcons - Avalanche Aces" },
  { round:4, match:13, tier:"Championship", venue:"PADEL24", date:"Monday, 20 October 2025", fixture:"Desert Falcons - Rulo Apaches" },
  { round:4, match:14, tier:"Championship", venue:"PADEL24", date:"Monday, 20 October 2025", fixture:"Baltic Blades - Sonic Viboras" },
  { round:4, match:15, tier:"Championship", venue:"PADEL24", date:"Wednesday, 22 October 2025", fixture:"Samurai Kicksmashers  - Ice Breakers" },
  { round:4, match:16, tier:"Championship", venue:"PADEL24", date:"Wednesday, 22 October 2025", fixture:"Avalanche Aces - Globo Boomerangs" },
  { round:5, match:17, tier:"Championship", venue:"PADEL24", date:"Monday, 27 October 2025", fixture:"Sonic Viboras - Avalanche Aces" },
  { round:5, match:18, tier:"Championship", venue:"PADEL24", date:"Monday, 27 October 2025", fixture:"Rulo Apaches - Baltic Blades" },
  { round:5, match:19, tier:"Championship", venue:"PADEL24", date:"Wednesday, 29 October 2025", fixture:"Globo Boomerangs - Samurai Kicksmashers" },
  { round:5, match:20, tier:"Championship", venue:"PADEL24", date:"Wednesday, 29 October 2025", fixture:"Ice Breakers - Desert Falcons" },
  { round:6, match:21, tier:"Championship", venue:"PADEL24", date:"Monday, 03 November 2025", fixture:"Rulo Apaches - Ice Breakers" },
  { round:6, match:22, tier:"Championship", venue:"PADEL24", date:"Monday, 03 November 2025", fixture:"Baltic Blades - Avalanche Aces" },
  { round:6, match:23, tier:"Championship", venue:"PADEL24", date:"Wednesday, 05 November 2025", fixture:"Desert Falcons - Globo Boomerangs" },
  { round:6, match:24, tier:"Championship", venue:"PADEL24", date:"Wednesday, 05 November 2025", fixture:"Samurai Kicksmashers - Sonic Viboras" },
  { round:7, match:25, tier:"Championship", venue:"PADEL24", date:"Monday, 10 November 2025", fixture:"Globo Boomerangs - Rulo Apaches" },
  { round:7, match:26, tier:"Championship", venue:"PADEL24", date:"Monday, 10 November 2025", fixture:"Avalanche Aces - Samurai Kicksmashers" },
  { round:7, match:27, tier:"Championship", venue:"PADEL24", date:"Wednesday, 12 November 2025", fixture:"Baltic Blades - Ice Breakers" },
  { round:7, match:28, tier:"Championship", venue:"PADEL24", date:"Wednesday, 12 November 2025", fixture:"Sonic Viboras - Desert Falcons" },
  { round:null, match:29, tier:"Championship", venue:"PADEL24", date:"Wednesday, 26 November 2025", fixture:"Play off 1" },
  { round:null, match:30, tier:"Championship", venue:"PADEL24", date:"Wednesday, 26 November 2025", fixture:"Play off 2" },
  { round:null, match:31, tier:"Championship", venue:"PADEL24", date:"Tuesday, 02 December 2025", fixture:"Play off 3" },
  { round:null, match:32, tier:"Championship", venue:"Play360", date:"Saturday, 06 December 2025", fixture:"FINALS: Championship" },
];

// Premier fixtures (1..32) EXACT TEXT
const PREMIER = [
  { round:1, match:1,  tier:"Premier", venue:"Play360", date:"Monday, 15 September 2025", fixture:"Rulo Apaches - Samurai Kick Smashers" },
  { round:1, match:2,  tier:"Premier", venue:"Play360", date:"Tuesday, 16 September 2025", fixture:"Desert Falcons - Baltic Blades" },
  { round:1, match:3,  tier:"Premier", venue:"Play360", date:"Wednesday, 17 September 2025", fixture:"Globo Boomerangs - Sonic Viboras" },
  { round:1, match:4,  tier:"Premier", venue:"Play360", date:"Thursday, 18 September 2025", fixture:"Ice Breakers - Avalanche Aces" },
  { round:2, match:5,  tier:"Premier", venue:"Play360", date:"Thursday, 25 September 2025", fixture:"Samurai Kick Smashers - Desert Falcons" },
  { round:2, match:6,  tier:"Premier", venue:"Play360", date:"Monday, 22 September 2025", fixture:"Avalanche Aces - Rulo Apaches" },
  { round:2, match:7,  tier:"Premier", venue:"Play360", date:"Tuesday, 23 September 2025", fixture:"Sonic Viboras - Ice Breakers" },
  { round:2, match:8,  tier:"Premier", venue:"Play360", date:"Friday, 26 September 2025", fixture:"Baltic Blades - Globo Boomerangs" },
  { round:3, match:9,  tier:"Premier", venue:"Play360", date:"Tuesday, 30 September 2025", fixture:"Desert Falcons - Avalanche Aces" },
  { round:3, match:10, tier:"Premier", venue:"Play360", date:"Wednesday, 15 October 2025", fixture:"Samurai Kick Smashers - Baltic Blades" },
  { round:3, match:11, tier:"Premier", venue:"Play360", date:"Monday, 29 September 2025", fixture:"Rulo Apaches - Sonic Viboras" },
  { round:3, match:12, tier:"Premier", venue:"Play360", date:"Tuesday, 14 October 2025", fixture:"Ice Breakers - Globo Boomerangs" },
  { round:4, match:13, tier:"Premier", venue:"Play360", date:"Thursday, 23 October 2025", fixture:"Baltic Blades - Sonic Viboras" },
  { round:4, match:14, tier:"Premier", venue:"Play360", date:"Wednesday, 22 October 2025", fixture:"Desert Falcons - Rulo Apaches" },
  { round:4, match:15, tier:"Premier", venue:"Play360", date:"Tuesday, 21 October 2025", fixture:"Avalanche Aces - Globo Boomerangs" },
  { round:4, match:16, tier:"Premier", venue:"Play360", date:"Monday, 20 October 2025", fixture:"Samurai Kick Smashers - Ice Breakers" },
  { round:5, match:17, tier:"Premier", venue:"Play360", date:"Thursday, 30 October 2025", fixture:"Rulo Apaches - Baltic Blades" },
  { round:5, match:18, tier:"Premier", venue:"Play360", date:"Monday, 27 October 2025", fixture:"Globo Boomerangs - Samurai Kick Smashers" },
  { round:5, match:19, tier:"Premier", venue:"Play360", date:"Tuesday, 28 October 2025", fixture:"Ice Breakers - Desert Falcons" },
  { round:5, match:20, tier:"Premier", venue:"Play360", date:"Wednesday, 29 October 2025", fixture:"Sonic Viboras - Avalanche Aces" },
  { round:6, match:21, tier:"Premier", venue:"Play360", date:"Thursday, 06 November 2025", fixture:"Baltic Blades - Avalanche Aces" },
  { round:6, match:22, tier:"Premier", venue:"Play360", date:"Monday, 03 November 2025", fixture:"Desert Falcons - Globo Boomerangs" },
  { round:6, match:23, tier:"Premier", venue:"Play360", date:"Wednesday, 05 November 2025", fixture:"Rulo Apaches - Ice Breakers" },
  { round:6, match:24, tier:"Premier", venue:"Play360", date:"Tuesday, 04 November 2025", fixture:"Samurai Kick Smashers - Sonic Viboras" },
  { round:7, match:25, tier:"Premier", venue:"Play360", date:"Wednesday, 12 November 2025", fixture:"Globo Boomerangs - Rulo Apaches" },
  { round:7, match:26, tier:"Premier", venue:"Play360", date:"Monday, 10 November 2025", fixture:"Baltic Blades - Ice Breakers" },
  { round:7, match:27, tier:"Premier", venue:"Play360", date:"Tuesday, 11 November 2025", fixture:"Sonic Viboras - Desert Falcons" },
  { round:7, match:28, tier:"Premier", venue:"Play360", date:"Thursday, 13 November 2025", fixture:"Avalanche Aces - Samurai Kick Smashers" },
  { round:null, match:29, tier:"Premier", venue:"Play360", date:"Monday, 24 November 2025", fixture:"Play off 1" },
  { round:null, match:30, tier:"Premier", venue:"Play360", date:"Tuesday, 25 November 2025", fixture:"Play off 2" },
  { round:null, match:31, tier:"Premier", venue:"Play360", date:"Monday, 01 December 2025", fixture:"Play off 3" },
  { round:null, match:32, tier:"Premier", venue:"Play360", date:"Saturday, 06 December 2025", fixture:"FINALS: Premier" },
];

// replace " - " with " vs " for display
const vs = (txt)=> txt.replace(/\s-\s/g, ' vs ');

// Render a small row (home, Round 1)
const renderSmallFixture = (f) => {
  // try to extract teams for logos
  const parts = f.fixture.split('-');
  let A = parts[0]?.trim() || f.fixture, B = parts[1]?.trim() || '';
  // normalize variant
  if (A === "Samurai Kicksmashers") A = "Samurai Kick Smashers";
  if (B === "Samurai Kicksmashers") B = "Samurai Kick Smashers";
  const aSlug = teamSlug(A), bSlug = teamSlug(B);
  const aLogo = `assets/logos/${aSlug}.jpeg`;
  const bLogo = `assets/logos/${bSlug}.jpeg`;
  return `
  <div class="fixture">
    <div class="fixture-left">
      <img class="logo" src="${aLogo}" alt="${A}">
      <div>
        <div class="fixture-name">${vs(f.fixture)}</div>
        <div class="fixture-meta">${f.date} • ${f.venue}</div>
      </div>
    </div>
    <img class="logo" src="${bLogo}" alt="${B}">
  </div>
  `;
};

// Render table rows (schedules page)
const renderRow = (f) => `
  <tr>
    <td>${f.round ?? ''}</td>
    <td>${f.match}</td>
    <td>${f.tier}</td>
    <td>${f.venue}</td>
    <td>${f.date}</td>
    <td>${vs(f.fixture)}</td>
  </tr>
`;

// =========================
// Page-specific mounts
// =========================

// Home: Round 1 tiles
const homeChamp = byId('homeRound1Champ');
const homePrem  = byId('homeRound1Prem');
if (homeChamp && homePrem) {
  const r1c = CHAMPIONSHIP.filter(x=>x.round===1).sort((a,b)=>a.match-b.match);
  const r1p = PREMIER.filter(x=>x.round===1).sort((a,b)=>a.match-b.match);
  homeChamp.innerHTML = r1c.map(renderSmallFixture).join('');
  homePrem.innerHTML  = r1p.map(renderSmallFixture).join('');
}

// Schedules page
const tblChamp = byId('tblChamp');
const tblPrem  = byId('tblPrem');
if (tblChamp && tblPrem) {
  // strictly by MATCH number ascending (1..32)
  const c = [...CHAMPIONSHIP].sort((a,b)=>a.match-b.match);
  const p = [...PREMIER].sort((a,b)=>a.match-b.match);
  tblChamp.innerHTML = c.map(renderRow).join('');
  tblPrem.innerHTML  = p.map(renderRow).join('');
}

// Live page: upcoming list + helpers
const liveUpcoming = byId('liveUpcoming');
if (liveUpcoming) {
  // pick first few upcoming from both, ordered by match number (just to show something tidy)
  const soon = [...PREMIER, ...CHAMPIONSHIP]
    .filter(x => x.round === 1) // demo: round 1 as "upcoming"
    .sort((a,b)=> a.tier.localeCompare(b.tier) || a.match-b.match)
    .slice(0,6);
  liveUpcoming.innerHTML = soon.map(f=>`
    <li class="flex items-center justify-between gap-3">
      <span class="text-gray-300">${f.date} • ${f.venue}</span>
      <span class="font-medium whitespace-normal">${vs(f.fixture)}</span>
    </li>
  `).join('');
  byId('btnRefreshLive')?.addEventListener('click', ()=>{
    const iframe = byId('liveFrame');
    iframe.src = iframe.src; // force reload
  });
  byId('btnShare')?.addEventListener('click', async ()=>{
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    } catch { alert('Copy failed.'); }
  });
}
