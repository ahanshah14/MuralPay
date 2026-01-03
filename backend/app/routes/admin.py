from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api-staging/admin", tags=["admin"])

@router.put("/products/{product_id}/price", response_model=schemas.Product)
def update_product_price(
    product_id: int,
    price_update: schemas.ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if price_update.price_usdc is not None:
        product.price_usdc = price_update.price_usdc
    
    db.commit()
    db.refresh(product)
    return product
