// init sidenav
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var options = {
      edge: 'right',
      inDuration: 400, 
      outDuration: 400
    };
    var instances = M.Sidenav.init(elems, options);
    
  });