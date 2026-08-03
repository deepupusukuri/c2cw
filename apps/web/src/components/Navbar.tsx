"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ProfileMenu } from "./ui/ProfileMenu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/programs", label: "Programs", hiddenOnMobile: true },
  { href: "/internships", label: "Internships", hiddenOnMobile: true },
  { href: "/jobs", label: "Jobs", hiddenOnMobile: false },
  { href: "/talks", label: "Talks", hiddenOnMobile: true },
  { href: "/search", label: "Search", hiddenOnMobile: true },
];

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-heading text-lg font-semibold text-ink">
          C2CW
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  link.hiddenOnMobile && "hidden sm:inline",
                  active ? "font-semibold text-ink" : "text-ink-secondary hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <ProfileMenu showName={false} />
          ) : (
            <>
              <Link href="/login" className="text-ink-secondary hover:text-ink">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
