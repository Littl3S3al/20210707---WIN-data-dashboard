// update data to match toggles call call vis function
const updateData = (gender, type) => {
  // check for type of harassment and set values to true/false
  let v = type.includes('v');
  let p = type.includes('p');

  new Promise((res) => {
    rootData.children.forEach((country) => {
      // reset values to zero
      let total = 0;
      let notReported = 0;
      let action = 0;
      let noAction = 0;

      // loop through all genders passed to add values. Do this while checking for truthy value of type of harassment
      gender.forEach((gender) => {
        let result = compiledData.filter(
          (item) => item.country === country.name && item.gender === gender
        );
        console.log(result);
        total += parseInt(result[0].total_answered);

        if (v) {
          notReported += parseInt(result[0].v_not_reported);
          action += parseInt(result[0].v_action);
          noAction += parseInt(result[0].v_no_action);
        }
        if (p) {
          notReported += parseInt(result[0].p_not_reported);
          action += parseInt(result[0].p_action);
          noAction += parseInt(result[0].p_no_action);
        }
      });

      
      country.total = total;
      if(v && p){
        country.children[0].value = ((notReported/2) / total) * 100; //not reported
        country.children[1].children[0].value = ((noAction/2) / total) * 100; //action-taken
        country.children[1].children[1].value = ((action/2) / total) * 100; //no action-taken
      }
      else {
        country.children[0].value = (notReported / total) * 100; //not reported
        country.children[1].children[0].value = (noAction / total) * 100; //action-taken
        country.children[1].children[1].value = (action / total) * 100; //no action-taken
      }
      
    });
    res(rootData);
  }).then((res) => {
    let updatedData = d3.hierarchy(res).sum((d) => d.value);
    updateVis(updatedData);
  });
};

//  (runs at start) bring in the csv data - then the json data - then call update
d3.csv('./data/compiled.csv')
  .then((d) => {
    compiledData = d;
    console.log(d);
  })
  .then(() => {
    d3.json('./data/index.json').then((data) => {
      rootData = data;
      updateData(['f', 'm', 'n'], ['v', 'p']);
    });
  });
