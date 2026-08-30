"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DefectPoint = {
  id: string;
  x: number;
  y: number;
  type: "Hole" | "Slub" | "Stain" | "Shade" | "Crease";
  severity: "Minor" | "Major" | "Critical";
};

const defectPoints: DefectPoint[] = [
  { id: "d1", x: 12, y: 18, type: "Slub", severity: "Minor" },
  { id: "d2", x: 28, y: 42, type: "Shade", severity: "Critical" },
  { id: "d3", x: 45, y: 22, type: "Hole", severity: "Major" },
  { id: "d4", x: 58, y: 65, type: "Stain", severity: "Major" },
  { id: "d5", x: 72, y: 38, type: "Shade", severity: "Critical" },
  { id: "d6", x: 81, y: 70, type: "Crease", severity: "Minor" },
  { id: "d7", x: 35, y: 78, type: "Hole", severity: "Major" },
  { id: "d8", x: 90, y: 15, type: "Slub", severity: "Minor" },
  { id: "d9", x: 18, y: 55, type: "Stain", severity: "Minor" },
  { id: "d10", x: 63, y: 12, type: "Shade", severity: "Major" },
];

const typeColor: Record<DefectPoint["type"], string> = {
  Hole: "bg-rose-500",
  Slub: "bg-amber-500",
  Stain: "bg-violet-500",
  Shade: "bg-sky-500",
  Crease: "bg-emerald-500",
};

export default function FabricInspectionPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<DefectPoint | null>(defectPoints[1]);
  const [filter, setFilter] = useState<DefectPoint["type"] | "All">("All");

  const visible = defectPoints.filter((d) => filter === "All" || d.type === filter);
  const critical = defectPoints.filter((d) => d.severity === "Critical").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fabric Inspection Map"
        description="Visual 4-point map for lot BT-DYE-441 · Navy reactive · 58&quot; width."
        breadcrumbs={[
          { label: "Quality", href: "/quality" },
          { label: "Fabric Inspection" },
        ]}
        badge="BT-DYE-441"
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Map saved",
                description: "Defect points synced to QC-1203.",
                tone: "success",
              })
            }
          >
            Save map
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatPill label="Defect points" value={defectPoints.length} tone="warning" />
        <StatPill label="Critical" value={critical} tone="error" />
        <StatPill label="Lot length" value="120 m" />
        <StatPill label="Width" value='58"' tone="info" />
        <StatPill label="Grade" value="C / Hold" tone="error" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", "Hole", "Slub", "Stain", "Shade", "Crease"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={filter === t ? "default" : "outline"}
            onClick={() => setFilter(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fabric face · defect plot</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="relative mx-auto aspect-[2/1] w-full max-w-3xl overflow-hidden rounded-xl border-2 border-[var(--border)] shadow-inner"
              style={{
                background:
                  "linear-gradient(135deg, #1e3a5f 0%, #243b55 40%, #1a3350 70%, #2a4a6b 100%)",
              }}
            >
              {/* weave texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)",
                }}
              />
              {/* length markers */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-2 pt-1 text-[9px] text-white/70">
                <span>0 m</span>
                <span>30 m</span>
                <span>60 m</span>
                <span>90 m</span>
                <span>120 m</span>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col justify-between py-6 pl-1 text-[9px] text-white/70">
                <span>Selv</span>
                <span>Center</span>
                <span>Selv</span>
              </div>

              {visible.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  title={`${d.type} · ${d.severity}`}
                  onClick={() => {
                    setSelected(d);
                    toast({
                      title: `${d.type} marked`,
                      description: `${d.severity} at ${d.x}% length × ${d.y}% width`,
                      tone: d.severity === "Critical" ? "error" : "warning",
                    });
                  }}
                  className={cn(
                    "absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125",
                    typeColor[d.type],
                    selected?.id === d.id && "scale-150 ring-2 ring-white/80",
                  )}
                  style={{ left: `${d.x}%`, top: `${d.y}%` }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
              {(Object.keys(typeColor) as DefectPoint["type"][]).map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-full", typeColor[t])} />
                  {t}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected point</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selected ? (
              <>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold">{selected.type}</p>
                    <Badge
                      variant={
                        selected.severity === "Critical"
                          ? "error"
                          : selected.severity === "Major"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {selected.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Position: {selected.x}% along length · {selected.y}% across width
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    toast({
                      title: "Linked to NCR-301",
                      description: "Shade points aggregated for CAPA.",
                      tone: "info",
                    })
                  }
                >
                  Link to NCR
                </Button>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">Click a point on the fabric map.</p>
            )}
            <div className="space-y-2">
              <p className="zr-label">All points</p>
              <ul className="max-h-56 space-y-1 overflow-y-auto text-sm">
                {defectPoints.map((d) => (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(d)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-[var(--sidebar-hover)]",
                        selected?.id === d.id && "bg-[var(--brand-primary-soft)]",
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", typeColor[d.type])} />
                        {d.type}
                      </span>
                      <span className="text-xs text-[var(--muted)]">{d.severity}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
