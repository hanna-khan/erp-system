"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  href?: (row: T) => string | undefined;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  rowHref?: (row: T) => string | undefined;
  actions?: React.ReactNode;
  emptyTitle?: string;
  selectable?: boolean;
  statusKey?: string;
  filterKey?: string;
  exportName?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKeys = [],
  searchPlaceholder = "Search...",
  pageSize = 8,
  onRowClick,
  rowHref,
  actions,
  emptyTitle = "No records found",
  selectable = true,
  statusKey,
  filterKey,
  exportName = "export",
}: DataTableProps<T>) {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const activeFilterKey = filterKey || statusKey;
  const statusOptions = useMemo(() => {
    if (!activeFilterKey) return [];
    return Array.from(new Set(data.map((row) => String(row[activeFilterKey] ?? "")))).filter(Boolean);
  }, [data, activeFilterKey]);

  const visibleColumns = columns.filter((c) => !hiddenCols.has(c.key));

  const filtered = useMemo(() => {
    let rows = data;
    if (query.trim()) {
      const q = query.toLowerCase();
      const keys = searchKeys.length ? searchKeys : columns.map((c) => c.key);
      rows = rows.filter((row) =>
        keys.some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
      );
    }
    if (activeFilterKey && statusFilter !== "all") {
      rows = rows.filter((row) => String(row[activeFilterKey]) === statusFilter);
    }
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, query, searchKeys, columns, activeFilterKey, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map((_, i) => i)));
  };

  const exportCsv = () => {
    const cols = visibleColumns;
    const header = cols.map((c) => c.label).join(",");
    const lines = filtered.map((row) =>
      cols
        .map((c) => {
          const val = String(row[c.key] ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportName}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export ready",
      description: `Downloaded ${filtered.length} rows as CSV.`,
      tone: "success",
    });
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="zr-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-gradient-to-r from-white to-[var(--surface-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="h-10 rounded-xl border-[var(--border)] bg-white pl-9 shadow-[var(--shadow-xs)]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={statusFilter !== "all" ? "secondary" : "outline"}
            size="sm"
            className="rounded-xl"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter className="size-3.5" /> Filters
            {statusFilter !== "all" ? (
              <Badge variant="info" className="ml-1">
                1
              </Badge>
            ) : null}
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setColumnsOpen(true)}>
            <SlidersHorizontal className="size-3.5" /> Columns
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={exportCsv}>
            <Download className="size-3.5" /> Export
          </Button>
          {actions}
        </div>
      </div>

      {selected.size > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--brand-primary-soft)]/50 px-4 py-2.5">
          <p className="text-xs font-semibold text-[var(--brand-primary)]">
            {selected.size} selected
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg"
            onClick={() => {
              toast({
                title: "Bulk export",
                description: `${selected.size} rows exported.`,
                tone: "success",
              });
              exportCsv();
            }}
          >
            <Download className="size-3.5" /> Export selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg text-rose-600"
            onClick={() => {
              toast({
                title: "Marked for removal",
                description: `${selected.size} records flagged (mock).`,
                tone: "warning",
              });
              setSelected(new Set());
            }}
          >
            <Trash2 className="size-3.5" /> Delete
          </Button>
          <Button size="sm" variant="ghost" className="h-8" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      ) : null}

      {statusFilter !== "all" ? (
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2 text-xs">
          <span className="text-[var(--muted)]">Active filter:</span>
          <Badge variant="info">{statusFilter}</Badge>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline"
            onClick={() => setStatusFilter("all")}
          >
            <X className="size-3" /> Clear
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--surface-muted)]/80 text-[11px] uppercase tracking-wider text-[var(--muted)]">
            <tr>
              {selectable ? (
                <th className="w-10 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.size === pageRows.length && pageRows.length > 0}
                    onChange={toggleAll}
                    className="size-4 rounded border-[var(--border)] accent-[var(--brand-primary)]"
                  />
                </th>
              ) : null}
              {visibleColumns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3.5 font-semibold", col.className)}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-[var(--foreground)]"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      <span className="text-[var(--brand-primary)]">{sortDir === "asc" ? "↑" : "↓"}</span>
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-4 py-16 text-center text-[var(--muted)]"
                >
                  <p className="text-sm font-medium text-[var(--foreground)]">{emptyTitle}</p>
                  <p className="mt-1 text-xs">Try clearing filters or search.</p>
                  {(query || statusFilter !== "all") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Reset filters
                    </Button>
                  )}
                </td>
              </tr>
            ) : (
              pageRows.map((row, index) => {
                const href = rowHref?.(row);
                return (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-t border-[var(--border)] transition-colors hover:bg-[var(--sidebar-hover)]",
                      (onRowClick || href) && "cursor-pointer",
                    )}
                  >
                    {selectable ? (
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(index)}
                          onChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(index)) next.delete(index);
                              else next.add(index);
                              return next;
                            });
                          }}
                          className="size-4 rounded border-[var(--border)] accent-[var(--brand-primary)]"
                        />
                      </td>
                    ) : null}
                    {visibleColumns.map((col) => {
                      const content = col.render ? (
                        col.render(row)
                      ) : statusKey && col.key === statusKey ? (
                        <Badge variant={statusTone(String(row[col.key] ?? ""))}>
                          {String(row[col.key] ?? "")}
                        </Badge>
                      ) : (
                        String(row[col.key] ?? "—")
                      );

                      const cellHref =
                        col.href?.(row) ?? (col.key === visibleColumns[0]?.key ? href : undefined);

                      return (
                        <td
                          key={col.key}
                          className={cn("px-4 py-3.5 text-[var(--foreground)]", col.className)}
                        >
                          {cellHref ? (
                            <Link
                              href={cellHref}
                              className="font-medium text-[var(--brand-primary)] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {content}
                            </Link>
                          ) : (
                            content
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-muted)]/40 px-4 py-3 text-xs text-[var(--muted)]">
        <p>
          Showing {(currentPage - 1) * pageSize + (pageRows.length ? 1 : 0)}–
          {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-lg"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-12 text-center font-medium text-[var(--foreground)]">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-lg"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Narrow the list. Changes apply immediately.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {activeFilterKey && statusOptions.length > 0 ? (
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={cn(
                      "rounded-xl border px-3 py-1.5 text-xs font-semibold",
                      statusFilter === "all"
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                        : "border-[var(--border)] bg-white",
                    )}
                  >
                    All
                  </button>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatusFilter(opt)}
                      className={cn(
                        "rounded-xl border px-3 py-1.5 text-xs font-semibold",
                        statusFilter === opt
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                          : "border-[var(--border)] bg-white",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">Use search to find records on this page.</p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setQuery("");
                }}
              >
                Reset
              </Button>
              <Button onClick={() => setFiltersOpen(false)}>Apply</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={columnsOpen} onOpenChange={setColumnsOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Visible columns</DialogTitle>
            <DialogDescription>Show or hide columns for a cleaner table.</DialogDescription>
          </DialogHeader>
          <div className="max-h-72 space-y-2 overflow-auto">
            {columns.map((col) => {
              const visible = !hiddenCols.has(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => {
                    setHiddenCols((prev) => {
                      const next = new Set(prev);
                      if (next.has(col.key)) next.delete(col.key);
                      else {
                        if (next.size >= columns.length - 1) {
                          toast({
                            title: "Keep at least one column",
                            description: "You need one visible column.",
                            tone: "warning",
                          });
                          return prev;
                        }
                        next.add(col.key);
                      }
                      return next;
                    });
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm hover:bg-[var(--sidebar-hover)]"
                >
                  <span>{col.label}</span>
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md",
                      visible ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {visible ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setColumnsOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
