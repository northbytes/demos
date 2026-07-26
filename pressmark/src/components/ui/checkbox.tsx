"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded border border-rule bg-paper outline-none",
        "transition-colors duration-wipe ease-squeegee",
        "hover:not-data-checked:border-amber",
        "data-checked:border-ink data-checked:bg-ink data-checked:text-paper",
        "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:opacity-40",
        "aria-invalid:border-ink aria-invalid:shadow-[inset_0_-2px_0_0_var(--amber)]",
        "[.on-dark_&]:border-rule-dk [.on-dark_&]:bg-press-2",
        "[.on-dark_&]:data-checked:border-paper [.on-dark_&]:data-checked:bg-paper [.on-dark_&]:data-checked:text-ink",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        {/* Drawn, not iconography — a hairline tick that matches the rules. */}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M1.5 5.2 3.9 7.6 8.5 2.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
