// Initialize all the LayerGroups that we'll use.
// Set layers at three for the home growth scale: low = below iqr, average = within iqr, high =
let layers = {
  Low_growth: new L.LayerGroup(),
  Average_growth: new L.LayerGroup(),
  High_growth: new L.LayerGroup(),
};

// Creating the map object
let myMap = L.map("map", {
  center: [36, -96],
  zoomDelta: 0.2, // Sets the zoom per click 
  zoomSnap: 0.1,  // Sets the zoom increments 
  zoom: 4.7,
  layers: [
    layers.Low_growth,
    layers.Average_growth,
    layers.High_growth
  ]
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap); 

// Create an overlays object to add to the layer control:
let overlays = {
  "ZHVI Low Growth": layers.Low_growth,
  "ZHVI Average Growth": layers.Average_growth,
  "ZHVI High Growth": layers.High_growth
};

// Create a control for our layers, and add our overlays to it:
L.control.layers(null, overlays).addTo(myMap); 

// Load the GeoJSON data from Github link of our repo:
// geoJSON of counties:
let geoData = "https://raw.githubusercontent.com/zwcrowley/Project_3_Team_7/main/output/us_county_bounds_new.json";

// Load the hv_risk data:
// json of merged hv_risk data:
let hv_risk_render = "https://team-7-proj3-map.onrender.com/api/v1.0/home_value_risk_data"


////////////////////////////////////
// Set up a var for the choropleth map:
let geojson;
////////////////////////////////////
// d3 call to github for hv_risk data- csv:
d3.json(hv_risk_render).then(function(hv_risk) {
  console.log("hv_risk", hv_risk)

  ////////////////////////////////////
  // d3 call to github for geo_data data- json:
  d3.json(geoData).then(function(geo_data) {
    console.log("geo_data", geo_data)

    //////////////////
    // Function to initialize the first county hv_risk data, passes that to getData(), the on event in the next function will updata once a new county is selected from the map:
    function init() {
      // Set the first county to Harris County in Texas- Houston:
      let firstCounty = hv_risk.filter(county => county.county_name == "Harris")[0];
      makeBarChart(firstCounty);  
      } // end of init()

    ////////////////////////////////////
    // Nested for loop to merge the following values inside the geojson properties for each feature:
    // Loop through each state data value in the hv_risk json file:
    for (var i = 0; i < hv_risk.length; i++) {
      // Grab state_county_FIPS from hv_risk data:
      let data_FIPS = parseFloat(hv_risk[i].state_county_FIPS); 
      // Grab values and set them to var dataValue:
      let risk_dataValue = parseFloat(hv_risk[i].risk_index_score);  
      let hv_dataValue = parseFloat(hv_risk[i].zhvi_yr_growth).toFixed(2); 
      let hv_label_dataValue = hv_risk[i].zhvi_yr_growth_label;
      let lat_dataValue = parseFloat(hv_risk[i].lat).toFixed(2); 
      let lng_dataValue = parseFloat(hv_risk[i].lng).toFixed(2); 
      // Nested for loop that goes throught the geo_data json:
      // Find the corresponding state_county_FIPS inside the GeoJSON
      for (var j = 0; j < geo_data.features.length; j++) {
        let geo_FIPS = parseFloat(geo_data.features[j].properties.state_county_FIPS); 
        // console.log("geo_FIPS", geo_FIPS) 
        // If the fips matches in both datasets:
        if (data_FIPS === geo_FIPS) {
        // Copy the data value into the geoJSON for:  risk_index_score, zhvi_yr_growth, lat, and lng:
        geo_data.features[j].properties.risk_index_score = risk_dataValue;
        geo_data.features[j].properties.zhvi_yr_growth = hv_dataValue;
        geo_data.features[j].properties.zhvi_yr_growth_label = hv_label_dataValue;
        geo_data.features[j].properties.lat = lat_dataValue;
        geo_data.features[j].properties.lng = lng_dataValue;  
        //   // Stop looking through the JSON 
        break;  
        }
      }
    }
    console.log("geo_data properties for row 1", geo_data.features[0].properties)

    ////////////////////////////////////
    // Create a new choropleth layer.
    geojson = L.choropleth(geo_data, {
      // Set the color based on the risk_index_score:
      valueProperty: 'risk_index_score',
      // Set the color scale.
      scale: ['white', 'red'],
      // The number of breaks in the step range
      steps: 20,
      // q for quartile, e for equidistant, k for k-means
      mode: "k",   
      style: {
      // Border color
      color: "#4d4d4d", 
      weight: 1,
      fillOpacity: 0.8
      },
        // Binding a popup to each layer:
        onEachFeature: function(feature, layer) {
          layer.bindPopup("County Name: <strong>" + feature.properties.NAME +"<br /><br />"+ feature.properties.state_county_FIPS + "</strong><br /><br />Risk Index Score: " + parseFloat(feature.properties.risk_index_score).toFixed(2)); 
          // Sends the data from a mouse click on the map to getData():
          layer.on({
            click: getData
          }); 
        } 
      }).addTo(myMap); // end of choropleth layer function

      ////////////////////////////////////
      // Create a the markers for the home value growth scale
      // Set up options for icon shapes for Low, Average, High home value growth categories:
      // Low:
      options_low = {
        isAlphaNumericIcon: true
              , text: "Low"
              , borderColor: '#00ABDC' 
              , textColor: '#00ABDC'
              , iconSize: [39, 39] 
              , borderWidth: 3
              , innerIconStyle: 'font-size:14px;padding-top:4px;'
            };
      // Average:
      options_ave = {
        isAlphaNumericIcon: true
              , text: "Ave"
              , borderColor: '#9970ab'
              , textColor: '#9970ab' 
              , iconSize: [39, 39] 
              , borderWidth: 3
              , innerIconStyle: 'font-size:14px;padding-top:4px;'
            };
      // High:
      options_high = {
        isAlphaNumericIcon: true
              , text: "High"
              , borderColor: '#33a02c'
              , textColor: '#33a02c' 
              , iconSize: [39, 39] 
              , borderWidth: 3
              , innerIconStyle: 'font-size:14px;padding-top:4px;'
            };
    
      // Create a new marker cluster group.
      let markers = L.markerClusterGroup();
      // Loop through the data.
      for (let i = 0; i < geo_data.features.length; i++) {
        // Set the lat and lng for each feature to a a variable:
          let lat_geo = geo_data.features[i].properties.lat;
          let lng_geo = geo_data.features[i].properties.lng; 
          let hvi = geo_data.features[i].properties.zhvi_yr_growth_label;
 
        // Check for zhvi_yr_growth_label == Low:
        if (hvi === "Low") {
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_low),
                draggable: false
            }).bindPopup("County Home Value Index Growth from 2021 to 2022: <strong>" + geo_data.features[i].properties.zhvi_yr_growth + "</strong>")); 
        }
        // Check for zhvi_yr_growth_label == Average:
        else if (hvi === "Average") {
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_ave),
                draggable: false
            }).bindPopup("County Home Value Index Growth from 2021 to 2022: <strong>" + geo_data.features[i].properties.zhvi_yr_growth + "</strong>")); 
        }
        // Check for zhvi_yr_growth_label == High:
        else if (hvi === "High") {
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_high),
                draggable: false
            }).bindPopup("County Home Value Index Growth from 2021 to 2022: <strong>" + geo_data.features[i].properties.zhvi_yr_growth + "</strong>")); 
        }
      } 
      // Add our marker cluster layer to the map.
      myMap.addLayer(markers);

      ////////////////////////////////////
      // Set up the legend:
      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h2>National Risk Index Score</h2>" +
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

      ////////////////////////////////////
      // Function to return data where mouseclick occured:
      function getData(event) {
        // Save the state_county_FIPS as county_clicked from the clicked on county on map:
        let county_clicked = event.target.feature.properties.state_county_FIPS;
        console.log("clicked county", county_clicked)
        
        // Filter hv_risk to match the chosen county from the map, add [0] to the end to pull out that array from hv_risk data:
        let hv_risk_Matched = hv_risk.filter(county => county.state_county_FIPS == county_clicked)[0]; 
        console.log("hv_risk_Matched",hv_risk_Matched)
        // Pass hv_risk_Matched to all of the charts:
        // Call "makeBarChart" function to pass the hv_risk_Matched to it: 
        makeBarChart(hv_risk_Matched); 
      }; // end of getData()

      //////////////////
      // Function to make reactive horizontal bar chart of 8 individual weather/climate risks using the county clicked on the map:
      function makeBarChart(barArray) {
        // Set the passed array to a new var "bar_new":
        let bar_new = barArray 
        // Set up colors for bars:
        barColors = ["#084594", "#e31a1c", "#ff7f00", "#737373", "#762a83","#e7298a","#9ecae1", "#662506"]       
        // Set up nice labesles forf all of the risk vars we want to display from the array of bar_new:
        let y_labels = ["Drought","Flood","Heatwave", "Hurricane", "Lightning", "Tornado", "Wildfire","Winter<br>Weather"].reverse(); 
        // Set all the vars in the array of bar_new to object vars to build the charts and reverse them:
        let barArray_x = [bar_new.drought_score, bar_new.flood_score,bar_new.heatwave_score, bar_new.hurricane_score, bar_new.lightning_score,bar_new.tornado_scores, bar_new.wildfire_scores, bar_new.winterweather_score];   

        // Trace1 for the data of 8 risks:
        let trace1 = {
          x: barArray_x,
          y: y_labels,
          text: y_labels, 
          hovertext: y_labels,
          name: "Bar1",
          marker:{
            color: barColors
          },
          xaxis: {
            categoryorder: "category ascending"
          }, 
          type: "bar",
          orientation: "h"
        };
        // add the trace1 to a barData array:
        var barData = [trace1];
        console.log("barData", barData) 

        // Apply a title to the layout and margins, pull the ID for the title:
        let layout_bar = {
          title: `<b>Risk Scores for ${bar_new.county_name} County</b>`,
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
      } // end of makeBarChart() call 

    //////////////////
    // Call the initial function to set up the first graph:
    init();

  }); // end of d3 call to github for geo_data- geojson.

}); // end of d3 call to render/Flask app for hv_risk data- json.







