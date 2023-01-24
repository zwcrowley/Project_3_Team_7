import numpy as np
from flask import Flask, render_template
import pymongo 

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

###############
# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)

# connect to mongo db and two collections
db = client.home_risk_db
county_bounds_collection = db.county_bounds
hv_risk_collection = db.hv_risk


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

if __name__ == '__main__':
    app.run()
