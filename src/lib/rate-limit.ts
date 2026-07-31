import { createServiceClient } from "@/lib/supabase/server";

// A simple, durable-enough rate limit for public unauthenticated endpoints,
// backed by Postgres since no Redis/KV is provisioned. Not built for high
// throughput, built to stop one script hammering an open POST endpoint.
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean }> {
  try {
    const supabase = await createServiceClient();
    const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

    // Opportunistic cleanup: only rows for this key, only ones already
    // outside the window, so the table never needs a separate cron job.
    await supabase.from("rate_limits").delete().eq("rate_key", key).lt("created_at", windowStart);

    const { count } = await supabase
      .from("rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("rate_key", key)
      .gte("created_at", windowStart);

    if ((count ?? 0) >= maxRequests) {
      return { allowed: false };
    }

    await supabase.from("rate_limits").insert({ rate_key: key });
    return { allowed: true };
  } catch (err) {
    // Rate limiting must never break the request it's guarding, but a
    // silent catch here is exactly what made this hard to debug once —
    // always leave a trace.
    console.error("checkRateLimit failed open:", err);
    return { allowed: true };
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
