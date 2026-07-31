"use client";

import { useState } from "react";

const CONTACT_EMAIL = "hello@c2cw.dev";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`C2CW contact form — ${name || "New message"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-md space-y-4">
      <div>
        <label className="text-sm text-ink-secondary">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-ink-secondary">Message</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-field mt-1"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Send message
      </button>
      <p className="text-xs text-ink-secondary">
        Opens your email client addressed to {CONTACT_EMAIL} — we don&apos;t store this form.
      </p>
    </form>
  );
}
