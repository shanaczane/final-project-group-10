export type Role = 'owner' | 'helper';

export interface AppUser {
  id: string;
  email: string;
  role: Role;
  store_name: string | null;
  owner_id: string | null; // null for owners; owner's user id for helpers
  temp_password: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category_id: string | null;
  quantity: number;
  buy_price: number;
  sell_price: number;
  min_threshold: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export type MovementType = 'sale' | 'restock' | 'adjustment';

export interface StockMovement {
  id: string;
  product_id: string;
  quantity_change: number;
  movement_type: MovementType;
  recorded_by: string;
  created_at: string;
  product?: { name: string; sell_price: number };
}
