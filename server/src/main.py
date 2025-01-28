from flask import Flask
from flask_cors import CORS
import pandas as pd

def load_flight_data():
    # Load the flights
    flights = pd.read_csv('../data/flights.csv')

    # Get all unique origin airports
    origin_airports = flights['OriginAirportName'].unique()

    # Get all unique origin airports and their destinations
    origin_destinations = flights.groupby('OriginAirportName')['DestAirportName'].unique()

    return origin_airports, origin_destinations

origin_airports, origin_destinations = load_flight_data()

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    print('Hello, World! endpoint was reached')
    return 'Hello, World!'

# Get all origin airports
@app.route('/airports/origin')
def get_origin_airports():
    return {'airports': origin_airports.tolist()}

# Get all destinations for a given origin airport
@app.route('/airports/origin/<origin>/destinations')
def get_destinations(origin):
    return {'airports': origin_destinations[origin].tolist()}
