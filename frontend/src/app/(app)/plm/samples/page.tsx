"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: "SMP-101", style: "CCN-KAFT-PRISM", type: "Proto", size: "M", status: "Approved", owner: "PLM Team", due: "2026-08-10" },
  { id: "SMP-102", style: "CCN-KAFT-PRISM", type: "Fit", size: "L", status: "In Review", owner: "Mehreen Qazi", due: "2026-08-28" },
  { id: "SMP-103", style: "CCN-RTW-MATCHA", type: "Size Set", size: "S-XXL", status: "Pending", owner: "PLM Team", due: "2026-09-05" },
  { id: "SMP-104", style: "CCN-LAWN-FAIRY", type: "Lab Dip", size: "—", status: "Approved", owner: "Lab FSD", due: "2026-08-15" },
];

type Row = (typeof seed)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Sample #" },
  { key: "style", label: "Style", render: (r) => <Link href={"/plm/styles/" + r.style} className="text-[var(--brand-primary)] hover:underline">{r.style}</Link> },
  { key: "type", label: "Type" },
  { key: "size", label: "Size" },
  { key: "owner", label: "Owner" },
  { key: "due", label: "Due" },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function SamplesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(seed as Row[]);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Samples"
        description="Proto, fit, size-set and lab dips."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Samples" }]}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setRows((prev) => prev.map((r) => (r.id === "SMP-102" ? { ...r, status: "Approved" } : r)));
                toast({ title: "Sample approved", description: "SMP-102", tone: "success" });
              }}
            >
              Approve fit
            </Button>
            <CreateRecordDialog
              triggerLabel="New sample"
              title="Create sample"
              description="Example: fit sample in size L for CCN-KAFT-PRISM."
              successTitle="Sample created"
              fields={[
                {
                  name: "style",
                  label: "Style",
                  type: "select",
                  options: ["CCN-KAFT-PRISM", "CCN-RTW-MATCHA", "CCN-LAWN-FAIRY", "CCN-OMBRE-BLUSH"],
                  defaultValue: "CCN-KAFT-PRISM",
                },
                {
                  name: "type",
                  label: "Sample type",
                  type: "select",
                  options: ["Proto", "Fit", "Size Set", "Lab Dip", "SMS"],
                  defaultValue: "Fit",
                },
                { name: "size", label: "Size", defaultValue: "M" },
                { name: "owner", label: "Owner", defaultValue: "PLM Team" },
                { name: "due", label: "Due date", type: "date", defaultValue: "2026-09-15" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `SMP-${104 + prev.length}`,
                    style: values.style,
                    type: values.type,
                    size: values.size,
                    status: "Pending",
                    owner: values.owner,
                    due: values.due,
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />
      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "style", "type", "status"]}
        searchPlaceholder="Search samples..."
        statusKey="status"
        filterKey="status"
        exportName="plm-samples"
      />
    </div>
  );
}
