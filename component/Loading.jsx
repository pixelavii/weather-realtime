import React from "react";

const DUST_PARTICLES = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  top: (i * 41) % 100,
  left: (i * 59) % 100,
  size: 2 + ((i * 5) % 4),
  duration: 16 + ((i * 9) % 16),
  delay: -(i * 4) % 20,
  drift: 30 + ((i * 13) % 70),
}));

const MESSAGES = ["Reading the sky"];

export default function Loading({ label }) {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#140B06] select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,500&family=Space+Grotesk:wght@400;500&display=swap');

        @keyframes drift {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          10%  { opacity: 0.45; }
          90%  { opacity: 0.3; }
          100% { transform: translate3d(var(--drift), -16px, 0); opacity: 0; }
        }
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%      { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes fadeCycle {
          0%, 100% { opacity: 0; }
          10%, 30% { opacity: 1; }
          40%      { opacity: 0; }
        }
        .dust-particle {
          position: absolute;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(232,163,61,0.9) 0%, rgba(181,101,29,0.15) 70%, transparent 100%);
          animation-name: drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          pointer-events: none;
        }
        .ring-sweep { animation: sweep 3.2s linear infinite; }
        .ring-core { animation: corePulse 2.4s ease-in-out infinite; }
        .msg-item {
          grid-area: 1 / 1;
          animation: fadeCycle 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dust-particle, .ring-sweep, .ring-core, .msg-item {
            animation: none !important;
          }
          .msg-item:first-child { opacity: 1; }
        }
      `}</style>

      {/* Warm ambient wash, same family as the Afternoon backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(232,163,61,0.10) 0%, rgba(20,11,6,0) 45%), linear-gradient(180deg, rgba(20,11,6,1) 0%, rgba(24,14,7,1) 100%)",
        }}
      />

      {DUST_PARTICLES.map((p) => (
        <span
          key={p.id}
          className="dust-particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}

      {/* Center: radar-style locating mark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32">
          {/* static ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(251,239,224,0.15)" }}
          />
          {/* sweeping arc */}
          <div className="ring-sweep absolute inset-0 rounded-full">
            <div
              className="absolute -top-[1px] left-1/2 h-1/2 w-[2px] origin-bottom -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(180deg, rgba(232,163,61,0.95) 0%, rgba(232,163,61,0) 100%)",
              }}
            />
          </div>
          {/* pulsing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="ring-core h-3 w-3 rounded-full"
              style={{
                background: "#E8A33D",
                boxShadow: "0 0 24px 6px rgba(232,163,61,0.45)",
              }}
            />
          </div>
        </div>

        {/* Rotating status message */}
        <div
          className="grid text-center"
          style={{
            fontFamily: "'Fraunces', serif",
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {(label ? [label] : MESSAGES).map((msg, i) => (
            <span
              key={msg}
              className="msg-item"
              style={{
                animationDelay: label ? "0s" : `${i * 2}s`,
                animationIterationCount: label ? "infinite" : undefined,
                opacity: label ? 1 : undefined,
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                color: "#FBEFE0",
              }}
            >
              {msg}
              <span style={{ color: "#E8A33D" }}>…</span>
            </span>
          ))}
        </div>

        <p
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{
            color: "#8C7A63",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Fetching current conditions
        </p>
      </div>
    </div>
  );
}
