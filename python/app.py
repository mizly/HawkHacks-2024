from flask import Flask, jsonify, request, url_for, redirect, json
import dbrequests as db

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6450)  # Change port as needed