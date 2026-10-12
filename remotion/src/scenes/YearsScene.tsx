import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolateColors,
  useCurrentFrame,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../components/Background";
import { Envelope } from "../components/Envelope";
import { ENVELOPE_LABEL, YEAR_EVENTS } from "../content";
import { colors, easeOut, fonts, tween } from "../theme";

/** Contatore degli anni con l'evento di vita di ogni anno. */
export const YearCounter: React.FC<{
  readonly progress: number;
  readonly opacity: number;
  readonly label: string;
}> = ({ progress, opacity, label }) => {
  const step = progress * 10;
  const year = 2026 + Math.min(10, Math.floor(step + 1e-6));
  const f = year === 2036 ? 1 : step - Math.floor(step);
  const eventOpacity =
    year === 2036 ? 1 : progress > 0 ? Math.min(1, f * 5, (1 - f) * 5) : 0;
  return (
    <AbsoluteFill style={{ opacity, color: colors.cream, textAlign: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 770,
          width: "100%",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: colors.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          top: 790,
          width: "100%",
          fontFamily: fonts.serif,
          fontWeight: 800,
          fontSize: 300,
          letterSpacing: -4,
          fontVariantNumeric: "tabular-nums",
          scale: 1 + 0.07 * (1 - Math.min(1, f * 3)),
        }}
      >
        {year}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1190,
          width: "100%",
          fontFamily: fonts.hand,
          fontWeight: 700,
          fontSize: 96,
          color: colors.gold,
          opacity: eventOpacity,
        }}
      >
        {YEAR_EVENTS[year] ?? ""}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1360,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {new Array(10).fill(true).map((_, i) => (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor:
                i < year - 2026 ? colors.gold : "rgba(245,236,217,.18)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** La busta chiusa, rimpicciolita, che aspetta mentre scorrono dieci anni. */
export const ClosedEnvelope: React.FC = () => (
  <Envelope open={0} seal={1} label={ENVELOPE_LABEL} labelReveal={1} />
);

type YearsProps = {
  readonly label: string;
  readonly showBackground: boolean;
};

const YearsInner: React.FC<YearsProps> = ({ label, showBackground }) => {
  const frame = useCurrentFrame();
  const zoom = tween(frame, [0, 20], [0, 1]);
  return (
    <>
      {showBackground ? (
        <Background
          color={interpolateColors(
            frame,
            [0, 40, 80, 120, 150],
            ["#0f1220", "#0e1e26", "#221812", "#1e1226", "#0f1220"],
          )}
        />
      ) : null}
      <YearCounter
        label={label}
        progress={tween(frame, [24, 138], [0, 1], Easing.linear)}
        opacity={tween(frame, [8, 22], [0, 1], easeOut)}
      />
      <AbsoluteFill
        style={{
          transformOrigin: "540px 1040px",
          scale: 1 - 0.58 * zoom,
          translate: `0px ${-460 * zoom + Math.sin(frame / 14) * 12 * zoom}px`,
        }}
      >
        <ClosedEnvelope />
      </AbsoluteFill>
    </>
  );
};

const yearsSchema = {
  label: {
    type: "string",
    default: "3.650 giorni dopo",
    description: "Etichetta sopra l'anno",
  },
  showBackground: {
    type: "boolean",
    default: true,
    description: "Mostra lo sfondo",
  },
} as const satisfies InteractivitySchema;

export const YearsScene = Interactive.withSchema({
  Component: YearsInner,
  componentName: "YearsScene",
  schema: yearsSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
