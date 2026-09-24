import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "../types";
import { KITCHEN_PIN } from "../lib/constants";
import { ChefHat, ShoppingBag, UtensilsCrossed } from "lucide-react";

const STORAGE_KEY = "campus_canteen.role";

interface RoleContextValue {
  role: Role | null;
  setRole: (role: Role) => void;
  /** Clears the stored role and returns everyone to the gate. */
  switchRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "student" || stored === "staff" ? stored : null;
  });

  useEffect(() => {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  }, [role]);

  const setRole = useCallback((next: Role) => setRoleState(next), []);
  const switchRole = useCallback(() => setRoleState(null), []);

  const value = useMemo(() => ({ role, setRole, switchRole }), [role, setRole, switchRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used inside <RoleProvider>");
  return context;
}

/** Simulated auth gate — pick a role; kitchen staff verify with a PIN. */
export function RoleGate({
  onEnter,
}: {
  onEnter: (role: Role) => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const submitPin = () => {
    if (pin === KITCHEN_PIN) {
      onEnter("staff");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/30">
          <UtensilsCrossed className="h-8 w-8" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h1 className="font-heading text-3xl text-foreground">Campus Canteen</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Skip the queue — order ahead, grab your token, eat fast.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onEnter("student")}
        className="mb-3 flex w-full cursor-pointer items-center gap-4 rounded-2xl bg-accent p-4 text-left text-white shadow-md transition-all duration-150 hover:brightness-105 hover:shadow-lg active:scale-[0.98]"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-heading text-lg leading-tight">I'm a student</span>
          <span className="block text-sm text-white/85">Browse the menu & order food</span>
        </span>
      </button>

      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => onEnter("staff")}
          className="mb-3 flex w-full cursor-pointer items-center gap-4 text-left"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-foreground/5 text-foreground">
            <ChefHat className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-heading text-lg leading-tight text-foreground">
              Kitchen staff
            </span>
            <span className="block text-sm text-foreground/60">Process orders & manage stock</span>
          </span>
        </button>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitPin();
          }}
          className="flex gap-2"
        >
          <label className="sr-only" htmlFor="kitchen-pin">
            Kitchen PIN
          </label>
          <input
            id="kitchen-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Kitchen PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              error ? "border-destructive bg-red-50" : "border-border bg-background"
            }`}
          />
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
          >
            Enter
          </button>
        </form>
        {error ? (
          <p className="mt-2 text-xs font-semibold text-destructive" role="alert">
            That PIN doesn't match. Demo PIN: {KITCHEN_PIN}
          </p>
        ) : (
          <p className="mt-2 text-xs text-foreground/50">
            Demo PIN: <span className="font-bold">{KITCHEN_PIN}</span>
          </p>
        )}
      </div>
    </div>
  );
}