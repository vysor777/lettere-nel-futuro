import type React from "react";
import {
  Interactive,
  useCurrentFrame,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../components/Background";
import { colors, easeOut, fonts, tween } from "../theme";

type HookProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly punchline: string;
  readonly showBackground: boolean;
};

const HookInner: React.FC<HookProps> = ({
  title,
  subtitle,
  punchline,
  showBackground,
}) => {
  const frame = useCurrentFrame();
  const line: React.CSSProperties = {
    position: "absolute",
    left: 80,
    right: 80,
    textAlign: "center",
    color: colors.cream,
  };
  return (
    <>
      {showBackground ? <Background /> : null}
      <Interactive.Div
        name="Titolo"
        style={{
          ...line,
          top: 610,
          fontFamily: fonts.serif,
          fontWeight: 800,
          fontSize: 136,
          letterSpacing: -1,
          opacity: tween(frame, [0, 10], [0, 1], easeOut),
          translate: `0px ${tween(frame, [0, 16], [50, 0], easeOut)}px`,
        }}
      >
        {title}
      </Interactive.Div>
      <Interactive.Div
        name="Sottotitolo"
        style={{
          ...line,
          top: 790,
          fontFamily: fonts.serifItalic,
          fontStyle: "italic",
          fontSize: 78,
          opacity: tween(frame, [16, 30], [0, 1], easeOut),
          translate: `0px ${tween(frame, [16, 32], [40, 0], easeOut)}px`,
        }}
      >
        {subtitle}
      </Interactive.Div>
      <Interactive.Div
        name="Colpo di scena"
        style={{
          ...line,
          top: 930,
          fontFamily: fonts.hand,
          fontWeight: 700,
          fontSize: 150,
          color: colors.gold,
          clipPath: `inset(-40px ${tween(frame, [40, 66], [100, 0], easeOut)}% -40px -40px)`,
          scale: tween(frame, [40, 70], [1.08, 1], easeOut),
        }}
      >
        {punchline}
      </Interactive.Div>
    </>
  );
};

const hookSchema = {
  title: { type: "string", default: "Tra 10 anni", description: "Titolo" },
  subtitle: {
    type: "string",
    default: "ti arriva una lettera.",
    description: "Sottotitolo",
  },
  punchline: {
    type: "string",
    default: "L'hai scritta tu.",
    description: "Frase scritta a mano",
  },
  showBackground: {
    type: "boolean",
    default: true,
    description: "Mostra lo sfondo",
  },
} as const satisfies InteractivitySchema;

export const HookScene = Interactive.withSchema({
  Component: HookInner,
  componentName: "HookScene",
  schema: hookSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
