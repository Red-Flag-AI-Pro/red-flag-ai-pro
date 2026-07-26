import { Resend } from "resend";

// Sends the governance assessment summary to the respondent. All content is
// loaded server side from governance_audit_emails, never trusted from the
// client, so this can only ever send a person their own stored results.
export async function sendGovernanceSummaryEmail({
  email,
  score,
  riskLevel,
  topGaps,
}: {
  email: string;
  score: number;
  riskLevel: string;
  topGaps: string[];
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("governance summary email skipped: RESEND_API_KEY not set");
    return;
  }

  const gapsHtml = topGaps.length
    ? `<p style="margin:16px 0 6px;color:#666;font-size:13px">Your biggest gaps</p>
       <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.7">
         ${topGaps.map((g) => `<li>${g}</li>`).join("")}
       </ul>`
    : "";

  const html = `<div style="font-family:Georgia,'Times New Roman',serif;max-width:560px;margin:0 auto;color:#1a1a1a">
    <p style="font-size:15px;line-height:1.7">Here is your Governance Maturity Index result.</p>
    <div style="padding:20px 24px;background:#0A1628;border-radius:10px;margin:16px 0">
      <p style="margin:0;color:#F4F1EA;font-size:34px;font-weight:700">${score}/100</p>
      <p style="margin:6px 0 0;color:rgba(244,241,234,0.7);font-size:14px;text-transform:capitalize">Risk level: ${riskLevel}</p>
    </div>
    ${gapsHtml}
    <p style="font-size:14px;line-height:1.7;margin-top:20px">A score is a snapshot. Governance you cannot demonstrate counts as governance you did not do, and the gap between the two is what a regulator or board will ask about first. Your full gap analysis, the specific frameworks each gap engages, and your 90 day roadmap are on your results page, and Growth unlocks every finding with the exact first remediation step.</p>
    <p style="font-size:14px;line-height:1.7">
      <a href="https://www.redflagaipro.com/pricing" style="color:#E5484D">See what unlocking every gap looks like</a>
    </p>
    <p style="font-size:13px;color:#888;line-height:1.6;margin-top:24px">James Stokes<br/>Red Flag AI Pro · redflagaipro.com</p>
  </div>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Red Flag AI Pro <audit@redflagaipro.com>",
      to: email,
      subject: `Your AI governance score: ${score}/100`,
      html,
    });
    if (error) console.error("governance summary email failed:", error);
  } catch (err) {
    console.error("governance summary email error:", err);
  }
}
