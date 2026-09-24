import { STATUS_COLORS, STATUS_LABELS } from "../lib/constants";
import type { OrderStatus } from "../types";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${colors.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}