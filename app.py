from flask import Flask, render_template, jsonify
import pandas as pd
from flask_pymongo import PyMongo
from pymongo import MongoClient

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/car_inventory_db"
mongo = PyMongo(app)

# Load dataset
# data = pd.read_json('all_vehicles.json')  
#app.config ["Mongo_uri"]


@app.route("/")
def home_page():
    inventory_data = mongo.db.car.find()
    return render_template("index.html",
        inventory = inventory_data)

@app.route('/api/data')
def get_data():
    # Convert DataFrame to JSON
    inventory_data = mongo.db.car.find()
    data_list = [item for item in inventory_data]
    return jsonify(data_list)

if __name__ == '__main__':
    app.run(debug=True)
