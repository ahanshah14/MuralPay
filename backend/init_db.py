"""
Database initialization script to seed initial products.
Run this after the database is created.
"""
from app.database import SessionLocal, engine
from app.models import Base, Product
from decimal import Decimal

# Create tables
Base.metadata.create_all(bind=engine)

# Seed data with current Walmart-style pricing (per item/pound)
products_data = [
    {"name": "Apple", "price_usdc": Decimal("1.75"), "image_path": "/images/apple.jpg"},  # ~$1.75/lb
    {"name": "Orange", "price_usdc": Decimal("1.50"), "image_path": "/images/orange.jpg"},  # ~$1.50/lb
    {"name": "Banana", "price_usdc": Decimal("0.65"), "image_path": "/images/banana.jpg"},  # ~$0.65/lb
    {"name": "Blueberry", "price_usdc": Decimal("4.50"), "image_path": "/images/blueberry.jpg"},  # ~$4.50 per 6oz container
    {"name": "Cherry", "price_usdc": Decimal("5.00"), "image_path": "/images/cherry.jpg"},  # ~$5.00/lb
]

def seed_products():
    db = SessionLocal()
    try:
        # Check if products already exist
        existing = db.query(Product).count()
        if existing > 0:
            print("Products already seeded. Skipping.")
            return
        
        for product_data in products_data:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print(f"Successfully seeded {len(products_data)} products.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding products: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_products()

