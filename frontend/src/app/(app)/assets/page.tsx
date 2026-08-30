"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

const assets = [
  { id: "AST-1001", name: "Loom-001", category: "Production Machine", plant: "Faisalabad Plant", cost: 18500000, book: 11200000, acquired: "2019-03-01", status: "Active", linked: "M-L001" },
  { id: "AST-1002", name: "Dyeing Machine-01", category: "Production Machine", plant: "Faisalabad Plant", cost: 42000000, book: 28600000, acquired: "2020-06-15", status: "Active", linked: "M-D01" },
  { id: "AST-1003", name: "Compressor Unit C-2", category: "Utilities", plant: "Karachi Plant", cost: 3200000, book: 1800000, acquired: "2021-01-10", status: "Active", linked: "—" },
  { id: "AST-1004", name: "Forklift FL-04", category: "Material Handling", plant: "Lahore Plant", cost: 2100000, book: 980000, acquired: "2018-11-20", status: "Under Maintenance", linked: "—" },
  { id: "AST-1005", name: "ERP Servers Rack", category: "IT", plant: "Karachi HO", cost: 4500000, book: 2100000, acquired: "2022-04-01", status: "Active", linked: "—" },
  { id: "AST-1006", name: "Sewing Line-02", category: "Production Machine", plant: "Lahore Plant", cost: 9800000, book: 6400000, acquired: "2021-09-12", status: "Breakdown", linked: "M-S02" },
];

type AssetRow = (typeof assets)[number] & Record<string, unknown>;

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
  const totalBook = assets.reduce((s, a) => s + a.book, 0);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Fixed Assets"
        description="Asset register linked to machines, depreciation and maintenance."
        breadcrumbs={[{ label: "Finance" }, { label: "Assets" }]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/finance">Finance hub</Link>
            </Button>
            <Button
              onClick={() =>
                toast({ title: "Asset registered", description: "AST-1007 added to register.", tone: "success" })
              }
            >
              <Plus className="size-4" /> Add Asset
            </Button>
          </>
        }
      />

      <KpiGrid
        items={[
          { id: "count", label: "Assets", value: String(assets.length) },
          { id: "book", label: "Book Value", value: formatCurrency(totalBook), tone: "info" },
          { id: "depr", label: "Depreciation MTD", value: "PKR 1.85M" },
          { id: "maint", label: "Under Maintenance", value: "1", tone: "warning" },
        ]}
        columns={4}
      />

      <DataTable
        data={assets as AssetRow[]}
        columns={columns}
        searchKeys={["id", "name", "category", "plant", "status"]}
        searchPlaceholder="Search assets..."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast({
                title: "Depreciation run",
                description: `Posted for ${formatNumber(assets.length)} assets.`,
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
