import { useCallback, useMemo, useState } from "react";
import type { CartLine } from "../types";
import { useStockItems } from "./useStock";

/** Student cart: plain React state keyed by item id, clamped to stock. */
export function useCart() {
  const items = useStockItems();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const add = useCallback(
    (itemId: string) => {
      setQuantities((current) => {
        const item = items.find((entry) => entry.id === itemId);
        if (!item) return current;
        const next = (current[itemId] ?? 0) + 1;
        return { ...current, [itemId]: Math.min(next, item.stock) };
      });
    },
    [items]
  );

  const setQty = useCallback((itemId: string, qty: number) => {
    setQuantities((current) => {
      if (qty <= 0) {
        const { [itemId]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [itemId]: qty };
    });
  }, []);

  const remove = useCallback((itemId: string) => {
    setQuantities((current) => {
      const { [itemId]: _removed, ...rest } = current;
      return rest;
    });
  }, []);

  const clear = useCallback(() => setQuantities({}), []);

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(quantities)
        .map(([id, qty]) => ({
          item: items.find((entry) => entry.id === id),
          qty,
        }))
        .filter((line): line is CartLine => Boolean(line.item)),
    [quantities, items]
  );

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.item.price * l.qty, 0),
    [lines]
  );

  return { lines, count, total, add, setQty, remove, clear };
}