--- Architecture Spec: Planar Shift ---
id: lumora.planar_shift.v1
title: Planar Shift — System Architecture Specification (GDD Protocol)
status: draft
audience: [engine, design, narrative, qa]
canon_refs:
  - SERIES_BIBLE.md §2 Route Signatures, §7 Recurring Mechanics
  - Codex-10-Compliance-Gradient.md (layer stack model)
  - Chapter-06-The-Veil-Key-Problem.md (Light/Veil gate pairing)
  - Chapter-12-The-Dungeon-Hates-Teamwork.md (adaptive seam rooms)
  - lumora.json (zones, controls, protagonist)
game_target:
  genre: 2D Action RPG Platformer
  visual_style: Retro Fusion HD (16px tile base, 3× display scale, HD post-FX)
  mechanical_refs: [Paper Mario plane/depth staging, FF Resonance stance/resource depth]
  engine_lane: retro-gauntlet (Phaser); port hooks for lumora-gauntlet-3d
---

--- Section: Purpose ---
summary: >
  Planar Shift is the core locomotion-and-puzzle verb that moves the Eternal Player
  between co-registered reality layers without changing zone identity. A shift reindexes
  depth (planarity), collision, enemy AI masks, loot eligibility, and narrative flags
  while preserving world X/Y anchor continuity.
invariants:
  - Zone ID does not change on shift; only planar index and derived masks change.
  - Player body remains a single logical entity; no duplicate avatars across planes.
  - Failed shifts never teleport; they apply setback at the attempt origin.
  - All shifts are auditable: every attempt emits a PlanarEvent record.
non_goals:
  - Full scene reload or hard dimension travel (that is Zone Travel, separate protocol).
  - Permanent plane exile without narrative chapter gate.
  - Multiplayer ghost-plane sync (design for it; ship single-player first).
---

--- Section: Planar Model ---
plane_registry:
  description: >
    Lumora zones expose a finite ordered stack of planes. Default stack for Volume 1
    surface content is three indices; dungeons may add transient overlay planes.
  default_stack:
    - index: 0
      id: surface_present
      label: Present Seam
      faction_tone: neutral
      collision_class: default
    - index: 1
      id: radiant_cache
      label: Radiant Cache Layer
      faction_tone: radiant
      collision_class: sanctified_solid
      visual_tint: "#ffd966"
    - index: 2
      id: veil_underlay
      label: Veil Underlay
      faction_tone: veil
      collision_class: shadow_permeable
      visual_tint: "#9b6bff"
  overlay_planes:
    - id: cyan_protocol
      label: Cyan Protocol Overlay
      unlock_gate: verdant_route OR codex_compliance_gradient
      max_duration_s: 8.0
      notes: Elara-linked resonance; does not replace base index, stacks as mask only.
    - id: correction_audit
      label: Correction Audit Plane
      unlock_gate: correction_event_active
      forced: true
      notes: System-initiated; player cannot voluntarily enter except via failure cascade.
  compliance_gradient_overlay:
    description: >
      Orthogonal to plane_index (Codex-10). Tracks which System "glass panes" are
      narratively active for bark selection, failure escalation, and UI tint. Does
      not change collision_layer by itself; failure tiers may promote correction layer.
    layers:
      - id: social
        label: Social Layer
        affects: [npc_barks, reputation_delta, rumor_flags]
      - id: mechanic
        label: Mechanic Layer
        affects: [jealousy_aggro, bond_events, resonance_meter_visibility]
      - id: correction
        label: Correction Layer
        affects: [audit_halos, rollback_echo, correction_audit overlay eligibility]
    default_active: [social, mechanic]
    promotion_rules:
      - on: shift_failure_tier >= 2
        promote: correction
        duration_s: 45
      - on: correction_event_active
        promote: correction
        forced: true
  adjacency_rules:
    - from: surface_present
      allowed: [radiant_cache, veil_underlay]
    - from: radiant_cache
      allowed: [surface_present, veil_underlay]
      requires: radiant_stance OR radiant_key_token
    - from: veil_underlay
      allowed: [surface_present, radiant_cache]
      requires: veil_stance OR veil_key_token
    - from: any
      to: correction_audit
      requires: system_forced OR shift_failure_tier_3
seam_geometry:
  description: >
    Seam volumes are authored regions where plane collision sets diverge. A seam may be
    a tile band, trigger poly, or moving platform pairing (Paper Mario-style stage slice).
  seam_types: [static_band, paired_gate, rotating_slice, fracture_mirror_echo]
  book_anchors: [Ch.06 Twin Lock, Ch.12 Teamwork Checkpoint seam room]
