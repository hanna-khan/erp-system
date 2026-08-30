"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { costSheet, statusTone } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

const sheets = [
  {
    id: "CS-TS-27",
    product: costSheet.product,
    style: costSheet.style,
    process: "Garments",
    standard: costSheet.standard.total,
    actual: costSheet.actual.total,
    variance: costSheet.actual.total - costSheet.standard.total,
    status: "Active",
    revised: "2026-08-29",
  },
  {
    id: "CS-MATCHA-26",
    product: "Matcha | 2-Piece",
    style: "CCN-RTW-MATCHA",
    process: "Garments",
    standard: 1120,
    actual: 1095,
    variance: -25,
    status: "Closed",
    revised: "2026-08-18",
  },
  {
    id: "CS-DF-58",
    product: "Fairy Meadows 2-Piece",
    style: "CCN-LAWN-FAIRY",
    process: "Dyeing",
    standard: 385,
    actual: 412,
    variance: 27,
    status: "Active",
    revised: "2026-08-28",
  },
  {
    id: "CS-LAWN-60",
    product: "Printed Lawn Fabric (60\")",
    style: "LAWN-60",
    process: "Cutting / Stitch",
    standard: 265,
    actual: 258,
    variance: -7,
    status: "Draft",
    revised: "2026-08-30",
  },
];

export default function CostSheetsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Sheets"
        description="Standard and actual cost builds by style and process."
        breadcrumbs={[
          { label: "Costing", href: "/costing" },
          { label: "Cost Sheets" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Cost sheet created",
                description: "CS-TS-28 draft from BOM CCN-KAFT-PRISM.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New sheet
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "act", label: "Active sheets", value: String(sheets.filter((s) => s.status === "Active").length), tone: "info" },
          { id: "adv", label: "Adverse variance", value: String(sheets.filter((s) => s.variance > 0).length), tone: "error" },
          { id: "fav", label: "Favorable", value: String(sheets.filter((s) => s.variance < 0).length), tone: "success" },
          { id: "avg", label: "Avg variance", value: formatCurrency(Math.round(sheets.reduce((s, x) => s + x.variance, 0) / sheets.length)) },
        ]}
      />

      <DataTable
        data={sheets as unknown as Record<string, unknown>[]}
        searchKeys={["id", "product", "style", "process", "status"]}
        searchPlaceholder="Search cost sheets..."
        statusKey="status"
        rowHref={(row) => `/costing/sheets/${row.id}`}
        columns={[
          { key: "id", label: "Sheet" },
          { key: "product", label: "Product" },
          { key: "style", label: "Style" },
          { key: "process", label: "Process" },
          {
            key: "standard",
            label: "Standard",
            render: (row) => formatCurrency(Number(row.standard)),
          },
          {
            key: "actual",
            label: "Actual",
            render: (row) => formatCurrency(Number(row.actual)),
          },
          {
            key: "variance",
            label: "Variance",
            render: (row) => {
              const v = Number(row.variance);
              return (
                <span className={v > 0 ? "font-semibold text-rose-600" : "font-semibold text-emerald-600"}>
                  {v > 0 ? "+" : ""}
                  {formatCurrency(v)}
                </span>
              );
            },
          },
          { key: "revised", label: "Revised" },
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
