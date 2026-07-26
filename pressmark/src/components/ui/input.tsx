import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("field font-sans outline-none", className)}
      {...props}
    />
  );
}

/* Errors say what went wrong and how to fix it. Amber marker, ink text —
 * amber never carries the message on its own. */
function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      // Colour is inherited so the message stays legible on both grounds.
      className={cn("t-small flex items-start gap-2", className)}
      {...props}
    >
      <span aria-hidden="true" className="mt-1 block size-2 shrink-0 bg-amber" />
      {children}
    </p>
  );
}

function FieldHint({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-hint"
      className={cn("t-small opacity-60", className)}
      {...props}
    />
  );
}

export { Input, FieldError, FieldHint };
