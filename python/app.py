from flask import Flask, jsonify, request, url_for, redirect, json

app = Flask(__name__)

response =     {
        "latitude": "h",
        "longitude": "h",
        "location": "h",
        "culture": "h",
        "song_info": "h",
        "history": "h"
    }

@app.route('/get_song')
def get_song():
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6450)  # Change port as needed