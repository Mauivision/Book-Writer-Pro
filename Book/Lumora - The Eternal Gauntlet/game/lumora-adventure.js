/**
 * Lumora — Pick-a-Card Adventure (Autoplay)
 * Uses shuffled piles + gates so every offer always fits story/progression.
 *
 * Depends on:
 * - window.LumoraPatchCards from lumora-cards.js
 * - window.LumoraAdventureContent from lumora-adventure-content.js
 */

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOne(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

function asBoolFlag(v) {
  return !!v;
}

const els = {
  barHp: document.getElementById("bar-hp"),
  barUnity: document.getElementById("bar-unity"),
  barJealousy: document.getElementById("bar-jealousy"),
  repRadiant: document.getElementById("rep-radiant"),
  repVeil: document.getElementById("rep-veil"),
  stanceRadiant: document.getElementById("stance-radiant"),
  stanceVeil: document.getElementById("stance-veil"),
  stanceDesc: document.getElementById("stance-desc"),
  routeChip: document.getElementById("route-chip"),
  stageArt: document.getElementById("stage-art"),
  sceneTitle: document.getElementById("scene-title"),
  sceneBody: document.getElementById("scene-body"),
  offers: document.getElementById("offers"),
  offerHint: document.getElementById("offer-hint"),
  phasePill: document.getElementById("phase-pill"),
  log: document.getElementById("log"),
  metaAct: document.getElementById("meta-act"),
  metaRoom: document.getElementById("meta-room"),
  metaDepth: document.getElementById("meta-depth"),
  btnNewRun: document.getElementById("btn-new-run"),
  btnPlay: document.getElementById("btn-play"),
  btnPause: document.getElementById("btn-pause"),
  btnStep: document.getElementById("btn-step"),
  policy: document.getElementById("policy"),
  speed: document.getElementById("speed"),
};

/** @typedef {'hub'|'explore'|'lock'|'approach'|'boss'|'aftermath'} Phase */

/** @type {{
 *   hp: number; maxHp: number; unity: number; jealousy: number;
 *   radiantRep: number; veilRep: number; stance: 'radiant'|'veil';
 *   act: number; room: number; depth: number; phase: Phase;
 *   inSafeZone: boolean;
 *   flags: Record<string, number|boolean>;
 *   correctionHeat: number;
 *   busy: boolean;
 *   boss: { phaseIndex: number; done: boolean } | null;
 * }} */
let state;

/** @type {{ running: boolean; timer: number | null }} */
let autoplay = { running: false, timer: null };

function logLine(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  els.log.prepend(li);
  while (els.log.children.length > 18) els.log.removeChild(els.log.lastChild);
}

function setStageArt(kind) {
  els.stageArt.className = "stage-art " + (kind || "");
}

function setStance(s) {
  state.stance = s;
  els.stanceRadiant.classList.toggle("active", s === "radiant");
  els.stanceVeil.classList.toggle("active", s === "veil");
  els.stanceDesc.textContent =
    s === "radiant"
      ? "Radiant line: steadier tempo, cleaner mistakes."
      : "Veil line: bigger highs, bigger “oops,” better stories.";
}

function updateHud() {
  els.barHp.style.width = `${(state.hp / state.maxHp) * 100}%`;
  els.barUnity.style.width = `${state.unity}%`;
  els.barJealousy.style.width = `${state.jealousy}%`;
  els.repRadiant.textContent = String(state.radiantRep);
  els.repVeil.textContent = String(state.veilRep);
  els.routeChip.classList.toggle("hidden", state.unity < 70 && !asBoolFlag(state.flags.verdantSeen));
  els.metaAct.textContent = String(state.act);
  els.metaRoom.textContent = String(state.room);
  els.metaDepth.textContent = String(state.depth);
  els.phasePill.textContent = state.phase.toUpperCase();
}

function computeAct(room) {
  if (room <= 4) return 1;
  if (room <= 9) return 2;
  return 3;
}

function buildPiles(content) {
  const scenes = content.SCENES;
  const cards = content.ADVENTURE_CARDS;

  const by = (pred) => shuffle(scenes.filter(pred));
  const pile = {
    SCENE_HUB: by((s) => s.phase === "hub"),
    SCENE_EXPLORE: by((s) => s.phase === "explore"),
    SCENE_LOCK: by((s) => s.phase === "lock"),
    SCENE_APPROACH: by((s) => s.phase === "approach"),
    SCENE_BOSS: by((s) => s.phase === "boss"),
    SCENE_AFTERMATH: by((s) => s.phase === "aftermath"),
    CARD_SCENE: shuffle(cards.filter((c) => c.deck === "SCENE")),
    CARD_LOCK: shuffle(cards.filter((c) => c.deck === "LOCK")),
    CARD_BOND: shuffle(cards.filter((c) => c.deck === "BOND")),
    CARD_LOOT: shuffle(cards.filter((c) => c.deck === "LOOT")),
    CARD_VERDANT: shuffle(cards.filter((c) => c.deck === "VERDANT")),
    CARD_CORRECTION: shuffle(cards.filter((c) => c.deck === "CORRECTION")),
    CARD_PATCH: shuffle(cards.filter((c) => c.deck === "PATCH")),
    CARD_BOSS_GATE: shuffle(cards.filter((c) => c.deck === "BOSS_GATE")),
  };

  return pile;
}

let piles;

function gateOk(def) {
  const actOk = (def.actMin ?? 1) <= state.act && state.act <= (def.actMax ?? 99);
  if (!actOk) return false;

  if (def.requires) {
    if (def.requires.verdantSeen !== undefined) {
      if (asBoolFlag(state.flags.verdantSeen) !== def.requires.verdantSeen) return false;
    }
    if (def.requires.gossipToken !== undefined) {
      if (asBoolFlag(state.flags.gossipToken) !== def.requires.gossipToken) return false;
    }
    if (def.requires.correctionHeatMin !== undefined) {
      if (state.correctionHeat < def.requires.correctionHeatMin) return false;
    }
    if (def.requires.bossUnlocked !== undefined) {
      if (asBoolFlag(state.flags.bossUnlocked) !== def.requires.bossUnlocked) return false;
    }
  }

  if (def.forbids) {
    if (def.forbids.inSafeZone !== undefined) {
      if (!!state.inSafeZone === def.forbids.inSafeZone) return false;
    }
  }

  return true;
}

function drawFrom(pileName, fallbackName) {
  let p = piles[pileName] || [];
  for (let tries = 0; tries < 60; tries += 1) {
    if (p.length === 0 && fallbackName) {
      p = piles[fallbackName] || [];
    }
    if (p.length === 0) return null;
    const def = p.shift();
    if (!def) continue;
    if (gateOk(def)) return def;
  }
  return null;
}

function phaseScenePile() {
  switch (state.phase) {
    case "hub":
      return "SCENE_HUB";
    case "lock":
      return "SCENE_LOCK";
    case "approach":
      return "SCENE_APPROACH";
    case "boss":
      return "SCENE_BOSS";
    case "aftermath":
      return "SCENE_AFTERMATH";
    case "explore":
    default:
      return "SCENE_EXPLORE";
  }
}

function pickScene() {
  const pileName = phaseScenePile();
  const scene = drawFrom(pileName, "SCENE_EXPLORE") || pickOne(window.LumoraAdventureContent.SCENES);
  els.sceneTitle.textContent = scene.title;
  els.sceneBody.textContent = scene.body;
  setStageArt(scene.tags.includes("tavern") ? "tankard" : scene.tags.includes("audit") ? "audit" : scene.tags.includes("mirror") ? "mirror" : scene.tags.includes("verdant") ? "verdant" : "dungeon");
}

function cardFactionClass(card) {
  if (card.faction) return card.faction;
  return "neutral";
}

function summarizeDelta(effects) {
  const d = { hp: 0, unity: 0, jealousy: 0 };
  for (const e of effects) {
    if (e.t === "heal") d.hp += e.v ?? 0;
    if (e.t === "dmg") d.hp -= e.v ?? 0;
    if (e.t === "unity") d.unity += e.v ?? 0;
    if (e.t === "jealousy") d.jealousy += e.v ?? 0;
  }
  const chips = [];
  if (d.hp) chips.push({ label: `HP ${d.hp > 0 ? "+" : ""}${d.hp}`, kind: d.hp > 0 ? "good" : "bad" });
  if (d.unity) chips.push({ label: `Unity ${d.unity > 0 ? "+" : ""}${d.unity}`, kind: d.unity > 0 ? "good" : "bad" });
  if (d.jealousy) chips.push({ label: `Jeal ${d.jealousy > 0 ? "+" : ""}${d.jealousy}`, kind: d.jealousy > 0 ? "bad" : "good" });
  return chips;
}

function offerToHtml(offer, idx) {
  const fc = cardFactionClass(offer.card);
  const chips = summarizeDelta(offer.card.effects);
  const chipHtml = chips
    .slice(0, 3)
    .map((c) => `<span class="chip ${c.kind}">${c.label}</span>`)
    .join("");

  return `
    <div class="offer-card ${fc}" role="listitem" tabindex="0" data-offer-index="${idx}" aria-label="${offer.card.name}">
      <div class="offer-top">
        <span class="offer-pill">${offer.card.faction ?? "neutral"}</span>
        <span class="offer-deck">${offer.deckLabel}</span>
      </div>
      <div class="offer-name">${offer.card.name}</div>
      <p class="offer-text">${offer.card.text}</p>
      <div class="offer-meta">${chipHtml}</div>
    </div>
  `;
}

function buildCardPoolFromPatchCards() {
  const w = window.LumoraPatchCards;
  if (!w) return [];
  const pool = [];
  for (const [id, def] of Object.entries(w.PLAYER_CARDS)) {
    pool.push({
      id: `p_${id}`,
      name: def.name,
      deck: "PATCH_PLAYER",
      faction: def.faction,
      text: def.text,
      tags: ["dungeon"],
      weight: 1,
      effects: def.effects.map((e) => ({ t: e.t, v: e.v, w: e.w })),
      stanceDmg: def.stanceDmg ?? 0,
      raw: def,
    });
  }
  for (const [id, def] of Object.entries(w.BOSS_CARDS)) {
    pool.push({
      id: `b_${id}`,
      name: def.name,
      deck: "PATCH_BOSS",
      faction: "neutral",
      text: def.text,
      tags: ["audit", "boss"],
      actMin: 2,
      weight: 0.85,
      effects: def.effects.map((e) => ({ t: e.t, v: e.v, w: e.w })),
      raw: def,
    });
  }
  return pool;
}

let patchCardPool = [];

function eligiblePatchCard(c) {
  // Keep boss cards out of safe zones and early acts.
  if ((c.tags || []).includes("boss") && state.inSafeZone) return false;
  const actOk = (c.actMin ?? 1) <= state.act && state.act <= (c.actMax ?? 99);
  if (!actOk) return false;
  return true;
}

function weightedPick(list) {
  const items = list.filter(Boolean);
  let total = 0;
  const weights = items.map((x) => {
    const w = Math.max(0.01, x.weight ?? 1);
    total += w;
    return w;
  });
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function buildOffers() {
  // Diversity buckets: stabilize / progress / drama
  /** @type {{ card: any; deckLabel: string; bucket: 'stabilize'|'progress'|'drama' }[]} */
  const candidates = [];

  // Context-aware deck availability
  const allow = {
    bond: state.phase === "hub" || state.phase === "aftermath" || (state.phase === "explore" && state.act >= 2),
    lock: state.phase === "lock",
    loot: state.phase === "explore" && state.act >= 2,
    verdant: state.phase !== "hub" && state.act >= 2,
    correction: state.phase !== "hub" && state.act >= 2 && (state.correctionHeat >= 1 || state.unity >= 55),
    bossGate: state.phase === "approach" || (state.act >= 2 && state.room % 6 === 0),
    patch: true,
    patchCards: true,
  };

  const pushCard = (card, deckLabel, bucket) => {
    if (!card) return;
    candidates.push({ card, deckLabel, bucket });
  };

  // Stabilize: healing / jealousy reduction / small unity
  if (allow.patch) pushCard(drawFrom("CARD_SCENE", "CARD_PATCH") || drawFrom("CARD_PATCH"), "Scene", "stabilize");
  // Progress: lock/loot/boss gate/patch player cards
  if (allow.lock) pushCard(drawFrom("CARD_LOCK"), "Lock", "progress");
  if (allow.loot) pushCard(drawFrom("CARD_LOOT", "CARD_SCENE"), "Loot", "progress");
  if (allow.bossGate && !asBoolFlag(state.flags.bossUnlocked)) pushCard(drawFrom("CARD_BOSS_GATE"), "Gate", "progress");
  // Drama: bond/correction/boss pressure
  if (allow.bond) pushCard(drawFrom("CARD_BOND", "CARD_SCENE"), "Bond", "drama");
  if (allow.verdant && !asBoolFlag(state.flags.verdantSeen)) pushCard(drawFrom("CARD_VERDANT", "CARD_SCENE"), "Verdant", "progress");
  if (allow.correction) pushCard(drawFrom("CARD_CORRECTION", "CARD_PATCH"), "Correction", "drama");

  // Always sprinkle in 1–2 Patch Duel cards (player) appropriate to stance/act.
  const patchElig = patchCardPool.filter(eligiblePatchCard);
  const patchPicks = shuffle(patchElig).slice(0, 5);
  const addPatch = (bucket) => {
    const chosen = weightedPick(patchPicks.filter((c) => !c._used));
    if (!chosen) return;
    chosen._used = true;
    pushCard(chosen, chosen.deck === "PATCH_BOSS" ? "Curator" : "Echo", bucket);
  };
  addPatch("progress");
  addPatch("stabilize");

  // Now, select final 3 with bucket diversity, falling back to anything.
  const wanted = ["stabilize", "progress", "drama"];
  const picked = [];
  for (const b of wanted) {
    const options = candidates.filter((c) => c.bucket === b && gateOk(c.card));
    if (options.length) picked.push(weightedPick(options));
  }
  while (picked.length < 3) {
    const options = candidates.filter((c) => gateOk(c.card) && !picked.includes(c));
    if (!options.length) break;
    picked.push(weightedPick(options));
  }

  // De-dupe by id
  const seen = new Set();
  const out = [];
  for (const p of picked) {
    if (!p) continue;
    const id = p.card.id || p.card.name;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }

  return out.slice(0, 3);
}

function renderOffers(offers) {
  els.offers.innerHTML = offers.map((o, idx) => offerToHtml(o, idx)).join("");
  els.offerHint.textContent =
    state.phase === "hub"
      ? "Safe zone draws: bond, gossip, prep."
      : state.phase === "lock"
        ? "Lock draws: sequence checks + setup."
        : state.phase === "approach"
          ? "Approach draws: gates + audit pressure."
          : state.phase === "boss"
            ? "Boss draws: survive phases; unity matters."
            : "Explore draws: progress + danger + comedy.";

  els.offers.querySelectorAll("[data-offer-index]").forEach((node) => {
    const idx = Number(node.getAttribute("data-offer-index"));
    node.addEventListener("click", () => chooseOffer(idx));
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        chooseOffer(idx);
      }
    });
  });
}

