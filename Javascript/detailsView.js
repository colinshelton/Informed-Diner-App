$( document ).ready(function() {

let currBTforecast = JSON.parse(localStorage.getItem("currBTforecast"));
let restaurants = JSON.parse(localStorage.getItem("lsRestaurants"));
let currRest = JSON.parse(localStorage.getItem("currentRestaurant"));
const key = "AIzaSyD9zrHku8yPl0RU8P1IVNyfAq5YYfqj4Eg";
const proxy_url = 'https://cors-anywhere.herokuapp.com/';



//TODO MVP2 Feature: Google Map 
// Create the script tag, set the appropriate attributes
//var script = document.createElement('script');
//script.src = proxy_url + 'https://maps.googleapis.com/maps/api/js?key=' + key + '&callback=initMap';
//script.defer = true;
//script.async = true;
//Attach your callback function to the `window` object
// window.initMap = function() { 
// JS API is loaded and available
//};
// Append the 'script' element to 'head'
//document.head.appendChild(script);
// $("head").append("<script>").attr("src",`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`).attr("defer",true).attr("async",true);


// 1. Update Open Now.
    const openN = "#openNowText";
    if (currRest.openStatus == true) {
        $(openN).html("OPEN NOW");
    } else {
        $(openN).html("CLOSED");
    }

// 2. Update Ratings (stars)
    const st1e = "#star1empty"; const st1h = "#star1half"; const st1f = "#star1full"; const st2e = "#star2empty"; const st2h = "#star2half"; const st2f = "#star2full"; const st3e = "#star3empty"; const st3h = "#star3half"; const st3f = "#star3full"; const st4e = "#star4empty"; const st4h = "#star4half"; const st4f = "#star4full"; const st5e = "#star5empty"; const st5h = "#star5half";
    const st5f = "#star5full"; if(currRest.rating == 0) {
        $(st1e).removeClass("is-hidden"); 
        $(st1h).addClass("is-hidden");
        $(st1f).addClass("is-hidden");
        $(st2e).removeClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).addClass("is-hidden");
        $(st3e).removeClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).addClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating < 1) {
        $(st1e).addClass("is-hidden");
        $(st1h).removeClass("is-hidden");
        $(st1f).addClass("is-hidden");
        $(st2e).removeClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).addClass("is-hidden");
        $(st3e).removeClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).addClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating == 1) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).removeClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).addClass("is-hidden");
        $(st3e).removeClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).addClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating > 1 && currRest.rating < 2 ) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).removeClass("is-hidden");
        $(st2f).addClass("is-hidden");
        $(st3e).removeClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).addClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating == 2) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).removeClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).addClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating > 2 && currRest.rating < 3) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).addClass("is-hidden");
        $(st3h).removeClass("is-hidden");
        $(st3f).addClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating == 3) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).addClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).removeClass("is-hidden");
        $(st4e).removeClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating > 3 && currRest.rating < 4) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).addClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).removeClass("is-hidden");
        $(st4e).addClass("is-hidden");
        $(st4h).removeClass("is-hidden");
        $(st4f).addClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating == 4) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).addClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).removeClass("is-hidden");
        $(st4e).addClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).removeClass("is-hidden");
        $(st5e).removeClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else if (currRest.rating > 4 && currRest.rating < 5) {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).addClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).removeClass("is-hidden");
        $(st4e).addClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).removeClass("is-hidden");
        $(st5e).addClass("is-hidden");
        $(st5h).removeClass("is-hidden");
        $(st5f).addClass("is-hidden");
    } else {
        $(st1e).addClass("is-hidden");
        $(st1h).addClass("is-hidden");
        $(st1f).removeClass("is-hidden");
        $(st2e).addClass("is-hidden");
        $(st2h).addClass("is-hidden");
        $(st2f).removeClass("is-hidden");
        $(st3e).addClass("is-hidden");
        $(st3h).addClass("is-hidden");
        $(st3f).removeClass("is-hidden");
        $(st4e).addClass("is-hidden");
        $(st4h).addClass("is-hidden");
        $(st4f).removeClass("is-hidden");
        $(st5e).addClass("is-hidden");
        $(st5h).addClass("is-hidden");
        $(st5f).removeClass("is-hidden");
    }


