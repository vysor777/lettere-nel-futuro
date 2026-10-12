import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Font locali in public/fonts (file variabili, sottoinsieme latino da Google Fonts):
// il render funziona anche senza accesso a Google Fonts.
loadFont({ family: "Caveat", url: staticFile("fonts/Caveat.woff2"), weight: "400 700" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({
  family: "Playfair Display",
  url: staticFile("fonts/PlayfairDisplay.woff2"),
  weight: "400 900",
});
loadFont({
  family: "Playfair Display",
  url: staticFile("fonts/PlayfairDisplay-Italic.woff2"),
  weight: "400 900",
  style: "italic",
});

export const fonts = {
  hand: "Caveat, cursive",
  serif: "'Playfair Display', serif",
  serifItalic: "'Playfair Display', serif",
  sans: "Inter, sans-serif",
};

export const colors = {
  night: "#0f1220",
  cream: "#f5ecd9",
  gold: "#f2c46d",
  ink: "#22305c",
  muted: "#cdbfa6",
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** interpolate() con clamp su entrambi i lati: la forma usata in tutte le scene. */
export const tween = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = easeInOut,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
