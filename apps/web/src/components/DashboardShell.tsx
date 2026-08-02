"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon, MoreHorizontal, Search } from "lucide-react";
import { ProfileMenu } from "./ui/ProfileMenu";
import { Breadcrumbs } from "./ui/Breadcrumbs";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({
  navItems,
  title,
  children,
}: {
  navItems: DashboardNavItem[];
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const activeItem = navItems.find((item) => isActivePath(pathname, item.href));
  const crumbs = [{ label: title }, ...(activeItem ? [{ label: activeItem.label }] : [])];

  const MOBILE_TAB_LIMIT = 5;
  const overflows = navItems.length > MOBILE_TAB_LIMIT;
  const primaryItems = overflows ? navItems.slice(0, MOBILE_TAB_LIMIT - 1) : navItems;
  const overflowItems = overflows ? navItems.slice(MOBILE_TAB_LIMIT - 1) : [];
  const overflowActive = overflowItems.some((item) => isActivePath(pathname, item.href));

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-surface sm:flex">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="font-heading text-lg font-semibold text-ink">
            C2CW
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-btn px-3 py-2 text-sm transition-colors duration-150 ease-out",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-ink-secondary hover:bg-surface-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 -z-10 rounded-btn bg-primary/10"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
                <item.icon size={18} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="sm:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 md:px-6">
          <div className="min-w-0">
            <span className="font-heading text-base font-medium text-ink">{title}</span>
            <Breadcrumbs items={crumbs} />
          </div>
          <form onSubmit={onSearchSubmit} className="hidden max-w-xs flex-1 sm:block">
            <div className="relative">
              <Search
                size={16}
                strokeWidth={1.75}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programs, jobs, talks..."
                className="input-field pl-9 text-sm"
              />
            </div>
          </form>
          <ProfileMenu />
        </header>

        <main className="mx-auto max-w-[1760px] px-4 py-8 pb-24 md:px-8 sm:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile overflow sheet (only rendered when nav has more items than the bottom bar can hold) */}
      <AnimatePresence>
        {moreOpen && overflowItems.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-ink/20 sm:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 bottom-16 z-20 max-h-[60vh] overflow-y-auto rounded-t-card border-t border-border bg-surface p-3 shadow-lg sm:hidden"
            >
              {overflowItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-btn px-3 py-3 text-sm transition-colors duration-150 ease-out",
                      active ? "bg-primary/10 font-medium text-primary" : "text-ink-secondary",
                    )}
                  >
                    <item.icon size={18} strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom tab nav */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-surface sm:hidden">
        {primaryItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors duration-150 ease-out",
                active ? "text-primary" : "text-ink-secondary",
              )}
            >
              <item.icon size={20} strokeWidth={1.75} />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
        {overflowItems.length > 0 && (
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors duration-150 ease-out",
              moreOpen || overflowActive ? "text-primary" : "text-ink-secondary",
            )}
          >
            <MoreHorizontal size={20} strokeWidth={1.75} />
            <span className="text-[11px]">More</span>
          </button>
        )}
      </nav>
    </div>
  );
}
