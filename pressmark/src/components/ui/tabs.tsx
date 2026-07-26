"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  );
}

/* A single hairline the triggers sit on, like a rule across a spec sheet. */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full items-stretch gap-8 overflow-x-auto border-b border-rule",
        "[.on-dark_&]:border-rule-dk",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "t-utility relative -mb-px shrink-0 border-b-2 border-transparent px-0 py-3 whitespace-nowrap opacity-55 outline-none",
        "transition-[opacity,border-color] duration-wipe ease-squeegee",
        "hover:border-amber hover:opacity-100",
        "data-active:border-ink data-active:opacity-100",
        "disabled:pointer-events-none disabled:opacity-25",
        "[.on-dark_&]:data-active:border-paper",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
