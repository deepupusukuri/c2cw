"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function initialsFor(nameOrEmail: string | null | undefined) {
  const source = nameOrEmail ?? "?";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProfileMenu({ showName = true }: { showName?: boolean }) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = initialsFor(user.name ?? user.email);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-btn px-1.5 py-1 transition-colors duration-150 ease-out hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </div>
          {showName && (
            <span className="hidden text-sm text-ink-secondary sm:inline">{user.name}</span>
          )}
          <ChevronDown size={14} className="hidden text-ink-secondary sm:inline" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-card border border-border bg-surface p-1.5 shadow-elevated data-[state=open]:animate-pop-in"
        >
          <div className="px-2.5 py-2">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-ink-secondary">{user.email}</p>
            <span className="badge-sponsored mt-1.5 inline-block">
              {user.role.replace(/_/g, " ")}
            </span>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard"
              className="flex cursor-pointer items-center gap-2 rounded-btn px-2.5 py-2 text-sm text-ink outline-none transition-colors duration-150 ease-out hover:bg-surface-muted data-[highlighted]:bg-surface-muted"
            >
              <LayoutDashboard size={15} strokeWidth={1.75} />
              Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            onSelect={logout}
            className="flex cursor-pointer items-center gap-2 rounded-btn px-2.5 py-2 text-sm text-red-600 outline-none transition-colors duration-150 ease-out hover:bg-red-50 data-[highlighted]:bg-red-50"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
