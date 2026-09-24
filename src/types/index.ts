export type OrderStatus = "pending" | "preparing" | "ready" | "completed";
export type ItemKind = "veg" | "non-veg";
export type Role = "student" | "staff";

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  categoryId: string;
  name: string;
  /** Price in whole rupees. */
  price: number;
  kind: ItemKind;
  stock: number;
  available: boolean;
}

export interface OrderItem {
  itemId: string;
  /** Snapshot of name/price at order time — menu edits never rewrite history. */
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  token: string; // "#T-104"
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  completedAt?: number;
}

export interface CartLine {
  item: Item;
  qty: number;
}