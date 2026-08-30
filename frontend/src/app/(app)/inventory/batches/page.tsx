"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

const batches = [
  { id: "BT-CTN-882", item: "Raw Cotton Grade A", sku: "RM-CTN-A", qty: 50000, unit: "KG", plant: "Karachi Plant", status: "Released", qc: "Pass", expiry: "—", linked: "PO-4401" },
  { id: "BT-DYE-441", item: "Dyed Fabric Reactive Navy", sku: "FAB-DYE-200", qty: 12000, unit: "MTR", plant: "Faisalabad Plant", status: "Hold", qc: "Fail", expiry: "—", linked: "PRO-7002" },
  { id: "BT-TS-1024", item: "Men's T-Shirt", sku: "GAR-TSH-MENS", qty: 4200, unit: "PCS", plant: "Lahore Plant", status: "WIP", qc: "Conditional", expiry: "—", linked: "PRO-7001" },
  { id: "BT-YRN-771", item: "Cotton Yarn 30s", sku: "YRN-CTN-30S", qty: 15000, unit: "KG", plant: "Faisalabad Plant", status: "Released", qc: "Pass", expiry: "—", linked: "PO-4403" },
  { id: "BT-PO-990", item: "Polo Shirt", sku: "GAR-POL-MENS", qty: 6000, unit: "PCS", plant: "Lahore Plant", status: "Closed", qc: "Pass", expiry: "—", linked: "SO-1026" },
  { id: "BT-CHM-220", item: "Reactive Dye Navy", sku: "CHM-DYE-NVY", qty: 720, unit: "KG", plant: "Faisalabad Plant", status: "Released", qc: "Pass", expiry: "2027-02-01", linked: "GRN-8802" },
];

export default function BatchesPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches & Lots"
        description="Traceability for fiber, yarn, dye lots and garment production batches."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Batches & Lots" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Batch created",
                description: "BT-TS-1025 opened for cutting lot.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New batch
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Active batches", value: String(batches.filter((b) => b.status !== "Closed").length) },
          { id: "hold", label: "QC hold", value: String(batches.filter((b) => b.status === "Hold").length), tone: "error" },
          { id: "wip", label: "WIP lots", value: String(batches.filter((b) => b.status === "WIP").length), tone: "warning" },
          { id: "pass", label: "Released", value: String(batches.filter((b) => b.status === "Released").length), tone: "success" },
        ]}
      />

      <DataTable
        data={batches as unknown as Record<string, unknown>[]}
        searchKeys={["id", "item", "sku", "plant", "status", "qc", "linked"]}
        searchPlaceholder="Search batches..."
        statusKey="status"
        columns={[
          { key: "id", label: "Batch" },
          { key: "item", label: "Item" },
          { key: "sku", label: "SKU" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
          },
          { key: "plant", label: "Plant" },
          {
            key: "qc",
            label: "QC",
            render: (row) => <Badge variant={statusTone(String(row.qc))}>{String(row.qc)}</Badge>,
          },
          {
            key: "linked",
            label: "Linked",
            render: (row) => {
              const ref = String(row.linked);
              const href = ref.startsWith("PRO")
                ? `/production/orders/${ref}`
                : ref.startsWith("PO")
                  ? `/procurement/orders/${ref}`
                  : ref.startsWith("QC")
                    ? `/quality/inspections/${ref}`
                    : undefined;
              return href ? (
                <Link href={href} className="font-medium text-[var(--brand-primary)] hover:underline">
                  {ref}
                </Link>
              ) : (
                ref
              );
            },
          },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
