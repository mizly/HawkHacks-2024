from flask import Flask, jsonify, request, url_for, redirect, json
import neureloRequests as db
import businessrequests as br
import base64
from aistuff import generate_response
from PIL import Image

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        # Retrieve the image data from the request
        print(request.json)
        image_data = request.json['image']
        # Decode base64 encoded image data
        image_data = base64.b64decode(image_data)
        result = (generate_response([image_data,f"Location that the photo was taken in is {location}. Tell me what you see, tell me everything you know about the location in the image possibly including historical context."]))


        # Return success response
        return jsonify({'message': result})
    except Exception as e:
        # Return error response if something goes wrong
        return jsonify({'error': str(e)}), 500

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

@app.route('/business_photos/<business_id>')
def business_photos(business_id):
    return br.get_business_photos(business_id)

@app.route('/autocomplete/<query>/<coordinates>')
def autocomplete(query, coordinates):
    return br.autocomplete(query, coordinates)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6450)  # Change port as needed