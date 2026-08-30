"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { quotations, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send } from "lucide-react";

type QuotationRow = (typeof quotations)[number] & Record<string, unknown>;

export default function QuotationsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Price offers for yarn, fabric, and garment programs with validity windows."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Quotations" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Quotation draft", description: "QT wizard opened.", tone: "info" })
            }
          >
            <Plus className="size-3.5" /> New quotation
          </Button>
        }
      />

      <DataTable<QuotationRow>
        data={quotations as QuotationRow[]}
        searchKeys={["id", "customer", "product", "status"]}
        searchPlaceholder="Search quotations…"
        statusKey="status"
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
