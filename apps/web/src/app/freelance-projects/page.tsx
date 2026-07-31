import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Freelance Projects for Verified Students",
  description:
    "Client-posted freelance projects on C2CW — admin-approved and admin-assigned, paid out by milestone through the platform wallet.",
};

interface FreelanceProject {
  id: string;
  title: string;
  description: string | null;
  status: string;
  client: { name: string | null } | null;
}

async function getFreelanceProjects(): Promise<FreelanceProject[]> {
  try {
    return await api.get<FreelanceProject[]>("/freelance/public");
  } catch {
    return [];
  }
}

export default async function FreelanceProjectsPage() {
  const projects = await getFreelanceProjects();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Freelance"
        title="Freelance projects, matched — not bid for"
        description="Clients post a project, admins approve it and assign the right student. No open bidding wars — payment releases per milestone straight to your C2CW wallet."
      />

      <section className="mt-10">
        <h2 className="sr-only">Open freelance projects</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && (
            <p className="text-sm text-ink-secondary">No freelance projects open yet — check back soon.</p>
          )}
          {projects.map((p) => (
            <div key={p.id} className="card">
              <span className="badge-verified">{p.status.replace("_", " ")}</span>
              <h3 className="mt-2 font-heading text-lg font-medium">{p.title}</h3>
              {p.description && <p className="mt-2 text-sm text-ink-secondary">{p.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Get matched to a freelance project"
        description="Register as a student — admins assign projects based on your verified skills."
      />
    </PageShell>
  );
}
