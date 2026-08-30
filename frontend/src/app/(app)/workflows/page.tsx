"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { WorkflowStepper } from "@/components/shared/workflow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dyeingWorkflow, tshirtWorkflow, weavingWorkflow } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Droplets, ExternalLink, Shirt, Waves } from "lucide-react";

const demos = [
  {
    id: "tshirt",
    title: "T-shirt end-to-end",
    subtitle: "SO-1024 · Fashion Retailer A · 10,000 pcs",
    icon: Shirt,
    steps: tshirtWorkflow,
    links: [
      { href: "/crm/customers/CU-1001", label: "Customer" },
      { href: "/sales/orders/SO-1024", label: "Sales order" },
      { href: "/products/bom/BOM-TS-27", label: "BOM" },
      { href: "/production/orders/PRO-7001", label: "Production" },
    ],
  },
  {
    id: "weaving",
    title: "Weaving flow",
    subtitle: "Grey fabric · PRO-7003 · Faisalabad plant",
    icon: Waves,
    steps: weavingWorkflow,
    links: [
      { href: "/inventory", label: "Yarn stock" },
      { href: "/production/orders/PRO-7003", label: "Weaving order" },
      { href: "/sales/orders/SO-1027", label: "Sales order" },
    ],
  },
  {
    id: "dyeing",
    title: "Dyeing & finishing",
    subtitle: "BT-DYE-441 · Navy reactive · shade CAPA",
    icon: Droplets,
    steps: dyeingWorkflow,
    links: [
      { href: "/production/orders/PRO-7002", label: "Dyeing order" },
      { href: "/procurement/orders/PO-4402", label: "Chemicals PO" },
      { href: "/quality/inspections", label: "QC inspections" },
    ],
  },
];

export default function WorkflowsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demo workflows"
        description="Three end-to-end textile journeys you can click through — order to cash, weaving, and dyeing."
        breadcrumbs={[{ label: "Overview" }, { label: "Workflows" }]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast({
                title: "Guided tour",
                description: "Start with SO-1024 T-shirt workflow.",
                tone: "info",
              })
            }
          >
            Start guided tour
          </Button>
        }
      />

      <div className="space-y-8">
        {demos.map((demo) => (
          <section key={demo.id} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <demo.icon className="size-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{demo.title}</h2>
                    <Badge variant="outline">{demo.steps.length} steps</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--muted)]">{demo.subtitle}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {demo.links.map((link) => (
                  <Button key={link.href} asChild size="sm" variant="outline">
                    <Link href={link.href}>
                      {link.label} <ExternalLink className="size-3.5" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <WorkflowStepper steps={demo.steps} title={demo.title} />
          </section>
        ))}
      </div>
    </div>
  );
}
