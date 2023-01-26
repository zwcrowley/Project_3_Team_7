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

// // Logan Powell github link
// let geoJSON_github_LP = "https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/500k/2021/county.json"


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
// Set colors for choropleth:
var lowColor = 'white'
var highColor = 'red'

let geojson;
// d3 call to github for hv_risk data:
d3.csv(hv_risk_github).then(function(hv_risk) {
  console.log("hv_risk", hv_risk)
  var dataArray = [];
	for (var d = 0; d < hv_risk.length; d++) {
		dataArray.push(parseFloat(hv_risk[d].risk_index_score))
	}
  // Pick out the min value in the risk index array:
	var minVal = d3.min(dataArray)
	var maxVal = d3.max(dataArray)
	var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor])
  console.log("minVal risk_index_score", minVal)
  console.log("maxVal risk_index_score", maxVal)
  console.log("ramp", ramp)


  // d3 call to github for geo_data data:
  d3.json(geoJSON_github).then(function(geo_data) {
    console.log("geo_data", geo_data)
    // Loop through each state data value in the .csv file
    for (var i = 0; i < hv_risk.length; i++) {
      // Grab state_county_FIPS Name
      var data_FIPS = hv_risk.state_county_FIPS;
      // Grab data value 
      var dataValue = parseFloat(hv_risk[i].risk_index_score); 
      // console.log("dataValue", dataValue, i)

      // Find the corresponding state_county_FIPS inside the GeoJSON
      for (var j = 0; j < geo_data.features.length; j++) {
        var json_FIPS = geo_data.features[j].properties.state_county_FIPS;
        // If the fips matches in both datasets:
        if (data_FIPS = json_FIPS) {
          // Copy the data value into the JSON
          geo_data.features[j].properties.risk_index_score = dataValue || null;
          // console.log("geo_data.features[j].properties.risk_index_score", geo_data.features[0].properties, i)
          // Stop looking through the JSON 
          break;
        }
      }
    }
    // console.log("geo_data.features[j].properties.risk_index_score", geo_data.features[0].properties)

  // Create a new choropleth layer.
  geojson = L.choropleth(geo_data, {
    valueProperty: 'risk_index_score',

    // Define which property in the features to using a function for a hv_risk data source:
    // valueProperty:hv_risk.forEach((home, index) => {
    //   // console.log("home.state_county_FIPS", home.state_county_FIPS, index)
    //   // console.log("geo_data.feat", geo_data.features[index].properties.state_county_FIPS, index)
    // if (home.state_county_FIPS = geo_data.features[index].properties.state_county_FIPS) {
    //     // console.log("home.risk_index_score", home.risk_index_score, index)
        
    //     return home.risk_index_score
      
    //   }
    // }),

    // Set the color scale.
    scale: ['white', 'red'],
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

    // // Set up Colors:
    // var myStyle = {
    //   "color": "#ff6a00",
    //   "weight": 2 
    // };
  
    // // Set up the lines for the tectonic plates, use the style and set geoJSON tectonic plates data:
    // L.geoJSON(geo_data, { 
    //   style: myStyle
    //   }).addTo(myMap);	 
 
  });
}); 

