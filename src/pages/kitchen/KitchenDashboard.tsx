import { useEffect, useMemo, useState } from "react";
import { BellRing, CheckCircle2, ChefHat, ClipboardList, Clock, Coffee } from "lucide-react";
import Navbar, { SwitchRoleButton } from "../../components/Navbar";
import { STATUS_COLORS, STATUS_LABELS } from "../../lib/constants";
import { advanceOrder, toggleAvailability } from "../../lib/store";
import { useOrders } from "../../hooks/useOrders";
import { useStockItems } from "../../hooks/useStock";
import { formatPrice, timeAgo } from "../../utils/format";
import type { Order, OrderStatus } from "../../types";

const ACTIVE_COLUMNS: OrderStatus[] = ["pending", "preparing", "ready"];

const COLUMN_ICONS: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  preparing: ChefHat,
  ready: BellRing,
  completed: CheckCircle2,
};

const COLUMN_EMPTY: Record<OrderStatus, string> = {
  pending: "Queue is empty — new orders pop up here live.",
  preparing: "Nothing on the stove yet.",
  ready: "No orders waiting for pickup.",
  completed: "Nothing completed yet today.",
};

const BUMP_ACTION: Record<OrderStatus, { label: string; icon: typeof ChefHat }> = {
  pending: { label: "Start preparing", icon: ChefHat },
  preparing: { label: "Mark ready", icon: BellRing },
  ready: { label: "Complete order", icon: CheckCircle2 },
  completed: { label: "Done", icon: CheckCircle2 },
};

/** Keeps relative "x min ago" labels ticking on live boards. */
function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

function OrderCard({ order, now }: { order: Order; now: number }) {
  const colors = STATUS_COLORS[order.status];
  const action = BUMP_ACTION[order.status];
  const itemCount = order.items.reduce((sum, line) => sum + line.qty, 0);
  const Icon = action.icon;

  return (
    <article
      className={`rounded-2xl border border-border border-l-4 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md ${colors.edge}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-heading text-xl text-foreground">{order.token}</p>
          <p className="text-xs text-foreground/50">
            {order.customerName} · {timeAgo(order.createdAt, now)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground/70">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="mt-3 divide-y divide-border border-t border-border">
        {order.items.map((line) => (
          <li key={line.itemId} className="flex items-center justify-between gap-2 py-1.5 text-sm">
            <span className="min-w-0 truncate text-foreground">
              <span className="font-bold">{line.qty}×</span> {line.name}
            </span>
            <span className="shrink-0 font-semibold text-foreground/70">
              {formatPrice(line.price * line.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-foreground">
          Total {formatPrice(order.total)}
        </p>
        <button
          type="button"
          onClick={() => advanceOrder(order.id)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background transition-all duration-150 hover:opacity-90 active:scale-[0.95]"
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {action.label}
        </button>
      </div>
    </article>
  );
}

export default function KitchenDashboard() {
  const orders = useOrders();
  const items = useStockItems();
  const now = useNow(30_000);

  const grouped = useMemo(() => {
    const map: Record<OrderStatus, Order[]> = {
      pending: [],
      preparing: [],
      ready: [],
      completed: [],
    };
    for (const order of orders) map[order.status].push(order);
    for (const key of Object.keys(map) as OrderStatus[]) {
      map[key].sort((a, b) => b.createdAt - a.createdAt);
    }
    return map;
  }, [orders]);

  const completedCount = grouped.completed.length;

  const stats = [
    { label: "In queue", value: grouped.pending.length, dot: STATUS_COLORS.pending.dot },
    { label: "Preparing", value: grouped.preparing.length, dot: STATUS_COLORS.preparing.dot },
    { label: "Ready", value: grouped.ready.length, dot: STATUS_COLORS.ready.dot },
    { label: "Done today", value: completedCount, dot: STATUS_COLORS.completed.dot },
  ];

  return (
    <div className="min-h-screen">
      <Navbar
        right={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              Live
            </span>
            <SwitchRoleButton />
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <div className="mb-5">
          <h1 className="font-heading text-3xl text-foreground">Kitchen</h1>
          <p className="mt-1 text-sm text-foreground/60">
            New orders appear instantly. Bump each one as you go.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${stat.dot}`} aria-hidden="true" />
              <div>
                <p className="font-heading text-2xl leading-none text-foreground">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white/70 px-6 py-16 text-center">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
              <Coffee className="h-8 w-8 text-emerald-600" aria-hidden="true" />
            </span>
            <p className="font-heading text-xl text-foreground">All caught up!</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-foreground/60">
              No orders yet. The moment a student checks out, their order lands on this board
              and you can start preparing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ACTIVE_COLUMNS.map((status) => {
              const ColumnIcon = COLUMN_ICONS[status];
              const colors = STATUS_COLORS[status];
              const columnOrders = grouped[status];
              return (
                <section
                  key={status}
                  aria-label={`${STATUS_LABELS[status]} orders`}
                  className="flex flex-col rounded-2xl border border-border bg-background/60"
                >
                  <header
                    className={`flex items-center justify-between gap-2 rounded-t-2xl border-b border-border px-4 py-3 ${colors.badge}`}
                  >
                    <span className="flex items-center gap-2 text-sm font-extrabold">
                      <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} aria-hidden="true" />
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-extrabold">
                      {columnOrders.length}
                    </span>
                  </header>
                  <div className="flex flex-col gap-3 p-3">
                    {columnOrders.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm">
                          <ColumnIcon className={`h-5 w-5 ${colors.dot}`} aria-hidden="true" />
                        </span>
                        <p className="text-xs text-foreground/50">{COLUMN_EMPTY[status]}</p>
                      </div>
                    ) : (
                      columnOrders.map((order) => (
                        <OrderCard key={order.id} order={order} now={now} />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <section className="mt-8">
          <div className="mb-1 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="font-heading text-xl text-foreground">Stock & availability</h2>
          </div>
          <p className="mb-3 text-xs text-foreground/50">
            Stock drops automatically with every order. Toggle items off to hide them from the
            student menu — they come back the moment you flip them on.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const soldOut = item.stock <= 0;
              const on = item.available;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-foreground/50">
                      {soldOut ? (
                        <span className="font-bold text-destructive">Sold out</span>
                      ) : (
                        <>
                          <span className="font-bold text-foreground/70">{item.stock}</span> left
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`text-[11px] font-bold ${
                        on ? "text-emerald-600" : "text-foreground/40"
                      }`}
                    >
                      {on ? "On menu" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={`${on ? "Hide" : "Show"} ${item.name} on the menu`}
                      onClick={() => toggleAvailability(item.id)}
                      className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ${
                        on ? "bg-emerald-500" : "bg-stone-300"
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                          on ? "translate-x-5" : "translate-x-0"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}