function applyEffect(e) {
  switch (e.t) {
    case "heal":
      state.hp = clamp(state.hp + (e.v ?? 0), 0, state.maxHp);
      break;
    case "dmg":
      state.hp = clamp(state.hp - (e.v ?? 0), 0, state.maxHp);
      break;
    case "unity":
      state.unity = clamp(state.unity + (e.v ?? 0), 0, 100);
      break;
    case "jealousy":
      state.jealousy = clamp(state.jealousy + (e.v ?? 0), 0, 100);
      break;
    case "repRadiant":
      state.radiantRep = clamp(state.radiantRep + (e.v ?? 0), 0, 100);
      break;
    case "repVeil":
      state.veilRep = clamp(state.veilRep + (e.v ?? 0), 0, 100);
      break;
    case "correctionHeat":
      state.correctionHeat = clamp(state.correctionHeat + (e.v ?? 0), 0, 9);
      break;
    case "flag":
      state.flags[e.s ?? "flag"] = e.v ?? 1;
      break;
    case "lockCheck": {
      // Stance-aligned success chance with unity assist. Always resolves.
      const base = state.stance === "radiant" ? 0.56 : 0.52;
      const unityBoost = Math.min(0.18, state.unity / 500);
      const jPenalty = Math.min(0.15, state.jealousy / 650);
      const p = clamp(base + unityBoost - jPenalty, 0.2, 0.85);
      const ok = Math.random() < p;
      if (ok) {
        state.unity = clamp(state.unity + 6, 0, 100);
        logLine("Lock solved. Unity +6.");
      } else {
        state.hp = clamp(state.hp - 8, 0, state.maxHp);
        logLine("Lock failed. Take 8.");
      }
      break;
    }
    case "correctionSpike": {
      const v = state.unity >= 55 ? 7 : 4;
      state.hp = clamp(state.hp - v, 0, state.maxHp);
      logLine(`Correction spikes for ${v}.`);
      break;
    }
    // Patch Duel combat effects, adapted to adventure meters
    case "dmgEnemy":
      // In adventure mode, treat as "clear path": Unity small bump.
      state.unity = clamp(state.unity + 1, 0, 100);
      break;
    case "healSelf":
      state.hp = clamp(state.hp + (e.v ?? 0), 0, state.maxHp);
      break;
    case "dmgSelf":
      state.hp = clamp(state.hp - (e.v ?? 0), 0, state.maxHp);
      break;
    case "dmgPlayer":
      state.hp = clamp(state.hp - (e.v ?? 0), 0, state.maxHp);
      break;
    case "healBoss":
      // boss healing becomes "audit time wasted": jealousy +1
      state.jealousy = clamp(state.jealousy + 1, 0, 100);
      break;
    case "echo":
    case "draw":
      // ignore in adventure loop (handled as flavor)
      break;
    case "verdantStrike":
      // translate to big unity spike + small self risk
      state.unity = clamp(state.unity + 4, 0, 100);
      state.jealousy = clamp(state.jealousy + 1, 0, 100);
      break;
    case "correctionDmg": {
      const v = state.unity > 45 ? 7 : 4;
      state.hp = clamp(state.hp - v, 0, state.maxHp);
      break;
    }
    default:
      break;
  }
}