// 3. Update Price Level
    const pricelvl = "#priceRange";
    if (currRest.price_level == 4) {
        $(pricelvl).html("$$$$");
    } else if (currRest.price_level == 3) {
        $(pricelvl).html("$$$");
    } else if (currRest.price_level == 2) {
        $(pricelvl).html("$$");
    } else if (currRest.price_level == 1) {
        $(pricelvl).html("$");
    } else {
        $(pricelvl).html("FREE?!?");
    }

// 4. Update Restaurant Title
    const restNm = "#restNameSpan";
    $(restNm).html(currRest.restaurantName);
    $(restNm).attr("uid", currRest.uid);
    $(restNm).attr("btid", currRest.venue_id);

// 5. Link Favorites Button and toggle favorites.
// show / hide favorites icon on listing
    const thisFav = "#addFavoriteBtn";
    // const thisRem = "#removeFavoriteBtn
    $("#addFavoriteBtn").click(function() {
        $("#addFavoriteBtn").toggleClass("is-hidden");
        $("#removeFavoriteBtn").toggleClass("is-hidden");
        currRest.favorite = true;
        $(thisFav).removeClass("display-none");
        $("#favdiv").removeClass("display-none");
    });
    $("#removeFavoriteBtn").click(function() {
        $("#addFavoriteBtn").toggleClass("is-hidden");
        $("#removeFavoriteBtn").toggleClass("is-hidden");
        currRest.favorite = false;
        $(thisFav).addClass("display-none");
        $("#favdiv").addClass("display-none");
    });

// 6. Link Get Directions Button to mapsURL
    $("#mapitBtn").attr("href",currRest.mapsURL);

// 7. Link See Menu to website
    $("#seeMenuBtn").attr("href",currRest.website);

/// 8. Update Image
    const thisImgSRC = "#restImage";
    $(thisImgSRC).attr("src", currRest.photo);

/// 9. Update Image



// 9. Update Hours
const ot0 = currRest.openTime[0]; 
// const hours1From = (currRest.openTime[0]).slice(10,8);
// console.log(hours1From);
const hours1To = (currRest.openTime[0]).slice(8);
console.log(hours1To);
$("#DayOfWeek1").text(ot0.slice(0,7));
$("#Hours1").text(hours1To);

const ot1 = currRest.openTime[1];
// const hours2From = (currRest.openTime[1]).slice(10,8);
const hours2To = (currRest.openTime[1]).slice(9);
$("#DayOfWeek2").text(ot1.slice(0,8));
$("#Hours2").text(hours2To);

const ot2 = currRest.openTime[2];
// const hours3From = (currRest.openTime[2]).slice(12,8);
const hours3To = (currRest.openTime[2]).slice(11)
$("#DayOfWeek3").text(ot2.slice(0,10));
$("#Hours3").text(hours3To);

const ot3 = currRest.openTime[3];
// const hours4From = (currRest.openTime[3]).slice(11,8);
const hours4To = (currRest.openTime[3]).slice(10);
$("#DayOfWeek4").text(ot3.slice(0,9));
$("#Hours4").text(hours4To);

const ot4 = currRest.openTime[4];
// const hours5From = (currRest.openTime[4]).slice(9,8);
const hours5To = (currRest.openTime[4]).slice(8);
$("#DayOfWeek5").text(ot4.slice(0,7));
$("#Hours5").text(hours5To);

const ot5 = currRest.openTime[5];
// const hours6From = (currRest.openTime[5]).slice(11,8);
const hours6To = (currRest.openTime[5]).slice(10);
$("#DayOfWeek6").text(ot5.slice(0,9));
$("#Hours6").text(hours6To);

const ot6 = currRest.openTime[6];
// const hours7From = (currRest.openTime[6]).slice(9,8);
const hours7To = (currRest.openTime[6]).slice(8);
$("#DayOfWeek7").text(ot6.slice(0,7));
$("#Hours7").text(hours7To);

