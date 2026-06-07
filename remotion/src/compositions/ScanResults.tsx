import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { z } from "zod";

const flagSchema = z.object({
  title: z.string(),
  severity: z.enum(["high", "medium", "low"]),
});

export const scanResultsSchema = z.object({
  companyName: z.string(),
  documentName: z.string(),
  redFlags: z.array(flagSchema),
});

type Props = z.infer<typeof scanResultsSchema>;

const severityColor: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#3b82f6",
};

const Title: React.FC<{ companyName: string; documentName: string }> = ({
  companyName,
  documentName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const translateY = spring({ frame, fps, from: 30, to: 0, durationInFrames: 20 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <div style={{ opacity, transform: `translateY(${translateY}px)`, textAlign: "center" }}>
        <div style={{ color: "#94a3b8", fontSize: 32, fontFamily: "Arial", marginBottom: 12 }}>
          Compliance Scan Results
        </div>
        <div style={{ color: "white", fontSize: 64, fontFamily: "Arial", fontWeight: 700 }}>
          {companyName}
        </div>
        <div style={{ color: "#cbd5e1", fontSize: 36, fontFamily: "Arial", marginTop: 8 }}>
          {documentName}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FlagRow: React.FC<{
  title: string;
  severity: "high" | "medium" | "low";
  index: number;
}> = ({ title, severity, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 8;
  const progress = spring({ frame: frame - delay, fps, from: 0, to: 1, durationInFrames: 15 });
  const translateX = interpolate(progress, [0, 1], [-80, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `translateX(${translateX}px)`,
        background: "#1e293b",
        borderRadius: 12,
        padding: "20px 28px",
        marginBottom: 16,
        borderLeft: `6px solid ${severityColor[severity]}`,
      }}
    >
      <div
        style={{
          color: severityColor[severity],
          fontFamily: "Arial",
          fontWeight: 700,
          fontSize: 20,
          textTransform: "uppercase",
          letterSpacing: 1,
          minWidth: 90,
        }}
      >
        {severity}
      </div>
      <div style={{ color: "white", fontFamily: "Arial", fontSize: 28 }}>{title}</div>
    </div>
  );
};

const FlagList: React.FC<{ redFlags: Props["redFlags"] }> = ({ redFlags }) => (
  <AbsoluteFill style={{ background: "#0f172a", padding: 100, justifyContent: "center" }}>
    <div style={{ color: "white", fontFamily: "Arial", fontSize: 40, fontWeight: 700, marginBottom: 32 }}>
      {redFlags.length} potential issues found
    </div>
    {redFlags.map((flag, i) => (
      <FlagRow key={flag.title} title={flag.title} severity={flag.severity} index={i} />
    ))}
  </AbsoluteFill>
);

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        opacity,
      }}
    >
      <div style={{ color: "white", fontFamily: "Arial", fontSize: 48, fontWeight: 700 }}>
        Scan your contracts at redflagaipro.com
      </div>
    </AbsoluteFill>
  );
};

export const ScanResults: React.FC<Props> = ({ companyName, documentName, redFlags }) => {
  return (
    <>
      <Sequence durationInFrames={90}>
        <Title companyName={companyName} documentName={documentName} />
      </Sequence>
      <Sequence from={75} durationInFrames={165}>
        <FlagList redFlags={redFlags} />
      </Sequence>
      <Sequence from={230} durationInFrames={70}>
        <Outro />
      </Sequence>
    </>
  );
};
