"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";

const initialAssets = [
  { id: "AST-1001", name: "Cutting Table-01", category: "Production Machine", plant: "SITE Karachi Plant", cost: 18500000, book: 11200000, acquired: "2019-03-01", status: "Active", linked: "M-C01" },
  { id: "AST-1002", name: "Print Table-01", category: "Production Machine", plant: "SITE Karachi Plant", cost: 42000000, book: 28600000, acquired: "2020-06-15", status: "Active", linked: "M-P01" },
  { id: "AST-1003", name: "Compressor Unit C-2", category: "Utilities", plant: "SITE Karachi Plant", cost: 3200000, book: 1800000, acquired: "2021-01-10", status: "Active", linked: "—" },
  { id: "AST-1004", name: "Forklift FL-04", category: "Material Handling", plant: "Karachi FG Warehouse", cost: 2100000, book: 980000, acquired: "2018-11-20", status: "Under Maintenance", linked: "—" },
  { id: "AST-1005", name: "ERP Servers Rack", category: "IT", plant: "Karachi HO", cost: 4500000, book: 2100000, acquired: "2022-04-01", status: "Active", linked: "—" },
  { id: "AST-1006", name: "Sewing Line-02", category: "Production Machine", plant: "SITE Karachi Plant", cost: 9800000, book: 6400000, acquired: "2021-09-12", status: "Breakdown", linked: "M-S02" },
];

type AssetRow = (typeof initialAssets)[number] & Record<string, unknown>;

const columns: Column<AssetRow>[] = [
  { key: "id", label: "Asset #" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "plant", label: "Location" },
  {
    key: "cost",
    label: "Acquisition",
    render: (row) => formatCurrency(row.cost),
  },
  {
    key: "book",
    label: "Book Value",
    render: (row) => formatCurrency(row.book),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
  },
  {
    key: "linked",
    label: "Machine",
    render: (row) =>
      row.linked !== "—" ? (
        <Link href={`/machines/${row.linked}`} className="text-[var(--brand-primary)] hover:underline">
          {row.linked}
        </Link>
      ) : (
        "—"
      ),
  },
];

export default function AssetsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(initialAssets as AssetRow[]);
  const totalBook = rows.reduce((s, a) => s + Number(a.book), 0);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Fixed Assets"
        description="Asset register linked to machines, depreciation and maintenance."
        breadcrumbs={[{ label: "Finance" }, { label: "Assets" }]}
        actions={
          <>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/finance">Finance hub</Link>
            </Button>
            <CreateRecordDialog
              triggerLabel="Add Asset"
              title="Register fixed asset"
              description="Example: capitalize a new finishing press at SITE Karachi."
              successTitle="Asset registered"
              fields={[
                { name: "name", label: "Asset name", defaultValue: "Finishing Press-02" },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  options: ["Production Machine", "Utilities", "Material Handling", "IT"],
                  defaultValue: "Production Machine",
                },
                {
                  name: "plant",
                  label: "Location",
                  type: "select",
                  options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub", "Karachi HO"],
                  defaultValue: "Online Fulfillment Hub",
                },
                { name: "cost", label: "Acquisition cost (PKR)", type: "number", defaultValue: "25000000" },
                { name: "acquired", label: "Acquired date", type: "date", defaultValue: "2026-08-30" },
                { name: "linked", label: "Linked machine ID", defaultValue: "—", required: false },
              ]}
              onCreate={(values) => {
                const cost = Number(values.cost) || 0;
                setRows((prev) => [
                  {
                    id: `AST-${1006 + prev.length}`,
                    name: values.name,
                    category: values.category,
                    plant: values.plant,
                    cost,
                    book: cost,
                    acquired: values.acquired,
                    status: "Active",
                    linked: values.linked || "—",
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />

      <KpiGrid
        items={[
          { id: "count", label: "Assets", value: String(rows.length) },
          { id: "book", label: "Book Value", value: formatCurrency(totalBook), tone: "info" },
          { id: "depr", label: "Depreciation MTD", value: "PKR 1.85M" },
          { id: "maint", label: "Under Maintenance", value: String(rows.filter((r) => r.status === "Under Maintenance").length), tone: "warning" },
        ]}
        columns={4}
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "name", "category", "plant", "status"]}
        searchPlaceholder="Search assets..."
        statusKey="status"
        filterKey="status"
        exportName="assets"
        actions={
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              toast({
                title: "Depreciation run",
                description: `Posted for ${formatNumber(rows.length)} assets.`,
                tone: "success",
              })
            }
          >
            Run depreciation
          </Button>
        }
      />
    </div>
  );
}
