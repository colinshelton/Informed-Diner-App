// FIND PLACE FROM TEXT (ZIPCODE):

// THIS is our original restaurants array that will be fully populated after the ajax call.  We'll use this for populating the page content.
let restaurants = [];

// This is the initial zip code we'll use for the very 1st AJAX call to grab the coordinates.
let initialZip = "27408";

// This is the first populated current query array that houses all the Google NearBy results
let currentQuery = [];
// This is the 2nd, more defined current query array that contains all available data from currentQuery as well as specific values we couldn't get without a specific search per result.
let currentQuery2 = [];

// Google Key
const key = "AIzaSyD9zrHku8yPl0RU8P1IVNyfAq5YYfqj4Eg"


// THIS WORKS TO PULL THE GOOGLE RESULTS:
// STEP 1: runQuery() gets the coordinates (latitude and longitude of the queried zipcode)
// STEP 2: At the end of the runQuery() function, it calls the runNearBySearch() function using those coordinates.
// STEP 3: runNearBySearch() function uses the Google NearBy API to return ~20 results that match restaurants near the coordinates;
//      and then stores those results in a variable that is an array (called currentQuery) which is set to be empty on page load.
// STEP 4: At the end of the runNearBySearch() function, it calls the searchPerPlace() function which loops through the now-filled  
//      currentQuery array mentioned in Step 3.
// STEP 5: The SearchPerPlace function loops through the results in the currentQuery array and..
//      A) grabs the photoreference url and concatenates it to a useful working link, and stores it in a var called "photo"
//      B) On each loop, it runs a new place ajax call that targets a single location to return more specific data we needed like
//           website, hours, etc.
//      C) On each loop, it also creates variables for phoneNum (phone), website (website), mapsURL (the Google Maps direct URL), 
//          operatingHours (the business hours for the restaurant), openTime (the time it opens each day), name (the restaurant name),
//          openStatus (whether it's currently open), price_level (the price range from inexpensive to very expensive), rating (the
//          avg. user rating), address (the formatted address for the restaurant - better formatted and more accurate than the original
//          vicinity field we were keying off of), and a number of lat/lon coordinate values in case we needed them for mapping.
//  D) it then builds a new currentQuery array called "currentQuery2" with the more complete dataset
//  E) and then finally appends the "restaurants" final array we'll use for all keying and values. 

// ************** GOOGLE PLACES QUERY AND OBJECT CREATION ************** //

function runQuery(coordinatesAJAX) {
    const input = initialZip; 
    const inputtype = "textquery";
    const queryURL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + input + "&inputtype=" + inputtype + "&fields=name,geometry&key=" + key;
    const proxy_url = 'https://cors-anywhere.herokuapp.com/';
    const final_url = proxy_url + queryURL;
    $.ajax({
        url: final_url,
        method: "GET"
    }).then(function (placesCoordinates) {
        // Coordinate Variables 
        const lat = placesCoordinates.candidates[0].geometry.location.lat;
        const lng = placesCoordinates.candidates[0].geometry.location.lng;
        const coordinates = "" + lat + ',' + lng;
        runNearbySearch(coordinates);
    });
};

// FIND PLACE NEARBY using lat/lng:
function runNearbySearch(coordinates) {
    const nearbyParams = {
        "location": coordinates,
        "radius": "8046.72",
        "type": "restaurant",
        "key": "AIzaSyD9zrHku8yPl0RU8P1IVNyfAq5YYfqj4Eg"
    };
    const nearbyURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + $.param(nearbyParams);
    // parameters: can be name, address, or phone number
    // console.log("NEW NEARBY URL:", nearbyURL);
    const proxy_url = 'https://cors-anywhere.herokuapp.com/';
    const final_url2 = proxy_url + nearbyURL;
    // make AJAX request to Google Places API - GETs JSON data at the queryQRL
    // data then gets passed as an argument
    $.ajax({
        url: final_url2,
        method: "GET"
    }).then(function (placesData) {
        // console.log(placesData);
        currentQuery = placesData.results;
        // console.log("currentQuery: " + currentQuery);
        searchPerPlace()
    });
}

let itemsProcessed = 0;

