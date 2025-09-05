// js/app.js — Firebase Auth + UI wiring (no backend needed)

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Section navigation helpers
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
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id=a.getAttribute('href').slice(1);
    if(sectionIds.includes(id)){ e.preventDefault(); showSection(id); }
  });
});
function toggleMobileMenu(){ document.getElementById('mobileMenu').classList.toggle('hidden'); }
window.toggleMobileMenu = toggleMobileMenu;

// Modal DOM
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

// TODO: paste your real config from Firebase console
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqJkzXzw9MgLFBZRvbnp8OthXWzSr2aBs",
  authDomain: "padelpro-c24b0.firebaseapp.com",
  projectId: "padelpro-c24b0",
  storageBucket: "padelpro-c24b0.firebasestorage.app",
  messagingSenderId: "882509576352",
  appId: "1:882509576352:web:353877bde27dc6416971c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Open/close modal
['navGetStarted','mobileGetStarted','ctaJoinNow'].forEach(id=>{
  const btn=document.getElementById(id); if(!btn) return;
  btn.addEventListener('click', e=>{
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

// Auth state → toggle UI + ensure user doc
onAuthStateChanged(auth, async (user)=>{
  if (user) {
    try {
      const uref = doc(db,'users',user.uid);
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
    } catch(e){ console.warn('Firestore not ready or blocked by rules:', e?.message); }

    navGetStarted?.classList.add('hidden');
    mobileGetStarted?.classList.add('hidden');
    ctaJoinNow?.classList.add('hidden');
    ctaAdmin?.classList.remove('hidden');

    ['fantasy','marketplace','live-stream','schedule'].forEach(id=>{
      document.getElementById(id)?.classList.remove('hidden');
    });
  } else {
    navGetStarted?.classList.remove('hidden');
    mobileGetStarted?.classList.remove('hidden');
    ctaJoinNow?.classList.remove('hidden');
    ctaAdmin?.classList.add('hidden');

    ['fantasy','marketplace','live-stream','schedule'].forEach(id=>{
      document.getElementById(id)?.classList.add('hidden');
    });
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
    overlay.classList.add('hidden');
  } catch (err) {
    box.textContent = (err?.message || 'Sign-in failed').replace('Firebase: ','');
  }
});

// Register → create with temp pw, then send reset link
document.getElementById('register_modal')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name  = document.getElementById('r_name').value.trim();
  const email = document.getElementById('r_email').value.trim();
  const msg   = document.getElementById('r_msg_modal');
  msg.textContent = '';
  const tempPw = Math.random().toString(36).slice(-10) + "Aa1!";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, tempPw);
    if (name) await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), { uid:cred.user.uid, name, email, role:'player', createdAt: serverTimestamp() });
    await sendPasswordResetEmail(auth, email);
    msg.style.color = 'lightgreen';
    msg.textContent = 'Account created. Check your email to set your password.';
  } catch (err) {
    msg.style.color = 'salmon';
    msg.textContent = (err?.message || 'Registration failed').replace('Firebase: ','');
  }
});

// Forgot password (Send reset link)
const resetBtn   = document.getElementById('getTempModal');
const resetMsgEl = document.getElementById('tempMsgModal');
resetBtn?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  resetMsgEl.textContent = '';
  if (!email) {
    resetMsgEl.style.color = 'salmon';
    resetMsgEl.textContent = 'Enter your email above first.';
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    resetMsgEl.style.color = 'lightgreen';
    resetMsgEl.textContent = 'Reset link sent. Check your inbox/spam.';
  } catch (err) {
    resetMsgEl.style.color = 'salmon';
    resetMsgEl.textContent = (err?.message || 'Could not send reset email').replace('Firebase: ','');
  }
});

// CSV export
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

// Player quick modal close
document.getElementById('pqmClose')?.addEventListener('click', ()=>{
  document.getElementById('playerQuickModal').classList.add('hidden');
});

// Optional: sign out from console
window.padelSignOut = ()=>signOut(auth);
