import type React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { colors } from "../theme";

const MOTES = new Array(80).fill(true).map((_, i) => ({
  x: random(`x${i}`) * 1080,
  y: random(`y${i}`) * 1920,
  r: 1.2 + random(`r${i}`) * 3.4,
  v: 0.25 + random(`v${i}`) * 0.6,
  ph: random(`p${i}`) * Math.PI * 2,
  a: 0.15 + random(`a${i}`) * 0.45,
}));

/** Cielo notturno con polvere dorata che sale lentamente. */
export const Background: React.FC<{ readonly color?: string }> = ({
  color = colors.night,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: color }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {MOTES.map((m, i) => (
          <circle
            key={i}
            cx={m.x + Math.sin(frame / 75 + m.ph) * 16}
            cy={(((m.y - frame * m.v) % 1920) + 1920) % 1920}
            r={m.r}
            fill={`rgba(255, 220, 170, ${m.a * (0.6 + 0.4 * Math.sin(frame / 23 + m.ph))})`}
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 48%, rgba(255,186,110,.13), rgba(0,0,0,0) 70%), radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
