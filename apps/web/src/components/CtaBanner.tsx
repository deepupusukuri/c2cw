import Link from "next/link";

export function CtaBanner({
  title,
  description,
  ctaLabel = "Get started",
  ctaHref = "/register",
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="card mt-16 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="font-heading text-lg font-medium">{title}</h2>
        <p className="mt-1 text-sm text-ink-secondary">{description}</p>
      </div>
      <Link href={ctaHref} className="btn-primary shrink-0">
        {ctaLabel}
      </Link>
    </div>
  );
}
