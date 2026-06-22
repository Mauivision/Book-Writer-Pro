/**
 * Lumora — Patch Duel
 * Turn-based Echo card duel vs Sky Dungeon Curator.
 * Fantasy hooks: Radiant/Veil stance, Unity/Jealousy, Patch log, Verdant threshold.
 */

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** @typedef {'radiant'|'veil'|'neutral'} Faction */
/** @typedef {{ t: string, v?: number, w?: number }} Effect */

/** @type {Record<string, { name: string; cost: number; faction: Faction; text: string; effects: Effect[]; stanceDmg?: number }>} */
const PLAYER_CARDS = {
  sanctified_tempo: {
    name: "Sanctified Tempo",
    cost: 2,
    faction: "radiant",
    text: "Deal 4. +3 Unity. +2 damage if Radiant stance.",
    effects: [
      { t: "dmgEnemy", v: 4 },
      { t: "unity", v: 3 },
    ],
    stanceDmg: 2,
  },
  curse_burst: {
    name: "Curse-Tech Burst",
    cost: 2,
    faction: "veil",
    text: "Deal 5. +5 Jealousy. +2 damage if Veil stance.",
    effects: [
      { t: "dmgEnemy", v: 5 },
      { t: "jealousy", v: 5 },
    ],
    stanceDmg: 2,
  },
  gossip_mira: {
    name: "Mira's Gossip",
    cost: 1,
    faction: "neutral",
    text: "Heal 3. +4 Jealousy (someone saw that).",
    effects: [
      { t: "healSelf", v: 3 },
      { t: "jealousy", v: 4 },
    ],
  },
  tankard_toast: {
    name: "Tankard Toast",
    cost: 2,
    faction: "neutral",
    text: "Heal 6. +4 Unity.",
    effects: [
      { t: "healSelf", v: 6 },
      { t: "unity", v: 4 },
    ],
  },
  light_sigil: {
    name: "Light Sigil",
    cost: 3,
    faction: "radiant",
    text: "Deal 6. +2 Unity.",
    effects: [
      { t: "dmgEnemy", v: 6 },
      { t: "unity", v: 2 },
    ],
    stanceDmg: 3,
  },
  shadow_graffiti: {
    name: "Shadow Graffiti",
    cost: 3,
    faction: "veil",
    text: "Deal 6. +3 Jealousy.",
    effects: [
      { t: "dmgEnemy", v: 6 },
      { t: "jealousy", v: 3 },
    ],
    stanceDmg: 3,
  },
  forced_sync: {
    name: "Forced Sync",
    cost: 4,
    faction: "neutral",
    text: "Deal 8. +8 Unity, +5 Jealousy (mixed-party optics).",
    effects: [
      { t: "dmgEnemy", v: 8 },
      { t: "unity", v: 8 },
      { t: "jealousy", v: 5 },
    ],
  },
  tutorial_lie: {
    name: "Tutorial Lie",
    cost: 2,
    faction: "neutral",
    text: "Deal 4. Draw 1.",
    effects: [
      { t: "dmgEnemy", v: 4 },
      { t: "draw", v: 1 },
    ],
  },
  dry_humor: {
    name: "Dry Humor",
    cost: 2,
    faction: "neutral",
    text: "Jealousy −8. Lose 2 HP (dignity tax).",
    effects: [
      { t: "jealousy", v: -8 },
      { t: "dmgSelf", v: 2 },
    ],
  },
  seraphina_line: {
    name: "Seraphina's Line",
    cost: 3,
    faction: "radiant",
    text: "+10 Unity. Deal 3.",
    effects: [
      { t: "unity", v: 10 },
      { t: "dmgEnemy", v: 3 },
    ],
    stanceDmg: 1,
  },
  patch_dodge: {
    name: "Patch Dodge",
    cost: 1,
    faction: "neutral",
    text: "+2 Echo now. Jealousy −2.",
    effects: [
      { t: "echo", v: 2 },
      { t: "jealousy", v: -2 },
    ],
  },
  verdant_ping: {
    name: "Verdant Ping",
    cost: 3,
    faction: "neutral",
    text: "If Unity ≥ 50: deal 10. Else deal 5. +3 Unity.",
    effects: [{ t: "verdantStrike" }],
  },
};

