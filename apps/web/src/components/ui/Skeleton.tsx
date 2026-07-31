import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-btn bg-gradient-to-r from-border via-surface-muted to-border bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-7 w-20" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="card space-y-2">
      <Skeleton className="h-8 w-10" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
