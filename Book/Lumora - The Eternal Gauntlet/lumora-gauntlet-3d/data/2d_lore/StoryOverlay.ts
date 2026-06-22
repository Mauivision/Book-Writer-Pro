import { getStoryBeat } from './storyBeats';

type StoryOverlayElements = {
  root: HTMLElement;
  speaker: HTMLElement;
  text: HTMLElement;
  continueBtn: HTMLButtonElement;
};

export class StoryOverlay {
  private queue: string[] = [];
  private showing = false;
  private els: StoryOverlayElements;
  private onPauseChange?: (paused: boolean) => void;

  constructor(
    rootId: string,
    speakerId: string,
    textId: string,
    continueId: string,
    onPauseChange?: (paused: boolean) => void
  ) {
    const root = document.getElementById(rootId);
    const speaker = document.getElementById(speakerId);
    const text = document.getElementById(textId);
    const continueBtn = document.getElementById(continueId);

    if (!root || !speaker || !text || !(continueBtn instanceof HTMLButtonElement)) {
      throw new Error('Story overlay elements missing from index.html');
    }

    this.els = { root, speaker, text, continueBtn: continueBtn };
    this.onPauseChange = onPauseChange;

    continueBtn.addEventListener('click', () => this.dismiss());
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        if (!this.showing) return;
        event.preventDefault();
        this.dismiss();
      }
    });
  }

  enqueue(beatId: string) {
    this.queue.push(beatId);
    if (!this.showing) {
      this.showNext();
    }
  }

  private showNext() {
    const nextId = this.queue.shift();
    if (!nextId) {
      this.hide();
      return;
    }

    const beat = getStoryBeat(nextId);
    if (!beat) {
      this.showNext();
      return;
    }

    this.showing = true;
    this.onPauseChange?.(true);
    this.els.speaker.textContent = beat.speaker;
    this.els.text.textContent = beat.text;
    this.els.root.classList.remove('hidden');
  }

  private dismiss() {
    if (!this.showing) return;
    this.showNext();
  }

  private hide() {
    this.showing = false;
    this.els.root.classList.add('hidden');
    this.onPauseChange?.(false);
  }
}
