import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { EDITABLE_FIELDS, getAdminUser, ukDate } from "@/lib/console";

const TEXT_LIMIT = 4000;

function clean(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (!(key in body)) continue;
    const v = body[key];
    if (key === "more_count") {
      const n = Number(v);
      out[key] = v === null || v === "" || !Number.isFinite(n) ? null : Math.max(0, Math.min(999, Math.round(n)));
    } else if (key === "tps_registered" || key === "do_not_contact") {
      out[key] = key === "tps_registered" && (v === null || v === undefined) ? null : Boolean(v);
    } else if (key === "next_action_at") {
      out[key] = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
    } else {
      const s = typeof v === "string" ? v.trim().slice(0, TEXT_LIMIT) : "";
      out[key] = s === "" ? null : s;
    }
  }
  return out;
}

// Create a prospect (no id) or update one (with id). Admin only.
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

  const fields = clean(body);
  const supabase = await createServiceClient();
  const id = typeof body.id === "string" ? body.id : null;

  if (id) {
    // Recording that the number was checked against the register is a
    // timestamp set here, not a value the browser sends.
    if (body.tps_checked === true) fields.tps_checked_at = new Date().toISOString();
    if (body.tps_checked === false) {
      fields.tps_checked_at = null;
      fields.tps_registered = null;
    }
    if ("company" in fields && !fields.company) {
      return NextResponse.json({ error: "A prospect needs a company name." }, { status: 400 });
    }
    fields.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from("prospects").update(fields).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ prospect: data });
  }

  if (!fields.company) {
    return NextResponse.json({ error: "A prospect needs a company name." }, { status: 400 });
  }
  if (!fields.next_action) {
    fields.next_action = "Send the first message";
    fields.next_action_at = fields.next_action_at ?? ukDate(0);
  }
  const { data, error } = await supabase.from("prospects").insert(fields).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prospect: data });
}