function searchPerPlace(placesSearchData) {
    for (let i = 0; i < currentQuery.length; i++) {
        let placeID = currentQuery[i].place_id;
        //  let photoreference = currentQuery[i].photos[0].photo_reference;
        // let maxwidth = currentQuery[i].photos[0].width;
        // let photo = "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + photoreference + "&maxwidth=" + maxwidth + "&key=" + key;
        // console.log(photo);
        const placeSearchURL = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&key=" + key;
        const proxy_url = 'https://cors-anywhere.herokuapp.com/';
        const final_url3 = proxy_url + placeSearchURL;
        $.ajax({
            url: final_url3,
            method: "GET"
        }).then(function (placeSearchFields) {
            itemsProcessed++;
            // console.log(placeSearchFields);
            let phoneNum = placeSearchFields.result.formatted_phone_number;
            // console.log(phoneNum);
            let website = placeSearchFields.result.website;
            // console.log(website);
            let mapsURL = placeSearchFields.result.url;
            // console.log(mapsURL);
            let operatingHours = placeSearchFields.result.opening_hours.periods;
            // console.log(operatingHours);
            let openTime = placeSearchFields.result.opening_hours.weekday_text;
            // console.log(openTime);
            let restaurantName = placeSearchFields.result.name;
            // console.log(restaurantName);
            let openStatus = placeSearchFields.result.opening_hours.open_now;
            // console.log(openStatus);
            let price_level = placeSearchFields.result.price_level;
            // console.log(price_level);
            let rating = placeSearchFields.result.rating;
            // console.log(rating);
            let address = placeSearchFields.result.formatted_address;
            // console.log(address);
            let locationLat = placeSearchFields.result.geometry.location.lat;
            // console.log(locationLat);
            let locationLon = placeSearchFields.result.geometry.location.lng;
            // console.log(locationLon);
            let viewportNElat = placeSearchFields.result.geometry.viewport.northeast.lat;
            // console.log(viewportNElat);
            let viewportNElon = placeSearchFields.result.geometry.viewport.northeast.lng;
            // console.log(viewportNElon);
            let viewportSWlat = placeSearchFields.result.geometry.viewport.southwest.lat;
            // console.log(viewportSWlat);
            let viewportSWlon = placeSearchFields.result.geometry.viewport.southwest.lon;
            // console.log(viewportSWlon);
            currentQuery2[i] = {
                "uid": placeID,
                "phoneNum": phoneNum,
                "website": website,
                "mapsURL": mapsURL,
                "operatingHours": operatingHours,
                "openTime": openTime,
                "restaurantName": restaurantName,
                "openStatus": openStatus,
                "price_level": price_level,
                "rating": rating,
                "address": address,
                // "photo": photo,
                "locationLat": locationLat,
                "locationLon": locationLon,
                "viewportNElat": viewportNElat || '',
                "viewportNElon": viewportNElon || '',
                "viewportSWlat": viewportSWlat || '',
                "viewportSWlon": viewportSWlon || '',
                "favorite": false,
                "menuURL": '',
                "safetyScore" : "",
                "busTime" : "",
                "leastBusTime" : "",
                "percentBus" : ""
            }
            // set the object to the script-specific array of restaurants  
            restaurants[i] = currentQuery2[i];
            console.log(currentQuery2);
            console.log(restaurants);

            if (itemsProcessed === currentQuery2.length) {
                console.log('ITEMS PROCESSED', itemsProcessed, currentQuery2.length)
                saveRestaurants(restaurants)
                createListings();
            }
        });
    }
}

// The function to run the query
runQuery();

