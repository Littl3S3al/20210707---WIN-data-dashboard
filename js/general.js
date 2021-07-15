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

  // init collapsable
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
  });

  
  // init tabs
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tabs');
    var instances = M.Tabs.init(elems);
  });