// FIND PLACE FROM TEXT (ZIPCODE):

let restaurants = []; // THIS is our original restaurants array that will be fully populated after the ajax call.  We'll use this for populating the page content.
let initialZip = "27408"; // This is the initial zip code we'll use for the very 1st AJAX call to grab the coordinates.
let currentQuery = []; // This is the first populated current query array that houses all the Google NearBy results
let currentQuery2 = []; // This is the 2nd, more defined current query array that contains all available data from currentQuery as well as specific values we couldn't get without a specific search per result.

// Google Key
const key = "AIzaSyD9zrHku8yPl0RU8P1IVNyfAq5YYfqj4Eg"
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
            let operatingHours = placeSearchFields.result.opening_hours.periods;
            let openTime = placeSearchFields.result.opening_hours.weekday_text; // console.log(openTime);
            let restaurantName = placeSearchFields.result.name; // console.log(restaurantName);
            let openStatus = placeSearchFields.result.opening_hours.open_now; // console.log(openStatus);
            let price_level = placeSearchFields.result.price_level; // console.log(price_level);
            let rating = placeSearchFields.result.rating; // console.log(rating);
            let address = placeSearchFields.result.formatted_address; // console.log(address);
            let locationLat = placeSearchFields.result.geometry.location.lat; // console.log(locationLat);
            let locationLon = placeSearchFields.result.geometry.location.lng; // console.log(locationLon);
            let viewportNElat = placeSearchFields.result.geometry.viewport.northeast.lat; // console.log(viewportNElat);
            let viewportNElon = placeSearchFields.result.geometry.viewport.northeast.lng; // console.log(viewportNElon);
            let viewportSWlat = placeSearchFields.result.geometry.viewport.southwest.lat; // console.log(viewportSWlat);
            let viewportSWlon = placeSearchFields.result.geometry.viewport.southwest.lon; // console.log(viewportSWlon);
            currentQuery2[i] = {
                "uid": placeID,
                "btid": "", // From BT: venue_info.venue_id
                "phoneNum": phoneNum,
                "website": website,
                "mapsURL": mapsURL,
                "btTimeZone" : "", // From BT: venue_info.venue_timezone 
                "operatingHours": operatingHours,
                "openTime": openTime,
                "restaurantName": restaurantName,
                "btName": "", // From BT: venue_info.venue_name
                "openStatus": openStatus,
                "price_level": price_level,
                "rating": rating,
                "address": address,
                "btAddress": "", // From BT: venue_info.venue_address
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
                    "busy_hours" : "", // From BT: analysis.0.busy_hours
                    "day_code" : 0, 
                    "day_max" : "", // From BT: analysis.0.day_info.day_max
                    "day_mean" : "", // From BT: analysis.0.day_info.day_mean
                    "day_rank_max" : "", // From BT: analysis.0.day_info.day_rank_max
                    "day_rank_mean" : "", // From BT: analysis.0.day_info.day_rank_mean
                    "day_text" : "Monday",
                    "venue_closed" : "", // From BT: analysis.0.day_info.venue_closed
                    "venue_open" : "", // From BT: analysis.0.day_info.venue_open
                    "hours_analysis" : {
                        "hour0_6AM_24" : 6,
                        "hour0_6AM_12" : 6,
                        "hour0_6AM_AMPM" : "AM",
                        "hour0_6AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.0.intensity_txt
                        "hour0_6AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.0.intensity_nr
                        "hour1_7AM_24" : 7,
                        "hour1_7AM_12" : 7,
                        "hour1_7AM_AMPM" : "AM",
                        "hour1_7AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.1.intensity_txt
                        "hour1_7AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.1.intensity_nr
                        "hour2_8AM_24" : 8,
                        "hour2_8AM_12" : 8,
                        "hour2_8AM_AMPM" : "AM",
                        "hour2_8AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.2.intensity_txt
                        "hour2_8AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.2.intensity_nr
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
                        "hour9_3PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.8.intensity_txt
                        "hour9_3PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.8.intensity_nr
                        "hour10_4PM_24" : 16,
                        "hour10_4PM_12" : 4,
                        "hour10_4PM_AMPM" : "PM",
                        "hour10_4PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.9.intensity_txt
                        "hour10_4PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.9.intensity_nr
                        "hour11_5PM_24" : 17,
                        "hour11_5PM_12" : 5,
                        "hour11_5PM_AMPM" : "PM",
                        "hour11_5PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.10.intensity_txt
                        "hour11_5PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.10.intensity_nr
                        "hour12_6PM_24" : 18,
                        "hour12_6PM_12" : 6,
                        "hour12_6PM_AMPM" : "PM",
                        "hour12_6PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.11.intensity_txt
                        "hour12_6PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.11.intensity_nr
                        "hour13_7PM_24" : 19,
                        "hour13_7PM_12" : 7,
                        "hour13_7PM_AMPM" : "PM",
                        "hour13_7PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.12.intensity_txt
                        "hour13_7PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.12.intensity_nr
                        "hour14_8PM_24" : 20,
                        "hour14_8PM_12" : 8,
                        "hour14_8PM_AMPM" : "PM",
                        "hour14_8PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.13.intensity_txt
                        "hour14_8PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.13.intensity_nr
                        "hour15_9PM_24" : 21,
                        "hour15_9PM_12" : 9,
                        "hour15_9PM_AMPM" : "PM",
                        "hour15_9PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.14.intensity_txt
                        "hour15_9PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.14.intensity_nr
                        "hour16_10PM_24" : 22,
                        "hour16_10PM_12" : 10,
                        "hour16_10PM_AMPM" : "PM",
                        "hour16_10PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.15.intensity_txt
                        "hour16_10PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.15.intensity_nr
                        "hour17_11PM_24" : 23,
                        "hour17_11PM_12" : 11,
                        "hour17_11PM_AMPM" : "PM",
                        "hour17_11PM_intensity_text" : "", // From BT: analysis.0.hour_analysis.16.intensity_txt
                        "hour17_11PM_intensity_val" : "", // From BT: analysis.0.hour_analysis.16.intensity_nr
                        "hour18_12AM_24" : 24,
                        "hour18_12AM_12" : 12,
                        "hour18_12AM_AMPM" : "AM",
                        "hour18_12AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.17.intensity_txt
                        "hour18_12AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.17.intensity_nr
                        "hour19_1AM_24" : 1,
                        "hour19_1AM_12" : 1,
                        "hour19_1AM_AMPM" : "AM",
                        "hour19_1AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.18.intensity_txt
                        "hour19_1AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.18.intensity_nr
                        "hour20_2AM_24" : 2,
                        "hour20_2AM_12" : 2,
                        "hour20_2AM_AMPM" : "AM",
                        "hour20_2AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.19.intensity_txt
                        "hour20_2AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.19.intensity_nr
                        "hour21_3AM_24" : 3,
                        "hour21_3AM_12" : 3,
                        "hour21_3AM_AMPM" : "AM",
                        "hour21_3AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.20.intensity_txt
                        "hour21_3AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.20.intensity_nr
                        "hour22_4AM_24" : 4,
                        "hour22_4AM_12" : 4,
                        "hour22_4AM_AMPM" : "AM",
                        "hour22_4AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.21.intensity_txt
                        "hour22_4AM_intensity_val" : "", // From BT: analysis.0.hour_analysis.21.intensity_nr
                        "hour23_5AM_24" : 5,
                        "hour23_5AM_12" : 5,
                        "hour23_5AM_AMPM" : "AM",
                        "hour23_5AM_intensity_text" : "", // From BT: analysis.0.hour_analysis.22.intensity_txt
                        "hour23_5AM_intensity_val" : "" // From BT: analysis.0.hour_analysis.22.intensity_nr
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
        $(thisDiv).attr("btid", restaurants[i].venue_id);

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
        $(thisImgURL).attr("href", "detailsView.html");
        $(thisImgSRC).attr("src", restaurants[(i+1)].photo);

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
        $(restLnk).attr("href", "detailsView.html");

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

// ************** CREATE DETAILS PAGE SCRIPT ************** //

//Listen for click on the card click.
$(".restaurant-card .card-link").on("click", function() {
    console.log("clicked on:" + $(this).html());
})

//Create a new currentRestaurant object
//Check for forecast in restaurants of matching uid
// Generate a forecast if not - store in currentRestaurant object and update restaurant object
// Write the page based on the data in the object





// ************** FIREBASE SCRIPT ************** //
saveRestaurants(restaurants); //!
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
    // for(i=0; i<700; i++) {
    database.ref('restaurants/').set('restaurants/', null);
// restaurants.forEach(function (restaurant) {
    // database.ref('/restaurants/').set(null, function(error) {
        // if (error) {
            // console.log("FB write failed");// The write failed...
        // } else {
            // console.log("Data saved successfully"); // Data saved successfully!
        // }
    // });           
}

    console.log('RESTAURANTS', restaurants);
// function saveRestaurants(restaurants) {
//     restaurants.forEach(function (restaurant) {
//         database.ref('restaurants/').update(restaurant);
//     })
//     console.log('RESTAURANTS', restaurants);
//     setTimeout(() => {
//         database.ref('restaurants').once('value').then(function (snapshot) {
//             var restaurants = (snapshot.val() && snapshot.val().restaurants) || 'Anonymous';
//             console.log(restaurants);
//         });
//     }, 2000);
// }
