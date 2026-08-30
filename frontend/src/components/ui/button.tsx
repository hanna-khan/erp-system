import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-primary)] text-white shadow-[var(--shadow-sm)] hover:bg-[color-mix(in_srgb,var(--brand-primary)_90%,#000)] active:scale-[0.99]",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--border))]",
        outline:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-xs)] hover:bg-[var(--surface-muted)] hover:border-[color-mix(in_srgb,var(--brand-primary)_25%,var(--border))]",
        ghost: "text-[var(--foreground)] hover:bg-[var(--sidebar-hover)]",
        destructive:
          "bg-[var(--error)] text-white hover:opacity-95",
        link: "text-[var(--brand-primary)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
