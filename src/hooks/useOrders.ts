import { useSyncExternalStore } from "react";
import { getOrderByToken, getOrders, getVersion, subscribe } from "../lib/store";
import type { Order } from "../types";

function useStoreVersion(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}

/** Live list of all orders (newest first). Re-renders on every store change. */
export function useOrders(): Order[] {
  useStoreVersion();
  return getOrders();
}

export function useOrderByToken(token: string | undefined): Order | undefined {
  useStoreVersion();
  return token ? getOrderByToken(token) : undefined;
}