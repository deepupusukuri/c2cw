import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "primary" | "green" | "orange" | "purple";

const ACCENT_BG: Record<Accent, string> = {
  primary: "bg-primary/10 text-primary",
  green: "bg-accent-green/10 text-accent-green",
  orange: "bg-accent-orange/10 text-accent-orange",
  purple: "bg-purple-100 text-purple-700",
};

export function ListCard({
  icon: Icon,
  accent = "primary",
  title,
  caption,
  badge,
  actions,
  children,
}: {
  icon?: LucideIcon;
  accent?: Accent;
  title: React.ReactNode;
  caption?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="card transition-shadow duration-150 ease-out hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-btn",
                ACCENT_BG[accent],
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            {caption && <p className="mt-0.5 text-xs text-ink-secondary">{caption}</p>}
            {badge && <div className="mt-1.5">{badge}</div>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function ListStack({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}
