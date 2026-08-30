"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { bomLines, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const bomHeaders = [
  {
    id: "BOM-TS-27",
    style: "TS-BASIC-27",
    product: "Men's T-Shirt",
    version: "v3",
    status: "Released",
    components: bomLines.length,
    materialCost: bomLines.reduce((s, l) => s + l.cost, 0),
  },
  {
    id: "BOM-PO-26",
    style: "POLO-CORE-26",
    product: "Polo Shirt",
    version: "v2",
    status: "Released",
    components: 6,
    materialCost: 612,
  },
  {
    id: "BOM-DF-58",
    style: "DF-REAC-58",
    product: "Dyed Fabric Reactive",
    version: "v1",
    status: "Draft",
    components: 4,
    materialCost: 285,
  },
];

type BomRow = (typeof bomHeaders)[number] & Record<string, unknown>;

export default function BomListPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills of materials"
        description="Multi-level textile BOMs with scrap, waste, and component costing."
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "BOM" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => toast({ title: "New BOM", description: "BOM designer opened.", tone: "info" })}
          >
            <Plus className="size-3.5" /> Create BOM
          </Button>
        }
      />

      <DataTable<BomRow>
        data={bomHeaders as BomRow[]}
        searchKeys={["id", "style", "product", "status"]}
        searchPlaceholder="Search BOMs, styles…"
        statusKey="status"
        rowHref={(row) => `/products/bom/${row.id}`}
        columns={[
          { key: "id", label: "BOM" },
          { key: "style", label: "Style" },
          { key: "product", label: "Product" },
          { key: "version", label: "Version" },
          { key: "components", label: "Components" },
          {
            key: "materialCost",
            label: "Material cost",
            render: (row) => formatCurrency(row.materialCost),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}
