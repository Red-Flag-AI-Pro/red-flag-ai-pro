"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/types";

interface Client {
  id: string;
  name: string;
  website: string | null;
  notes: string | null;
  created_at: string;
  scanCount: number;
}

interface Props {
  initialClients: Client[];
  plan: Plan;
}

export function ClientManager({ initialClients, plan }: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), website: website.trim(), notes: notes.trim(), contact_email: contactEmail.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setClients((prev) => [{ ...data, scanCount: 0 }, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setWebsite("");
      setNotes("");
      setContactEmail("");
      setShowForm(false);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this client? Scans will not be deleted.")) return;
    await fetch("/api/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Add client */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-white/10 px-5 py-3 text-sm text-[rgba(244,241,234,0.5)] hover:border-red-300 hover:text-[#E5484D] transition-colors w-full"
        >
          <span className="text-lg">+</span> Add a client
        </button>
      ) : (
        <Card>
          <h2 className="text-sm font-semibold text-[#F4F1EA] mb-3">New client</h2>
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name *"
              className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              autoFocus
            />
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website (optional)"
              className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Client contact email (for auto-reports)"
              className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-[#F4F1EA] placeholder-[rgba(244,241,234,0.4)] focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>
          {error && <p className="mt-2 text-xs text-[#E5484D]">{error}</p>}
          <div className="mt-3 flex gap-2">
            <Button size="sm" loading={loading} onClick={handleCreate} disabled={!name.trim()}>
              Create client
            </Button>
            <button
              onClick={() => { setShowForm(false); setError(null); }}
              className="px-3 py-1.5 text-sm text-[rgba(244,241,234,0.5)] hover:text-[rgba(244,241,234,0.8)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Client list */}
      {clients.length === 0 ? (
        <Card>
          <div className="py-8 text-center text-sm text-[rgba(244,241,234,0.4)]">
            <p className="text-3xl mb-3">🏢</p>
            No clients yet. Add your first client above.
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {clients.map((c) => (
            <div
              key={c.id}
              className="group relative rounded-xl border border-white/10 bg-[#102943] p-5 hover:border-[rgba(229,72,77,0.3)] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/clients/${c.id}`} className="block">
                    <h3 className="font-semibold text-[#F4F1EA] hover:text-[#E5484D] transition-colors truncate">
                      {c.name}
                    </h3>
                  </Link>
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[rgba(244,241,234,0.4)] hover:text-[#E5484D] truncate block mt-0.5"
                    >
                      {c.website}
                    </a>
                  )}
                  {c.notes && (
                    <p className="text-xs text-[rgba(244,241,234,0.4)] mt-1 line-clamp-2">{c.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-[rgba(244,241,234,0.35)] hover:text-red-500 transition-all text-sm flex-shrink-0"
                  title="Remove client"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[rgba(244,241,234,0.4)]">
                  {c.scanCount} scan{c.scanCount !== 1 ? "s" : ""}
                </span>
                <Link
                  href={`/clients/${c.id}`}
                  className="text-xs font-medium text-[#E5484D] hover:underline"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
