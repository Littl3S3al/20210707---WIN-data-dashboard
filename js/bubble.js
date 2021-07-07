let bubbleData;
let positionData;

// data visualisation function
const updateVis = (data) => {
  positionData = pack(data).descendants();

  bubbleData = positionData.filter(
    (d) => d.data.name !== 'not_reported' && d.data.name !== 'no action-taken'
  );

  if (!reported) {
    bubbleData = bubbleData.filter((d) => d.data.name !== 'action-taken');
    bubbleData = bubbleData.filter((d) => d.data.name !== 'reported');
  } else if (!action) {
    bubbleData = bubbleData.filter((d) => d.data.name !== 'action-taken');
  }

  let nodes = graph.selectAll('circle').data(bubbleData);

  let names = graph.selectAll('.names').data(bubbleData);

  let values = graph.selectAll('.values').data(bubbleData);

  nodes
    .exit()
    .transition()
    .duration(1000)
    .attrTween('r', bubTweenExit)
    .remove();

  nodes
    .transition()
    .duration(1000)
    .attr('r', (d) => d.r)
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

  nodes
    .enter()
    .append('circle')
    .each(function (d) {
      this._current = d;
    })
    .attr('id', (d) => d.name)
    .attr('class', 'circle')
    .attr('fill', (d) => {
      if (d.depth === 0 || d.value === 0) {
        return 'none';
      } else {
        return color(d.depth);
      }
    })
    .attr('stroke', (d) => {
      if (d.depth === 0) {
        return color(d.depth);
      }
    })
    .attr('stroke-width', 2)
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
    .transition()
    .duration(1000)
    .attrTween('r', bubTweenEnter);

  names.exit().remove();
  values.exit().remove();

  // adjust current values text to animate
  if (reported && action) {
    names
      .transition()
      .duration(1000)
      .attr('transform', (d) => `translate(${d.x - d.r / 2}, ${d.y - 20})`)
      .attr('font-size', '0.7em');
    values
      .text((d) => {
        if (d.value > 0) {
          return d.value.toFixed() + '%';
        }
      })
      .transition()
      .duration(1000)
      .attr('transform', (d) => `translate(${d.x - d.r / 1.9}, ${d.y - 5})`)
      .attr('font-size', '1.1em');
  } else if (reported && !action) {
    let country_names = d3.selectAll('.country-name');
    country_names
      .transition()
      .duration(1000)
      .attr('transform', (d) => `translate(${d.x - d.r / 2}, ${d.y - 20})`)
      .attr('font-size', '0.7em');

    let country_values = d3.selectAll('.country');
    country_values
      .text((d) => {
        if (d.value > 0) {
          return d.value.toFixed() + '%';
        }
      })
      .transition()
      .duration(1000)
      .attr('transform', (d) => `translate(${d.x - d.r / 1.9}, ${d.y - 5})`)
      .attr('font-size', '1.1em');

    let reported_values = d3.selectAll('.reported');
    reported_values
      .text((d) => {
        if (d.value > 0) {
          return d.value.toFixed() + '%';
        }
      })
      .transition()
      .duration(1000)
      .attr('font-size', '2em')
      .attr('transform', (d) => `translate(${d.x}, ${d.y + 10})`);
  } else {
    names
      .transition()
      .duration(1000)
      .attr('font-size', '1em')
      .attr('transform', (d) => `translate(${d.x}, ${d.y - 20})`);
    values
      .text((d) => {
        if (d.value > 0) {
          return d.value.toFixed() + '%';
        }
      })
      .transition()
      .duration(700)
      .attr('font-size', '2em')
      .attr('transform', (d) => `translate(${d.x}, ${d.y + 10})`);
  }

  if (!reported) {
    names
      .enter()
      .append('text')
      .attr('class', (d) => {
        if (d.depth === 1) {
          return 'names country-name';
        } else {
          return 'names';
        }
      })
      .attr('text-anchor', 'middle')
      .attr('id', (d) => d.data.name)
      .attr('font-size', '1em')
      .attr('fill', '#fff')
      .style('opacity', 0)
      .attr('transform', (d) => `translate(${d.x}, ${d.y - 20})`)
      .text((d) => {
        let name = d.data.name;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return name;
      })
      .transition()
      .duration(1500)
      .styleTween('opacity', () => {
        let i = d3.interpolate(0, 1);
        return (t) => i(t);
      });
  }

  values
    .enter()
    .append('text')
    .attr('class', (d) => {
      if (d.depth === 1) {
        return `values ${d.data.name} country`;
      } else {
        return `values ${d.data.name}`;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('id', (d) => `value-${d.data.name}`)
    .attr('transform', (d) => {
      if (d.data.name === 'reported' && action) {
        return `translate(${d.x}, ${d.y - 20})`;
      } else {
        return `translate(${d.x}, ${d.y + 10})`;
      }
    })
    .attr('fill', '#fff')
    .attr('font-size', (d) => {
      if (d.data.name === 'reported' && action) {
        return '1.1em';
      } else if (d.data.name === 'action-taken') {
        return '1.1em';
      } else {
        return '2em';
      }
    })
    .attr('font-weight', 700)
    .text((d) => {
      if (d.value > 0) {
        return d.value.toFixed() + '%';
      }
    })
    .style('opacity', 0)
    .transition()
    .duration(1700)
    .styleTween('opacity', () => {
      let i = d3.interpolate(0, 1);
      return (t) => i(t);
    });
};

// tweens

// tween for entry of bubbles
const bubTweenEnter = (d) => {
  let i = d3.interpolate(0, d.r);
  return (t) => {
    d.r = i(t);
    return d.r;
  };
};

// tween for exit of bubbles
const bubTweenExit = (d) => {
  let i = d3.interpolate(d.r, 0);
  return (t) => {
    d.r = i(t);
    return d.r;
  };
};

// tween for moving
function translateTween(d) {
  let startPos = `translate(${this._current.data.x}, ${this._current.data.y})`;
  let endPos = `translate(${d.x}, ${d.y})`;

  let i = d3.interpolate(startPos, endPos);
  // update the _current prop with new updated data
  this._current = d;
  return (t) => i(t);
}

// function for zooming

svg.call(
  d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([1, 8])
    .on('zoom', zoomed)
);

function zoomed({ transform }) {
  svg.attr('transform', transform);
}
