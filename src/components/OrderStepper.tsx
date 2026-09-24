import { Fragment } from "react";
import { BellRing, CheckCircle2, ChefHat, Clock, type LucideIcon } from "lucide-react";
import { ORDER_STATUSES, STATUS_COLORS, STATUS_LABELS, STATUS_STEP } from "../lib/constants";
import type { OrderStatus } from "../types";

const STEP_ICONS: Record<OrderStatus, LucideIcon> = {
  pending: Clock,
  preparing: ChefHat,
  ready: BellRing,
  completed: CheckCircle2,
};

const SHORT_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Done",
};

const HELPER_TEXT: Record<OrderStatus, string> = {
  pending: "Order confirmed — the kitchen will start on it shortly.",
  preparing: "The chef is on it. Fresh and hot, coming right up.",
  ready: "Your food is ready at the counter — come grab it!",
  completed: "Enjoy your meal! See you next time.",
};

function StepDot({
  status,
  state,
}: {
  status: OrderStatus;
  state: "done" | "current" | "upcoming";
}) {
  const Icon = STEP_ICONS[status];
  const dot = STATUS_COLORS[status].dot;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`grid h-8 w-8 place-items-center rounded-full transition-all duration-300 ${
          state === "upcoming"
            ? "border-2 border-dashed border-stone-300 bg-white text-stone-400"
            : `${dot} text-white shadow-sm`
        } ${state === "current" ? "ring-4 ring-accent/40 ring-offset-2" : ""}`}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" strokeWidth={2.4} />
      </span>
      <span
        className={`whitespace-nowrap text-[11px] font-bold leading-none ${
          state === "current"
            ? "text-foreground"
            : state === "done"
              ? "text-foreground/70"
              : "text-foreground/40"
        }`}
      >
        {SHORT_LABELS[status]}
      </span>
    </div>
  );
}

export default function OrderStepper({ status }: { status: OrderStatus }) {
  const stepIdx = STATUS_STEP[status];
  return (
    <div>
      <div className="flex items-start" role="list" aria-label="Order progress">
        {ORDER_STATUSES.map((step, i) => (
          <Fragment key={step}>
            {i > 0 && (
              <span
                className={`mt-4 h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i <= stepIdx ? STATUS_COLORS[ORDER_STATUSES[i - 1]].bar : "bg-stone-200"
                }`}
                aria-hidden="true"
              />
            )}
            <div role="listitem" aria-current={i === stepIdx ? "step" : undefined}>
              <StepDot
                status={step}
                state={i < stepIdx ? "done" : i === stepIdx ? "current" : "upcoming"}
              />
            </div>
          </Fragment>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-foreground/70">
        {STATUS_LABELS[status]} — {HELPER_TEXT[status]}
      </p>
    </div>
  );
}