// ************** CREATE EVENTS ************** //
function createListings () {
    
    for (let i=0; i < restaurants.length; i++) {
        // unhide appropriate div
        let thisDiv = ".main-" + (i+1);
        console.log(thisDiv);
        $(thisDiv).removeClass("display-none");

        // show / hide favorites icon on listing
        let thisFav = "#favorite-" + (i+1);
        if(restaurants[i].favorite == true) {
            $(thisFav).removeClass("display-none");
        } else {
            $(thisFav).addClass("display-none");
        }

        // update image
        // let thisImgURL = '"#restImga-' + i + '"';
        // let thisImgSRC = '"#restImage-' + i + '"';
        // $(thisImgURL).attr("href", restaurants[i].website);
        // $(thisImgSRC).attr("src", restaurants[i].photo);

        // update Safety rating
        let thisSafetyDef = "#safetyRatingDefault-" + (i+1);
        let thisSafetyPop = "#safetyRatingPopulated-" + (i+1);
        let thisSafetyRating = "#safetyRatingSpan-" + (i+1);
        if(restaurants[i].safetyScore > 0) {
            $(thisSafetyDef).addClass("display-none");
            $(thisSafetyPop).removeClass("display-none");
            $(thisSafetyRating).html(restaurants[i].safetyScore);
        }

        // Update stars rating
        let st1e = "#star1empty-" + (i+1);
        let st1h = "#star1half-" + (i+1);
        let st1f = "#star1full-" + (i+1);
        let st2e = "#star2empty-" + (i+1);
        let st2h = "#star2half-" + (i+1);
        let st2f = "#star2full-" + (i+1);
        let st3e = "#star3empty-" + (i+1); 
        let st3h = "#star3half-" + (i+1);
        let st3f = "#star3full-" + (i+1);
        let st4e = "#star4empty-" + (i+1);
        let st4h = "#star4half-" + (i+1);
        let st4f = "#star4full-" + (i+1);
        let st5e = "#star5empty-" + (i+1);
        let st5h = "#star5half-" + (i+1);
        let st5f = "#star5full-" + (i+1);
        
        if(restaurants[i].rating == 0) {
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
        } else if (restaurants[i].rating < 1) {
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
        } else if (restaurants[i].rating == 1) {
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
        } else if (restaurants[i].rating > 1 && restaurants[i].rating < 2 ) {
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
        } else if (restaurants[i].rating == 2) {
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
        } else if (restaurants[i].rating > 2 && restaurants[i].rating < 3) {
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
        } else if (restaurants[i].rating == 3) {
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
        } else if (restaurants[i].rating > 3 && restaurants[i].rating < 4) {
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
        } else if (restaurants[i].rating == 4) {
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
        } else if (restaurants[i].rating > 4 && restaurants[i].rating < 5) {
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

        // update open now text 
        let openN = "#openNowText-" + (i+1);
        if (restaurants[i].openStatus == true) {
            $(openN).html("OPEN NOW");
        } else {
            $(openN).html("CLOSED");
        }

        // update price range
        let pricelvl = "#priceRange-" + (i+1);
        if (restaurants[i].price_level == 4) {
            $(pricelvl).html("$$$$");
        } else if (restaurants[i].price_level == 3) {
            $(pricelvl).html("$$$");
        } else if (restaurants[i].price_level == 2) {
            $(pricelvl).html("$$");
        } else if (restaurants[i].price_level == 1) {
            $(pricelvl).html("$");
        } else {
            $(pricelvl).html("FREE?!?");
        }

        // update Restaurant Name
        let restNm = "#restNameSpan-" + (i+1);
        $(restNm).html(restaurants[i].restaurantName);

        // link the directions button 
        let mapbtn = "#mapitBtn-" + (i+1);
        $(mapbtn).attr("href",restaurants[i].mapsURL);

        // linkup the website
        let weblink = "#website-" + (i+1);
        let webspan = "#restWebsite-" + (i+1);
        $(weblink).attr("href", restaurants[i].website);
        $(webspan).html("restaurants[i].website");
        }
    }


// ************** FIREBASE SCRIPT ************** //

// The core Firebase JS SDK script src's that are always required and must be listed first
// have been set in the HTML file for event listings.
var firebaseConfig = {
    apiKey: key,
    authDomain: "informeddiner.firebaseapp.com",
    databaseURL: "https://informeddiner.firebaseio.com",
    projectId: "informeddiner",
    storageBucket: "informeddiner.appspot.com",
    messagingSenderId: "498989936909",
    appId: "1:498989936909:web:f3402179c901930a7e0044"
};

// !!! NOTE: we're continually getting an error that "firebase" is not defined. 

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('FIREBASE', firebase);
var database = firebase.database();
function saveRestaurants(restaurants) {
    restaurants.forEach(function (restaurant) {
        database.ref('restaurants/').push(restaurant);
    })
    console.log('RESTAURANTS', restaurants);
    setTimeout(() => {
        database.ref('restaurants').once('value').then(function (snapshot) {
            var restaurants = (snapshot.val() && snapshot.val().restaurants) || 'Anonymous';
            console.log(restaurants);
        });
    }, 2000);
};
