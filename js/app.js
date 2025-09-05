// js/app.js — Firebase Auth + minimal Firestore profile + UI wiring

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ------- Section nav helpers -------
const sectionIds = ['home','franchises','fantasy','marketplace','live-stream','schedule'];

function showSection(id){
  sectionIds.forEach(s=>{
    const el=document.getElementById(s); if(!el) return;
    if(s===id) el.classList.remove('hidden'); else el.classList.add('hidden');
  });
  const m=document.getElementById('mobileMenu');
  if(m && !m.classList.contains('hidden')) m.classList.add('hidden');
  document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'});
}

function wireAnchorToggles(scope=document){
  const links = scope.querySelectorAll('a[href^="#"]');
  links.forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href').slice(1);
      if (sectionIds.includes(id)) {
        e.preventDefault();
        showSection(id);
      }
    });
  });
}
wireAnchorToggles(document);

// Mobile menu toggle
function toggleMobileMenu(){ document.getElementById('mobileMenu').classList.toggle('hidden'); }
window.toggleMobileMenu = toggleMobileMenu;

// ------- Modal DOM -------
const overlay          = document.getElementById('authOverlay');
const authClose        = document.getElementById('authClose');
const signInView       = document.getElementById('authSignIn');
const registerView     = document.getElementById('authRegister');
const goRegister       = document.getElementById('goRegister');
const goSignIn         = document.getElementById('goSignIn');

const navGetStarted    = document.getElementById('navGetStarted');
const mobileGetStarted = document.getElementById('mobileGetStarted');
const ctaJoinNow       = document.getElementById('ctaJoinNow');
const ctaAdmin         = document.getElementById('ctaAdmin');

const whoami        = document.getElementById('whoami');
const btnSignOut    = document.getElementById('btnSignOut');
const mobileSignOut = document.getElementById('mobileSignOut');

// ------- Firebase (modular v10) -------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Your Firebase config
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

// ------- Open/close auth modal -------
['navGetStarted','mobileGetStarted','ctaJoinNow'].forEach(id=>{
  const btn=document.getElementById(id); if(!btn) return;
  btn.addEventListener('click', (e)=>{
    if (auth.currentUser) return; // don't open if already logged in
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

// ------- Auth state → UI -------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Ensure /users/{uid} exists (safe if rules allow; wrapped in try/catch)
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
    } catch (e) {
      console.warn('Firestore note:', e?.message);
    }

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');

    // Who am I
    whoami?.classList.remove('hidden');
    whoami.textContent = `Logged in as ${name}`;

    // Turn CTA into dashboard link
    navGetStarted.textContent = `Welcome, ${name}`;
    navGetStarted.href = 'dashboard.html';
    navGetStarted.classList.remove('bg-gradient-to-r','from-blue-500','to-purple-600');
    navGetStarted.classList.add('bg-white','text-blue-600');

    // Show sign-out buttons
    btnSignOut?.classList.remove('hidden');
    mobileSignOut?.classList.remove('hidden');

    // Reveal protected sections
    ['fantasy','marketplace','live-stream','schedule'].forEach(id =>
      document.getElementById(id)?.classList.remove('hidden')
    );
  } else {
    whoami?.classList.add('hidden');
    whoami.textContent = '';

    navGetStarted.textContent = 'Sign In / Register';
    navGetStarted.href = '#';
    navGetStarted.classList.add('bg-gradient-to-r','from-blue-500','to-purple-600');
    navGetStarted.classList.remove('bg-white','text-blue-600');

    btnSignOut?.classList.add('hidden');
    mobileSignOut?.classList.add('hidden');

    // Hide protected sections
    ['fantasy','marketplace','live-stream','schedule'].forEach(id =>
      document.getElementById(id)?.classList.add('hidden')
    );
  }
});

// ------- Sign in -------
document.getElementById('signin_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pw    = document.getElementById('password').value;
  const box   = document.getElementById('error');
  box.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pw);
    overlay.classList.add('hidden'); overlay.classList.remove('flex');
  } catch (err) {
    box.textContent = (err?.message || 'Sign-in failed').replace('Firebase: ','');
  }
});

// ------- Register (temp pw + send reset link) -------
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
    // Switch back to Sign In after a moment
    setTimeout(()=>{
      signInView.classList.remove('hidden');
      registerView.classList.add('hidden');
    }, 2000);
  } catch (err) {
    msg.style.color = 'salmon';
    msg.textContent = (err?.message || 'Registration failed').replace('Firebase: ','');
  }
});

// ------- Forgot password -------
document.getElementById('getTempModal')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('tempMsgModal');
  msg.style.color=''; msg.textContent='';
  if (!email) {
    msg.style.color='salmon'; msg.textContent='Enter your email above first.'; return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    msg.style.color='lightgreen'; msg.textContent='Reset link sent. Check your inbox/spam.';
  } catch (err) {
    msg.style.color='salmon'; msg.textContent=(err?.message || 'Could not send reset email').replace('Firebase: ','');
  }
});

// ------- Sign out buttons -------
btnSignOut?.addEventListener('click', async ()=>{ await signOut(auth); });
mobileSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  document.getElementById('mobileMenu')?.classList.add('hidden');
});

// ------- CSV export -------
document.getElementById('export-csv')?.addEventListener('click', ()=>{
  const rows = document.querySelectorAll('#schedule-table tbody tr');
  if (!rows.length) { alert('No schedule rows to export yet.'); return; }
  const headers = Array.from(document.querySelectorAll('#schedule-table thead th')).map(th=>th.textContent.trim());
  const data = [headers];
  rows.forEach(tr=>{
    const cells = Array.from(tr.querySelectorAll('td')).map(td=>td.textContent.trim());
    data.push(cells);
  });
  const csv = data.map(r=>r.map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
  const a = document.createElement('a'); a.href=url; a.download='schedule.csv'; a.click(); URL.revokeObjectURL(url);
});

// ------- Player quick modal close -------
document.getElementById('pqmClose')?.addEventListener('click', ()=>{
  document.getElementById('playerQuickModal').classList.add('hidden');
});

// Optional: quick sign out in console
window.padelSignOut = ()=>signOut(auth);
