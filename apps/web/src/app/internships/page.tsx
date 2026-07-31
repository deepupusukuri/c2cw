import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Verified Internships for Students",
  description:
    "Corporate internship programs on C2CW — admin-approved postings, mentor-assigned, with evaluation scores that feed your readiness score.",
};

interface HiringPartner {
  companyName: string;
}

interface Internship {
  id: string;
  title: string;
  description: string | null;
  company: HiringPartner | null;
}

async function getInternships(): Promise<Internship[]> {
  try {
    return await api.get<Internship[]>("/internships");
  } catch {
    return [];
  }
}

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Internships"
        title="Verified internships for students"
        description="Every posting is admin-approved before it goes live. Selection, mentor assignment, and evaluation all happen on-platform — and evaluation scores feed directly into your corporate-readiness score."
      />

      <section className="mt-10">
        <h2 className="sr-only">Open internships</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {internships.length === 0 && (
            <p className="text-sm text-ink-secondary">No open internships yet — check back soon.</p>
          )}
          {internships.map((i) => (
            <div key={i.id} className="card">
              {i.company && <span className="badge-sponsored">{i.company.companyName}</span>}
              <h3 className="mt-2 font-heading text-lg font-medium">{i.title}</h3>
              {i.description && <p className="mt-2 text-sm text-ink-secondary">{i.description}</p>}
            </div>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Apply to a real internship, not just a listing"
        description="Register as a student to apply, get selected, and start building an evaluated track record."
      />
    </PageShell>
  );
}
