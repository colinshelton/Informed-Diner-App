// FIND PLACE FROM TEXT (ZIPCODE):

let restaurants = []; // THIS is our original restaurants array that will be fully populated after the ajax call.  We'll use this for populating the page content.
let initialZip = "27408"; // This is the initial zip code we'll use for the very 1st AJAX call to grab the coordinates.
let currentQuery = []; // This is the first populated current query array that houses all the Google NearBy results
let currentQuery2 = []; // This is the 2nd, more defined current query array that contains all available data from currentQuery as well as specific values we couldn't get without a specific search per result.

// Google Key
const key = "AIzaSyD9zrHku8yPl0RU8P1IVNyfAq5YYfqj4Eg";
// BestTime.app Keys
const priKey = "pri_39b255dc8cce4593bdf450afd28225ec";
const pubKey = "pub_384cb93c28cd434c842824f3e97299db";

// const proxy_url = "https://cors-proxy.htmldriven.com/?url="
const proxy_url = 'https://cors-anywhere.herokuapp.com/';

// ************** GOOGLE PLACES QUERY AND OBJECT CREATION ************** //
// ** SEE AT BOTTOM OF JS CODE FOR ADDITION NOTES ON PROCESS FOR GOOGLE QUERY AND OBJECT CREATION **

//** API CALL #1: GOOGLE PLACES - FIND PLACE FROM TEXT - COORDINATES SEARCH
function runQuery(coordinatesAJAX) {
    const input = initialZip; 
    const inputtype = "textquery";
    const queryURL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + input + "&inputtype=" + inputtype + "&fields=name,geometry&key=" + key;
    // const proxy_url = 'https://cors-anywhere.herokuapp.com/';
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

//** API CALL #2: GOOGLE PLACES - FIND NEARBY BUSINESSES BASED ON COORDINATES
function runNearbySearch(coordinates) {
    const nearbyParams = {
        "location": coordinates,
        "radius": "8046.72",
        "type": "restaurant",
        "key": "AIzaSyD9zrHku8yPl0RU8P1IVNyfAq5YYfqj4Eg"
    };
    const nearbyURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + $.param(nearbyParams);
    // parameters: can be name, address, or phone number
    console.log("NEW NEARBY URL:", nearbyURL);
    // const proxy_url = 'https://cors-anywhere.herokuapp.com/';
    const final_url2 = proxy_url + nearbyURL;
    // make AJAX request to Google Places API - GETs JSON data at the queryQRL
    // data then gets passed as an argument
    $.ajax({
        url: final_url2,
        method: "GET"
    }).then(function (placesData) {
        console.log(placesData);
        currentQuery = placesData.results;
        console.log("currentQuery: " + currentQuery);
        searchPerPlace()
    });
}

let itemsProcessed = 0;

//** API CALL #3: GOOGLE PLACES - PLACE DETAILS SEARCH
function searchPerPlace(placesSearchData) {

    for (let i = 0; i < currentQuery.length; i++) {
        let placeID = currentQuery[i].place_id;
        let photoreference = "x";
        let maxwidth = "y";
        let photo = "z";
        if (currentQuery[i].photos[0].photo_reference !== undefined) {
            photoreference = currentQuery[i].photos[0].photo_reference;
            maxwidth = currentQuery[i].photos[0].width;
            photo = "https://maps.googleapis.com/maps/api/place/photo?photoreference=" + photoreference + "&maxwidth=" + maxwidth + "&key=" + key;
            // console.log(photo);
        } else {
            photo = "https://www.foodiesfeed.com/wp-content/uploads/2019/06/beautiful-vibrant-shot-of-traditional-korean-meals.jpg";
        }
        const placeSearchURL = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&key=" + key;
        // const proxy_url = 'https://cors-anywhere.herokuapp.com/';
        const final_url3 = proxy_url + placeSearchURL;
        $.ajax({
            url: final_url3,
            method: "GET"
        }).then(function (placeSearchFields) {
            itemsProcessed++;
            // console.log(phoneNum);
            let phoneNum = "";
            if(placeSearchFields.result.formatted_phone_number == undefined) {
                phoneNum = "";
            } else {
                phoneNum = placeSearchFields.result.formatted_phone_number;
            }
            // console.log(website); 
            let website = "";
            if(placeSearchFields.result.website == undefined) {
                website = "";
            } else {
                website = placeSearchFields.result.website;
            }
            // console.log(mapsURL); 
            let mapsURL = "";
            if(placeSearchFields.result.url == undefined) {
                mapsURL = "";
            } else {
                mapsURL = placeSearchFields.result.url;
            }
            // console.log(operatingHours);
            let operatingHours = "";
            if(placeSearchFields.result.opening_hours.periods == undefined) {
                operatingHours = "";
            } else {
                operatingHours = placeSearchFields.result.opening_hours.periods;
            }
            // console.log(openTime);
            let openTime = ""; 
            if(placeSearchFields.result.opening_hours.weekday_text == undefined) {
                openTime = "";
            } else {
                openTime = placeSearchFields.result.opening_hours.weekday_text;
            }
            // console.log(restaurantName);
            let restaurantName = "";
            if(placeSearchFields.result.name == undefined) {
                restaurantName = "";
            } else {
                restaurantName = placeSearchFields.result.name;
            }
            // console.log(openStatus);
            let openStatus = "";
            if( placeSearchFields.result.opening_hours.open_now == undefined) {
                openStatus = "";
            } else {
                openStatus =  placeSearchFields.result.opening_hours.open_now;
            }
            // console.log(price_level);
            let price_level = "";
            if( placeSearchFields.result.price_level == undefined) {
                price_level = "";
            } else {
                price_level =  placeSearchFields.result.price_level;
            }
            // console.log(rating);
            let rating = "";
            if(placeSearchFields.result.rating == undefined) {
                rating = "";
            } else {
                rating =  placeSearchFields.result.rating;
            }
            // console.log(address);
            let address = "";
            if(placeSearchFields.result.formatted_address == undefined) {
                address = "";
            } else {
                address =  placeSearchFields.result.formatted_address;
            }
            // console.log(locationLat);
            let locationLat = "";
            if(placeSearchFields.result.geometry.location.lat == undefined) {
                locationLat = "";
            } else {
                locationLat =  placeSearchFields.result.geometry.location.lat;
            }
            // console.log(locationLon);
            let locationLon = "";
            if(placeSearchFields.result.geometry.location.lng == undefined) {
                locationLon = "";
            } else {
                locationLon =  placeSearchFields.result.geometry.location.lng;
            }
            // console.log(viewportNElat);
            let viewportNElat = "";
            if(placeSearchFields.result.geometry.viewport.northeast.lat == undefined) {
                viewportNElat = "";
            } else {
                viewportNElat =  placeSearchFields.result.geometry.viewport.northeast.lat;
            }
            // console.log(viewportNElon);
            let viewportNElon = "";
            if(placeSearchFields.result.geometry.viewport.northeast.lng == undefined) {
                viewportNElon = "";
            } else {
                viewportNElon =  placeSearchFields.result.geometry.viewport.northeast.lng;
            }
            // console.log(viewportSWlat);
            let viewportSWlat = "";
            if(placeSearchFields.result.geometry.viewport.southwest.lat == undefined) {
                viewportSWlat = "";
            } else {
                viewportSWlat =  placeSearchFields.result.geometry.viewport.southwest.lat;
            }
            // console.log(viewportSWlon);
            let viewportSWlon = "";
            if(placeSearchFields.result.geometry.viewport.southwest.lon == undefined) {
                viewportSWlon = "";
            } else {
                viewportSWlon =  placeSearchFields.result.geometry.viewport.southwest.lon;
            }
            currentQuery2[i] = {
                "uid": placeID,
                "btid": "",
                "phoneNum": phoneNum,
                "website": website,
                "mapsURL": mapsURL,
                "btTimeZone" : "", 
                "operatingHours": operatingHours,
                "openTime": openTime,
                "restaurantName": restaurantName,
                "btName": "",
                "openStatus": openStatus,
                "price_level": price_level,
                "rating": rating,
                "address": address,
                "btAddress": "",
                "photo": photo,
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
                "percentBus" : "",
                "btMon0" : {  
                    "busy_hours" : "",
                    "day_code" : 0, 
                    "day_max" : "",
                    "day_mean" : "",
                    "day_rank_max" : "",
                    "day_rank_mean" : "",
                    "day_text" : "Monday",
                    "venue_closed" : "",
                    "venue_open" : "",
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "",
                        "hour0_6AM_intensity_val" : "",
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "",
                        "hour1_7AM_intensity_val" : "",
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "",
                        "hour2_8AM_intensity_val" : "",
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.9.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.9.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.10.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.10.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour11_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.11.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.11.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.12.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.12.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.13.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.13.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.14.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.14.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.15.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.15.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.16.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.16.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.17.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.17.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.18.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.18.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.19.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.19.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.20.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.20.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.21.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.21.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.22.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.22.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.23.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.0.hour_analysis.23.intensity_nr
                    }
                },
                "btTue1" : {  
                    "busy_hours" : "", // From BT: analysis.1.busy_hours
                    "day_code" : 1, 
                    "day_max" : "", // From BT: analysis.1.day_info.day_max
                    "day_mean" : "", // From BT: analysis.1.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.1.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.1.day_info.day_rank_mean
                    "day_text" : "Tuesday",
                    "venue_closed" : "", // From BT: analysis.1.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.1.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.2.intensity_nr
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour1_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.1.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.1.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.1.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.1.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.1.hour_analysis.22.intensity_nr
                    }
                },
                "btWed2" : {  
                    "busy_hours" : "", // From BT: analysis.2.busy_hours
                    "day_code" : 2, 
                    "day_max" : "", // From BT: analysis.2.day_info.day_max
                    "day_mean" : "", // From BT: analysis.2.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.2.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.2.day_info.day_rank_mean
                    "day_text" : "Wednesday",
                    "venue_closed" : "", // From BT: analysis.2.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.2.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.2.intensity_nr
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour1_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.2.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.2.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.2.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.2.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.2.hour_analysis.22.intensity_nr
                    }
                },
                "btThu3" : {  
                    "busy_hours" : "", // From BT: analysis.3.busy_hours
                    "day_code" : 3, 
                    "day_max" : "", // From BT: analysis.3.day_info.day_max
                    "day_mean" : "", // From BT: analysis.3.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.3.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.3.day_info.day_rank_mean
                    "day_text" : "Thursday",
                    "venue_closed" : "", // From BT: analysis.3.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.3.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.2.intensity_nr
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour1_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.3.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.3.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.3.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.3.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.3.hour_analysis.22.intensity_nr
                    }
                },
                "btFri4" : {  
                    "busy_hours" : "", // From BT: analysis.4.busy_hours
                    "day_code" : 4, 
                    "day_max" : "", // From BT: analysis.4.day_info.day_max
                    "day_mean" : "", // From BT: analysis.4.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.4.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.4.day_info.day_rank_mean
                    "day_text" : "Friday",
                    "venue_closed" : "", // From BT: analysis.4.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.4.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.2.intensity_nr
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour1_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.4.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.4.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.4.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.4.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.4.hour_analysis.22.intensity_nr
                    }
                },
                "btSat5" : {  
                    "busy_hours" : "", // From BT: analysis.5.busy_hours
                    "day_code" : 5, 
                    "day_max" : "", // From BT: analysis.5.day_info.day_max
                    "day_mean" : "", // From BT: analysis.5.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.5.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.5.day_info.day_rank_mean
                    "day_text" : "Saturday",
                    "venue_closed" : "", // From BT: analysis.5.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.5.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.2.intensity_nr
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour1_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.5.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.5.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.5.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.5.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.5.hour_analysis.22.intensity_nr
                    }
                },
                "btSun6" : {  
                    "busy_hours" : "", // From BT: analysis.6.busy_hours
                    "day_code" : 6, 
                    "day_max" : "", // From BT: analysis.6.day_info.day_max
                    "day_mean" : "", // From BT: analysis.6.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.6.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.6.day_info.day_rank_mean
                    "day_text" : "Sunday",
                    "venue_closed" : "", // From BT: analysis.6.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.6.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.2.intensity_nr
                        "hour3_9AM_24" : 9,
                        "hour3_9AM_12" : 9,
                        "hour3_9AM_AMPM" : "AM",
                        "hour3_9AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.3.intensity_txt
                        "hour3_9AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.3.intensity_nr
                        "hour4_10AM_24" : 10,
                        "hour4_10AM_12" : 10,
                        "hour4_10AM_AMPM" : "AM",
                        "hour4_10AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.4.intensity_txt
                        "hour4_10AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.4.intensity_nr
                        "hour5_11AM_24" : 11,
                        "hour5_11AM_12" : 11,
                        "hour5_11AM_AMPM" : "AM",
                        "hour5_11AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.5.intensity_txt
                        "hour5_11AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.5.intensity_nr
                        "hour6_12PM_24" : 12,
                        "hour6_12PM_12" : 12,
                        "hour6_12PM_AMPM" : "PM",
                        "hour6_12PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.6.intensity_txt
                        "hour6_12PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.6.intensity_nr
                        "hour7_1PM_24" : 13,
                        "hour7_1PM_12" : 1,
                        "hour7_1PM_AMPM" : "PM",
                        "hour7_1PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.7.intensity_txt
                        "hour7_1PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.7.intensity_nr
                        "hour8_2PM_24" : 14,
                        "hour8_2PM_12" : 2,
                        "hour8_2PM_AMPM" : "PM",
                        "hour8_2PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.8.intensity_txt
                        "hour8_2PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.8.intensity_nr
                        "hour9_3PM_24" : 15,
                        "hour9_3PM_12" : 3,
                        "hour9_3PM_AMPM" : "PM",
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour1_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.6.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.6.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.6.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.6.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.6.hour_analysis.22.intensity_nr
                    }
                }

            } 
            // set the object to the script-specific array of restaurants  
            restaurants[i] = currentQuery2[i];
            console.log(currentQuery2);
            console.log(restaurants);
            if (itemsProcessed === currentQuery2.length) {
                console.log('ITEMS PROCESSED', itemsProcessed, currentQuery2.length)
                // saveRestaurants(restaurants);
                if (restaurants.length === currentQuery2.length && restaurants[18] !== undefined) {
                    createListings();
                    saveRestaurants();
                }
            }
        });
    }
}

