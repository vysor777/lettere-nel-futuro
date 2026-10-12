import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./components/Background";
import { FinaleScene } from "./scenes/FinaleScene";
import { HookScene } from "./scenes/HookScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { SealScene } from "./scenes/SealScene";
import { WritingScene } from "./scenes/WritingScene";
import { YearsScene } from "./scenes/YearsScene";

/**
 * Video TikTok "Tra 10 anni ti arriva una lettera", 1080x1920.
 * Lo sfondo è unico per tutto il video, così la polvere non salta tra le scene
 * che proseguono l'una nell'altra (scrittura → sigillo → anni → apertura).
 */
export const LettereNelFuturo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background
        color={interpolateColors(
          frame,
          [418, 458, 498, 538, 568],
          ["#0f1220", "#0e1e26", "#221812", "#1e1226", "#0f1220"],
        )}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Hook"
          durationInFrames={100}
          premountFor={fps}
        >
          <HookScene
            title="Tra 10 anni"
            subtitle="ti arriva una lettera."
            punchline="L'hai scritta tu."
            showBackground={false}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        <TransitionSeries.Sequence
          name="Scrittura"
          durationInFrames={200}
          premountFor={fps}
        >
          <WritingScene showBackground={false} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Sigillo"
          durationInFrames={130}
          premountFor={fps}
        >
          <SealScene showBackground={false} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Dieci anni"
          durationInFrames={150}
          premountFor={fps}
        >
          <YearsScene label="3.650 giorni dopo" showBackground={false} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="Apertura 2036"
          durationInFrames={180}
          premountFor={fps}
        >
          <OpeningScene dateLabel="12 ottobre 2036" showBackground={false} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence
          name="Finale"
          durationInFrames={150}
          premountFor={fps}
        >
          <FinaleScene
            question="cosa scriveresti"
            brand="Lettere nel Futuro"
            tagline="Scrivi oggi. La ricevi tra 5 o 10 anni."
            cta="Scrivi la tua lettera · link in bio"
            showBackground={false}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio name="Musica" src={staticFile("musica.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
};
