import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import React from "react";

export const metadata: Metadata = {
  title: "EU-KI-Verordnung Artikel 50: Was jetzt für Ihre Marketingtexte gilt",
  description: "Artikel 50 der EU-KI-Verordnung ist seit dem 2. August 2026 in Kraft. Was die Kennzeichnungspflicht für KI-generierte Inhalte konkret bedeutet, und wie die dokumentierte menschliche Überprüfung als sicherer Hafen funktioniert.",
  alternates: {
    canonical: "https://www.redflagaipro.com/de/eu-ai-act",
    languages: {
      en: "https://www.redflagaipro.com/blog/eu-ai-act-article-50-marketing-agencies",
      de: "https://www.redflagaipro.com/de/eu-ai-act",
    },
  },
};

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "3.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ ...syne, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#E5484D", marginBottom: "0.9rem" }}>{eyebrow}</p>
        <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "1.1rem" }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.62)", lineHeight: 1.75, marginBottom: "1.1rem" }}>{children}</p>;
}

export default function EuAiActGermanPage() {
  return (
    <div style={{ background: "#0A1628", minHeight: "100vh" }}>
      <Navbar />

      <section style={{ padding: "8rem 1.5rem 2.5rem", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <span style={{ width: "26px", height: "2px", background: "#E5484D" }} />
            <p style={{ ...syne, fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,241,234,0.6)" }}>Bereits in Kraft, seit 2. August 2026</p>
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, color: "#F4F1EA", letterSpacing: "-0.015em", lineHeight: 1.15, marginBottom: "1rem" }}>
            Artikel 50 der EU-KI-Verordnung: <span style={{ fontStyle: "italic", color: "#E5484D" }}>was jetzt gilt</span>
          </h1>
          <p style={{ ...syne, fontSize: "0.95rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            Die Transparenzpflichten für KI-generierte Inhalte sind kein zukünftiges Datum mehr, sondern geltendes Recht. Was das konkret für Marketingtexte, Werbung und Agenturarbeit bedeutet, ohne Umwege.
          </p>
        </div>
      </section>

      <Section eyebrow="Was Artikel 50 verlangt" title="Die Kennzeichnungspflicht, wörtlich">
        <P>
          Artikel 50 Absatz 4 der EU-KI-Verordnung verlangt, dass Betreiber von KI-Systemen, die Inhalte erzeugen oder verändern, sicherstellen, dass die Ausgaben in einem maschinenlesbaren Format als künstlich erzeugt oder manipuliert gekennzeichnet und als solche erkennbar sind. Das gilt für KI-generierte Texte, Bilder und Videos, die für die Öffentlichkeit bestimmt sind, also auch für Marketingtexte, Werbeanzeigen und Social-Media-Inhalte.
        </P>
        <P>
          Die Pflicht knüpft daran an, ob KI bei der Erstellung verwendet wurde, nicht daran, ob das Ergebnis wie von einem Menschen geschrieben wirkt. Ein überarbeiteter, natürlich klingender Text bleibt kennzeichnungspflichtig, wenn KI am Entstehungsprozess beteiligt war.
        </P>
      </Section>

      <Section eyebrow="Der Zeitpunkt" title="Keine Übergangsfrist mehr">
        <P>
          Der 2. August 2026 war das Datum, ab dem Artikel 50 durchsetzbar wurde, nicht ein Ziel für die Zukunft. Es gibt keine Karenzzeit über dieses Datum hinaus. Wer heute KI-generierte Marketinginhalte veröffentlicht, ohne sie zu kennzeichnen, verstößt bereits gegen geltendes Recht.
        </P>
      </Section>

      <Section eyebrow="Der sichere Hafen" title="Dokumentierte menschliche Überprüfung">
        <P>
          Artikel 50 Absatz 4 sieht eine Ausnahme für Inhalte vor, die eine dokumentierte redaktionelle Überprüfung durch einen Menschen durchlaufen haben. Das bedeutet konkret: Jemand in Ihrem Unternehmen oder Ihrer Agentur muss KI-generierte Texte vor der Veröffentlichung prüfen, und dieser Schritt muss nachweisbar festgehalten werden, wer geprüft hat, wann, und was konkret geprüft wurde.
        </P>
        <P>
          Ohne diese Dokumentation ist die Ausnahme im Streitfall nicht belegbar. Ein Prüfschritt, der nur mündlich stattfand, ist rechtlich kaum von keinem Prüfschritt zu unterscheiden.
        </P>
      </Section>

      <Section eyebrow="Klarstellung" title="Der Digital Omnibus hat Artikel 50 nicht verschoben">
        <P>
          Anpassungen im Rahmen des Digital Omnibus haben einige Fristen für die Einstufung von Hochrisiko-KI-Systemen auf Dezember 2027 verschoben. Artikel 50 war von dieser Verschiebung nicht betroffen und blieb durchgehend beim ursprünglichen Datum. Eine Verwechslung der beiden Zeitpläne ist einer der häufigsten Fehler, die wir in Auftragsunterlagen und Compliance-Checklisten sehen.
        </P>
      </Section>

      <section style={{ padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 500, color: "#F4F1EA", marginBottom: "0.75rem" }}>Prüfen Sie Ihre eigenen Texte</h2>
          <p style={{ ...syne, fontSize: "0.9rem", color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
            Kostenlos, unter 60 Sekunden, keine Kreditkarte nötig.
          </p>
          <Link href="/compliance-assessment" style={{
            display: "inline-block", background: "#E5484D", color: "white",
            ...syne, fontSize: "0.9rem", fontWeight: 700, padding: "14px 32px",
            borderRadius: "9999px", boxShadow: "0 8px 32px rgba(229,72,77,0.18)",
            textDecoration: "none", letterSpacing: "0.02em",
          }}>
            Kostenlose Prüfung starten →
          </Link>
        </div>
      </section>

      <section style={{ padding: "2rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(244,241,234,0.35)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
          Diese Seite fasst Artikel 50 der EU-KI-Verordnung zusammen, ersetzt aber keine Rechtsberatung. English version: {" "}
          <Link href="/blog/eu-ai-act-article-50-marketing-agencies" style={{ color: "#E5484D" }}>redflagaipro.com/blog</Link>.
        </p>
      </section>
      <Footer />
    </div>
  );
}
