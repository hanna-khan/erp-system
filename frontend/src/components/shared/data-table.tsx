"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { statusTone } from "@/mock/data";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
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
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      (searchKeys.length
        ? searchKeys
        : columns.map((c) => c.key)
      ).some((key) => String(row[key] ?? "").toLowerCase().includes(q)),
    );
  }, [data, query, searchKeys, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleAll = () => {
    if (selected.size === pageRows.length) setSelected(new Set());
    else setSelected(new Set(pageRows.map((_, i) => i)));
  };

  return (
    <div className="zr-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="size-3.5" /> Filters
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-3.5" /> Columns
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-3.5" /> Export
          </Button>
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
            <tr>
              {selectable ? (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === pageRows.length && pageRows.length > 0}
                    onChange={toggleAll}
                    className="rounded border-[var(--border)]"
                  />
                </th>
              ) : null}
              {columns.map((col) => (
                <th key={col.key} className={cn("px-4 py-3 font-semibold", col.className)}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-16 text-center text-[var(--muted)]"
                >
                  {emptyTitle}
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
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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
                          className="rounded border-[var(--border)]"
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => {
                      const content = col.render
                        ? col.render(row)
                        : statusKey && col.key === statusKey
                          ? (
                              <Badge variant={statusTone(String(row[col.key] ?? ""))}>
                                {String(row[col.key] ?? "")}
                              </Badge>
                            )
                          : String(row[col.key] ?? "—");

                      const cellHref = col.href?.(row) ?? (col.key === columns[0].key ? href : undefined);

                      return (
                        <td key={col.key} className={cn("px-4 py-3 text-[var(--foreground)]", col.className)}>
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

      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted)]">
        <p>
          Showing {(currentPage - 1) * pageSize + (pageRows.length ? 1 : 0)}–
          {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          {selected.size > 0 ? ` · ${selected.size} selected` : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
