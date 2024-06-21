import { Events } from './Events.js';

export class CFGenerateView {

    #events = null;

  constructor() {
    this.#events = Events.events();
  }

  subscribe(event, handler){
    
    if(!this.#events[event]){
        this.#events[event] = []
    }
    this.#events[event].push(handler)
  }

  #publish(event, data){
    // TODO
    // 1. get value for function coordinates from this.funcPointsElm.value
    // 2. get value for function family from this.funcFamilyElm.value
    // 3. write result to data.graph
    if (event === 'generate-graph') {
      data.coordinates = this.funcPointsElm.value;
      data.family = this.funcFamilyElm.value;
    }
        
    if(this.#events[event]){
        this.#events[event].forEach(handler => handler(data));
    }
  }

  async render() {
    // Create the root element
    const generateViewElm = document.createElement('div');
    generateViewElm.id = 'generate-view';
    generateViewElm.classList.add('-generate-view-container');

    const titleElm = document.createElement('h1');
    titleElm.innerText = 'Curve Fitter';

    generateViewElm.appendChild(titleElm);
    generateViewElm.appendChild(this.#renderFormulaContainer());

    return generateViewElm;
  }


  #renderFormulaContainer() {
    
    const formulaContainerGrid = document.createElement('table');
    formulaContainerGrid.classList.add('table');

    // Row #1
    const funcPointsLblElm = document.createElement('label');
    funcPointsLblElm.id = 'function-points-label';
    funcPointsLblElm.innerHTML = 'Coordinates';
    funcPointsLblElm.classList.add('label');

    this.funcPointsElm = document.createElement('input');
    this.funcPointsElm.id = 'function-points';
    
    this.funcPointsElm.type = 'text';
    this.funcPointsElm.placeholder = 'Enter x1,x2,..,xn y1,y2,..,yn';

    const gridFPRow = document.createElement('tr');    
    formulaContainerGrid.appendChild(gridFPRow);

    const gridFPLblCol = document.createElement('td');
    gridFPLblCol.appendChild(funcPointsLblElm)
    gridFPRow.appendChild(gridFPLblCol)

    const gridFPCol = document.createElement('td');
    gridFPCol.appendChild(this.funcPointsElm)
    gridFPRow.appendChild(gridFPCol)

    // Row# 2
    const funcFamilyLblElm = document.createElement('label');
    funcFamilyLblElm.id = 'function-family-label';
    funcFamilyLblElm.innerHTML = 'Function Family';

    this.funcFamilyElm = document.createElement('input');
    this.funcFamilyElm.id = 'function-family';
    this.funcFamilyElm.type = 'text';
    this.funcFamilyElm.placeholder = 'Enter name of a function family';

    const gridFFRow = document.createElement('tr');
    formulaContainerGrid.appendChild(gridFFRow);

    const gridFFLblCol = document.createElement('td');
    gridFFLblCol.appendChild(funcFamilyLblElm)
    gridFFRow.appendChild(gridFFLblCol)

    const gridFFCol = document.createElement('td');
    gridFFCol.appendChild(this.funcFamilyElm)
    gridFFRow.appendChild(gridFFCol)

    // Row# 3
    const generateButtonElm = document.createElement('button');
    generateButtonElm.classList.add('button');

    generateButtonElm.id = 'generate-button';
    generateButtonElm.innerText = 'Generate';
    generateButtonElm.addEventListener('click', () => {
        this.#publish('generate-graph', 
            new FormulaTask(this.funcPointsElm.value, this.funcFamilyElm.value));
        this.#publish('add-to-recents', 
          new FormulaTask(this.funcPointsElm.value, this.funcFamilyElm.value));
      });

    const clearButtonElm = document.createElement('button');
    clearButtonElm.classList.add('button');
    clearButtonElm.id = 'clear-button';
    clearButtonElm.innerText = 'View Recents';
    clearButtonElm.addEventListener('click', () => {
      this.#publish('show-recents-view');
    });


    const gridButtonRow = document.createElement('tr');
    formulaContainerGrid.appendChild(gridButtonRow);

    const gridGenButtonCol = document.createElement('td');
    gridGenButtonCol.appendChild(generateButtonElm)
    gridButtonRow.appendChild(gridGenButtonCol)
    
    const gridClearButtonCol = document.createElement('td');
    gridClearButtonCol.appendChild(clearButtonElm)
    gridButtonRow.appendChild(gridClearButtonCol)

    formulaContainerGrid.appendChild(gridFPRow)
    formulaContainerGrid.appendChild(gridFFRow)
    formulaContainerGrid.appendChild(gridButtonRow)

    const formulaContainerElm = document.createElement('div');
    formulaContainerElm.id = 'formula-container';

    formulaContainerElm.appendChild(formulaContainerGrid)
    return formulaContainerElm
  }
}

class FormulaTask {

    constructor(formulaPoints, formulaFamily) {
        this.coordinates = formulaPoints
        this.family = formulaFamily
    }
  }
  