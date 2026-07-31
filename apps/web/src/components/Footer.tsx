import Link from "next/link";

const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "For",
    links: [
      { label: "Students", href: "/students" },
      { label: "Colleges", href: "/colleges" },
      { label: "Corporates", href: "/corporates" },
      { label: "Hiring Partners", href: "/hiring-partners" },
      { label: "Placement Partners", href: "/placement-partners" },
      { label: "Trainers", href: "/trainers" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { label: "Programs", href: "/programs" },
      { label: "Workshops", href: "/workshops" },
      { label: "Internships", href: "/internships" },
      { label: "Freelance Projects", href: "/freelance-projects" },
      { label: "Jobs", href: "/jobs" },
      { label: "Talks", href: "/talks" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Sponsors", href: "/sponsors" },
      { label: "Seek Sponsorship", href: "/seek-sponsorship" },
      { label: "Marathon", href: "/marathon" },
      { label: "Campus Ambassador", href: "/campus-ambassador" },
      { label: "Success Stories", href: "/success-stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Log in", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-content px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-secondary hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-ink-secondary sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} C2CW — College to Corporate World</span>
          <span>Proof-based hiring for students, colleges, and corporates.</span>
        </div>
      </div>
    </footer>
  );
}
