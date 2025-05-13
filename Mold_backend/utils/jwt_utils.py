import jwt
import datetime

from .env import get_env_var

SECRET_KEY = get_env_var("JWT_SECRET_KEY")


def generate_token(user_id: str, access_level: int) -> str:
    """
    Generate a JWT token for the given user ID with an expiration time.

    Args:
        user_id (str): The user ID to include in the token.
        access_level (int): The access level of the user.
        exp (int): The number of minutes until the token expires.

    Returns:
        str: The generated JWT token.
    """
    payload = {
        "user_id": user_id,
        "access_level": access_level,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def verify_token(token: str) -> dict:
    """
    Verify the given JWT token and return the payload if valid.

    Args:
        token (str): The JWT token to verify.

    Returns:
        dict: The payload of the token if valid, otherwise None.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
