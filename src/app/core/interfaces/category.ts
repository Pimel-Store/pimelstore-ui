export interface Category {
  _id: string;
  _company_id: string;
  title: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategory {
  title: string;
  color: string;
}

export interface UpdateCategory {
  title?: string;
  color?: string;
}
