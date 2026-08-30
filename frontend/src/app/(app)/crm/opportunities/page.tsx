"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";
import { opportunities, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type OppRow = (typeof opportunities)[number] & Record<string, unknown>;

const stages = ["Qualification", "Proposal", "Negotiation", "Won", "Lost"];

export default function OpportunitiesPage() {
  const { toast } = useToast();

  const byStage = stages.map((stage) => ({
    stage,
    count: opportunities.filter((o) => o.stage === stage).length,
    value: opportunities.filter((o) => o.stage === stage).reduce((s, o) => s + o.revenue, 0),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="Textile program pipeline — styles, fabric contracts, and garment bulk orders."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Opportunities" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Opportunity created", description: "Draft opportunity saved.", tone: "success" })
            }
          >
            <Plus className="size-3.5" /> New opportunity
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {byStage.map((s) => (
          <div key={s.stage} className="zr-card p-4">
            <p className="zr-label">{s.stage}</p>
            <p className="mt-2 text-xl font-semibold">{s.count}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <StatPill
          label="Weighted pipeline"
          value={formatCurrency(
            opportunities.reduce((s, o) => s + (o.revenue * o.probability) / 100, 0),
          )}
          tone="info"
        />
        <StatPill
          label="Won this month"
          value={formatCurrency(opportunities.filter((o) => o.stage === "Won").reduce((s, o) => s + o.revenue, 0))}
          tone="success"
        />
      </div>

      <DataTable<OppRow>
        data={opportunities as OppRow[]}
        searchKeys={["id", "name", "customer", "stage"]}
        searchPlaceholder="Search opportunities…"
        statusKey="stage"
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
            label: "Win %",
            render: (row) => formatPercent(row.probability, 0),
          },
          {
            key: "revenue",
            label: "Revenue",
            render: (row) => formatCurrency(row.revenue),
          },
          {
            key: "closeDate",
            label: "Close date",
            render: (row) => formatDate(row.closeDate),
          },
        ]}
      />
    </div>
  );
}
