const finalFilter = (data, key, id) => {
  // sum total for all participants in sample
  let sumTotal = d3.sum(data, (d) => d.total);
  let newData = [];

  key.forEach((key) => {
    let value = d3.rollup(data, (g) =>
      d3.sum(g, (d) => {
        let actual = d[key];
        return actual;
      })
    );
    let total = d3.sum(data, (d) => d.total);
    if(total >= 5){
      value = (value / total) * 100;
      newData.push({ key, value, total });
    } else {
      errorPopUp(id);
    }
    
  });

  return { newData, sumTotal };
};

let yTicks = 5;

let yPad = 10;


const switchesCheck = (item, switches, gender, type) => {
  // make sure rules aren't broken with switches

    switch (item.value) {
      case 'f':
        if (gender.length === 3) {
          switches[1].click();
        }
        break;
      case 'm':
      case 'n':
        if (gender.length === 3) {
          switches[0].click();
        }
      case 'verbal':
        if (type.length === 2) {
          switches[3].click();
        }
        break;
      case 'physical':
        if (type.length === 2) {
          switches[4].click();
        }
        break;
      default:
        break;
    }
  
}

const errorDiv = document.querySelector('#error-div')
errorPopUp = (id) => {
  let rect = document.querySelector(id).getBoundingClientRect();
  let bottom = rect.bottom;
  let left = rect.left;
  let width = rect.width;
  let height = rect.height;

  console.log(bottom);
  
  errorDiv.style.top = bottom - height/2;
  errorDiv.style.left = left + ((width - 300)/2);
  errorDiv.classList.remove('d-none');
  errorDiv.classList.add('bounce-in');

  setTimeout(() => {
    errorDiv.classList.remove('bounce-in');
    errorDiv.classList.add('d-none')
  }, 3000)
}

window.onresize = () => {location.reload()}