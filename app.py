import numpy as np
from flask import Flask 

# reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(autoload_with=engine)

# # Save reference to the table
# Passenger = Base.classes.test

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/names<br/>"
        f"/api/v1.0/passengers"
    )

if __name__ == '__main__':
    app.run()
