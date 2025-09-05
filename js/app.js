// js/app.js  (Firebase + UI wiring)
// ---------------------------------

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Section navigation helpers
const sectionIds = ['home','franchises','fantasy','marketplace','live-stream','schedule'];
function showSection(id) {
  sectionIds.forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    if (s === id) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
  const m = document.getElementById('mobileMenu');
  if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function wireAnchorToggles(scope=document) {
  const links = scope.querySelectorAll('a[href^="#"]');
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (sectionIds.includes(id)) {
        e.preventDefault();
        showSection(id);
      }
    });
  });
}
wireAnchorToggles(document);

// Grab DOM references
const authOverlay        = document.getElementById('authOverlay');
const authCloseBtn       = document.getElementById('authClose');
const goRegisterBtn      = document.getElementById('goRegister');
const goSignInBtn        = document.getElementById('goSignIn');
const authSignInDiv      = document.getElementById('authSignIn');
const authRegisterDiv    = document.getElementById('authRegister');

const signInForm         = document.getElementById('signin_modal');
const signInEmailInput   = document.getElementById('email');
const signInPasswordInput= document.getElementById('password');
const signInErrorMsg     = document.getElementById('error');
const getTempModalBtn    = document.getElementById('getTempModal');
const tempMsgModal       = document.getElementById('tempMsgModal');

const registerForm       = document.getElementById('register_modal');
const registerNameInput  = document.getElementById('r_name');
const registerEmailInput = document.getElementById('r_email');
const registerMsg        = document.getElementById('r_msg_modal');

const navGetStartedBtn   = document.getElementById('navGetStarted');
const mobileGetStartedBtn= document.getElementById('mobileGetStarted');
const ctaJoinNowBtn      = document.getElementById('ctaJoinNow');
const ctaAdminBtn        = document.getElementById('ctaAdmin');

// “Public” nav links we’ll hide on login
const navLinks   = document.querySelectorAll('nav a[href^="#"]');
const mobileLinks= document.querySelectorAll('#mobileMenu a[href^="#"]');

// Sections that are protected (hidden until login)
const fantasySection     = document.getElementById('fantasy');
const marketplaceSection = document.getElementById('marketplace');
const liveStreamSection  = document.getElementById('live-stream');
const scheduleSection    = document.getElementById('schedule');

// Mobile menu toggle
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  m.classList.toggle('hidden');
}
window.toggleMobileMenu = toggleMobileMenu;

// -----------------------
// Firebase (no backend)
// -----------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// 1) Paste your config from Firebase console here:
const firebaseConfig = {
  apiKey:        "PASTE_API_KEY",
  authDomain:    "PASTE_AUTH_DOMAIN",
  projectId:     "PASTE_PROJECT_ID",
  storageBucket: "PASTE_BUCKET",
  messagingSenderId: "PASTE_SENDER_ID",
  appId:         "PASTE_APP_ID"
};

// 2) Init
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 3) UI updates based on auth state
function updateUI(user) {
  if (user) {
    const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'Player');

    // Convert the “Sign in” buttons to dashboard buttons
    if (navGetStartedBtn) {
      navGetStartedBtn.textContent = `Welcome, ${displayName}!`;
      navGetStartedBtn.href = 'dashboard.html';
      navGetStartedBtn.classList.remove('bg-gradient-to-r','from-blue-500','to-purple-600');
      navGetStartedBtn.classList.add('bg-white','text-blue-600');
    }
    if (mobileGetStartedBtn) {
      mobileGetStartedBtn.textContent = `Welcome, ${displayName}!`;
      mobileGetStartedBtn.href = 'dashboard.html';
      mobileGetStartedBtn.classList.remove('bg-gradient-to-r','from-blue-500','to-purple-600');
      mobileGetStartedBtn.classList.add('bg-white','text-blue-600');
    }
    if (ctaJoinNowBtn) {
      ctaJoinNowBtn.textContent = `Welcome, ${displayName}!`;
      ctaJoinNowBtn.href = 'dashboard.html';
    }

    // Reveal protected sections
    fantasySection?.classList.remove('hidden');
    marketplaceSection?.classList.remove('hidden');
    liveStreamSection?.classList.remove('hidden');
    scheduleSection?.classList.remove('hidden');

    // Hide public nav anchors (Franchises/Fantasy/Marketplace/Live/Schedule)
    navLinks.forEach(a => a.style.display = 'none');
    mobileLinks.forEach(a => a.style.display = 'none');

    // Show dashboard link (keep admin hidden unless you add roles later)
    ctaAdminBtn?.classList.remove('hidden');

  } else {
    // Logged out → reset buttons
    if (navGetStartedBtn) {
      navGetStartedBtn.textContent = 'Sign In / Register';
      navGetStartedBtn.href = '#';
      navGetStartedBtn.classList.add('bg-gradient-to-r','from-blue-500','to-purple-600');
      navGetStartedBtn.classList.remove('bg-white','text-blue-600');
    }
    if (mobileGetStartedBtn) {
      mobileGetStartedBtn.textContent = 'Sign In / Register';
      mobileGetStartedBtn.href = '#';
      mobileGetStartedBtn.classList.add('bg-gradient-to-r','from-blue-500','to-purple-600');
      mobileGetStartedBtn.classList.remove('bg-white','text-blue-600');
    }
    if (ctaJoinNowBtn) {
      ctaJoinNowBtn.textContent = 'Sign In / Register';
      ctaJoinNowBtn.href = '#';
    }

    // Hide protected sections again
    fantasySection?.classList.add('hidden');
    marketplaceSection?.classList.add('hidden');
    liveStreamSection?.classList.add('hidden');
    scheduleSection?.classList.add('hidden');

    // Show public nav anchors
    navLinks.forEach(a => a.style.display = 'block');
    mobileLinks.forEach(a => a.style.display = 'block');

    // Hide dashboard link
    ctaAdminBtn?.classList.add('hidden');
  }
}

