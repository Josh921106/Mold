from flask import Flask
from flask_cors import CORS

import apis
from utils.env import get_env_var

app = Flask(__name__)
CORS(app)

apis.register_blueprints(app)

if __name__ == "__main__":
    app.run(
        host=get_env_var("SERVER_HOST"),
        port=int(get_env_var("SERVER_PORT")),
        debug=get_env_var("SERVER_DEBUG") == "True"
    )
