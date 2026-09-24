import { useMemo, useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import Navbar, { SwitchRoleButton } from "../../components/Navbar";
import CategoryTabs from "../../components/CategoryTabs";
import MenuCard from "../../components/MenuCard";
import CartDrawer from "../../components/CartDrawer";
import CheckoutModal from "../../components/CheckoutModal";
import { CATEGORIES } from "../../lib/constants";
import { useStockItems } from "../../hooks/useStock";
import { useCart } from "../../hooks/useCart";
import type { Order } from "../../types";

export default function MenuPage() {
  const items = useStockItems();
  const cart = useCart();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const qtyMap = useMemo(
    () => new Map(cart.lines.map((line) => [line.item.id, line.qty])),
    [cart.lines]
  );

  return (
    <div className="min-h-screen">
      <Navbar
        right={
          <>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cart.count} items`}
              className="relative inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:brightness-105 active:scale-[0.97]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              {cart.count > 0 && (
                <span
                  className="grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[11px] font-extrabold text-background"
                  aria-label={`${cart.count} items in cart`}
                >
                  {cart.count}
                </span>
              )}
            </button>
            <SwitchRoleButton />
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-7">
        <section className="mb-6">
          <h1 className="font-heading text-3xl text-foreground sm:text-4xl">
            What are you craving today?
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground/60">
            <Zap className="h-4 w-4 text-accent" aria-hidden="true" />
            Order ahead, pay at pickup — skip the queue.
          </p>
        </section>

        <CategoryTabs
          categories={CATEGORIES}
          activeId={activeCategory}
          onChange={setActiveCategory}
        />

        {CATEGORIES.map((category) => {
          const categoryItems = items.filter(
            (item) => item.categoryId === category.id
          );
          return (
            <div
              key={category.id}
              id={`panel-${category.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${category.id}`}
              hidden={activeCategory !== category.id}
              className="mt-4"
            >
              {categoryItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-white/60 px-6 py-14 text-center">
                  <p className="font-heading text-lg text-foreground">
                    Nothing available here right now
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    The kitchen has taken this category off the menu — check back soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {categoryItems.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      qtyInCart={qtyMap.get(item.id) ?? 0}
                      onAdd={() => cart.add(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>

      <CartDrawer
        open={cartOpen}
        lines={cart.lines}
        count={cart.count}
        total={cart.total}
        onClose={() => setCartOpen(false)}
        onAdd={cart.add}
        onSetQty={cart.setQty}
        onRemove={cart.remove}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        lines={cart.lines}
        total={cart.total}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={(_order: Order) => cart.clear()}
      />
    </div>
  );
}