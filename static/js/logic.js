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
// csv of hv_risk merged data:
let hv_risk_github = "https://raw.githubusercontent.com/zwcrowley/Project_3_Team_7/main/output/hv_risk_df.csv"

// Render link- json of hv_risk merged data:
let hv_risk_render = "https://team-7-proj3-map.onrender.com/api/v1.0/home_value_risk_data"

// // Logan Powell github link
// let geoJSON_github_LP = "https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/500k/2021/county.json"


// Alt api from opendatasoft.com:
// let geoData2 = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-county-boundaries&q=&rows=3233"


// Set up a var for the choropleth map:
let geojson;

// d3 call to github for hv_risk data- csv:
d3.json(hv_risk_render).then(function(hv_risk) {
  console.log("hv_risk", hv_risk)
  // Function to initialize the first id for the charts and panel with the first Id = 940, passes that name to getData(), the on event in the next function will updata once a new id is selected from the dropdown menu:
  function init() {
    let firstArray = [hv_risk[0].flood_score,hv_risk[0].drought_score,hv_risk[0].heatwave_score];
    console.log("firstArray",firstArray)
    makeBarChart(firstArray); 
  }
  // makeBarChart(hv_risk)
  init();


  // d3 call to github for geo_data data- json:
  d3.json(geoJSON_github).then(function(geo_data) {
    console.log("geo_data", geo_data)

    // Loop through each state data value in the .csv file
    for (var i = 0; i < hv_risk.length; i++) {
      // Grab state_county_FIPS Name
      var data_FIPS = parseFloat(hv_risk[i].state_county_FIPS); 
      // Grab data value 
      var dataValue = parseFloat(hv_risk[i].risk_index_score); 
      // Nested for loop that goes throught the geo_data json:
      // Find the corresponding state_county_FIPS inside the GeoJSON
      for (var j = 0; j < geo_data.features.length; j++) {
        var json_FIPS = parseFloat(geo_data.features[j].properties.state_county_FIPS); 
        // If the fips matches in both datasets:
        if (data_FIPS === json_FIPS) {
          // Copy the data value into the JSON
          geo_data.features[j].properties.risk_index_score = dataValue;
          // Stop looking through the JSON
          break;  
        }
      }
    }
    
    // console.log("geo_data.features[j].properties.risk_index_score", geo_data.features[0].properties.risk_index_score)
    // console.log("dataValue", dataValue, i)
    function zoomToFeature(e) {
      myMap.fitBounds(e.target.getBounds());
    }

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
          layer.on({
            click: getData
          }); 
        } 
      }).addTo(myMap); // end of choropleth layer function

      // Function to return data where mouseclick occured:
      function getData(event) {
        let county_clicked = event.target.feature.properties.state_county_FIPS;
        console.log("clicked county", county_clicked)

        let barArray = [];

        // Loop through each state data value in the hv_risk json call:
        for (var i = 0; i < hv_risk.length; i++) {
          // Grab state_county_FIPS Name
          var data_FIPS = parseFloat(hv_risk[i].state_county_FIPS); 
            // If the fips matches the fips from the mouse click event:
            if (data_FIPS = county_clicked) {
              barArray.push([hv_risk[i].flood_score,hv_risk[i].drought_score,hv_risk[i].heatwave_score]);
              // Stop looking throught the hv_risk data:
              break;  
            }
          }

        let featureJson = event.target.feature;
        console.log("featureJson", featureJson)
        // passes barArray_x, and state_county_FIPS to makeBarChart()
        makeBarChart(barArray)  
      }; // end of getData()
    
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
      
      // Mouse Click:
      // myMap.on('click', function(e) {
      //   alert(e.latlng);
      //   console.log(e);
      //   // download something
      //   /* if(something == something){
      //         e.preventDefault(); 
      //         window.location.href = 'downloadMe/riverData.doc';
      //      }
      //   */
      // } );
  
  }); // end of d3 call to github for hv_risk data- csv:

}); // end of d3 call to github for geo_data- geojson:

// Function to make reactive bar chart:
function makeBarChart(barArray) {
  // Set all the vars in the array of to object vars to build the charts, slice the top 10 and reverse them:
  let barArray_y = ["flood_score","drought_score","heatwave_score"]//, "hurricane_score", "lightning_score", "tornado_scores", "wildfire_scores","winterweather_score"]
  let barArray_x = barArray; 
  // let barArray_x = [hv_risk[0].flood_score,hv_risk[0].drought_score,hv_risk[0].heatwave_score]; 

  console.log("barArray_x", barArray_x)
  // let bar_risk = barArray.reverse();
  // let bar_labels = newdata.otu_labels.slice(0, 10).reverse();
  // let sample_values = newdata.sample_values.slice(0, 10).reverse();
  // Re-format the otu_ids as labels for the y-axis:
  // let y_labels = otu_ids.map(otu_id => `OTU ${otu_id}`);
  // Trace1 for the data of 8 risks:
  let trace1 = {
    x: barArray_x,
    y: barArray_y,
    // text: otu_ids,
    // hovertext: otu_labels,
    name: "Bar1",
    type: "bar",
    orientation: "h"
  };
  // add the trace1 to a barData array:
  var barData = [trace1];
  console.log("barData", barData) 

  // Apply a title to the layout and margins, pull the ID for the title:
  let layout_bar = {
    title: `<b>Bar Chart</b>`,
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };
  console.log("layout_bar", layout_bar)  

  // Render the plot to the div tag with id "bar", and pass barData and layout:
  Plotly.newPlot("graph_1", barData, layout_bar);
}


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


