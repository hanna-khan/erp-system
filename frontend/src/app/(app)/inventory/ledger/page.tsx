"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { Download } from "lucide-react";

const ledger = [
  { id: "LG-901", date: "2026-08-29", sku: "CHM-OMBRE-BLUSH", item: "Ombre Print Job — Blush", type: "GRN", ref: "GRN-8802", qtyIn: 720, qtyOut: 0, balance: 480, warehouse: "KHI-RM-01" },
  { id: "LG-902", date: "2026-08-29", sku: "CCN-KAFT-PRISM", item: "Prism Kaftaan 2-Piece FG", type: "Production Receipt", ref: "PRO-7001", qtyIn: 800, qtyOut: 0, balance: 840, warehouse: "KHI-FG-01" },
  { id: "LG-903", date: "2026-08-28", sku: "FAB-LAWN-60", item: "Printed Lawn Fabric (60\")", type: "QC Hold", ref: "QC-1201", qtyIn: 0, qtyOut: 0, balance: 18500, warehouse: "KHI-RM-01" },
  { id: "LG-904", date: "2026-08-28", sku: "FAB-OMBRE-BLUSH", item: "Blush Ombre Fabric", type: "Issue to Print", ref: "PRO-7004", qtyIn: 0, qtyOut: 2400, balance: 0, warehouse: "KHI-WIP-01" },
  { id: "LG-905", date: "2026-08-27", sku: "FAB-LAWN-60", item: "Printed Lawn Fabric (60\")", type: "Issue to Cut", ref: "PRO-7003", qtyIn: 0, qtyOut: 2200, balance: 16300, warehouse: "KHI-RM-01" },
  { id: "LG-906", date: "2026-08-26", sku: "ACC-TAG-CCN", item: "Cocoon Hang Tags", type: "Reservation", ref: "PRO-7001", qtyIn: 0, qtyOut: 0, balance: 1850, warehouse: "KHI-ACC-01" },
  { id: "LG-907", date: "2026-08-22", sku: "ACC-EMB-ORIGIN", item: "Origin Embroidery Panels", type: "GRN", ref: "GRN-8801", qtyIn: 2000, qtyOut: 0, balance: 2000, warehouse: "KHI-ACC-01" },
];

export default function StockLedgerPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Ledger"
        description="Chronological quantity movements with running balances by warehouse."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Stock Ledger" },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Ledger exported", description: "CSV download started.", tone: "info" })
            }
          >
            <Download className="size-4" /> Export ledger
          </Button>
        }
      />

      <DataTable
        data={ledger as unknown as Record<string, unknown>[]}
        searchKeys={["id", "sku", "item", "type", "ref", "warehouse"]}
        searchPlaceholder="Search ledger entries..."
        pageSize={10}
        columns={[
          { key: "date", label: "Date" },
          { key: "id", label: "Entry" },
          { key: "sku", label: "SKU" },
          { key: "item", label: "Item" },
          { key: "type", label: "Type" },
          { key: "ref", label: "Reference" },
          {
            key: "qtyIn",
            label: "In",
            render: (row) => (Number(row.qtyIn) ? formatNumber(Number(row.qtyIn)) : "—"),
          },
          {
            key: "qtyOut",
            label: "Out",
            render: (row) => (Number(row.qtyOut) ? formatNumber(Number(row.qtyOut)) : "—"),
          },
          {
            key: "balance",
            label: "Balance",
            render: (row) => formatNumber(Number(row.balance)),
          },
          { key: "warehouse", label: "Warehouse" },
        ]}
      />
    </div>
  );
}
