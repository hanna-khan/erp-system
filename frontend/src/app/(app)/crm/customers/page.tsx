"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { customers, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type CustomerRow = (typeof customers)[number] & Record<string, unknown>;

export default function CustomersPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Domestic distributors and export apparel brands buying yarn, fabric, and garments."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Customers" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Customer form", description: "New customer wizard opened.", tone: "info" })
            }
          >
            <Plus className="size-3.5" /> Add customer
          </Button>
        }
      />

      <DataTable<CustomerRow>
        data={customers as CustomerRow[]}
        searchKeys={["id", "name", "city", "type", "contact", "status"]}
        searchPlaceholder="Search customers…"
        statusKey="status"
        rowHref={(row) => `/crm/customers/${row.id}`}
        columns={[
          { key: "id", label: "Code" },
          { key: "name", label: "Customer" },
          {
            key: "type",
            label: "Type",
            render: (row) => (
              <Badge variant={row.type === "Export" ? "info" : "default"}>{row.type}</Badge>
            ),
          },
          { key: "city", label: "City" },
          { key: "contact", label: "Contact" },
          { key: "orders", label: "Orders" },
          {
            key: "outstanding",
            label: "Outstanding",
            render: (row) => formatCurrency(row.outstanding),
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
