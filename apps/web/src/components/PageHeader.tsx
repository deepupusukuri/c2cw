export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <span className="badge-sponsored mb-4">{eyebrow}</span>}
      <h1 className="font-heading text-3xl font-semibold leading-tight text-ink">{title}</h1>
      {description && <p className="mt-4 text-lg text-ink-secondary">{description}</p>}
    </div>
  );
}
