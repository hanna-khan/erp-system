"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { products, statusTone } from "@/mock/data";
import { Grid3x3, Layers, Workflow } from "lucide-react";

type ProductRow = {
  id: string;
  code: string;
  name: string;
  type: string;
  category: string;
  unit: string;
  gsm: number | null;
  width: number | null;
  status: string;
  stock: number;
  price: number;
} & Record<string, unknown>;

export default function ProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>(products as ProductRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Products"
        description="Lawn, ombre and RTW garment masters with GSM, width, and stock positions."
        breadcrumbs={[{ label: "Product" }, { label: "Products" }]}
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/products/matrix">
                <Grid3x3 className="size-3.5" /> Color × Size
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/products/bom">
                <Layers className="size-3.5" /> BOM
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/products/processes">
                <Workflow className="size-3.5" /> Processes
              </Link>
            </Button>
            <CreateRecordDialog
              triggerLabel="Add product"
              title="Create product"
              description="Example: a 180 GSM cotton jersey for men's tees."
              successTitle="Product created"
              fields={[
                { name: "name", label: "Product name", defaultValue: "Cotton Jersey 180 GSM" },
                { name: "code", label: "SKU code", defaultValue: "FAB-CTN-JSY-180" },
                {
                  name: "type",
                  label: "Type",
                  type: "select",
                  options: ["Fabric", "Garment", "Accessory"],
                  defaultValue: "Fabric",
                },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  options: ["Lawn", "Ombre", "Ready to Wear", "Accessories"],
                  defaultValue: "Ready to Wear",
                },
                { name: "gsm", label: "GSM", type: "number", defaultValue: "180", required: false },
                { name: "width", label: "Width (inches)", type: "number", defaultValue: "58", required: false },
                {
                  name: "unit",
                  label: "Unit",
                  type: "select",
                  options: ["KG", "MTR", "PCS"],
                  defaultValue: "MTR",
                },
                { name: "price", label: "Price (PKR)", type: "number", defaultValue: "285" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `PR-NEW-${prev.length + 1}`,
                    code: values.code,
                    name: values.name,
                    type: values.type,
                    category: values.category,
                    unit: values.unit,
                    gsm: values.gsm ? Number(values.gsm) : null,
                    width: values.width ? Number(values.width) : null,
                    status: "Active",
                    stock: 0,
                    price: Number(values.price) || 0,
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />

      <DataTable<ProductRow>
        data={rows}
        searchKeys={["id", "code", "name", "type", "category", "status"]}
        searchPlaceholder="Search products, codes, categories…"
        statusKey="status"
        filterKey="status"
        exportName="products"
        rowHref={(row) => `/products/${row.id}`}
        columns={[
          { key: "id", label: "ID" },
          { key: "code", label: "SKU" },
          { key: "name", label: "Name" },
          { key: "type", label: "Type" },
          { key: "category", label: "Category" },
          {
            key: "gsm",
            label: "GSM",
            render: (row) => (row.gsm != null ? String(row.gsm) : "—"),
          },
          {
            key: "width",
            label: "Width",
            render: (row) => (row.width != null ? `${row.width}"` : "—"),
          },
          { key: "unit", label: "UoM" },
          {
            key: "stock",
            label: "Stock",
            render: (row) => formatNumber(row.stock),
          },
          {
            key: "price",
            label: "Price",
            render: (row) => formatCurrency(row.price),
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
