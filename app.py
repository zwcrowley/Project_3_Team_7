import numpy as np
from flask import Flask, request, render_template, jsonify
import pymongo
from pymongo import MongoClient
import json
from bson.json_util import dumps, loads 
from typing import Any
from bson import ObjectId

################
# Function to encode mongoDB object_id:
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)

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
    """Return the home risk data as json"""
    homes = hv_risk_collection.find()
    # Convert object_id from the homes mongo cursor:
    homes_json = MongoJSONEncoder().encode(list(homes))
    # Convert to python obj:
    homes_obj = json.loads(homes_json)

    return jsonify(homes_obj)      

# US county boundary geojson data route:
@app.route("/api/v1.0/county_bounds_data")
def county_lines():
    """Return the county bounds data as json"""
    counties = county_bounds_collection.find()
    # Convert object_id from the homes mongo cursor:
    counties_json = MongoJSONEncoder().encode(list(counties))
    # Convert to python obj:
    counties_obj = json.loads(counties_json)
    return jsonify(counties_obj)  

if __name__ == "__main__":
    app.run(debug=True)
