"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerChildren, slideUp } from "@/lib/motion";

type Accent = "primary" | "green" | "orange" | "purple";

const ACCENT_BG: Record<Accent, string> = {
  primary: "bg-primary/10 text-primary",
  green: "bg-accent-green/10 text-accent-green",
  orange: "bg-accent-orange/10 text-accent-orange",
  purple: "bg-purple-100 text-purple-700",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: Accent;
}) {
  return (
    <motion.div variants={slideUp} className="card flex items-center gap-4">
      {Icon && (
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-btn", ACCENT_BG[accent])}>
          <Icon size={20} strokeWidth={1.75} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-semibold leading-tight">{value}</p>
        <p className="text-xs leading-snug text-ink-secondary">{label}</p>
      </div>
    </motion.div>
  );
}

export function StatGrid({ children, columns = 4 }: { children: React.ReactNode; columns?: 2 | 3 | 4 }) {
  const colsClass =
    columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-1 gap-4", colsClass)}
    >
      {children}
    </motion.div>
  );
}