function applyCard(card) {
  if (!card) return;
  logLine(`Pick: ${card.name}.`);
  for (const e of card.effects || []) applyEffect(e);
}

function checkEnd() {
  if (state.hp <= 0) {
    state.hp = 0;
    updateHud();
    stopAutoplay();
    els.sceneTitle.textContent = "Respawn anchor — try again";
    els.sceneBody.textContent =
      "Respawn is free; romance is not. The System prints a receipt for your optics debt and asks if you learned anything.";
    els.offers.innerHTML = "";
    logLine("Run ends: you respawn.");
    return true;
  }

  if (state.phase === "boss" && state.boss && state.boss.done) {
    stopAutoplay();
    state.phase = "aftermath";
    pickScene();
    updateHud();
    const offers = buildOffers();
    renderOffers(offers);
    logLine("Boss cleared. Aftermath unlocked.");
    return false;
  }

  return false;
}

function progressPhase() {
  // Deterministic milestone gates so progression always lands.
  // - Room 1–2: hub
  // - Room 3–9: explore with a lock beat near room 5
  // - Room 10–11: approach
  // - Room 12+: boss
  if (state.room <= 2) {
    state.phase = "hub";
    state.inSafeZone = true;
    return;
  }

  state.inSafeZone = false;

  if (state.room === 5) {
    state.phase = "lock";
    return;
  }

  if (state.room === 10 || state.room === 11) {
    state.phase = "approach";
    return;
  }

  if (state.room >= 12) {
    state.phase = "boss";
    if (!state.boss) state.boss = { phaseIndex: 0, done: false };
    return;
  }

  state.phase = "explore";
}

