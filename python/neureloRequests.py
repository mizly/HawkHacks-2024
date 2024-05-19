import requests
import json
from dotenv import load_dotenv
import os

load_dotenv(".env")
API_KEY = os.getenv("NEURELO_API_KEY")
BASE_URL = os.getenv("NEURELO_URL")

def GET(id=""):
    return requests.get(f"{BASE_URL}/{id}", headers = {
      'X-API-KEY': f'{API_KEY}'
    }).json()

def POST(data):
    url = f"{BASE_URL}/__one?"

    headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json"
    }
    response= requests.post(url, headers=headers, data=json.dumps(data))
    # Check if the request was successful
    if response.status_code == 200 or response.status_code == 201:
        return "Data updated successfully!"
    else:
        return f"Error: {response.status_code}"


def PATCH(id,data):
    url = f"{BASE_URL}/{id}"    
    headers = {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json"
    }

    # Send a POST request to update data in the database
    response = requests.patch(url, headers=headers, data=json.dumps(data))

    # Check if the request was successful
    if response.status_code == 200 or response.status_code == 201:
        return "Data updated successfully!"
    else:
        return f"Error: {response.status_code}"
    