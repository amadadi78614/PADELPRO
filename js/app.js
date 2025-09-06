// Year
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));

// Mobile menu
document.getElementById('hamburger')?.addEventListener('click', ()=>{
  document.getElementById('mobileMenu')?.classList.toggle('hidden');
});

// ===== TEAMS (logos + mp4) =====
const TEAMS = [
  { slug:'rulo-apaches',        name:'Rulo Apaches',        logo:'assets/logos/rulo-apaches.jpeg',        video:'assets/videos/ruloapaches.mp4',        poster:'assets/logos/rulo-apaches.jpeg' },
  { slug:'samurai-kicksmashers',name:'Samurai Kicksmashers',logo:'assets/logos/samurai-kicksmashers.jpeg',video:'assets/videos/samuraikicksmashers.mp4',poster:'assets/logos/samurai-kicksmashers.jpeg' },
  { slug:'desert-falcons',      name:'Desert Falcons',      logo:'assets/logos/desert-falcons.jpeg',      video:'assets/videos/DesertFalcons.mp4',      poster:'assets/logos/desert-falcons.jpeg' },
  { slug:'baltic-blades',       name:'Baltic Blades',       logo:'assets/logos/baltic-blades.jpeg',       video:'assets/videos/balticblades.mp4',       poster:'assets/logos/baltic-blades.jpeg' },
  { slug:'globo-boomerangs',    name:'Globo Boomerangs',    logo:'assets/logos/globo-boomerangs.jpeg',    video:'assets/videos/globoboomerangs.mp4',    poster:'assets/logos/globo-boomerangs.jpeg' },
  { slug:'sonic-viboras',       name:'Sonic Viboras',       logo:'assets/logos/sonic-viboras.jpeg',       video:'assets/videos/sonicviboras.mp4',       poster:'assets/logos/sonic-viboras.jpeg' },
  { slug:'ice-breakers',        name:'Ice Breakers',        logo:'assets/logos/ice-breakers.jpeg',        video:'assets/videos/icebreakers.mp4',        poster:'assets/logos/ice-breakers.jpeg' },
  { slug:'avalanche-aces',      name:'Avalanche Aces',      logo:'assets/logos/avalanche-aces.jpeg',      video:'assets/videos/avalancheaces.mp4',      poster:'assets/logos/avalanche-aces.jpeg' },
];

const teamByName = (n)=> TEAMS.find(t=>t.name===n);

