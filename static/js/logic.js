// Creating the map object
var myMap = L.map("map", {
  center: [36, -96],
  zoomDelta: 0.2, // Sets the zoom per click 
  zoomSnap: 0.1,  // Sets the zoom increments 
  zoom: 4.7
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


// Set up a var for the choropleth map:
let geojson;

// d3 call to github for hv_risk data- csv:
d3.csv(hv_risk_github).then(function(hv_risk) {
  console.log("hv_risk", hv_risk)
  makeBarChart(hv_risk)

  // d3 call to github for geo_data data- json:
  d3.json(geoJSON_github).then(function(geo_data) {
    console.log("geo_data", geo_data)

    // Loop through each state data value in the .csv file
    for (var i = 0; i < hv_risk.length; i++) {
      // Grab state_county_FIPS Name
      var data_FIPS = hv_risk[i].state_county_FIPS;
      // Grab data value 
      var dataValue = parseFloat(hv_risk[i].risk_index_score); 
      // Nested for loop that goes throught the geo_data json:
      // Find the corresponding state_county_FIPS inside the GeoJSON
      for (var j = 0; j < geo_data.features.length; j++) {
        var json_FIPS = geo_data.features[j].properties.state_county_FIPS;
        // If the fips matches in both datasets:
        if (data_FIPS == json_FIPS) {
          // Copy the data value into the JSON
          geo_data.features[j].properties.risk_index_score = dataValue;
          // Stop looking through the JSON
          break;  
        }
      }
    }
    
    // console.log("geo_data.features[j].properties.risk_index_score", geo_data.features[0].properties.risk_index_score)
    // console.log("dataValue", dataValue, i)

    // Create a new choropleth layer.
    geojson = L.choropleth(geo_data, {
      // Set the color based on the risk_index_score:
      valueProperty: 'risk_index_score',
      // Set the color scale.
      scale: ['white', 'red'],
      // The number of breaks in the step range
      steps: 20,
      // q for quartile, e for equidistant, k for k-means
      // ASK WHAT IS BEST FOR THIS:::::
      mode: "k",   
      style: {
      // Border color
      color: "#4d4d4d", 
      weight: 1,
      fillOpacity: 0.8
      },
        // Binding a popup to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup("County Name: <strong>" + feature.properties.NAME + "</strong><br /><br />Risk Index Score: " +
          parseFloat(feature.properties.risk_index_score).toFixed(2));
        } 
      }).addTo(myMap); // end of choropleth layer function

      // Set up the legend:
      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h1>National Risk Index Score</h1>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
        // Add legend to the html:
        div.innerHTML = legendInfo;
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
      // Adding the legend to the map
      legend.addTo(myMap);
  
  }); // end of d3 call to github for hv_risk data- csv:

}); // end of d3 call to github for geo_data- geojson:

// Function to highlight the feature on a mouseover:
// function highlightFeature(e) {
//   var layer = e.target;

//   layer.setStyle({
//       weight: 5,
//       color: '#666',
//       dashArray: '',
//       fillOpacity: 0.7
//   });

//   layer.bringToFront();
// }
// Here we get access to the layer that was hovered through e.target, set a thick grey border on the layer as our highlight effect, also bringing it to the front so that the border doesn’t clash with nearby states.

// Next we’ll define what happens on mouseout:

// function resetHighlight(e) {
//   geojson.resetStyle(e.target);
// }
// // The handy geojson.resetStyle method will reset the layer style to its default state (defined by our style function). For this to work, make sure our GeoJSON layer is accessible through the geojson variable by defining it before our listeners and assigning the layer to it later:

// let geojson_events;
// // ... our listeners
// // As an additional touch, let’s define a click listener that zooms to the state:
// function zoomToFeature(e) {
//   map.fitBounds(e.target.getBounds());
// }
// // Now we’ll use the onEachFeature option to add the listeners on our state layers:
// function onEachFeature(feature, layer) {
//   layer.on({
//       mouseover: highlightFeature,
//       mouseout: resetHighlight,
//       click: zoomToFeature
//   });
// }

// geojson_events = L.geoJson(geo_data, {
//   style: style,
//   onEachFeature: onEachFeature
// }).addTo(map);


