import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  ReceiptText,
  SearchX,
  UtensilsCrossed,
} from "lucide-react";
import Navbar, { SwitchRoleButton } from "../../components/Navbar";
import OrderStepper from "../../components/OrderStepper";
import StatusBadge from "../../components/StatusBadge";
import { useOrderByToken } from "../../hooks/useOrders";
import { formatClock, formatPrice } from "../../utils/format";

export default function TrackPage() {
  const { token = "" } = useParams();
  const order = useOrderByToken(token);

  return (
    <div className="min-h-screen">
      <Navbar right={<SwitchRoleButton />} />

      <main className="mx-auto max-w-lg px-4 py-8">
        {!order ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-sm">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-muted text-foreground/40">
              <SearchX className="h-8 w-8" aria-hidden="true" />
            </span>
            <h1 className="font-heading text-2xl text-foreground">Order not found</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm text-foreground/60">
              We couldn't find token{" "}
              <span className="font-bold text-foreground">{token || "you entered"}</span>.
              It may have been placed in another session.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:brightness-105 active:scale-[0.97]"
            >
              <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
              Back to the menu
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
                {order.customerName}'s order · placed {formatClock(order.createdAt)}
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <h1 className="font-heading text-6xl tracking-tight text-foreground">
                  {order.token}
                </h1>
                <StatusBadge status={order.status} />
              </div>
            </div>

            <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
              <OrderStepper status={order.status} />
            </section>

            <section className="mt-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg text-foreground">
                <ReceiptText className="h-5 w-5 text-accent" aria-hidden="true" />
                Your order
              </h2>
              <ul className="divide-y divide-border">
                {order.items.map((line) => (
                  <li key={line.itemId} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-sm text-foreground">
                      <span className="font-bold">{line.qty}×</span> {line.name}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(line.price * line.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="font-heading text-xl text-foreground">
                  {formatPrice(order.total)}
                </span>
              </div>
            </section>

            {order.status === "completed" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-emerald-800">
                  Enjoy your meal! {order.token} was completed at{" "}
                  {order.completedAt ? formatClock(order.completedAt) : "—"}.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Link
                to="/menu"
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-accent/30 transition-all duration-150 hover:brightness-105 active:scale-[0.97]"
              >
                Place another order
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}