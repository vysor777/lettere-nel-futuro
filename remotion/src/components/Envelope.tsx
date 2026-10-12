import type React from "react";
import { fonts } from "../theme";

export const ENV = { left: 120, top: 780, width: 840, height: 520 };
const FLAP_H = 300;

type EnvelopeProps = {
  /** 0 = patta chiusa, 1 = patta aperta. */
  readonly open: number;
  /** Comparsa del sigillo (può superare 1 per l'effetto molla). */
  readonly seal: number;
  /** Il sigillo salta via, 0–1. */
  readonly sealPop?: number;
  readonly label: string;
  readonly labelReveal: number;
  /** Spostamento verticale della sola busta (la lettera resta dov'è). */
  readonly bodyY?: number;
  readonly bodyOpacity?: number;
  /** La lettera, disegnata tra il retro e il fronte della busta. */
  readonly children?: React.ReactNode;
};

const sealPath = (() => {
  let d = "";
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const r =
      42 +
      Math.sin(a * 7) * 1.6 +
      Math.sin(a * 13 + 1) * 1.1 +
      Math.sin(a * 3 + 2) * 1.4;
    d += `${i ? "L" : "M"}${(46 + Math.cos(a) * r).toFixed(1)} ${(46 + Math.sin(a) * r).toFixed(1)}`;
  }
  return d + "Z";
})();

export const Envelope: React.FC<EnvelopeProps> = ({
  open,
  seal,
  sealPop = 0,
  label,
  labelReveal,
  bodyY = 0,
  bodyOpacity = 1,
  children,
}) => {
  const part: React.CSSProperties = {
    position: "absolute",
    left: ENV.left,
    width: ENV.width,
    translate: `0px ${bodyY}px`,
    opacity: bodyOpacity,
  };
  const deg = open * 180;
  return (
    <>
      <svg
        viewBox="0 0 420 260"
        style={{ ...part, top: ENV.top, height: ENV.height }}
      >
        <defs>
          <linearGradient id="envBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bfa98a" />
            <stop offset="1" stopColor="#d8c5a6" />
          </linearGradient>
        </defs>
        <rect width="420" height="260" rx="6" fill="url(#envBack)" />
      </svg>
      {deg > 90 ? <Flap style={part} deg={deg} /> : null}
      {children}
      <svg
        viewBox="0 0 420 260"
        style={{
          ...part,
          top: ENV.top,
          height: ENV.height,
          filter: "drop-shadow(0 44px 80px rgba(0,0,0,.45))",
        }}
      >
        <defs>
          <linearGradient id="envFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e8d3" />
            <stop offset="1" stopColor="#e7d8bc" />
          </linearGradient>
        </defs>
        <path
          d="M0 6 Q0 0 6 2 L210 74 L414 2 Q420 0 420 6 V254 Q420 260 414 260 H6 Q0 260 0 254 Z"
          fill="url(#envFront)"
        />
        <path
          d="M2 256 L178 120 M418 256 L242 120"
          stroke="rgba(120,95,60,.22)"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M0 6 L210 74 L420 6"
          stroke="rgba(120,95,60,.30)"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>
      {deg <= 90 ? <Flap style={part} deg={deg} /> : null}
      <div
        style={{
          ...part,
          top: ENV.top + 400,
          height: 80,
          textAlign: "center",
          fontFamily: fonts.hand,
          fontSize: 60,
          color: "#3b3350",
        }}
      >
        <span
          style={{
            display: "inline-block",
            clipPath:
              labelReveal >= 1
                ? undefined
                : `inset(-30px ${(1 - labelReveal) * 100}% -30px -20px)`,
          }}
        >
          {label}
        </span>
      </div>
      <svg
        viewBox="0 0 92 92"
        style={{
          ...part,
          left: 540 - 92,
          width: 184,
          height: 184,
          top: ENV.top + 280 - 92,
          overflow: "visible",
          opacity: seal <= 0 ? 0 : Math.min(1, seal * 4) * (1 - sealPop) * bodyOpacity,
          scale: (2.6 - 1.6 * seal) * (1 + 0.25 * sealPop),
          rotate: `${(1 - Math.min(seal, 1)) * -8 + sealPop * 35}deg`,
          translate: `0px ${bodyY + sealPop * 80}px`,
        }}
      >
        <defs>
          <radialGradient id="sealFill" cx=".38" cy=".32" r=".8">
            <stop offset="0" stopColor="#d9433b" />
            <stop offset=".55" stopColor="#a5221f" />
            <stop offset="1" stopColor="#6e1212" />
          </radialGradient>
        </defs>
        <path d={sealPath} fill="url(#sealFill)" />
        <circle cx="46" cy="46" r="30" fill="none" stroke="rgba(255,190,170,.35)" strokeWidth="2" />
        <circle cx="47.2" cy="47.6" r="30" fill="none" stroke="rgba(60,0,0,.35)" strokeWidth="2" />
        <text x="47" y="55.4" textAnchor="middle" fontFamily={fonts.serif} fontWeight={800} fontSize="22" fill="rgba(70,5,5,.55)">
          2036
        </text>
        <text x="46" y="54" textAnchor="middle" fontFamily={fonts.serif} fontWeight={800} fontSize="22" fill="#f0a593">
          2036
        </text>
      </svg>
    </>
  );
};

const Flap: React.FC<{ readonly style: React.CSSProperties; readonly deg: number }> = ({
  style,
  deg,
}) => (
  <svg
    viewBox="0 0 420 150"
    style={{
      ...style,
      top: ENV.top,
      height: FLAP_H,
      overflow: "visible",
      transformOrigin: "50% 0",
      transform: `perspective(1800px) rotateX(${deg}deg)`,
      filter: deg > 90 ? "brightness(.82)" : undefined,
    }}
  >
    <defs>
      <linearGradient id="flapFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6d6ba" />
        <stop offset="1" stopColor="#f1e5ce" />
      </linearGradient>
    </defs>
    <path
      d="M2 0 H418 L224 142 Q210 152 196 142 Z"
      fill="url(#flapFill)"
      stroke="rgba(120,95,60,.35)"
      strokeWidth="1.2"
    />
  </svg>
);
