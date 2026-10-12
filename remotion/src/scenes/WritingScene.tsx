import type React from "react";
import {
  Easing,
  Interactive,
  useCurrentFrame,
  type InteractivitySchema,
} from "remotion";
import { Background } from "../components/Background";
import { Letter } from "../components/Letter";
import { LETTER } from "../content";
import { easeOut, tween } from "../theme";

type WritingProps = { readonly showBackground: boolean };

/** La lettera entra dal basso e la penna la scrive riga per riga. */
const WritingInner: React.FC<WritingProps> = ({ showBackground }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {showBackground ? <Background /> : null}
      <Letter
        {...LETTER}
        write={tween(frame, [40, 188], [0, 1], Easing.linear)}
        penOpacity={
          tween(frame, [28, 40], [0, 1], easeOut) *
          tween(frame, [188, 199], [1, 0])
        }
        penFrame={frame}
        style={{
          // Entra dopo la dissolvenza dal titolo, per non sovrapporsi al testo.
          translate: `0px ${tween(frame, [10, 34], [1800, 0], Easing.bezier(0.33, 1, 0.68, 1))}px`,
          rotate: `${tween(frame, [10, 34], [7, -1.5], Easing.bezier(0.33, 1, 0.68, 1))}deg`,
        }}
      />
    </>
  );
};

const writingSchema = {
  showBackground: {
    type: "boolean",
    default: true,
    description: "Mostra lo sfondo",
  },
} as const satisfies InteractivitySchema;

export const WritingScene = Interactive.withSchema({
  Component: WritingInner,
  componentName: "WritingScene",
  schema: writingSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