// ! RUN THE QUERY AND AJAX CALLS
runQuery();
 
// ************** CREATE LISTINGS ************** //
function createListings () {
    // for (let i=0; i < currentQuery2.length; i++) {
    for (let i=0; i < restaurants.length; i++) {
        // unhide appropriate div
        let thisDiv = ".main-" + (i+1);
        console.log(thisDiv);
        if($(thisDiv).hasClass("display-none")) {
            $(thisDiv).removeClass("display-none");
        } else {
            console.log("Already Visible");
        }
        // update the uid and btid parameters per main div
        $(thisDiv).attr("uid", restaurants[i].uid);
        $(thisDiv).attr("btid", restaurants[i].btid);
        
        $(".card-link").attr("uid", restaurants[i].uid);
        $(".card-link").attr("btid", restaurants[i].btid);
        

        // show / hide favorites icon on listing
        let thisFav = "#favorite-" + (i+1);
        if(restaurants[i].favorite == true) {
            $(thisFav).removeClass("display-none");
        } else {
            $(thisFav).addClass("display-none");
        }

        // update image
        let thisImgURL = "#restImga-" + (i+1);
        let thisImgSRC = "#restImage-" + (i+1);
        // $(thisImgURL).attr("href", "detailsView.html");
        $(thisImgSRC).attr("src", restaurants[(i+1)].photo);
        // update the uid and btid parameters per img
        $(thisImgSRC).attr("uid", restaurants[i].uid);
        $(thisImgSRC).attr("btid", restaurants[i].btid);

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
        let restLnk = "#titleLink-" + (i+1);
        // $(restLnk).attr("href", "detailsView.html");
        // update the uid and btid parameters per restaurant name
        $(restNm).attr("uid", restaurants[i].uid);
        $(restNm).attr("btid", restaurants[i].venue_id);

        // link the directions button 
        let mapbtn = "#mapitBtn-" + (i+1);
        $(mapbtn).attr("href",restaurants[i].mapsURL);

        // linkup the website
        let weblink = "#website-" + (i+1);
        let webspan = "#restWebsite-" + (i+1);
        $(weblink).attr("href", restaurants[i].website);
        $(webspan).html("Visit Website");
        }

        saveRestaurants(restaurants);

    }