onAuthStateChanged(auth, (user) => updateUI(user));

// 4) Open/close auth modal
const openers = ['navGetStarted','mobileGetStarted','ctaJoinNow']
  .map(id => document.getElementById(id))
  .filter(Boolean);
openers.forEach(btn => btn.addEventListener('click', (e) => {
  if (auth.currentUser) return; // already logged in
  e.preventDefault();
  authOverlay.classList.remove('hidden');
  authOverlay.classList.add('flex');
  authSignInDiv.classList.remove('hidden');
  authRegisterDiv.classList.add('hidden');
}));
authCloseBtn?.addEventListener('click', () => {
  authOverlay.classList.add('hidden');
  authOverlay.classList.remove('flex');
});

// Switch sign-in/register views (fixed names)
goRegisterBtn?.addEventListener('click', () => {
  authSignInDiv.classList.add('hidden');
  authRegisterDiv.classList.remove('hidden');
});
goSignInBtn?.addEventListener('click', () => {
  authRegisterDiv.classList.add('hidden');
  authSignInDiv.classList.remove('hidden');
});

// 5) Sign in form (Email/Password)
signInForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  signInErrorMsg.textContent = '';
  const email = signInEmailInput.value.trim();
  const pw    = signInPasswordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    authOverlay.classList.add('hidden');
    authOverlay.classList.remove('flex');
  } catch (err) {
    signInErrorMsg.textContent = (err?.message || 'Sign-in failed').replace('Firebase: ','');
  }
});

// 6) Register form (create temp password, send reset email)
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  registerMsg.textContent = '';
  const name  = registerNameInput.value.trim();
  const email = registerEmailInput.value.trim();
  const tempPw = Math.random().toString(36).slice(-10) + "Aa1!";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, tempPw);
    if (name) await updateProfile(cred.user, { displayName: name });
    await sendPasswordResetEmail(auth, email);
    registerMsg.style.color = 'lightgreen';
    registerMsg.textContent = 'Account created. Check your email to set your password.';
    registerForm.reset();
    setTimeout(() => {
      authRegisterDiv.classList.add('hidden');
      authSignInDiv.classList.remove('hidden');
    }, 2500);
  } catch (err) {
    registerMsg.style.color = 'salmon';
    registerMsg.textContent = (err?.message || 'Registration failed').replace('Firebase: ','');
  }
});

// 7) Forgot password
getTempModalBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  tempMsgModal.textContent = '';
  const email = signInEmailInput.value.trim();
  if (!email) {
    tempMsgModal.style.color = 'salmon';
    tempMsgModal.textContent = 'Please enter your email address first.';
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    tempMsgModal.style.color = 'lightgreen';
    tempMsgModal.textContent = 'Reset link sent. Check your inbox.';
  } catch (err) {
    tempMsgModal.style.color = 'salmon';
    tempMsgModal.textContent = (err?.message || 'Could not send reset email').replace('Firebase: ','');
  }
});

// 8) CSV export (unchanged)
document.getElementById('export-csv')?.addEventListener('click', () => {
  const rows = document.querySelectorAll('#schedule-table tbody tr');
  if (!rows.length) { alert('No schedule rows to export yet.'); return; }
  const headers = Array.from(document.querySelectorAll('#schedule-table thead th')).map(th => th.textContent.trim());
  const data = [headers];
  rows.forEach(tr => {
    const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
    data.push(cells);
  });
  const csv = data.map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'schedule.csv'; a.click();
  URL.revokeObjectURL(url);
});

// 9) Player quick modal (basic close)
document.getElementById('pqmClose')?.addEventListener('click', () => {
  document.getElementById('playerQuickModal').classList.add('hidden');
});
