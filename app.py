#from MongoDB import mongodb
from flask import Flask, render_template, jsonify
import pandas as pd
from flask_pymongo import PyMongo
from pymongo import MongoClient
import json

app = Flask(__name__)
#pp.config["MONGO_URI"] = "mongodb://localhost:27017/car_inventory_db"

client = MongoClient('localhost', 27017)

db = client.car_inventory_db

#mongo = PyMongo(app)
# data = file_path = 'columns.csv'  
# df = pd.read_csv(file_path, low_memory=False)


# Load dataset
# data = pd.read_json('all_vehicles.json')  
#app.config ["Mongo_uri"]

@app.route('/')
def home():
   return render_template('index.html')
# if __name__ == '__main__':
#    app.run()
# @app.route("/")
# def home_page():
#     inventory_data = mongo.db.car.find()
#     return render_template("index.html")
# ,
        #  inventory = inventory_data)



@app.route('/api/data')
def get_data():
    # Convert DataFrame to JSON
    query = {}
    fields = {'make': 1, 'model': 1,  'year': 1, 'VIN': 1, '_id': 0}
    inventory_data = db.car_inventory.find(query, fields)
    #print(inventory_data)
    data_list = [item for item in inventory_data]
    print(data_list)

  

    return jsonify(data_list)

if __name__ == '__main__':
    app.run(debug=True)
