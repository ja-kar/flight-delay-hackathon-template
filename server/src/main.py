from flask import Flask
from flask_cors import CORS
import pandas as pd
import joblib
from collections import namedtuple

# Declaring namedtuple()
Airport = namedtuple('Airport', ['id', 'name'])

def load_flight_data():
    # Load the flights
    flights = pd.read_csv('../data/flights.csv')

    # Get all unique origin airports with their IDs
    origin_airports = [Airport(id=row.OriginAirportID, name=row.OriginAirportName) for row in flights[['OriginAirportID', 'OriginAirportName']].drop_duplicates().itertuples(index=False)]

    # Create a mapping from each origin airport to all of its destinations
    origin_destinations = {}
    for row in flights[['OriginAirportID', 'OriginAirportName', 'DestAirportID', 'DestAirportName']].drop_duplicates().itertuples(index=False):
        origin = Airport(id=row.OriginAirportID, name=row.OriginAirportName)
        destination = Airport(id=row.DestAirportID, name=row.DestAirportName)
        if origin.id not in origin_destinations:
            origin_destinations[origin.id] = []
        origin_destinations[origin.id].append(destination)

    model = joblib.load('../data/flight_delay_model.pkl')

    return origin_airports, origin_destinations, model

origin_airports, origin_destinations, model = load_flight_data()

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    print('Hello, World! endpoint was reached')
    return 'Hello, World!'

# Get all origin airports
@app.route('/airports/origin')
def get_origin_airports():
    return {'airports': origin_airports}

# Get all destinations for a given origin airport
@app.route('/airports/origin/<origin_id>/destinations')
def get_destinations(origin_id):
    origin_id = int(origin_id)
    return {'airports': origin_destinations[origin_id]}


# Get the probability for delay given origin, destination and month
@app.route('/delay/<origin_id>/<dest_id>/<month>')
def get_delay_probability(origin_id, dest_id, month):
    origin_id = int(origin_id)
    dest_id = int(dest_id)

    # Load the flights
    flights = pd.read_csv('../data/flights.csv')

    # Translate month name to int
    month_name_to_int = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    month = month_name_to_int.get(month, month)

    # Get the probability of delay
    input = pd.DataFrame({
        'Month': [month],
        'OriginAirportID': [origin_id],
        'DestAirportID': [dest_id]
    })

    # Predict the probability of delay
    probability = model.predict_proba(input)[:, 1][0]

    return {'probability': probability}

