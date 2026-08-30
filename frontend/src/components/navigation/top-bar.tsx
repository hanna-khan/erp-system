"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  HelpCircle,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { ROLE_LABELS } from "@/config/navigation";
import { branches, globalSearchIndex, notifications, plants, users } from "@/mock/data";
import type { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/navigation/sidebar";

export function TopBar({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
  const {
    user,
    company,
    plant,
    branch,
    fiscalYear,
    language,
    sidebarCollapsed,
    toggleSidebar,
    setRole,
    setPlantId,
    setBranchId,
    setLanguage,
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return globalSearchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/85 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onMobileMenuToggle}>
          <Menu className="size-5" />
        </Button>
        <Button variant="ghost" size="icon-sm" className="hidden lg:inline-flex" onClick={toggleSidebar}>
          {sidebarCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </Button>

        <div className="relative hidden min-w-0 flex-1 md:block md:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search customers, orders, products, machines..."
            className="h-10 pl-9"
          />
          {searchOpen && query ? (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-[var(--muted)]">No results</p>
              ) : (
                <ul className="max-h-80 overflow-auto py-2">
                  {results.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--sidebar-hover)]"
                      >
                        <Badge variant="outline">{item.type}</Badge>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="text-[11px] text-[var(--muted)]">{item.id}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <select
            value={plant.id}
            onChange={(e) => setPlantId(e.target.value)}
            className="hidden h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-xs font-medium text-slate-600 xl:block"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={branch.id}
            onChange={(e) => setBranchId(e.target.value)}
            className="hidden h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-xs font-medium text-slate-600 2xl:block"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <span className="hidden rounded-lg bg-[var(--brand-lavender-soft)] px-2.5 py-1.5 text-[11px] font-semibold text-violet-700 lg:inline">
            {fiscalYear}
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="hidden h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-xs font-medium text-slate-600 md:block"
          >
            <option value="en">EN</option>
            <option value="ur">UR</option>
          </select>

          <div className="relative">
            <Button variant="ghost" size="icon-sm" onClick={() => setNotifOpen((v) => !v)}>
              <Bell className="size-5" />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[9px] font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </Button>
            {notifOpen ? (
              <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <Link href="/notifications" className="text-xs text-[var(--brand-primary)]" onClick={() => setNotifOpen(false)}>
                    View all
                  </Link>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <li key={n.id} className={cn("border-b border-[var(--border)] px-4 py-3", n.unread && "bg-[var(--brand-primary-soft)]/40")}>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{n.body}</p>
                      <p className="mt-1 text-[10px] text-[var(--muted)]">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/settings">
              <HelpCircle className="size-5" />
            </Link>
          </Button>

          <div className="ml-1 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] py-1 pl-1 pr-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6b8cff] to-[#b8a9e8] text-xs font-bold text-white">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs font-semibold">{user.name}</p>
              <select
                value={user.role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="max-w-[140px] truncate bg-transparent text-[10px] text-[var(--muted)] outline-none"
                title="Demo role switcher"
              >
                {(Object.keys(users) as UserRole[]).map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-4 py-1.5 text-[11px] text-[var(--muted)] lg:px-6">
        {company.name} · {plant.name} · {branch.name} · PKR · NTN {company.ntn}
      </div>
    </header>
  );
}

export function MobileSidebarOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" className="absolute inset-0 bg-slate-900/30" onClick={onClose} aria-label="Close menu" />
      <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <p className="font-semibold">Menu</p>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="h-[calc(100%-53px)] overflow-auto">
          <div className="relative [&_aside]:static [&_aside]:flex [&_aside]:h-full [&_aside]:w-full">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
