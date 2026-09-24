import { useSyncExternalStore } from "react";
import { getItems, getVersion, subscribe } from "../lib/store";
import type { Item } from "../types";

function useStoreVersion(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}

/** Live menu items snapshot — updates instantly when stock or availability changes. */
export function useStockItems(): Item[] {
  useStoreVersion();
  return getItems();
}