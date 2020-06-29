// f34065d01f9e6999f0e3f8b57847b0bc
// TEST 2 BIATCHES
$(document).ready(function () {
  function (citySearched) {
    $.ajax({
      type: "GET",
      url:
        //"restaurant" +
        //citySearched +
        //"& serverlocation",
      dataType: "json",
      success: function (response) {
        prevCities(citySearched);
        console.log(response);
        // grab values from the responses from website by creating vars
      },
    });
  }
  // creates a row for the text denoting the "new" city to populate previously searched cities
  function createRow(citySearched) {
    let storedCity = $("<li> ")
      .addClass("list-group-item avoidRepeat list-group-item-action")
      .text(citySearched);
    $("#prevSearches").prepend(storedCity);
  }
  // determines if name of city typed into search field has been searched previously
  function prevCities(citySearched) {
    let allCities = retrieveCities();
    if (allCities.indexOf(citySearched) === -1) {
      allCities.push(citySearched);
      createRow(citySearched);
    }

    window.localStorage.setItem("myCities", JSON.stringify(allCities));
  }
  // retrieves cities already used as previous searches for to display weather in that city
  function retrieveCities() {
    let myCities = JSON.parse(window.localStorage.getItem("myCities")) || [];
    $("#prevSearches").empty();
    myCities.forEach((citySearched) => {
      createRow(citySearched);
    });

    return myCities;
  }
  $("#searchWeather").on("click", function () {
    let citySearched = $("#citySearched").val();
    retrieveWeather(citySearched);
  });
  $("#prevSearches").on("click", "li", function () {
    //console.log($(this).text());
    retrieveWeather($(this).text());
  });
  retrieveCities();
});
