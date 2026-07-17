import { PaymentMethod } from './sale';

export interface Expense {
  _id: string;
  _company_id: string;
  description: string;
  category_id: string;
  payment_method: PaymentMethod;
  value: number;
  expensed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateExpense {
  description: string;
  category_id: string;
  payment_method: PaymentMethod;
  value: number;
  expensed_at: string;
}

export interface UpdateExpense {
  description?: string;
  category_id?: string;
  payment_method?: PaymentMethod;
  value?: number;
  expensed_at?: string;
}
