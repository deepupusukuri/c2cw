import { LucideIcon, Inbox } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-ink-secondary">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="max-w-xs text-xs text-ink-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
