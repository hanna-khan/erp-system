"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { inspections } from "@/mock/data";

type InspRow = (typeof inspections)[number] & Record<string, unknown>;

export default function InspectionsPage() {
  const [rows, setRows] = useState<InspRow[]>(inspections as InspRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Inspections"
        description="Incoming, in-process and final QC lots with defect counts."
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "Inspections" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Schedule inspection"
            title="Schedule inspection"
            description="Example: final QC on blush ombre lot BT-OMBRE-441."
            successTitle="Inspection scheduled"
            fields={[
              {
                name: "type",
                label: "Type",
                type: "select",
                options: ["Incoming", "In-Process", "Final"],
                defaultValue: "Final",
              },
              {
                name: "item",
                label: "Item",
                type: "select",
                options: ["Printed Lawn Fabric (60\")", "Prism Kaftaan 2-Piece", "Fairy Meadows 2-Piece", "Matcha | 2-Piece", "Printed Lawn Fabric (60\")"],
                defaultValue: "Fairy Meadows 2-Piece",
              },
              { name: "batch", label: "Batch / lot", defaultValue: "BT-OMBRE-442" },
              { name: "inspector", label: "Inspector", defaultValue: "Lab FSD" },
              { name: "date", label: "Date", type: "date", defaultValue: "2026-08-30" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `QC-${1204 + prev.length}`,
                  type: values.type,
                  item: values.item,
                  batch: values.batch,
                  result: "Pending",
                  inspector: values.inspector,
                  date: values.date,
                  defects: 0,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "in", label: "Incoming", value: String(rows.filter((i) => i.type === "Incoming").length), tone: "info" },
          { id: "ip", label: "In-process", value: String(rows.filter((i) => i.type === "In-Process").length), tone: "warning" },
          { id: "fin", label: "Final", value: String(rows.filter((i) => i.type === "Final").length) },
          { id: "fail", label: "Failed", value: String(rows.filter((i) => i.result === "Fail").length), tone: "error" },
        ]}
      />

      <DataTable
        data={rows as unknown as Record<string, unknown>[]}
        searchKeys={["id", "type", "item", "batch", "result", "inspector"]}
        searchPlaceholder="Search inspections..."
        statusKey="result"
        filterKey="result"
        exportName="inspections"
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
