from flask import Flask
import os
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
from routes import *
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 5000))
if __name__ == "__main__":
    app.run(debug=True, host=HOST, port=PORT)