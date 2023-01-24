import numpy as np
from flask import Flask, render_template, jsonify
import pymongo
from pymongo import MongoClient
from bson import json_util, ObjectId  
import json

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
    homes = hv_risk_collection.find({})

    all_homes = list(np.ravel([home for home in homes]))

    # print(all_homes) 
    # return jsonify([i for i in hv_risk_collection.find({})])

    return jsonify([home for home in homes]) 

    #Dump loaded BSON to valid JSON string and reload it as dict
    # return json.loads(json_util.dumps([home for home in homes]))

    # return json.loads(json_util.dumps([home for home in homes]))

# US county boundary geojson data route:
@app.route("/api/v1.0/county_bounds_data")
def county_lines():
    """Return the county bounds data as list"""
    counties = county_bounds_collection.find()

    return json.loads(json_util.dumps([county for county in counties]))

    # return jsonify([county for county in counties]) 

if __name__ == "__main__":
    app.run(debug=True)
