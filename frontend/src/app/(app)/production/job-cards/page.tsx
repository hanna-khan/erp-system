"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const jobCards = [
  { id: "JC-501", pro: "PRO-7001", wo: "WO-9102", operation: "Stitching", style: "TS-BASIC-27", size: "L", color: "Black", target: 400, actual: 280, machine: "Sewing Line-01", operator: "Usman Tariq", shift: "A", status: "In Progress" },
  { id: "JC-502", pro: "PRO-7001", wo: "WO-9102", operation: "Stitching", style: "TS-BASIC-27", size: "M", color: "White", target: 350, actual: 350, machine: "Sewing Line-01", operator: "Shift A Team", shift: "A", status: "Completed" },
  { id: "JC-503", pro: "PRO-7001", wo: "WO-9103", operation: "Finishing", style: "TS-BASIC-27", size: "L", color: "Navy", target: 300, actual: 0, machine: "FIN-01", operator: "—", shift: "B", status: "Pending" },
  { id: "JC-504", pro: "PRO-7002", wo: "WO-9104", operation: "Dyeing", style: "DF-REAC-58", size: "—", color: "Navy", target: 5000, actual: 3200, machine: "Dyeing Machine-01", operator: "Kamran Operator", shift: "A", status: "In Progress" },
  { id: "JC-505", pro: "PRO-7001", wo: "WO-9101", operation: "Cutting", style: "TS-BASIC-27", size: "Assorted", color: "Assorted", target: 10000, actual: 10000, machine: "CUT-LINE-01", operator: "Usman Tariq", shift: "A", status: "Completed" },
];

export default function JobCardsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Cards"
        description="Operator-facing cards for cutting, stitching, dyeing and finishing lots."
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Job Cards" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Output recorded",
                description: "JC-501 · +40 pcs posted.",
                tone: "success",
              })
            }
          >
            <CheckCircle2 className="size-4" /> Record output
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open cards", value: String(jobCards.filter((j) => j.status !== "Completed").length), tone: "warning" },
          { id: "my", label: "Assigned to floor", value: "3", tone: "info" },
          { id: "done", label: "Completed today", value: "2", tone: "success" },
          { id: "eff", label: "Line efficiency", value: "86%", change: "SEW-LINE-01", trend: "up" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={jobCards as unknown as Record<string, unknown>[]}
            searchKeys={["id", "pro", "operation", "style", "operator", "status", "color"]}
            searchPlaceholder="Search job cards..."
            statusKey="status"
            columns={[
              { key: "id", label: "Job card" },
              {
                key: "pro",
                label: "PRO",
                render: (row) => (
                  <Link
                    href={`/production/orders/${row.pro}`}
                    className="font-medium text-[var(--brand-primary)] hover:underline"
                  >
                    {String(row.pro)}
                  </Link>
                ),
              },
              { key: "operation", label: "Operation" },
              { key: "style", label: "Style" },
              {
                key: "color",
                label: "Color / size",
                render: (row) => `${String(row.color)} / ${String(row.size)}`,
              },
              {
                key: "actual",
                label: "Output",
                render: (row) => `${formatNumber(Number(row.actual))}/${formatNumber(Number(row.target))}`,
              },
              { key: "operator", label: "Operator" },
              {
                key: "status",
                label: "Status",
                render: (row) => <Badge variant={statusTone(String(row.status))}>{String(row.status)}</Badge>,
              },
            ]}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>JC-501 · Active</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
              <p className="zr-label">Style</p>
              <p className="font-semibold">TS-BASIC-27 · Black · L</p>
            </div>
            {[
              ["Machine", "Sewing Line-01"],
              ["Operator", "Usman Tariq"],
              ["Shift", "A"],
              ["WO", "WO-9102"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[var(--border)] py-2">
                <span className="text-[var(--muted)]">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>280 / 400 pcs</span>
                <span>70%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div className="h-full w-[70%] rounded-full bg-[var(--brand-primary)]" />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() =>
                toast({
                  title: "Job card closed",
                  description: "JC-501 marked complete · WIP updated.",
                  tone: "success",
                })
              }
            >
              Complete card
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
