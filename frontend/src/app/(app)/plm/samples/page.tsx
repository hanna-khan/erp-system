"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: "SMP-101", style: "ST-BASIC-27", type: "Proto", size: "M", status: "Approved", owner: "PLM Team", due: "2026-08-10" },
  { id: "SMP-102", style: "ST-BASIC-27", type: "Fit", size: "L", status: "In Review", owner: "Nadia Sheikh", due: "2026-08-28" },
  { id: "SMP-103", style: "ST-POLO-26", type: "Size Set", size: "S-XXL", status: "Pending", owner: "PLM Team", due: "2026-09-05" },
  { id: "SMP-104", style: "ST-DF-58", type: "Lab Dip", size: "—", status: "Approved", owner: "Lab FSD", due: "2026-08-15" },
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
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Samples"
        description="Proto, fit, size-set and lab dips."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Samples" }]}
        actions={
          <Button
            onClick={() => {
              setRows((prev) => prev.map((r) => (r.id === "SMP-102" ? { ...r, status: "Approved" } : r)));
              toast({ title: "Sample approved", description: "SMP-102", tone: "success" });
            }}
          >
            Approve fit
          </Button>
        }
      />
      <DataTable data={rows} columns={columns} searchKeys={["id", "style", "type", "status"]} searchPlaceholder="Search samples..." />
    </div>
  );
}
