export function BenefitsGrid({
  heading,
  items,
}: {
  heading?: string;
  items: { title: string; description: string }[];
}) {
  return (
    <section className="mt-10">
      {heading && <h2 className="font-heading text-xl font-semibold">{heading}</h2>}
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${heading ? "mt-6" : ""}`}>
        {items.map((item) => (
          <div key={item.title} className="card">
            <h3 className="font-heading text-base font-medium">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-secondary">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
