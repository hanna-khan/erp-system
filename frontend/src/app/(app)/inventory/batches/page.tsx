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
  { id: "BT-LAWN-882", item: "Printed Lawn Fabric (60\")", sku: "FAB-LAWN-60", qty: 18500, unit: "MTR", plant: "SITE Karachi Plant", status: "Released", qc: "Pass", expiry: "—", linked: "PO-4401" },
  { id: "BT-OMBRE-441", item: "Blush Ombre Fabric", sku: "FAB-OMBRE-BLUSH", qty: 2400, unit: "MTR", plant: "SITE Karachi Plant", status: "Hold", qc: "Fail", expiry: "—", linked: "PRO-7004" },
  { id: "BT-PK-1024", item: "Prism Kaftaan 2-Piece", sku: "CCN-KAFT-PRISM", qty: 4200, unit: "PCS", plant: "Karachi FG Warehouse", status: "WIP", qc: "Conditional", expiry: "—", linked: "PRO-7001" },
  { id: "BT-EMB-771", item: "Origin Embroidery Panels", sku: "ACC-EMB-ORIGIN", qty: 2000, unit: "PCS", plant: "SITE Karachi Plant", status: "Released", qc: "Pass", expiry: "—", linked: "PO-4403" },
  { id: "BT-MT-990", item: "Matcha | 2-Piece", sku: "CCN-RTW-MATCHA", qty: 1200, unit: "PCS", plant: "Online Fulfillment Hub", status: "Closed", qc: "Pass", expiry: "—", linked: "SO-1026" },
  { id: "BT-OMBRE-220", item: "Ombre Print Job — Blush", sku: "FAB-OMBRE-BLUSH", qty: 3500, unit: "MTR", plant: "SITE Karachi Plant", status: "Released", qc: "Pass", expiry: "—", linked: "GRN-8802" },
];

export default function BatchesPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches & Lots"
        description="Traceability for lawn, ombre print lots and garment production batches."
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
