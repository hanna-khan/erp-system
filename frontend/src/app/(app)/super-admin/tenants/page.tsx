"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tenants, statusTone } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type Row = (typeof tenants)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Tenant" },
  { key: "plan", label: "Plan" },
  { key: "users", label: "Users" },
  { key: "storage", label: "Storage" },
  { key: "mrr", label: "MRR", render: (r) => formatCurrency(r.mrr) },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function TenantsPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Tenants"
        description="All textile mills on Zendrock."
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Tenants" }]}
        actions={<Button onClick={() => toast({ title: "Tenant wizard", description: "Provision flow opened.", tone: "info" })}><Plus className="size-4" /> New tenant</Button>}
      />
      <DataTable data={tenants as Row[]} columns={columns} searchKeys={["id", "name", "plan", "status"]} searchPlaceholder="Search tenants..." />
    </div>
  );
}
