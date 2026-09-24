import { Drumstick, Plus, Salad } from "lucide-react";
import { formatPrice } from "../utils/format";
import { isOrderable } from "../lib/store";
import type { Item } from "../types";
import VegTag from "./VegTag";

interface Props {
  item: Item;
  qtyInCart: number;
  onAdd: (item: Item) => void;
}

export default function MenuCard({ item, qtyInCart, onAdd }: Props) {
  const orderable = isOrderable(item);
  const lowStock = orderable && item.stock <= 5;
  const isVeg = item.kind === "veg";
  const Icon = isVeg ? Salad : Drumstick;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`relative grid aspect-[4/3] place-items-center overflow-hidden ${
          isVeg
            ? "bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50"
            : "bg-gradient-to-br from-red-100 via-rose-50 to-orange-50"
        }`}
      >
        <Icon
          className={`h-12 w-12 transition-transform duration-300 group-hover:scale-110 ${
            isVeg ? "text-emerald-500/50" : "text-red-500/50"
          }`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        {!orderable && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/55 py-1 text-center text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px]">
            Out of stock
          </span>
        )}
        {orderable && lowStock && (
          <span className="absolute right-2 top-2 rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-bold text-white">
            Only {item.stock} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-[15px] leading-snug text-foreground">
            {item.name}
          </h3>
          <VegTag kind={item.kind} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-base font-extrabold text-foreground">
            {formatPrice(item.price)}
          </p>
          <button
            type="button"
            onClick={() => onAdd(item)}
            disabled={!orderable}
            aria-label={
              orderable ? `Add ${item.name} to cart` : `${item.name} is out of stock`
            }
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:brightness-105 hover:shadow active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" />
            {qtyInCart > 0 ? `Add · ${qtyInCart}` : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}