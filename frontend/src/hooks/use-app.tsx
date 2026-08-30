"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { branches, company, plants, users } from "@/mock/data";
import type { Branch, Company, Plant, User, UserRole } from "@/types";

interface AppState {
  user: User;
  company: Company;
  plant: Plant;
  branch: Branch;
  fiscalYear: string;
  language: string;
  sidebarCollapsed: boolean;
  favorites: string[];
  recent: string[];
  setRole: (role: UserRole) => void;
  setPlantId: (id: string) => void;
  setBranchId: (id: string) => void;
  toggleSidebar: () => void;
  setLanguage: (lang: string) => void;
  addRecent: (href: string) => void;
  toggleFavorite: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const ROLE_KEY = "zr-erp-role";
const SIDEBAR_KEY = "zr-erp-sidebar";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("ceo");
  const [plantId, setPlantId] = useState(plants[0].id);
  const [branchId, setBranchId] = useState(branches[0].id);
  const [language, setLanguage] = useState("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["dashboard", "sales-orders", "production"]);
  const [recent, setRecent] = useState<string[]>(["/dashboard", "/sales/orders", "/production/orders"]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
      const savedSidebar = localStorage.getItem(SIDEBAR_KEY);
      if (savedRole && users[savedRole]) setRoleState(savedRole);
      if (savedSidebar) setSidebarCollapsed(savedSidebar === "1");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setRole = useCallback((next: UserRole) => {
    setRoleState(next);
    localStorage.setItem(ROLE_KEY, next);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  const addRecent = useCallback((href: string) => {
    setRecent((prev) => [href, ...prev.filter((x) => x !== href)].slice(0, 8));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const value = useMemo<AppState>(
    () => ({
      user: users[role],
      company,
      plant: plants.find((p) => p.id === plantId) ?? plants[0],
      branch: branches.find((b) => b.id === branchId) ?? branches[0],
      fiscalYear: company.fiscalYear,
      language,
      sidebarCollapsed: hydrated ? sidebarCollapsed : false,
      favorites,
      recent,
      setRole,
      setPlantId,
      setBranchId,
      toggleSidebar,
      setLanguage,
      addRecent,
      toggleFavorite,
    }),
    [
      role,
      plantId,
      branchId,
      language,
      sidebarCollapsed,
      hydrated,
      favorites,
      recent,
      setRole,
      toggleSidebar,
      addRecent,
      toggleFavorite,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
