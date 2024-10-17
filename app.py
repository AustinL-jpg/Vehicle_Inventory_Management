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
    fields = {'_id': 0, 'Make': 1, 'Model': 1,  'Year': 1}
    inventory_data = db.car_inventory.find(query, fields)
    #print(inventory_data)
    cars_data = [item for item in inventory_data]
    # print(cars_data)

  
    
    return jsonify(cars_data)


@app.route(f'/query')
def query():



    print("You made it this far.")


    Make = request.args.get('Make')
    Model = request.args.get('Model')
    Year = request.args.get('Year')
    fields = request.args.get('')
    print(Make, Model, Year)

    

    query = {}
    if Make:
        query['Make'] = Make
    if Model:
        query['Model'] = Model
    if Year:
        try:
            query['Year'] = int(Year)

        except ValueError:
            print(f"Invalid year value: {Year}")


    print(f"Query received - Make: {Make}, Model: {Model}, Year: {Year}")

    if not query:
        return jsonify([]), 400
    if fields:
        try:
            fields_dict = json.loads(fields)
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid fields parameter."}), 400
    else:
        fields_dict = {"_id": 0}  # Exclude _id, query all other fields


    inventory_data = db.car_inventory.find(query, fields_dict)
    cars_data = []

    for item in inventory_data:
        # Create a new dictionary to hold filtered data
        filtered_item = {}
        for key, value in item.items():
            if value != 0 or value != -1:  # Filter out values of 0 and -1
                filtered_item[key] = value
                print("works one")  
            if value != "0" or value != "-1":  # Filter out values of 0 and -1
                filtered_item[key] = value  
                print("works two")  
        if filtered_item:  # Only add non-empty items
            cars_data.append(filtered_item)
        print(filtered_item)    

    if not cars_data:
        return jsonify({"message": "No results found."}), 404

    return jsonify(cars_data)


if __name__ == '__main__':
    app.run(debug=True)
