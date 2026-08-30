"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { bomLines, statusTone } from "@/mock/data";

const bomHeaders = [
  {
    id: "BOM-TS-27",
    style: "CCN-KAFT-PRISM",
    product: "Prism Kaftaan 2-Piece",
    version: "v3",
    status: "Released",
    components: bomLines.length,
    materialCost: bomLines.reduce((s, l) => s + l.cost, 0),
  },
  {
    id: "BOM-PO-26",
    style: "CCN-RTW-MATCHA",
    product: "Matcha | 2-Piece",
    version: "v2",
    status: "Released",
    components: 6,
    materialCost: 612,
  },
  {
    id: "BOM-DF-58",
    style: "CCN-LAWN-FAIRY",
    product: "Fairy Meadows 2-Piece",
    version: "v1",
    status: "Draft",
    components: 4,
    materialCost: 285,
  },
];

type BomRow = (typeof bomHeaders)[number] & Record<string, unknown>;

export default function BomListPage() {
  const [rows, setRows] = useState<BomRow[]>(bomHeaders as BomRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Bills of materials"
        description="Multi-level textile BOMs with scrap, waste, and component costing."
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "BOM" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Create BOM"
            title="Create bill of materials"
            description="Example: BOM for a men's basic tee with fabric, thread, and labels."
            successTitle="BOM created"
            fields={[
              { name: "style", label: "Style code", defaultValue: "CCN-KAFT-PRISM-V2" },
              {
                name: "product",
                label: "Product",
                type: "select",
                options: ["Prism Kaftaan 2-Piece", "Matcha | 2-Piece", "Fairy Meadows 2-Piece", "Printed Lawn Fabric (60\")"],
                defaultValue: "Prism Kaftaan 2-Piece",
              },
              { name: "version", label: "Version", defaultValue: "v1" },
              { name: "components", label: "Component count", type: "number", defaultValue: "5" },
              { name: "materialCost", label: "Material cost (PKR)", type: "number", defaultValue: "420" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `BOM-${values.style}`,
                  style: values.style,
                  product: values.product,
                  version: values.version,
                  status: "Draft",
                  components: Number(values.components) || 0,
                  materialCost: Number(values.materialCost) || 0,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<BomRow>
        data={rows}
        searchKeys={["id", "style", "product", "status"]}
        searchPlaceholder="Search BOMs, styles…"
        statusKey="status"
        filterKey="status"
        exportName="bom"
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
