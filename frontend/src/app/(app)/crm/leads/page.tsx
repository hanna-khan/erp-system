"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { leads, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

type LeadRow = {
  id: string;
  company: string;
  contact: string;
  source: string;
  industry: string;
  status: string;
  owner: string;
  value: number;
  closeDate: string;
} & Record<string, unknown>;

export default function LeadsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<LeadRow[]>(leads as LeadRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Leads"
        description="People or companies interested in buying from you. Qualify them, then convert to opportunities."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Leads" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Add lead"
            title="Capture new lead"
            description="Example: a boutique wants lawn / RTW wholesale prices."
            successTitle="Lead added"
            fields={[
              { name: "company", label: "Company", placeholder: "USA South Asian Boutique", defaultValue: "New Prospect Co." },
              { name: "contact", label: "Contact person", placeholder: "Ali Rehman", defaultValue: "New Contact" },
              {
                name: "source",
                label: "Source",
                type: "select",
                options: ["Exhibition", "Referral", "Website", "Cold call", "WhatsApp"],
                defaultValue: "Website",
              },
              {
                name: "industry",
                label: "Industry",
                type: "select",
                options: ["Garments", "Retail", "Denim", "Modest fashion", "Export"],
                defaultValue: "Garments",
              },
              { name: "value", label: "Expected value (PKR)", type: "number", defaultValue: "2000000" },
              { name: "closeDate", label: "Target close", type: "date", defaultValue: "2026-10-15" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `LD-${2200 + prev.length + 1}`,
                  company: values.company,
                  contact: values.contact,
                  source: values.source,
                  industry: values.industry,
                  status: "New",
                  owner: "Areeba Malik",
                  value: Number(values.value) || 0,
                  closeDate: values.closeDate,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<LeadRow>
        data={rows}
        searchKeys={["id", "company", "contact", "source", "owner", "status"]}
        searchPlaceholder="Search leads, companies, owners…"
        statusKey="status"
        filterKey="status"
        exportName="leads"
        columns={[
          { key: "id", label: "Lead ID" },
          { key: "company", label: "Company" },
          { key: "contact", label: "Contact" },
          { key: "source", label: "Source" },
          { key: "industry", label: "Industry" },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
          },
          { key: "owner", label: "Owner" },
          {
            key: "value",
            label: "Est. value",
            render: (row) => formatCurrency(Number(row.value)),
          },
          {
            key: "closeDate",
            label: "Target close",
            render: (row) => formatDate(String(row.closeDate)),
          },
        ]}
        actions={
          <Button
            size="sm"
            variant="secondary"
            className="rounded-xl"
            onClick={() =>
              toast({
                title: "Lead converted",
                description: "Moved to Opportunities as a draft deal.",
                tone: "success",
              })
            }
          >
            <UserPlus className="size-3.5" /> Convert
          </Button>
        }
      />
    </div>
  );
}
