from models.user import Base, User
from db.core import engine
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash

__all__ = ["Base", "User"]

Base.metadata.create_all(bind=engine)

with Session(engine) as session:
    existing = session.query(User).filter_by(user="admin").first()
    if not existing:
        session.add(User(user="admin", pwd=generate_password_hash("admin")))
        session.commit()
        print("Admin user created")
    else:
        print("Admin user already exists")
