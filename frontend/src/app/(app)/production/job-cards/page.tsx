"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const initialJobCards = [
  { id: "JC-501", pro: "PRO-7001", wo: "WO-9102", operation: "Stitching", style: "CCN-KAFT-PRISM", size: "L", color: "Black", target: 400, actual: 280, machine: "Sewing Line-01", operator: "Nazia Bibi", shift: "A", status: "In Progress" },
  { id: "JC-502", pro: "PRO-7001", wo: "WO-9102", operation: "Stitching", style: "CCN-KAFT-PRISM", size: "M", color: "White", target: 350, actual: 350, machine: "Sewing Line-01", operator: "Shift A Team", shift: "A", status: "Completed" },
  { id: "JC-503", pro: "PRO-7001", wo: "WO-9103", operation: "Finishing", style: "CCN-KAFT-PRISM", size: "L", color: "Navy", target: 300, actual: 0, machine: "FIN-01", operator: "—", shift: "B", status: "Pending" },
  { id: "JC-504", pro: "PRO-7002", wo: "WO-9104", operation: "Dyeing", style: "CCN-LAWN-FAIRY", size: "—", color: "Navy", target: 5000, actual: 3200, machine: "Print Table-01", operator: "Junaid Operator", shift: "A", status: "In Progress" },
  { id: "JC-505", pro: "PRO-7001", wo: "WO-9101", operation: "Cutting", style: "CCN-KAFT-PRISM", size: "Assorted", color: "Assorted", target: 10000, actual: 10000, machine: "CUT-LINE-01", operator: "Nazia Bibi", shift: "A", status: "Completed" },
];

type JcRow = (typeof initialJobCards)[number] & Record<string, unknown>;

export default function JobCardsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<JcRow[]>(initialJobCards as JcRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Job Cards"
        description="Operator-facing cards for cutting, stitching, dyeing and finishing lots."
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Job Cards" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
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
            <CreateRecordDialog
              triggerLabel="New job card"
              title="Create job card"
              description="Example: Black · L stitching lot for CCN-KAFT-PRISM."
              successTitle="Job card created"
              fields={[
                {
                  name: "pro",
                  label: "Production order",
                  type: "select",
                  options: ["PRO-7001", "PRO-7002", "PRO-7003"],
                  defaultValue: "PRO-7001",
                },
                {
                  name: "wo",
                  label: "Work order",
                  type: "select",
                  options: ["WO-9101", "WO-9102", "WO-9103", "WO-9104"],
                  defaultValue: "WO-9102",
                },
                {
                  name: "operation",
                  label: "Operation",
                  type: "select",
                  options: ["Cutting", "Stitching", "Finishing", "Dyeing"],
                  defaultValue: "Stitching",
                },
                { name: "style", label: "Style", defaultValue: "CCN-KAFT-PRISM" },
                { name: "color", label: "Color", defaultValue: "Black" },
                { name: "size", label: "Size", defaultValue: "L" },
                { name: "target", label: "Target qty", type: "number", defaultValue: "400" },
                { name: "operator", label: "Operator", defaultValue: "Nazia Bibi" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `JC-${505 + prev.length}`,
                    pro: values.pro,
                    wo: values.wo,
                    operation: values.operation,
                    style: values.style,
                    size: values.size,
                    color: values.color,
                    target: Number(values.target) || 0,
                    actual: 0,
                    machine: "Sewing Line-01",
                    operator: values.operator,
                    shift: "A",
                    status: "Pending",
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open cards", value: String(rows.filter((j) => j.status !== "Completed").length), tone: "warning" },
          { id: "my", label: "Assigned to floor", value: "3", tone: "info" },
          { id: "done", label: "Completed today", value: "2", tone: "success" },
          { id: "eff", label: "Line efficiency", value: "86%", change: "SEW-LINE-01", trend: "up" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={rows as unknown as Record<string, unknown>[]}
            searchKeys={["id", "pro", "operation", "style", "operator", "status", "color"]}
            searchPlaceholder="Search job cards..."
            statusKey="status"
            filterKey="status"
            exportName="job-cards"
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
              <p className="font-semibold">CCN-KAFT-PRISM · Black · L</p>
            </div>
            {[
              ["Machine", "Sewing Line-01"],
              ["Operator", "Nazia Bibi"],
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
              className="w-full rounded-xl"
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
