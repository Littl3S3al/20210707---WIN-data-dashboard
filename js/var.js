let container, width, height, svg, graph, pack;

const resizeEvent = () => {
  container = document.querySelector('#canvas-container');

  width = container.offsetWidth;
  height = container.offsetHeight;

  svg = d3
    .select('.canvas')
    .append('svg')
    .attr('transform-origin', '0 0')
    .attr('viewBox', `0 0 ${width} ${height}`);

  graph = svg.append('g').attr('transform', 'translate(50, 50)');

  pack = d3
    .pack()
    .size([container.offsetWidth - 100, container.offsetHeight - 100])
    .radius((d) => d.data.value)
    .padding(5);
};

resizeEvent();

// bubble variables
const color = d3.scaleOrdinal(['#2EB5C3', '#2EB5C3', '#FFB000', '#FF4700']);

//  data variables
let compiledData, rootData;

// doc variables
let switches = document.querySelectorAll('input[type=checkbox]');

// track gender and type that is on
let gender = ['f', 'm', 'n'];
let type = ['v', 'p'];
let reported,
  action = false;
