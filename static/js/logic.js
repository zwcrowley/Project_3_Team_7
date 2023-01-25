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

// Alt api from opendatasoft.com:
// let geoData2 = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-county-boundaries&q=&rows=3233"

// Load the hv_risk data.
let hv_risk = "https://team-7-proj3-map.onrender.com/api/v1.0/home_value_risk_data";

console.log("hv_risk", hv_risk);

// d3.json(hv_risk).then(function(hv_risk) { 
  //   console.log("hv_risk", hv_risk)      
  // });

let geojson;

// API call
d3.json("http://127.0.0.1:5000/api/v1.0/home_value_risk_data").then(function(hv_risk) {
  console.log("hv_risk", hv_risk)          

});   

//   // Create a new choropleth layer.
//   geojson = L.choropleth(geo_data, {


//   // Define which property in the features to using a function for a hv_risk data source.
//   valueProperty:function(feature) {
//     return home_data.filter(home => home.name = feature.properties.NAME)[0].risk_index_score
//    } ,

//   //   valueProperty:function(feature) {
//   //     return home_data.filter(home => home).risk_index_score
//   //   } ,
    
    
//   //   // // Define which property in the features to use.
//   //   // valueProperty: "DP03_16E",

//   // Set the color scale.
//   scale: ["#ffffb2", "#b10026"],

//   // The number of breaks in the step range
//   steps: 10,

//   // q for quartile, e for equidistant, k for k-means
//   mode: "q",
//   style: {
//   // Border color
//   color: "#fff",
//   weight: 1,
//   fillOpacity: 0.8
//   },

//   //   // Binding a popup to each layer
//   //   // onEachFeature: function(feature, layer) {
//   //   //   layer.bindPopup("<strong>" + feature.properties.NAME + "</strong><br /><br />Estimated employed population with children age 6-17: " +
//   //   //     feature.properties.DP03_16E + "<br /><br />Estimated Total Income and Benefits for Families: $" + feature.properties.DP03_75E);
//   //   // }
//   // }).addTo(myMap);

//   // // Set up the legend.
//   // let legend = L.control({ position: "bottomright" });
//   // legend.onAdd = function() {
//   //   let div = L.DomUtil.create("div", "info legend");
//   //   let limits = geojson.options.limits;
//   //   let colors = geojson.options.colors;
//   //   let labels = [];

//   //   // Add the minimum and maximum.
//   //   let legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
//   //     "<div class=\"labels\">" +
//   //       "<div class=\"min\">" + limits[0] + "</div>" +
//   //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//   //     "</div>";

//   //   div.innerHTML = legendInfo;

//   //   limits.forEach(function(limit, index) {
//   //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   //   });

//   //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   //   return div;
//   // };

//   // Adding the legend to the map
//   // legend.addTo(myMap);
//      });
// });  
