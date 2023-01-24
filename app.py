import numpy as np
from flask import Flask, request, render_template, jsonify
import pymongo
from pymongo import MongoClient
import json
from bson.json_util import dumps


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

###############
# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn) 

# connect to mongo db: 
db = client.home_risk_db
# Connect to two collections:
hv_risk_collection = db.hv_risk
county_bounds_collection = db.county_bounds


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/home_value_risk_data<br/>"
        f"/api/v1.0/county_bounds_data"
    )

# ZHVI data route:
@app.route("/api/v1.0/home_value_risk_data")
def home_risk():
    """Return the home risk data as list"""
    homes = hv_risk_collection.find()
    all_homes = dumps(homes) 
    return all_homes  

# US county boundary geojson data route:
@app.route("/api/v1.0/county_bounds_data")
def county_lines():
    """Return the county bounds data as list"""
    counties = county_bounds_collection.find()
    all_counties = dumps(counties)
    return all_counties 

if __name__ == "__main__":
    app.run(debug=True)
