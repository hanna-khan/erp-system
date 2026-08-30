"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { company, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Download, FileText, Printer } from "lucide-react";

const shipments: Record<
  string,
  {
    so: string;
    customer: string;
    mode: string;
    origin: string;
    destination: string;
    qty: number;
    unit: string;
    value: number;
    status: string;
    container: string;
    product: string;
    hsCode: string;
  }
> = {
  "SH-5501": {
    so: "SO-1025",
    customer: "Gulf Style Trading (UAE)",
    mode: "Sea FCL",
    origin: "Port Qasim",
    destination: "Jebel Ali",
    qty: 12000,
    unit: "MTR",
    value: 5040000,
    status: "In Transit",
    container: "MSCU4829910",
    product: "Fairy Meadows 2-Piece · Navy · 200 GSM",
    hsCode: "5208.52",
  },
  "SH-5502": {
    so: "SO-1026",
    customer: "UK Desi Wear Ltd",
    mode: "Air",
    origin: "KHI",
    destination: "LHR",
    qty: 6000,
    unit: "PCS",
    value: 8700000,
    status: "Delivered",
    container: "AWB-99102",
    product: "Matcha | 2-Piece · Assorted",
    hsCode: "6105.10",
  },
};

export default function DispatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const sh = shipments[id] ?? shipments["SH-5501"];

  const exportDoc = (name: string) =>
    toast({ title: `${name} generated`, description: "PDF ready for download (mock).", tone: "success" });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Shipment ${id}`}
        description={`${sh.customer} · ${sh.mode} · ${sh.origin} → ${sh.destination}`}
        breadcrumbs={[
          { label: "Dispatch", href: "/dispatch" },
          { label: id },
        ]}
        badge={sh.status}
        actions={
          <>
            <Button variant="outline" onClick={() => exportDoc("Packing list")}>
              <Printer className="size-4" /> Print
            </Button>
            <Button onClick={() => exportDoc("Commercial invoice")}>
              <Download className="size-4" /> Export docs
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Status" value={sh.status} tone="warning" />
        <StatPill label="Container / AWB" value={sh.container} tone="info" />
        <StatPill label="Qty" value={`${formatNumber(sh.qty)} ${sh.unit}`} />
        <StatPill label="Value" value={formatCurrency(sh.value)} />
        <StatPill label="Sales Order" value={sh.so} />
      </div>

      <Tabs defaultValue="invoice">
        <TabsList>
          <TabsTrigger value="invoice">Commercial Invoice</TabsTrigger>
          <TabsTrigger value="packing">Packing List</TabsTrigger>
          <TabsTrigger value="container">Container</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Commercial Invoice</CardTitle>
                <p className="mt-1 text-sm text-[var(--muted)]">CI-{id.replace("SH-", "")} · {company.name}</p>
              </div>
              <Badge variant={statusTone(sh.status)}>{sh.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="zr-label">Exporter</p>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-[var(--muted)]">{company.address}, {company.city}</p>
                  <p className="text-[var(--muted)]">NTN {company.ntn}</p>
                </div>
                <div>
                  <p className="zr-label">Consignee</p>
                  <p className="font-medium">{sh.customer}</p>
                  <p className="text-[var(--muted)]">{sh.destination}</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--surface-muted)] text-[11px] uppercase text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">HS</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[var(--border)]">
                      <td className="px-4 py-3">{sh.product}</td>
                      <td className="px-4 py-3">{sh.hsCode}</td>
                      <td className="px-4 py-3">{formatNumber(sh.qty)} {sh.unit}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(sh.value)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => exportDoc("Commercial invoice")}>
                  <FileText className="size-3.5" /> Download CI
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/sales/orders/${sh.so}`}>Open SO</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/finance/ar">Post to AR</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packing">
          <Card>
            <CardHeader>
              <CardTitle>Packing List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--surface-muted)] text-[11px] uppercase text-[var(--muted)]">
                    <tr>
                      <th className="px-4 py-2">Carton</th>
                      <th className="px-4 py-2">Contents</th>
                      <th className="px-4 py-2">Net kg</th>
                      <th className="px-4 py-2">Gross kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { c: "1–40", contents: "Rolls 1–40", net: 1850, gross: 1920 },
                      { c: "41–80", contents: "Rolls 41–80", net: 1820, gross: 1890 },
                      { c: "81–100", contents: "Rolls 81–100", net: 910, gross: 945 },
                    ].map((row) => (
                      <tr key={row.c} className="border-t border-[var(--border)]">
                        <td className="px-4 py-3">{row.c}</td>
                        <td className="px-4 py-3">{row.contents}</td>
                        <td className="px-4 py-3">{formatNumber(row.net)}</td>
                        <td className="px-4 py-3">{formatNumber(row.gross)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="mt-4" size="sm" variant="outline" onClick={() => exportDoc("Packing list")}>
                Download packing list
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="container">
          <Card>
            <CardHeader>
              <CardTitle>Container / conveyance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div><p className="text-[var(--muted)]">Container / AWB</p><p className="font-semibold">{sh.container}</p></div>
              <div><p className="text-[var(--muted)]">Mode</p><p className="font-semibold">{sh.mode}</p></div>
              <div><p className="text-[var(--muted)]">Seal</p><p className="font-semibold">PK-SEAL-8821</p></div>
              <div><p className="text-[var(--muted)]">Vessel / Flight</p><p className="font-semibold">MSC ISTANBUL / PK-309</p></div>
              <div><p className="text-[var(--muted)]">Booking</p><p className="font-semibold">BK-QAS-44102</p></div>
              <div><p className="text-[var(--muted)]">Freight</p><p className="font-semibold">FOB Karachi</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="pt-6">
              <Timeline
                events={[
                  { id: "1", title: "Packing completed", time: "2026-08-26", meta: "Karachi FG Warehouse" },
                  { id: "2", title: "Export docs approved", time: "2026-08-27", meta: "Commercial + packing" },
                  { id: "3", title: "Gate-out to port", time: "2026-08-28", meta: sh.container },
                  { id: "4", title: "Vessel departed", time: "2026-08-29", meta: sh.origin },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
