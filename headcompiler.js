/* 
* FILE: headcompiler.js script
* -- NOTE ON LOOPING FUNCTION: Do not edit the function below the comment: "Do not edit below this point"
* -- NOTE ON "scriptLinks" ARRAY: Only edit the arry by adding addition CSS or JS items below the comment "BELOW THIS POINT, PLACE ANY CUSTOM...".
*   -- If adding CSS to the bottom of the custom css additions section, please be sure to add a comma "," after the added stylesheet item.
*   -- If adding js to the bottom of the custom js additions section, please do NOT add a comma after the last item in the array.
*/


/* Array of stylesheet links and script tags to include in the <head> of the pages, in order of how they'll be added  */

const scriptLinks = [
    // -- CSS LINKS IN ORDER THEY'LL BE ADDED TO THE HEAD --------------------------------------------------//
    {name: 'Bulma 0.9.0 CSS', type: 'css', cdn: 'https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css'},
    {name: 'Materialize 1.0.0 CSS', type: 'css', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'},
    {name: 'Matarial Icons for Materialize', type: 'css', cdn: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
    {name: 'UIKit 3.5.4 CSS', type: 'css', cdn: 'https://cdn.jsdelivr.net/npm/uikit@3.5.4/dist/css/uikit.min.css' },
    
    // CUSTOM CSS ADDITIONS SECTION:
    // BELOW THIS POINT, PLACE ANY CUSTOM LINKS/STYLESHEETS THAT SHOULD ADDED TO THE HEAD LAST .... 
    {name: 'createAccount.css', type: 'css', cdn: 'createAccount.css'},
    {name: 'detailsView.css', type: 'css', cdn: 'detailsView.css'},
    
    // -------------------------------*** END OF CSS STYLESHEETS ***---------------------------------------//

    // -- JS SCRIPTS IN ORDER THEY'LL BE ADDED TO THE HEAD ----------------------------------------------- //
    {name: 'Font Awesome 5.3.1 JavaScript', type: 'js', cdn: 'https://use.fontawesome.com/releases/v5.3.1/js/all.js'}, // for icons in Bulma 
    {name: 'Materialize 1.0.0 JavaScript', type: 'js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js'},
    {name: 'UIKit 3.5.4 Main JavasScript', type: 'js', cdn: 'https://cdn.jsdelivr.net/npm/uikit@3.5.4/dist/js/uikit.min.js'},
    {name: 'UIKit 3.5.4 Icons Javascript', type: 'js', cdn: 'https://cdn.jsdelivr.net/npm/uikit@3.5.4/dist/js/uikit-icons.min.js'},
    {name: 'JQuery 3.5.1 JavaScript', type: 'js', cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'}, 
    {name: 'Echarts.js 4.8.0 Common Javascript', type: 'js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.8.0/echarts-en.common.min.js'},
    {name: 'Echarts.js 4.8.0 En JavaScript', type: 'js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.8.0/echarts-en.min.js'},
    {name: 'GreenSock.js 3.3.4 JavaScript', type: 'js', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js'},
    
    // CUSTOM JS ADDITIONS SECTION:
    // BELOW THIS POINT, PLACE ANY CUSTOM SCRIPTS THAT SHOULD ADDED TO THE HEAD LAST ....
    {name: 'utilityNav.js', type: 'js', cdn: 'utilityNav.js'}

    // -------------------------------*** END OF JS SCRIPTS ***------------------------------------------- //
];



// -- DO NOT EDIT BELOW THIS POINT. ---------------------------------------------------------------------- // 

/* if the following is added to the page head: ...
    <script type="text/javascript" src="headcompiler.js"></script> 
    ...then the following autoruns on page load and adds the stylesheet links and scripts in order based on the above "scriptLinks" array.  */

scriptLinks.forEach( function(newLink) { // loops through the "scriptLinks" array and for each item...
    if (newLink.type == 'css') { // ...if the "type" key is "css" ...
        let link = document.createElement('link');  // ... create a new "link" element...
        link.rel = "stylesheet"; // ... add a rel attribute of "stylesheet" ...
        link.href = newLink.cdn;  // ... add a href attribute equal to the "cdn" value of the item ...
        document.head.appendChild(link); // ... and then adds the newly created "link" element to the bottom of the document <head>
    } else if (newLink.type == 'js') { // ... Otherwise, if the "type" key is "js" ...
        let script = document.createElement('script');  // ... create a new "script" element ...
        script.src = newLink.cdn; // ... add a src attribute equal to the "cdn" value of the item ...
        document.head.appendChild(script); // ... and then adds the newly created "script" element to the bottom of the document <head>
    }
});