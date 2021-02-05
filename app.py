from flask import Flask
from flask_sqlalchemy import sqlalchemy
from sqlalchemy import create_engine, func
from sqlalchemy.orm import Session
from flask import Flask,jsonify
from flask import render_template
from sqlalchemy.ext.automap import automap_base 

import os

engine = create_engine(f'postgresql://postgres:postgres@localhost:5432/caliaqi_db')
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# Save reference to the table
Coordinates = Base.classes.coordinates


app = Flask(__name__)


@app.route("/")
def home():

    return render_template("index.html")

@app.route('/api/<city_name>')
def api(city_name):

    print(city_name)
    session = Session(engine)
    results = session.execute("select * from coordinates").all()
    print(results)
    session.close()

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)



