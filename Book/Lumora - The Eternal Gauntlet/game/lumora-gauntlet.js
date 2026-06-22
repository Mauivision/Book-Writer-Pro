/**
 * Lumora: Sky Dungeon #7 — browser prototype
 * Grounded in SERIES_BIBLE + CHARACTER_PROFILES (faction stances, Unity, Jealousy, locks, respawn).
 */

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rnd = (a, b) => a + Math.random() * (b - a);

const LOADING_QUIPS = [
  "Tip: dying is free. optics are not.",
  "Patch 0.0.7: humility spike when you run it back.",
  "Gravetender Odo says: try not to make a hobby of this.",
  "Luminos notes your bravery. Umbrax notes your timing.",
  "Loading… still loading… okay, pretend that was dramatic.",
];

const PATCH_NOTES = [
  "<strong>Patch:</strong> Jealousy scaling +3% because the gods are bored.",
  "<strong>Hotfix:</strong> Sky Dungeon #7 now cheats <em>slightly</em> less. (Lie.)",
  "<strong>Balance:</strong> Found-family buffs are OP; enjoy it while it lasts.",
];

const state = {
  hp: 100,
  maxHp: 100,
  unity: 35,
  jealousy: 15,
  radiantRep: 50,
  veilRep: 50,
  stance: "radiant",
  embarrassment: false,
  encounterIndex: 0,
  lockInput: [],
  combat: null,
  quests: [
    { id: "q1", text: "Leave the Golden Tankard without causing a diplomatic incident.", done: false },
    { id: "q2", text: "Clear Sky Dungeon #7 (starter dungeon that quietly cheats).", done: false },
    { id: "q3", text: "Survive mandatory mixed-party optics.", done: false },
  ],
};

const els = {
  barHp: document.getElementById("bar-hp"),
  barUnity: document.getElementById("bar-unity"),
  barJealousy: document.getElementById("bar-jealousy"),
  repRadiant: document.getElementById("rep-radiant"),
  repVeil: document.getElementById("rep-veil"),
  stanceRadiant: document.getElementById("stance-radiant"),
  stanceVeil: document.getElementById("stance-veil"),
  stanceDesc: document.getElementById("stance-desc"),
  debuffLine: document.getElementById("debuff-line"),
  encounterTitle: document.getElementById("encounter-title"),
  encounterBody: document.getElementById("encounter-body"),
  choices: document.getElementById("choices"),
  questLog: document.getElementById("quest-log"),
  systemLog: document.getElementById("system-log"),
  stageArt: document.getElementById("stage-art"),
  lockUi: document.getElementById("lock-ui"),
  lockSequence: document.getElementById("lock-sequence"),
  combatUi: document.getElementById("combat-ui"),
  enemyName: document.getElementById("enemy-name"),
  barEnemy: document.getElementById("bar-enemy"),
  loadingOverlay: document.getElementById("loading-overlay"),
  loadingQuip: document.getElementById("loading-quip"),
  loadingFill: document.getElementById("loading-fill"),
  patchToast: document.getElementById("patch-toast"),
  routeChip: document.getElementById("route-chip"),
  btnNewRun: document.getElementById("btn-new-run"),
};

function logSystem(msg) {
  const li = document.createElement("li");
  li.textContent = msg;
  els.systemLog.prepend(li);
  while (els.systemLog.children.length > 12) els.systemLog.removeChild(els.systemLog.lastChild);
}

function renderQuests() {
  els.questLog.innerHTML = "";
  for (const q of state.quests) {
    const li = document.createElement("li");
    li.textContent = q.text;
    if (q.done) li.classList.add("done");
    els.questLog.appendChild(li);
  }
}

function updateBars() {
  const hpPct = (state.hp / state.maxHp) * 100;
  els.barHp.style.width = `${hpPct}%`;
  els.barUnity.style.width = `${state.unity}%`;
  els.barJealousy.style.width = `${state.jealousy}%`;
  els.repRadiant.textContent = String(state.radiantRep);
  els.repVeil.textContent = String(state.veilRep);
  if (state.embarrassment) {
    els.debuffLine.classList.remove("hidden");
    els.debuffLine.textContent = "Embarrassment: next hit you take deals +15% (social damage is real).";
  } else {
    els.debuffLine.classList.add("hidden");
  }
  const verdant = state.unity >= 70;
  els.routeChip.classList.toggle("hidden", !verdant);
}

