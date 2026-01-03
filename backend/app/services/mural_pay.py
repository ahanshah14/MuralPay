import os
import requests
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)

MURAL_API_BASE_URL = "https://api.muralpay.com"
MURAL_API_KEY = os.getenv("MURAL_API_KEY")
USDC_TO_COP_RATE = float(os.getenv("USDC_TO_COP_RATE", "4000.0"))  # Default approximate rate


def get_mural_headers() -> Dict[str, str]:
    """Get headers for Mural Pay API requests"""
    if not MURAL_API_KEY:
        raise ValueError("MURAL_API_KEY environment variable is not set")
    
    return {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {MURAL_API_KEY}"
    }


def get_accounts() -> List[Dict[str, Any]]:
    """Fetch all accounts associated with the organization"""
    try:
        url = f"{MURAL_API_BASE_URL}/api/accounts"
        headers = get_mural_headers()
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching accounts: {e}")
        raise Exception(f"Failed to fetch Mural accounts: {str(e)}")


def get_account_id() -> Optional[str]:
    """Get the first active account ID"""
    try:
        accounts = get_accounts()
        if not accounts:
            return None
        
        # Find the first ACTIVE account
        for account in accounts:
            if account.get("status") == "ACTIVE" and account.get("isApiEnabled", False):
                return account.get("id")
        
        # If no active account found, return the first one
        if accounts:
            return accounts[0].get("id")
        
        return None
    except Exception as e:
        logger.error(f"Error getting account ID: {e}")
        return None


def create_payin(
    account_id: str,
    fiat_amount_cop: float,
    destination_token_symbol: str = "USDC",
    destination_token_blockchain: str = "POLYGON"
) -> Dict[str, Any]:
    """
    Create a Payin (invoice) in Mural Pay
    
    Args:
        account_id: The destination Mural account ID
        fiat_amount_cop: The amount in Colombian Pesos (COP)
        destination_token_symbol: Token symbol (default: USDC)
        destination_token_blockchain: Blockchain (default: POLYGON)
    
    Returns:
        Payin response from Mural Pay API
    """
    try:
        url = f"{MURAL_API_BASE_URL}/api/payins/payin"
        headers = get_mural_headers()
        
        payload = {
            "destinationToken": {
                "symbol": destination_token_symbol,
                "blockchain": destination_token_blockchain
            },
            "destinationMuralAccountId": account_id,
            "payinDetails": {
                "type": "cop",
                "fiatCurrencyCode": "COP",
                "fiatAmount": fiat_amount_cop
            }
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error creating payin: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                logger.error(f"Mural Pay API error: {error_detail}")
            except:
                logger.error(f"Mural Pay API error: {e.response.text}")
        raise Exception(f"Failed to create Payin: {str(e)}")


def convert_usdc_to_cop(usdc_amount: float) -> float:
    """Convert USDC amount to COP using the configured rate"""
    return usdc_amount * USDC_TO_COP_RATE

