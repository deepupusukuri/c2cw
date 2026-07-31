import { LucideIcon } from "lucide-react";
import { ListCard, ListStack } from "./ListCard";

export function InfoPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <div className="card h-fit space-y-3 border-primary/15 bg-primary/5">
      <div className="flex items-center gap-2">
        <Icon size={18} strokeWidth={1.75} className="text-primary" />
        <h3 className="font-heading text-sm font-medium">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-xs leading-relaxed text-ink-secondary">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ActivityList({
  title,
  items,
  emptyText,
  icon,
}: {
  title: string;
  items: { id: string; label: string; meta: string; badge?: string }[];
  emptyText: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-heading text-base font-medium">{title}</h3>
      {items.length === 0 && (
        <div className="card">
          <p className="text-sm text-ink-secondary">{emptyText}</p>
        </div>
      )}
      {items.length > 0 && (
        <ListStack>
          {items.map((item) => (
            <ListCard
              key={item.id}
              icon={icon}
              title={item.label}
              caption={item.meta}
              badge={item.badge && <span className="badge-pending">{item.badge}</span>}
            />
          ))}
        </ListStack>
      )}
    </div>
  );
}