function setStance(s) {
  state.stance = s;
  els.stanceRadiant.classList.toggle("active", s === "radiant");
  els.stanceVeil.classList.toggle("active", s === "veil");
  els.stanceDesc.textContent =
    s === "radiant"
      ? "Seraphina’s line: shields and sanctified tempo — steady damage, cleaner mistakes."
      : "Veil line: curse-tech burst — bigger highs, bigger “oops,” and better stories.";
}

function setStageArt(kind) {
  els.stageArt.className = "stage-art " + (kind || "");
}

function showPatchToast() {
  const html = PATCH_NOTES[(Math.random() * PATCH_NOTES.length) | 0];
  els.patchToast.innerHTML = html;
  els.patchToast.hidden = false;
  els.patchToast.classList.add("show");
  setTimeout(() => els.patchToast.classList.remove("show"), 4200);
}

/** @type {Array<() => void>} */
const encounters = [];

function clearChoices() {
  els.choices.innerHTML = "";
}

function addChoice(label, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn";
  b.textContent = label;
  b.addEventListener("click", onClick);
  els.choices.appendChild(b);
}

function nextEncounter() {
  state.encounterIndex += 1;
  runEncounter();
}

function runEncounter() {
  clearChoices();
  els.lockUi.classList.add("hidden");
  els.combatUi.classList.add("hidden");
  const fn = encounters[state.encounterIndex];
  if (fn) fn();
  else endGame();
}

function hub() {
  setStageArt("hub");
  els.encounterTitle.textContent = "The Golden Tankard";
  els.encounterBody.textContent =
    "Mira slides a mug across the bar like she’s rolling for persuasion. Seraphina is pretending not to listen. " +
    "Somewhere upstairs, Velvet is absolutely planning a “cleansing” that sounds suspiciously like a date. " +
    "The Quest Log updates itself because the System hates you personally.";
  logSystem("Tutorial tip: if everyone likes you at once, the dungeon notices. Good luck.");
  addChoice("Take Mira’s “recovery item” (heal + gossip)", () => {
    state.hp = clamp(state.hp + 22, 1, state.maxHp);
    state.jealousy = clamp(state.jealousy + 12, 0, 100);
    logSystem("Romance flag proximity increased. Jealousy aggro formulas are smiling.");
    updateBars();
    clearChoices();
    addChoice("Enough tavern — depart for Sky Dungeon #7", () => {
      state.quests[0].done = true;
      renderQuests();
      nextEncounter();
    });
  });
  addChoice("Reassure Seraphina (Unity up, still risky)", () => {
    state.unity = clamp(state.unity + 14, 0, 100);
    state.jealousy = clamp(state.jealousy + 6, 0, 100);
    logSystem("Party cohesion improved. Also: someone saw that. Of course they did.");
    updateBars();
    clearChoices();
    addChoice("Enough tavern — depart for Sky Dungeon #7", () => {
      state.quests[0].done = true;
      renderQuests();
      nextEncounter();
    });
  });
  addChoice("Nod politely and leave for Sky Dungeon #7", () => {
    state.quests[0].done = true;
    renderQuests();
    logSystem("Objective updated: try not to die in the tutorial that lies.");
    nextEncounter();
  });
}

function walkPath() {
  setStageArt("path");
  els.encounterTitle.textContent = "The Walk to Sky Dungeon #7";
  els.encounterBody.textContent =
    "Floating stone ribs spiral upward. Tutorial arrows flicker, then rearrange when you’re not looking. " +
    "Bone Legion Commander marches like gravity is optional. The Ectoplasm Elemental hums a song that shouldn’t exist.";
  addChoice("Enter the dungeon mouth (dramatic camera not included)", () => nextEncounter());
}

