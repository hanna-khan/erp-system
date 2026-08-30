"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, FileStack } from "lucide-react";

const packs = [
  { id: "TP-2701", style: "CCN-KAFT-PRISM", rev: "R3", pages: 12, status: "Released" },
  { id: "TP-2608", style: "CCN-RTW-MATCHA", rev: "R1", pages: 9, status: "Draft" },
  { id: "TP-5802", style: "CCN-LAWN-FAIRY", rev: "R2", pages: 6, status: "Released" },
];

export default function TechpacksPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Tech packs"
        description="Construction, measurement charts and artwork packs."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Tech packs" }]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {packs.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                <FileStack className="size-5" />
              </div>
              <CardTitle className="text-base">{p.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-[var(--muted)]">
                <Link href={"/plm/styles/" + p.style} className="text-[var(--brand-primary)] hover:underline">{p.style}</Link>
                {" · "}{p.rev} · {p.pages} pages
              </p>
              <Badge variant={p.status === "Released" ? "success" : "warning"}>{p.status}</Badge>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => toast({ title: "Tech pack exported", description: p.id + " PDF (mock).", tone: "success" })}
              >
                <Download className="size-4" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
