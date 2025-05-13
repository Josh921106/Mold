import os

from sqlalchemy import create_engine
from utils.env import get_env_var

engine = create_engine(
    f"mysql+pymysql://{get_env_var('DB_USER')}:{get_env_var('DB_PASSWORD')}@{get_env_var('DB_HOST')}:{get_env_var('DB_PORT')}/{get_env_var('DB_NAME')}",
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800,
    echo=False,
    future=True,
)
