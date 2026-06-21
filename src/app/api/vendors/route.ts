import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit-log";

async function requirePaidUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" as const, status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  if (plan === "free") return { error: "Vendor tracking is available on Pro and Sentinel plans." as const, status: 403 as const };

  return { supabase, user };
}

export async function GET() {
  const result = await requirePaidUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const { data, error } = await result.supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to load vendors." }, { status: 500 });
  return NextResponse.json({ vendors: data ?? [] });
}

export async function POST(request: Request) {
  const result = await requirePaidUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json();
  const name: string = (body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Vendor name is required." }, { status: 400 });

  const { data, error } = await result.supabase
    .from("vendors")
    .insert({
      user_id: result.user.id,
      name,
      purpose: (body.purpose ?? "").trim() || null,
      data_shared: (body.data_shared ?? "").trim() || null,
      risk_level: body.risk_level ?? "unassessed",
      contract_reviewed: !!body.contract_reviewed,
      last_reviewed_at: body.last_reviewed_at || null,
      next_review_due: body.next_review_due || null,
      notes: (body.notes ?? "").trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to add vendor." }, { status: 500 });
  await logAuditEvent(result.user.id, "vendor_added", { vendor_id: data.id, name: data.name });
  return NextResponse.json({ vendor: data });
}

export async function PATCH(request: Request) {
  const result = await requirePaidUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json();
  const id: string = body.id;
  if (!id) return NextResponse.json({ error: "Vendor id is required." }, { status: 400 });

  const updates: Record<string, unknown> = {};
  for (const key of ["name", "purpose", "data_shared", "risk_level", "contract_reviewed", "last_reviewed_at", "next_review_due", "notes"]) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await result.supabase
    .from("vendors")
    .update(updates)
    .eq("id", id)
    .eq("user_id", result.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to update vendor." }, { status: 500 });
  await logAuditEvent(
    result.user.id,
    updates.contract_reviewed ? "vendor_reviewed" : "vendor_updated",
    { vendor_id: data.id, name: data.name }
  );
  return NextResponse.json({ vendor: data });
}

export async function DELETE(request: Request) {
  const result = await requirePaidUser();
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  const body = await request.json();
  const id: string = body.id;
  if (!id) return NextResponse.json({ error: "Vendor id is required." }, { status: 400 });

  const { error } = await result.supabase
    .from("vendors")
    .delete()
    .eq("id", id)
    .eq("user_id", result.user.id);

  if (error) return NextResponse.json({ error: "Failed to delete vendor." }, { status: 500 });
  await logAuditEvent(result.user.id, "vendor_removed", { vendor_id: id });
  return NextResponse.json({ ok: true });
}