// ===== FIXTURES (exactly as you provided) =====
const PREMIER = [
  { round:1, match:1,  tier:'Premier', venue:'Play360', date:'Monday, 15 September 2025', fixture:'Rulo Apaches - Samurai Kick Smashers' },
  { round:1, match:2,  tier:'Premier', venue:'Play360', date:'Tuesday, 16 September 2025', fixture:'Desert Falcons - Baltic Blades' },
  { round:1, match:3,  tier:'Premier', venue:'Play360', date:'Wednesday, 17 September 2025', fixture:'Globo Boomerangs - Sonic Viboras' },
  { round:1, match:4,  tier:'Premier', venue:'Play360', date:'Thursday, 18 September 2025', fixture:'Ice Breakers - Avalanche Aces' },

  { round:2, match:5,  tier:'Premier', venue:'Play360', date:'Thursday, 25 September 2025', fixture:'Samurai Kick Smashers - Desert Falcons' },
  { round:2, match:6,  tier:'Premier', venue:'Play360', date:'Monday, 22 September 2025', fixture:'Avalanche Aces - Rulo Apaches' },
  { round:2, match:7,  tier:'Premier', venue:'Play360', date:'Tuesday, 23 September 2025', fixture:'Sonic Viboras - Ice Breakers' },
  { round:2, match:8,  tier:'Premier', venue:'Play360', date:'Friday, 26 September 2025', fixture:'Baltic Blades - Globo Boomerangs' },

  { round:3, match:9,  tier:'Premier', venue:'Play360', date:'Tuesday, 30 September 2025', fixture:'Desert Falcons - Avalanche Aces' },
  { round:3, match:10, tier:'Premier', venue:'Play360', date:'Wednesday, 15 October 2025', fixture:'Samurai Kick Smashers - Baltic Blades' },
  { round:3, match:11, tier:'Premier', venue:'Play360', date:'Monday, 29 September 2025', fixture:'Rulo Apaches - Sonic Viboras' },
  { round:3, match:12, tier:'Premier', venue:'Play360', date:'Tuesday, 14 October 2025', fixture:'Ice Breakers - Globo Boomerangs' },

  { round:4, match:13, tier:'Premier', venue:'Play360', date:'Thursday, 23 October 2025', fixture:'Baltic Blades - Sonic Viboras' },
  { round:4, match:14, tier:'Premier', venue:'Play360', date:'Wednesday, 22 October 2025', fixture:'Desert Falcons - Rulo Apaches' },
  { round:4, match:15, tier:'Premier', venue:'Play360', date:'Tuesday, 21 October 2025', fixture:'Avalanche Aces - Globo Boomerangs' },
  { round:4, match:16, tier:'Premier', venue:'Play360', date:'Monday, 20 October 2025', fixture:'Samurai Kick Smashers - Ice Breakers' },

  { round:5, match:17, tier:'Premier', venue:'Play360', date:'Thursday, 30 October 2025', fixture:'Rulo Apaches - Baltic Blades' },
  { round:5, match:18, tier:'Premier', venue:'Play360', date:'Monday, 27 October 2025', fixture:'Globo Boomerangs - Samurai Kick Smashers' },
  { round:5, match:19, tier:'Premier', venue:'Play360', date:'Tuesday, 28 October 2025', fixture:'Ice Breakers - Desert Falcons' },
  { round:5, match:20, tier:'Premier', venue:'Play360', date:'Wednesday, 29 October 2025', fixture:'Sonic Viboras - Avalanche Aces' },

  { round:6, match:21, tier:'Premier', venue:'Play360', date:'Thursday, 06 November 2025', fixture:'Baltic Blades - Avalanche Aces' },
  { round:6, match:22, tier:'Premier', venue:'Play360', date:'Monday, 03 November 2025', fixture:'Desert Falcons - Globo Boomerangs' },
  { round:6, match:23, tier:'Premier', venue:'Play360', date:'Wednesday, 05 November 2025', fixture:'Rulo Apaches - Ice Breakers' },
  { round:6, match:24, tier:'Premier', venue:'Play360', date:'Tuesday, 04 November 2025', fixture:'Samurai Kick Smashers - Sonic Viboras' },

  { round:7, match:25, tier:'Premier', venue:'Play360', date:'Wednesday, 12 November 2025', fixture:'Globo Boomerangs - Rulo Apaches' },
  { round:7, match:26, tier:'Premier', venue:'Play360', date:'Monday, 10 November 2025', fixture:'Baltic Blades - Ice Breakers' },
  { round:7, match:27, tier:'Premier', venue:'Play360', date:'Tuesday, 11 November 2025', fixture:'Sonic Viboras - Desert Falcons' },
  { round:7, match:28, tier:'Premier', venue:'Play360', date:'Thursday, 13 November 2025', fixture:'Avalanche Aces - Samurai Kick Smashers' },

  { round:29, match:1, tier:'Premier', venue:'Play360', date:'Monday, 24 November 2025', fixture:'Play off 1' },
  { round:30, match:1, tier:'Premier', venue:'Play360', date:'Tuesday, 25 November 2025', fixture:'Play off 2' },
  { round:31, match:1, tier:'Premier', venue:'Play360', date:'Monday, 01 December 2025', fixture:'Play off 3' },
  { round:32, match:1, tier:'Premier', venue:'Play360', date:'Saturday, 06 December 2025', fixture:'FINALS: Premier' },
];

