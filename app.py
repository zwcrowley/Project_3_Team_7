import numpy as np
from flask import Flask, Response, request, render_template, jsonify
import pymongo
from pymongo import MongoClient
import json
from bson.json_util import dumps, loads 
from typing import Any
from bson import ObjectId
from datetime import datetime
from mongopass import mongopass_app
from flask_cors import CORS, cross_origin

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
CORS(app, resources=r'/api/*', supports_credentials=True)  

###############
# setup mongo connection
conn = mongopass_app
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
@cross_origin(origin='*')
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/home_value_risk_data<br/>"
        f"/api/v1.0/county_bounds_data"
    )

# ZHVI data route:
@app.route("/api/v1.0/home_value_risk_data")
@cross_origin(origin='*')
def home_risk():
    """Return the home risk data as json"""
    homes = hv_risk_collection.find()
    # Convert object_id from the homes mongo cursor:
    homes_json = MongoJSONEncoder().encode(list(homes))
    # Convert to python obj:
    # homes_obj = json.loads(homes_json)
    # Create response:
    homes_response = Response(response=homes_json, status=200, mimetype="application/json")
    # Allow cross origin
    homes_response.headers.add('Access-Control-Allow-Origin', '*')
    # Return response:
    return homes_response       

# US county boundary geojson data route:
@app.route("/api/v1.0/county_bounds_data")
@cross_origin(origin='*')
def county_lines():
    """Return the county bounds data as json"""
    counties = county_bounds_collection.find()
    # Convert object_id from the homes mongo cursor:
    counties_json = MongoJSONEncoder().encode(list(counties))
    # Convert to python obj:
    # counties_obj = json.loads(counties_json)
    # Create response:
    cnty_response = Response(response=counties_json, status=200, mimetype="application/json")
    # Allow cross origin
    cnty_response.headers.add('Access-Control-Allow-Origin', '*')
    # Return response: 
    return cnty_response

if __name__ == "__main__":
    app.run(debug=True)
