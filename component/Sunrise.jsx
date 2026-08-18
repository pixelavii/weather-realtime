import React, { useMemo } from "react";

// Fixed particle field so it doesn't reshuffle on re-render
const DUST_PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  top: (i * 37) % 100,
  left: (i * 53) % 100,
  size: 2 + ((i * 7) % 5),
  duration: 14 + ((i * 11) % 18),
  delay: -(i * 3) % 20,
  drift: 40 + ((i * 17) % 90),
}));

function formatClock(localtime) {
  if (!localtime) return "";
  const d = new Date(localtime.replace(" ", "T"));
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const Sunrise = ({ weather }) => {
  const location = weather?.location;
  const current = weather?.current;
  const astro = weather?.forecast?.forecastday?.[0]?.astro;

  const clock = useMemo(() => formatClock(location?.localtime), [location]);

  if (!current || !location) return null;

  const stats = [
    { label: "FEELS LIKE", value: `${Math.round(current.feelslike_c)}°` },
    { label: "HUMIDITY", value: `${current.humidity}%` },
    { label: "WIND", value: `${Math.round(current.wind_kph)} km/h ${current.wind_dir}` },
    { label: "UV INDEX", value: `${current.uv}` },
    { label: "VISIBILITY", value: `${current.vis_km} km` },
  ];

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black select-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,500&family=Space+Grotesk:wght@400;500&display=swap');

        @keyframes drift {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          10%  { opacity: 0.55; }
          90%  { opacity: 0.4; }
          100% { transform: translate3d(var(--drift), -18px, 0); opacity: 0; }
        }
        @keyframes glarePulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.08); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
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
        @media (prefers-reduced-motion: reduce) {
          .dust-particle, .glare { animation: none !important; }
        }
      `}</style>

      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/morning.mp4" type="video/mp4" />
      </video>

      {/* Warm dust-haze color wash matched to the actual condition */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,11,6,0.15) 0%, rgba(20,11,6,0.05) 35%, rgba(20,11,6,0.55) 78%, rgba(20,11,6,0.85) 100%)",
        }}
      />

      {/* Ambient sun glare, top right — the signature ambient motion */}
      <div
        className="glare absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,163,61,0.55) 0%, rgba(232,163,61,0) 70%)",
          animation: "glarePulse 6s ease-in-out infinite",
        }}
      />

      {/* Drifting dust particles — direct nod to the reported "Dust storm" */}
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

      {/* Top bar — place, local time */}
      <div
        className="absolute top-0 left-0 right-0 flex items-start justify-between px-8 pt-8 sm:px-12 sm:pt-10"
        style={{ animation: "riseIn 0.7s ease-out both" }}
      >
        <div>
          <p
            className="text-[13px] uppercase tracking-[0.25em]"
            style={{ color: "#C9AD8C", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {location.region ? `${location.region}, ${location.country}` : location.country}
          </p>
          <h1
            className="mt-1 text-2xl sm:text-3xl"
            style={{ color: "#FBEFE0", fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            {location.name}
          </h1>
        </div>
        <div className="text-right">
          <p
            className="text-[13px] uppercase tracking-[0.25em]"
            style={{ color: "#C9AD8C", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Local time
          </p>
          <p
            className="mt-1 text-2xl sm:text-3xl tabular-nums"
            style={{ color: "#FBEFE0", fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            {clock}
          </p>
        </div>
      </div>

      {/* Bottom block — temperature, condition, stats */}
      <div
        className="absolute bottom-0 left-0 right-0 px-8 pb-10 sm:px-12 sm:pb-14"
        style={{ animation: "riseIn 0.9s ease-out both" }}
      >
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div className="flex items-end gap-4">
            <span
              className="leading-none"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(4.5rem, 14vw, 9rem)",
                color: "#FBEFE0",
                textShadow: "0 6px 40px rgba(0,0,0,0.45)",
              }}
            >
              {Math.round(current.temp_c)}°
            </span>
            <div className="pb-3 sm:pb-5">
              <p
                className="text-lg sm:text-xl"
                style={{ color: "#FBEFE0", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}
              >
                {current.condition.text}
              </p>
              <p
                className="mt-1 text-[13px] uppercase tracking-[0.2em]"
                style={{ color: "#E8A33D", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Sunrise {astro?.sunrise} · Sunset {astro?.sunset}
              </p>
            </div>
          </div>
        </div>

        {/* Stat chips */}
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-6">
          {stats.map((s) => (
            <div key={s.label}>
              <p
                className="text-[11px] uppercase tracking-[0.25em]"
                style={{ color: "#8C7A63", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {s.label}
              </p>
              <p
                className="mt-1 text-base sm:text-lg tabular-nums"
                style={{ color: "#FBEFE0", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sunrise;