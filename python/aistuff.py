import os
import neureloRequests as db
import base64
import numpy as np
import tempfile
import http.client
import typing
import urllib.request
import IPython.display
from PIL import Image as PIL_image
from PIL import ImageOps as PIL_image_ops
import io

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "application_default_credentials.json"

PROJECT_ID = 865071625837  # @param {type:"string"} ENV VARIABLE
LOCATION = "us-central1"  # @param {type:"string"}

# Initialize Vertex AI
import vertexai

vertexai.init(project=PROJECT_ID, location=LOCATION)

from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    HarmCategory,
    HarmBlockThreshold,
    Image
)

multimodal_model = GenerativeModel("gemini-1.0-pro-vision")

import http.client
import typing
import urllib.request


def get_image_bytes_from_url(image_url: str) -> bytes:
    with urllib.request.urlopen(image_url) as response:
        response = typing.cast(http.client.HTTPResponse, response)
        image_bytes = response.read()
    return image_bytes


def display_images(
    images: typing.Iterable[Image],
    max_width: int = 600,
    max_height: int = 350
) -> None:
    for image in images:
        pil_image = typing.cast(PIL_image.Image, image._pil_image)
        if pil_image.mode != "RGB":
            # RGB is supported by all Jupyter environments (e.g. RGBA is not yet)
            pil_image = pil_image.convert("RGB")
        image_width, image_height = pil_image.size
        if max_width < image_width or max_height < image_height:
            # Resize to display a smaller notebook image
            pil_image = PIL_image_ops.contain(pil_image, (max_width, max_height))
        IPython.display.display(pil_image)

def load_image_from_url(image_url: str) -> Image:
    image_bytes = get_image_bytes_from_url(image_url)
    return Image.from_bytes(image_bytes)

# Load from local file
def loadImage(image):
    

#print(image)

# Use a more deterministic configuration with a low temperature
# https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini
generation_config = GenerationConfig(
    temperature=0.9,          
    top_p=0.8,                
    top_k=40,                 
    candidate_count=1,
    max_output_tokens=1024,   
)

safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
}

def generate_response(prompt):
    responses = multimodal_model.generate_content(
        prompt,
        generation_config=generation_config,
        safety_settings=safety_settings,
        stream=False
    )
    return responses.text
location = "Kitchener,Ontario"
#print(generate_response([image,f"Location that the photo was taken in is {location}. Tell me what you see, tell me everything you know about the location in the image possibly including historical context."]))