---

--- Section: Planar State Vector ---
vector_name: PSV
description: >
  At any simulation tick t, the player and each shift-relevant entity must expose a
  Planar State Vector. All gameplay systems read PSV before applying plane-specific rules.
player_psv:
  fields:
    zone_id: string
    plane_index: int
    plane_id: enum
    x_world: float
    y_world: float
    z_depth: float
    seam_anchor_id: string | null
    stance_mask: bitmask
    gauntlet_charge: float
    shift_cooldown_remaining_s: float
    shift_lock_flags: bitmask
    overlay_mask: bitmask
    stability: float
    last_shift_event_id: uuid | null
  coordinate_system:
    x_world: Horizontal axis in zone tile space (pixels or tiles; engine-normalized).
    y_world: Vertical axis in zone tile space (platformer gravity axis).
    z_depth: >
      Signed planarity offset relative to surface_present (index 0) baseline.
      Unit: abstract depth units (ADU), not screen pixels. Default mapping:
      z_depth = plane_index * Z_SPAN + local_depth_bias.
    z_span_per_index: 1.0
    local_depth_bias: >
      Sub-plane parallax offset for Paper Mario staging (-0.35..0.35 ADU typical).
      Used for foreground/background walkable slices within the same plane_index.
  derived_masks:
    collision_layer: hash(plane_id, overlay_mask, stance_mask)
    interactable_layer: hash(plane_id, overlay_mask)
    enemy_perception_layer: hash(plane_id, stance_mask)
    loot_eligibility_layer: hash(plane_id, overlay_mask)
entity_psv:
  applies_to: [enemies, npcs, moving_platforms, shift_gates, loot_nodes, projectiles]
  required_fields: [zone_id, plane_index, x_world, y_world, z_depth, collision_layer]
  optional_fields: [seam_anchor_id, shift_reactive]
snapshot_rules:
  on_shift_success: Clone PSV at t_pre; write t_post with updated plane fields; preserve x_world, y_world.
  on_shift_failure: Revert to t_pre snapshot; apply failure packet; do not alter plane_index.
  persistence: Save latest successful PSV per zone on zone exit; restore on re-entry.
---

--- Section: Trigger Conditions ---
minimum_distinct_types: 2
types:
  - id: T1_environmental_seam
    label: Environmental Seam Trigger
    category: physical
  - id: T2_narrative_protocol_gate
    label: Narrative / Protocol Gate Trigger
    category: narrative
  - id: T3_combat_resonance_spike
    label: Combat Resonance Spike (optional third; enabled in dungeons)
    category: mechanical
T1_environmental_seam:
  description: >
    Player enters an authored seam volume while holding valid stance or key token,
    or while carrying gauntlet_charge >= seam_threshold.
  preconditions:
    all:
      - player.shift_lock_flags & SHIFT_LOCKED == 0
      - player.shift_cooldown_remaining_s <= 0
      - player.stability >= seam_min_stability
    any:
      - seam_volume.requires_stance matches player.stance_mask
      - player holds key token matching seam_volume.key_id
      - player.gauntlet_charge >= seam_volume.charge_cost
  activation_modes:
    - auto_on_enter: Shift fires on seam entry if preconditions pass.
    - hold_confirm: Player holds Shift (control) 0.4s at seam edge; releases on success window.
    - paired_gate: Two seam halves (Radiant + Veil) must both be occupied; shift synchronizes party plane_index.
  parameters:
    seam_min_stability: 0.25
    charge_cost_default: 0.15
    target_plane: resolved from seam_volume.target_plane_id
  book_anchors: [Ch.06 Veil Key corridor, Ch.12 gold/violet floor seam]
T2_narrative_protocol_gate:
  description: >
    Story beat, Codex unlock, or System UI event authorizes a one-way or reversible
    plane transition. Narrative gate may override charge cost or bypass cooldown once.
  preconditions:
    all:
      - quest_flag OR codex_flag OR chapter_event_flag is satisfied
      - player is inside gate_volume OR interacting with gate actor
    any:
      - story_trigger_id fired within validity_window_s
      - Codex tab selected (cyan pulse window)
      - Sunny tutorial misfire exposes hidden seam (comedy failure-forward)
  activation_modes:
    - interact_confirm: E at gate actor after UI prompt.
    - codex_blink: Auto shift on codex read; player input locked 0.6s.
    - forced_correction: System pushes to correction_audit overlay (not voluntary).
  parameters:
    validity_window_s: 30.0
    bypass_cooldown_once: true
    emit_narrative_bark: required
  book_anchors: [Codex entries, Route Signatures cyan, Correction events]
