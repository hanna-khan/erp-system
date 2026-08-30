"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { statusTone, workOrders } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Play } from "lucide-react";

export default function WorkOrdersPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Orders"
        description="Operation-level shop floor orders linked to production orders."
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Work Orders" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Work order started",
                description: "WO-9102 stitching clocked in · Shift A.",
                tone: "success",
              })
            }
          >
            <Play className="size-4" /> Start selected
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          {
            id: "ip",
            label: "In progress",
            value: String(workOrders.filter((w) => w.status === "In Progress").length),
            tone: "warning",
          },
          {
            id: "pend",
            label: "Pending",
            value: String(workOrders.filter((w) => w.status === "Pending").length),
            tone: "info",
          },
          {
            id: "done",
            label: "Completed",
            value: String(workOrders.filter((w) => w.status === "Completed").length),
            tone: "success",
          },
          { id: "ops", label: "Open targets", value: formatNumber(workOrders.reduce((s, w) => s + (w.target - w.actual), 0)) },
        ]}
      />

      <DataTable
        data={workOrders as unknown as Record<string, unknown>[]}
        searchKeys={["id", "productionOrder", "operation", "workCenter", "status", "operator"]}
        searchPlaceholder="Search work orders..."
        statusKey="status"
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
