import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftRight, UtensilsCrossed } from "lucide-react";
import { APP_NAME } from "../lib/constants";
import { useRole } from "./RoleGate";

export default function Navbar({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          to="/menu"
          className="flex min-w-0 items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-sm">
            <UtensilsCrossed className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="truncate font-heading text-lg leading-none">{APP_NAME}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">{right}</div>
      </div>
    </header>
  );
}

/** Clears the simulated role and returns to the role gate. */
export function SwitchRoleButton() {
  const { switchRole } = useRole();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => {
        switchRole();
        navigate("/");
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-semibold text-foreground/80 transition-all duration-150 hover:bg-muted active:scale-[0.97]"
    >
      <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Switch role</span>
    </button>
  );
}