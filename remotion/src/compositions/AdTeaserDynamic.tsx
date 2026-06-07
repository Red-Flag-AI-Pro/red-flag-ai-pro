import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { z } from "zod";
import { loadFont } from "@remotion/google-fonts/Syne";

const RED = "#ef4444";
const DARK_RED = "#cc0000";
const BLACK = "#0a0a0a";
const NEAR_BLACK = "#0f0f0f";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"] });
const FONT = fontFamily;

export const adTeaserDynamicSchema = z.object({
  flags: z.array(z.object({ title: z.string() })),
  stat: z.string(),
  statSubtext: z.string(),
  cta: z.string(),
  url: z.string(),
});

type Props = z.infer<typeof adTeaserDynamicSchema>;

// Animated scanline overlay — gives everything a "live system scanning" feel
const ScanlineOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 6) % 80;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(0deg, rgba(239,68,68,${opacity}) 0px, rgba(239,68,68,${opacity}) 1px, transparent 1px, transparent 4px)`,
        backgroundPosition: `0 ${offset}px`,
        mixBlendMode: "screen",
      }}
    />
  );
};

// Pulsing radial glow background that breathes
const GlowField: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 22);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${40 + pulse * 15}%, ${DARK_RED}33 0%, ${NEAR_BLACK} 45%, ${BLACK} 100%)`,
      }}
    />
  );
};

