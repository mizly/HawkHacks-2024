import requests
import json
from dotenv import load_dotenv
import os

load_dotenv(".env")
api_key = os.getenv("MONGODB_API_KEY")
CLUSTER = os.getenv("MONGODB_CLUSTER")
BASE_URL = os.getenv("MONGODB_URL")

def GET(database,collection):
    url = f"{BASE_URL}/action/find"

    payload = json.dumps({
        "collection": f"{collection}",
        "database": f"{database}",
        "dataSource": f"{CLUSTER}",
        "projection": None
    })
    headers = {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': f'{api_key}'
    }

    return requests.request("POST", url, headers=headers, data=payload).json()

def GETbyID(database,collection,id):
    url = f"{BASE_URL}/action/findOne"

    payload = json.dumps({
        "collection": f"{collection}",
        "database": f"{database}",
        "dataSource": f"{CLUSTER}",
        "filter": {
            "_id": {"$oid": id}
        },
        "projection": None
    })
    headers = {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': f'{api_key}',
    }

    return requests.request("POST", url, headers=headers, data=payload).json()

def POST(database, collection, data):
    url = f"{BASE_URL}/action/insertOne"

    payload = {
        "collection": collection,
        "database": database,
        "dataSource": f"{CLUSTER}",
        "document": data  # Add the data you want to write to the database
    }

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': api_key  # Assuming api_key is defined somewhere in your code
    }

    # Send a POST request to insert data into the database
    response = requests.post(url, headers=headers, json=payload)

    # Check if the request was successful
    if response.status_code == 200 or response.status_code == 201:
        return "Data inserted successfully!"
    else:
        return f"Error: {response.status_code}"


def PATCH(database, collection, filter_data, update_data):
    url = f"{BASE_URL}/action/updateOne"

    payload = {
        "collection": collection,
        "database": database,
        "dataSource": f"{CLUSTER}",
        "filter": filter_data,  # Specify the filter for the document to update
        "update": update_data   # Specify the update operation to perform
    }

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': api_key  # Assuming api_key is defined somewhere in your code
    }

    # Send a POST request to update data in the database
    response = requests.post(url, headers=headers, json=payload)

    # Check if the request was successful
    if response.status_code == 200 or response.status_code == 201:
        return "Data updated successfully!"
    else:
        return f"Error: {response.status_code}"
    

