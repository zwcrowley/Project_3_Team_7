//////////////////////////
//  Project 3- Team 7
//  By: Juan Marin, James Lamotte, Zack Crowley, Matusola Bein 

//////////////////////////////////
// Set up the map, tile layer and links for data:
// Creating the map object called myMap
let myMap = L.map("map", {
  center: [36, -96],
  zoomDelta: 0.2, // Sets the zoom per click 
  zoomSnap: 0.1,  // Sets the zoom increments 
  zoom: 4.7 // sets initial zoom for map
});

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap); 

// Set link fro the GeoJSON data from Github link of our repo- geoJSON of county bounds:
let geoData = "https://raw.githubusercontent.com/zwcrowley/Project_3_Team_7/main/output/us_county_bounds_new.json";

// Set link of hv_risk data- json of merged hv_risk data:
let hv_risk_render = "https://team-7-proj3-map.onrender.com/api/v1.0/home_value_risk_data"

////////////////////////////////////
// Set up a var for the choropleth map:
let geojson;
////////////////////////////////////
// Load the hv_risk data:
// d3 call to github for hv_risk data- csv:
d3.json(hv_risk_render).then(function(hv_risk) { 

  ////////////////////////////////////
  // Load the GeoJSON data from Github link of our repo:
  // d3 call to github for geo_data data- json:
  d3.json(geoData).then(function(geo_data) {

    // Function to create the first drop down menu using unique state names hv_risk data:
    function createDropDown_1(data) {
      // Get unique state names as a var:
      let unique_states = [...new Set(hv_risk.map(cnty => cnty.state))].sort()
      // Select the id for the drop down menu and set as a var:
      let select = d3.select("#selDataset_1");
      // Set up the dropdown menu by passeing the unique_state names to the select tag and creating an "option" child using forEach to iterate through the individual states populating the dropdown menu:
      unique_states.forEach((state) => {
        select.append("option").text(state).property("value", state);  
          });
        }
    // Function to create the second drop down menu using unique state names hv_risk data:
    function createDropDown_2(data) {
      // Get unique state names as a var:
      let unique_states = [...new Set(hv_risk.map(cnty => cnty.state))].sort()
      // Select the id for the drop down menu and set as a var:
      let select = d3.select("#selDataset_2");
      // Set up the dropdown menu by passeing the unique_state names to the select tag and creating an "option" child using forEach to iterate through the individual states populating the dropdown menu:
      unique_states.forEach((state) => {
        select.append("option").text(state).property("value", state);  
          });
    }

    // On change event: This function will updata once a new state is selected from the dropdown menu and then call updatePanel_1() and separate for the other updatePanel_2()
    d3.select("#selDataset_1").on("change", updatePanel_1); 
    d3.select("#selDataset_2").on("change", updatePanel_2);  

    // Function to update the first state statistics panel with the new info:
    function updatePanel_1() {
      // Set the div of state_selected_1 to panel
      let panel = d3.select("#state_selected_1");
      // Set the div of state_selected_1 to panel
      let panel_natl = d3.select("#natl_stats");
      // Assign the value of the dropdown menu option to a variable:
      let dataValue = d3.select("#selDataset_1").property("value");
      // Filter hv_risk data by the selected state from the dropdown menu:
      let state_data = hv_risk.filter(county => county.state == dataValue);  

      // Clear previous selection in the panel:
      panel.html("");
      panel_natl.html("");

      // Calulate the state Risk Average
      let state_risk = state_data.map(cnty => cnty.risk_index_score)
      let state_risk_ave = math.mean(state_risk)

      // Calulate the state HVI Average
      let state_hvi = state_data.map(cnty => cnty.zhvi_yr_growth)
      let state_hvi_ave = math.mean(state_hvi)

      // National Risk ave
      let natl_risk = hv_risk.map(cnty => cnty.risk_index_score)
      let natl_risk_ave = math.mean(natl_risk)

      // National Risk ave
      let natl_hvi = hv_risk.map(cnty => cnty.zhvi_yr_growth)
      let natl_hvi_ave = math.mean(natl_hvi)

      // Add ave for the state risk and HVI Growth to the panel:
      panel.append("h5").text(`${dataValue} Average Risk Score: ${state_risk_ave.toFixed(2)}`);
      panel.append("h5").text(`${dataValue} Average HVI Growth: ${state_hvi_ave.toFixed(2)}`); 

      // Add ave for the National risk and HVI Growth to the national panel:
      panel_natl.append("h5").text(`National Average Risk: ${natl_risk_ave.toFixed(2)}`);
      panel_natl.append("h5").text(`National Average HVI: ${natl_hvi_ave.toFixed(2)}`);   
    } 

    // Function to update the second state statistics panel with the new info:
    function updatePanel_2(newdata) {
      // Set the div of state_selected_2 to panel
      let panel = d3.select("#state_selected_2");

      // Assign the value of the dropdown menu option to a variable:
      let dataValue = d3.select("#selDataset_2").property("value");
      // Filter hv_risk data by the selected state from the dropdown menu:
      let state_data = hv_risk.filter(county => county.state == dataValue);  

      // Clear previous selection in the panel:
      panel.html("");

      // Calulate the state Risk Average
      let state_risk = state_data.map(cnty => cnty.risk_index_score)
      let state_risk_ave = math.mean(state_risk)

      // Calulate the state HVI Average
      let state_hvi = state_data.map(cnty => cnty.zhvi_yr_growth)
      let state_hvi_ave = math.mean(state_hvi)

      // Add the averages for the state risk and HVI Growth:
      panel.append("h5").text(`${dataValue} Average Risk Score: ${state_risk_ave.toFixed(2)}`);
      panel.append("h5").text(`${dataValue} Average HVI Growth: ${state_hvi_ave.toFixed(2)}`); 
    } 

    //////////////////
    // Function to initialize the first county hv_risk data, passes that to getData(), the on event in the next function will updata once a new county is selected from the map:
    function init() {
      // Set the first county to Harris County in Texas- Houston, add [0] to the end to pull out that array from hv_risk data:
      let firstCounty = hv_risk.filter(county => county.county_name == "Harris")[0];
      // Call "makeBarChart" function to pass the firstCounty to it: 
      makeBarChart(firstCounty); 
      // Filter hv_risk to Texas to iniatilize the scatterplot:
      firstState = hv_risk.filter(county => county.state == "Texas"); 
      // Call "makeScatterplot" function and pass firstState to it to initialize the scatter plot: 
      makeScatterplot(firstState);  

      // Filter hv_risk to Alabama to iniatilize the panels:
      firstStatePanel = hv_risk.filter(county => county.state == "Alabama"); 
      // Call "updatePanel_1" function to update the panel with the firstState info:
      updatePanel_1(firstStatePanel); 
      // Call "updatePanel_2" function to update the panel with the firstState info:
      updatePanel_2(firstStatePanel);
    } // end of init()

    ////////////////////////////////////
    // Nested for loop to merge the following values inside the geojson properties for each feature:
    // Loop through each state data value in the hv_risk json file from render:
    for (var i = 0; i < hv_risk.length; i++) {
      // Grab state_county_FIPS from hv_risk data:
      let data_FIPS = parseFloat(hv_risk[i].state_county_FIPS); 
      // Grab values and set them to var dataValue:
      let risk_dataValue = parseFloat(hv_risk[i].risk_index_score);  
      let hv_dataValue = parseFloat(hv_risk[i].zhvi_yr_growth).toFixed(2); 
      let hv_label_dataValue = hv_risk[i].zhvi_yr_growth_label;
      let lat_dataValue = parseFloat(hv_risk[i].lat).toFixed(2); 
      let lng_dataValue = parseFloat(hv_risk[i].lng).toFixed(2); 
      let state_name_dataValue = hv_risk[i].state; 
      let state_abbr_dataValue = hv_risk[i].state_abbr; 
      // Nested for loop that goes throught the geo_data json:
      // Find the corresponding state_county_FIPS inside the GeoJSON
      for (var j = 0; j < geo_data.features.length; j++) {
        let geo_FIPS = parseFloat(geo_data.features[j].properties.state_county_FIPS); 
        // If the fips matches in both datasets:
        if (data_FIPS === geo_FIPS) {
        // Copy the data value into the geoJSON for:  risk_index_score, zhvi_yr_growth, lat, and lng:
        geo_data.features[j].properties.risk_index_score = risk_dataValue;
        geo_data.features[j].properties.zhvi_yr_growth = hv_dataValue;
        geo_data.features[j].properties.zhvi_yr_growth_label = hv_label_dataValue;
        geo_data.features[j].properties.lat = lat_dataValue;
        geo_data.features[j].properties.lng = lng_dataValue; 
        geo_data.features[j].properties.state_name = state_name_dataValue;
        geo_data.features[j].properties.state_abbr = state_abbr_dataValue;
        // Stop looking through the JSON 
        break;  
        }
      }
    } // End of merging data loop.

    // Function to reformat values that are NaN to read as missing:
    function reformValues(value) {
      if (value === "NaN") return value = "Missing" 
      else return value
    }

    ////////////////////////////////////
    // Create a new choropleth layer.
    geojson = L.choropleth(geo_data, {
      // Set the color based on the risk_index_score:
      valueProperty: 'risk_index_score',
      // Set the color scale.
      scale: ['white', 'red'],
      // The number of breaks in the step range
      steps: 20,
      // Set the mode of calculating the choropleth range using- k for k-means:
      mode: "k",   
      style: {
      // Border color
      color: "#4d4d4d", 
      weight: 1,
      fillOpacity: 0.8
      },
        // Binding a popup to each layer:
        onEachFeature: function(feature, layer) {
          layer.bindPopup(`<h3>County Name: <strong> ${feature.properties.NAME} </strong> </h3><hr><h3> Risk Index Score: <strong> ${reformValues(parseFloat(feature.properties.risk_index_score).toFixed(2))} </strong></h3></h3><hr><h3>2021-2022 HVI Growth: <strong>${geo_data.features[i].properties.zhvi_yr_growth}</strong></h3>`); 
          // Sends the data from a mouse click on the map to getData():
          layer.on({
            click: getData
          }); 
        } 
      }).addTo(myMap); // end of choropleth layer function

      ////////////////////////////////////
      // Create the markers for the home value growth scale
      // Set up options for icon shapes for Very Low, Low, Average, High, and Very High home value growth categories:
      // Very Low:
      options_v_low = {
        isAlphaNumericIcon: true
              , text: "Very<br>Low"
              , borderColor: '#7fcdbb'  
              , textColor: '#7fcdbb'
              , iconSize: [45, 45]
              , borderWidth: 3
              , innerIconStyle: 'font-size:12px;padding-bottom:4px;'
            };
      // Low:
      options_low = {
        isAlphaNumericIcon: true
              , text: "Low"
              , borderColor: '#00ABDC' 
              , textColor: '#00ABDC'
              , iconSize: [45, 45]
              , borderWidth: 3
              , innerIconStyle: 'font-size:14px;padding-top:4px;'
            };
      // Average:
      options_ave = {
        isAlphaNumericIcon: true
              , text: "Ave"
              , borderColor: '#9970ab'
              , textColor: '#9970ab' 
              , iconSize: [45, 45]
              , borderWidth: 3
              , innerIconStyle: 'font-size:14px;padding-top:4px;'
            };
      // High: 
      options_high = {
        isAlphaNumericIcon: true
              , text: "High"
              , borderColor: '#41ab5d'
              , textColor: '#41ab5d' 
              , iconSize: [45, 45]
              , borderWidth: 3
              , innerIconStyle: 'font-size:14px;padding-top:4px;'
            };
      // Very High:  
      options_v_high = {
        isAlphaNumericIcon: true
              , text: "Very<br>High"
              , borderColor: '#004529'
              , textColor: '#004529' 
              , iconSize: [45, 45] 
              , borderWidth: 3
              , innerIconStyle: 'font-size:12px;padding-bottom:4px;'
            };
    
      /////////////////////////////
      // Create a the new marker cluster group.
      let markers = L.markerClusterGroup();

      // Marker loop: 
      // Loop through the data, set lat,lng and hvi to vars:
      for (let i = 0; i < geo_data.features.length; i++) {
        // Set the lat and lng for each feature to a a variable:
          let lat_geo = geo_data.features[i].properties.lat;
          let lng_geo = geo_data.features[i].properties.lng; 
          let hvi = geo_data.features[i].properties.zhvi_yr_growth_label;

        // During the loop check for each zhvi_yr_growth_label category, when it matches make a marker using L.BeautifyIcons that were set up above and bind a popup with the hvi change value:
        // Check for zhvi_yr_growth_label == Very Low:
        if (hvi === "Very Low") {
          geo_code = "Very_Low_growth";
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_v_low),
                draggable: false })); 
        }
        // Check for zhvi_yr_growth_label == Low:
        else if (hvi === "Low") {
          geo_code = "Low_growth";
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_low),
                draggable: false })); 
        }
        // Check for zhvi_yr_growth_label == Average:
        else if (hvi === "Average") {
          geo_code = "Average_growth";
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_ave),
                draggable: false })); 
        }
        // Check for zhvi_yr_growth_label == High:
        else if (hvi === "High") {
          geo_code = "High_growth";
          // Add a new marker to the cluster group, and bind a popup:
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_high),
                draggable: false })); 
        }
        // Check for zhvi_yr_growth_label == Very High:
        else if (hvi === "Very High") {
          geo_code = "Very_High_growth";
          // Add a new marker to the cluster group, and bind a popup.
          markers.addLayer(L.marker([lat_geo, lng_geo],{
                icon: L.BeautifyIcon.icon(options_v_high),
                draggable: false })); 
        }
      // Add our marker cluster layer to the map.
      myMap.addLayer(markers);

      }; // end of marker loop

      //////////////////
      // Custom legend for hvi markers
      // Create a legend, in the bottom left of the map and pass it to the map:
      let legend_icon = L.control({position: 'bottomleft'}); 
      // Function to add content to the legend:
      legend_icon.onAdd = function (map) {
      // Create a div for the legend in the html using js: '<strong>Depth (km)</strong>'
      let div_icons = L.DomUtil.create('div', 'info legend');
      labels_icons = ['<div class="legend-icon-title"><strong>County HVI<br>Growth</strong></div>'];
      categories_icons = ['0-20','21-40','41-60','61-80','81-100'];
      // Set the icon types
      let v_low_icon = L.BeautifyIcon.icon(options_v_low);
      let low_icon = L.BeautifyIcon.icon(options_low);
      let ave_icon = L.BeautifyIcon.icon(options_ave);
      let high_icon = L.BeautifyIcon.icon(options_high);
      let v_high_icon = L.BeautifyIcon.icon(options_v_high);
      // Save to array:
      icons = [v_low_icon, low_icon, ave_icon, high_icon, v_high_icon]

      // Loop through for each category in categories and set up the label and icon in the legend for each break, this requires using the element and index to get all the info in the right order in the legend: '<div class="legend-icon">' + icon.outerHTML + '</div><div class="legend-icon">' + category + '</div>'
      categories_icons.forEach((category, index) => { 
        let icon = icons[index].createIcon(); 
        div_icons.innerHTML +=
        labels_icons.push(
          '<div class="legend-icon">' + icon.outerHTML + '</div>' + '<div class="legend-icon">' + category + '</div>');  
          }) 
          div_icons.innerHTML = labels_icons.join('<br>');
        return div_icons;   
      }; 
      // Add the icons legend to the map:
      legend_icon.addTo(myMap); 
      
      ////////////////////////////////////
      // Set up the main legend for choropleth risk index:
      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = geojson.options.limits;
        let colors = geojson.options.colors;
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo = "<h2><strong>Climate Risk Index Score</strong></h2>" +
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

        // Save the state FIPS which is STATE as county_clicked from the clicked on county on map:
        let state_clicked = event.target.feature.properties.STATE;
        
        // Filter hv_risk to match the chosen county from the map, add [0] to the end to pull out that array from hv_risk data:
        let hv_risk_Matched = hv_risk.filter(county => county.state_county_FIPS == county_clicked)[0]; 

        // Filter hv_risk to match the chosen county from the map, add [0] to the end to pull out that array from hv_risk data:
        hv_risk_Matched_state = hv_risk.filter(county => county.state_FIPS == state_clicked); 

        // Pass matched arrays to each of the charts:
        // Call "makeBarChart" function to pass the hv_risk_Matched to it: 
        makeBarChart(hv_risk_Matched); 
        // Call "makeScatterplot" function to pass the hv_risk_Matched_state to it: 
        makeScatterplot(hv_risk_Matched_state); 
      }; // end of getData()

      //////////////////
      // Function to make reactive horizontal bar chart of 8 individual weather/climate risks using the county clicked on the map:
      function makeBarChart(barArray) {
        // Set the passed array to a new var "bar_new":
        let bar_new = barArray 
        // Set up colors for bars:
        barColors = ["#084594", "#e31a1c", "#ff7f00", "#737373", "#762a83","#e7298a","#9ecae1", "#662506"]       
        // Set up nice labels forf all of the risk vars we want to display from the array of bar_new:
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
          type: "bar",
          orientation: "h"
        };
        // add the trace1 to a barData array:
        var barData = [trace1];

        // Apply a title to the layout and margins, pull the ID for the title:
        let layout_bar = {
          title: `<b>Climate Risk Scores for ${bar_new.county_name} County</b>`,
          xaxis: {
            range: [0, 100] // set the range of the x-axis to 0-100
          },
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          }
        };

        // Render the plot to the div tag with id "bar", and pass barData and layout:
        Plotly.newPlot("graph_1", barData, layout_bar);
      } // end of makeBarChart() call 

      // Adding ScatterPlot
      // reactive Scatter Plot that will display the state level relationship between the change in hvi and the risk index, based on the state that is in county that was clicked on from the map: 
      function makeScatterplot(scatterArray) {
        let scatter_new = scatterArray;
        let scatterArray_y = scatter_new.map(county => county.risk_index_score);
        let scatterArray_x = scatter_new.map(county => county.zhvi_yr_growth);  
        let scatterArray_labels = scatter_new.map(county => `${county.county_name} County`);  
        // Set the trace:
        let trace2 = {
          x: scatterArray_x,
          y: scatterArray_y,
          text: scatterArray_labels, 
          hovertext: scatterArray_labels, // Shows county name in scatterplot while hovering over the individual dots.
          name: "graph2",
          mode: "markers",
          type: "scatter",
          marker: { size: 6 }
        };
        let scatterData = [trace2];

        let layout_scatter = {
          title: `<b>Climate Risk Scores and <br> 2021-2022 HVI Growth for: ${scatter_new[0].state}</b>`,
          xaxis: {
              title: '<b>Climate Risk Index Scores</b>',
              range: [0, 100] // set the range of the x-axis to 0-100
                },
          yaxis: {
              title: '<b>Home Value Growth 2021-2022</b>',
              range: [0, 100] // set the range of the y-axis to 0-100
                },
          margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
                }
              };
        Plotly.newPlot("graph_2", scatterData, layout_scatter);
        
      } // end of makeScatterplot() call.

    //////////////////
    // Call the initial function to set up the first graph:
    // Run the functions to create the dropdown menus and initialize the charts:
    createDropDown_1(hv_risk); 
    createDropDown_2(hv_risk); 
    init();

  }); // end of d3 call to github repo for geo_data- geojson.

}); // end of d3 call to render/Flask app for hv_risk data- json.







