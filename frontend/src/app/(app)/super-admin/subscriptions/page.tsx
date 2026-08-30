"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionsPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Subscriptions" description="Platform plans for textile ERP tenants." breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Subscriptions" }]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {subscriptionPlans.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.cycle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-2xl font-semibold">{p.price ? formatCurrency(p.price) : "Free"}</p>
              <p className="text-[var(--muted)]">{p.users} users · {p.storage}</p>
              <p className="text-[var(--muted)]">{p.modules}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" variant="outline" onClick={() => toast({ title: "Plan selected", description: p.name, tone: "success" })}>Edit plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