T3_combat_resonance_spike:
  description: >
    During combat, a Resonance threshold or boss phase opens a short shift window
    (FF Resonance-style stance depth). Used for dodge-through-plane mechanics.
  preconditions:
    all:
      - combat_state == active
      - resonance_meter >= spike_threshold OR boss_phase_flag
      - player.stability >= combat_shift_min_stability
    any:
      - player performed parry_within_window_ms
      - unity_buff_active
      - jealousy_aggro_tier >= 2
  activation_modes:
    - tap_shift: Single press within 1.2s window; consumes resonance chunk.
  parameters:
    spike_threshold: 0.65
    combat_shift_min_stability: 0.40
    window_duration_s: 1.2
    resonance_cost: 0.30
  book_anchors: [Unity buff, Jealousy Aggro, World Boss shield layers]
trigger_evaluation_order:
  - T2_narrative_protocol_gate
  - T1_environmental_seam
  - T3_combat_resonance_spike
  notes: Higher-priority trigger wins; lower-priority suppressed for current tick.
---

--- Section: Mechanics of Transition ---
phases:
  - id: windup
    duration_s: 0.12
    player_movement: locked
    gravity: normal
    input_buffer: shift requests buffered
  - id: peel
    duration_s: 0.18
    description: >
      Visual and audio sell begins; collision preview ghost shown at target plane.
      Paper Mario-style: sprite scales slightly and z_depth interpolates.
    z_depth_interpolation: linear from z_pre to z_target
    parallax_layers: counter-scroll at 1.5× seam normal
  - id: commit
    duration_s: 0.08
    description: >
      Plane index swaps; collision_layer recomputed; enemies on old layer fade perception.
    gauntlet_charge: -= shift_charge_cost
  - id: settle
    duration_s: 0.22
    player_movement: unlocked gradually (easing 0.1s)
    cooldown_starts: true
feel_targets:
  total_success_duration_s: 0.60
  perceived_speed: snappy_not_teleport
  player_readability: >
    Must read as "sliding through cardstock layers," not blink teleport. Minimum 0.45s
    total for tutorial shifts; maximum 0.75s for forced correction shifts.
cooldown:
  base_cooldown_s: 2.5
  modifiers:
    - condition: unity_buff_active
      multiplier: 0.70
    - condition: jealousy_aggro_tier >= 2
      multiplier: 1.35
    - condition: correction_audit_overlay
      multiplier: 2.00
    - condition: narrative_gate bypass
      multiplier: 0.0
      once: true
  floor_s: 0.8
  ceiling_s: 6.0
resource_costs:
  gauntlet_charge:
    base_cost: 0.12
    per_plane_distance: 0.06
    floor: 0.05
    ceiling: 0.35
  resonance_meter:
  applies_to: T3 only
  cost: 0.30
charge_regen:
  out_of_combat_s: 0.04 per second
  on_seam_rest: 0.20 instant if standing in neutral seam 3s
stability:
  range: [0.0, 1.0]
  default: 1.0
  regen_out_of_combat_s: 0.02
  shift_success_bonus: 0.05
  descriptions:
    high: ">= 0.70 — clean FX, no artifact tier"
    mid: "0.40–0.69 — glitch tier 1 on peel"
    low: "< 0.40 — failure risk tier escalates"
movement_skills_during_shift:
  dash: disabled during windup+peel+commit
  attack: cancelable only before windup
  jump: buffered; executes on settle if jump pressed during peel
camera:
  mode: fixed_side_scroll
  shift_behavior:
    - micro_zoom: 1.04× during peel, restore on settle
    - layer_parallax: foreground +12%, background -8% relative motion
    - optional: 2px vertical camera lag for weight
audio:
  success: [glass_slide, cyan_chime, faction_stinger]
  failure: [tape_stop, error_beep, static_burst]
---

--- Section: Visual Fidelity Requirements ---
style_brief: Retro Fusion HD
base_render:
  tile_unit_px: 16
  display_scale: 3
  sprite_filter: nearest
  hd_pass: bloom_subtle, ordered_dither_optional, CRT_light
