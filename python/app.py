from flask import Flask, jsonify, request, url_for, redirect, json
import neureloRequests as db
import businessrequests as br
import base64
from aistuff import generate_response
from vertexai.generative_models import (
    Image
)
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        # Retrieve the image data from the request
        image_data = request.json['image']
        # Decode base64 encoded image data
        image_bytes = (base64.b64decode(image_data))

        with open("temp.jpg", 'wb') as f:
            f.write(image_bytes)

        image = Image.load_from_file("temp.jpg")
        prompt = "Generate a description in 20 words or less."
        # Call generate_response function with the file path of the saved image and a location description
        contents = [image,prompt]
        result = generate_response(contents)

        # Return success response
        print(jsonify({'message': result}))
        return jsonify({'message': result})

    except Exception as e:
        # Return error response if something goes wrong
        return jsonify({'error': str(e)}), 500

@app.route('/get_players')
def get_players():
    return db.GET()

@app.route('/get_player/<id>')
def get_player(id):
    return db.GET(id)

@app.route('/search_business/<query>/<lat>/<lng>')
def search_business(query, lat, lng):
    return br.search(query, lat, lng)

@app.route('/search_nearby/<query>/<lat>/<lng>')
def search_nearby(query, lat, lng):
    return br.search_nearby(query, lat, lng)

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