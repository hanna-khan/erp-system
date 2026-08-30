"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { Download } from "lucide-react";

const ledger = [
  { id: "LG-901", date: "2026-08-29", sku: "CHM-DYE-NVY", item: "Reactive Dye Navy", type: "GRN", ref: "GRN-8802", qtyIn: 720, qtyOut: 0, balance: 480, warehouse: "FSD-CHM-01" },
  { id: "LG-902", date: "2026-08-29", sku: "GAR-TSH-MENS", item: "Men's T-Shirt FG", type: "Production Receipt", ref: "PRO-7001", qtyIn: 800, qtyOut: 0, balance: 28400, warehouse: "LHR-FG-01" },
  { id: "LG-903", date: "2026-08-28", sku: "RM-CTN-A", item: "Raw Cotton Grade A", type: "QC Hold", ref: "QC-1201", qtyIn: 0, qtyOut: 0, balance: 62400, warehouse: "KHI-RM-01" },
  { id: "LG-904", date: "2026-08-28", sku: "FAB-GREY-180", item: "Grey Fabric 180 GSM", type: "Issue to Dye", ref: "PRO-7002", qtyIn: 0, qtyOut: 4500, balance: 38500, warehouse: "FSD-WIP-01" },
  { id: "LG-905", date: "2026-08-27", sku: "YRN-CTN-30S", item: "Cotton Yarn 30s", type: "Issue to Weave", ref: "PRO-7003", qtyIn: 0, qtyOut: 2200, balance: 84200, warehouse: "FSD-RM-02" },
  { id: "LG-906", date: "2026-08-26", sku: "ACC-LABEL", item: "Neck Labels", type: "Reservation", ref: "PRO-7001", qtyIn: 0, qtyOut: 0, balance: 1250, warehouse: "LHR-ACC-01" },
  { id: "LG-907", date: "2026-08-22", sku: "YRN-CTN-30S", item: "Cotton Yarn 30s", type: "GRN", ref: "GRN-8801", qtyIn: 15000, qtyOut: 0, balance: 86400, warehouse: "FSD-RM-02" },
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
