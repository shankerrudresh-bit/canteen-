import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatPrice } from "../utils/format";
import { useFocusTrap } from "../hooks/useFocusTrap";
import type { CartLine } from "../types";

interface Props {
  open: boolean;
  lines: CartLine[];
  count: number;
  total: number;
  onClose: () => void;
  onAdd: (itemId: string) => void;
  onSetQty: (itemId: string, qty: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  lines,
  count,
  total,
  onClose,
  onAdd,
  onSetQty,
  onRemove,
  onCheckout,
}: Props) {
  const panelRef = useRef<HTMLElement | null>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
          <h2 id="cart-title" className="font-heading text-lg text-foreground">
            Your cart{count > 0 ? ` (${count})` : ""}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-foreground/40">
              <ShoppingBag className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="font-heading text-lg text-foreground">Your cart feels hungry</p>
            <p className="text-sm text-foreground/60">
              Nothing here yet. Browse the menu and add something tasty.
            </p>
            <Link
              to="/menu"
              onClick={onClose}
              className="mt-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-white transition-all duration-150 hover:brightness-105 active:scale-[0.97]"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {lines.map(({ item, qty }) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-foreground/50">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSetQty(item.id, qty - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(item.id)}
                      disabled={qty >= item.stock}
                      aria-label={`Increase ${item.name} quantity`}
                      className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="w-14 text-right text-sm font-bold text-foreground">
                    {formatPrice(item.price * qty)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-foreground/40 transition-colors hover:bg-red-50 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-border bg-background px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground/70">Total</span>
                <span className="font-heading text-xl text-foreground">{formatPrice(total)}</span>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                className="w-full cursor-pointer rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-md transition-all duration-150 hover:brightness-105 hover:shadow-lg active:scale-[0.98]"
              >
                Place order · {formatPrice(total)}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}