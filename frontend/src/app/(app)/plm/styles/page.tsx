"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";

const initialStyles = [
  { id: "CCN-KAFT-PRISM", name: "Prism Kaftaan 2-Piece", season: "SS26", category: "Ready to Wear", customer: "Boutique Collective PK", status: "Approved", samples: 3 },
  { id: "CCN-RTW-MATCHA", name: "Matcha | 2-Piece", season: "SS26", category: "Ready to Wear", customer: "UK Desi Wear Ltd", status: "In Development", samples: 2 },
  { id: "CCN-LAWN-FAIRY", name: "Fairy Meadows 2-Piece", season: "Lawn 2026", category: "Lawn", customer: "Gulf Style Trading (UAE)", status: "Approved", samples: 1 },
  { id: "CCN-OMBRE-BLUSH", name: "Blush Ombre 2-Piece", season: "SS26", category: "Ombre", customer: "Karachi Multi-Brand Store", status: "Draft", samples: 0 },
];

type Row = (typeof initialStyles)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Style #" },
  { key: "name", label: "Name" },
  { key: "season", label: "Season" },
  { key: "category", label: "Category" },
  { key: "customer", label: "Customer" },
  { key: "samples", label: "Samples" },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PlmStylesPage() {
  const [rows, setRows] = useState(initialStyles as Row[]);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Styles"
        description="Style master for garments and fabric programs."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Styles" }]}
        actions={
          <>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/plm/samples">Samples</Link>
            </Button>
            <CreateRecordDialog
              triggerLabel="New style"
              title="Create style"
              description="Example: SS26 Prism Kaftaan for Boutique Collective PK."
              successTitle="Style created"
              fields={[
                { name: "id", label: "Style code", defaultValue: "CCN-KAFT-PRISM-V2" },
                { name: "name", label: "Style name", defaultValue: "Prism Kaftaan 2-Piece V2" },
                {
                  name: "season",
                  label: "Season",
                  type: "select",
                  options: ["SS27", "AW26", "SS26", "AW27"],
                  defaultValue: "SS27",
                },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  options: ["Ready to Wear", "Lawn", "Ombre", "Accessories"],
                  defaultValue: "Ready to Wear",
                },
                {
                  name: "customer",
                  label: "Customer",
                  type: "select",
                  options: ["Boutique Collective PK", "UK Desi Wear Ltd", "Gulf Style Trading (UAE)", "Karachi Multi-Brand Store"],
                  defaultValue: "Boutique Collective PK",
                },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: values.id,
                    name: values.name,
                    season: values.season,
                    category: values.category,
                    customer: values.customer,
                    status: "Draft",
                    samples: 0,
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
        searchKeys={["id", "name", "season", "customer", "status"]}
        searchPlaceholder="Search styles..."
        rowHref={(r) => "/plm/styles/" + r.id}
        statusKey="status"
        filterKey="status"
        exportName="plm-styles"
      />
    </div>
  );
}