function combatStart(def) {
  state.combat = {
    name: def.name,
    hp: def.hp,
    maxHp: def.hp,
    dmgMin: def.dmgMin,
    dmgMax: def.dmgMax,
    onWin: def.onWin,
    jealousyOnHit: def.jealousyOnHit ?? 4,
  };
  els.combatUi.classList.remove("hidden");
  els.enemyName.textContent = state.combat.name;
  els.barEnemy.style.width = "100%";
  els.encounterTitle.textContent = "Combat";
  renderCombatChoices();
}

function jealousyMultiplier() {
  let m = 1;
  if (state.jealousy >= 75) m += 0.25;
  if (state.embarrassment) m += 0.15;
  return m;
}

function enemyTurn() {
  const c = state.combat;
  if (!c) return;
  const base = rnd(c.dmgMin, c.dmgMax);
  const dmg = Math.round(base * jealousyMultiplier());
  state.hp -= dmg;
  if (state.embarrassment) state.embarrassment = false;
  logSystem(`${c.name} hits for ${dmg} (Jealousy/embarrassment modifiers applied).`);
  if (state.hp <= 0) {
    state.hp = 0;
    updateBars();
    respawn();
    return;
  }
  updateBars();
  renderCombatChoices();
}

function renderCombatChoices() {
  clearChoices();
  const c = state.combat;
  if (!c) return;
  els.encounterBody.textContent = `Fight: ${c.name}. Your party bickers professionally. Pick a tempo.`;
  els.barEnemy.style.width = `${(c.hp / c.maxHp) * 100}%`;

  addChoice("Strike (stance-based damage)", () => {
    let dmg;
    if (state.stance === "radiant") {
      dmg = Math.round(rnd(10, 16) + state.unity * 0.05);
    } else {
      dmg = Math.round(rnd(8, 22) + state.veilRep * 0.04);
    }
    c.hp -= dmg;
    state.jealousy = clamp(state.jealousy + c.jealousyOnHit, 0, 100);
    logSystem(`You strike for ${dmg}. The UI hearts flutter. That’s a problem.`);
    if (c.hp <= 0) {
      winCombat();
      return;
    }
    updateBars();
    enemyTurn();
  });

  addChoice("Guard (reduce next hit, small Unity)", () => {
    state.unity = clamp(state.unity + 5, 0, 100);
    logSystem("Guard stance: shields up, paperwork avoided for 0.4 seconds.");
    const base = rnd(c.dmgMin, c.dmgMax) * 0.55;
    const dmg = Math.round(base * jealousyMultiplier());
    state.hp -= dmg;
    if (state.embarrassment) state.embarrassment = false;
    if (state.hp <= 0) {
      state.hp = 0;
      updateBars();
      respawn();
      return;
    }
    updateBars();
    if (c.hp <= 0) winCombat();
    else renderCombatChoices();
  });

  addChoice("Rally the mixed party (+Unity, +Jealousy)", () => {
    state.unity = clamp(state.unity + 12, 0, 100);
    state.jealousy = clamp(state.jealousy + 14, 0, 100);
    const dmg = Math.round(rnd(6, 12));
    c.hp -= dmg;
    logSystem(`Inspirational speech deals ${dmg} emotional damage… to the boss and your love life.`);
    if (c.hp <= 0) {
      winCombat();
      return;
    }
    updateBars();
    enemyTurn();
  });
}

function winCombat() {
  const onWin = state.combat?.onWin;
  state.combat = null;
  els.combatUi.classList.add("hidden");
  if (typeof onWin === "function") onWin();
  else nextEncounter();
}

function respawn() {
  state.combat = null;
  els.combatUi.classList.add("hidden");
  els.loadingQuip.textContent = LOADING_QUIPS[(Math.random() * LOADING_QUIPS.length) | 0];
  els.loadingOverlay.classList.add("visible");
  els.loadingFill.style.animation = "none";
  void els.loadingFill.offsetWidth;
  els.loadingFill.style.animation = "";

  window.setTimeout(() => {
    state.hp = state.maxHp;
    state.radiantRep = clamp(state.radiantRep - 6, 0, 100);
    state.veilRep = clamp(state.veilRep - 3, 0, 100);
    state.embarrassment = true;
    state.jealousy = clamp(state.jealousy - 5, 0, 100);
    logSystem("Respawned at nearest shrine anchor. Reputation took a hit. You feel watched.");
    els.loadingOverlay.classList.remove("visible");
    updateBars();
    runEncounter();
  }, 1300);
}

