import type React from "react";
import {
  AbsoluteFill,
  Interactive,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../components/Background";
import { Envelope } from "../components/Envelope";
import { Letter } from "../components/Letter";
import { ENVELOPE_LABEL, LETTER } from "../content";
import { easeOut, tween } from "../theme";

type SealProps = { readonly showBackground: boolean };

/** La lettera si piega, entra nella busta e arriva il sigillo "2036". */
const SealInner: React.FC<SealProps> = ({ showBackground }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fold = tween(frame, [6, 24], [0, 1]);
  const seal = spring({
    frame: frame - 64,
    fps,
    config: { damping: 11, stiffness: 160, mass: 0.7 },
  });
  // Piccola scossa quando il sigillo tocca la busta.
  const hit = tween(frame, [70, 84], [0, 1]);
  const shake = frame > 70 ? Math.sin(hit * 40) * 10 * (1 - hit) : 0;

  return (
    <>
      {showBackground ? <Background /> : null}
      <AbsoluteFill style={{ translate: `${shake * 0.6}px ${shake}px` }}>
        <Envelope
          open={1 - tween(frame, [50, 66], [0, 1])}
          seal={seal}
          label={ENVELOPE_LABEL}
          labelReveal={tween(frame, [84, 114], [0, 1], easeOut)}
          bodyY={tween(frame, [2, 22], [1240, 0], easeOut)}
          bodyOpacity={tween(frame, [2, 12], [0, 1])}
        >
          <Letter
            {...LETTER}
            write={1}
            contentOpacity={tween(frame, [0, 8], [1, 0])}
            creases={tween(frame, [0, 8], [0, 1])}
            style={{
              translate: `0px ${tween(frame, [6, 24], [0, -360]) + tween(frame, [26, 48], [0, 440])}px`,
              rotate: `${-1.5 * (1 - fold)}deg`,
              scale: `${1 - 0.14 * fold} ${1 - 0.7 * fold}`,
            }}
          />
        </Envelope>
      </AbsoluteFill>
    </>
  );
};

const sealSchema = {
  showBackground: {
    type: "boolean",
    default: true,
    description: "Mostra lo sfondo",
  },
} as const satisfies InteractivitySchema;

export const SealScene = Interactive.withSchema({
  Component: SealInner,
  componentName: "SealScene",
  schema: sealSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
