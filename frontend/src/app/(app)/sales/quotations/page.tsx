"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { quotations, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

type QuotationRow = {
  id: string;
  customer: string;
  product: string;
  qty: number;
  value: number;
  validTill: string;
  status: string;
} & Record<string, unknown>;

export default function QuotationsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<QuotationRow[]>(quotations as QuotationRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Quotations"
        description="Price offers for lawn and RTW wholesale programs with validity windows."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Quotations" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="New quotation"
            title="Create quotation"
            description="Example: quote 8,000 polo shirts for a Gulf retailer."
            successTitle="Quotation created"
            fields={[
              {
                name: "customer",
                label: "Customer",
                type: "select",
                options: ["Canada Desi Closet", "USA South Asian Boutique", "Karachi Multi-Brand Store", "Boutique Collective PK"],
                defaultValue: "Canada Desi Closet",
              },
              {
                name: "product",
                label: "Product",
                type: "select",
                options: ["Matcha | 2-Piece", "Prism Kaftaan 2-Piece", "Printed Lawn Fabric (60\")", "Fairy Meadows 2-Piece"],
                defaultValue: "Matcha | 2-Piece",
              },
              { name: "qty", label: "Quantity", type: "number", defaultValue: "8000" },
              { name: "value", label: "Quote value (PKR)", type: "number", defaultValue: "11600000" },
              { name: "validTill", label: "Valid till", type: "date", defaultValue: "2026-09-30" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `QT-${8803 + prev.length}`,
                  customer: values.customer,
                  product: values.product,
                  qty: Number(values.qty) || 0,
                  value: Number(values.value) || 0,
                  validTill: values.validTill,
                  status: "Draft",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<QuotationRow>
        data={rows}
        searchKeys={["id", "customer", "product", "status"]}
        searchPlaceholder="Search quotations…"
        statusKey="status"
        filterKey="status"
        exportName="quotations"
        columns={[
          { key: "id", label: "Quote" },
          { key: "customer", label: "Customer" },
          { key: "product", label: "Product" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => row.qty.toLocaleString(),
          },
          {
            key: "value",
            label: "Value",
            render: (row) => formatCurrency(row.value),
          },
          {
            key: "validTill",
            label: "Valid till",
            render: (row) => formatDate(row.validTill),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
          },
        ]}
        actions={
          <Button
            size="sm"
            variant="secondary"
            className="rounded-xl"
            onClick={() =>
              toast({ title: "Quote sent", description: "Email with PDF attached.", tone: "success" })
            }
          >
            <Send className="size-3.5" /> Send
          </Button>
        }
      />
    </div>
  );
}
