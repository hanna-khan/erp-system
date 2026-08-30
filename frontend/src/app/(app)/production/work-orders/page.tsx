"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { statusTone, workOrders } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Play } from "lucide-react";

type WoRow = (typeof workOrders)[number] & Record<string, unknown>;

export default function WorkOrdersPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<WoRow[]>(workOrders as WoRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Work Orders"
        description="Operation-level shop floor orders linked to production orders."
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Work Orders" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                toast({
                  title: "Work order started",
                  description: "Selected WO clocked in · Shift A.",
                  tone: "success",
                })
              }
            >
              <Play className="size-4" /> Start selected
            </Button>
            <CreateRecordDialog
              triggerLabel="New work order"
              title="Create work order"
              description="Example: stitching operation on Sewing Line-01 for PRO-7001."
              successTitle="Work order created"
              fields={[
                {
                  name: "productionOrder",
                  label: "Production order",
                  type: "select",
                  options: ["PRO-7001", "PRO-7002", "PRO-7003"],
                  defaultValue: "PRO-7001",
                },
                {
                  name: "operation",
                  label: "Operation",
                  type: "select",
                  options: ["Cutting", "Stitching", "Finishing", "Dyeing", "Weaving"],
                  defaultValue: "Stitching",
                },
                {
                  name: "workCenter",
                  label: "Work center",
                  type: "select",
                  options: ["CUT-LINE-01", "SEW-LINE-01", "FIN-01", "DYE-01"],
                  defaultValue: "SEW-LINE-01",
                },
                { name: "target", label: "Target qty", type: "number", defaultValue: "2000" },
                { name: "operator", label: "Operator", defaultValue: "Shift A Team" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `WO-${9104 + prev.length}`,
                    productionOrder: values.productionOrder,
                    operation: values.operation,
                    workCenter: values.workCenter,
                    target: Number(values.target) || 0,
                    actual: 0,
                    status: "Pending",
                    operator: values.operator,
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
          {
            id: "ip",
            label: "In progress",
            value: String(rows.filter((w) => w.status === "In Progress").length),
            tone: "warning",
          },
          {
            id: "pend",
            label: "Pending",
            value: String(rows.filter((w) => w.status === "Pending").length),
            tone: "info",
          },
          {
            id: "done",
            label: "Completed",
            value: String(rows.filter((w) => w.status === "Completed").length),
            tone: "success",
          },
          { id: "ops", label: "Open targets", value: formatNumber(rows.reduce((s, w) => s + (Number(w.target) - Number(w.actual)), 0)) },
        ]}
      />

      <DataTable
        data={rows as unknown as Record<string, unknown>[]}
        searchKeys={["id", "productionOrder", "operation", "workCenter", "status", "operator"]}
        searchPlaceholder="Search work orders..."
        statusKey="status"
        filterKey="status"
        exportName="work-orders"
        columns={[
          { key: "id", label: "WO #" },
          {
            key: "productionOrder",
            label: "PRO",
            render: (row) => (
              <Link
                href={`/production/orders/${row.productionOrder}`}
                className="font-medium text-[var(--brand-primary)] hover:underline"
              >
                {String(row.productionOrder)}
              </Link>
            ),
          },
          { key: "operation", label: "Operation" },
          { key: "workCenter", label: "Work center" },
          {
            key: "target",
            label: "Target",
            render: (row) => formatNumber(Number(row.target)),
          },
          {
            key: "actual",
            label: "Actual",
            render: (row) => formatNumber(Number(row.actual)),
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
  );
}
