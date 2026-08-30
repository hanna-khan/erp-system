"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { ROLE_LABELS } from "@/config/navigation";
import { globalSearchIndex, notifications, plants, users } from "@/mock/data";
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
    sidebarCollapsed,
    toggleSidebar,
    setRole,
    setPlantId,
  } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const closeMenus = () => {
    setNotifOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)]/80 bg-white/90 backdrop-blur-xl">
      <div className="flex h-[60px] items-center gap-3 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-xl text-slate-500 lg:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden rounded-xl text-slate-500 lg:inline-flex"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </Button>

        {/* Search — calm, centered feel */}
        <div className="relative mx-auto hidden w-full max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            onFocus={() => {
              setSearchOpen(true);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            placeholder="Search…"
            className="h-10 rounded-full border-transparent bg-slate-50 pl-10 pr-4 text-sm shadow-none focus-visible:border-[var(--border)] focus-visible:bg-white focus-visible:ring-0"
          />
          {searchOpen && query ? (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
              {results.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--muted)]">No results</p>
              ) : (
                <ul className="max-h-80 overflow-auto py-2">
                  {results.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          closeMenus();
                          setQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50"
                      >
                        <Badge variant="outline" className="rounded-full">
                          {item.type}
                        </Badge>
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

        <div className="ml-auto flex items-center gap-1">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-xl text-slate-500"
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
                setSearchOpen(false);
              }}
            >
              <Bell className="size-[18px]" />
              {unread > 0 ? (
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--brand-primary)] ring-2 ring-white" />
              ) : null}
            </Button>
            {notifOpen ? (
              <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <Link
                    href="/notifications"
                    className="text-xs text-[var(--brand-primary)]"
                    onClick={() => setNotifOpen(false)}
                  >
                    View all
                  </Link>
                </div>
                <ul className="max-h-80 overflow-auto border-t border-[var(--border)]">
                  {notifications.slice(0, 4).map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "border-b border-[var(--border)] px-4 py-3 last:border-0",
                        n.unread && "bg-[var(--brand-primary-soft)]/30",
                      )}
                    >
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{n.body}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Profile — plant + role live here, not in the header bar */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
                setSearchOpen(false);
              }}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-slate-50"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5b7cfa] to-[#b9a8ea] text-[11px] font-bold text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-xs font-semibold leading-tight text-slate-800">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-slate-400">{ROLE_LABELS[user.role]}</p>
              </div>
              <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
            </button>

            {profileOpen ? (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-lg)]">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{company.shortName}</p>
                </div>

                <div className="mt-2 space-y-1.5 px-1 py-1">
                  <label className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Plant
                  </label>
                  <select
                    value={plant.id}
                    onChange={(e) => setPlantId(e.target.value)}
                    className="h-9 w-full rounded-xl border border-[var(--border)] bg-white px-2.5 text-xs outline-none"
                  >
                    {plants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2 space-y-1.5 px-1 py-1">
                  <label className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    View as (demo)
                  </label>
                  <select
                    value={user.role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="h-9 w-full rounded-xl border border-[var(--border)] bg-white px-2.5 text-xs outline-none"
                  >
                    {(Object.keys(users) as UserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2 border-t border-[var(--border)] pt-2">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <Settings className="size-4" /> Settings
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
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
      <button type="button" className="absolute inset-0 bg-slate-900/25" onClick={onClose} aria-label="Close menu" />
      <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Menu</p>
          <Button variant="ghost" size="icon-sm" className="rounded-xl" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="h-[calc(100%-52px)] overflow-auto">
          <div className="relative [&_aside]:static [&_aside]:flex [&_aside]:h-full [&_aside]:w-full">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
