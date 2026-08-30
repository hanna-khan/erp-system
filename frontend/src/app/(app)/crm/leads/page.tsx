"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { leads, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserPlus } from "lucide-react";

type LeadRow = (typeof leads)[number] & Record<string, unknown>;

export default function LeadsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Capture and qualify domestic & export textile inquiries."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Leads" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({
                title: "New lead",
                description: "Lead capture form would open here.",
                tone: "info",
              })
            }
          >
            <Plus className="size-3.5" /> Add lead
          </Button>
        }
      />

      <DataTable<LeadRow>
        data={leads as LeadRow[]}
        searchKeys={["id", "company", "contact", "source", "owner", "status"]}
        searchPlaceholder="Search leads, companies, owners…"
        statusKey="status"
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
            render: (row) => formatCurrency(row.value),
          },
          {
            key: "closeDate",
            label: "Target close",
            render: (row) => formatDate(row.closeDate),
          },
        ]}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast({
                title: "Converted",
                description: "Selected leads would convert to opportunities.",
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
