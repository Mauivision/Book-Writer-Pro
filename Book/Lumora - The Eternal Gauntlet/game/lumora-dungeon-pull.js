/**
 * Random "dungeon crawl" draw: one Patch Duel card + one room scene.
 * Depends on lumora-cards.js exposing window.LumoraPatchCards.
 */

const SCENES = [
  {
    title: "Audit corridor",
    body: "Floating ledgers drift like jellyfish. Each footstep triggers a soft chime — the dungeon scoring your posture. Ahead, the light turns the same blue as a loading bar that never finishes.",
  },
  {
    title: "Echo well antechamber",
    body: "A well of liquid UI ripples in the floor. Echo motes rise when you breathe. The air tastes like copper and patch notes. Something polite is listening from the ceiling.",
  },
  {
    title: "Golden Tankard threshold (reflected)",
    body: "A tavern door hangs in midair with no wall. Through it you hear laughter — then silence when someone says your name wrong on purpose. The reflection in the crystal floor shows a different party order than yours.",
  },
  {
    title: "Shimmermite gallery",
    body: "Mirrored insects stitch across the ceiling in formation. Their wings throw jealous sparks onto the walls. Every sparkle looks like a notification you were not supposed to see.",
  },
  {
    title: "Tutorial tile gauntlet",
    body: "Cheerful arrows point at three doors. Two are traps. The third is also a trap, but with better lighting. A sign reads: “Co-op recommended.” The dungeon chuckles in monospace.",
  },
  {
    title: "Respawn anchor alcove",
    body: "A warm stone slab hums under your palm. For a second, failure feels forgiven — then the slab prints a tiny receipt: OPTICS DEBT. You pocket it anyway.",
  },
  {
    title: "Verdant leak — dead end",
    body: "Vines push through cracked admin tilework. Life magic shouldn’t grow here; it does anyway. Unity feels close enough to touch, like humidity before a storm.",
  },
  {
    title: "Jealousy mirror hall",
    body: "Parallel corridors repeat your silhouette with tiny delays — each copy slightly smugger than the last. Footsteps sync, then don’t. The mirrors want a verdict, not a selfie.",
  },
  {
    title: "Forced co-op bridge",
    body: "The bridge only appears when two pressure plates agree. Yours is lit. The other flickers as if someone is standing there — or the dungeon is pretending. Wind pulls at the ropes like impatient hands.",
  },
  {
    title: "Patch wall catacomb",
    body: "Chiseled patch notes climb the stone: balance tweaks, hotfixes, apologies written in god-font. One line is fresh enough to still glow. You pretend not to read your own name in the fine print.",
  },
  {
    title: "Sky bridge — wind tier",
    body: "Glass ribs arch over nothing. Clouds move too fast, like skipped frames. Far below, Sky Dungeon #7’s lower layers blink in and out — maintenance windows as weather.",
  },
  {
    title: "Curator waiting room",
    body: "Numbered tickets float without a desk. A bell never rings, yet everyone flinches. The magazines are all blank except for one page that says TRY AGAIN in radiant gold.",
  },
  {
    title: "Filing-chest annex",
    body: "Loot chests are bolted shut with brass bureaucracy. Keys hang on hooks labeled TRUST, DRAMA, SNACKS. Only one hook has a key; it doesn’t fit anything here.",
  },
  {
    title: "Light / Shadow lock vestibule",
    body: "Twin panels pulse: Radiant white, Veil violet. The lock wants a sequence, not a guess. Your stance aches to flip just to see what the room would dare say.",
  },
  {
    title: "Whisper ribbon lounge",
    body: "Rumor-light curls through velvet chairs. You overhear half a sentence with your name in it — then laughter covered by a cough. The room is cozy and hostile in equal measure.",
  },
  {
    title: "Seraphina mural passage",
    body: "A mural of wings and banners has been “corrected” with black tape in places. The saintly face has been edited to look tired — more honest than vandalism should be.",
  },
  {
    title: "Unity chain bridge",
    body: "Links of light stretch across a pit. Each link hums when stepped on — harmony as infrastructure. Below, something counts your steps like a metronome.",
  },
  {
    title: "Swipe-scar arena threshold",
    body: "The floor bears curved gouges, like a giant hand raked the stone. Gauntlet Swipe warnings are stenciled on the pillars — too cheerful for the damage they describe.",
  },
  {
    title: "Witness balcony",
    body: "Stained-glass eyes track you from the balustrade. Cameras hide in gargoyle mouths. You are not on stage; you are in evidence. The view of the boss door is perfect and cruel.",
  },
  {
    title: "Crystal observation deck",
    body: "Through a lens of dungeon glass you watch another party wipe — silent, polite, distant. Their defeat scrolls as patch text along the railing. You wonder if someone is watching you back.",
  },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPool() {
  const w = window.LumoraPatchCards;
  if (!w) return [];
  const pool = [];
  for (const [id, def] of Object.entries(w.PLAYER_CARDS)) {
    pool.push({ id, kind: "echo", def });
  }
  for (const [id, def] of Object.entries(w.BOSS_CARDS)) {
    pool.push({ id, kind: "curator", def });
  }
  return pool;
}

function factionClass(def, kind) {
  if (kind === "curator") return "neutral";
  return def.faction || "neutral";
}

function factionLabel(def, kind) {
  if (kind === "curator") return "Curator";
  const f = def.faction || "neutral";
  return f.charAt(0).toUpperCase() + f.slice(1);
}

function renderPullCard(entry) {
  const { def, kind } = entry;
  const fc = factionClass(def, kind);
  const fl = factionLabel(def, kind);
  return `
    <div class="card crawl-card-preview ${fc}" aria-label="${def.name}">
      <span class="card-cost">${def.cost} Echo</span>
      <span class="card-name">${def.name}</span>
      <span class="card-faction ${fc}">${fl}</span>
      <p class="card-text">${def.text}</p>
    </div>
  `;
}

function initDungeonPull() {
  const btn = document.getElementById("btn-crawl-draw");
  const wrap = document.getElementById("crawl-result");
  const titleEl = document.getElementById("crawl-scene-title");
  const bodyEl = document.getElementById("crawl-scene-body");
  const cardMount = document.getElementById("crawl-card-mount");
  if (!btn || !wrap || !titleEl || !bodyEl || !cardMount) return;

  btn.addEventListener("click", () => {
    const pool = buildPool();
    if (!pool.length) {
      titleEl.textContent = "Cards not loaded";
      bodyEl.textContent = "Open this page after scripts load, or check lumora-cards.js exports LumoraPatchCards.";
      cardMount.innerHTML = "";
      wrap.hidden = false;
      return;
    }
    const card = pick(pool);
    const scene = pick(SCENES);
    titleEl.textContent = scene.title;
    bodyEl.textContent = scene.body;
    cardMount.innerHTML = renderPullCard(card);
    wrap.hidden = false;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDungeonPull);
} else {
  initDungeonPull();
}