function bossTick() {
  // 3-phase boss script with guaranteed resolution.
  if (!state.boss) return;
  const p = state.boss.phaseIndex;
  if (p === 0) {
    logLine("Boss Phase 1: Audit Pulse pressure.");
    state.hp = clamp(state.hp - (3 + Math.floor(state.jealousy / 35)), 0, state.maxHp);
    state.jealousy = clamp(state.jealousy + 2, 0, 100);
  } else if (p === 1) {
    logLine("Boss Phase 2: Correction Tick tests Unity.");
    const v = state.unity >= 55 ? 7 : 4;
    state.hp = clamp(state.hp - v, 0, state.maxHp);
    state.unity = clamp(state.unity - 4, 0, 100);
  } else if (p === 2) {
    logLine("Boss Phase 3: Swipe scales with Jealousy.");
    const sw = 2 + Math.floor(state.jealousy / 22);
    state.hp = clamp(state.hp - sw, 0, state.maxHp);
    // Win condition: not dead and either high unity or low jealousy
    const win = state.hp > 0 && (state.unity >= 70 || state.jealousy <= 35);
    state.boss.done = win;
    logLine(win ? "You hold the line. Unity holds. Boss yields (for now)." : "The Curator stamps your morale into paste.");
  }
  state.boss.phaseIndex = Math.min(2, state.boss.phaseIndex + 1);
}

