from flask import Flask, jsonify, request, url_for, redirect, json
import neureloRequests as db
import businessrequests as br
import base64
from aistuff import generate_response
from PIL import Image
import io
from tempfile import NamedTemporaryFile

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        # Retrieve the image data from the request
        image_data = request.json['image']
        # Decode base64 encoded image data
        image_bytes = io.BytesIO(base64.b64decode(image_data))
        print("cp1")

        # Open the image using PIL
        image = Image.open(image_bytes)

        # Create a temporary file to save the image
        with NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            temp_file_path = temp_file.name
            # Save the image to the temporary file
            image.save(temp_file_path)

        print("cp2")

        # Call generate_response function with the file path of the saved image and a location description
        result = generate_response([temp_file_path, "Location that the photo was taken in is Kitchener. Tell me what you see, tell me everything you know about the location in the image possibly including historical context."])

        print(result)

        # Return success response
        print(jsonify({'message': result}))
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

@app.route('/autocomplete/<query>/<coordinates>')
def autocomplete(query, coordinates):
    return br.autocomplete(query, coordinates)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6450)  # Change port as needed