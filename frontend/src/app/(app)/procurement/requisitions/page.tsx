"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { requisitions } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Check } from "lucide-react";

type ReqRow = (typeof requisitions)[number] & Record<string, unknown>;

export default function RequisitionsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ReqRow[]>(requisitions as ReqRow[]);

  return (
    <div className="space-y-6 zr-section">
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
              className="rounded-xl"
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
            <CreateRecordDialog
              triggerLabel="New requisition"
              title="Create purchase requisition"
              description="Example: production needs 50,000 kg Grade A cotton."
              successTitle="Requisition created"
              fields={[
                { name: "requester", label: "Requester", defaultValue: "Farhan Siddiqui" },
                {
                  name: "department",
                  label: "Department",
                  type: "select",
                  options: ["Production", "Quality", "Warehouse", "Maintenance"],
                  defaultValue: "Production",
                },
                {
                  name: "item",
                  label: "Item",
                  type: "select",
                  options: ["Printed Lawn Fabric (60\")", "Shade Cards & Lab Dip Kit", "E-com Cartons (Cocoon branded)", "Ombre Print Job — Blush", "Cocoon Hang Tags + Polybags"],
                  defaultValue: "Printed Lawn Fabric (60\")",
                },
                { name: "qty", label: "Quantity", type: "number", defaultValue: "10000" },
                {
                  name: "unit",
                  label: "Unit",
                  type: "select",
                  options: ["KG", "PCS", "SET", "MTR"],
                  defaultValue: "KG",
                },
                { name: "neededBy", label: "Needed by", type: "date", defaultValue: "2026-09-15" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `PR-${3303 + prev.length}`,
                    requester: values.requester,
                    department: values.department,
                    item: values.item,
                    qty: Number(values.qty) || 0,
                    unit: values.unit,
                    status: "Pending",
                    neededBy: values.neededBy,
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
          { id: "all", label: "Total PRs", value: String(rows.length) },
          {
            id: "pend",
            label: "Pending",
            value: String(rows.filter((r) => r.status === "Pending").length),
            tone: "warning",
          },
          {
            id: "appr",
            label: "Approved",
            value: String(rows.filter((r) => r.status === "Approved").length),
            tone: "success",
          },
          {
            id: "conv",
            label: "Converted to PO",
            value: String(rows.filter((r) => r.status === "Converted").length),
            tone: "info",
          },
        ]}
      />

      <DataTable
        data={rows as unknown as Record<string, unknown>[]}
        searchKeys={["id", "requester", "department", "item", "status"]}
        searchPlaceholder="Search requisitions..."
        statusKey="status"
        filterKey="status"
        exportName="requisitions"
        actions={
          <Button
            size="sm"
            variant="secondary"
            className="rounded-xl"
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
