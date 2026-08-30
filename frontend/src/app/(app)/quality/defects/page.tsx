"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { Plus } from "lucide-react";

const defects = [
  { id: "DF-01", code: "ST-SKIP", name: "Skipped stitch", category: "Stitching", process: "Garments", count: 18, severity: "Major", batch: "BT-TS-1024", status: "Open", qc: "QC-1202" },
  { id: "DF-02", code: "ST-OPEN", name: "Open seam", category: "Stitching", process: "Garments", count: 9, severity: "Critical", batch: "BT-TS-1024", status: "Open", qc: "QC-1202" },
  { id: "DF-03", code: "SH-DELTA", name: "Shade variation", category: "Shade", process: "Dyeing", count: 12, severity: "Critical", batch: "BT-DYE-441", status: "Under CAPA", qc: "QC-1203" },
  { id: "DF-04", code: "FB-HOLE", name: "Hole / tear", category: "Fabric", process: "Weaving", count: 4, severity: "Major", batch: "BT-DYE-441", status: "Open", qc: "QC-1203" },
  { id: "DF-05", code: "FB-SLUB", name: "Slub / thick place", category: "Yarn", process: "Spinning", count: 6, severity: "Minor", batch: "BT-YRN-771", status: "Closed", qc: "QC-1201" },
  { id: "DF-06", code: "MEAS", name: "Measurement out of tol.", category: "Fit", process: "Garments", count: 8, severity: "Major", batch: "BT-TS-1024", status: "Open", qc: "QC-1202" },
];

export default function DefectsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Defect Catalog"
        description="Logged textile defects by process with severity and CAPA status."
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "Defects" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Defect logged",
                description: "DF-07 · Oil stain added to BT-TS-1024.",
                tone: "warning",
              })
            }
          >
            <Plus className="size-4" /> Log defect
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open defects", value: String(defects.filter((d) => d.status === "Open").length), tone: "warning" },
          { id: "crit", label: "Critical", value: String(defects.filter((d) => d.severity === "Critical").length), tone: "error" },
          { id: "capa", label: "Under CAPA", value: String(defects.filter((d) => d.status === "Under CAPA").length), tone: "info" },
          { id: "cnt", label: "Total occurrences", value: String(defects.reduce((s, d) => s + d.count, 0)) },
        ]}
      />

      <DataTable
        data={defects as unknown as Record<string, unknown>[]}
        searchKeys={["id", "code", "name", "category", "process", "batch", "status", "qc"]}
        searchPlaceholder="Search defects..."
        statusKey="status"
        columns={[
          { key: "code", label: "Code" },
          { key: "name", label: "Defect" },
          { key: "category", label: "Category" },
          { key: "process", label: "Process" },
          { key: "count", label: "Count" },
          {
            key: "severity",
            label: "Severity",
            render: (row) => (
              <Badge
                variant={
                  String(row.severity) === "Critical"
                    ? "error"
                    : String(row.severity) === "Major"
                      ? "warning"
                      : "outline"
                }
              >
                {String(row.severity)}
              </Badge>
            ),
          },
          { key: "batch", label: "Batch" },
          {
            key: "qc",
            label: "Inspection",
            render: (row) => (
              <Link
                href={`/quality/inspections/${row.qc}`}
                className="font-medium text-[var(--brand-primary)] hover:underline"
              >
                {String(row.qc)}
              </Link>
            ),
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
