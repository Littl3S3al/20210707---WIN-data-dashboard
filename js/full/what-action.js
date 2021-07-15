// universal switches
let invisibleGender = []; //"m"
let invisibleType = []; //"physical"

// data
let full;
let filtered;

let switches = document.querySelectorAll(
  '.switch-iv'
);

let key = [
  'Case dismissed',
  'Perpetrator fired',
  'Perpetrator warned',
  'Perpetrator transferred',
  'Perpetrator suspended',
  'Police informed',
  'I was transferred',
  'I was provided support',
  'Organisation provided training',
  'I was fired',
  'other',
];

// ?dealing with html
switches.forEach((input) => {
  input.addEventListener('click', () => {
    if (input.name === 'type') {
      invisibleType = filterArray(input, invisibleType);
    }
    if (input.name === 'gender') {
      invisibleGender = filterArray(input, invisibleGender);
    }
    filterData(full, invisibleGender, invisibleType);
  });
});

function filterArray(input, array) {
  if (!input.checked) {
    array.push(input.value);
  } else {
    array = array.filter((item) => item !== input.value);
  }
  return array;
}

// *calling data
d3.csv('../data/what-action.csv')
  .then((data) => {
    full = data;
  })
  .then(() => {
    filterData(full, invisibleGender, invisibleType);
  });

// function to filter the data
const filterData = (data, gender, type) => {
  // filter full data by country if not region
  if (country) {
    filtered = data.filter((d) => d.country === country);
  } else {
    filtered = data;
  }
  // filter out unneeded gender and type
  invisibleGender.forEach((gender) => {
    filtered = filtered.filter((d) => d.gender !== gender);
  });
  invisibleType.forEach((type) => {
    filtered = filtered.filter((d) => d.type !== type);
  });

  let inputs = finalFilter(filtered, key);
  const sample = document.querySelector('#sample-iv')
  sample.innerText = inputs.sumTotal;
  update(inputs.newData, inputs.sumTotal);
};

// !-------------------------------graph

const canvas = document.querySelector('.canvas_iv');

const dims = {
  height: canvas.offsetHeight,
  width: canvas.offsetWidth,
  marginLeft: canvas.offsetWidth*0.4,
  marginRight: 30,
  marginTop: 50,
  fontSize: '2em',
  fontFamily: 'Bebas Neue'
};

const color = d3.scaleOrdinal([
  '#ffffd9',
  '#edf8b1',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#1d91c0',
  '#225ea8',
  '#253494',
  '#081d58',
]);

const graphWidth = dims.width - dims.marginLeft - dims.marginRight;
const graphHeight = dims.height - dims.marginTop * 2;

const svg = d3
  .select('.canvas_iv')
  .append('svg')
  .attr('width', dims.width)
  .attr('height', dims.height);

const graph = svg
  .append('g')
  .attr('transform', `translate(${dims.marginLeft}, ${dims.marginTop})`);

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// scales
const y = d3
  .scaleBand()
  .range([0, graphHeight])
  .paddingInner(0.2)
  .paddingOuter(0.2);

const x = d3.scaleLinear().range([0, graphWidth]);

// create the axes
const xAxis = d3
  .axisBottom(x)
  .ticks(5)
  .tickFormat((d) => d + '%');
const yAxis = d3
  .axisLeft(y)
  .ticks(4)
  .tickFormat((d) => d);

const tip = d3
  .tip()
  .attr('class', 'd3-tip card center-align')
  .html((event, d) => {
    let content = `<div><h3>${d.value.toFixed(1)}%</h3></div>`;
    return content;
  });

graph.call(tip);

// !update function
const update = (data, sumTotal) => {
  //   data = data.sort((a, b) => d3.descending(a.value, b.value));
  // updating scale domains
  x.domain([0, d3.max(data, (d) => d.value)]);
  y.domain(data.map((item) => item.key));

  // join data to rects
  const rects = graph.selectAll('rect').data(data);

  // remove exit selection
  rects.exit().remove();

  // update the current shapes
  rects
    .attr('x', x(0))
    .attr('y', (d) => y(d.key))
    .attr('height', y.bandwidth())
    .attr('fill', (d) => color(d.key))
    .transition()
    .duration(500)
    .attr('width', (d) => x(d.value));

  // append the enter selection to the dom
  rects
    .enter()
    .append('rect')
    .attr('x', x(0))
    .attr('y', (d) => y(d.key))
    .attr('width', 0)
    .attr('height', y.bandwidth())
    .attr('fill', (d) => color(d.key))
    .transition()
    .duration(500)
    .attr('width', (d) => x(d.value));

  // call the axes
  xAxisGroup.transition().duration(1000).call(xAxis);
  yAxisGroup.transition().duration(1000).call(yAxis);

  xAxisGroup
    .selectAll('text')
    .attr('fill', 'white')
    .attr('font-family', dims.fontFamily)
    .attr('font-size', dims.fontSize);

  d3.selectAll('path.domain').attr('stroke', 'none');
  d3.selectAll('.tick').attr('color', 'white');
  yAxisGroup
    .selectAll('.tick')
    .attr('color', 'white')
    .append('line')
    .attr('x1', '10')
    .attr('x2', graphWidth)
    .attr('y1', 0)
    .attr('y2', 0)
    .attr('stroke', 'white')
    .attr('stroke-dasharray', '2, 10');
  yAxisGroup
    .selectAll('text')
    .attr('font-family', dims.fontFamily)
    .attr('font-size', dims.fontSize);

  graph
    .selectAll('rect')
    .on('mouseover', function (e, d) {
      tip.show(e, d);
      graph.selectAll('rect').transition().duration(200).style('opacity', 0.5);
      d3.select(e.target)
        .transition()
        .duration(200)
        .attr('fill', '#ffb000')
        .style('opacity', 1);
    })
    .on('mouseout', function (e, d) {
      tip.hide();
      graph.selectAll('rect').transition().duration(200).style('opacity', 1);
      d3.select(e.target).attr('fill', (d) => color(d.key));
    });
};
