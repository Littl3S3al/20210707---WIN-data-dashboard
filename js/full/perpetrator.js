// universal switches
let invisibleGender = []; //"m"
let invisibleType = []; //"physical"

let full;
let filtered;

let key = [
  'Fellow employee',
  'Direct supervisor',
  'Higher management',
  'News source',
  'Other',
];

let switches = document.querySelectorAll(
  '.switch-vi'
);

// ?dealing with html
switches.forEach((input) => {
  input.addEventListener('click', () => {
    if (input.name === 'type') {
      invisibleType = filterArray(input, invisibleType);
    }
    if (input.name === 'gender') {
      invisibleGender = filterArray(input, invisibleGender);
    }
    switchesCheck(input, switches, invisibleGender, invisibleType)
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

d3.csv('data/perpetrator.csv')
  .then((data) => {
    full = data;
  })
  .then((d) => {
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

  let inputs = finalFilter(filtered, key, '#who-perp-div');
  const sample = document.querySelector('#sample-vi')
  sample.innerText = inputs.sumTotal
  update(inputs.newData, inputs.sumTotal);
};

// !-------------------------------graph

const canvas = document.querySelector('.canvas_v');

const dims = {
  height: canvas.offsetHeight,
  width: canvas.offsetWidth,
  marginLeft: 100,
  marginTop: 100,
  fontSize: '2em',
  fontFamily: 'Bebas Neue'
};

const graphWidth = dims.width - dims.marginLeft * 2;
const graphHeight = dims.height - dims.marginTop *1.5;

const svg = d3
  .select('.canvas_vi')
  .append('svg')
  .attr('width', dims.width)
  .attr('height', dims.height);

const graph = svg
  .append('g')
  .attr('transform', `translate(${dims.marginLeft}, ${dims.marginTop})`);

const color = d3.scaleOrdinal([
  '#ffffcc',
  '#a1dab4',
  '#41b6c4',
  '#2c7fb8',
  '#253494',
]);

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// scales
const y = d3.scaleLinear().range([graphHeight, 0]);

const x = d3
  .scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create the axes
const xAxis = d3.axisBottom(x).ticks(0);
const yAxis = d3
  .axisLeft(y)
  .ticks(yTicks)
  .tickFormat((d) => d + ' %');

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
  d3.select('#perp-sample').html(sumTotal);
  // updating scale domains
  y.domain([0, d3.max(data, (d) => d.value)]);
  x.domain(data.map((item) => item.key));

  // join data to rects
  const rects = graph.selectAll('rect').data(data);

  // remove exit selection
  rects.exit().remove();

  // update the current shapes
  rects
    .attr('width', x.bandwidth)
    .attr('fill', (d) => color(d.key))
    .attr('x', (d) => x(d.key))
    .transition()
    .duration(500)
    .attr('x', (d) => x(d.key));

  // append the enter selection to the dom
  rects
    .enter()
    .append('rect')
    .attr('fill', (d) => color(d.key))

    .attr('y', graphHeight)
    .merge(rects)
    .attr('width', x.bandwidth())
    .attr('x', (d) => x(d.key))
    .transition()

    .duration(1500)

    .attr('y', (d) => y(d.value))
    .attr('height', (d) => graphHeight - y(d.value));

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
