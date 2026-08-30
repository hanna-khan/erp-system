"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { inspections, statusTone } from "@/mock/data";

const checklistById: Record<string, { item: string; result: string; note?: string }[]> = {
  "QC-1201": [
    { item: "Micronaire", result: "Pass", note: "4.2" },
    { item: "Trash content", result: "Pass", note: "Within limit" },
    { item: "Moisture", result: "Pass", note: "7.8%" },
  ],
  "QC-1202": [
    { item: "Measurement audit", result: "Conditional", note: "8 pcs out of tol." },
    { item: "Stitch defects", result: "Fail", note: "Skipped stitches" },
    { item: "Label placement", result: "Pass" },
    { item: "Shade consistency", result: "Pass" },
  ],
  "QC-1203": [
    { item: "Shade match vs standard", result: "Fail", note: "ΔE 2.8" },
    { item: "Color fastness", result: "Pass" },
    { item: "Width / GSM", result: "Pass", note: "200 GSM" },
    { item: "Hand feel", result: "Conditional" },
  ],
  "QC-1204": [
    { item: "AQL sample", result: "Pass", note: "6 minor" },
    { item: "Packing audit", result: "Pass" },
  ],
};

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const qc = inspections.find((i) => i.id === id);
  if (!qc) notFound();

  const checks = checklistById[qc.id] ?? [{ item: "General inspection", result: qc.result }];

  return (
    <div className="space-y-6">
      <PageHeader
        title={qc.id}
        description={`${qc.type} · ${qc.item} · Batch ${qc.batch}`}
        badge={qc.result}
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "Inspections", href: "/quality/inspections" },
          { label: qc.id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "NCR raised",
                  description: `NCR linked to ${qc.id}.`,
                  tone: "warning",
                })
              }
            >
              Raise NCR
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: "Disposition saved",
                  description: qc.result === "Fail" ? "Lot held for rework." : "Lot released.",
                  tone: "success",
                })
              }
            >
              Save disposition
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatPill label="Type" value={qc.type} tone="info" />
        <StatPill label="Result" value={qc.result} tone={qc.result === "Pass" ? "success" : qc.result === "Fail" ? "error" : "warning"} />
        <StatPill label="Defects" value={qc.defects} tone={qc.defects > 10 ? "warning" : "default"} />
        <StatPill label="Inspector" value={qc.inspector} />
        <StatPill label="Date" value={qc.date} />
      </div>

      <Tabs defaultValue="checks">
        <TabsList>
          <TabsTrigger value="checks">Checklist</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="checks">
          <Card>
            <CardHeader>
              <CardTitle>Inspection points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {checks.map((c) => (
                <div
                  key={c.item}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{c.item}</p>
                    {c.note ? <p className="text-xs text-[var(--muted)]">{c.note}</p> : null}
                  </div>
                  <Badge variant={statusTone(c.result)}>{c.result}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-6">
              <Link href="/inventory/batches">
                <Button size="sm" variant="outline">Batch {qc.batch}</Button>
              </Link>
              {qc.id === "QC-1202" ? (
                <Link href="/production/orders/PRO-7001">
                  <Button size="sm" variant="outline">PRO-7001</Button>
                </Link>
              ) : null}
              {qc.id === "QC-1203" ? (
                <>
                  <Link href="/production/orders/PRO-7002">
                    <Button size="sm" variant="outline">PRO-7002</Button>
                  </Link>
                  <Link href="/quality/fabric">
                    <Button size="sm" variant="outline">Fabric defect map</Button>
                  </Link>
                  <Link href="/quality/ncr">
                    <Button size="sm" variant="outline">Open NCR</Button>
                  </Link>
                </>
              ) : null}
              {qc.type === "Incoming" ? (
                <Link href="/procurement/receipts">
                  <Button size="sm" variant="outline">Goods receipts</Button>
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="pt-6">
              <Timeline
                events={[
                  { id: "1", title: "Inspection created", time: qc.date, meta: qc.type },
                  { id: "2", title: "Sample drawn", time: qc.date, meta: qc.batch },
                  { id: "3", title: `Result: ${qc.result}`, time: qc.date, meta: qc.inspector },
                  {
                    id: "4",
                    title: qc.result === "Fail" ? "Lot placed on hold" : "Disposition pending / released",
                    time: qc.date,
                    meta: `${qc.defects} defects`,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
