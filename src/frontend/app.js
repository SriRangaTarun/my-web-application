import { CFGenerateView } from './CFGenerateView.js';
import { CFRecentsView } from './CFRecentsView.js';
import { CFResultsView } from './CFResultsView.js';
import { Events } from './Events.js';

export class App {
  #generateViewElm = null;
  #recentsViewElm = null;
  #resultsViewElm = null;
  #mainViewElm = null;
  #rootElm = null;
  #isNewView = true
  #events = null;

  constructor() {
    this.#events = Events.events();
    const newViewSubscriber = new CFGenerateView()
    const recentsViewSubscriber = new CFRecentsView()

    newViewSubscriber.subscribe('show-recents-view', data => this.switchToRecentsView());
    recentsViewSubscriber.subscribe('show-new-view', data => this.switchToNewView());

  }

  async switchToNewView() {
    this.#isNewView = true;
    this.#updateView();
  }

  async switchToRecentsView () {
    this.#isNewView = false;
    this.#updateView();
  }



  async render(root) {
    this.#rootElm = document.getElementById(root);
    this.#rootElm.innerHTML = '';

    this.#mainViewElm = document.createElement('div');
    this.#mainViewElm.id = 'main-view';
    this.#mainViewElm.classList.add('main-view');

    this.#rootElm.appendChild(this.#mainViewElm);

    const generateView = new CFGenerateView();
    this.#generateViewElm = await generateView.render();


    const recentsView = new CFRecentsView();
    this.#recentsViewElm = await recentsView.render();

    const resultsView = new CFResultsView();
    this.#resultsViewElm = await resultsView.render();

    await this.#updateView()
    this.#mainViewElm.appendChild(this.#generateViewElm);
    this.#mainViewElm.appendChild(this.#recentsViewElm);
    this.#mainViewElm.appendChild(this.#resultsViewElm);
    
  }

  async #updateView() {
    if (this.#isNewView) {
      this.#generateViewElm.style.display = 'inline';
      this.#recentsViewElm.style.display = 'none';
    } else {
      this.#generateViewElm.style.display = 'none';
      this.#recentsViewElm.style.display = 'inline';
    }
  }
}
