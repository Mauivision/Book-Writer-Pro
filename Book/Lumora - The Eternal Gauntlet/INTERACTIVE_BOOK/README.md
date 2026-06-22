## Lumora Interactive Book (Choose-Your-Adventure)

This is a **branching storybook**: each section ends with **choices** that link you to another section (like “turn to page X”, but clickable).

### How to read
- Start at `START.md`.
- Click a choice link to jump to the next node.
- Nodes are short on purpose so branching stays manageable.

### How to write new branches (fast workflow)
1. Copy the template in `TEMPLATE_NODE.md`.
2. Give the node a unique ID (e.g. `N010`).
3. Add 2–4 choices that link to other nodes using `./SomeFile.md#n020-some-slug`.
4. Update `MAP.md` when you add nodes (optional but recommended).

### Linking rules (important)
- **Node IDs must be unique**.
- Links should always point to a specific heading anchor (the `#...` part), not just the file.
- Keep each node to ~200–600 words unless it’s a “boss” scene.

### Tone / canon
Keep the Lumora baseline:
- **Respawn is free. Romance is not.**
- UI is real, Patch Notes are snarky, Radiant vs Veil is politics + aesthetics,
  and **Jealousy Aggro** can literally make the dungeon hit harder.

