import { SEED_ITEMS, ORDER_STATUSES } from "./constants";
import { notify, subscribe } from "./events";
import type { CartLine, Item, Order } from "../types";

export { subscribe };

interface StoreState {
  items: Item[];
  orders: Order[];
  /** Next token sequence number (tokens read "#T-<seq>"). */
  seq: number;
}

const seedItems = (): Item[] =>
  SEED_ITEMS.map((item) => ({ ...item, available: true }));

let state: StoreState = {
  items: seedItems(),
  orders: [],
  seq: 100,
};

let version = 0;

function commit(next: StoreState): void {
  state = next;
  version += 1;
  notify();
}

export const getVersion = (): number => version;
export const getItems = (): Item[] => state.items;
export const getOrders = (): Order[] => state.orders;

export function getOrderByToken(token: string): Order | undefined {
  return state.orders.find((order) => order.token === token);
}

export function isOrderable(item: Item): boolean {
  return item.available && item.stock > 0;
}

const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Places an order: snapshots line items, decrements stock and returns the
 * created order. Throws if any line exceeds current stock.
 */
export function placeOrder(input: {
  customerName: string;
  lines: CartLine[];
}): Order {
  const items = [...state.items];
  for (const line of input.lines) {
    const idx = items.findIndex((item) => item.id === line.item.id);
    if (idx === -1) {
      throw new Error(`"${line.item.name}" is no longer on the menu`);
    }
    const current = items[idx];
    if (!current.available || current.stock < line.qty) {
      throw new Error(`"${current.name}" just sold out — try again`);
    }
    items[idx] = { ...current, stock: current.stock - line.qty };
  }

  const order: Order = {
    id: uid(),
    token: `#T-${state.seq}`,
    customerName: input.customerName.trim(),
    items: input.lines.map((line) => ({
      itemId: line.item.id,
      name: line.item.name,
      price: line.item.price,
      qty: line.qty,
    })),
    total: input.lines.reduce((sum, line) => sum + line.item.price * line.qty, 0),
    status: "pending",
    createdAt: Date.now(),
  };

  commit({ items, orders: [order, ...state.orders], seq: state.seq + 1 });
  return order;
}

/** Advance an order one step — Pending → Preparing → Ready → Completed. */
export function advanceOrder(orderId: string): Order | undefined {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) return undefined;
  const nextStatus = ORDER_STATUSES[ORDER_STATUSES.indexOf(order.status) + 1];
  if (!nextStatus) return order;

  const updated: Order = {
    ...order,
    status: nextStatus,
    completedAt:
      nextStatus === "completed" ? Date.now() : order.completedAt,
  };
  commit({
    ...state,
    orders: state.orders.map((entry) => (entry.id === orderId ? updated : entry)),
  });
  return updated;
}

/** Staff toggle: hide/show an item on the student menu. */
export function toggleAvailability(itemId: string): void {
  commit({
    ...state,
    items: state.items.map((item) =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ),
  });
}