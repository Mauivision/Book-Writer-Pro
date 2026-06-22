import { PATCH_NOTES } from './lumoraLore';

export class PatchToast {
  private root: HTMLElement;
  private textEl: HTMLElement;
  private hideTimer: number | undefined;

  constructor(rootId: string, textId: string) {
    const root = document.getElementById(rootId);
    const text = document.getElementById(textId);
    if (!root || !text) {
      throw new Error('Patch toast elements missing from index.html');
    }
    this.root = root;
    this.textEl = text;
  }

  showRandom() {
    const note = PATCH_NOTES[Math.floor(Math.random() * PATCH_NOTES.length)]!;
    this.show(note);
  }

  show(message: string) {
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
    }
    this.textEl.textContent = message;
    this.root.classList.remove('hidden');
    this.root.classList.add('show');
    this.hideTimer = window.setTimeout(() => {
      this.root.classList.remove('show');
      window.setTimeout(() => this.root.classList.add('hidden'), 320);
    }, 4200);
  }
}
