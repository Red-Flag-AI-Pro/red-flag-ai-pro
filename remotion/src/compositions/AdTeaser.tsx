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
import { loadFont } from "@remotion/google-fonts/Syne";

// Brand palette pulled from the live site (src/app/page.tsx)
const RED = "#ef4444";
const DARK_RED = "#cc0000";
const BLACK = "#0a0a0a";
const NEAR_BLACK = "#0f0f0f";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"] });
const FONT = fontFamily;

const flagSchema = z.object({
  title: z.string(),
});

export const adTeaserSchema = z.object({
  hook: z.string(),
  flags: z.array(flagSchema),
  stat: z.string(),
  statSubtext: z.string(),
  cta: z.string(),
  url: z.string(),
});

type Props = z.infer<typeof adTeaserSchema>;

// ---- Scene 1: Hook (0-3s / frames 0-90) ----
const Hook: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, from: 0.85, to: 1, durationInFrames: 18 });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at 50% 40%, ${NEAR_BLACK} 0%, ${BLACK} 70%)`,
        padding: 90,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          color: "white",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.15,
        }}
      >
        Would <span style={{ color: RED }}>YOUR</span> ad pass a compliance check?
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 2: Flag reveals (3-8s / frames 90-240) ----
const FlagCard: React.FC<{ title: string; index: number }> = ({ title, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = index * 18;
  const progress = spring({ frame: frame - delay, fps, from: 0, to: 1, durationInFrames: 16 });
  const translateY = interpolate(progress, [0, 1], [50, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        alignItems: "center",
        gap: 22,
        background: NEAR_BLACK,
        border: `2px solid ${RED}`,
        borderRadius: 18,
        padding: "28px 34px",
        marginBottom: 22,
        width: 820,
      }}
    >
      <div style={{ fontSize: 40 }}>🚩</div>
      <div style={{ color: "white", fontFamily: FONT, fontWeight: 700, fontSize: 34 }}>
        {title}
      </div>
    </div>
  );
};

const FlagReveal: React.FC<{ flags: Props["flags"] }> = ({ flags }) => {
  const frame = useCurrentFrame();
  const headerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BLACK, justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div
        style={{
          opacity: headerOpacity,
          color: "#a1a1aa",
          fontFamily: FONT,
          fontSize: 30,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 28,
        }}
      >
        Scan complete — issues detected
      </div>
      {flags.map((flag, i) => (
        <FlagCard key={flag.title} title={flag.title} index={i} />
      ))}
    </AbsoluteFill>
  );
};

// ---- Scene 3: Stat punch (8-12s / frames 240-360) ----
const StatPunch: React.FC<{ stat: string; subtext: string }> = ({ stat, subtext }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, from: 0.7, to: 1, durationInFrames: 20 });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: `linear-gradient(160deg, ${BLACK} 0%, ${NEAR_BLACK} 50%, ${DARK_RED}22 100%)`,
        padding: 90,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: RED,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 130,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        {stat}
      </div>
      <div
        style={{
          opacity: subOpacity,
          color: "white",
          fontFamily: FONT,
          fontSize: 38,
          textAlign: "center",
          marginTop: 28,
          maxWidth: 760,
        }}
      >
        {subtext}
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 4: CTA / Outro (12-15s / frames 360-450) ----
const Outro: React.FC<{ cta: string; url: string }> = ({ cta, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const translateY = spring({ frame, fps, from: 24, to: 0, durationInFrames: 20 });
  const pulse = 1 + 0.04 * Math.sin(frame / 6);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: `radial-gradient(circle at 50% 50%, ${NEAR_BLACK} 0%, ${BLACK} 75%)`,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          color: "white",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 60,
          letterSpacing: 1,
        }}
      >
        Red Flag <span style={{ color: RED }}>AI</span>
      </div>
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px) scale(${pulse})`,
          marginTop: 36,
          background: RED,
          color: "white",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 42,
          padding: "22px 48px",
          borderRadius: 999,
        }}
      >
        {cta}
      </div>
      <div
        style={{
          opacity,
          marginTop: 26,
          color: "#a1a1aa",
          fontFamily: FONT,
          fontSize: 32,
        }}
      >
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const AdTeaser: React.FC<Props> = ({ hook, flags, stat, statSubtext, cta, url }) => {
  return (
    <>
      <Sequence durationInFrames={90}>
        <Hook text={hook} />
      </Sequence>
      <Sequence from={90} durationInFrames={150}>
        <FlagReveal flags={flags} />
      </Sequence>
      <Sequence from={240} durationInFrames={120}>
        <StatPunch stat={stat} subtext={statSubtext} />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <Outro cta={cta} url={url} />
      </Sequence>
    </>
  );
};
