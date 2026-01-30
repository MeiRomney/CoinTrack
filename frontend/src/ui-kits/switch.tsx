import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

export function SwitchGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        "space-y-3 **:data-[slot=label]:font-normal",
        // With descriptions
        "has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

export function SwitchField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={clsx(
        className,
        // Base layout
        "grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]",
        // Control layout
        "*:data-[slot=control]:col-start-2 *:data-[slot=control]:self-start sm:*:data-[slot=control]:mt-0.5",
        // Label layout
        "*:data-[slot=label]:col-start-1 *:data-[slot=label]:row-start-1",
        // Description layout
        "*:data-[slot=description]:col-start-1 *:data-[slot=description]:row-start-2",
        // With description
        "has-data-[slot=description]:**:data-[slot=label]:font-medium",
      )}
    />
  );
}

// Simplified colors using semantic color variables
const colors = {
  primary: "data-checked:bg-primary",
  blue: "data-checked:bg-blue-600",
  green: "data-checked:bg-green-600",
  red: "data-checked:bg-red-600",
  orange: "data-checked:bg-orange-600",
  yellow: "data-checked:bg-yellow-500",
  purple: "data-checked:bg-purple-600",
};

type Color = keyof typeof colors;

export function Switch({
  color = "primary",
  className,
  ...props
}: {
  color?: Color;
  className?: string;
} & Omit<Headless.SwitchProps, "as" | "className" | "children">) {
  return (
    <Headless.Switch
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Base styles
        "group relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8",
        // Transitions
        "transition-all duration-200 ease-in-out",
        // Unchecked state
        "bg-muted ring-1 ring-border ring-inset",
        // Checked state - this is the key fix
        colors[color],
        // Focus
        "focus:outline-hidden data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-blue-500",
        // Hover
        "data-hover:ring-ring",
        // Disabled
        "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          // Basic layout
          "pointer-events-none relative inline-block size-4.5 rounded-full sm:size-3.5",
          // Transition for smooth sliding
          "translate-x-0 transition-transform duration-200 ease-in-out",
          // Always white/light background for the toggle button
          "bg-white shadow-sm ring-1 ring-black/10",
          // Checked state - slide to the right
          "group-data-checked:translate-x-4 sm:group-data-checked:translate-x-3",
        )}
      />
    </Headless.Switch>
  );
}
