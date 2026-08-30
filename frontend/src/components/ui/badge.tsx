import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)]",
        success:
          "border-transparent bg-[var(--success-muted)] text-[var(--success)]",
        warning:
          "border-transparent bg-[var(--warning-muted)] text-[var(--warning)]",
        error:
          "border-transparent bg-[var(--error-muted)] text-[var(--error)]",
        info:
          "border-transparent bg-[var(--info-muted)] text-[var(--info)]",
        outline:
          "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
