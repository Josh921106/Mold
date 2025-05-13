from flask import request, jsonify
from functools import wraps
from utils.jwt_utils import verify_token


def token_required(f):
    """
    Decorator to check if the request has a valid JWT token.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token or not token.startswith("Bearer "):
            return jsonify({"status": 1, "message": "缺少授權資訊"}), 403

        token = token.split(" ")[1]
        payload = verify_token(token)

        if not payload:
            return jsonify({"status": 1, "message": "無效或過期的Token"}), 403

        request.user = payload
        return f(*args, **kwargs)
    return decorated_function


def access_required(level_required):
    """
    Decorator to check if the user has the required access level.
    """
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, "user"):
                return jsonify({"status": 1, "message": "缺少授權資訊"}), 403
            if request.user.get("access_level", 0) > level_required:
                return jsonify({"status": 1, "message": "權限不足"}), 403
            return f(*args, **kwargs)
        return decorated
    return wrapper
