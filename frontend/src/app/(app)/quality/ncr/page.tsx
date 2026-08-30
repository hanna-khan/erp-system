"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Timeline } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { Plus } from "lucide-react";

const ncrs = [
  { id: "NCR-301", title: "Shade mismatch Navy reactive", source: "QC-1203", owner: "Nadia Sheikh", due: "2026-09-05", status: "Open", severity: "Critical", capa: "Rework dye lot / adjust recipe" },
  { id: "NCR-302", title: "Skipped stitches on Line-01", source: "QC-1202", owner: "Ahmed Raza", due: "2026-09-02", status: "In Progress", severity: "Major", capa: "Needle change + operator coaching" },
  { id: "NCR-303", title: "Label shortage impacting packing", source: "MRP", owner: "Omar Farooq", due: "2026-09-08", status: "Monitoring", severity: "Major", capa: "Expedite PO-4404" },
  { id: "NCR-304", title: "Trash content near limit", source: "QC-1201", owner: "Lab KHI", due: "2026-08-30", status: "Closed", severity: "Minor", capa: "Supplier feedback logged" },
];

export default function NcrPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="NCR / CAPA"
        description="Non-conformance reports and corrective / preventive actions."
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "NCR / CAPA" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "NCR drafted",
                description: "NCR-305 created from QC hold.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New NCR
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open NCRs", value: String(ncrs.filter((n) => n.status === "Open").length), tone: "error" },
          { id: "ip", label: "In progress", value: String(ncrs.filter((n) => n.status === "In Progress").length), tone: "warning" },
          { id: "mon", label: "Monitoring", value: String(ncrs.filter((n) => n.status === "Monitoring").length), tone: "info" },
          { id: "cl", label: "Closed", value: String(ncrs.filter((n) => n.status === "Closed").length), tone: "success" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={ncrs as unknown as Record<string, unknown>[]}
            searchKeys={["id", "title", "source", "owner", "status", "severity"]}
            searchPlaceholder="Search NCRs..."
            statusKey="status"
            columns={[
              { key: "id", label: "NCR" },
              { key: "title", label: "Title" },
              {
                key: "source",
                label: "Source",
                render: (row) =>
                  String(row.source).startsWith("QC") ? (
                    <Link
                      href={`/quality/inspections/${row.source}`}
                      className="font-medium text-[var(--brand-primary)] hover:underline"
                    >
                      {String(row.source)}
                    </Link>
                  ) : (
                    String(row.source)
                  ),
              },
              {
                key: "severity",
                label: "Severity",
                render: (row) => (
                  <Badge variant={statusTone(String(row.severity))}>{String(row.severity)}</Badge>
                ),
              },
              { key: "owner", label: "Owner" },
              { key: "due", label: "Due" },
              { key: "status", label: "Status" },
            ]}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>NCR-301 · CAPA trail</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              events={[
                { id: "1", title: "NCR opened from QC-1203", time: "2026-08-29", meta: "Shade ΔE 2.8" },
                { id: "2", title: "Lot BT-DYE-441 held", time: "2026-08-29", meta: "Warehouse FSD" },
                { id: "3", title: "Recipe review scheduled", time: "2026-08-30", meta: "Dyeing lab" },
                { id: "4", title: "Target close", time: "2026-09-05", meta: "Rework or downgrade" },
              ]}
            />
            <Button
              className="mt-4 w-full"
              variant="outline"
              onClick={() =>
                toast({
                  title: "CAPA updated",
                  description: "Rework batch booked on DYE-01.",
                  tone: "info",
                })
              }
            >
              Update CAPA
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
