import { Events } from './Events.js';
import { CFGenerateView } from './CFGenerateView.js';

export class CFResultsView {

   #events = null;
  constructor() {
    this.#events = Events.events();
    const eventSubscriber = new CFGenerateView()
    eventSubscriber.subscribe('generate-graph', data => this.displayResults(data));
  }

  displayResults(d) {
    // TODO get coordinates from d.formulaFamily and family from d.formulaFamily 
    // and update this.graphElm.innerHTML with the output.    
    let xy_data = d.coordinates.split(" ");
    let x_data = xy_data[0].split(",").map(function (x) { return parseFloat(x); });
    let y_data = xy_data[1].split(",").map(function (x) { return parseFloat(x); });
    const sum = array => array.reduce((a, b) => a + b);
    const average = array => array.reduce((a, b) => a + b) / array.length;
    const square = array => array.map(a => a * a)
    const dot = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    let y_mean = average(y_data);
    let x_mean = average(x_data);
    let x_i = x_data.map(element => element - x_mean);
    let y_i = y_data.map(element => element - y_mean);
    let alpha = dot(x_i, y_i) / sum(square(x_i));
    let beta = y_mean - (alpha * x_mean);

    var trace1 = {
      x: x_data,
      y: y_data,
      mode: 'markers',
      type: 'scatter'
    };
    var trace2 = {
      x: x_data,
      y: x_data.map(value => alpha * value + beta),
      mode: 'lines',
      type: 'scatter'
    };
    var layout = {
      title: 'Curve Fitter',
      xaxis: {
        title: 'X-axis'
      },
      yaxis: {
        title: 'Y-axis'
      }
    };
    var data = [trace1, trace2];
    Plotly.newPlot('graph-view', data, layout);
  }
 
  async render() {
    // Create the root element
    this.resultsViewElm = document.createElement('div');
    this.resultsViewElm.id = 'graph-view';
    return this.resultsViewElm;
  }

}
export const displayResults = CFResultsView.prototype.displayResults