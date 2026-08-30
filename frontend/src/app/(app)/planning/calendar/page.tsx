"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const days = ["Mon 25", "Tue 26", "Wed 27", "Thu 28", "Fri 29", "Sat 30", "Sun 31"];

const events: { day: number; title: string; plant: string; tone: "info" | "success" | "warning" | "error"; span?: number }[] = [
  { day: 0, title: "PRO-7001 Stitching", plant: "SITE Karachi", tone: "info", span: 5 },
  { day: 0, title: "PRO-7002 Stitching", plant: "SITE Karachi", tone: "warning", span: 4 },
  { day: 2, title: "PO-4404 ETA Hang Tags", plant: "SITE Karachi", tone: "success", span: 1 },
  { day: 3, title: "QC Final · Lawn", plant: "SITE Karachi", tone: "error", span: 1 },
  { day: 4, title: "PRO-7003 Cut start", plant: "SITE Karachi", tone: "info", span: 3 },
  { day: 5, title: "Maintenance Sewing Line-02", plant: "SITE Karachi", tone: "warning", span: 1 },
  { day: 1, title: "GRN Cotton", plant: "Karachi", tone: "success", span: 1 },
];

const toneClass = {
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

export default function PlanningCalendarPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planning Calendar"
        description="Week of 25–31 Aug 2026 — production, receipts and QC milestones."
        breadcrumbs={[
          { label: "Planning", href: "/planning" },
          { label: "Calendar" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Event added",
                description: "Capacity block reserved on SEW-LINE-02.",
                tone: "success",
              })
            }
          >
            Add event
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Week view · All plants</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">Production</Badge>
            <Badge variant="success">Inbound</Badge>
            <Badge variant="warning">Maintenance</Badge>
            <Badge variant="error">QC</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => (
              <div
                key={d}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-2 text-center text-xs font-semibold"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="relative mt-3 min-h-[320px]">
            <div className="grid grid-cols-7 gap-2">
              {days.map((d, dayIndex) => (
                <div
                  key={d}
                  className="min-h-[300px] space-y-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-2"
                >
                  {events
                    .filter((e) => e.day === dayIndex)
                    .map((e) => (
                      <button
                        key={`${e.title}-${e.day}`}
                        type="button"
                        onClick={() =>
                          toast({
                            title: e.title,
                            description: `${e.plant} · spans ${e.span ?? 1} day(s)`,
                            tone: e.tone === "error" ? "error" : e.tone === "warning" ? "warning" : "info",
                          })
                        }
                        className={cn(
                          "w-full rounded-lg border px-2 py-2 text-left text-[11px] font-medium transition-shadow hover:shadow-sm",
                          toneClass[e.tone],
                        )}
                        style={{
                          minHeight: (e.span ?? 1) > 1 ? 64 : undefined,
                        }}
                      >
                        <p className="leading-snug">{e.title}</p>
                        <p className="mt-1 opacity-70">{e.plant}</p>
                        {(e.span ?? 1) > 1 ? (
                          <p className="mt-1 text-[10px] opacity-60">{e.span}-day run</p>
                        ) : null}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
