from sqlalchemy import Column, Integer, String, Numeric, DateTime
from sqlalchemy.sql import func
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    price_usdc = Column(Numeric(10, 2), nullable=False)
    image_path = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
