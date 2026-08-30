"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatPill } from "@/components/shared/kpi";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import { opportunities, statusTone } from "@/mock/data";

type OppRow = {
  id: string;
  name: string;
  customer: string;
  stage: string;
  probability: number;
  revenue: number;
  closeDate: string;
} & Record<string, unknown>;

const stages = ["Qualification", "Proposal", "Negotiation", "Won", "Lost"];

export default function OpportunitiesPage() {
  const [rows, setRows] = useState<OppRow[]>(opportunities as OppRow[]);

  const byStage = stages.map((stage) => ({
    stage,
    count: rows.filter((o) => o.stage === stage).length,
    value: rows.filter((o) => o.stage === stage).reduce((s, o) => s + Number(o.revenue), 0),
  }));

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Opportunities"
        description="Your sales pipeline — deals that can become real orders. Click New opportunity to add one."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Opportunities" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="New opportunity"
            title="Create opportunity"
            description="Add a potential deal. Example: a customer wants 10,000 Prism Kaftaan sets."
            successTitle="Opportunity created"
            fields={[
              { name: "name", label: "Opportunity name", placeholder: "Lawn 2026 Wholesale Drop", defaultValue: "New RTW / lawn program" },
              {
                name: "customer",
                label: "Customer",
                type: "select",
                options: ["Boutique Collective PK", "Gulf Style Trading (UAE)", "cocoon.pk Retail Customers", "UK Desi Wear Ltd"],
                defaultValue: "Boutique Collective PK",
              },
              {
                name: "stage",
                label: "Stage",
                type: "select",
                options: stages,
                defaultValue: "Qualification",
              },
              { name: "probability", label: "Win probability %", type: "number", defaultValue: "40" },
              { name: "revenue", label: "Expected revenue (PKR)", type: "number", defaultValue: "5000000" },
              { name: "closeDate", label: "Expected close date", type: "date", defaultValue: "2026-09-30" },
            ]}
            onCreate={(values) => {
              const id = `OP-${3100 + rows.length + 1}`;
              setRows((prev) => [
                {
                  id,
                  name: values.name,
                  customer: values.customer,
                  stage: values.stage,
                  probability: Number(values.probability) || 0,
                  revenue: Number(values.revenue) || 0,
                  closeDate: values.closeDate,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {byStage.map((s) => (
          <button
            key={s.stage}
            type="button"
            className="zr-card p-4 text-left hover:border-[var(--brand-primary)]"
            onClick={() => {
              /* visual cue — filter via table status chips */
              document
                .querySelector<HTMLButtonElement>("button:has(.lucide-filter), button")
                ?.blur();
            }}
          >
            <p className="zr-label">{s.stage}</p>
            <p className="mt-2 text-xl font-semibold">{s.count}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{formatCurrency(s.value)}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <StatPill
          label="Weighted pipeline"
          value={formatCurrency(
            rows.reduce((s, o) => s + (Number(o.revenue) * Number(o.probability)) / 100, 0),
          )}
          tone="info"
        />
        <StatPill
          label="Won this month"
          value={formatCurrency(
            rows.filter((o) => o.stage === "Won").reduce((s, o) => s + Number(o.revenue), 0),
          )}
          tone="success"
        />
      </div>

      <DataTable<OppRow>
        data={rows}
        searchKeys={["id", "name", "customer", "stage"]}
        searchPlaceholder="Search opportunities…"
        statusKey="stage"
        filterKey="stage"
        exportName="opportunities"
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Opportunity" },
          { key: "customer", label: "Customer" },
          {
            key: "stage",
            label: "Stage",
            render: (row) => <Badge variant={statusTone(row.stage)}>{row.stage}</Badge>,
          },
          {
            key: "probability",
            label: "Probability",
            render: (row) => formatPercent(Number(row.probability)),
          },
          {
            key: "revenue",
            label: "Expected revenue",
            render: (row) => formatCurrency(Number(row.revenue)),
          },
          {
            key: "closeDate",
            label: "Close date",
            render: (row) => formatDate(String(row.closeDate)),
          },
        ]}
      />
    </div>
  );
}