// 10.  Update Contact Address
const thisAdd = currRest.address.slice(0,-5)
$("#address").text(thisAdd);
// $("#address").attr("style","margin-left:2em !important; text-indent: -3em;")

// 11.  Update phone number
$("#phoneNumber").text(currRest.phoneNum);

// 12.  Update website
let ws = currRest.website;
let shortWS = ws.slice(8,-9);
console.log("shortWS:" + shortWS);
let slash = shortWS.indexOf("/");
let shorterWS = shortWS.slice(0,slash);
console.log("shorterWS: " + shorterWS);
$("#restWebsite").html(`<a href="${ws}">${shorterWS}</a>`);


//get time right now: 
// ---- SHOW DATE IN VARIOUS FORMATS IN THE HEADER ---- //
let shortNow = moment().format('dddd, MM/DD/YY').toUpperCase(); // Leverages moment.js to grab today's date and format appropriately (e.g. Mon, 01/31/20) and set it to a var "shortNow"
let currentHour = moment().format('h:mm A'); // Creates a variable to be set as the current hour in shorthand (e.g. 8AM, 4AM, 12PM, etc.)
let currentHourVal = moment().format('H'); // Creates a variable to be set as the hour value in 24hr format for use in functional comparisons (e.g. 4, 17, 23 etc.)
$('#now').text(currentHour); // Sets the h1 w/ class "".display-3" with the date in the above variable
let day = parseInt(moment().format('d'));
console.log("day: " + day);
window.setInterval(function() { // Set a timer interval to infinitely loop and update the current seconds.
  let now = moment().format('dddd, MMMM Do YYYY, h:mm:ss a'); // Leverages moment.js to grab today's date and format appropriately (e.g. Monday, January 31 2020, 2:32:53 pm) and set it to a var "now"
//   $('#currentDay').text(now); // Sets the p w/ #id "currentDay" with the date held in the above variable
//   styleTime(); // Run the timeblock styling function (repeatedly) so that it updates the by-hour styles as soon as the hour changes
}, 1000);  // Loop every the interval every 1000 milliseconds (aka every second)
// ----------------------------- //


// 14. Update Busiest Time (model for graph)
// Update Busy Right Now
console.log(typeof(day));
let todaySurgeStart = currBTforecast.analysis[day].surge_hours.most_people_come;
let todaySurgeEnd = currBTforecast.analysis[day].surge_hours.most_people_leave;
let totalQ =  todaySurgeEnd+todaySurgeStart;
let meanB = totalQ / 2;
console.log("mean:" + meanB);
let busiestTimeToday = meanB;
busiestTimeToday = busiestTimeToday/2;
if (meanB > 12) {
    busiestTimeToday = meanB - 12;
    console.log("busy time is after noon" + busiestTimeToday);
    busiestTimeToday = busiestTimeToday.toString() + "PM";
    console.log("busy time step 1:" + busiestTimeToday);
} else if (meanB == 12) {
    busiestTimeToday = meanB.toString() + "PM";
    console.log("busy time is noon :" + busiestTimeToday);
} else { 
    busiestTimeToday = busiestTimeToday.toString() + "AM";
    console.log("busy time is AM :" + busiestTimeToday);
}
$("#busiestTime").text(busiestTimeToday);

//  15. Update Quietest / Safest Time (model for graph)
let quietestTimeToday = currBTforecast.analysis[day].quiet_hours[1];
let quietestTimeTodayConverted = (quietestTimeToday % 12);
if (quietestTimeToday > 12) {
    quietestTimeToday = (quietestTimeTodayConverted.toString() + " PM");
    console.log("busy time" + quietestTimeToday);
} else if (quietestTimeToday == 12) {
    quietestTimeToday = toString(quietestTimeTodayConverted.toString() + " PM");
} else { 
    quietestTimeToday = toString(quietestTimeTodayConverted.toString() + " AM");
    console.log("quiet is AM :" + quietestTimeToday);
}
$(".safestTime").text(quietestTimeToday);



// 16. Update Safety Rating????

