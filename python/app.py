from flask import Flask, jsonify, request, url_for, redirect, json
import dbrequests as db
import businessrequests as br

app = Flask(__name__)

response =     {
        "latitude": "drake glazer",
        "longitude": "h",
        "location": "h",
        "culture": "h",
        "song_info": "h",
        "history": "h"
    }

@app.route('/get_song')
def get_song():
    return response

@app.route('/get_players')
def get_players():
    return db.GET("CommUnity", "Players")

@app.route('/get_player/<id>')
def get_player(id):
    return db.GETbyID("CommUnity", "Players", id)

@app.route('/search_business/<query>/<lat>/<lng>')
def search_business(query, lat, lng):
    return br.search(query, lat, lng)

@app.route('/business_details/<business_id>')
def business_details(business_id):
    return br.get_business_details(business_id)

@app.route('/autocomplete/<query>/<coordinates>')
def autocomplete(query, coordinates):
    return br.autocomplete(query, coordinates)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6450)  # Change port as needed