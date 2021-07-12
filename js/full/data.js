const finalFilter = (data, key) => {
  // sum total for all participants in sample
  let sumTotal = d3.sum(data, (d) => d.total);
  let newData = [];

  key.forEach((key) => {
    let value = d3.rollup(data, (g) =>
      d3.sum(g, (d) => {
        let actual = d.total * (d[key] / 100);
        return actual;
      })
    );
    let total = d3.sum(data, (d) => d.total);
    value = (value / total) * 100;
    newData.push({ key, value, total });
  });

  return { newData, sumTotal };
};

let yTicks = 5;