// ************** HANDLE THE CLICK:  ************** //
let currentForecast = []
let currentRestaurant = []; 
let currRestIndex;
let currBTforecast = "";
let rName = "";
let rAddress = "";
let btURL = ""; 
let cardID = "";
console.log("BestTimeApp.io URL: " + btURL);

//Listen for click on the card click.
$(".card-link").click(function () {
    let cardUID = $(this).attr("uid");
    let cardBTID = $(this).attr("btid");
    console.log("cardUID: " + cardUID);
    // ************** FIND THE MATCHING RESTAURANT OBJECT:  ************** //
    restaurants.forEach(function(r) {
        if (r.uid == cardUID) {
            currRestIndex =  $(restaurants).index(r);
    // ************** POPULATE A CURRENTRESTAURANT VAR TO REFERENCE:  ************** //            
            currentRestaurant = restaurants[currRestIndex];
            rName = currentRestaurant.restaurantName;
            rAddress = currentRestaurant.address
            console.log("cardUID: " + cardUID);
            cardID = cardUID
            console.log("cardID: " + cardID);
            console.log("currentRestaurant Object: " + currentRestaurant);  
            localStorage.setItem("lsRestaurants", JSON.stringify(restaurants));
            localStorage.setItem("currentRestaurant", JSON.stringify(currentRestaurant));
        } 
    });
    // ************** FORECAST CHECK AND HANDLER:  ************** //            
            // Check for forecast in restaurants of matching uid
            // Generate a forecast if not - store in currentRestaurant object and update restaurant object
    if (restaurants[currRestIndex].btid == "") {
        // Run a forecast and store it in this object
        rName = restaurants[currRestIndex].restaurantName;
        console.log("Restaurant name (rName): " + rName);
        rAddress = restaurants[currRestIndex].address;
        console.log("Restaurant address (rAddress): " + rName);
        btURL = `${proxy_url}https://besttime.app/api/v1/forecasts?api_key_private=${priKey}&venue_name=${rName}&venue_address=${rAddress}`;
        console.log("BestTimeApp.io URL: " + btURL);
        let settings = {
            "url": btURL,
            "method": "POST"
        };
        $.ajax(settings).then(function (response) {
            console.log("BT Ajax call response: " + response);
            // log to a var currentBTforecast
            currBTforecast = response;
            localStorage.setItem("currBTforecast", JSON.stringify(currBTforecast));
            // ************** LOCAL OBJECT FORECAST VALUES UPDATER:  ************** //                    
            // update the btid key:value (aka, "k:v")
            restaurants[currRestIndex].btid = response.venue_info.venue_id;
            // update the btTimeZone k:v
            restaurants[currRestIndex].btTimeZone = response.venue_info.venue_timezone;
            // update the btName k:v
            restaurants[currRestIndex].btName = response.venue_info.venue_name;
            // update the btAddress k:v
            restaurants[currRestIndex].btAddress = response.venue_info.venue_address;
            // update the btMon0 k:v array
            restaurants[currRestIndex].btMon0.busy_hours = response.analysis[0].busy_hours;
            restaurants[currRestIndex].btMon0.day_max = response.analysis[0].day_info.day_max;
            restaurants[currRestIndex].btMon0.day_mean = response.analysis[0].day_info.day_mean;
            restaurants[currRestIndex].btMon0.day_rank_max = response.analysis[0].day_info.day_rank_max;
            restaurants[currRestIndex].btMon0.day_rank_mean = response.analysis[0].day_info.day_rank_mean;
            restaurants[currRestIndex].btMon0.venue_closed = response.analysis[0].day_info.venue_closed;
            restaurants[currRestIndex].btMon0.venue_open = response.analysis[0].day_info.venue_open;
            restaurants[currRestIndex].btMon0.hours_analysis.hour0_6AM_intensity_text = response.analysis[0].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour0_6AM_intensity_val = response.analysis[0].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour1_7AM_intensity_text = response.analysis[0].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour1_7AM_intensity_val = response.analysis[0].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour2_8AM_intensity_text = response.analysis[0].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour2_8AM_intensity_val = response.analysis[0].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour3_9AM_intensity_text = response.analysis[0].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour3_9AM_intensity_val = response.analysis[0].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour4_10AM_intensity_text = response.analysis[0].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour4_10AM_intensity_val = response.analysis[0].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour5_11AM_intensity_text = response.analysis[0].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour5_11AM_intensity_val = response.analysis[0].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour6_12PM_intensity_text = response.analysis[0].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour6_12PM_intensity_val = response.analysis[0].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour7_1PM_intensity_text = response.analysis[0].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour7_1PM_intensity_val = response.analysis[0].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour8_2PM_intensity_text = response.analysis[0].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour8_2PM_intensity_val = response.analysis[0].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour9_3PM_intensity_text = response.analysis[0].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour9_3PM_intensity_val = response.analysis[0].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour10_4PM_intensity_text = response.analysis[0].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour10_4PM_intensity_val = response.analysis[0].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour11_5PM_intensity_text = response.analysis[0].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour11_5PM_intensity_val = response.analysis[0].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour12_6PM_intensity_text = response.analysis[0].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour12_6PM_intensity_val = response.analysis[0].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour13_7PM_intensity_text = response.analysis[0].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour13_7PM_intensity_val = response.analysis[0].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour14_8PM_intensity_text = response.analysis[0].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour14_8PM_intensity_val = response.analysis[0].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour15_9PM_intensity_text = response.analysis[0].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour15_9PM_intensity_val = response.analysis[0].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour16_10PM_intensity_text = response.analysis[0].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour16_10PM_intensity_val = response.analysis[0].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour17_11PM_intensity_text = response.analysis[0].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour17_11PM_intensity_val = response.analysis[0].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour18_12AM_intensity_text = response.analysis[0].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour18_12AM_intensity_val = response.analysis[0].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour19_1AM_intensity_text = response.analysis[0].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour19_1AM_intensity_val = response.analysis[0].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour20_2AM_intensity_text = response.analysis[0].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour20_2AM_intensity_val = response.analysis[0].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour21_3AM_intensity_text = response.analysis[0].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour21_3AM_intensity_val = response.analysis[0].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour22_4AM_intensity_text = response.analysis[0].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour22_4AM_intensity_val = response.analysis[0].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btMon0.hours_analysis.hour23_5AM_intensity_text = response.analysis[0].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btMon0.hours_analysis.hour23_5AM_intensity_val = response.analysis[0].hour_analysis[23].intensity_nr;
        // update the btTue1 k:v array
            restaurants[currRestIndex].btTue1.busy_hours = response.analysis[1].busy_hours;
            restaurants[currRestIndex].btTue1.day_max = response.analysis[1].day_info.day_max;
            restaurants[currRestIndex].btTue1.day_mean = response.analysis[1].day_info.day_mean;
            restaurants[currRestIndex].btTue1.day_rank_max = response.analysis[1].day_info.day_rank_max;
            restaurants[currRestIndex].btTue1.day_rank_mean = response.analysis[1].day_info.day_rank_mean;
            restaurants[currRestIndex].btTue1.venue_closed = response.analysis[1].day_info.venue_closed;
            restaurants[currRestIndex].btTue1.venue_open = response.analysis[1].day_info.venue_open;
            restaurants[currRestIndex].btTue1.hours_analysis.hour0_6AM_intensity_text = response.analysis[1].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour0_6AM_intensity_val = response.analysis[1].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour1_7AM_intensity_text = response.analysis[1].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour1_7AM_intensity_val = response.analysis[1].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour2_8AM_intensity_text = response.analysis[1].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour2_8AM_intensity_val = response.analysis[1].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour3_9AM_intensity_text = response.analysis[1].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour3_9AM_intensity_val = response.analysis[1].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour4_10AM_intensity_text = response.analysis[1].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour4_10AM_intensity_val = response.analysis[1].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour5_11AM_intensity_text = response.analysis[1].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour5_11AM_intensity_val = response.analysis[1].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour6_12PM_intensity_text = response.analysis[1].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour6_12PM_intensity_val = response.analysis[1].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour7_1PM_intensity_text = response.analysis[1].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour7_1PM_intensity_val = response.analysis[1].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour8_2PM_intensity_text = response.analysis[1].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour8_2PM_intensity_val = response.analysis[1].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour9_3PM_intensity_text = response.analysis[1].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour9_3PM_intensity_val = response.analysis[1].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour10_4PM_intensity_text = response.analysis[1].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour10_4PM_intensity_val = response.analysis[1].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour11_5PM_intensity_text = response.analysis[1].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour11_5PM_intensity_val = response.analysis[1].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour12_6PM_intensity_text = response.analysis[1].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour12_6PM_intensity_val = response.analysis[1].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour13_7PM_intensity_text = response.analysis[1].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour13_7PM_intensity_val = response.analysis[1].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour14_8PM_intensity_text = response.analysis[1].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour14_8PM_intensity_val = response.analysis[1].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour15_9PM_intensity_text = response.analysis[1].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour15_9PM_intensity_val = response.analysis[1].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour16_10PM_intensity_text = response.analysis[1].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour16_10PM_intensity_val = response.analysis[1].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour17_11PM_intensity_text = response.analysis[1].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour17_11PM_intensity_val = response.analysis[1].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour18_12AM_intensity_text = response.analysis[1].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour18_12AM_intensity_val = response.analysis[1].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour19_1AM_intensity_text = response.analysis[1].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour19_1AM_intensity_val = response.analysis[1].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour20_2AM_intensity_text = response.analysis[1].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour20_2AM_intensity_val = response.analysis[1].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour21_3AM_intensity_text = response.analysis[1].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour21_3AM_intensity_val = response.analysis[1].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour22_4AM_intensity_text = response.analysis[1].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour22_4AM_intensity_val = response.analysis[1].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btTue1.hours_analysis.hour23_5AM_intensity_text = response.analysis[1].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btTue1.hours_analysis.hour23_5AM_intensity_val = response.analysis[1].hour_analysis[23].intensity_nr;
        // update the btWed2 k:v array
            restaurants[currRestIndex].btWed2.busy_hours = response.analysis[2].busy_hours;
            restaurants[currRestIndex].btWed2.day_max = response.analysis[2].day_info.day_max;
            restaurants[currRestIndex].btWed2.day_mean = response.analysis[2].day_info.day_mean;
            restaurants[currRestIndex].btWed2.day_rank_max = response.analysis[2].day_info.day_rank_max;
            restaurants[currRestIndex].btWed2.day_rank_mean = response.analysis[2].day_info.day_rank_mean;
            restaurants[currRestIndex].btWed2.venue_closed = response.analysis[2].day_info.venue_closed;
            restaurants[currRestIndex].btWed2.venue_open = response.analysis[2].day_info.venue_open;
            restaurants[currRestIndex].btWed2.hours_analysis.hour0_6AM_intensity_text = response.analysis[2].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour0_6AM_intensity_val = response.analysis[2].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour1_7AM_intensity_text = response.analysis[2].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour1_7AM_intensity_val = response.analysis[2].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour2_8AM_intensity_text = response.analysis[2].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour2_8AM_intensity_val = response.analysis[2].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour3_9AM_intensity_text = response.analysis[2].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour3_9AM_intensity_val = response.analysis[2].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour4_10AM_intensity_text = response.analysis[2].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour4_10AM_intensity_val = response.analysis[2].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour5_11AM_intensity_text = response.analysis[2].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour5_11AM_intensity_val = response.analysis[2].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour6_12PM_intensity_text = response.analysis[2].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour6_12PM_intensity_val = response.analysis[2].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour7_1PM_intensity_text = response.analysis[2].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour7_1PM_intensity_val = response.analysis[2].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour8_2PM_intensity_text = response.analysis[2].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour8_2PM_intensity_val = response.analysis[2].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour9_3PM_intensity_text = response.analysis[2].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour9_3PM_intensity_val = response.analysis[2].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour10_4PM_intensity_text = response.analysis[2].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour10_4PM_intensity_val = response.analysis[2].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour11_5PM_intensity_text = response.analysis[2].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour11_5PM_intensity_val = response.analysis[2].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour12_6PM_intensity_text = response.analysis[2].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour12_6PM_intensity_val = response.analysis[2].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour13_7PM_intensity_text = response.analysis[2].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour13_7PM_intensity_val = response.analysis[2].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour14_8PM_intensity_text = response.analysis[2].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour14_8PM_intensity_val = response.analysis[2].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour15_9PM_intensity_text = response.analysis[2].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour15_9PM_intensity_val = response.analysis[2].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour16_10PM_intensity_text = response.analysis[2].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour16_10PM_intensity_val = response.analysis[2].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour17_11PM_intensity_text = response.analysis[2].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour17_11PM_intensity_val = response.analysis[2].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour18_12AM_intensity_text = response.analysis[2].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour18_12AM_intensity_val = response.analysis[2].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour19_1AM_intensity_text = response.analysis[2].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour19_1AM_intensity_val = response.analysis[2].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour20_2AM_intensity_text = response.analysis[2].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour20_2AM_intensity_val = response.analysis[2].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour21_3AM_intensity_text = response.analysis[2].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour21_3AM_intensity_val = response.analysis[2].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour22_4AM_intensity_text = response.analysis[2].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour22_4AM_intensity_val = response.analysis[2].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btWed2.hours_analysis.hour23_5AM_intensity_text = response.analysis[2].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btWed2.hours_analysis.hour23_5AM_intensity_val = response.analysis[2].hour_analysis[23].intensity_nr;
        // update the btThu3 k:v array
            restaurants[currRestIndex].btThu3.busy_hours = response.analysis[3].busy_hours;
            restaurants[currRestIndex].btThu3.day_max = response.analysis[3].day_info.day_max;
            restaurants[currRestIndex].btThu3.day_mean = response.analysis[3].day_info.day_mean;
            restaurants[currRestIndex].btThu3.day_rank_max = response.analysis[3].day_info.day_rank_max;
            restaurants[currRestIndex].btThu3.day_rank_mean = response.analysis[3].day_info.day_rank_mean;
            restaurants[currRestIndex].btThu3.venue_closed = response.analysis[3].day_info.venue_closed;
            restaurants[currRestIndex].btThu3.venue_open = response.analysis[3].day_info.venue_open;
            restaurants[currRestIndex].btThu3.hours_analysis.hour0_6AM_intensity_text = response.analysis[3].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour0_6AM_intensity_val = response.analysis[3].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour1_7AM_intensity_text = response.analysis[3].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour1_7AM_intensity_val = response.analysis[3].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour2_8AM_intensity_text = response.analysis[3].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour2_8AM_intensity_val = response.analysis[3].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour3_9AM_intensity_text = response.analysis[3].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour3_9AM_intensity_val = response.analysis[3].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour4_10AM_intensity_text = response.analysis[3].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour4_10AM_intensity_val = response.analysis[3].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour5_11AM_intensity_text = response.analysis[3].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour5_11AM_intensity_val = response.analysis[3].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour6_12PM_intensity_text = response.analysis[3].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour6_12PM_intensity_val = response.analysis[3].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour7_1PM_intensity_text = response.analysis[3].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour7_1PM_intensity_val = response.analysis[3].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour8_2PM_intensity_text = response.analysis[3].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour8_2PM_intensity_val = response.analysis[3].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour9_3PM_intensity_text = response.analysis[3].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour9_3PM_intensity_val = response.analysis[3].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour10_4PM_intensity_text = response.analysis[3].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour10_4PM_intensity_val = response.analysis[3].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour11_5PM_intensity_text = response.analysis[3].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour11_5PM_intensity_val = response.analysis[3].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour12_6PM_intensity_text = response.analysis[3].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour12_6PM_intensity_val = response.analysis[3].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour13_7PM_intensity_text = response.analysis[3].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour13_7PM_intensity_val = response.analysis[3].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour14_8PM_intensity_text = response.analysis[3].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour14_8PM_intensity_val = response.analysis[3].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour15_9PM_intensity_text = response.analysis[3].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour15_9PM_intensity_val = response.analysis[3].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour16_10PM_intensity_text = response.analysis[3].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour16_10PM_intensity_val = response.analysis[3].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour17_11PM_intensity_text = response.analysis[3].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour17_11PM_intensity_val = response.analysis[3].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour18_12AM_intensity_text = response.analysis[3].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour18_12AM_intensity_val = response.analysis[3].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour19_1AM_intensity_text = response.analysis[3].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour19_1AM_intensity_val = response.analysis[3].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour20_2AM_intensity_text = response.analysis[3].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour20_2AM_intensity_val = response.analysis[3].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour21_3AM_intensity_text = response.analysis[3].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour21_3AM_intensity_val = response.analysis[3].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour22_4AM_intensity_text = response.analysis[3].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour22_4AM_intensity_val = response.analysis[3].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btThu3.hours_analysis.hour23_5AM_intensity_text = response.analysis[3].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btThu3.hours_analysis.hour23_5AM_intensity_val = response.analysis[3].hour_analysis[23].intensity_nr;
        // update the btFri4 k:v array
            restaurants[currRestIndex].btFri4.busy_hours = response.analysis[4].busy_hours;
            restaurants[currRestIndex].btFri4.day_max = response.analysis[4].day_info.day_max;
            restaurants[currRestIndex].btFri4.day_mean = response.analysis[4].day_info.day_mean;
            restaurants[currRestIndex].btFri4.day_rank_max = response.analysis[4].day_info.day_rank_max;
            restaurants[currRestIndex].btFri4.day_rank_mean = response.analysis[4].day_info.day_rank_mean;
            restaurants[currRestIndex].btFri4.venue_closed = response.analysis[4].day_info.venue_closed;
            restaurants[currRestIndex].btFri4.venue_open = response.analysis[4].day_info.venue_open;
            restaurants[currRestIndex].btFri4.hours_analysis.hour0_6AM_intensity_text = response.analysis[4].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour0_6AM_intensity_val = response.analysis[4].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour1_7AM_intensity_text = response.analysis[4].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour1_7AM_intensity_val = response.analysis[4].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour2_8AM_intensity_text = response.analysis[4].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour2_8AM_intensity_val = response.analysis[4].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour3_9AM_intensity_text = response.analysis[4].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour3_9AM_intensity_val = response.analysis[4].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour4_10AM_intensity_text = response.analysis[4].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour4_10AM_intensity_val = response.analysis[4].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour5_11AM_intensity_text = response.analysis[4].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour5_11AM_intensity_val = response.analysis[4].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour6_12PM_intensity_text = response.analysis[4].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour6_12PM_intensity_val = response.analysis[4].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour7_1PM_intensity_text = response.analysis[4].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour7_1PM_intensity_val = response.analysis[4].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour8_2PM_intensity_text = response.analysis[4].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour8_2PM_intensity_val = response.analysis[4].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour9_3PM_intensity_text = response.analysis[4].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour9_3PM_intensity_val = response.analysis[4].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour10_4PM_intensity_text = response.analysis[4].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour10_4PM_intensity_val = response.analysis[4].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour11_5PM_intensity_text = response.analysis[4].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour11_5PM_intensity_val = response.analysis[4].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour12_6PM_intensity_text = response.analysis[4].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour12_6PM_intensity_val = response.analysis[4].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour13_7PM_intensity_text = response.analysis[4].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour13_7PM_intensity_val = response.analysis[4].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour14_8PM_intensity_text = response.analysis[4].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour14_8PM_intensity_val = response.analysis[4].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour15_9PM_intensity_text = response.analysis[4].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour15_9PM_intensity_val = response.analysis[4].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour16_10PM_intensity_text = response.analysis[4].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour16_10PM_intensity_val = response.analysis[4].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour17_11PM_intensity_text = response.analysis[4].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour17_11PM_intensity_val = response.analysis[4].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour18_12AM_intensity_text = response.analysis[4].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour18_12AM_intensity_val = response.analysis[4].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour19_1AM_intensity_text = response.analysis[4].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour19_1AM_intensity_val = response.analysis[4].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour20_2AM_intensity_text = response.analysis[4].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour20_2AM_intensity_val = response.analysis[4].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour21_3AM_intensity_text = response.analysis[4].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour21_3AM_intensity_val = response.analysis[4].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour22_4AM_intensity_text = response.analysis[4].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour22_4AM_intensity_val = response.analysis[4].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btFri4.hours_analysis.hour23_5AM_intensity_text = response.analysis[4].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btFri4.hours_analysis.hour23_5AM_intensity_val = response.analysis[4].hour_analysis[23].intensity_nr;
        // update the btSat5 k:v array
            restaurants[currRestIndex].btSat5.busy_hours = response.analysis[5].busy_hours;
            restaurants[currRestIndex].btSat5.day_max = response.analysis[5].day_info.day_max;
            restaurants[currRestIndex].btSat5.day_mean = response.analysis[5].day_info.day_mean;
            restaurants[currRestIndex].btSat5.day_rank_max = response.analysis[5].day_info.day_rank_max;
            restaurants[currRestIndex].btSat5.day_rank_mean = response.analysis[5].day_info.day_rank_mean;
            restaurants[currRestIndex].btSat5.venue_closed = response.analysis[5].day_info.venue_closed;
            restaurants[currRestIndex].btSat5.venue_open = response.analysis[5].day_info.venue_open;
            restaurants[currRestIndex].btSat5.hours_analysis.hour0_6AM_intensity_text = response.analysis[5].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour0_6AM_intensity_val = response.analysis[5].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour1_7AM_intensity_text = response.analysis[5].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour1_7AM_intensity_val = response.analysis[5].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour2_8AM_intensity_text = response.analysis[5].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour2_8AM_intensity_val = response.analysis[5].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour3_9AM_intensity_text = response.analysis[5].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour3_9AM_intensity_val = response.analysis[5].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour4_10AM_intensity_text = response.analysis[5].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour4_10AM_intensity_val = response.analysis[5].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour5_11AM_intensity_text = response.analysis[5].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour5_11AM_intensity_val = response.analysis[5].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour6_12PM_intensity_text = response.analysis[5].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour6_12PM_intensity_val = response.analysis[5].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour7_1PM_intensity_text = response.analysis[5].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour7_1PM_intensity_val = response.analysis[5].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour8_2PM_intensity_text = response.analysis[5].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour8_2PM_intensity_val = response.analysis[5].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour9_3PM_intensity_text = response.analysis[5].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour9_3PM_intensity_val = response.analysis[5].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour10_4PM_intensity_text = response.analysis[5].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour10_4PM_intensity_val = response.analysis[5].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour11_5PM_intensity_text = response.analysis[5].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour11_5PM_intensity_val = response.analysis[5].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour12_6PM_intensity_text = response.analysis[5].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour12_6PM_intensity_val = response.analysis[5].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour13_7PM_intensity_text = response.analysis[5].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour13_7PM_intensity_val = response.analysis[5].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour14_8PM_intensity_text = response.analysis[5].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour14_8PM_intensity_val = response.analysis[5].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour15_9PM_intensity_text = response.analysis[5].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour15_9PM_intensity_val = response.analysis[5].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour16_10PM_intensity_text = response.analysis[5].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour16_10PM_intensity_val = response.analysis[5].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour17_11PM_intensity_text = response.analysis[5].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour17_11PM_intensity_val = response.analysis[5].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour18_12AM_intensity_text = response.analysis[5].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour18_12AM_intensity_val = response.analysis[5].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour19_1AM_intensity_text = response.analysis[5].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour19_1AM_intensity_val = response.analysis[5].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour20_2AM_intensity_text = response.analysis[5].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour20_2AM_intensity_val = response.analysis[5].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour21_3AM_intensity_text = response.analysis[5].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour21_3AM_intensity_val = response.analysis[5].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour22_4AM_intensity_text = response.analysis[5].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour22_4AM_intensity_val = response.analysis[5].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btSat5.hours_analysis.hour23_5AM_intensity_text = response.analysis[5].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btSat5.hours_analysis.hour23_5AM_intensity_val = response.analysis[5].hour_analysis[23].intensity_nr;
            // update the btSun6 k:v array
            restaurants[currRestIndex].btSun6.busy_hours = response.analysis[6].busy_hours;
            restaurants[currRestIndex].btSun6.day_max = response.analysis[6].day_info.day_max;
            restaurants[currRestIndex].btSun6.day_mean = response.analysis[6].day_info.day_mean;
            restaurants[currRestIndex].btSun6.day_rank_max = response.analysis[6].day_info.day_rank_max;
            restaurants[currRestIndex].btSun6.day_rank_mean = response.analysis[6].day_info.day_rank_mean;
            restaurants[currRestIndex].btSun6.venue_closed = response.analysis[6].day_info.venue_closed;
            restaurants[currRestIndex].btSun6.venue_open = response.analysis[6].day_info.venue_open;
            restaurants[currRestIndex].btSun6.hours_analysis.hour0_6AM_intensity_text = response.analysis[6].hour_analysis[0].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour0_6AM_intensity_val = response.analysis[6].hour_analysis[0].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour1_7AM_intensity_text = response.analysis[6].hour_analysis[1].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour1_7AM_intensity_val = response.analysis[6].hour_analysis[1].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour2_8AM_intensity_text = response.analysis[6].hour_analysis[2].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour2_8AM_intensity_val = response.analysis[6].hour_analysis[2].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour3_9AM_intensity_text = response.analysis[6].hour_analysis[3].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour3_9AM_intensity_val = response.analysis[6].hour_analysis[3].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour4_10AM_intensity_text = response.analysis[6].hour_analysis[4].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour4_10AM_intensity_val = response.analysis[6].hour_analysis[4].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour5_11AM_intensity_text = response.analysis[6].hour_analysis[5].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour5_11AM_intensity_val = response.analysis[6].hour_analysis[5].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour6_12PM_intensity_text = response.analysis[6].hour_analysis[6].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour6_12PM_intensity_val = response.analysis[6].hour_analysis[6].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour7_1PM_intensity_text = response.analysis[6].hour_analysis[7].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour7_1PM_intensity_val = response.analysis[6].hour_analysis[7].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour8_2PM_intensity_text = response.analysis[6].hour_analysis[8].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour8_2PM_intensity_val = response.analysis[6].hour_analysis[8].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour9_3PM_intensity_text = response.analysis[6].hour_analysis[9].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour9_3PM_intensity_val = response.analysis[6].hour_analysis[9].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour10_4PM_intensity_text = response.analysis[6].hour_analysis[10].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour10_4PM_intensity_val = response.analysis[6].hour_analysis[10].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour11_5PM_intensity_text = response.analysis[6].hour_analysis[11].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour11_5PM_intensity_val = response.analysis[6].hour_analysis[11].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour12_6PM_intensity_text = response.analysis[6].hour_analysis[12].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour12_6PM_intensity_val = response.analysis[6].hour_analysis[12].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour13_7PM_intensity_text = response.analysis[6].hour_analysis[13].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour13_7PM_intensity_val = response.analysis[6].hour_analysis[13].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour14_8PM_intensity_text = response.analysis[6].hour_analysis[14].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour14_8PM_intensity_val = response.analysis[6].hour_analysis[14].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour15_9PM_intensity_text = response.analysis[6].hour_analysis[15].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour15_9PM_intensity_val = response.analysis[6].hour_analysis[15].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour16_10PM_intensity_text = response.analysis[6].hour_analysis[16].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour16_10PM_intensity_val = response.analysis[6].hour_analysis[16].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour17_11PM_intensity_text = response.analysis[6].hour_analysis[17].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour17_11PM_intensity_val = response.analysis[6].hour_analysis[17].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour18_12AM_intensity_text = response.analysis[6].hour_analysis[18].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour18_12AM_intensity_val = response.analysis[6].hour_analysis[18].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour19_1AM_intensity_text = response.analysis[6].hour_analysis[19].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour19_1AM_intensity_val = response.analysis[6].hour_analysis[19].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour20_2AM_intensity_text = response.analysis[6].hour_analysis[20].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour20_2AM_intensity_val = response.analysis[6].hour_analysis[20].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour21_3AM_intensity_text = response.analysis[6].hour_analysis[21].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour21_3AM_intensity_val = response.analysis[6].hour_analysis[21].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour22_4AM_intensity_text = response.analysis[6].hour_analysis[22].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour22_4AM_intensity_val = response.analysis[6].hour_analysis[22].intensity_nr;
            restaurants[currRestIndex].btSun6.hours_analysis.hour23_5AM_intensity_text = response.analysis[6].hour_analysis[23].intensity_txt;
            restaurants[currRestIndex].btSun6.hours_analysis.hour23_5AM_intensity_val = response.analysis[6].hour_analysis[23].intensity_nr;
            currentRestaurant = restaurants[currRestIndex];
            localStorage.setItem("currentRestaurant", JSON.stringify(currentRestaurant));      
                   
        });
        console.log(currBTforecast);
        localStorage.setItem("lsRestaurants", JSON.stringify(restaurants));
    } else { 
        console.log("Already been forecasted"); 
        currBTforecast = localStorage.getItem(JSON.parse("currBTforecast"));
    }
    // window.location = "../HTML/detailsView.html";
    window.open("../HTML/detailsView.html", "_blank");
    localStorage.setItem("lsRestaurants", JSON.stringify(restaurants));
});

function saveRestaurants(r) {
// ************** FIREBASE SCRIPT ************** //
// saveRestaurants(); 
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
    console.log('FIREBASE', firebase);
    var database = firebase.database();
saveRestaurants();
    
            // restaurants.forEach(function (restaurant) {
            r = 2;
            database.ref('restaurants/').set("restaurants");
            // })
            console.log('RESTAURANTS', restaurants);
            setTimeout(() => {
                database.ref('restaurants').once('value').then(function (snapshot) {
                    var restaurants = (snapshot.val() && snapshot.val().restaurants) || 'Anonymous';
                    console.log(restaurants);
                });
            }, 2000);
        }
    // database.ref('/restaurants/').set(null, function(error) {
        // if (error) {
            // console.log("FB write failed");// The write failed...
        // } else {
            // console.log("Data saved successfully"); // Data saved successfully!
        // }
    // });           