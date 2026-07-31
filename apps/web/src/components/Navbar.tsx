"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ProfileMenu } from "./ui/ProfileMenu";

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-heading text-lg font-semibold text-ink">
          C2CW
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/programs" className="hidden text-ink-secondary hover:text-ink sm:inline">
            Programs
          </Link>
          <Link href="/internships" className="hidden text-ink-secondary hover:text-ink sm:inline">
            Internships
          </Link>
          <Link href="/jobs" className="text-ink-secondary hover:text-ink">
            Jobs
          </Link>
          <Link href="/talks" className="hidden text-ink-secondary hover:text-ink sm:inline">
            Talks
          </Link>
          <Link href="/search" className="hidden text-ink-secondary hover:text-ink sm:inline">
            Search
          </Link>
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
