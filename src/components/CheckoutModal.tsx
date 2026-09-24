import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, Lock, X } from "lucide-react";
import { formatPrice } from "../utils/format";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { placeOrder } from "../lib/store";
import type { CartLine, Order } from "../types";

interface Props {
  open: boolean;
  lines: CartLine[];
  total: number;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

type Step = "form" | "processing" | "success";

const SIMULATED_PAYMENT_MS = 1400;

export default function CheckoutModal({
  open,
  lines,
  total,
  onClose,
  onOrderPlaced,
}: Props) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, step, onClose]);

  // Fresh form every time the modal opens.
  useEffect(() => {
    if (open) {
      setStep("form");
      setError(null);
      setPlacedOrder(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!name.trim()) return;
    setStep("processing");
    setError(null);
    window.setTimeout(() => {
      try {
        const order = placeOrder({ customerName: name, lines });
        setPlacedOrder(order);
        setStep("success");
        onOrderPlaced(order);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong — please try again."
        );
        setStep("form");
      }
    }, SIMULATED_PAYMENT_MS);
  };

  const trackOrder = () => {
    if (!placedOrder) return;
    onClose();
    navigate(`/track/${encodeURIComponent(placedOrder.token)}`);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto p-4">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]"
        onClick={() => step !== "processing" && onClose()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={step === "processing"}
          aria-label="Close checkout"
          className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-foreground/60 transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {step === "form" && (
          <>
            <h2 id="checkout-title" className="font-heading text-xl text-foreground">
              Checkout
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {lines.length} item{lines.length === 1 ? "" : "s"} · total{" "}
              <span className="font-bold text-foreground">{formatPrice(total)}</span>
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-foreground/60"
                >
                  Your name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Aarav"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-foreground/60"
                >
                  Phone <span className="font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </div>

            {error && (
              <p
                className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={!name.trim()}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-md shadow-accent/30 transition-all duration-150 hover:brightness-105 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Pay {formatPrice(total)} (simulated)
            </button>
            <p className="mt-2.5 text-center text-[11px] text-foreground/50">
              Demo checkout — no real payment is taken.
            </p>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent" aria-hidden="true" />
            <div>
              <p className="font-heading text-lg text-foreground">Contacting payment…</p>
              <p className="mt-1 text-sm text-foreground/60">Hold tight, this is just a demo.</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" aria-hidden="true" />
            </span>
            <div>
              <h2 id="checkout-title" className="font-heading text-xl text-foreground">
                Order placed!
              </h2>
              <p className="mt-1 text-sm text-foreground/60">
                Payment successful. Keep this token — we'll call it when your food is ready.
              </p>
            </div>
            <p className="font-heading text-6xl tracking-tight text-accent">
              {placedOrder?.token ?? "#T-"}
            </p>
            <button
              type="button"
              onClick={trackOrder}
              className="mt-1 w-full cursor-pointer rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-md shadow-accent/30 transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
            >
              Track my order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}