/** @type {Record<string, { name: string; cost: number; text: string; effects: Effect[] }>} */
const BOSS_CARDS = {
  audit_pulse: {
    name: "Audit Pulse",
    cost: 3,
    text: "Deal 5.",
    effects: [{ t: "dmgPlayer", v: 5 }],
  },
  jealousy_thread: {
    name: "Jealousy Thread",
    cost: 2,
    text: "Deal 2. +6 Jealousy.",
    effects: [
      { t: "dmgPlayer", v: 2 },
      { t: "jealousy", v: 6 },
    ],
  },
  shimmermite: {
    name: "Shimmermite Swarm",
    cost: 2,
    text: "Deal 4. Curator heals 2.",
    effects: [
      { t: "dmgPlayer", v: 4 },
      { t: "healBoss", v: 2 },
    ],
  },
  correction_tick: {
    name: "Correction Tick",
    cost: 4,
    text: "Deal 7 if your Unity > 45, else 4.",
    effects: [{ t: "correctionDmg" }],
  },
  curator_slam: {
    name: "Curator Slam",
    cost: 6,
    text: "Deal 10.",
    effects: [{ t: "dmgPlayer", v: 10 }],
  },
  patch_slap: {
    name: "Patch Slap",
    cost: 2,
    text: "Deal 3.",
    effects: [{ t: "dmgPlayer", v: 3 }],
  },
  witness_gaze: {
    name: "Witness Gaze",
    cost: 3,
    text: "Deal 4. Unity −5 (optics wobble).",
    effects: [
      { t: "dmgPlayer", v: 4 },
      { t: "unity", v: -5 },
    ],
  },
  tutorial_arrow: {
    name: "Rearranging Arrow",
    cost: 1,
    text: "Deal 2. +3 Jealousy.",
    effects: [
      { t: "dmgPlayer", v: 2 },
      { t: "jealousy", v: 3 },
    ],
  },
};

const PLAYER_DECK_IDS = [
  "sanctified_tempo",
  "sanctified_tempo",
  "curse_burst",
  "curse_burst",
  "gossip_mira",
  "gossip_mira",
  "tankard_toast",
  "tankard_toast",
  "light_sigil",
  "light_sigil",
  "shadow_graffiti",
  "shadow_graffiti",
  "forced_sync",
  "tutorial_lie",
  "tutorial_lie",
  "dry_humor",
  "dry_humor",
  "seraphina_line",
  "seraphina_line",
  "patch_dodge",
  "patch_dodge",
  "verdant_ping",
];

