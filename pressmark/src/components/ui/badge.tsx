import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/* Badges carry spec, so they're set in the utility face. */
const badgeVariants = cva(
  "t-utility inline-flex w-fit shrink-0 items-center gap-2 rounded border px-2 py-1 whitespace-nowrap [&>svg]:size-3",
  {
    variants: {
      variant: {
        outline: "border-rule text-ink",
        solid: "border-ink bg-ink text-paper",
        accent: "border-magenta bg-magenta text-paper",
        status: "border-rule text-ink",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);

function Badge({
  className,
  variant = "outline",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        badgeVariants({ variant }),
        variant === "outline" && "[.on-dark_&]:border-rule-dk [.on-dark_&]:text-wash",
        variant === "status" && "[.on-dark_&]:border-rule-dk [.on-dark_&]:text-wash",
        variant === "solid" && "[.on-dark_&]:border-paper [.on-dark_&]:bg-paper [.on-dark_&]:text-ink",
        className,
      )}
      {...props}
    >
      {variant === "status" && (
        <span aria-hidden="true" className="size-2 rounded-full bg-amber" />
      )}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
