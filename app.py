#from MongoDB import mongodb
from flask import Flask, render_template, jsonify, request
import pandas as pd
from flask_pymongo import PyMongo
from pymongo import MongoClient
import json

app = Flask(__name__)


client = MongoClient('localhost', 27017)

db = client.car_inventory_db


@app.route('/')
def home():
   return render_template('index.html')



@app.route('/api/data')
def get_data():
    # Convert DataFrame to JSON
    query = {}
    fields = {'_id': 0, 'make': 1, 'model': 1,  'year': 1}
    inventory_data = db.car_inventory.find(query, fields)
    #print(inventory_data)
    cars_data = [item for item in inventory_data]
    print(cars_data)

  
    
    return jsonify(cars_data)


@app.route(f'/query')
def query():



    print("You made it this far.")


    make = request.args.get('make')
    model = request.args.get('model')
    year = request.args.get('year')
    print(make, model, year)

    query = {}
    if make:
        query['make'] = make
    if model:
        query['model'] = model
    if year:
        try:
            query['year'] = int(year)

        except ValueError:
            print(f"Invalid year value: {year}")


    print(f"Query received - Make: {make}, Model: {model}, Year: {year}")

    if not query:
        return jsonify([]), 400
    
    fields = {'_id': 0}
    inventory_data = db.car_inventory.find(query, fields)
    #print(inventory_data)
    cars_data = [item for item in inventory_data]
    print(cars_data)

    return jsonify(cars_data)


if __name__ == '__main__':
    app.run(debug=True)