const BOSS_DECK_IDS = [
  "audit_pulse",
  "audit_pulse",
  "jealousy_thread",
  "jealousy_thread",
  "shimmermite",
  "shimmermite",
  "correction_tick",
  "patch_slap",
  "patch_slap",
  "witness_gaze",
  "tutorial_arrow",
  "tutorial_arrow",
  "curator_slam",
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const els = {
  barEnemy: document.getElementById("bar-enemy"),
  barPlayerHp: document.getElementById("bar-player-hp"),
  barUnity: document.getElementById("bar-unity"),
  barJealousy: document.getElementById("bar-jealousy"),
  playerEcho: document.getElementById("player-echo"),
  enemyEcho: document.getElementById("enemy-echo"),
  enemyLast: document.getElementById("enemy-last"),
  enemyDeckCount: document.getElementById("enemy-deck-count"),
  playerDeckCount: document.getElementById("player-deck-count"),
  hand: document.getElementById("hand"),
  patchLog: document.getElementById("patch-log"),
  phaseLine: document.getElementById("phase-line"),
  btnEndTurn: document.getElementById("btn-end-turn"),
  btnNewDuel: document.getElementById("btn-new-duel"),
  stanceRadiant: document.getElementById("stance-radiant"),
  stanceVeil: document.getElementById("stance-veil"),
  verdantChip: document.getElementById("verdant-chip"),
  overlay: document.getElementById("overlay"),
  overlayTitle: document.getElementById("overlay-title"),
  overlayBody: document.getElementById("overlay-body"),
  overlayDismiss: document.getElementById("overlay-dismiss"),
};

/** @type {{
 *  playerHp: number; playerMaxHp: number; enemyHp: number; enemyMaxHp: number;
 *  echo: number; echoMax: number; enemyEcho: number; enemyEchoMax: number;
 *  unity: number; jealousy: number; stance: 'radiant'|'veil';
 *  playerDeck: string[]; playerHand: string[]; playerDiscard: string[];
 *  enemyDeck: string[]; enemyHand: string[]; enemyDiscard: string[];
 *  phase: 'player'|'enemy'; busy: boolean;
 * }} */
let state;

function logPatch(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  els.patchLog.prepend(li);
  while (els.patchLog.children.length > 18) els.patchLog.removeChild(els.patchLog.lastChild);
}

function setStance(s) {
  state.stance = s;
  els.stanceRadiant.classList.toggle("active", s === "radiant");
  els.stanceVeil.classList.toggle("active", s === "veil");
}

function updateHud() {
  els.barEnemy.style.width = `${(state.enemyHp / state.enemyMaxHp) * 100}%`;
  els.barPlayerHp.style.width = `${(state.playerHp / state.playerMaxHp) * 100}%`;
  els.barUnity.style.width = `${state.unity}%`;
  els.barJealousy.style.width = `${state.jealousy}%`;
  els.playerEcho.textContent = String(state.echo);
  els.enemyEcho.textContent = String(state.enemyEcho);
  els.playerDeckCount.textContent = String(state.playerDeck.length);
  els.enemyDeckCount.textContent = String(state.enemyDeck.length);
  els.verdantChip.classList.toggle("hidden", state.unity < 70);
}

function drawFromPlayerDeck(n) {
  for (let i = 0; i < n; i += 1) {
    if (state.playerHand.length >= 7) break;
    if (state.playerDeck.length === 0) {
      if (state.playerDiscard.length === 0) break;
      state.playerDeck = shuffle(state.playerDiscard);
      state.playerDiscard = [];
      logPatch("You reshuffle your discard into the deck.");
    }
    const id = state.playerDeck.pop();
    if (id) state.playerHand.push(id);
  }
}

function drawFromEnemyDeck(n) {
  for (let i = 0; i < n; i += 1) {
    if (state.enemyHand.length >= 8) break;
    if (state.enemyDeck.length === 0) {
      if (state.enemyDiscard.length === 0) break;
      state.enemyDeck = shuffle(state.enemyDiscard);
      state.enemyDiscard = [];
      logPatch("Curator reshuffles — the dungeon hates running out of paperwork.");
    }
    const id = state.enemyDeck.pop();
    if (id) state.enemyHand.push(id);
  }
}

function swipeDamage() {
  let dmg = 1 + Math.floor(state.jealousy / 18);
  if (state.jealousy >= 75) dmg += 2;
  return dmg;
}

function checkEnd() {
  if (state.enemyHp <= 0) {
    state.enemyHp = 0;
    updateHud();
    showOverlay(true);
    return true;
  }
  if (state.playerHp <= 0) {
    state.playerHp = 0;
    updateHud();
    showOverlay(false);
    return true;
  }
  return false;
}

function showOverlay(win) {
  els.overlay.hidden = false;
  els.overlayTitle.textContent = win ? "Curator yields (for now)" : "Respawn anchor — try again";
  els.overlayBody.textContent = win
    ? "Loot prompts blink. Mira somehow already knows. Patch Notes tease Volume 2."
    : "Respawn is free; romance is still not. Jealousy scaling laughs in monospace.";
}

function hideOverlay() {
  els.overlay.hidden = true;
}

function applyPlayerEffect(def, e) {
  switch (e.t) {
    case "dmgEnemy": {
      let n = e.v;
      if (def.stanceDmg && def.faction === state.stance) n += def.stanceDmg;
      state.enemyHp -= n;
      logPatch(`You deal ${n} to the Curator.`);
      break;
    }
    case "healSelf":
      state.playerHp = clamp(state.playerHp + (e.v ?? 0), 1, state.playerMaxHp);
      logPatch(`You heal ${e.v} HP.`);
      break;
    case "dmgSelf":
      state.playerHp = clamp(state.playerHp - (e.v ?? 0), 0, state.playerMaxHp);
      logPatch(`You take ${e.v} HP (cost of cool).`);
      break;
    case "unity":
      state.unity = clamp(state.unity + (e.v ?? 0), 0, 100);
      logPatch(`Unity ${(e.v ?? 0) >= 0 ? "+" : ""}${e.v}.`);
      break;
    case "jealousy":
      state.jealousy = clamp(state.jealousy + (e.v ?? 0), 0, 100);
      logPatch(`Jealousy ${(e.v ?? 0) >= 0 ? "+" : ""}${e.v}.`);
      break;
    case "echo":
      state.echo = clamp(state.echo + (e.v ?? 0), 0, state.echoMax);
      logPatch(`Echo +${e.v}.`);
      break;
    case "draw":
      drawFromPlayerDeck(e.v ?? 1);
      logPatch(`Draw ${e.v}.`);
      break;
    case "verdantStrike": {
      const big = state.unity >= 50;
      let n = big ? 10 : 5;
      if (def.stanceDmg && def.faction === state.stance) n += def.stanceDmg;
      state.enemyHp -= n;
      state.unity = clamp(state.unity + 3, 0, 100);
      logPatch(`Verdant Ping deals ${n}. Unity +3.`);
      break;
    }
    default:
      break;
  }
}

function playPlayerCard(handIndex) {
  if (state.phase !== "player" || state.busy) return;
  const id = state.playerHand[handIndex];
  const def = PLAYER_CARDS[id];
  if (!def) return;
  if (state.echo < def.cost) {
    const node = els.hand.querySelector(`[data-hand-index="${handIndex}"]`);
    if (node) {
      node.classList.remove("shake");
      void node.offsetWidth;
      node.classList.add("shake");
    }
    logPatch("Not enough Echo.");
    return;
  }
  state.echo -= def.cost;
  state.playerHand.splice(handIndex, 1);
  for (const e of def.effects) applyPlayerEffect(def, e);
  state.playerDiscard.push(id);
  logPatch(`Play: ${def.name} (${def.cost} Echo).`);
  updateHud();
  renderHand();
  if (checkEnd()) return;
}

function applyBossEffect(e) {
  switch (e.t) {
    case "dmgPlayer":
      state.playerHp = clamp(state.playerHp - (e.v ?? 0), 0, state.playerMaxHp);
      logPatch(`Curator hits you for ${e.v}.`);
      break;
    case "healBoss":
      state.enemyHp = clamp(state.enemyHp + (e.v ?? 0), 0, state.enemyMaxHp);
      logPatch(`Curator heals ${e.v}.`);
      break;
    case "jealousy":
      state.jealousy = clamp(state.jealousy + (e.v ?? 0), 0, 100);
      logPatch(`Jealousy +${e.v}.`);
      break;
    case "unity":
      state.unity = clamp(state.unity + (e.v ?? 0), 0, 100);
      logPatch(`Unity ${e.v}.`);
      break;
    case "correctionDmg": {
      const v = state.unity > 45 ? 7 : 4;
      state.playerHp = clamp(state.playerHp - v, 0, state.playerMaxHp);
      logPatch(`Correction Tick deals ${v}.`);
      break;
    }
    default:
      break;
  }
}

function bossPickCardIndex() {
  const affordable = state.enemyHand
    .map((id, idx) => ({ id, idx, def: BOSS_CARDS[id] }))
    .filter((x) => x.def && state.enemyEcho >= x.def.cost);
  if (affordable.length === 0) return -1;
  affordable.sort((a, b) => {
    const score = (c) => {
      let s = 0;
      for (const e of c.def.effects) {
        if (e.t === "dmgPlayer") s += (e.v ?? 0) * 2;
        if (e.t === "correctionDmg") s += state.unity > 45 ? 14 : 8;
        if (e.t === "jealousy") s += (e.v ?? 0) * 0.35;
      }
      return s / Math.max(1, c.def.cost);
    };
    return score(b) - score(a);
  });
  return affordable[0].idx;
}

function curatorTurn() {
  state.phase = "enemy";
  state.busy = true;
  els.btnEndTurn.disabled = true;
  els.phaseLine.textContent = "Curator's turn — resolving Patch…";
  renderHand();

  window.setTimeout(() => {
    state.enemyEcho = clamp(state.enemyEcho + 3, 0, state.enemyEchoMax);
    logPatch("Curator gains +3 Echo.");
    updateHud();

    window.setTimeout(() => {
      drawFromEnemyDeck(1);
      updateHud();

      window.setTimeout(() => {
        const idx = bossPickCardIndex();
        if (idx === -1) {
          logPatch("Curator passes (no affordable card) — gains +2 Echo.");
          state.enemyEcho = clamp(state.enemyEcho + 2, 0, state.enemyEchoMax);
          updateHud();
        } else {
          const id = state.enemyHand.splice(idx, 1)[0];
          const def = BOSS_CARDS[id];
          state.enemyEcho -= def.cost;
          for (const e of def.effects) applyBossEffect(e);
          state.enemyDiscard.push(id);
          els.enemyLast.innerHTML = `<strong>${def.name}</strong> — ${def.text}`;
          logPatch(`Curator plays ${def.name} (${def.cost} Echo).`);
          updateHud();
          if (checkEnd()) {
            state.busy = false;
            return;
          }
        }

        window.setTimeout(() => {
          const sw = swipeDamage();
          state.playerHp = clamp(state.playerHp - sw, 0, state.playerMaxHp);
          logPatch(`Gauntlet Swipe hits for ${sw} (scales with Jealousy).`);
          updateHud();
          if (checkEnd()) {
            state.busy = false;
            return;
          }

          window.setTimeout(() => {
            startPlayerTurn();
          }, 450);
        }, 500);
      }, 400);
    }, 400);
  }, 400);
}

function startPlayerTurn() {
  state.phase = "player";
  state.busy = false;
  state.echo = clamp(state.echo + 2, 0, state.echoMax);
  logPatch("Your turn — +2 Echo.");
  drawFromPlayerDeck(5 - state.playerHand.length);
  els.btnEndTurn.disabled = false;
  els.phaseLine.textContent = "Your turn — play cards, then End turn.";
  updateHud();
  renderHand();
}

function endPlayerTurn() {
  if (state.phase !== "player" || state.busy) return;
  logPatch("You end turn.");
  curatorTurn();
}

function renderHand() {
  els.hand.innerHTML = "";
  state.playerHand.forEach((id, handIndex) => {
    const def = PLAYER_CARDS[id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `card ${def.faction}`;
    btn.dataset.handIndex = String(handIndex);
    const locked = state.phase !== "player" || state.busy;
    btn.disabled = locked;
    if (!locked && state.echo < def.cost) btn.classList.add("unaffordable");
    btn.innerHTML = `
      <span class="card-cost">${def.cost} Echo</span>
      <span class="card-name">${def.name}</span>
      <span class="card-faction ${def.faction}">${def.faction}</span>
      <p class="card-text">${def.text}</p>
    `;
    btn.addEventListener("click", () => playPlayerCard(handIndex));
    els.hand.appendChild(btn);
  });
}

function initDuel() {
  hideOverlay();
  els.patchLog.innerHTML = "";
  state = {
    playerHp: 22,
    playerMaxHp: 22,
    enemyHp: 32,
    enemyMaxHp: 32,
    echo: 4,
    echoMax: 10,
    enemyEcho: 3,
    enemyEchoMax: 12,
    unity: 32,
    jealousy: 14,
    stance: "radiant",
    playerDeck: shuffle(PLAYER_DECK_IDS),
    playerHand: [],
    playerDiscard: [],
    enemyDeck: shuffle(BOSS_DECK_IDS),
    enemyHand: [],
    enemyDiscard: [],
    phase: "player",
    busy: false,
  };
  setStance("radiant");
  els.enemyLast.textContent = "No card played yet.";
  logPatch("Patch Duel start — twin gods argue in the tooltip font.");
  drawFromPlayerDeck(5);
  drawFromEnemyDeck(1);
  els.btnEndTurn.disabled = false;
  els.phaseLine.textContent = "Your turn — play cards, then End turn.";
  updateHud();
  renderHand();
}

els.stanceRadiant.addEventListener("click", () => {
  if (state.phase === "player" && !state.busy) setStance("radiant");
});
els.stanceVeil.addEventListener("click", () => {
  if (state.phase === "player" && !state.busy) setStance("veil");
});
els.btnEndTurn.addEventListener("click", endPlayerTurn);
els.btnNewDuel.addEventListener("click", initDuel);
els.overlayDismiss.addEventListener("click", initDuel);

if (typeof window !== "undefined") {
  window.LumoraPatchCards = { PLAYER_CARDS, BOSS_CARDS };
}

initDuel();
