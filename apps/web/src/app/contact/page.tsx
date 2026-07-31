import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the C2CW team — sponsorship, partnerships, or general questions.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about sponsorship, partnerships, or anything else — send a message and it'll go straight to our inbox."
      />
      <div className="mt-10">
        <ContactForm />
      </div>
    </PageShell>
  );
}
