import type React from "react";
import {
  Interactive,
  useCurrentFrame,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../components/Background";
import { colors, easeOut, fonts, tween } from "../theme";

type FinaleProps = {
  readonly question: string;
  readonly brand: string;
  readonly tagline: string;
  readonly cta: string;
  readonly showBackground: boolean;
};

const FinaleInner: React.FC<FinaleProps> = ({
  question,
  brand,
  tagline,
  cta,
  showBackground,
}) => {
  const frame = useCurrentFrame();
  const center: React.CSSProperties = {
    position: "absolute",
    left: 80,
    right: 80,
    textAlign: "center",
    color: colors.cream,
  };
  const rise = (a: number, b: number): React.CSSProperties => ({
    opacity: tween(frame, [a, b], [0, 1], easeOut),
    translate: `0px ${tween(frame, [a, b], [44, 0], easeOut)}px`,
  });
  return (
    <>
      {showBackground ? <Background /> : null}
      <Interactive.Div
        name="E tu"
        style={{
          ...center,
          top: 520,
          fontFamily: fonts.serifItalic,
          fontStyle: "italic",
          fontSize: 88,
          ...rise(8, 22),
        }}
      >
        E tu,
      </Interactive.Div>
      <Interactive.Div
        name="Domanda"
        style={{
          ...center,
          top: 640,
          fontFamily: fonts.serif,
          fontWeight: 800,
          fontSize: 112,
          letterSpacing: -1,
          ...rise(20, 34),
        }}
      >
        {question}
      </Interactive.Div>
      <Interactive.Div
        name="Al te del futuro"
        style={{
          ...center,
          top: 780,
          fontFamily: fonts.hand,
          fontWeight: 700,
          fontSize: 156,
          color: colors.gold,
          clipPath: `inset(-40px ${tween(frame, [32, 58], [100, 0], easeOut)}% -40px -40px)`,
        }}
      >
        al te del futuro?
      </Interactive.Div>
      <Interactive.Div
        name="Marchio"
        style={{
          ...center,
          top: 1120,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: 80,
          ...rise(66, 84),
        }}
      >
        <svg width={76} height={56} viewBox="0 0 38 28">
          <rect x="1" y="1" width="36" height="26" rx="3" fill="none" stroke={colors.gold} strokeWidth="2" />
          <path d="M2 3 L19 16 L36 3" fill="none" stroke={colors.gold} strokeWidth="2" />
        </svg>
        {brand}
      </Interactive.Div>
      <Interactive.Div
        name="Slogan"
        style={{
          ...center,
          top: 1240,
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: 44,
          color: colors.muted,
          ...rise(72, 90),
        }}
      >
        {tagline}
      </Interactive.Div>
      <Interactive.Div
        name="Invito all'azione"
        style={{
          position: "absolute",
          top: 1350,
          left: "50%",
          translate: `-50% ${tween(frame, [80, 96], [44, 0], easeOut)}px`,
          opacity: tween(frame, [80, 96], [0, 1], easeOut),
          scale: 1 + 0.035 * Math.max(0, Math.sin(Math.max(0, frame - 96) / 6.6)),
          padding: "30px 60px",
          borderRadius: 999,
          backgroundColor: colors.gold,
          color: "#1a1622",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 44,
          whiteSpace: "nowrap",
        }}
      >
        {cta}
      </Interactive.Div>
    </>
  );
};

const finaleSchema = {
  question: {
    type: "string",
    default: "cosa scriveresti",
    description: "Domanda",
  },
  brand: { type: "string", default: "Lettere nel Futuro", description: "Marchio" },
  tagline: {
    type: "string",
    default: "Scrivi oggi. La ricevi tra 5 o 10 anni.",
    description: "Slogan",
  },
  cta: {
    type: "string",
    default: "Scrivi la tua lettera · link in bio",
    description: "Invito all'azione",
  },
  showBackground: {
    type: "boolean",
    default: true,
    description: "Mostra lo sfondo",
  },
} as const satisfies InteractivitySchema;

export const FinaleScene = Interactive.withSchema({
  Component: FinaleInner,
  componentName: "FinaleScene",
  schema: finaleSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
