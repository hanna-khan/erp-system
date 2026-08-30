"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { productionOrders } from "@/mock/data";
import { formatNumber, formatPercent } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function ProductionOrdersPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Orders"
        description="Release and track PROs across spinning, weaving, dyeing and garments."
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Production Orders" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "PRO released",
                description: "PRO-7003 released to weaving floor.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> Create order
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          {
            id: "ip",
            label: "In progress",
            value: String(productionOrders.filter((p) => p.status === "In Progress").length),
            tone: "warning",
          },
          {
            id: "rel",
            label: "Released",
            value: String(productionOrders.filter((p) => p.status === "Released").length),
            tone: "info",
          },
          {
            id: "done",
            label: "Completed",
            value: String(productionOrders.filter((p) => p.status === "Completed").length),
            tone: "success",
          },
          {
            id: "pcs",
            label: "Output (open)",
            value: formatNumber(
              productionOrders
                .filter((p) => p.status !== "Completed")
                .reduce((s, p) => s + p.completed, 0),
            ),
          },
        ]}
      />

      <DataTable
        data={productionOrders as unknown as Record<string, unknown>[]}
        searchKeys={["id", "so", "product", "process", "plant", "status"]}
        searchPlaceholder="Search PROs..."
        statusKey="status"
        rowHref={(row) => `/production/orders/${row.id}`}
        columns={[
          { key: "id", label: "PRO #" },
          { key: "so", label: "Sales order" },
          { key: "product", label: "Product" },
          { key: "process", label: "Process" },
          {
            key: "qty",
            label: "Target",
            render: (row) => formatNumber(Number(row.qty)),
          },
          {
            key: "completed",
            label: "Completed",
            render: (row) => formatNumber(Number(row.completed)),
          },
          {
            key: "efficiency",
            label: "Efficiency",
            render: (row) => formatPercent(Number(row.efficiency)),
          },
          { key: "start", label: "Start" },
          { key: "finish", label: "Finish" },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
