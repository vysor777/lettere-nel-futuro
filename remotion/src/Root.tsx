import { Composition, Folder } from "remotion";
import { LettereNelFuturo } from "./LettereNelFuturo";
import { FinaleScene } from "./scenes/FinaleScene";
import { HookScene } from "./scenes/HookScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { SealScene } from "./scenes/SealScene";
import { WritingScene } from "./scenes/WritingScene";
import { YearsScene } from "./scenes/YearsScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Scene">
        <Composition
          id="Hook"
          component={HookScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={100}
          defaultProps={{
            title: "Tra 10 anni",
            subtitle: "ti arriva una lettera.",
            punchline: "L'hai scritta tu.",
            showBackground: true,
          }}
        />
        <Composition
          id="Scrittura"
          component={WritingScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={200}
          defaultProps={{ showBackground: true }}
        />
        <Composition
          id="Sigillo"
          component={SealScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={130}
          defaultProps={{ showBackground: true }}
        />
        <Composition
          id="DieciAnni"
          component={YearsScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={150}
          defaultProps={{ label: "3.650 giorni dopo", showBackground: true }}
        />
        <Composition
          id="Apertura2036"
          component={OpeningScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={180}
          defaultProps={{ dateLabel: "12 ottobre 2036", showBackground: true }}
        />
        <Composition
          id="Finale"
          component={FinaleScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={150}
          defaultProps={{
            question: "cosa scriveresti",
            brand: "Lettere nel Futuro",
            tagline: "Scrivi oggi. La ricevi tra 5 o 10 anni.",
            cta: "Scrivi la tua lettera · link in bio",
            showBackground: true,
          }}
        />
      </Folder>
      <Composition
        id="LettereNelFuturo"
        component={LettereNelFuturo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={883}
      />
    </>
  );
};