// SCORING ALGORITHM:
// get day $(day)
// get current hour $(currentHourVal)
// Day of week: 1 = +4 , 2 = +3.4 , 3 = +3 , 4 = +2.5, 5 = +2, 6 = +1.5, 7 = +1
let dOw = currBTforecast.analysis[day].day_info.day_rank_max;
let dOwScore = "";
if (dOw == 7) {
    dOwScore = 1;
} else if (dOw == 6) {
    dOwScore = 1.5;
} else if (dOw == 5) {
    dOwScore = 2;
} else if (dOw == 4) {
    dOwScore = 2.5;
} else if (dOw == 3) {
    dOwScore = 3;
} else if (dOw == 2) {
    dOwScore = 3.4;
} else if (dOw == 1) {
    dOwScore = 4;
}

// Non-Peak: = +0, during-peak && !peak-max = +1, peak max= +2
let peakMax = currBTforecast.analysis[day].peak_hours[0].peak_max;
let peakMaxScore = ""
if( currentHourVal == peakMax) {
    peakMaxScore = 2;
} else if ( currentHourVal = peakMax -1 ) {
    peakMaxScore = 1;
} else if ( currentHourVal = peakMax -2) {
    peakMaxScore = 1;
} else if ( currentHourVal = peakMax + 1 ) {
    peakMaxScore = 1;
} else if (currentHourVal = peakMax + 2) {
    peakMaxScore = 1;
} else {
    peakMaxScore = 0;
}

// During Surge Traffic Entry or Exit: +1
let surgeInit = currBTforecast.analysis[day].surge_hours.most_people_come;
let surgeEnd = currBTforecast.analysis[day].surge_hours.most_people_leave;

if ( currentHourVal == surgeInit ) {
    surgeScore = 1;
} else if ( currentHourVal == surgeEnd ) {
    surgeScore = 1;
} else {
    surgeScore = 0;
}

// Intensity: Low = -2, Below Avg. = -1, Avg. = +0 , High = +1 , Very High = +2
let indexedHour = "";
if  (currentHourVal == 5) {
    indexedHour = 23;
} else if (currentHourVal == 4) {
    indexedHour = 22;
} else if (currentHourVal == 3) {
    indexedHour = 21;
} else if (currentHourVal == 2) {
    indexedHour = 20;
} else if (currentHourVal == 1) {
    indexedHour = 19;
} else if (currentHourVal == 0) {
    indexedHour = 18;
} else {
    indexedHour = currentHourVal - 6;
}
let currIntensity = currBTforecast.analysis[day].hour_analysis[indexedHour].intensity_nr;

// Min/Max Adjustment = +1
let mmAdj = 1

// Weighted Safety Score:
let weightedSS = dOwScore + peakMaxScore + surgeScore + currIntensity + mmAdj;

$("#safetyRatingSpan").text(weightedSS);












// let thisSafetyDef = "#safetyRatingDefault-" + (i+1);
// let thisSafetyPop = "#safetyRatingPopulated-" + (i+1);
// let thisSafetyRating = "#safetyRatingSpan-" + (i+1);
// if(restaurants[i].safetyScore > 0) {
//     $(thisSafetyDef).addClass("display-none");
//     $(thisSafetyPop).removeClass("display-none");
//     $(thisSafetyRating).html(restaurants[i].safetyScore);
// }



// 17. Update Maps image
//TODO //
//TODO We will add Google Maps API for live mapping and direction in MVP2.

//let llat = currRest.locationLat;
//let llon = currRest.locationLon
//let center = {lat: llat, lng: llon};

//? var map;
//? function initMap() {
//?     map = new google.maps.Map(document.getElementById('map'));
//?      $("map").attr("center", center);
//?      $("map").attr("zoom", 8);
//? }

//? let mapsAddress = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${currRest.uid}`
//? $("gmap").attr("src", mapsAddress);

//? let mapsSrc = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
//? $("gmap").attr("src", mapsAddress);


// 18. Update eCharts chart
//TODO //
// We had hoped to include eCharts dynamic graphing for MVP, but looks more like MVP2


// 19. Firebase
// ! Firebase has been cleared and reactivated and is logging our data.

});
