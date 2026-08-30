"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import { customers, salesOrders, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Plus } from "lucide-react";

const invoicesByCustomer: Record<
  string,
  { id: string; date: string; amount: number; status: string; due: string }[]
> = {
  "CU-1001": [
    { id: "INV-5488", date: "2026-07-12", amount: 4200000, status: "Overdue", due: "2026-08-11" },
    { id: "INV-5512", date: "2026-08-05", amount: 4250000, status: "Open", due: "2026-09-04" },
  ],
  "CU-1002": [
    { id: "INV-5490", date: "2026-07-20", amount: 9800000, status: "Partial", due: "2026-08-19" },
    { id: "INV-5520", date: "2026-08-18", amount: 12350000, status: "Open", due: "2026-09-17" },
  ],
  "CU-1004": [
    { id: "INV-5501", date: "2026-08-15", amount: 8700000, status: "Paid", due: "2026-09-14" },
  ],
};

const paymentsByCustomer: Record<
  string,
  { id: string; date: string; amount: number; method: string; ref: string }[]
> = {
  "CU-1001": [
    { id: "RCPT-901", date: "2026-07-28", amount: 2000000, method: "Bank transfer", ref: "HBL-7721" },
  ],
  "CU-1002": [
    { id: "RCPT-910", date: "2026-08-02", amount: 4500000, method: "LC", ref: "LC-DUB-441" },
  ],
  "CU-1004": [
    { id: "RCPT-922", date: "2026-08-22", amount: 8700000, method: "TT", ref: "DNB-Oslo-19" },
  ],
};

const communications = [
  { id: "1", type: "Email", subject: "SS27 tee program — size ratio confirmation", user: "Zainab Rizvi", time: "2026-08-26 14:20" },
  { id: "2", type: "Call", subject: "Discussed delivery window for SO-1024", user: "Zainab Rizvi", time: "2026-08-24 11:05" },
  { id: "3", type: "Meeting", subject: "Factory visit — packing & carton specs", user: "Imran Malik", time: "2026-08-18 09:30" },
];

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const customer = customers.find((c) => c.id === id) ?? customers[0];
  const orders = salesOrders.filter((o) => o.customer === customer.name);
  const invoices = invoicesByCustomer[customer.id] ?? [
    { id: "INV-0000", date: "2026-08-01", amount: customer.outstanding, status: "Open", due: "2026-08-31" },
  ];
  const payments = paymentsByCustomer[customer.id] ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description={`${customer.type} · ${customer.city} · ${customer.id}`}
        badge={customer.status}
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Customers", href: "/crm/customers" },
          { label: customer.id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({ title: "Email drafted", description: `To ${customer.email}`, tone: "info" })
              }
            >
              <Mail className="size-3.5" /> Email
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast({ title: "Call logged", description: customer.phone, tone: "success" })
              }
            >
              <Phone className="size-3.5" /> Log call
            </Button>
          </>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Outstanding" value={formatCurrency(customer.outstanding)} tone="warning" />
        <StatPill label="Orders" value={customer.orders} tone="info" />
        <StatPill label="Open SOs" value={orders.filter((o) => o.status !== "Delivered").length} />
        <StatPill label="Credit status" value={customer.status} tone={customer.status === "Active" ? "success" : "warning"} />
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="comms">Communications</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="zr-card grid gap-6 p-5 sm:grid-cols-2">
            <div>
              <p className="zr-label">Primary contact</p>
              <p className="mt-1 text-sm font-medium">{customer.contact}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{customer.email}</p>
              <p className="text-sm text-[var(--muted)]">{customer.phone}</p>
            </div>
            <div>
              <p className="zr-label">Account</p>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Type</dt>
                  <dd>{customer.type}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">City</dt>
                  <dd>{customer.city}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Payment terms</dt>
                  <dd>{customer.type === "Export" ? "LC / TT 30" : "Net 30"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--muted)]">Status</dt>
                  <dd>
                    <Badge variant={statusTone(customer.status)}>{customer.status}</Badge>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="zr-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Value</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[var(--muted)]">
                      No sales orders linked in mock data.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3">
                        <Link href={`/sales/orders/${o.id}`} className="font-medium text-[var(--brand-primary)] hover:underline">
                          {o.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{o.product}</td>
                      <td className="px-4 py-3">
                        {o.qty.toLocaleString()} {o.unit}
                      </td>
                      <td className="px-4 py-3">{formatCurrency(o.value)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusTone(o.status)}>{o.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="zr-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Due</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-medium text-[var(--brand-primary)]">{inv.id}</td>
                    <td className="px-4 py-3">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3">{formatDate(inv.due)}</td>
                    <td className="px-4 py-3">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusTone(inv.status)}>{inv.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="zr-card p-5">
            {payments.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No recent receipts recorded.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{p.id} · {formatCurrency(p.amount)}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {p.method} · {p.ref} · {formatDate(p.date)}
                      </p>
                    </div>
                    <Badge variant="success">Posted</Badge>
                  </div>
                ))}
              </div>
            )}
            <Button
              className="mt-4"
              size="sm"
              variant="outline"
              onClick={() => toast({ title: "Payment entry", description: "AR receipt form opened.", tone: "info" })}
            >
              <Plus className="size-3.5" /> Record payment
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="comms">
          <div className="zr-card p-5 space-y-3">
            {communications.map((c) => (
              <div key={c.id} className="rounded-xl border border-[var(--border)] px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{c.type}</Badge>
                  <p className="text-sm font-medium">{c.subject}</p>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {c.user} · {c.time}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outstanding">
          <div className="zr-card p-5">
            <p className="zr-label">Aging summary</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              <StatPill label="Current" value={formatCurrency(Math.round(customer.outstanding * 0.35))} tone="success" />
              <StatPill label="1–30 days" value={formatCurrency(Math.round(customer.outstanding * 0.25))} tone="info" />
              <StatPill label="31–60 days" value={formatCurrency(Math.round(customer.outstanding * 0.2))} tone="warning" />
              <StatPill label="60+ days" value={formatCurrency(Math.round(customer.outstanding * 0.2))} tone="error" />
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Total outstanding <span className="font-semibold text-[var(--foreground)]">{formatCurrency(customer.outstanding)}</span>
              {customer.id === "CU-1001" ? " — payment reminder overdue by 12 days." : "."}
            </p>
            <Button
              className="mt-4"
              size="sm"
              onClick={() =>
                toast({
                  title: "Statement sent",
                  description: `Account statement emailed to ${customer.email}`,
                  tone: "success",
                })
              }
            >
              Send statement
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
