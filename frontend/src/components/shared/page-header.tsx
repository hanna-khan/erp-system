import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "zr-section mb-6 flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white/80 p-5 shadow-[var(--shadow-xs)] backdrop-blur-sm sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-[var(--muted)]">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                {index > 0 ? <ChevronRight className="size-3 opacity-50" /> : null}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="rounded-md px-1 py-0.5 hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-[var(--foreground)]">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="zr-page-title">{title}</h1>
          {badge ? <Badge variant="info">{badge}</Badge> : null}
        </div>
        {description ? (
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center shadow-[var(--shadow-xs)]">
      {icon ? (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      {description ? <p className="mt-1 max-w-md text-sm text-[var(--muted)]">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-4 rounded-xl" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
