// Creating the map object
var myMap = L.map("map", {
  center: [39.8283, -98.5795], 
  zoom: 5, 
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
let geoData = "https://team-7-proj3-map.onrender.com/api/v1.0/county_bounds_data";

// Load the hv_risk data.
let hv_risk = "https://team-7-proj3-map.onrender.com/api/v1.0/home_value_risk_data";

// Github links:
// geoJSON of counties:
let geoJSON_github = "https://raw.githubusercontent.com/zwcrowley/Project_3_Team_7/main/output/us_county_bounds_new.json"

// Github links:
let hv_risk_github = "https://raw.githubusercontent.com/zwcrowley/Project_3_Team_7/main/output/hv_risk_df.csv"


// Alt api from opendatasoft.com:
// let geoData2 = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-county-boundaries&q=&rows=3233"


// Got this to work from gitub repo:
// d3.json(geoJSON_github).then(function(geo_data) { 
//     console.log("geo_data", geo_data) 
//     // Set up Colors:
//     var myStyle = {
//       "color": "#ff6a00",
//       "weight": 2 
//     };
  
//     // Set up the lines for the tectonic plates, use the style and set geoJSON tectonic plates data:
//     L.geoJSON(geo_data, { 
//       style: myStyle
//       }).addTo(myMap);	  

//   }); 

let geojson;
// d3 call to github:
d3.json(geoJSON_github).then(function(geo_data) {
  console.log("geo_data", geo_data)

  d3.csv(hv_risk_github).then(function(hv_risk) {
    console.log("hv_risk", hv_risk)
    console.log("risk score", hv_risk.risk_index_score)
  // Create a new choropleth layer.
  geojson = L.choropleth(geo_data, {

    // Define which property in the features to using a function for a hv_risk data source.
    // valueProperty:function(feature, index) {
    //   return hv_risk.filter(home => home.state_county_FIPS = feature.properties.state_county_FIPS)[index].risk_index_score;  
    // } ,

    valueProperty:hv_risk[0].risk_index_score,

    // Set the color scale.
    scale: ["#ffffb2", "#b10026"],

    // The number of breaks in the step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
    },

    //   // Binding a popup to each layer
    //   // onEachFeature: function(feature, layer) {
    //   //   layer.bindPopup("<strong>" + feature.properties.NAME + "</strong><br /><br />Estimated employed population with children age 6-17: " +
    //   //     feature.properties.DP03_16E + "<br /><br />Estimated Total Income and Benefits for Families: $" + feature.properties.DP03_75E);
    //   // }
    }).addTo(myMap);
 
  });
}); 