const CHAMPIONSHIP = [
  { round:1, match:1, tier:'Championship', venue:'PADEL24', date:'Monday, 15 September 2025', fixture:'Globo Boomerangs - Sonic Viboras' },
  { round:1, match:2, tier:'Championship', venue:'PADEL24', date:'Monday, 15 September 2025', fixture:'Ice Breakers - Avalanche Aces' },
  { round:1, match:3, tier:'Championship', venue:'PADEL24', date:'Wednesday, 17 September 2025', fixture:'Rulo Apaches - Samurai Kicksmashers' },
  { round:1, match:4, tier:'Championship', venue:'PADEL24', date:'Wednesday, 17 September 2025', fixture:'Desert Falcons - Baltic Blades' },

  { round:2, match:5, tier:'Championship', venue:'PADEL24', date:'Thursday, 25 September 2025', fixture:'Avalanche Aces - Rulo Apaches' },
  { round:2, match:6, tier:'Championship', venue:'PADEL24', date:'Thursday, 25 September 2025', fixture:'Sonic Viboras - Ice Breakers' },
  { round:2, match:7, tier:'Championship', venue:'PADEL24', date:'Monday, 22 September 2025', fixture:'Samurai Kicksmashers  - Desert Falcons' },
  { round:2, match:8, tier:'Championship', venue:'PADEL24', date:'Monday, 22 September 2025', fixture:'Baltic Blades - Globo Boomerangs' },

  { round:3, match:9,  tier:'Championship', venue:'PADEL24', date:'Monday, 29 September 2025', fixture:'Ice Breakers - Globo Boomerangs' },
  { round:3, match:10, tier:'Championship', venue:'PADEL24', date:'Monday, 29 September 2025', fixture:'Samurai Kicksmashers - Baltic Blades' },
  { round:3, match:11, tier:'Championship', venue:'PADEL24', date:'Thursday, 16 October 2025', fixture:'Rulo Apaches - Sonic Viboras' },
  { round:3, match:12, tier:'Championship', venue:'PADEL24', date:'Thursday, 16 October 2025', fixture:'Desert Falcons - Avalanche Aces' },

  { round:4, match:13, tier:'Championship', venue:'PADEL24', date:'Monday, 20 October 2025', fixture:'Desert Falcons - Rulo Apaches' },
  { round:4, match:14, tier:'Championship', venue:'PADEL24', date:'Monday, 20 October 2025', fixture:'Baltic Blades - Sonic Viboras' },
  { round:4, match:15, tier:'Championship', venue:'PADEL24', date:'Wednesday, 22 October 2025', fixture:'Samurai Kicksmashers  - Ice Breakers' },
  { round:4, match:16, tier:'Championship', venue:'PADEL24', date:'Wednesday, 22 October 2025', fixture:'Avalanche Aces - Globo Boomerangs' },

  { round:5, match:17, tier:'Championship', venue:'PADEL24', date:'Monday, 27 October 2025', fixture:'Sonic Viboras - Avalanche Aces' },
  { round:5, match:18, tier:'Championship', venue:'PADEL24', date:'Monday, 27 October 2025', fixture:'Rulo Apaches - Baltic Blades' },
  { round:5, match:19, tier:'Championship', venue:'PADEL24', date:'Wednesday, 29 October 2025', fixture:'Globo Boomerangs - Samurai Kicksmashers' },
  { round:5, match:20, tier:'Championship', venue:'PADEL24', date:'Wednesday, 29 October 2025', fixture:'Ice Breakers - Desert Falcons' },

  { round:6, match:21, tier:'Championship', venue:'PADEL24', date:'Monday, 03 November 2025', fixture:'Rulo Apaches - Ice Breakers' },
  { round:6, match:22, tier:'Championship', venue:'PADEL24', date:'Monday, 03 November 2025', fixture:'Baltic Blades - Avalanche Aces' },
  { round:6, match:23, tier:'Championship', venue:'PADEL24', date:'Wednesday, 05 November 2025', fixture:'Desert Falcons - Globo Boomerangs' },
  { round:6, match:24, tier:'Championship', venue:'PADEL24', date:'Wednesday, 05 November 2025', fixture:'Samurai Kicksmashers - Sonic Viboras' },

  { round:7, match:25, tier:'Championship', venue:'PADEL24', date:'Monday, 10 November 2025', fixture:'Globo Boomerangs - Rulo Apaches' },
  { round:7, match:26, tier:'Championship', venue:'PADEL24', date:'Monday, 10 November 2025', fixture:'Avalanche Aces - Samurai Kicksmashers' },
  { round:7, match:27, tier:'Championship', venue:'PADEL24', date:'Wednesday, 12 November 2025', fixture:'Baltic Blades - Ice Breakers' },
  { round:7, match:28, tier:'Championship', venue:'PADEL24', date:'Wednesday, 12 November 2025', fixture:'Sonic Viboras - Desert Falcons' },

  { round:29, match:1, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 1' },
  { round:30, match:1, tier:'Championship', venue:'PADEL24', date:'Wednesday, 26 November 2025', fixture:'Play off 2' },
  { round:31, match:1, tier:'Championship', venue:'PADEL24', date:'Tuesday, 02 December 2025', fixture:'Play off 3' },
  { round:32, match:1, tier:'Championship', venue:'Play360', date:'Saturday, 06 December 2025', fixture:'FINALS: Championship' },
];

const ALL = [...PREMIER, ...CHAMPIONSHIP];

// ===== UI builders =====
function badge(txt){ return `<span class="text-[11px] px-2 py-0.5 rounded bg-white/10 border border-white/10">${txt}</span>`; }

function fixtureCard(f){
  const [home, away] = f.fixture.split(' - ').map(s=>s.trim());
  const t1 = teamByName(home) || {logo:''};
  const t2 = teamByName(away) || {logo:''};
  return `
  <div class="rounded-xl border border-white/10 bg-white/[.03] p-3">
    <div class="flex items-center justify-between text-xs text-gray-300 mb-2">
      <div>${f.date}</div>
      <div class="flex items-center gap-2">${badge(f.venue)}</div>
    </div>
    <div class="flex items-center gap-3">
      <img src="${t1.logo}" alt="${home}" class="h-9 w-9 rounded-full object-cover"/>
      <div class="flex-1 leading-tight">
        <div class="text-sm font-semibold">${home}</div>
        <div class="text-[11px] opacity-70">vs</div>
        <div class="text-sm font-semibold">${away}</div>
      </div>
      <img src="${t2.logo}" alt="${away}" class="h-9 w-9 rounded-full object-cover"/>
    </div>
  </div>`;
}

function renderHomeRound1(){
  const prem = PREMIER.filter(x=>x.round===1);
  const champ = CHAMPIONSHIP.filter(x=>x.round===1);
  const p = document.getElementById('home-premier-grid');
  const c = document.getElementById('home-champ-grid');
  if(p) p.innerHTML = prem.map(fixtureCard).join('');
  if(c) c.innerHTML = champ.map(fixtureCard).join('');
}

function franchiseCard(t){
  return `
  <a href="franchise.html?team=${t.slug}" class="group rounded-2xl overflow-hidden border border-white/10">
    <div class="relative aspect-[4/3] bg-black">
      <video class="absolute inset-0 w-full h-full object-cover" src="${t.video}" poster="${t.poster}" autoplay muted loop playsinline></video>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90"></div>
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="text-lg font-bold">${t.name}</div>
        <div class="text-xs text-gray-300">Tap to view squad & details</div>
      </div>
    </div>
  </a>`;
}
function renderFranchises(){
  const grid = document.getElementById('franchises-grid');
  if(!grid) return;
  grid.innerHTML = TEAMS.map(franchiseCard).join('');
}

function scheduleRow(f){
  return `
  <tr class="bg-white/[.03] hover:bg-white/[.05]">
    <td class="px-3 py-2 text-sm">${f.round}</td>
    <td class="px-3 py-2 text-sm">${f.match}</td>
    <td class="px-3 py-2 text-sm">${f.tier}</td>
    <td class="px-3 py-2 text-sm">${f.venue}</td>
    <td class="px-3 py-2 text-sm">${f.date}</td>
    <td class="px-3 py-2 text-sm">${f.fixture.replace(' - ', ' vs ')}</td>
    <td class="px-3 py-2 text-sm">Scheduled</td>
  </tr>`;
}
function renderSchedule(){
  const body = document.getElementById('schedule-body');
  if(!body) return;
  const tierSel = document.getElementById('filter-tier');
  const venueSel = document.getElementById('filter-venue');

  const apply = ()=>{
    let list = ALL.slice();
    const t = tierSel.value;
    const v = venueSel.value;
    if(t!=='all') list = list.filter(x=>x.tier===t);
    if(v!=='all') list = list.filter(x=>x.venue===v);
    body.innerHTML = list.map(scheduleRow).join('');
  };
  tierSel?.addEventListener('change', apply);
  venueSel?.addEventListener('change', apply);
  apply();

  // export CSV
  document.getElementById('export-csv')?.addEventListener('click', ()=>{
    const rows = [['Round','Match','Tier','Venue','Date','Fixture','Status']]
      .concat(ALL.map(f=>[f.round,f.match,f.tier,f.venue,f.date,f.fixture,'Scheduled']));
    const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'schedule.csv'; a.click();
    URL.revokeObjectURL(url);
  });
}

// Init page-specific parts
document.addEventListener('DOMContentLoaded', ()=>{
  renderHomeRound1();
  renderFranchises();
  renderSchedule();
});