function lockRoom() {
  setStageArt("lock");
  state.lockInput = [];
  els.lockUi.classList.remove("hidden");
  els.encounterTitle.textContent = "Light / Shadow Lock";
  els.encounterBody.textContent =
    "Twin sockets glare: one wants Radiant order, the other wants Veil mischief. The System tooltip reads: “sequence matters.” " +
    "Sky Dungeon #7 quietly cheats — but your cross-faction party is also cheating back. " +
    "(Cooperative hint: try Light, Shadow, Light.)";
  renderLockSeq();
  clearChoices();
  addChoice("Force the lock (Veil energy, hurts)", () => {
    state.jealousy = clamp(state.jealousy + 8, 0, 100);
    state.hp = clamp(state.hp - 18, 1, state.maxHp);
    state.veilRep = clamp(state.veilRep + 3, 0, 100);
    logSystem("The lock laughs in UI font… then surrenders out of respect for audacity.");
    els.lockUi.classList.add("hidden");
    updateBars();
    nextEncounter();
  });
}

function renderLockSeq() {
  els.lockSequence.textContent = state.lockInput.join(" · ") || "—";
}

document.getElementById("lock-clear").addEventListener("click", () => {
  state.lockInput = [];
  renderLockSeq();
});

document.querySelectorAll(".btn.lock").forEach((btn) => {
  btn.addEventListener("click", () => {
    const bit = btn.getAttribute("data-bit");
    if (bit) state.lockInput.push(bit);
    if (state.lockInput.length > 8) state.lockInput.shift();
    renderLockSeq();
  });
});

document.getElementById("lock-submit").addEventListener("click", () => {
  const ok = state.lockInput.join(",") === "L,S,L";
  if (ok) {
    state.unity = clamp(state.unity + 10, 0, 100);
    logSystem("Lock accepts mixed inputs. The gods pretend that was intended.");
    els.lockUi.classList.add("hidden");
    nextEncounter();
  } else {
    state.hp = clamp(state.hp - 12, 1, state.maxHp);
    logSystem("Wrong sequence. The door gives you a patronizing shock.");
    state.lockInput = [];
    renderLockSeq();
    updateBars();
  }
});

function eventCoop() {
  setStageArt("path");
  els.encounterTitle.textContent = "The Dungeon Hates Teamwork";
  els.encounterBody.textContent =
    "A corridor splits into Radiant glyphs and Veil graffiti. Chiller Executioner wants to smash the pretty door. " +
    "Luminara wants to solve it with flair. Haruto’s Quest Log offers three awful options.";
  addChoice("Radiant protocol: slow, sanctified, optics-safe", () => {
    state.radiantRep = clamp(state.radiantRep + 5, 0, 100);
    state.unity = clamp(state.unity + 4, 0, 100);
    logSystem("Dominion approves. Umbrax rolls his eyes so hard the sky flickers.");
    nextEncounter();
  });
  addChoice("Veil shortcut: fast, loud, legally distinct chaos", () => {
    state.veilRep = clamp(state.veilRep + 5, 0, 100);
    state.jealousy = clamp(state.jealousy + 10, 0, 100);
    logSystem("Progress secured. Emotional collateral: significant.");
    nextEncounter();
  });
  addChoice("Forced co-op: split the party and sync anyway", () => {
    state.unity = clamp(state.unity + 16, 0, 100);
    state.jealousy = clamp(state.jealousy + 6, 0, 100);
    state.quests[2].done = true;
    renderQuests();
    logSystem("Mixed-party optics achieved. The System schedules a ‘correction’ for later you.");
    nextEncounter();
  });
}

function combatCorrection() {
  setStageArt("crypt");
  if (state.unity >= 65) {
    els.encounterBody.textContent =
      "Unity climbed high enough to trigger an immune response — a Correction spawn drops in to punish meta synergy. " +
      "It looks like paperwork with teeth.";
    logSystem("Correction: anti-meta spawn. Twin gods argue in patch-note cadence.");
    combatStart({
      name: "Correction Sprite (Audit)",
      hp: 55,
      dmgMin: 6,
      dmgMax: 14,
      jealousyOnHit: 2,
      onWin: () => {
        state.unity = clamp(state.unity - 8, 0, 100);
        showPatchToast();
        nextEncounter();
      },
    });
  } else {
    logSystem("Unity below correction threshold. The dungeon settles for petty traps instead.");
    nextEncounter();
  }
}

