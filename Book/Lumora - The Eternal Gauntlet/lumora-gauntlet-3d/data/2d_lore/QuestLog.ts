import { BOOK_QUESTS } from './lumoraLore';

export class QuestLog {
  private listEl: HTMLOListElement;
  private done = new Set<string>();

  constructor(listId: string) {
    const el = document.getElementById(listId);
    if (!(el instanceof HTMLOListElement)) {
      throw new Error(`#${listId} quest list not found`);
    }
    this.listEl = el;
    this.render();
  }

  complete(questId: string) {
    if (this.done.has(questId)) return;
    this.done.add(questId);
    this.render();
  }

  reset() {
    this.done.clear();
    this.render();
  }

  private render() {
    this.listEl.innerHTML = '';
    for (const quest of BOOK_QUESTS) {
      const li = document.createElement('li');
      li.dataset.questId = quest.id;
      li.textContent = quest.text;
      if (this.done.has(quest.id)) {
        li.classList.add('done');
      }
      if (quest.arc) {
        li.title = quest.arc;
      }
      this.listEl.appendChild(li);
    }
  }
}
