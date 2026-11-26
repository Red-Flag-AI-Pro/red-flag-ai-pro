import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getAdminUser, ukDate } from "@/lib/console";

function companyFromWebsite(website: string | null, email: string): string {
  const host = (website ?? "").replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
  if (host) return host;
  return email.split("@")[1] ?? email;
}

// Deal with a request that came in through the website: mark it handled, or
// move it into the prospect list so it is worked like everything else.
export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action === "to_prospect" ? "to_prospect" : body.action === "handled" ? "handled" : "";
  if (!id || !action) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const supabase = await createServiceClient();
  const { data: req, error } = await supabase.from("lead_requests").select("*").eq("id", id).single();
  if (error || !req) return NextResponse.json({ error: "Request not found." }, { status: 404 });

  let prospect = null;
  if (action === "to_prospect") {
    const what = req.kind === "site-check" ? "Send their red flag" : req.kind === "audit" ? "Reply about the full audit" : "Reply about Sentinel";
    const { data: created, error: createError } = await supabase
      .from("prospects")
      .insert({
        company: req.company || companyFromWebsite(req.website, req.email),
        website: req.website,
        contact_name: req.name,
        email: req.email,
        phone: req.phone,
        source: "inbound",
        stage: "replied",
        next_action: what,
        next_action_at: ukDate(0),
        notes: req.message ? `From the website form (${req.kind}): ${req.message}` : `From the website form (${req.kind}).`,
      })
      .select("*")
      .single();
    if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });
    prospect = created;
  }

  const { error: markError } = await supabase.from("lead_requests").update({ handled_at: new Date().toISOString() }).eq("id", id);
  if (markError) return NextResponse.json({ error: markError.message }, { status: 500 });

  return NextResponse.json({ ok: true, prospect });
}