function miniJealousy() {
  setStageArt("path");
  els.encounterTitle.textContent = "Jealousy Aggro Warning";
  els.encounterBody.textContent =
    "The air gets hot. Not Luminara-hot — System-hot. A banner unfurls: “Morale: Dangerous.” " +
    "Tutorial text tries to suggest you pick a favorite. You refuse. The dungeon sulks.";
  addChoice("Diffuse with dry humor (Jealousy down, small HP cost)", () => {
    state.jealousy = clamp(state.jealousy - 18, 0, 100);
    state.hp = clamp(state.hp - 6, 1, state.maxHp);
    logSystem("Humor damage: effective. Your dignity: debatable.");
    updateBars();
    nextEncounter();
  });
  addChoice("Double down on fairness (Unity up, Jealousy up)", () => {
    state.unity = clamp(state.unity + 10, 0, 100);
    state.jealousy = clamp(state.jealousy + 12, 0, 100);
    logSystem("Everyone feels heard. Everyone also feels jealous. Perfect balance.");
    updateBars();
    nextEncounter();
  });
}

function boss() {
  setStageArt("boss");
  state.quests[1].done = true;
  renderQuests();
  els.encounterTitle.textContent = "Sky Dungeon Curator";
  combatStart({
    name: "Sky Dungeon Curator (Starter Boss)",
    hp: 95,
    dmgMin: 9,
    dmgMax: 18,
    jealousyOnHit: 5,
    onWin: () => endGame(true),
  });
}

function endGame(won = false) {
  clearChoices();
  els.lockUi.classList.add("hidden");
  els.combatUi.classList.add("hidden");
  setStageArt("hub");
  els.encounterTitle.textContent = won ? "Run Cleared (for now)" : "To be continued…";
  els.encounterBody.textContent = won
    ? "The Curator dissolves into loot prompts and a smug achievement sound. Mira already texted—somehow—asking how many hearts you popped. " +
      "Patch Notes blink: “Volume 2 hook pending.” Seraphina clears her throat. The Bone Legion Commander pretends not to care."
    : "The System saves your place. Twin gods schedule a balance pass. You live to flirt another day.";
  if (won) logSystem("Boss down. Loot binds to Player — narrative hook installed.");
  addChoice("New run", () => resetRun());
}

function resetRun() {
  state.hp = 100;
  state.maxHp = 100;
  state.unity = 35;
  state.jealousy = 15;
  state.radiantRep = 50;
  state.veilRep = 50;
  state.stance = "radiant";
  state.embarrassment = false;
  state.encounterIndex = 0;
  state.lockInput = [];
  state.combat = null;
  state.quests.forEach((q) => {
    q.done = false;
  });
  els.systemLog.innerHTML = "";
  renderQuests();
  setStance("radiant");
  updateBars();
  logSystem("New run initialized. Respawn is free. Romance is not.");
  runEncounter();
}

encounters.push(hub);
encounters.push(walkPath);
encounters.push(() => {
  setStageArt("crypt");
  els.encounterTitle.textContent = "Encounter: Shimmermite Cluster";
  combatStart({
    name: "Shimmermite Cluster",
    hp: 42,
    dmgMin: 5,
    dmgMax: 11,
    onWin: nextEncounter,
  });
});
encounters.push(lockRoom);
encounters.push(eventCoop);
encounters.push(combatCorrection);
encounters.push(miniJealousy);
encounters.push(boss);

els.stanceRadiant.addEventListener("click", () => setStance("radiant"));
els.stanceVeil.addEventListener("click", () => setStance("veil"));
els.btnNewRun.addEventListener("click", () => resetRun());

renderQuests();
setStance("radiant");
updateBars();
logSystem("Welcome to Lumora. Quest windows are not legally binding advice.");
runEncounter();
