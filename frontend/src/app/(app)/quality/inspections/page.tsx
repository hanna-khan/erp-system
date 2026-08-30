"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { inspections } from "@/mock/data";
import { Plus } from "lucide-react";

export default function InspectionsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inspections"
        description="Incoming, in-process and final QC lots with defect counts."
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "Inspections" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Inspection created",
                description: "QC-1205 assigned to Lab FSD.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> Schedule inspection
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "in", label: "Incoming", value: String(inspections.filter((i) => i.type === "Incoming").length), tone: "info" },
          { id: "ip", label: "In-process", value: String(inspections.filter((i) => i.type === "In-Process").length), tone: "warning" },
          { id: "fin", label: "Final", value: String(inspections.filter((i) => i.type === "Final").length) },
          { id: "fail", label: "Failed", value: String(inspections.filter((i) => i.result === "Fail").length), tone: "error" },
        ]}
      />

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
          { key: "result", label: "Result" },
        ]}
      />
    </div>
  );
}