// function getData() {
//   // Assign the value of the dropdown menu option to a variable:
//   let dataValue = d3.select("#selDataset").property("value"); 
//   // First, the metadata for the panel demo table:
//   // Set metadata to a var:
//   let metadata = data.metadata;
//   // Filter the metadata to find the id that was selected in the dropdownMenu (dataValue)):
//   let chosenMetadata = metadata.filter(meta => meta.id == dataValue);  
//   let chosenMeta = chosenMetadata[0]  

//   // Call "updatePanel" function to update the panel with the new metadata:
//   updatePanel(chosenMeta);

//   // Next, get data for the bar chart and the bubble chart:
//   // Set samples to a var:
//   let samples = data.samples;
//   // Filter the samples to match the chosen value in the dropdown menu= dataValue, add [0] to the end to pull out that sample key:
//   let sampleMatched = samples.filter(s => s.id === dataValue)[0]; 

//   // Pass sampleMatched to all of the charts:
//   // Call "makeBarChart" function to pass the sampleMatched to it: 
//   makeBarChart(sampleMatched); 
//   // Call "makeBubbleChart" function to pass the sampleMatched to it: 
//   makeBubbleChart(sampleMatched); 
//   // Call "makeGaugeChart" function to pass the sampleMatched to it: 
//   makeGaugeChart(chosenMeta); 

// }

// // Function to make the horizontal bar chart for top ten OTU IDS for the chosen subject ID:
// function makeBarChart(newdata) {
//   // Set all the vars in the array of sampleMatched (newdata) to object vars to build the charts, slice the top 10 and reverse them:
//   let otu_ids = newdata.otu_ids.slice(0, 10).reverse();
//   let otu_labels = newdata.otu_labels.slice(0, 10).reverse();
//   let sample_values = newdata.sample_values.slice(0, 10).reverse();

//   // Re-format the otu_ids as labels for the y-axis:
//   let y_labels = otu_ids.map(otu_id => `OTU ${otu_id}`);   

//   // Trace1 for the top 10 belly button data: 
//   let trace1 = {
//     x: sample_values,
//     y: y_labels, 
//     text: otu_ids,
//     hovertext: otu_labels,
//     name: "beboBar",
//     type: "bar",
//     orientation: "h"
//   };

//   // add the trace1 to a barData array:
//   var barData = [trace1];

//   // Apply a title to the layout and margins, pull the ID for the title:
//   let layout_bar = {
//     title: `<b>Top Ten OTUs in ID: ${newdata.id}</b>`, 
//     margin: {
//       l: 75,
//       r: 0,
//       t: 50,
//       b: 50
//     }
//   };

//   // Render the plot to the div tag with id "bar", and pass barData and layout:
//   Plotly.newPlot("bar", barData, layout_bar); 
// }

function makeBarChart(hv_risk) {
  // Set all the vars in the array of sampleMatched (newdata) to object vars to build the charts, slice the top 10 and reverse them:
  let barArray_x = ["coastal_flooding_score","drought_score","heatwave_score"]//, "hurricane_score", "lightning_score", "river_flooding_score","tornado_scores", "wildfire_scores","winterweather_score"]
  let barArray_y = [hv_risk[0].coastal_flooding_score,hv_risk[0].drought_score,hv_risk[0].heatwave_score]
  // let bar_risk = barArray.reverse();
  // let bar_labels = newdata.otu_labels.slice(0, 10).reverse();
  // let sample_values = newdata.sample_values.slice(0, 10).reverse();
  // Re-format the otu_ids as labels for the y-axis:
  // let y_labels = otu_ids.map(otu_id => `OTU ${otu_id}`);
  // Trace1 for the top 10 belly button data:
  let trace1 = {
    x: barArray_x,
    y: barArray_y,
    // text: otu_ids,
    // hovertext: otu_labels,
    name: "Bar1",
    type: "bar"
    // orientation: "h"
  };
  // add the trace1 to a barData array:
  var barData = [trace1];
  // Apply a title to the layout and margins, pull the ID for the title:
  let layout_bar = {
    title: `<b>Bar Chart</b>`,
    margin: {
      l: 75,
      r: 0,
      t: 50,
      b: 50
    }
  };
  // Render the plot to the div tag with id "bar", and pass barData and layout:
  Plotly.newPlot("graph_1", barData, layout_bar);
}