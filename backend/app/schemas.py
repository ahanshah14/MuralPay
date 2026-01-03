from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, Dict, Any
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    price_usdc: Decimal
    image_path: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    price_usdc: Optional[Decimal] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PurchaseRequest(BaseModel):
    product_id: int
    amount_usdc: Decimal

class PayinStatus(BaseModel):
    type: str
    initiatedAt: Optional[str] = None
    completedAt: Optional[str] = None
    reason: Optional[str] = None

class PayinInstructions(BaseModel):
    type: str
    depositUrl: Optional[str] = None
    expiresAt: Optional[str] = None

class PurchaseResponse(BaseModel):
    success: bool
    message: str
    transaction_id: Optional[str] = None
    payin_id: Optional[str] = None
    payin_status: Optional[Dict[str, Any]] = None
    payin_instructions: Optional[Dict[str, Any]] = None
    fiat_amount_cop: Optional[float] = None
