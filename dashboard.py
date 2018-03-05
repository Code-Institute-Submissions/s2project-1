from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.environ.get('MONGODB_URI')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')
MONGO_COLLECTION_NAME = os.environ.get('MONGO_COLLECTION_NAME')

FIELDS = {'Category': True, 'Item': True, 'Serving Size': True, 'Calories': True,
          'Calories from Fat': True, 'Total Fat': True,'Total Fat (% Daily Value)': True, 'Saturated Fat': True,'Saturated Fat (% Daily Value)': True, 'Trans Fat': True,'Cholesterol': True,'Cholesterol (% Daily Value)': True, 'Sodium': True,'Sodium (% Daily Value)': True,'Carbohydrates': True, 'Carbohydrates (% Daily Value)': True,'Dietary Fiber': True,'Dietary Fiber (% Daily Value)': True,
          'Sugars': True, 'Protein': True, 'Vitamin A (% Daily Value)': True, 'Vitamin C (% Daily Value)': True,'Calcium (% Daily Value)': True, 'Iron (% Daily Value)': True, '_id': False}

@app.route("/")
def get_home_page():
    return render_template('index.html')

@app.route("/data")
def get_data():
    with MongoClient(MONGODB_URI) as conn:
        collection = conn[MONGO_DB_NAME][MONGO_COLLECTION_NAME]
        salaries = collection.find(projection=FIELDS)
        return json.dumps(list(salaries))


if __name__ == "__main__":
    app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))