// Letter-by-letter kinetic reveal
const KineticText: React.FC<{
  text: string;
  fontSize: number;
  startFrame?: number;
  highlight?: string[];
  align?: "center" | "left";
}> = ({ text, fontSize, startFrame = 0, highlight = [], align = "center" }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "0 16px",
        maxWidth: 880,
      }}
    >
      {words.map((word, i) => {
        const delay = i * 4;
        const progress = spring({ frame: frame - delay, fps, from: 0, to: 1, durationInFrames: 14 });
        const translateY = interpolate(progress, [0, 1], [40, 0]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const isHighlighted = highlight.includes(word.replace(/[^a-zA-Z]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px)`,
              color: isHighlighted ? RED : "white",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize,
              textShadow: isHighlighted ? `0 0 30px ${RED}99` : "none",
              lineHeight: 1.15,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ---- Scene 1: Glitch hook (0-2.5s / frames 0-75) ----
const GlitchHook: React.FC = () => {
  const frame = useCurrentFrame();
  const glitchActive = frame % 14 < 2;
  const shiftX = glitchActive ? (frame % 2 === 0 ? 6 : -6) : 0;
  const flicker = interpolate(frame, [0, 8, 14, 75], [0, 1, 1, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: BLACK }}>
      <ScanlineOverlay opacity={0.1} />
      <div style={{ position: "relative", opacity: flicker }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            color: RED,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 88,
            transform: `translate(${shiftX}px, 0)`,
            opacity: glitchActive ? 0.6 : 0,
            filter: "blur(1px)",
          }}
        >
          SCANNING...
        </div>
        <div
          style={{
            color: "white",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 88,
            letterSpacing: 4,
          }}
        >
          SCANNING<span style={{ color: RED }}>...</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 2: Split-screen dual audience (2.5-6.5s / frames 75-195) ----
const SplitAudience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = spring({ frame, fps, from: 0, to: 1, durationInFrames: 22, config: { easing: Easing.out(Easing.cubic) } });
  const leftX = interpolate(wipe, [0, 1], [-60, 0]);
  const rightX = interpolate(wipe, [0, 1], [60, 0]);
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 800,
    color: "white",
    fontSize: 38,
    textAlign: "center",
    padding: "0 32px",
  };
  const subStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    color: "#a1a1aa",
    fontSize: 26,
    marginTop: 14,
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <ScanlineOverlay />
      <AbsoluteFill style={{ flexDirection: "row" }}>
        <div
          style={{
            flex: 1,
            opacity,
            transform: `translateX(${leftX}px)`,
            background: `linear-gradient(160deg, ${NEAR_BLACK} 0%, ${BLACK} 100%)`,
            borderRight: `2px solid ${RED}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 18 }}>🎙️</div>
          <div style={labelStyle}>Solo creators &amp; brands</div>
          <div style={subStyle}>One post. One scan.<br />Total peace of mind.</div>
        </div>
        <div
          style={{
            flex: 1,
            opacity,
            transform: `translateX(${rightX}px)`,
            background: `linear-gradient(200deg, ${NEAR_BLACK} 0%, ${BLACK} 100%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 18 }}>🏢</div>
          <div style={labelStyle}>Agencies at scale</div>
          <div style={subStyle}>Every client.<br />Every campaign. Covered.</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }),
            background: BLACK,
            border: `3px solid ${RED}`,
            borderRadius: 999,
            padding: "16px 36px",
            color: "white",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 30,
            boxShadow: `0 0 50px ${RED}66`,
          }}
        >
          ONE TOOL. NO BLIND SPOTS.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- Scene 3: Fast-cut flag detection with glow (6.5-11s / frames 195-330) ----
const FlagPulse: React.FC<{ title: string; index: number }> = ({ title, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - index * 30;
  const enter = spring({ frame: localFrame, fps, from: 0, to: 1, durationInFrames: 10 });
  const exit = interpolate(localFrame, [22, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const visible = localFrame >= 0 && localFrame < 30;
  if (!visible) return null;

  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const opacity = enter * exit;
  const glowPulse = 0.6 + 0.4 * Math.sin(localFrame / 3);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 30,
            color: RED,
            fontFamily: FONT,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 18,
            textShadow: `0 0 ${20 * glowPulse}px ${RED}`,
          }}
        >
          ⚠ Flag Detected
        </div>
        <div
          style={{
            color: "white",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 56,
            textShadow: `0 0 ${30 * glowPulse}px ${RED}88`,
            maxWidth: 820,
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FlagBurst: React.FC<{ flags: Props["flags"] }> = ({ flags }) => (
  <AbsoluteFill style={{ background: BLACK }}>
    <GlowField />
    <ScanlineOverlay opacity={0.09} />
    {flags.map((flag, i) => (
      <FlagPulse key={flag.title} title={flag.title} index={i} />
    ))}
  </AbsoluteFill>
);

// ---- Scene 4: Stat punch with glow + animated counter (11-14s / frames 330-420) ----
const StatPunch: React.FC<{ stat: string; subtext: string }> = ({ stat, subtext }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numeric = parseInt(stat.replace(/\D/g, ""), 10) || 0;
  const countProgress = spring({ frame, fps, from: 0, to: 1, durationInFrames: 35 });
  const counted = Math.round(numeric * countProgress);
  const suffix = stat.replace(/[0-9]/g, "");
  const glow = 0.6 + 0.4 * Math.sin(frame / 5);
  const subOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", background: BLACK }}>
      <GlowField />
      <ScanlineOverlay />
      <div
        style={{
          color: RED,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 160,
          textShadow: `0 0 ${50 * glow}px ${RED}`,
          lineHeight: 1,
        }}
      >
        {counted}
        {suffix}
      </div>
      <div
        style={{
          opacity: subOpacity,
          color: "white",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 36,
          textAlign: "center",
          marginTop: 26,
          maxWidth: 760,
        }}
      >
        {subtext}
      </div>
    </AbsoluteFill>
  );
};

// ---- Scene 5: Confident outro / CTA (14-17.5s / frames 420-525) ----
const Outro: React.FC<{ cta: string; url: string }> = ({ cta, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, from: 0, to: 1, durationInFrames: 22 });
  const scale = interpolate(reveal, [0, 1], [0.85, 1]);
  const opacity = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const buttonGlow = 0.6 + 0.4 * Math.sin(frame / 6);
  const buttonScale = 1 + 0.05 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", background: BLACK }}>
      <GlowField />
      <ScanlineOverlay opacity={0.05} />
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: "white",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 64,
          letterSpacing: 1,
        }}
      >
        Red Flag <span style={{ color: RED, textShadow: `0 0 30px ${RED}` }}>AI</span>
      </div>
      <div
        style={{
          opacity,
          transform: `scale(${scale * buttonScale})`,
          marginTop: 38,
          background: `linear-gradient(135deg, ${RED}, ${DARK_RED})`,
          color: "white",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 42,
          padding: "22px 50px",
          borderRadius: 999,
          boxShadow: `0 0 ${60 * buttonGlow}px ${RED}aa`,
        }}
      >
        {cta}
      </div>
      <div style={{ opacity, marginTop: 28, color: "#d4d4d8", fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const AdTeaserDynamic: React.FC<Props> = ({ flags, stat, statSubtext, cta, url }) => {
  return (
    <>
      <Sequence durationInFrames={75}>
        <GlitchHook />
      </Sequence>
      <Sequence from={75} durationInFrames={120}>
        <SplitAudience />
      </Sequence>
      <Sequence from={195} durationInFrames={135}>
        <FlagBurst flags={flags} />
      </Sequence>
      <Sequence from={330} durationInFrames={90}>
        <StatPunch stat={stat} subtext={statSubtext} />
      </Sequence>
      <Sequence from={420} durationInFrames={105}>
        <Outro cta={cta} url={url} />
      </Sequence>
    </>
  );
};
