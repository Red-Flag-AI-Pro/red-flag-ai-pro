import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envPath = "C:/Users/jbs/red-flag-ai-pro/.env.local";
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error, count } = await supabase
  .from("research_checks")
  .select("company_name, domain, kind, ruling_source_url, notes", { count: "exact" })
  .eq("has_public_ruling", true)
  .order("company_name", { ascending: true });

if (error) {
  console.log("ERROR:", error.message);
  process.exit(1);
}

console.log(`Total: ${count}\n`);
data.forEach((d) => {
  console.log(`### ${d.company_name} (${d.domain}) [${d.kind}]`);
  console.log(d.notes);
  console.log(d.ruling_source_url);
  console.log("");
});
