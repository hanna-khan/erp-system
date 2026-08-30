"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mrpRows, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

export default function MrpPage() {
  const { toast } = useToast();
  const shortages = mrpRows.filter((r) => r.shortage > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Material Requirements Planning"
        description="Net requirements for fabric, trims, chemicals and packaging against open PROs."
        breadcrumbs={[
          { label: "Planning", href: "/planning" },
          { label: "MRP" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "MRP regenerated",
                description: `${shortages.length} shortage lines flagged.`,
                tone: "info",
              })
            }
          >
            Re-run MRP
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "lines", label: "MRP lines", value: String(mrpRows.length) },
          { id: "short", label: "Shortages", value: String(shortages.length), tone: "error" },
          { id: "watch", label: "Watch", value: String(mrpRows.filter((r) => r.action === "Watch").length), tone: "warning" },
          { id: "ok", label: "Covered", value: String(mrpRows.filter((r) => r.action.startsWith("OK")).length), tone: "success" },
        ]}
      />

      <DataTable
        data={mrpRows as unknown as Record<string, unknown>[]}
        searchKeys={["item", "action", "neededBy"]}
        searchPlaceholder="Search MRP items..."
        columns={[
          { key: "item", label: "Item" },
          {
            key: "required",
            label: "Required",
            render: (row) => formatNumber(Number(row.required)),
          },
          {
            key: "available",
            label: "Available",
            render: (row) => formatNumber(Number(row.available)),
          },
          {
            key: "incoming",
            label: "Incoming",
            render: (row) => formatNumber(Number(row.incoming)),
          },
          {
            key: "shortage",
            label: "Shortage",
            render: (row) => (
              <span className={Number(row.shortage) > 0 ? "font-semibold text-rose-600" : ""}>
                {formatNumber(Number(row.shortage))}
              </span>
            ),
          },
          { key: "neededBy", label: "Needed by" },
          {
            key: "action",
            label: "Action",
            render: (row) => <Badge variant={statusTone(String(row.action))}>{String(row.action)}</Badge>,
          },
          {
            key: "actions",
            label: "",
            render: (row) =>
              String(row.action) === "Purchase" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "Requisition created",
                      description: `PR draft for ${String(row.item)} · shortage ${formatNumber(Number(row.shortage))}.`,
                      tone: "success",
                    });
                  }}
                >
                  <ShoppingCart className="size-3.5" /> Raise PR
                </Button>
              ) : String(row.action).includes("Incoming") ? (
                <Link href="/procurement/orders/PO-4404" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
                  View PO
                </Link>
              ) : null,
          },
        ]}
      />
    </div>
  );
}
