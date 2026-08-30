"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { processTemplates } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Plus } from "lucide-react";

export default function ProcessTemplatesPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Process templates"
        description="Reusable routing pipelines for spinning, weaving, dyeing, printing, and garments."
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Processes" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({
                title: "Process added",
                description: "Draft template PT-NEW saved to library.",
                tone: "success",
              })
            }
          >
            <Plus className="size-3.5" /> Add process
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {processTemplates.map((tpl) => (
          <div key={tpl.id} className="zr-card p-5">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <p className="zr-label">{tpl.id}</p>
                <h3 className="text-base font-semibold">{tpl.name}</h3>
              </div>
              <Badge variant="info">{tpl.steps.length} steps</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {tpl.steps.map((step, index) => (
                <div key={`${tpl.id}-${step}`} className="flex items-center gap-1.5">
                  <span className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5 text-xs font-medium">
                    {step}
                  </span>
                  {index < tpl.steps.length - 1 ? (
                    <ArrowRight className="size-3.5 shrink-0 text-[var(--muted)]" />
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast({
                    title: "Template applied",
                    description: `${tpl.name} routing attached to style.`,
                    tone: "info",
                  })
                }
              >
                Apply to style
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  toast({ title: "Clone template", description: `${tpl.id} duplicated.`, tone: "success" })
                }
              >
                Clone
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
