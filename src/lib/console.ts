import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/console-shared";

// Server side entry point for the sales console: everything in
// console-shared, plus the admin check, which needs the request's cookies and
// so cannot be imported into browser code.

export * from "@/lib/console-shared";

/** Returns the signed in user only if they are the admin, otherwise null. */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user && user.email === ADMIN_EMAIL ? user : null;
}
