/* ========= Common UI ========= */

// Footer year
document.getElementById('year')?.append(new Date().getFullYear());

// Mobile menu toggle
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileBtn?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));


/* ========= Round 1 (Home) ========= */

// Logo map (use your actual logo files)
const TEAM_LOGOS = {
  "Rulo Apaches": "assets/logos/rulo-apaches.jpeg",
  "Samurai Kick Smashers": "assets/logos/samurai-kicksmashers.jpeg",
  "Samurai Kicksmashers": "assets/logos/samurai-kicksmashers.jpeg", // alt spelling for champ data
  "Desert Falcons": "assets/logos/desert-falcons.jpeg",
  "Baltic Blades": "assets/logos/baltic-blades.jpeg",
  "Globo Boomerangs": "assets/logos/globo-boomerangs.jpeg",
  "Sonic Viboras": "assets/logos/sonic-viboras.jpeg",
  "Ice Breakers": "assets/logos/ice-breakers.jpeg",
  "Avalanche Aces": "assets/logos/avalanche-aces.jpeg",
};

// Premier (round 1)
const ROUND1_PREMIER = [
  { date: "Monday, 15 September 2025", venue: "Play360", home: "Rulo Apaches", away: "Samurai Kick Smashers" },
  { date: "Tuesday, 16 September 2025", venue: "Play360", home: "Desert Falcons", away: "Baltic Blades" },
  { date: "Wednesday, 17 September 2025", venue: "Play360", home: "Globo Boomerangs", away: "Sonic Viboras" },
  { date: "Thursday, 18 September 2025", venue: "Play360", home: "Ice Breakers", away: "Avalanche Aces" },
];

// Championship (round 1)
const ROUND1_CHAMP = [
  { date: "Monday, 15 September 2025", venue: "PADEL24", home: "Globo Boomerangs", away: "Sonic Viboras" },
  { date: "Monday, 15 September 2025", venue: "PADEL24", home: "Ice Breakers", away: "Avalanche Aces" },
  { date: "Wednesday, 17 September 2025", venue: "PADEL24", home: "Rulo Apaches", away: "Samurai Kicksmashers" },
  { date: "Wednesday, 17 September 2025", venue: "PADEL24", home: "Desert Falcons", away: "Baltic Blades" },
];

// Compact card template
function fixtureCardHTML({ date, venue, home, away }) {
  const hLogo = TEAM_LOGOS[home] || "assets/logos/placeholder.png";
  const aLogo = TEAM_LOGOS[away] || "assets/logos/placeholder.png";

  return `
    <div class="rounded-xl bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition p-4">
      <div class="text-xs text-white/60 flex items-center justify-between mb-3">
        <span>${date}</span>
        <span class="px-2 py-0.5 rounded bg-white/5">${venue}</span>
      </div>

      <div class="flex items-center justify-between gap-3">
        <!-- Home -->
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20 flex-shrink-0">
            <img src="${hLogo}" alt="${home}" class="w-full h-full object-cover"/>
          </div>
          <div class="text-sm font-medium truncate" title="${home}">${home}</div>
        </div>

        <div class="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 select-none">vs</div>

        <!-- Away -->
        <div class="flex items-center gap-3 min-w-0 justify-end">
          <div class="text-sm font-medium truncate text-right" title="${away}">${away}</div>
          <div class="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20 flex-shrink-0">
            <img src="${aLogo}" alt="${away}" class="w-full h-full object-cover"/>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render on home
function renderRound1Home() {
  const hostP = document.getElementById('homePremier');
  const hostC = document.getElementById('homeChamp');
  if (!hostP || !hostC) return; // not on this page

  hostP.innerHTML = ROUND1_PREMIER.map(fixtureCardHTML).join('');
  hostC.innerHTML = ROUND1_CHAMP.map(fixtureCardHTML).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderRound1Home();
});
