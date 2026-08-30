"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileStack, FlaskConical, Palette, Shirt } from "lucide-react";

const links = [
  { href: "/plm/styles", title: "Styles", desc: "Seasonal style library and BOM links.", icon: Palette },
  { href: "/plm/samples", title: "Samples", desc: "Proto / fit / size set tracking.", icon: FlaskConical },
  { href: "/plm/techpacks", title: "Tech packs", desc: "Construction, measurements and artwork.", icon: FileStack },
];

export default function PlmPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="PLM" description="Product lifecycle for apparel and fabric styles." breadcrumbs={[{ label: "PLM" }]} badge="Apparel" />
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-sm)]">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <l.icon className="size-5" />
                </div>
                <CardTitle className="group-hover:text-[var(--brand-primary)]">{l.title}</CardTitle>
                <CardDescription>{l.desc}</CardDescription>
              </CardHeader>
              <CardContent><span className="text-xs font-semibold text-[var(--brand-primary)]">Open →</span></CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardContent className="flex items-center gap-3 p-5 text-sm text-[var(--muted)]">
          <Shirt className="size-5 text-[var(--brand-primary)]" />
          Linked to products, BOM and color × size matrix for TS-BASIC-27.
        </CardContent>
      </Card>
    </div>
  );
}
