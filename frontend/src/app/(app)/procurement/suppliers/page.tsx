"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { suppliers, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Star } from "lucide-react";

type SupplierRow = (typeof suppliers)[number] & Record<string, unknown>;

export default function SuppliersPage() {
  const [rows, setRows] = useState<SupplierRow[]>(suppliers as SupplierRow[]);
  const avgQuality = Math.round(rows.reduce((s, x) => s + Number(x.qualityScore), 0) / Math.max(rows.length, 1));
  const avgOnTime = Math.round(rows.reduce((s, x) => s + Number(x.onTime), 0) / Math.max(rows.length, 1));

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Suppliers"
        description="Approved lawn, embroidery, print and packaging vendors with scorecards."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Suppliers" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Add supplier"
            title="Onboard supplier"
            description="Example: a Faisalabad lawn mill for printed 60-inch fabric."
            successTitle="Supplier added"
            fields={[
              { name: "name", label: "Supplier name", defaultValue: "Indus Fiber Co." },
              {
                name: "category",
                label: "Category",
                type: "select",
                options: ["Lawn Fabric", "Embroidery", "Printing / Dyeing", "Accessories"],
                defaultValue: "Lawn Fabric",
              },
              { name: "city", label: "City", defaultValue: "Faisalabad" },
              { name: "leadDays", label: "Lead time (days)", type: "number", defaultValue: "7" },
              {
                name: "paymentTerms",
                label: "Payment terms",
                type: "select",
                options: ["Net 15", "Net 30", "Net 45"],
                defaultValue: "Net 30",
              },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `SU-${504 + prev.length}`,
                  name: values.name,
                  category: values.category,
                  city: values.city,
                  rating: 4.0,
                  leadDays: Number(values.leadDays) || 7,
                  qualityScore: 88,
                  onTime: 85,
                  paymentTerms: values.paymentTerms,
                  status: "Approved",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "total", label: "Vendors", value: String(rows.length) },
          { id: "pref", label: "Preferred", value: String(rows.filter((s) => s.status === "Preferred").length), tone: "success" },
          { id: "qs", label: "Avg quality score", value: `${avgQuality}%`, tone: "info" },
          { id: "ot", label: "Avg on-time", value: `${avgOnTime}%`, change: "+2.1%", trend: "up" },
        ]}
      />

      <DataTable
        data={rows as unknown as Record<string, unknown>[]}
        searchKeys={["id", "name", "category", "city", "status"]}
        searchPlaceholder="Search suppliers..."
        statusKey="status"
        filterKey="status"
        exportName="suppliers"
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
