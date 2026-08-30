"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { customers, statusTone } from "@/mock/data";

type CustomerRow = {
  id: string;
  name: string;
  type: string;
  city: string;
  outstanding: number;
  orders: number;
  status: string;
  contact: string;
  phone: string;
  email: string;
} & Record<string, unknown>;

export default function CustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>(customers as CustomerRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Customers"
        description="Domestic boutiques and export buyers of Cocoon lawn and RTW."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Customers" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Add customer"
            title="Create customer"
            description="Example: a Lahore boutique buying Prism Kaftaan and Fairy Meadows lawn."
            successTitle="Customer created"
            fields={[
              { name: "name", label: "Customer name", placeholder: "USA South Asian Boutique", defaultValue: "New Apparel Buyer" },
              {
                name: "type",
                label: "Type",
                type: "select",
                options: ["Domestic", "Export"],
                defaultValue: "Domestic",
              },
              { name: "city", label: "City", defaultValue: "Lahore" },
              { name: "contact", label: "Contact person", defaultValue: "Buying Manager" },
              { name: "phone", label: "Phone", defaultValue: "+92 42 0000 0000", required: false },
              { name: "email", label: "Email", type: "email", defaultValue: "orders@example.com", required: false },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `CU-${1005 + prev.length}`,
                  name: values.name,
                  type: values.type,
                  city: values.city,
                  outstanding: 0,
                  orders: 0,
                  status: "Active",
                  contact: values.contact,
                  phone: values.phone || "—",
                  email: values.email || "—",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<CustomerRow>
        data={rows}
        searchKeys={["id", "name", "city", "type", "contact", "status"]}
        searchPlaceholder="Search customers…"
        statusKey="status"
        filterKey="status"
        exportName="customers"
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
