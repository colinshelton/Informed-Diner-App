/* 
* HEADER UTILITY NAV SCRIPT
* SHOULD BE ADDED ALONG WITH OTHER SCRIPTS ON PAGES THAT CONTAIN THE HEADER/UTILITY NAV
*/

// Enables the FAB toggle to work
document.addEventListener('DOMContentLoaded', function() {  // runs the function when the DOM's content is loaded
    var elems = document.querySelectorAll('.fixed-action-btn'); // gets the .fixed-action-btn div
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'left', // sets it to open to the bottom of the main FAB button
      hoverEnabled: false // sets it to open on click, not hover
    });
  });

  $("#fab-toggle-filter").hover(function() {
      $("#fab-toggle-filter").addClass("pulse");
  });

  $("#fab-toggle-filter").on("mouseleave", function() {
      $("#fab-toggle-filter").toggleClass("pulse");
  });



