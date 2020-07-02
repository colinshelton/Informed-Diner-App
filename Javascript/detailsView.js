const proxy_url = "https://cors-anywhere.herokuapp.com/";
let BTurl = "https://besttime.app/api/v1/forecasts/weekoverview";
const final_url = proxy_url + BTurl;

let settings = {
  url: final_url,
  data: {
    api_key_private: "pri_92300646b81c4c1faeb17dfe06390a91",
    venue_name: "P.F. Chang's",
    venue_address: "3338 W Friendly Ave, Greensboro, NC 27410, USA",
  },
  method: "GET",
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
