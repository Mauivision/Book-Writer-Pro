/**
 * Lumora Tarot Story RPG — companion logic.
 * Works with any standard 78-card tarot; optional digital draw for solo / online tables.
 */
(function () {
  const SUITS = [
    { id: "wands", label: "Wands", theme: "Drive, craft, conflict, initiative." },
    { id: "cups", label: "Cups", theme: "Emotion, bonds, morale, memory." },
    { id: "swords", label: "Swords", theme: "Truth, pressure, sharp choices, anxiety." },
    { id: "pentacles", label: "Pentacles", theme: "Resources, body, reputation, loot." },
  ];

  const RANKS = [
    "Ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Page",
    "Knight",
    "Queen",
    "King",
  ];

  const RANK_STORY = {
    Ace: "A seed moment: offer, omen, or small advantage appears.",
    "2": "Tension between two paths, two people, or two truths.",
    "3": "Community, collaboration, or a triangle of motives.",
    "4": "Stability, rest, structure — or stubborn stillness.",
    "5": "Friction, rivalry, scattered resources.",
    "6": "Return, recognition, reward, or nostalgia.",
    "7": "Courage under doubt; a plan tested in the open.",
    "8": "Skill, repetition, refinement — mastery through grind.",
    "9": "Near-completion, weariness, last-mile anxiety.",
    "10": "Peak load: legacy, burden, or full-circle consequence.",
    Page: "A messenger, student, rumor, or beginner’s luck.",
    Knight: "A crusade, obsession, charge — momentum with risk.",
    Queen: "Care, boundaries, intuition wielded as power.",
    King: "Authority, mastery, responsibility — command with cost.",
  };

  const MAJORS = [
    { n: 0, name: "The Fool", s: "A reckless leap, beginner’s luck, or a door you cannot un-open.", l: "The tutorial smiles. The dungeon files the paperwork anyway." },
    { n: 1, name: "The Magician", s: "Tools, charisma, clever leverage — you can bend the scene.", l: "Party buffs are real if you narrate the setup like a patch note." },
    { n: 2, name: "The High Priestess", s: "Hidden knowledge, intuition, something withheld on purpose.", l: "The dungeon reads the table. Silence is a mechanic." },
    { n: 3, name: "The Empress", s: "Growth, care, abundance, creative nurture.", l: "Verdant resonance: kindness becomes leverage without cruelty." },
    { n: 4, name: "The Emperor", s: "Order, law, hierarchy, hard boundaries.", l: "Curator voice: rules are affectionate, if you squint." },
    { n: 5, name: "The Hierophant", s: "Tradition, institution, teaching, orthodoxy.", l: "Guild meta: what everyone ‘knows’ is a trap and a shield." },
    { n: 6, name: "The Lovers", s: "Choice, bond, values clash, attraction of opposites.", l: "Bond quest fork: choose the relationship, not just the loot." },
    { n: 7, name: "The Chariot", s: "Willpower, victory through focus, controlled chaos.", l: "Raid momentum: the bus leaves when courage does." },
    { n: 8, name: "Strength", s: "Soft courage, patience, compassion as power.", l: "Unity trial: win without making someone small." },
    { n: 9, name: "The Hermit", s: "Solitude, lantern-in-dark, truth you can only hear alone.", l: "Solo queue wisdom: the anomaly is listening." },
    { n: 10, name: "Wheel of Fortune", s: "Swings, luck, timing, external forces rotate the table.", l: "Patch notes rewrite reality; roll with the changelog." },
    { n: 11, name: "Justice", s: "Consequences, fairness, testimony, the scales tip.", l: "Public choice cliffhanger: the crowd is also a judge." },
    { n: 12, name: "The Hanged Man", s: "Pause, sacrifice, perspective flip, willing surrender.", l: "Veil offer: the contract is honest — read the fine print aloud." },
    { n: 13, name: "Death", s: "Endings that clear space; transformation, not gore.", l: "World boss phase shift: the old rule set dies on schedule." },
    { n: 14, name: "Temperance", s: "Blending, healing, moderation, experimental alchemy.", l: "Co-op chemistry: mix Radiant clarity with Veil patience." },
    { n: 15, name: "The Devil", s: "Temptation, addiction, a deal too sweet, golden cages.", l: "Real contract: what you want costs what you are willing to become." },
    { n: 16, name: "The Tower", s: "Sudden clarity through collapse; shock reveals truth.", l: "Town becomes dungeon: the social geometry breaks open." },
    { n: 17, name: "The Star", s: "Hope after ruin, gentle signal, quiet renewal.", l: "Aftermath warmth: small kindnesses become navigation." },
    { n: 18, name: "The Moon", s: "Illusion, fear, dreams, paths that move when un-watched.", l: "Anomaly hearing: trust the wrong sense on purpose, then revise." },
    { n: 19, name: "The Sun", s: "Joy, clarity, visibility, uncomplicated victory — briefly.", l: "Golden Tankard gossip: fame is a buff and a debuff." },
    { n: 20, name: "Judgement", s: "Call to rise, reckoning, second chance declared aloud.", l: "Declaration duel: say what you will no longer pretend." },
    { n: 21, name: "The World", s: "Completion, integration, the next threshold opens.", l: "Volume hook: celebrate, then admit the gauntlet continues." },
  ];

  const SPREADS = {
    beat: {
      title: "Three-card beat",
      positions: [
        { key: "now", title: "Now", hint: "What is true in the scene this moment?" },
        { key: "friction", title: "Friction", hint: "What resists, bites, or complicates?" },
        { key: "door", title: "Door", hint: "What opens if players engage honestly?" },
      ],
    },
    act: {
      title: "Five-card act",
      positions: [
        { key: "goal", title: "Goal", hint: "What victory looks like for this beat." },
        { key: "obstacle", title: "Obstacle", hint: "The pressure, rival, or scarcity." },
        { key: "secret", title: "Secret", hint: "Something not everyone knows." },
        { key: "cost", title: "Cost", hint: "What payment the story demands." },
        { key: "push", title: "If you push", hint: "What happens if courage spikes — heroism tax." },
      ],
    },
    bond: {
      title: "Bond spotlight",
      positions: [
        { key: "tie", title: "The tie", hint: "What connects two characters right now?" },
        { key: "strain", title: "Strain", hint: "Where jealousy, envy, or misread creeps in." },
        { key: "gesture", title: "Gesture", hint: "A small action that could heal or harm." },
      ],
    },
  };

  const REV_STORY = "Reversed tilt: delay, excess, inversion, or the lesson arrives sideways — pick one and play it loud.";
  const LOG_KEY = "lumora-tarot-rpg-log-v1";
  const CHARS_KEY = "lumora-tarot-rpg-chars-v1";

  function buildDeck() {
    const deck = [];
    for (const m of MAJORS) {
      deck.push({ kind: "major", ...m, id: `major-${m.n}` });
    }
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          kind: "minor",
          suit: suit.id,
          suitLabel: suit.label,
          rank,
          id: `minor-${suit.id}-${rank}`,
          name: `${rank} of ${suit.label}`,
        });
      }
    }
    return deck;
  }

  function drawCard(deck, reversedChance) {
    const c = deck[Math.floor(Math.random() * deck.length)];
    const reversed = Math.random() < reversedChance;
    return { ...c, reversed };
  }

  function cardLabel(c) {
    const base = c.kind === "major" ? c.name : c.name;
    return c.reversed ? `${base} · reversed` : base;
  }

  function storyPromptFor(c) {
    if (c.kind === "major") {
      const core = c.reversed ? `${c.s} ${REV_STORY}` : c.s;
      return { story: core, lumora: c.l };
    }
    const suit = SUITS.find((s) => s.id === c.suit);
    const rankLine = RANK_STORY[c.rank] || "A numbered beat: scale the pressure with the value on the card.";
    const suitLine = suit ? suit.theme : "";
    const core = `${rankLine} ${suitLine}`.trim();
    return {
      story: c.reversed ? `${core} ${REV_STORY}` : core,
      lumora:
        c.suit === "cups"
          ? "Morale track: who feels seen, who feels replaced?"
          : c.suit === "swords"
            ? "Audit spike: ask a sharp question the table must answer."
            : c.suit === "wands"
              ? "Initiative tax: action feels good — check who pays the heat."
              : "Loot and consequences: gold changes relationships, not just inventory.",
    };
  }

  /** ---------- DOM ---------- */
  const els = {
    tabs: () => document.querySelectorAll("[data-tab]"),
    panels: () => document.querySelectorAll("[data-panel]"),
    spreadRadios: () => document.querySelectorAll('input[name="spread"]'),
    revChance: () => document.getElementById("rev-chance"),
    oracleSlots: () => document.getElementById("oracle-slots"),
    btnDraw: () => document.getElementById("btn-oracle-draw"),
    btnClear: () => document.getElementById("btn-oracle-clear"),
    btnLog: () => document.getElementById("btn-oracle-log"),
    oracleLog: () => document.getElementById("oracle-log"),
    btnLogClear: () => document.getElementById("btn-log-clear"),
    btnLogExport: () => document.getElementById("btn-log-export"),
    cardDatalist: () => document.getElementById("tarot-card-list"),
    sessionParty: () => document.getElementById("session-party"),
    sessionNotes: () => document.getElementById("session-notes"),
    sessionJson: () => document.getElementById("session-json"),
    sessionMsg: () => document.getElementById("session-msg"),
    btnSave: () => document.getElementById("btn-session-save"),
    btnLoad: () => document.getElementById("btn-session-load"),
    btnExport: () => document.getElementById("btn-session-export"),
    btnImport: () => document.getElementById("btn-session-import"),
    btnCopy: () => document.getElementById("btn-session-copy"),
    refSearch: () => document.getElementById("ref-search"),
    refMount: () => document.getElementById("ref-major-mount"),
  };

  const STORAGE_KEY = "lumora-tarot-rpg-session-v1";

  function setTab(id) {
    els.tabs().forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === id)));
    els.panels().forEach((p) => {
      p.hidden = p.dataset.panel !== id;
    });
  }

  function currentSpreadKey() {
    const r = [...els.spreadRadios()].find((x) => x.checked);
    return r ? r.value : "beat";
  }

  function clearOracleText() {
    const mount = els.oracleSlots();
    if (!mount) return;
    mount.querySelectorAll(".slot").forEach((slot) => {
      const inputEl = slot.querySelector(".slot-input");
      const revEl = slot.querySelector(".slot-rev");
      const cardEl = slot.querySelector(".slot-card");
      const promptEl = slot.querySelector(".slot-prompt");
      if (inputEl) inputEl.value = "";
      if (revEl) revEl.checked = false;
      if (cardEl) {
        cardEl.classList.add("muted");
        cardEl.innerHTML = "— draw from your deck, or use <strong>Draw digital</strong> —";
      }
      if (promptEl) promptEl.innerHTML = "";
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeCardQuery(q) {
    return String(q || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[“”]/g, "\"")
      .replace(/[’]/g, "'")
      .replace(/·/g, "-");
  }

  function buildCardIndex(deck) {
    /** @type {Map<string, any>} */
    const byKey = new Map();
    for (const c of deck) {
      // canonical name
      byKey.set(normalizeCardQuery(c.name), c);
      // majors: allow "0", "21", "#0", etc
      if (c.kind === "major") {
        byKey.set(normalizeCardQuery(String(c.n)), c);
        byKey.set(normalizeCardQuery(`#${c.n}`), c);
      }
    }
    return byKey;
  }

  function saveSession() {
    const party = els.sessionParty()?.value || "";
    const notes = els.sessionNotes()?.value || "";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ party, notes, savedAt: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const o = JSON.parse(raw);
      if (els.sessionParty()) els.sessionParty().value = o.party || "";
      if (els.sessionNotes()) els.sessionNotes().value = o.notes || "";
      if (els.sessionJson()) els.sessionJson().value = raw;
    } catch {
      /* ignore */
    }
  }

  function setSessionMsg(text) {
    const el = els.sessionMsg();
    if (!el) return;
    el.textContent = text;
  }

  function exportSessionJson() {
    const party = els.sessionParty()?.value || "";
    const notes = els.sessionNotes()?.value || "";
    const payload = { party, notes, exportedAt: new Date().toISOString() };
    const txt = JSON.stringify(payload, null, 2);
    if (els.sessionJson()) els.sessionJson().value = txt;
    downloadText(`lumora-tarot-session-${safeFileStamp()}.json`, txt);
    setSessionMsg("Exported JSON.");
  }

  function importSessionJson() {
    const raw = els.sessionJson()?.value || "";
    try {
      const o = JSON.parse(raw);
      if (els.sessionParty()) els.sessionParty().value = o.party || "";
      if (els.sessionNotes()) els.sessionNotes().value = o.notes || "";
      saveSession();
      setSessionMsg("Imported JSON into session fields.");
    } catch {
      setSessionMsg("Could not parse JSON. Make sure you pasted the full export.");
    }
  }

  async function copySessionJson() {
    const raw = els.sessionJson()?.value || "";
    try {
      await navigator.clipboard.writeText(raw);
      setSessionMsg("Copied JSON to clipboard.");
    } catch {
      setSessionMsg("Copy failed (clipboard permission).");
    }
  }

  function safeFileStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function readLog() {
    try {
      const raw = localStorage.getItem(LOG_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function writeLog(entries) {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(0, 200)));
    } catch {
      /* ignore */
    }
  }

  function renderLog() {
    const mount = els.oracleLog();
    if (!mount) return;
    const entries = readLog();
    mount.innerHTML = "";
    entries.forEach((e) => {
      const li = document.createElement("li");
      const when = e.when ? new Date(e.when) : null;
      const ts = when && !Number.isNaN(when.valueOf()) ? when.toLocaleString() : "—";
      li.innerHTML = `
        <div class="log-head">
          <span class="log-title">${escapeHtml(e.spreadTitle || "Spread")}</span>
          <span class="log-meta">${escapeHtml(ts)}</span>
        </div>
        <div class="log-cards">${(e.cards || [])
          .map((c) => `<span>${escapeHtml(c)}</span>`)
          .join("")}</div>
      `;
      mount.appendChild(li);
    });
  }

  function clearLog() {
    writeLog([]);
    renderLog();
  }

  function exportLog() {
    const entries = readLog();
    const txt = JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 2);
    downloadText(`lumora-tarot-log-${safeFileStamp()}.json`, txt);
  }

  function renderMajorReference(filter) {
    const mount = els.refMount();
    if (!mount) return;
    const q = (filter || "").trim().toLowerCase();
    mount.innerHTML = "";
    MAJORS.filter((m) => !q || m.name.toLowerCase().includes(q) || String(m.n).includes(q)).forEach((m) => {
      const det = document.createElement("details");
      det.className = "ref-major";
      det.innerHTML = `
        <summary>${escapeHtml(m.name)} <span class="muted mono">#${m.n}</span></summary>
        <p class="muted" style="margin:0.35rem 0 0;font-size:0.86rem"><strong>Story:</strong> ${escapeHtml(m.s)}</p>
        <p class="muted" style="margin:0.25rem 0 0;font-size:0.86rem;color:var(--verdant)"><strong>Lumora:</strong> ${escapeHtml(m.l)}</p>
      `;
      mount.appendChild(det);
    });
  }

  function getSlotState(slotEl) {
    const input = slotEl.querySelector(".slot-input");
    const rev = slotEl.querySelector(".slot-rev");
    return { name: input?.value || "", reversed: Boolean(rev?.checked) };
  }

  function setSlotState(slotEl, state) {
    const input = slotEl.querySelector(".slot-input");
    const rev = slotEl.querySelector(".slot-rev");
    if (input) input.value = state?.name || "";
    if (rev) rev.checked = Boolean(state?.reversed);
  }

  function applySlotCard(slotEl, cardLike) {
    const cardEl = slotEl.querySelector(".slot-card");
    const promptEl = slotEl.querySelector(".slot-prompt");
    if (!cardEl || !promptEl) return;
    if (!cardLike) {
      cardEl.classList.add("muted");
      cardEl.innerHTML = "— draw from your deck, or use <strong>Draw digital</strong> —";
      promptEl.innerHTML = "";
      return;
    }
    const { story, lumora } = storyPromptFor(cardLike);
    cardEl.classList.remove("muted");
    cardEl.innerHTML = `${escapeHtml(cardLabel(cardLike))}${cardLike.reversed ? ' <span class="rev">rev</span>' : ""}`;
    promptEl.innerHTML = `<strong>Story:</strong> ${escapeHtml(story)}<br/><strong class="mono" style="color:var(--verdant)">Lumora:</strong> ${escapeHtml(lumora)}`;
  }

  function resolveCardFromInput(deckIndex, state) {
    const q = normalizeCardQuery(state?.name || "");
    if (!q) return null;
    const base = deckIndex.get(q);
    if (!base) return null;
    return { ...base, reversed: Boolean(state?.reversed) };
  }

  function populateDatalist(deck) {
    const dl = els.cardDatalist();
    if (!dl) return;
    dl.innerHTML = "";
    // Majors first, then minors
    const majors = deck.filter((c) => c.kind === "major").sort((a, b) => a.n - b.n);
    const minors = deck.filter((c) => c.kind === "minor");
    [...majors, ...minors].forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.name;
      dl.appendChild(opt);
    });
  }

  function wire() {
    const deck = buildDeck();
    const deckIndex = buildCardIndex(deck);
    populateDatalist(deck);

    els.tabs().forEach((tab) => {
      tab.addEventListener("click", () => setTab(tab.dataset.tab));
    });

    els.spreadRadios().forEach((r) => {
      r.addEventListener("change", () => {
        renderOracle();
        clearOracleText();
      });
    });

    els.btnDraw()?.addEventListener("click", () => fillOracleDraws(deck));
    els.btnClear()?.addEventListener("click", () => {
      renderOracle();
      clearOracleText();
    });

    els.btnSave()?.addEventListener("click", saveSession);
    els.btnLoad()?.addEventListener("click", loadSession);
    els.btnExport()?.addEventListener("click", exportSessionJson);
    els.btnImport()?.addEventListener("click", importSessionJson);
    els.btnCopy()?.addEventListener("click", copySessionJson);

    els.refSearch()?.addEventListener("input", (e) => renderMajorReference(e.target.value));

    // Characters
    els.btnCharAdd()?.addEventListener("click", () => {
      const name = (els.charName()?.value || "").trim();
      if (!name) return;
      const role = (els.charRole()?.value || "").trim();
      const traits = (els.charTraits()?.value || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 6);
      const chars = readChars();
      chars.push({
        id: cryptoId(),
        name,
        role,
        traits,
        hope: 0,
        strain: 0,
      });
      writeChars(chars);
      renderChars();
      if (els.charName()) els.charName().value = "";
      if (els.charRole()) els.charRole().value = "";
      if (els.charTraits()) els.charTraits().value = "";
      setCharsMsg("Character added.");
    });
    els.btnCharsClear()?.addEventListener("click", () => {
      writeChars([]);
      writeBond(0);
      renderChars();
      renderBond();
      setCharsMsg("Cleared all characters.");
    });
    els.btnCharsExport()?.addEventListener("click", () => {
      const payload = { exportedAt: new Date().toISOString(), bond: readBond(), characters: readChars() };
      downloadText(`lumora-tarot-characters-${safeFileStamp()}.json`, JSON.stringify(payload, null, 2));
      setCharsMsg("Exported characters JSON.");
    });

    document.querySelectorAll("[data-track=\"bond\"]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = Number(btn.getAttribute("data-delta") || "0");
        const v = clamp(readBond() + d, 0, 5);
        writeBond(v);
        renderBond();
      });
    });

    // Moves / resolution
    els.btnMoveDraw()?.addEventListener("click", () => {
      const revChance = clamp(Number(els.revChance()?.value || 22) / 100, 0, 0.45);
      const c = drawCard(deck, revChance);
      if (els.moveCard()) els.moveCard().value = c.name;
      if (els.moveRev()) els.moveRev().checked = c.reversed;
      renderMove(deckIndex);
    });
    els.btnMoveClear()?.addEventListener("click", () => {
      if (els.moveCard()) els.moveCard().value = "";
      if (els.moveRev()) els.moveRev().checked = false;
      if (els.moveResult()) els.moveResult().textContent = "No move drawn yet.";
      if (els.movePrompt()) els.movePrompt().innerHTML = "";
    });
    els.moveCard()?.addEventListener("input", () => renderMove(deckIndex));
    els.moveRev()?.addEventListener("change", () => renderMove(deckIndex));
    els.movePick()?.addEventListener("change", () => renderMove(deckIndex));

    // Generators
    els.btnGenNpc()?.addEventListener("click", () => renderGen("npc", drawCard(deck, 0.22)));
    els.btnGenLoc()?.addEventListener("click", () => renderGen("loc", drawCard(deck, 0.22)));
    els.btnGenProb()?.addEventListener("click", () => renderGen("prob", drawCard(deck, 0.22)));
    els.btnGenTwist()?.addEventListener("click", () => renderGen("twist", drawCard(deck, 0.22)));

    els.btnLog()?.addEventListener("click", () => {
      const key = currentSpreadKey();
      const spread = SPREADS[key];
      const mount = els.oracleSlots();
      if (!mount || !spread) return;
      const cards = [...mount.querySelectorAll(".slot")].map((slot) => {
        const st = getSlotState(slot);
        const resolved = resolveCardFromInput(deckIndex, st);
        if (resolved) return cardLabel(resolved);
        const shown = slot.querySelector(".slot-card")?.textContent?.trim() || "";
        return shown || "—";
      });
      const entries = readLog();
      entries.unshift({ when: new Date().toISOString(), spreadKey: key, spreadTitle: spread.title, cards });
      writeLog(entries);
      renderLog();
    });
    els.btnLogClear()?.addEventListener("click", clearLog);
    els.btnLogExport()?.addEventListener("click", exportLog);

    renderOracle();
    clearOracleText();
    renderMajorReference("");
    loadSession();
    setTab("rules");
    renderLog();
    renderChars();
    renderBond();

    // Slot listeners: manual physical-deck entry
    const mount = els.oracleSlots();
    if (mount) {
      mount.addEventListener("input", (ev) => {
        const t = ev.target;
        const slot = t && t.closest ? t.closest(".slot") : null;
        if (!slot) return;
        if (t.classList && (t.classList.contains("slot-input") || t.classList.contains("slot-rev"))) {
          const st = getSlotState(slot);
          const resolved = resolveCardFromInput(deckIndex, st);
          applySlotCard(slot, resolved);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
  function renderOracle() {
    const key = currentSpreadKey();
    const spread = SPREADS[key];
    const mount = els.oracleSlots();
    if (!mount || !spread) return;
    mount.innerHTML = "";
    spread.positions.forEach((pos, idx) => {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.slotIndex = String(idx);
      slot.innerHTML = `
        <div class="slot-head">
          <span class="slot-title">${pos.title}</span>
          <span class="muted mono">${idx + 1}</span>
        </div>
        <p class="muted" style="margin:0.25rem 0 0;font-size:0.84rem">${pos.hint}</p>
        <div class="slot-controls">
          <input class="slot-input" type="text" list="tarot-card-list" placeholder="Type card name (e.g., The Star, 7 of Swords)" autocomplete="off" />
          <label class="rev-pick"><input class="slot-rev" type="checkbox" /> reversed</label>
        </div>
        <div class="slot-card muted">— draw from your deck, or use <strong>Draw digital</strong> —</div>
        <div class="slot-prompt"></div>
      `;
      mount.appendChild(slot);
    });
  }

  function fillOracleDraws(deck) {
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function cryptoId() {
    try {
      // eslint-disable-next-line no-undef
      return crypto.randomUUID();
    } catch {
      return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
    }
  }

  // ---------- Characters ----------
  function readChars() {
    try {
      const raw = localStorage.getItem(CHARS_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function writeChars(chars) {
    try {
      localStorage.setItem(CHARS_KEY, JSON.stringify(chars.slice(0, 20)));
    } catch {
      /* ignore */
    }
  }

  function readBond() {
    try {
      const raw = localStorage.getItem(`${CHARS_KEY}:bond`);
      return clamp(Number(raw || 0), 0, 5);
    } catch {
      return 0;
    }
  }

  function writeBond(v) {
    try {
      localStorage.setItem(`${CHARS_KEY}:bond`, String(clamp(v, 0, 5)));
    } catch {
      /* ignore */
    }
  }

  function setCharsMsg(text) {
    const el = els.charsMsg();
    if (!el) return;
    el.textContent = text;
  }

  function renderBond() {
    const el = els.bondVal();
    if (!el) return;
    el.textContent = String(readBond());
  }

  function adjustChar(id, key, delta) {
    const chars = readChars();
    const idx = chars.findIndex((c) => c.id === id);
    if (idx === -1) return;
    chars[idx][key] = clamp(Number(chars[idx][key] || 0) + delta, 0, 5);
    writeChars(chars);
    renderChars();
  }

  function deleteChar(id) {
    writeChars(readChars().filter((c) => c.id !== id));
    renderChars();
  }

  function renderChars() {
    const mount = els.charsMount();
    if (!mount) return;
    const chars = readChars();
    mount.innerHTML = "";
    if (!chars.length) {
      mount.innerHTML = `<div class="muted">No characters yet. Add one above.</div>`;
      return;
    }
    chars.forEach((c) => {
      const card = document.createElement("div");
      card.className = "char-card";
      card.innerHTML = `
        <div class="char-head">
          <div>
            <div class="char-name">${escapeHtml(c.name || "—")}</div>
            <div class="char-role">${escapeHtml(c.role || "")}</div>
          </div>
          <button type="button" class="btn ghost btn-char-del" data-id="${escapeHtml(c.id)}">Remove</button>
        </div>
        <div class="pill-row">${(c.traits || []).map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("")}</div>
        <div class="char-tracks">
          <div class="mini-track">
            <span class="label">Hope / Unity</span>
            <span class="val"><span class="mono">${escapeHtml(String(c.hope ?? 0))}</span> / 5</span>
            <span class="btn-row" style="margin:0">
              <button type="button" class="btn ghost" data-adj="hope" data-id="${escapeHtml(c.id)}" data-d="-1">-</button>
              <button type="button" class="btn ghost" data-adj="hope" data-id="${escapeHtml(c.id)}" data-d="1">+</button>
            </span>
          </div>
          <div class="mini-track">
            <span class="label">Strain / Jealousy</span>
            <span class="val"><span class="mono">${escapeHtml(String(c.strain ?? 0))}</span> / 5</span>
            <span class="btn-row" style="margin:0">
              <button type="button" class="btn ghost" data-adj="strain" data-id="${escapeHtml(c.id)}" data-d="-1">-</button>
              <button type="button" class="btn ghost" data-adj="strain" data-id="${escapeHtml(c.id)}" data-d="1">+</button>
            </span>
          </div>
        </div>
      `;
      mount.appendChild(card);
    });

    mount.querySelectorAll("[data-adj]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id") || "";
        const key = btn.getAttribute("data-adj") || "";
        const d = Number(btn.getAttribute("data-d") || "0");
        if (key === "hope" || key === "strain") adjustChar(id, key, d);
      });
    });
    mount.querySelectorAll(".btn-char-del").forEach((btn) => {
      btn.addEventListener("click", () => deleteChar(btn.getAttribute("data-id") || ""));
    });
  }

  // ---------- Moves ----------
  const MOVE_TEXT = {
    push: "You force momentum. Success is loud; failure is exhausting.",
    read: "You look for the real pattern. Success reveals; failure misleads.",
    plead: "You bargain with heart or leverage. Success changes someone’s mind; failure changes their price.",
    strike: "You act with precision. Success is clean; failure is collateral.",
    protect: "You take the hit. Success keeps someone safe; failure spreads the harm.",
  };

  function renderMove(deckIndex) {
    const name = els.moveCard()?.value || "";
    const reversed = Boolean(els.moveRev()?.checked);
    const pick = els.movePick()?.value || "push";
    const stake = (els.moveStake()?.value || "").trim();
    const resEl = els.moveResult();
    const promptEl = els.movePrompt();
    if (!resEl || !promptEl) return;
    const resolved = resolveCardFromInput(deckIndex, { name, reversed });
    if (!resolved) {
      resEl.classList.add("muted");
      resEl.textContent = "Type a card name (or draw digital).";
      promptEl.innerHTML = "";
      return;
    }
    resEl.classList.remove("muted");
    resEl.innerHTML = `<strong>${escapeHtml(cardLabel(resolved))}</strong> — ${escapeHtml(MOVE_TEXT[pick] || "")}`;
    const { story, lumora } = storyPromptFor(resolved);
    const outcome = moveOutcome(resolved);
    promptEl.innerHTML = `
      <div><strong>Outcome:</strong> ${escapeHtml(outcome)}</div>
      ${stake ? `<div class="muted" style="margin-top:0.25rem"><strong>Stakes:</strong> ${escapeHtml(stake)}</div>` : ""}
      <div style="margin-top:0.5rem"><strong>Read:</strong> ${escapeHtml(story)}</div>
      <div class="mono" style="margin-top:0.25rem;color:var(--verdant)"><strong>Lumora:</strong> ${escapeHtml(lumora)}</div>
    `;
  }

  function moveOutcome(card) {
    // Simple, table-friendly outcome: majors = big shift; minors = rank intensity; reversed = cost.
    if (card.kind === "major") {
      return card.reversed ? "Succeed, but the world answers back (a rule changes, an ally doubts, a door locks)." : "Succeed and pivot the whole scene (new phase, new truth, new consequence).";
    }
    const rank = card.rank;
    const hi = rank === "Ace" || rank === "10" || rank === "King" || rank === "Queen";
    const mid = ["6", "7", "8", "9", "Knight"].includes(rank);
    const base = hi ? "Strong success" : mid ? "Success with a choice" : "Mixed result";
    return card.reversed ? `${base}, but at a cost or delay.` : `${base}.`;
  }

  // ---------- Generators ----------
  function renderGen(kind, card) {
    const map = {
      npc: els.genNpc,
      loc: els.genLoc,
      prob: els.genProb,
      twist: els.genTwist,
    };
    const get = map[kind];
    const el = get ? get() : null;
    if (!el) return;
    const label = cardLabel(card);
    const { story, lumora } = storyPromptFor(card);
    const line = genLine(kind, card);
    el.classList.remove("muted");
    el.innerHTML = `<strong>${escapeHtml(line)}</strong><br/><span class="muted">${escapeHtml(label)}</span><br/><span class="muted">${escapeHtml(story)}</span><br/><span class="mono" style="color:var(--verdant)">${escapeHtml(lumora)}</span>`;
  }

  function genLine(kind, card) {
    const suit = card.kind === "minor" ? card.suit : "major";
    const tone =
      suit === "cups" ? "tender" : suit === "swords" ? "sharp" : suit === "wands" ? "hot" : suit === "pentacles" ? "grounded" : "mythic";
    if (kind === "npc") return `${tone} NPC with a private agenda and a public mask.`;
    if (kind === "loc") return `${tone} location where the rules feel slightly wrong.`;
    if (kind === "prob") return `${tone} problem: someone’s need collides with the party’s plan.`;
    return `${tone} twist: the obvious answer is a decoy.`;
  }

  // ---------- DOM lookups (new) ----------
  Object.assign(els, {
    charName: () => document.getElementById("char-name"),
    charRole: () => document.getElementById("char-role"),
    charTraits: () => document.getElementById("char-traits"),
    btnCharAdd: () => document.getElementById("btn-char-add"),
    btnCharsClear: () => document.getElementById("btn-chars-clear"),
    btnCharsExport: () => document.getElementById("btn-chars-export"),
    charsMount: () => document.getElementById("chars-mount"),
    charsMsg: () => document.getElementById("chars-msg"),
    bondVal: () => document.getElementById("bond-val"),

    movePick: () => document.getElementById("move-pick"),
    moveStake: () => document.getElementById("move-stake"),
    btnMoveDraw: () => document.getElementById("btn-move-draw"),
    btnMoveClear: () => document.getElementById("btn-move-clear"),
    moveCard: () => document.getElementById("move-card"),
    moveRev: () => document.getElementById("move-rev"),
    moveResult: () => document.getElementById("move-result"),
    movePrompt: () => document.getElementById("move-prompt"),

    btnGenNpc: () => document.getElementById("btn-gen-npc"),
    btnGenLoc: () => document.getElementById("btn-gen-loc"),
    btnGenProb: () => document.getElementById("btn-gen-prob"),
    btnGenTwist: () => document.getElementById("btn-gen-twist"),
    genNpc: () => document.getElementById("gen-npc"),
    genLoc: () => document.getElementById("gen-loc"),
    genProb: () => document.getElementById("gen-prob"),
    genTwist: () => document.getElementById("gen-twist"),
  });

    const key = currentSpreadKey();
    const spread = SPREADS[key];
    const mount = els.oracleSlots();
    if (!mount || !spread) return;
    const revInput = els.revChance();
    const revChance = revInput ? Math.min(0.45, Math.max(0, Number(revInput.value) / 100 || 0.22)) : 0.22;
    const slots = mount.querySelectorAll(".slot");
    slots.forEach((slot, i) => {
      if (!spread.positions[i]) return;
      const c = drawCard(deck, revChance);
      setSlotState(slot, { name: c.name, reversed: c.reversed });
      applySlotCard(slot, c);
    });
  }

})();
