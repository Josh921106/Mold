from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import select
from db.core import engine
from models import User
from utils.jwt_utils import generate_token
from werkzeug.security import check_password_hash

user_api = Blueprint("user_api", __name__, url_prefix="/api")


@user_api.route("/login", methods=["POST"])
def login():
    """
    User login endpoint.
    """
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"status": 1, "message": "缺少使用者名稱或密碼"}), 401

        with Session(engine) as session:
            user = session.execute(
                select(User).where(User.user == username)
            ).scalar()

            if not user or not check_password_hash(user.pwd, password):
                return jsonify({"status": 1, "message": "使用者名稱或密碼錯誤"}), 401

            # access_level: 你可以根據使用者角色調整這裡
            token = generate_token(user.user, access_level=0)
            return jsonify({"status": 0, "token": token}), 200

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"status": 1, "message": "登入失敗"}), 500
