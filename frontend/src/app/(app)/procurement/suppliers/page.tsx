"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { suppliers, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Plus, Star } from "lucide-react";

export default function SuppliersPage() {
  const { toast } = useToast();
  const avgQuality = Math.round(suppliers.reduce((s, x) => s + x.qualityScore, 0) / suppliers.length);
  const avgOnTime = Math.round(suppliers.reduce((s, x) => s + x.onTime, 0) / suppliers.length);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Approved fiber, yarn, chemical and accessory vendors with scorecards."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Suppliers" },
        ]}
        actions={
          <Button onClick={() => toast({ title: "Supplier onboarding started", description: "Draft vendor SU-505 created.", tone: "success" })}>
            <Plus className="size-4" /> Add supplier
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "total", label: "Vendors", value: String(suppliers.length) },
          { id: "pref", label: "Preferred", value: String(suppliers.filter((s) => s.status === "Preferred").length), tone: "success" },
          { id: "qs", label: "Avg quality score", value: `${avgQuality}%`, tone: "info" },
          { id: "ot", label: "Avg on-time", value: `${avgOnTime}%`, change: "+2.1%", trend: "up" },
        ]}
      />

      <DataTable
        data={suppliers as unknown as Record<string, unknown>[]}
        searchKeys={["id", "name", "category", "city", "status"]}
        searchPlaceholder="Search suppliers..."
        statusKey="status"
        rowHref={(row) => `/procurement/suppliers/${row.id}`}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Supplier" },
          { key: "category", label: "Category" },
          { key: "city", label: "City" },
          {
            key: "rating",
            label: "Rating",
            render: (row) => (
              <span className="inline-flex items-center gap-1 font-medium">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {Number(row.rating).toFixed(1)}
              </span>
            ),
          },
          {
            key: "qualityScore",
            label: "Quality",
            render: (row) => `${formatNumber(Number(row.qualityScore))}%`,
          },
          {
            key: "onTime",
            label: "On-time",
            render: (row) => `${formatNumber(Number(row.onTime))}%`,
          },
          {
            key: "leadDays",
            label: "Lead",
            render: (row) => `${row.leadDays}d`,
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(String(row.status))}>{String(row.status)}</Badge>,
          },
        ]}
      />
    </div>
  );
}
