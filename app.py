import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify 
from flask_cors import CORS

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///output/hv_risk.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine, reflect=True)
print(Base.classes)

# Save reference to the table
hv_risk = Base.classes.hv_risk

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False  
# Allow cross origin:
CORS(app) 

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/home_value_risk_data<br/>"
    )

# ZHVI and Risk Index data route:
@app.route("/api/v1.0/home_value_risk_data")
def home_risk():
   # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a json of the columns below"""
    # Query all columns that we want from the dataset:
    results = session.query(hv_risk.index, hv_risk.county_name, hv_risk.lat, hv_risk.lng, hv_risk.state_county_FIPS, hv_risk.zhvi_yr_growth_scale, hv_risk.zhvi_yr_growth_label, hv_risk.risk_index_score, hv_risk.drought_score, hv_risk.flood_score, hv_risk.heatwave_score, hv_risk.hurricane_score, hv_risk.lightning_score, hv_risk.tornado_scores, hv_risk.wildfire_scores, hv_risk.winterweather_score).all() 
    
    session.close()

    # Create a dictionary from the row data and append to a list of all_hv_risk
    all_hv_risk = []
    for index, county_name, lat, lng, state_county_FIPS, zhvi_yr_growth_scale, zhvi_yr_growth_label, risk_index_score,drought_score, flood_score, heatwave_score, hurricane_score, lightning_score, tornado_scores, wildfire_scores, winterweather_score in results:
        hv_risk_dict = {}
        hv_risk_dict["index"] = index
        hv_risk_dict["county_name"] = county_name
        hv_risk_dict["lat"] = lat
        hv_risk_dict["lng"] = lng
        hv_risk_dict["state_county_FIPS"] = state_county_FIPS
        hv_risk_dict["zhvi_yr_growth"] = zhvi_yr_growth_scale
        hv_risk_dict["zhvi_yr_growth_label"] = zhvi_yr_growth_label
        hv_risk_dict["risk_index_score"] = risk_index_score
        hv_risk_dict["drought_score"] = drought_score
        hv_risk_dict["flood_score"] = flood_score
        hv_risk_dict["heatwave_score"] = heatwave_score
        hv_risk_dict["hurricane_score"] = hurricane_score
        hv_risk_dict["lightning_score"] = lightning_score
        hv_risk_dict["tornado_scores"] = tornado_scores
        hv_risk_dict["wildfire_scores"] = wildfire_scores
        hv_risk_dict["winterweather_score"] = winterweather_score
        # Append the hv_risk_dict dictionary to the all_hv_risk list to make a json:
        all_hv_risk.append(hv_risk_dict)
    # Return the all_hv_risk json using jsonify to make it look nice:
    return jsonify(all_hv_risk)  

if __name__ == "__main__":
    app.run(debug=True) 