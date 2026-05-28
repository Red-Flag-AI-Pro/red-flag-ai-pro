import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

const MONITOR_LIMITS: Record<Plan, number> = {
  free: 0,
  pro: 0,
  enterprise: 5,
  sentinel: Infinity,
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("monitored_urls")
    .select("*, clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const limit = MONITOR_LIMITS[plan];

  if (limit === 0) {
    return NextResponse.json(
      { error: "URL monitoring is available on Growth and Sentinel plans." },
      { status: 403 }
    );
  }

  if (limit !== Infinity) {
    const { count } = await supabase
      .from("monitored_urls")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= limit) {
      return NextResponse.json(
        { error: `You have reached the limit of ${limit} monitored URLs on the Growth plan. Upgrade to Sentinel for unlimited monitoring.` },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const url: string = (body.url ?? "").trim();
  const label: string = (body.label ?? "").trim();
  const client_id: string | null = body.client_id ?? null;

  if (!url) return NextResponse.json({ error: "URL is required." }, { status: 400 });

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  try { new URL(fullUrl); } catch {
    return NextResponse.json({ error: "Please enter a valid URL." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("monitored_urls")
    .insert({ user_id: user.id, url: fullUrl, label: label || null, client_id })
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Failed to save." }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await supabase.from("monitored_urls").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ ok: true });
}
