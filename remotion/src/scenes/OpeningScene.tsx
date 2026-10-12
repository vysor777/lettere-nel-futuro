import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  useCurrentFrame,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../components/Background";
import { Envelope } from "../components/Envelope";
import { Letter } from "../components/Letter";
import { ENVELOPE_LABEL, LETTER } from "../content";
import { colors, easeOut, fonts, tween } from "../theme";
import { YearCounter } from "./YearsScene";

type OpeningProps = {
  readonly dateLabel: string;
  readonly showBackground: boolean;
};

/** 2036: il sigillo salta, la lettera esce ingiallita e "Sei felice?" si accende. */
const OpeningInner: React.FC<OpeningProps> = ({ dateLabel, showBackground }) => {
  const frame = useCurrentFrame();
  const back = tween(frame, [0, 20], [0, 1]);
  const unfold = tween(frame, [72, 96], [0, 1]);
  const away = tween(frame, [66, 86], [0, 1]);
  return (
    <>
      {showBackground ? <Background /> : null}
      <YearCounter
        label="3.650 giorni dopo"
        progress={1}
        opacity={tween(frame, [0, 12], [1, 0])}
      />
      <AbsoluteFill
        style={{
          transformOrigin: "540px 1040px",
          scale: 0.42 + 0.58 * back,
          translate: `0px ${-460 * (1 - back)}px`,
        }}
      >
        <Envelope
          open={tween(frame, [30, 48], [0, 1])}
          seal={1}
          sealPop={tween(frame, [20, 34], [0, 1])}
          label={ENVELOPE_LABEL}
          labelReveal={1}
          bodyY={1400 * away}
          bodyOpacity={1 - away}
        >
          <Letter
            {...LETTER}
            write={1}
            contentOpacity={tween(frame, [76, 92], [0, 1])}
            creases={1 - 0.55 * unfold}
            aged={unfold}
            highlight={tween(frame, [104, 128], [0, 1])}
            style={{
              translate: `0px ${80 + tween(frame, [48, 72], [0, -580]) + 500 * unfold}px`,
              rotate: `${1.2 * unfold}deg`,
              scale: `${0.86 + 0.14 * unfold} ${0.3 + 0.7 * unfold}`,
            }}
          />
        </Envelope>
      </AbsoluteFill>
      <Interactive.Div
        name="Data di consegna"
        style={{
          position: "absolute",
          top: 220,
          left: "50%",
          translate: "-50% 0px",
          padding: "18px 40px",
          borderRadius: 999,
          backgroundColor: "rgba(242,196,109,.14)",
          border: "2px solid rgba(242,196,109,.5)",
          color: colors.gold,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 6,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          opacity: tween(frame, [8, 22], [0, 1], easeOut),
        }}
      >
        {dateLabel}
      </Interactive.Div>
    </>
  );
};

const openingSchema = {
  dateLabel: {
    type: "string",
    default: "12 ottobre 2036",
    description: "Data di consegna",
  },
  showBackground: {
    type: "boolean",
    default: true,
    description: "Mostra lo sfondo",
  },
} as const satisfies InteractivitySchema;

export const OpeningScene = Interactive.withSchema({
  Component: OpeningInner,
  componentName: "OpeningScene",
  schema: openingSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
