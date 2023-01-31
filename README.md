# **Project_3_Team_7**

## Project 3 for UMN Data Bootcamp for Team 7

#### **Team members:** Juan Marin, James Lamotte, Zack Crowley, Matusola Bein

#### Live Github Pages link: https://zwcrowley.github.io/Project_3_Team_7/ 

### **Objective**:

#### The question that we would like to investigate is: “Do counties that experience more natural risk disasters have lower average home prices?”

- In order to answer this question we are first going to create a map of the United States with two layers, one layer that depicts the house prices per county and another layer that shows the natural disaster risk score per county. This will help visualize if there is a relationship between county house prices and risk of natural disasters.
- We are also going to click based bar graph that shows the natural risk score for each of the top 8 natural disasters per county.The 8 natural dsiasters that we will show will be rought, heat wave, hurricanes, coastal + river flooding, lightning, tornadoes, wildfires, and winter weather. This will help users understand what natural disasters are most common in the specific county that they click on.
- We will create a scatterplot that will show the relationship between county house prices in a state and county natural risk score per state. This will help us visualize if states that have higher natural disaster risk scores in there counties also have lower house prices per county.
### **Data**

The data that we will use to create this map will be the Home Prices dataset
from Kaggle (this dataset shows the home prices per county for the United states)  and the national risk index data set from resilience climate.gov. (this dataset shows the risk level for counties in the united states). We will also  use the Kaggle zipcode-county dataset in order to properly convert zipcodes to counties for both datasets to merge.
In order to answer our question we needed to obtain average home price data per county for the United States and natural risk scores per county. We also required GeoJSon county bounds and US county centroids in order to build our map. 

##### Below are our datasets:

- Zillow dataset of average home prices per county of united states from 2000-2022. https://www.zillow.com/research/data/
- Resilience climate.gov provided natural disaster risk scores per county https://resilience.climate.gov/datasets/FEMA::national-risk-index-counties/about
- Geojson county bounds https://eric.clst.org/tech/usgeojson/
- US county centroids https://simplemaps.com/data/us-counties

#### **Visualizations**:

- 1. United States Choropleth map that shows which counties have the highest risk score and average home prices.
  
- 2. Click based bar graph that shows the natural risk score for each of the top 8 natural disasters(drought, heat wave, hurricanes, coastal + river flooding, lightning, tornadoes, wildfires, and winter weather) per county.
  
- 3. Click based scatterplot to show if the natural risk score has a relationship with home prices per county.

### Add icons with colors to show HVI levels on top of each county:
- NEW JS library: BeautifyMarker-Leaflet.BeautifyMarkers https://github.com/masajid390/BeautifyMarker/blob/master/README.md

#### Presentation Link: 
- https://docs.google.com/presentation/d/1rfL_40uNFZG7WaOL3fGGOXEZNwmSfxrVQxN1BjVewuc/edit#slide=id.g201583bf659_0_25 


### **Conclusion**
- The choropleth visualization allows us to clearly see that Los Angeles, California; Harris, Texas; and Miami, Florida were the counties with the highest risk of natural disasters.
- By using the home price increase rating we were able to notice that Wayne, Ohio; Kimble, Texas; Kauai, Hawaii; experienced the most growth in home prices between 2021-2022.
- Our visuals would help prospective homeowners to find the areas there is the least risk for natural disaster damage helping them find their prefered choice in home.
- Identify trends of change in the relative risk growth in the counties, to identify a relationships between natural disaster risks and changes in home value.

### **Limitations/Future Possibilities**
- **Limitation**: Certain counties did not have a natural risk index scores so the scatter plots and bar charts were not populating.
- **Future Possibilities**: adding a correlation number or a linear regression to the scatterplot in order to see if there was a significant relationship between home prices and natural risk scores.
Use more of the times series data, add a dropdown to change the home value index to further back in time (had data from 2000-2022).

### Screenshot of Github Pages Site:
![Alt text](github_page_screenshot.png?raw=true "Github Pages Home Value and Climate Risk")
