"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { inspections, statusTone } from "@/mock/data";
import { AlertTriangle, Bug, Plus, Scan, SearchCheck, Shield } from "lucide-react";

export default function QualityHubPage() {
  const { toast } = useToast();
  const failRate =
    (inspections.filter((i) => i.result === "Fail").length / inspections.length) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Control"
        description="Incoming, in-process and final inspections for lawn fabric and RTW garments."
        breadcrumbs={[{ label: "Manufacturing" }, { label: "Quality" }]}
        badge="QC"
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Inspection scheduled",
                description: "QC-1205 · Incoming lot BT-CTN-883.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New inspection
          </Button>
        }
      />

      <KpiGrid
        columns={5}
        items={[
          { id: "insp", label: "Inspections (7d)", value: String(inspections.length) },
          {
            id: "pass",
            label: "Pass rate",
            value: `${Math.round((inspections.filter((i) => i.result === "Pass").length / inspections.length) * 100)}%`,
            tone: "success",
          },
          { id: "fail", label: "Fail rate", value: `${failRate.toFixed(0)}%`, tone: "error" },
          {
            id: "def",
            label: "Defects logged",
            value: String(inspections.reduce((s, i) => s + i.defects, 0)),
            tone: "warning",
          },
          { id: "open", label: "Open NCRs", value: "3", tone: "info" },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { href: "/quality", label: "Dashboard", icon: Shield },
          { href: "/quality/inspections", label: "Inspections", icon: SearchCheck },
          { href: "/quality/defects", label: "Defects", icon: Bug },
          { href: "/quality/ncr", label: "NCR / CAPA", icon: AlertTriangle },
          { href: "/quality/fabric", label: "Fabric map", icon: Scan },
        ].map((m) => (
          <Link key={m.href + m.label} href={m.href} className="zr-card flex items-center gap-3 p-4 hover:shadow-[var(--shadow-sm)]">
            <m.icon className="size-5 text-[var(--brand-primary)]" />
            <span className="text-sm font-semibold">{m.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={inspections as unknown as Record<string, unknown>[]}
            searchKeys={["id", "type", "item", "batch", "result", "inspector"]}
            searchPlaceholder="Search inspections..."
            statusKey="result"
            rowHref={(row) => `/quality/inspections/${row.id}`}
            columns={[
              { key: "id", label: "QC #" },
              { key: "type", label: "Type" },
              { key: "item", label: "Item" },
              { key: "batch", label: "Batch" },
              { key: "defects", label: "Defects" },
              { key: "inspector", label: "Inspector" },
              { key: "date", label: "Date" },
              {
                key: "result",
                label: "Result",
                render: (row) => <Badge variant={statusTone(String(row.result))}>{String(row.result)}</Badge>,
              },
            ]}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Link href="/quality/inspections/QC-1203" className="block rounded-xl border border-rose-100 bg-rose-50/50 p-3 hover:bg-rose-50">
              <p className="font-medium text-rose-800">QC-1203 failed shade match</p>
              <p className="mt-1 text-xs text-rose-700/80">Blush Ombre · BT-OMBRE-441 · open NCR</p>
            </Link>
            <Link href="/quality/inspections/QC-1202" className="block rounded-xl border border-amber-100 bg-amber-50/50 p-3 hover:bg-amber-50">
              <p className="font-medium text-amber-900">QC-1202 conditional</p>
              <p className="mt-1 text-xs text-amber-800/80">Prism Kaftaan stitching · 42 defects · CAPA review</p>
            </Link>
            <Link href="/quality/fabric">
              <Button variant="outline" size="sm" className="w-full">
                Open fabric defect map
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
