"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { requisitions } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

export default function RequisitionsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Requisitions"
        description="Department requests for raw materials, chemicals, packaging and accessories."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Requisitions" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Bulk approve",
                  description: "Selected requisitions marked Approved.",
                  tone: "success",
                })
              }
            >
              <Check className="size-4" /> Approve selected
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: "Requisition created",
                  description: "PR-3304 submitted for approval.",
                  tone: "success",
                })
              }
            >
              <Plus className="size-4" /> New requisition
            </Button>
          </>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "all", label: "Total PRs", value: String(requisitions.length) },
          {
            id: "pend",
            label: "Pending",
            value: String(requisitions.filter((r) => r.status === "Pending").length),
            tone: "warning",
          },
          {
            id: "appr",
            label: "Approved",
            value: String(requisitions.filter((r) => r.status === "Approved").length),
            tone: "success",
          },
          {
            id: "conv",
            label: "Converted to PO",
            value: String(requisitions.filter((r) => r.status === "Converted").length),
            tone: "info",
          },
        ]}
      />

      <DataTable
        data={requisitions as unknown as Record<string, unknown>[]}
        searchKeys={["id", "requester", "department", "item", "status"]}
        searchPlaceholder="Search requisitions..."
        statusKey="status"
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast({
                title: "Converted to PO",
                description: "Approved lines pushed to PO draft.",
                tone: "info",
              })
            }
          >
            Convert to PO
          </Button>
        }
        columns={[
          { key: "id", label: "PR #" },
          { key: "requester", label: "Requester" },
          { key: "department", label: "Department" },
          { key: "item", label: "Item" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
          },
          { key: "neededBy", label: "Needed by" },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
