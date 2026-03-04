export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'other';

export interface Sale {
  _id: string;
  _company_id: string;
  product: string;
  payment_method: PaymentMethod;
  value: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSale {
  product: string;
  payment_method: PaymentMethod;
  value: number;
}
