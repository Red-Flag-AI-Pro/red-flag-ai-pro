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
      body: JSON.stringify({ name: name.trim(), website: website.trim(), notes: notes.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setClients((prev) => [{ ...data, scanCount: 0 }, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setWebsite("");
      setNotes("");
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
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-5 py-3 text-sm text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors w-full"
        >
          <span className="text-lg">+</span> Add a client
        </button>
      ) : (
        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">New client</h2>
          <div className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name *"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              autoFocus
            />
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website (optional)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <div className="mt-3 flex gap-2">
            <Button size="sm" loading={loading} onClick={handleCreate} disabled={!name.trim()}>
              Create client
            </Button>
            <button
              onClick={() => { setShowForm(false); setError(null); }}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Client list */}
      {clients.length === 0 ? (
        <Card>
          <div className="py-8 text-center text-sm text-gray-400">
            <p className="text-3xl mb-3">🏢</p>
            No clients yet. Add your first client above.
          </div>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {clients.map((c) => (
            <div
              key={c.id}
              className="group relative rounded-xl border border-gray-200 bg-white p-5 hover:border-red-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/clients/${c.id}`} className="block">
                    <h3 className="font-semibold text-gray-900 hover:text-red-600 transition-colors truncate">
                      {c.name}
                    </h3>
                  </Link>
                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-red-600 truncate block mt-0.5"
                    >
                      {c.website}
                    </a>
                  )}
                  {c.notes && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{c.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-sm flex-shrink-0"
                  title="Remove client"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {c.scanCount} scan{c.scanCount !== 1 ? "s" : ""}
                </span>
                <Link
                  href={`/clients/${c.id}`}
                  className="text-xs font-medium text-red-600 hover:underline"
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
