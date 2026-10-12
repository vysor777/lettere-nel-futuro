import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useDelayRender } from "remotion";
import { colors, fonts } from "../theme";

export const PAPER = { left: 120, top: 400, width: 840, height: 1120 };
const LINES_TOP = 184;
const LINE_H = 100;
const PAD_LEFT = 76;
const SIGN_PAD_RIGHT = 80;

export type LetterProps = {
  readonly date: string;
  readonly lines: string[];
  readonly signature: string;
  /** Indice della riga da evidenziare alla fine. */
  readonly keyLine: number;
  /** Avanzamento della scrittura, 0–1. */
  readonly write: number;
  readonly contentOpacity?: number;
  readonly aged?: number;
  readonly highlight?: number;
  readonly creases?: number;
  readonly penOpacity?: number;
  /** Frame usato per il tremolio della penna. */
  readonly penFrame?: number;
  readonly style?: React.CSSProperties;
};

/** Tempo di scrittura di ogni riga, proporzionale al numero di caratteri. */
const schedule = (texts: string[]) => {
  const gap = 0.02;
  const total = texts.reduce((s, t) => s + t.length, 0);
  const span = 1 - gap * (texts.length - 1);
  let t = 0;
  return texts.map((txt) => {
    const d = (span * txt.length) / total;
    const r = { a: t, b: t + d };
    t += d + gap;
    return r;
  });
};

const reveal = (k: number): React.CSSProperties =>
  k >= 1
    ? {}
    : { clipPath: `inset(-30px ${(1 - k) * 100}% -30px -20px)` };

export const Letter: React.FC<LetterProps> = ({
  date,
  lines,
  signature,
  keyLine,
  write,
  contentOpacity = 1,
  aged = 0,
  highlight = 0,
  creases = 0,
  penOpacity = 0,
  penFrame = 0,
  style,
}) => {
  const texts = [...lines, signature];
  const times = schedule(texts);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[] | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const textKey = texts.join("|");

  // Larghezza di ogni riga, per far seguire la scrittura alla penna.
  useLayoutEffect(() => {
    const handle = delayRender("Misuro le righe della lettera");
    document.fonts.ready.then(() => {
      setWidths(refs.current.map((el) => el?.offsetWidth ?? 0));
      continueRender(handle);
    });
  }, [continueRender, delayRender, textKey]);

  const progress = times.map(({ a, b }) =>
    Math.min(1, Math.max(0, (write - a) / (b - a))),
  );
  const current = Math.max(
    0,
    progress.findIndex((p) => p < 1) === -1
      ? texts.length - 1
      : progress.findIndex((p) => p < 1),
  );
  const isSign = (i: number) => i === texts.length - 1;
  const w = widths?.[current] ?? 0;
  const lineLeft = isSign(current) ? PAPER.width - SIGN_PAD_RIGHT - w : PAD_LEFT;
  const penX = lineLeft + w * progress[current];
  const penY =
    LINES_TOP +
    current * LINE_H +
    72 +
    Math.sin(penFrame * 1.3) * 4 -
    Math.abs(Math.sin(penFrame * 0.45)) * 6;

  return (
    <div
      style={{
        position: "absolute",
        ...PAPER,
        backgroundColor: "#f7f0e1",
        borderRadius: 6,
        boxShadow: "0 48px 120px rgba(0,0,0,.45), 0 4px 12px rgba(0,0,0,.25)",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 68,
            fontFamily: fonts.hand,
            fontSize: 52,
            color: "#7a6650",
          }}
        >
          {date}
        </div>
        <div
          style={{
            position: "absolute",
            top: LINES_TOP,
            left: 0,
            right: 0,
            height: LINE_H * 8,
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 84px, rgba(70,105,160,.2) 84px 86px, transparent 86px 100px)",
          }}
        >
          {texts.map((txt, i) => (
            <div
              key={i}
              style={{
                height: LINE_H,
                lineHeight: `${LINE_H}px`,
                paddingLeft: isSign(i) ? 0 : PAD_LEFT,
                paddingRight: isSign(i) ? SIGN_PAD_RIGHT : 0,
                textAlign: isSign(i) ? "right" : "left",
                fontFamily: fonts.hand,
                fontSize: isSign(i) ? 60 : 70,
                fontWeight: i === keyLine ? 700 : 500,
                color: isSign(i) ? "#3a4670" : colors.ink,
                whiteSpace: "nowrap",
                opacity: i === keyLine ? 1 : 1 - 0.68 * highlight,
                scale: i === keyLine ? 1 + 0.08 * highlight : 1,
                transformOrigin: `${PAD_LEFT}px 50%`,
              }}
            >
              <span
                ref={(el) => {
                  refs.current[i] = el;
                }}
                style={{
                  display: "inline-block",
                  position: "relative",
                  ...reveal(progress[i]),
                }}
              >
                {txt}
                {i === keyLine ? (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 14,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#e2a93b",
                      width: `${highlight * 100}%`,
                    }}
                  />
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 6,
          opacity: aged,
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 50%, rgba(140,92,35,.28) 100%), linear-gradient(rgba(214,180,120,.18), rgba(214,180,120,.18))",
        }}
      />
      {[33.3, 66.6].map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${top}%`,
            height: 4,
            opacity: creases,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.10), rgba(255,255,255,.6))",
          }}
        />
      ))}
      <svg
        width={60}
        height={345}
        viewBox="0 0 40 230"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          overflow: "visible",
          opacity: widths ? penOpacity : 0,
          translate: `${penX}px ${penY}px`,
          transformOrigin: "0 0",
          scale: 1.5,
        }}
      >
        <g transform="rotate(32)">
          <path d="M0 0 L-7 -30 L7 -30 Z" fill="#e7c477" />
          <path d="M0 0 L-1 -24 L1 -24 Z" fill="#7a5a1c" />
          <rect x="-9" y="-58" width="18" height="30" rx="3" fill="#2a2e44" />
          <rect x="-11" y="-200" width="22" height="146" rx="10" fill="#323856" />
          <rect x="-11" y="-200" width="7" height="146" rx="3" fill="#4a5278" />
          <rect x="-11" y="-120" width="22" height="5" fill="#d9b25a" />
        </g>
      </svg>
    </div>
  );
};
