"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Check, X } from "lucide-react";

const seed = [
  { id: "AP-901", type: "Purchase Order", ref: "PO-4404", requester: "Omar Farooq", amount: 875000, status: "Pending", href: "/procurement/orders/PO-4404" },
  { id: "AP-902", type: "Sales Discount", ref: "SO-1024", requester: "Areeba Malik", amount: 450000, status: "Pending", href: "/sales/orders/SO-1024" },
  { id: "AP-903", type: "Leave", ref: "EMP-1005", requester: "Tariq Mehmood", amount: 0, status: "Pending", href: "/hr/employees/EMP-1005" },
  { id: "AP-904", type: "Journal", ref: "JV-2405", requester: "Waqas Anwar", amount: 1800000, status: "Pending", href: "/finance/gl" },
];

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(seed);

  const decide = (id: string, decision: "Approved" | "Rejected") => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: decision } : r)));
    toast({
      title: decision === "Approved" ? "Approved" : "Rejected",
      description: id + " marked " + decision.toLowerCase() + ".",
      tone: decision === "Approved" ? "success" : "error",
    });
  };

  const pending = rows.filter((r) => r.status === "Pending");

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Approvals"
        description="Pending workflow decisions across PO, sales, HR and finance."
        breadcrumbs={[{ label: "Approvals" }]}
        badge={pending.length + " pending"}
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "p", label: "Pending", value: String(pending.length), tone: "warning" },
          { id: "a", label: "Approved today", value: String(rows.filter((r) => r.status === "Approved").length), tone: "success" },
          { id: "r", label: "Rejected", value: String(rows.filter((r) => r.status === "Rejected").length), tone: "error" },
          { id: "v", label: "Value pending", value: formatCurrency(pending.reduce((s, r) => s + r.amount, 0)), tone: "info" },
        ]}
      />

      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{r.type}</p>
                  <Badge variant={r.status === "Pending" ? "warning" : r.status === "Approved" ? "success" : "error"}>{r.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  <Link href={r.href} className="text-[var(--brand-primary)] hover:underline">{r.ref}</Link>
                  {" · "}{r.requester}
                  {r.amount ? " · " + formatCurrency(r.amount) : ""}
                </p>
              </div>
              {r.status === "Pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide(r.id, "Approved")}><Check className="size-4" /> Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => decide(r.id, "Rejected")}><X className="size-4" /> Reject</Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
