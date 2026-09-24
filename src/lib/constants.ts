import type { Category, Item, ItemKind, OrderStatus } from "../types";

/** Simulated auth PIN for kitchen staff. Demo-only stand-in for real auth. */
export const KITCHEN_PIN = "1234";

/** Currency symbol for the configured market (INR default). */
export const CURRENCY = "₹";

export const APP_NAME = "Campus Canteen";
export const APP_TAGLINE = "Skip the queue. Order ahead.";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "completed",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  completed: "Completed",
};

export const STATUS_STEP: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  ready: 2,
  completed: 3,
};

/** Tailwind classes shared by the student tracker and the kitchen board. */
export const STATUS_COLORS: Record<
  OrderStatus,
  { badge: string; dot: string; edge: string; bar: string }
> = {
  pending: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    edge: "border-l-amber-500",
    bar: "bg-amber-500",
  },
  preparing: {
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
    edge: "border-l-blue-500",
    bar: "bg-blue-500",
  },
  ready: {
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
    edge: "border-l-emerald-500",
    bar: "bg-emerald-500",
  },
  completed: {
    badge: "bg-slate-200 text-slate-700",
    dot: "bg-slate-400",
    edge: "border-l-slate-400",
    bar: "bg-slate-400",
  },
};

export const CATEGORIES: Category[] = [
  { id: "south", name: "South Indian" },
  { id: "snacks", name: "Snacks" },
  { id: "meals", name: "Meals" },
  { id: "beverages", name: "Beverages" },
];

type SeedItem = Omit<Item, "available">;

const S = (
  id: string,
  categoryId: string,
  name: string,
  price: number,
  kind: ItemKind,
  stock: number
): SeedItem => ({ id, categoryId, name, price, kind, stock });

/** Seed menu. "Ven Pongal" ships with 0 stock to demo the sold-out state. */
export const SEED_ITEMS: SeedItem[] = [
  S("masala-dosa", "south", "Masala Dosa", 80, "veg", 40),
  S("idli", "south", "Idli (2 pcs)", 40, "veg", 30),
  S("pongal", "south", "Ven Pongal", 60, "veg", 0),
  S("vada", "south", "Medu Vada (2 pcs)", 35, "veg", 25),
  S("maggi", "snacks", "Masala Maggi", 50, "veg", 22),
  S("fries", "snacks", "French Fries", 70, "veg", 18),
  S("paneer-burger", "snacks", "Paneer Burger", 90, "veg", 15),
  S("chicken-burger", "snacks", "Chicken Burger", 110, "non-veg", 14),
  S("veg-thali", "meals", "Veg Thali", 120, "veg", 12),
  S("chicken-thali", "meals", "Chicken Thali", 150, "non-veg", 10),
  S("veg-biryani", "meals", "Veg Biryani", 140, "veg", 9),
  S("chicken-biryani", "meals", "Chicken Biryani", 160, "non-veg", 12),
  S("chai", "beverages", "Cutting Chai", 15, "veg", 100),
  S("cold-drink", "beverages", "Cold Drink", 25, "veg", 60),
  S("lassi", "beverages", "Sweet Lassi", 40, "veg", 40),
  S("lime-soda", "beverages", "Fresh Lime Soda", 45, "veg", 30),
];