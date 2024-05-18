import requests
import json
from dotenv import load_dotenv
import os

load_dotenv(".env")
API_KEY = os.getenv("RAPIDAPI_KEY")
API_HOST = os.getenv("RAPIDAPI_HOST")
headers = {
	"X-RapidAPI-Key": API_KEY,
	"X-RapidAPI-Host": API_HOST
}

def search(query, lat, lng, region="ca"):
    '''
    Search for businesses based on a query and location
    query: str, the search query
    lat: float, latitude
    lng: float, longitude
    region: str, the region to search in
    '''
    url = "https://local-business-data.p.rapidapi.com/search"
    querystring = {"query": query, "limit": "20", "lat": lat, "lng": lng, "zoom": "13", "language": "en", "region": region}

    return requests.get(url, headers=headers, params=querystring).json()

def get_business_details(business_id):
    '''
    Get details of a business based on its id
    business_id: str, the id of the business
    '''
    url1 = "https://local-business-data.p.rapidapi.com/business-details"
    url2 = "https://local-business-data.p.rapidapi.com/business-photos"
    querystring1 = {"business_id": business_id, "extract_emails_and_contacts": "true", "extract_share_link": "true", "region": "us", "language": "en"}
    querystring2 = {"business_id": business_id, "limit":"8", "region":"us"}

    return requests.get(url1, headers=headers, params=querystring1).json(), requests.get(url2, headers=headers, params=querystring2).json()

def autocomplete(query, coordinates, region="ca"):
    '''
    Return autocomplete suggestions based on a query
    query: str, the search query
    coordinates: str, the coordinates of the location in (N, W) format (e.g. 49.2827, -123.1207)
    region: str, the region to search in
    '''
    url = "https://local-business-data.p.rapidapi.com/autocomplete"
    querystring = {"query": query, "region": region, "language": "en", "coordinates": coordinates}

    return requests.get(url, headers=headers, params=querystring).json()