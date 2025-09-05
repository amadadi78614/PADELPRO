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

// Polished: nav shadow on scroll
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
    // Ensure user doc exists
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
    } catch (e) { /* ok in read-only / locked rules */ }

    const name = user.displayName || (user.email?.split('@')[0] ?? 'Player');
    const init = (name?.trim()[0] || 'U').toUpperCase();

    // Desktop: profile
    navGetStarted.classList.add('hidden');
    profileBtn.classList.remove('hidden');
    profileName.textContent = name;
    profileAvatar.textContent = init;

    // Buttons/sections
    ctaJoinNow?.classList.add('hidden'); ctaAdmin?.classList.remove('hidden');
    mobileGetStarted.classList.add('hidden');
    mobileWelcome.classList.remove('hidden');
    mobileWelcome.textContent = `Welcome, ${name}`;
    mobileSignOut.classList.remove('hidden');

    ['fantasy','marketplace','live-stream','schedule'].forEach(id =>
      document.getElementById(id)?.classList.remove('hidden')
    );
  } else {
    profileBtn.classList.add('hidden');
    profileMenu.classList.add('hidden');
    navGetStarted.classList.remove('hidden');

    ctaJoinNow?.classList.remove('hidden'); ctaAdmin?.classList.add('hidden');
    mobileGetStarted.classList.remove('hidden');
    mobileWelcome.classList.add('hidden');
    mobileSignOut.classList.add('hidden');

    ['fantasy','marketplace','live-stream','schedule'].forEach(id =>
      document.getElementById(id)?.classList.add('hidden')
    );
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
btnSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
  toast('Signed out', 'info');
});
mobileSignOut?.addEventListener('click', async ()=>{
  await signOut(auth);
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
