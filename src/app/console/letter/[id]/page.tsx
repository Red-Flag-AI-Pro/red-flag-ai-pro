import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { CONTACT, getAdminUser, letterParagraphs, type Prospect } from "@/lib/console";
import { PrintButton } from "@/components/console/PrintButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Letter",
  robots: { index: false, follow: false },
};

// A one page letter to a prospect, laid out for A4 and a window envelope.
// Opens in its own tab from the console; press Print.
export default async function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?next=/console");

  const { id } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase.from("prospects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = data as Prospect;

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });
  const addressLines = [p.contact_name, p.contact_role, p.company, ...(p.postal_address ?? "").split(/\r?\n/)].map((l) => (l ?? "").trim()).filter(Boolean);
  const greeting = p.contact_name ? `Dear ${p.contact_name.trim().split(/\s+/)[0]},` : "Dear Sir or Madam,";

  return (
    <div className="letter-wrap">
      <style>{`
        @page { size: A4; margin: 0; }
        .letter-wrap { background: #e5e7eb; min-height: 100vh; padding: 24px 12px 60px; }
        .letter-bar { max-width: 210mm; margin: 0 auto 16px; display: flex; gap: 12px; align-items: center; justify-content: space-between; font-family: system-ui, sans-serif; font-size: 13px; color: #374151; }
        .letter { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; color: #111827; padding: 22mm 24mm 20mm; box-sizing: border-box; font-family: Georgia, "Times New Roman", serif; font-size: 11.5pt; line-height: 1.55; box-shadow: 0 4px 24px rgba(0,0,0,0.18); }
        .letter-head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #C0363B; padding-bottom: 6mm; margin-bottom: 14mm; }
        .letter-brand { font-size: 17pt; font-weight: 700; color: #0A1628; letter-spacing: -0.01em; }
        .letter-brand span { color: #C0363B; }
        .letter-tag { font-family: system-ui, sans-serif; font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: #6b7280; margin-top: 2mm; }
        .letter-contact { font-family: system-ui, sans-serif; font-size: 8.5pt; color: #4b5563; text-align: right; line-height: 1.5; }
        .letter-address { min-height: 32mm; margin-bottom: 8mm; font-size: 11pt; line-height: 1.4; }
        .letter-private { font-family: system-ui, sans-serif; font-size: 8pt; letter-spacing: 0.14em; text-transform: uppercase; color: #6b7280; margin-bottom: 2mm; }
        .letter p { margin: 0 0 4.2mm; }
        .letter .quote { border-left: 2.5pt solid #C0363B; padding-left: 5mm; font-style: italic; color: #0A1628; }
        .letter-sign { margin-top: 10mm; }
        .letter-foot { margin-top: 12mm; padding-top: 4mm; border-top: 1px solid #e5e7eb; font-family: system-ui, sans-serif; font-size: 8pt; color: #6b7280; line-height: 1.5; }
        @media print {
          /* Only the letter prints: the site's cookie bar and chat bubble sit
             outside this page's markup, so hide everything and reveal the sheet. */
          body * { visibility: hidden !important; }
          .letter, .letter * { visibility: visible !important; }
          .letter-wrap { background: #fff; padding: 0; }
          .letter-bar { display: none; }
          .letter { box-shadow: none; margin: 0; position: absolute; left: 0; top: 0; }
        }
      `}</style>

      <div className="letter-bar">
        <span>Letter to {p.company}. Check the address and the wording, then print on one sheet.</span>
        <PrintButton />
      </div>

      <div className="letter">
        <div className="letter-head">
          <div>
            <div className="letter-brand">Red Flag <span>AI Pro</span></div>
            <div className="letter-tag">Catch what you said. Prove what you did.</div>
          </div>
          <div className="letter-contact">
            {CONTACT.name}<br />
            {CONTACT.email}<br />
            {CONTACT.website}
          </div>
        </div>

        <div className="letter-address">
          <div className="letter-private">Private and confidential</div>
          {addressLines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>

        <p>{today}</p>
        <p>{greeting}</p>

        {letterParagraphs(p).map((para, i) => (
          <p key={i} className={para.includes(' says: "') ? "quote" : undefined}>{para}</p>
        ))}

        <div className="letter-sign">
          <p>Yours sincerely,</p>
          <p style={{ marginTop: "12mm" }}>
            {CONTACT.name}<br />
            {CONTACT.business}
          </p>
        </div>

        <div className="letter-foot">
          I found your details from public sources (your website and Companies House) and wrote because I believe this is relevant to your business. If you would rather not hear from me again, email {CONTACT.email} and I will not write again.
        </div>
      </div>
    </div>
  );
}
