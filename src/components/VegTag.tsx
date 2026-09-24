import type { ItemKind } from "../types";

/** FSSAI-style veg/non-veg marker. */
export default function VegTag({ kind }: { kind: ItemKind }) {
  const tone =
    kind === "veg"
      ? "border-emerald-600 text-emerald-700"
      : "border-red-500 text-red-600";
  const dot = kind === "veg" ? "bg-emerald-600" : "bg-red-600";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-[4px] border px-1 py-0.5 text-[9px] font-extrabold tracking-widest ${tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {kind === "veg" ? "VEG" : "NON-VEG"}
    </span>
  );
}