let currentOffers = [];

function nextRoom() {
  state.room += 1;
  state.act = computeAct(state.room);
  progressPhase();

  if (state.phase === "boss") {
    // Boss room includes a scripted tick, then offers.
    pickScene();
    bossTick();
  } else {
    pickScene();
  }

  updateHud();
  if (checkEnd()) return;

  currentOffers = buildOffers();
  renderOffers(currentOffers);
}

function scoreOffer(policy, offer) {
  const c = offer.card;
  const effects = c.effects || [];
  const sum = { hp: 0, unity: 0, jealousy: 0, rep: 0, heat: 0 };
  for (const e of effects) {
    if (e.t === "heal") sum.hp += e.v ?? 0;
    if (e.t === "dmg" || e.t === "dmgPlayer" || e.t === "dmgSelf" || e.t === "correctionDmg") sum.hp -= e.v ?? 0;
    if (e.t === "unity") sum.unity += e.v ?? 0;
    if (e.t === "jealousy") sum.jealousy += e.v ?? 0;
    if (e.t === "repRadiant" || e.t === "repVeil") sum.rep += e.v ?? 0;
    if (e.t === "correctionHeat") sum.heat += e.v ?? 0;
    if (e.t === "lockCheck") sum.unity += 3; // expected value
    if (e.t === "correctionSpike") sum.hp -= state.unity >= 55 ? 7 : 4;
  }

  const hpNeed = clamp((40 - state.hp) / 40, 0, 1);
  const jealousRisk = clamp((state.jealousy - 55) / 45, 0, 1);
  const unityGoal = clamp((70 - state.unity) / 70, 0, 1);

  const stanceBias =
    c.faction === state.stance ? 0.9 : c.faction === "neutral" || !c.faction ? 0.2 : -0.15;

  const w = policy.weights;
  let s = 0;
  s += sum.hp * (w.hp + hpNeed * 0.6);
  s += sum.unity * (w.unity + unityGoal * 0.35);
  s += sum.rep * w.rep;
  s += sum.heat * w.heat;
  s += sum.jealousy * (w.jealousy - jealousRisk * 0.65);
  s += stanceBias;

  // Boss awareness
  if (state.phase === "boss" || state.phase === "approach") {
    s += sum.unity * 0.22;
    s -= Math.max(0, sum.jealousy) * 0.18;
  }

  // Encourage variety: prefer decks we haven’t used recently
  if (offer.deckLabel === "Correction") s -= policy.avoidCorrection ? 0.6 : 0;
  if (offer.deckLabel === "Bond") s += policy.likesDrama ? 0.25 : 0;

  return s;
}

