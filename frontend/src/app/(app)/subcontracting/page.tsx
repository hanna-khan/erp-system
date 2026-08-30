"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { WorkflowStepper } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { WorkflowStep } from "@/types";
import { ArrowDownToLine, ArrowUpFromLine, Truck } from "lucide-react";

const subcontractJobs = [
  { id: "SC-801", vendor: "Pearl Dyeing Works", process: "Reactive Dyeing", item: "Grey Fabric 180 GSM", qty: 12000, unit: "MTR", status: "At Vendor", sent: "2026-08-22", eta: "2026-09-02", value: 2400000, so: "SO-1025" },
  { id: "SC-802", vendor: "Finishing Hub FSD", process: "Compacting", item: "Knitted Fabric", qty: 8500, unit: "KG", status: "In Transit Out", sent: "2026-08-29", eta: "2026-09-05", value: 980000, so: "SO-1024" },
  { id: "SC-803", vendor: "Pearl Dyeing Works", process: "Softener Finish", item: "Dyed Fabric Navy", qty: 6000, unit: "MTR", status: "Received", sent: "2026-08-10", eta: "2026-08-18", value: 720000, so: "SO-1026" },
  { id: "SC-804", vendor: "Print Masters", process: "Pigment Print", item: "Cotton Fabric", qty: 4000, unit: "MTR", status: "Draft", sent: "—", eta: "2026-09-12", value: 1100000, so: "SO-1027" },
];

type SCRow = (typeof subcontractJobs)[number] & Record<string, unknown>;

const columns: Column<SCRow>[] = [
  { key: "id", label: "Job #" },
  { key: "vendor", label: "Vendor" },
  { key: "process", label: "Process" },
  { key: "item", label: "Material" },
  {
    key: "qty",
    label: "Qty",
    render: (row) => `${formatNumber(row.qty)} ${row.unit}`,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
  },
  { key: "eta", label: "ETA" },
  {
    key: "value",
    label: "Value",
    render: (row) => formatCurrency(row.value),
  },
];

const sendWorkflow: WorkflowStep[] = [
  { id: "1", label: "Create SC Job", status: "completed", meta: "SC-801" },
  { id: "2", label: "Issue Gate Pass", status: "completed", meta: "GP-4421" },
  { id: "3", label: "Dispatch to Vendor", status: "completed", meta: "In transit" },
  { id: "4", label: "Vendor Process", status: "current", meta: "Dyeing" },
  { id: "5", label: "Receive + QC", status: "upcoming", href: "/quality/inspections", meta: "Pending" },
  { id: "6", label: "Stock Put-away", status: "upcoming", href: "/warehouse", meta: "FG/WIP" },
];

export default function SubcontractingPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(subcontractJobs as SCRow[]);
  const selected = rows[0];

  const markSent = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "In Transit Out", sent: "2026-08-30" } : r)),
    );
    toast({ title: "Material sent", description: `${id} gate-passed to vendor.`, tone: "success" });
  };

  const markReceived = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Received" } : r)),
    );
    toast({ title: "Material received", description: `${id} received — QC queue updated.`, tone: "success" });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Subcontracting"
        description="Send / receive fabric to dyeing and finishing vendors with full chain of custody."
        breadcrumbs={[{ label: "Operations" }, { label: "Subcontracting" }]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "New subcontract job", description: "SC-805 drafted.", tone: "info" })
            }
          >
            <Truck className="size-4" /> New SC Job
          </Button>
        }
      />

      <KpiGrid
        items={[
          { id: "open", label: "Open Jobs", value: String(rows.filter((r) => r.status !== "Received" && r.status !== "Draft").length), tone: "warning" },
          { id: "vendor", label: "Active Vendors", value: "3" },
          { id: "value", label: "WIP at Vendor", value: "PKR 3.4M", tone: "info" },
          { id: "late", label: "Overdue ETA", value: "1", tone: "error" },
        ]}
        columns={4}
      />

      <WorkflowStepper steps={sendWorkflow} title="Dyeing vendor workflow · SC-801" />

      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          <DataTable
            data={rows}
            columns={columns}
            searchKeys={["id", "vendor", "process", "item", "status"]}
            searchPlaceholder="Search subcontract jobs..."
            actions={
              <>
                <Button size="sm" variant="outline" onClick={() => markSent(selected.id)}>
                  <ArrowUpFromLine className="size-3.5" /> Send
                </Button>
                <Button size="sm" variant="outline" onClick={() => markReceived(selected.id)}>
                  <ArrowDownToLine className="size-3.5" /> Receive
                </Button>
              </>
            }
          />
        </TabsContent>
        <TabsContent value="send" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send to dyeing vendor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-[var(--muted)]">
                Issue grey fabric against SO, generate gate pass, and update inventory to “At Vendor”.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <StatPill label="Selected job" value={selected.id} />
                <StatPill label="Vendor" value={selected.vendor} tone="info" />
                <StatPill label="Qty" value={`${formatNumber(selected.qty)} ${selected.unit}`} />
                <StatPill label="Linked SO" value={selected.so} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => markSent(selected.id)}>
                  <ArrowUpFromLine className="size-4" /> Confirm Send
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/sales/orders/${selected.so}`}>View Sales Order</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[var(--muted)]">
              <p>✓ Lot / batch tagged</p>
              <p>✓ Shade reference attached</p>
              <p>✓ Gate pass printed</p>
              <p>○ Vendor acknowledgment pending</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="receive">
          <Card>
            <CardHeader>
              <CardTitle>Receive from vendor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--muted)]">
                Record returned meters/kg, moisture, shade, and route to QC before put-away.
              </p>
              <div className="flex flex-wrap gap-2">
                {rows
                  .filter((r) => r.status === "At Vendor" || r.status === "In Transit Out")
                  .map((r) => (
                    <Button key={r.id} variant="outline" onClick={() => markReceived(r.id)}>
                      Receive {r.id}
                    </Button>
                  ))}
              </div>
              <Button variant="outline" asChild>
                <Link href="/quality/inspections">Open QC inspections</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
