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
Base.prepare(autoload_with=engine)

# Save reference to the table
hv_risk = Base.classes.hv_risk_merged_data 
Passenger = Base.classes.passenger


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

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(hv_risk.index, hv_risk.state_county_FIPS, hv_risk.zhvi_yr_growth,hv_risk.risk_index_score).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_hv_risk = []
    for index, state_county_FIPS, zhvi_yr_growth,risk_index_score in results:
        hv_risk_dict = {}
        hv_risk_dict["index"] = index
        hv_risk_dict["state_county_FIPS"] = state_county_FIPS
        hv_risk_dict["zhvi_yr_growth"] = zhvi_yr_growth
        hv_risk_dict["risk_index_score"] = risk_index_score
        all_hv_risk.append(hv_risk_dict)

    return jsonify(all_hv_risk) 

if __name__ == "__main__":
    app.run(debug=True) 