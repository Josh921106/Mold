from sqlalchemy.orm import DeclarativeBase, declared_attr


class Base(DeclarativeBase):
    __table_args__ = {
        "extend_existing": True,
        "mysql_engine": "InnoDB",
        "mysql_charset": "utf8mb4",
        "mysql_collate": "utf8mb4_unicode_ci",
    }
    __abstract__ = True

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
