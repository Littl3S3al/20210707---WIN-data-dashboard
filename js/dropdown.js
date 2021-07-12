document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems);
  });

  const selected = document.querySelector('.selected');
  const dd_options = document.querySelectorAll('#dropdown1 a');
  let current = 'Africa'

  dd_options.forEach(option => {
    option.addEventListener('click', e => {
      e.stopPropagation();
      current = option.innerText;
      selected.textContent = option.textContent
    })
  })