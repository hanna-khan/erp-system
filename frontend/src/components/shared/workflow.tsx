"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/types";
import { Check, Circle, X } from "lucide-react";

export function WorkflowStepper({
  steps,
  title = "Workflow",
}: {
  steps: WorkflowStep[];
  title?: string;
}) {
  return (
    <div className="zr-card p-5">
      <p className="zr-label mb-4">{title}</p>
      <div className="flex gap-2 overflow-x-auto pb-2 zr-scrollbar">
        {steps.map((step, index) => {
          const content = (
            <div
              className={cn(
                "flex min-w-[140px] flex-col rounded-xl border px-3 py-3 transition-all",
                step.status === "completed" && "border-emerald-200 bg-emerald-50/50",
                step.status === "current" && "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] shadow-[var(--shadow-sm)]",
                step.status === "upcoming" && "border-[var(--border)] bg-[var(--surface)]",
                step.status === "failed" && "border-rose-200 bg-rose-50/60",
                step.href && "hover:shadow-[var(--shadow-sm)]",
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                    step.status === "completed" && "bg-emerald-500 text-white",
                    step.status === "current" && "bg-[var(--brand-primary)] text-white",
                    step.status === "upcoming" && "bg-slate-100 text-slate-500",
                    step.status === "failed" && "bg-rose-500 text-white",
                  )}
                >
                  {step.status === "completed" ? (
                    <Check className="size-3.5" />
                  ) : step.status === "failed" ? (
                    <X className="size-3.5" />
                  ) : step.status === "current" ? (
                    <Circle className="size-2.5 fill-current" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-xs font-semibold text-[var(--foreground)]">{step.label}</span>
              </div>
              {step.meta ? (
                <p className="text-[11px] text-[var(--muted)]">{step.meta}</p>
              ) : null}
            </div>
          );

          return (
            <div key={step.id} className="flex items-center gap-2">
              {step.href ? <Link href={step.href}>{content}</Link> : content}
              {index < steps.length - 1 ? (
                <div className="h-px w-4 shrink-0 bg-[var(--border)]" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Timeline({
  events,
}: {
  events: { id: string; title: string; meta?: string; time: string; tone?: string }[];
}) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-3 pl-2">
          {index < events.length - 1 ? (
            <div className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-px bg-[var(--border)]" />
          ) : null}
          <div className="mt-1 size-3 shrink-0 rounded-full border-2 border-[var(--brand-primary)] bg-white" />
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-[var(--foreground)]">{event.title}</p>
              <p className="text-[11px] text-[var(--muted)]">{event.time}</p>
            </div>
            {event.meta ? <p className="mt-0.5 text-xs text-[var(--muted)]">{event.meta}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
