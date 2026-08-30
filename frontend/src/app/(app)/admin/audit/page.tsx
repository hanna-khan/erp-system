"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { auditTrail } from "@/mock/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

type Row = (typeof auditTrail)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "timestamp", label: "When" },
  { key: "user", label: "User" },
  { key: "action", label: "Action" },
  { key: "previousValue", label: "Before", render: (r) => String(r.previousValue ?? "—") },
  { key: "newValue", label: "After", render: (r) => String(r.newValue ?? "—") },
];

export default function AdminAuditPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Audit log"
        description="Immutable change history for compliance."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Audit" }]}
        actions={
          <Button variant="outline" onClick={() => toast({ title: "Audit export", description: "CSV downloaded.", tone: "success" })}>
            <Download className="size-4" /> Export
          </Button>
        }
      />
      <DataTable data={auditTrail as Row[]} columns={columns} searchKeys={["user", "action", "newValue"]} searchPlaceholder="Search audit..." pageSize={10} />
    </div>
  );
}
