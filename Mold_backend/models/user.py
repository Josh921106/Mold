from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, Session

from models.base import Base
from db.core import engine


class User(Base):
    __tablename__ = "user"

    ID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, index=True)
    user: Mapped[str] = mapped_column(String(255), nullable=False)
    pwd: Mapped[str] = mapped_column(String(255), nullable=False)

    def get_id(self) -> int:
        return self.ID

    @staticmethod
    def get(identifier):
        with Session(engine) as session:
            if isinstance(identifier, int):
                return session.query(User).filter_by(ID=identifier).first()
            elif isinstance(identifier, str):
                return session.query(User).filter_by(user=identifier).first()