shift_success_fx:
  glitch_artifact:
    required: true
    description: >
      Brief datamoshing ribbon along seam normal; not full-screen noise. Reads as
      "reality reindexing" per System UI fiction.
    parameters:
      duration_ms: 180
      ribbon_width_px: 48
      scanline_skip_pattern: [2, 1, 3, 1]
      rgb_split_px: [2, -1, 3]
      block_shuffle_tile_px: 4
      alpha_flicker_range: [0.85, 1.0]
  screen_distortion:
    chromatic_aberration:
      peak_offset_px: 3
      channel_order: [R_shift_right, B_shift_left]
      falloff: quadratic
    color_banding:
      enabled: true
      band_count: 6
      axis: seam_normal
      intensity: 0.18
    barrel_wobble:
      peak: 0.015
      duration_ms: 220
    vignette_pulse:
      intensity: 0.12
      color: "#0a1628"
  particles:
    on_success:
      - id: cyan_shard_spray
        count: 14
        lifetime_ms: 400
        velocity: outward along seam
        color: "#66d9ff"
      - id: faction_motes
        count: 8
        color_by_target_plane: true
      - id: paper_flutter
        count: 6
        description: White rectangular scraps; Paper Mario homage
    on_commit:
      - id: gauntlet_vein_flash
        attach: player_wrist
        duration_ms: 120
shift_failure_fx:
  glitch_artifact:
    required: true
    tier_by_failure: see Error Handling
    parameters:
      duration_ms: 320
      full_width_probability: 0.35
      rgb_split_px: [5, -3, 6]
      block_shuffle_tile_px: 8
  screen_distortion:
    chromatic_aberration:
      peak_offset_px: 6
    color_banding:
      band_count: 10
      intensity: 0.35
    horizontal_tear:
      count: 2
      offset_px: random ±12
  particles:
    - id: static_sparks
      count: 22
      color: "#ff4466"
    - id: rollback_ghost
      count: 1
      description: Semi-transparent player silhouette snaps back to origin
    - id: ui_error_glyph
      count: 3
      sprite: floating "ERROR" codex glyph
layer_staging:
  paper_mario_rules:
    - Walkable slices at different z_depth share X/Y but diverge collision.
    - Foreground props occlude without blocking unless collision_layer matches.
    - Enemy telegraphs must render on perception_layer regardless of parallax.
  radiant_plane:
    add_emissive: "#ffd966"
    shadow_crush: 0.05
  veil_plane:
    add_fog: 0.15
    neon_edge: "#9b6bff"
  cyan_overlay:
    scanline_overlay: 0.08
    ui_corner_brackets: true
qa_visual_acceptance:
  - Success shift readable at 1080p scaled 3× without full-frame obscuration.
  - Failure shift distinguishable from success within 0.2s by color temperature (fail = hotter).
  - No shift FX persists longer than 500ms after settle except cooldown UI.
---

--- Section: Error Handling / Protocol Failure ---
failure_definition: >
  A planar shift fails when target plane data is unstable, preconditions lapse mid-shift,
  stability triggers risk roll, or gauntlet_charge would undershoot below floor after cost.
stability_risk_roll:
  enabled_when: stability < 0.70
  formula: p_fail = clamp(0.70 - stability, 0.05, 0.55)
  modifiers:
    - unity_buff_active: -0.10
    - jealousy_aggro_tier >= 2: +0.15
    - correction_event_active: +0.20
