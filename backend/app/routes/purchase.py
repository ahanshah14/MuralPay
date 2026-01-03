from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..services.mural_pay import get_account_id, create_payin, convert_usdc_to_cop
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["purchase"])

@router.post("/purchase", response_model=schemas.PurchaseResponse)
def create_purchase(
    purchase_request: schemas.PurchaseRequest,
    db: Session = Depends(get_db)
):
    # Verify product exists (used for validation, but amount can be total cart amount)
    product = db.query(models.Product).filter(models.Product.id == purchase_request.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate amount is positive
    if float(purchase_request.amount_usdc) <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )
    
    # Get Mural account ID
    account_id = get_account_id()
    if not account_id:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve Mural account. Please check API configuration."
        )
    
    # Convert USDC to COP
    usdc_amount = float(purchase_request.amount_usdc)
    fiat_amount_cop = convert_usdc_to_cop(usdc_amount)
    
    # Create Payin via Mural Pay API
    try:
        payin_response = create_payin(
            account_id=account_id,
            fiat_amount_cop=fiat_amount_cop
        )
        
        transaction_id = str(uuid.uuid4())
        payin_id = payin_response.get("id")
        payin_status = payin_response.get("payinStatus", {})
        payin_instructions = payin_response.get("payinInstructions")
        
        return schemas.PurchaseResponse(
            success=True,
            message="Payin created successfully. Please complete the payment using the provided instructions.",
            transaction_id=transaction_id,
            payin_id=payin_id,
            payin_status=payin_status,
            payin_instructions=payin_instructions,
            fiat_amount_cop=fiat_amount_cop
        )
    except Exception as e:
        logger.error(f"Error creating Payin: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create Payin: {str(e)}"
        )