const POLICIES = [
  { id: "balanced", name: "Balanced", weights: { hp: 0.7, unity: 0.55, jealousy: -0.35, rep: 0.1, heat: -0.1 } },
  { id: "survivor", name: "Survivor", weights: { hp: 1.0, unity: 0.25, jealousy: -0.2, rep: 0.05, heat: -0.15 } },
  { id: "unity", name: "Unity-maxer", weights: { hp: 0.55, unity: 0.95, jealousy: -0.15, rep: 0.1, heat: -0.05 } },
  { id: "veilchaos", name: "Veil-chaos", weights: { hp: 0.35, unity: 0.35, jealousy: 0.35, rep: 0.0, heat: 0.1 }, likesDrama: true, avoidCorrection: false },
  { id: "radianthero", name: "Radiant-hero", weights: { hp: 0.6, unity: 0.6, jealousy: -0.3, rep: 0.25, heat: -0.1 } },
];

function selectedPolicy() {
  const id = els.policy.value || "balanced";
  return POLICIES.find((p) => p.id === id) || POLICIES[0];
}

function chooseOffer(idx) {
  if (state.busy) return;
  const offer = currentOffers[idx];
  if (!offer) return;

  state.busy = true;
  applyCard(offer.card);
  updateHud();
  if (checkEnd()) return;

  // Move forward after resolution.
  window.setTimeout(() => {
    state.busy = false;
    state.depth += 1;
    nextRoom();
  }, 120);
}

