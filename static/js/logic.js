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
  // Create a new choropleth layer.
  geojson = L.choropleth(geo_data, {

    // Define which property in the features to using a function for a hv_risk data source.
    valueProperty:function(feature) {
      return hv_risk.filter(home => home.state_county_FIPS = feature.properties.state_county_FIPS).risk_index_score;  
    } ,

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

    // // Set up the legend.
    // let legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    //   let div = L.DomUtil.create("div", "info legend");
    //   let limits = geojson.options.limits;
    //   let colors = geojson.options.colors;
    //   let labels = [];

    //   // Add the minimum and maximum.
    //   let legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
    //     "<div class=\"labels\">" +
    //       "<div class=\"min\">" + limits[0] + "</div>" +
    //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //     "</div>";

    //   div.innerHTML = legendInfo;

    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });

    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //   return div;
    // };

    // Adding the legend to the map
    // legend.addTo(myMap);
      });
    }); 

