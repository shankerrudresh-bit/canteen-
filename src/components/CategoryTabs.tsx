import { useRef, type KeyboardEvent } from "react";
import type { Category } from "../types";

interface Props {
  categories: Category[];
  activeId: string;
  onChange: (id: string) => void;
}

/** ARIA tablist with Left/Right arrow-key navigation. */
export default function CategoryTabs({ categories, activeId, onChange }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + categories.length) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;

    event.preventDefault();
    const nextTab = tabRefs.current[next];
    nextTab?.focus();
    onChange(categories[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Menu categories"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {categories.map((category, index) => {
        const active = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            id={`tab-${category.id}`}
            aria-selected={active}
            aria-controls={`panel-${category.id}`}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => onChange(category.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-all duration-150 active:scale-[0.97] ${
              active
                ? "bg-foreground text-background shadow-sm"
                : "border border-border bg-white text-foreground/60 hover:text-foreground"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}