function autoPickIndex() {
  const policy = selectedPolicy();
  let best = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < currentOffers.length; i += 1) {
    const s = scoreOffer(policy, currentOffers[i]);
    if (s > bestScore) {
      bestScore = s;
      best = i;
    }
  }
  return best;
}

function stepAutoplay() {
  if (!autoplay.running) return;
  if (state.busy) return scheduleAutoplay();
  const idx = autoPickIndex();
  chooseOffer(idx);
}

function scheduleAutoplay() {
  if (!autoplay.running) return;
  const ms = Number(els.speed.value || "550");
  autoplay.timer = window.setTimeout(stepAutoplay, ms);
}

function startAutoplay() {
  autoplay.running = true;
  els.btnPlay.disabled = true;
  els.btnPause.disabled = false;
  scheduleAutoplay();
}

function stopAutoplay() {
  autoplay.running = false;
  els.btnPlay.disabled = false;
  els.btnPause.disabled = true;
  if (autoplay.timer) window.clearTimeout(autoplay.timer);
  autoplay.timer = null;
}

function initRun() {
  stopAutoplay();
  els.log.innerHTML = "";

  state = {
    hp: 28,
    maxHp: 28,
    unity: 32,
    jealousy: 14,
    radiantRep: 50,
    veilRep: 50,
    stance: "radiant",
    act: 1,
    room: 0,
    depth: 0,
    phase: "hub",
    inSafeZone: true,
    flags: { gossipToken: 0, verdantSeen: 0, bossUnlocked: 0 },
    correctionHeat: 0,
    busy: false,
    boss: null,
  };

  setStance("radiant");

  const content = window.LumoraAdventureContent;
  piles = buildPiles(content);
  patchCardPool = buildCardPoolFromPatchCards();

  // Ensure some required beats exist early via mild flags.
  logLine("Run start — the gods watch the UI like it owes them money.");
  nextRoom();
}

function fillPolicyOptions() {
  els.policy.innerHTML = POLICIES.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  els.policy.value = "balanced";
}

function wireUi() {
  els.stanceRadiant.addEventListener("click", () => {
    if (!state.busy) setStance("radiant");
  });
  els.stanceVeil.addEventListener("click", () => {
    if (!state.busy) setStance("veil");
  });

  els.btnNewRun.addEventListener("click", initRun);
  els.btnPlay.addEventListener("click", () => {
    if (!autoplay.running) startAutoplay();
  });
  els.btnPause.addEventListener("click", () => {
    stopAutoplay();
  });
  els.btnStep.addEventListener("click", () => {
    if (state.busy) return;
    const idx = autoplay.running ? autoPickIndex() : autoPickIndex();
    chooseOffer(idx);
  });

  els.speed.addEventListener("change", () => {
    if (autoplay.running) {
      if (autoplay.timer) window.clearTimeout(autoplay.timer);
      scheduleAutoplay();
    }
  });
}

function boot() {
  if (!window.LumoraAdventureContent) {
    els.sceneTitle.textContent = "Missing content file";
    els.sceneBody.textContent = "Ensure lumora-adventure-content.js is loaded before lumora-adventure.js.";
    return;
  }
  fillPolicyOptions();
  wireUi();
  initRun();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

