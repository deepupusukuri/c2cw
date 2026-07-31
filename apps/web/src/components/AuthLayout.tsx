import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Verified programs, internships, and job postings",
  "A readiness score that grows with every achievement",
  "Direct pipelines to hiring partners and placement agencies",
  "One dashboard for every role — student to admin",
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-950 p-10 text-white md:flex lg:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />

        <Link href="/" className="relative font-heading text-xl font-semibold">
          C2CW
        </Link>

        <div className="relative">
          <h2 className="font-heading text-3xl font-semibold leading-tight lg:text-4xl">
            From campus to career — all in one platform.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/75">
            Programs, internships, jobs, and mentorship — everything a student, college, or
            hiring partner needs to connect, in one place.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white/90">
                <CheckCircle2 size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-white" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">College to Corporate World</p>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 inline-block font-heading text-xl font-semibold md:hidden">
            C2CW
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
