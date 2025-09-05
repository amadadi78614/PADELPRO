// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  m.classList.toggle('hidden');
}
window.toggleMobileMenu = toggleMobileMenu;

// Section show/hide to handle hidden sections
const sectionIds = ['home','franchises','fantasy','marketplace','live-stream','schedule'];
function showSection(id) {
  sectionIds.forEach(s => {
    const el = document.getElementById(s);
    if (!el) return;
    if (s === id) {
      el.classList.remove('hidden');
    } else {
      if (!el.classList.contains('hidden')) el.classList.add('hidden');
    }
  });
  // Close mobile menu after navigation
  const m = document.getElementById('mobileMenu');
  if (m && !m.classList.contains('hidden')) m.classList.add('hidden');
  // Scroll to top of the revealed section
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Intercept nav links that point to #ids
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

// Auth modal controls
const overlay = document.getElementById('authOverlay');
const openers = ['navGetStarted','mobileGetStarted','ctaJoinNow'].map(id => document.getElementById(id)).filter(Boolean);
const closeBtn = document.getElementById('authClose');
const signInView = document.getElementById('authSignIn');
const registerView = document.getElementById('authRegister');
const goRegister = document.getElementById('goRegister');
const goSignIn = document.getElementById('goSignIn');

openers.forEach(btn => btn.addEventListener('click', (e) => {
  e.preventDefault();
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
}));
closeBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
});

goRegister?.addEventListener('click', () => {
  signInView.classList.add('hidden');
  registerView.classList.remove('hidden');
});
goSignIn?.addEventListener('click', () => {
  registerView.classList.add('hidden');
  signInView.classList.remove('hidden');
});

// Dummy form handlers (replace with real auth later)
document.getElementById('signin_modal')?.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('error').textContent = '';
  alert('Signed in (demo). Replace with real auth.');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
});

document.getElementById('register_modal')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('r_msg_modal');
  msg.textContent = 'Registration request sent (demo).';
});

// Export CSV (placeholder if no rows)
document.getElementById('export-csv')?.addEventListener('click', () => {
  const rows = document.querySelectorAll('#schedule-table tbody tr');
  if (!rows.length) {
    alert('No schedule rows to export yet.');
    return;
  }
  // Build CSV
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

// Player quick modal (basic close)
document.getElementById('pqmClose')?.addEventListener('click', () => {
  document.getElementById('playerQuickModal').classList.add('hidden');
});
