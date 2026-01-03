export interface Product {
  id: number;
  name: string;
  price_usdc: string;
  image_path: string;
  created_at: string;
  updated_at?: string;
}

export interface PurchaseRequest {
  product_id: number;
  amount_usdc: string;
}

export interface PayinStatus {
  type: string;
  initiatedAt?: string;
  completedAt?: string;
  reason?: string;
}

export interface PayinInstructions {
  type: string;
  depositUrl?: string;
  expiresAt?: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  transaction_id?: string;
  payin_id?: string;
  payin_status?: PayinStatus;
  payin_instructions?: PayinInstructions;
  fiat_amount_cop?: number;
}

export interface ProductUpdate {
  price_usdc: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

