from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_mars

# create instance of Falsk app
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/IMDB_app"
mongo = PyMongo(app)


@app.route("/")
def index():
    marsdata = mongo.db.marsdata.find_one()
    return render_template("index.html", imdbdata = imdbdata)

@app.route("/scrape")
def scrape():
    imdbdata = mongo.db.imdbdata
    idata = scrape_imdb.scrape_all()
    imdbdata.update({}, idata, upsert=True)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