failure_tiers:
  - tier: 1
    id: seam_splinter
    trigger: p_fail roll failed OR charge undershoot OR seam_exit_before_commit
    mechanical_setback:
      gauntlet_charge_delta: -0.10
      shift_cooldown_s: 3.5
      movement_skills_lock_s: 0.8
      locked_skills: [dash, double_jump_if_unlocked]
      resonance_meter_delta: 0
    narrative_consequence:
      bark_id: planar_fail_t1_splinter
      system_message: >
        NOTICE: Seam splinter — local geometry rejected indexing.
      optional_flag: sunny_snark_increment
    fx_profile: failure_tier_1
  - tier: 2
    id: protocol_reject
    trigger: narrative gate flag expired OR stance_mask invalid at commit OR paired_gate desync
    mechanical_setback:
      gauntlet_charge_delta: -0.20
      shift_cooldown_s: 5.0
      movement_skills_lock_s: 1.6
      locked_skills: [dash, jump, attack_light]
      stability_delta: -0.15
      resource_pool:
        stamina_cap_multiplier: 0.85
        duration_s: 45
    narrative_consequence:
      bark_id: planar_fail_t2_reject
      system_message: >
        ERROR: Protocol mismatch — correction scheduled at reduced severity.
      quest_ui_pulse: cyan_tab
      optional_spawn: correction_drone_far (non-lethal harass)
    fx_profile: failure_tier_2
  - tier: 3
    id: rollback_echo
    trigger: stability < 0.25 at windup OR forced_correction OR three tier-2 failures in 60s
    mechanical_setback:
      gauntlet_charge_delta: -0.30
      shift_cooldown_s: 8.0
      movement_skills_lock_s: 2.4
      locked_skills: [dash, jump, attack_light, attack_heavy, stance_swap]
      stability_delta: -0.25
      resource_pool:
        stamina_cap_multiplier: 0.70
        mana_cap_multiplier: 0.80
        duration_s: 90
      plane_lock:
        forbid_shift_s: 12.0
    narrative_consequence:
      bark_id: planar_fail_t3_rollback
      system_message: >
        CORRECTION: Rollback echo — you are being remembered incorrectly.
      overlay_plane: correction_audit
      overlay_duration_s: 4.0
      story_flag: rollback_echo_witnessed
      npc_reaction: faction_reputation_delta
        radiant: -2
        veil: -1
    fx_profile: failure_tier_3
    audit_plane_behavior:
      player_can_move: true
      player_can_shift: false
      enemies: audit_halos_only
      exit_condition: overlay_duration elapsed OR interact codex_glyph
failure_resolution:
  steps:
    - Revert PSV to t_pre snapshot (plane_index, z_depth, x_world, y_world).
    - Apply mechanical_setback packet.
    - Emit PlanarEvent with result: failure, tier, reason_code.
    - Play fx_profile; queue narrative_bark non-blocking.
    - If tier >= 2, push System UI toast with system_message.
  never_do:
    - Teleport to unrelated spawn.
    - Kill player without separate combat rules.
    - Permanently strip plane access without chapter gate.
reason_codes:
  - CHARGE_UNDERFLOW
  - STABILITY_ROLL
  - STANCE_MISMATCH
  - GATE_FLAG_EXPIRED
  - PAIRED_GATE_DESYNC
  - SEAM_EXIT_EARLY
  - CORRECTION_FORCED
  - DATA_UNSTABLE_TARGET_PLANE
---

--- Section: PlanarEvent Audit Record ---
event_schema:
  event_id: uuid
  timestamp_ms: int
  zone_id: string
  trigger_type: enum [T1, T2, T3]
  trigger_id: string
  result: enum [success, failure, cancelled]
  failure_tier: int | null
  reason_code: string | null
  psv_pre: player_psv
  psv_post: player_psv | null
  gauntlet_charge_pre: float
  gauntlet_charge_post: float
  cooldown_applied_s: float
  narrative_bark_id: string | null
logging:
  dev: console + ring buffer 64 events
  qa: export JSON on pause menu
  telemetry_optional: aggregate counts by reason_code
---

--- Section: Implementation Hooks (non-code reference) ---
data_files:
  - retro-gauntlet/public/maps/*.json — seam_volume authoring
  - lumora-game-data/lumora.json — zone ids, control Shift = dash conflict note
  - story_triggers.json — T2 narrative gates
engine_modules:
  phaser:
    - PlanarShiftController (PSV owner)
    - SeamVolume (zone object)
    - PlanarFXPipeline (post-FX)
    - CollisionLayerRegistry
  godot:
    - autoload PlanarState singleton
    - seam Area2D / Area3D adapters
control_conflict_note: >
  lumora.json maps Shift to dash. For planar shift ship build, recommend:
  dash -> Ctrl or double-tap; planar shift -> Shift at seams OR dedicated Q with context prompt.
  Document decision in controls patch note before implementation.
test_cases:
  - id: TC01_clean_seam
    assert: plane_index changes; PSV x/y preserved; cooldown applied
  - id: TC02_fail_revert
    assert: plane_index unchanged after tier-1 fail
  - id: TC03_narrative_bypass
    assert: cooldown 0 once when T2 flag valid
  - id: TC04_paired_gate
    assert: both actors same plane_index after success
  - id: TC05_tier3_lockout
    assert: shift disabled 12s; overlay_mask includes correction_audit
  - id: TC06_visual_budget
    assert: no FX node alive > 500ms post settle
version_history:
  - v1: initial protocol draft; aligns Volume 1 Light/Veil + Codex layer fiction
---
