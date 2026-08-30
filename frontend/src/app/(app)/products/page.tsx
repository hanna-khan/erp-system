"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { products, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Grid3x3, Layers, Plus, Workflow } from "lucide-react";

type ProductRow = (typeof products)[number] & Record<string, unknown>;

export default function ProductsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Yarn, fabric, and garment masters with GSM, width, and stock positions."
        breadcrumbs={[{ label: "Product" }, { label: "Products" }]}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/products/matrix">
                <Grid3x3 className="size-3.5" /> Color × Size
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/products/bom">
                <Layers className="size-3.5" /> BOM
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/products/processes">
                <Workflow className="size-3.5" /> Processes
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast({ title: "New product", description: "Product master form opened.", tone: "info" })
              }
            >
              <Plus className="size-3.5" /> Add product
            </Button>
          </>
        }
      />

      <DataTable<ProductRow>
        data={products as ProductRow[]}
        searchKeys={["id", "code", "name", "type", "category", "status"]}
        searchPlaceholder="Search products, codes, categories…"
        statusKey="status"
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
