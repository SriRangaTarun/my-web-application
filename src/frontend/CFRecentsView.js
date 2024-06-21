import { Events } from './Events.js';
import { fetchCFRecentTasks } from './Server.js';
import { displayResults } from './CFResultsView.js';

export class CFRecentsView {
  #events = null;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    // Create the root element
    const cfRecentsViewElm = document.createElement('div');
    cfRecentsViewElm.id = 'recents-list-view';

    const titleElm = document.createElement('h1');
    titleElm.innerText = 'Choose from Recents';

    const cfRecentsContainerElm = document.createElement('div');
    cfRecentsContainerElm.id = 'recents-list-container';

    cfRecentsViewElm.appendChild(titleElm);
    cfRecentsViewElm.appendChild(cfRecentsContainerElm);

    const recentsList = new RecentsList();
    cfRecentsContainerElm.appendChild(await recentsList.render());

    cfRecentsViewElm.appendChild(cfRecentsContainerElm);

  /////
      const generateButtonElm = document.createElement('button');
      generateButtonElm.classList.add('button');

      generateButtonElm.id = 'new-button';
      generateButtonElm.innerText = 'New Combination..';
      generateButtonElm.addEventListener('click', () => {
          this.#publish('show-new-view', null);
      });

      cfRecentsViewElm.appendChild(generateButtonElm)
      return cfRecentsViewElm;
  }

  subscribe(event, handler){
    
    if(!this.#events[event]){
        this.#events[event] = []
    }
    this.#events[event].push(handler)
  }

  #publish(event, data){
    if(this.#events[event]){
        this.#events[event].forEach(handler => handler(data));
    }
  }

}

class RecentsList {
  constructor() {}

  async render() {
    // Create the root element
    const recentsElm = document.createElement('div');
    recentsElm.id = 'recents-list';

    const taskList = new TaskList();
    const taskListElm = await taskList.render();

    recentsElm.appendChild(taskListElm);
    return recentsElm;
  }
}

export class TaskList {  
  #events = null;
  #tasks = null;
  #list = null;

  constructor() {
    this.#events = Events.events();
    this.subscribe('add-to-recents', data => this.#addToRecents(data));
  }

  #addToRecents(d) {
    this.#tasks.push(d);
    const li = this.#makeTaskItem(d);
    this.#list.appendChild(li);
    this.#saveTasks();
  }

  subscribe(event, handler){
    
    if(!this.#events[event]){
        this.#events[event] = []
    }
    this.#events[event].push(handler)
  }

  async render() {
    if (this.#tasks === null) {
      this.#tasks = await this.#getTasks();
    }
    const taskListElm = document.createElement('div');
    taskListElm.id = 'task-list';

    this.#list = document.createElement('ul');
    const listItems = this.#tasks.map(task => this.#makeTaskItem(task));

    listItems.forEach(li => this.#list.appendChild(li));

    taskListElm.appendChild(this.#list);

    return taskListElm;
  }


  #clickRecents(event) {
    let recent = event.target.innerText;
    if (recent != null) {
      const cfPair = recent.split(":");
      let data = {};
      data.coordinates = cfPair[0];
      displayResults(data);
    }
  }

  #makeTaskItem(task) {
    const li = document.createElement('li');
    const aElm = document.createElement('button');
    aElm.classList.add('no_border_button');
    aElm.innerText = task.coordinates + ":" + task.family;
    aElm.id = task.id;
    li.appendChild(aElm)
    aElm.addEventListener("click", this.#clickRecents);
    return li;
  }

  async #getTasks() {
    const response = await fetchCFRecentTasks('/cfTasks');
    if (response.status === 200) {
      return this.#parse(response.body);
    } else {
      return [];
    }
  }

  async #saveTasks() {
    await fetchCFRecentTasks('/cfTasks', {
      method: 'POST',
      body: JSON.stringify(this.#tasks),
    });
  }

  #parse(json) {
    const obj = JSON.parse(json);
    const tasks = obj.map(task => new Task(task.coordinates, task.family, task.id));
    return tasks;
  }
}

class Task {
  constructor(coordinates, family, id) {
    if (id === undefined) {
      this.id = Math.random().toString(36);
    } else {
      this.id = id;
    }
    this.coordinates = coordinates;
    this.family = family;
  }
}
