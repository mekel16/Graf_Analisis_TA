import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── Palette ──────────────────────────────────────────────────────────────────
const A = "#e07a5f"; // accent / rural (coral-orange)
const B = "#5b8db8"; // urban (blue)
const G = "#6aaa82"; // regions (green)
const BG = "#0d1117";
const SURF = "#161c28";
const T = "#e8e0d5";
const M = "#7a7888";
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

function useCount(target: number, active: boolean, ms = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ms, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, ms]);
  return n;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? scrolled / max : 0);
    };
    window.addEventListener("scroll", update, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

// ─── Shared Components ────────────────────────────────────────────────────────
function Tag({ n, label }: { n: string; label: string }) {
  return (
    <p
      style={{
        color: A,
        letterSpacing: "0.2em",
        fontFamily: SANS,
      }}
      className="text-[11px] font-semibold mb-5 uppercase"
    >
      {n} — {label}
    </p>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-base leading-relaxed mb-4"
      style={{ color: "#b8b0a8", fontFamily: SANS }}
    >
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-4xl lg:text-5xl mb-8 leading-tight"
      style={{ color: T, fontFamily: SERIF, fontWeight: 400 }}
    >
      {children}
    </h2>
  );
}

function FadeUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={on ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function Split({
  left,
  right,
  id,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="min-h-screen flex items-center py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="flex flex-col justify-center">
          {left}
        </div>
        <div className="flex flex-col justify-center items-center">
          {right}
        </div>
      </div>
    </section>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar() {
  const progress = useScrollProgress();
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-0.5"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div
        className="h-full transition-all duration-100"
        style={{ width: `${progress * 100}%`, background: A }}
      />
    </div>
  );
}

// ─── Section 0: Hero ──────────────────────────────────────────────────────────
function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: BG }}
    >
      <div className="text-center px-6 max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-sm lg:text-base leading-relaxed max-w-2xl mx-auto mb-5"
          style={{ color: "#888078", fontFamily: SANS }}
        >
          Analisis Faktor Pengaruh pada Prediksi Capaian Nilai
          Siswa daerah Rural-Urban di Indonesia Timur
          Menggunakan Graph Neural Networks dan Shapley Additive
          Explanations
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-sm"
          style={{ color: A, fontFamily: SANS }}
        >
          By Michael Luwi Pallea'
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <p
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: M, fontFamily: SANS }}
        >
          Gulir untuk Membaca
        </p>
        <div
          className="relative overflow-hidden"
          style={{ width: 1, height: 48, background: `${A}30` }}
        >
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: 1,
              height: "50%",
              background: A,
              position: "absolute",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── PISA Chart (replaces dot grid in Section 01) ────────────────────────────
const PISA_DATA = [
  { year: "2003", reading: 382, math: 360, oecd: 497 },
  { year: "2006", reading: 393, math: 391, oecd: 495 },
  { year: "2009", reading: 402, math: 371, oecd: 493 },
  { year: "2012", reading: 396, math: 375, oecd: 494 },
  { year: "2015", reading: 397, math: 386, oecd: 490 },
  { year: "2018", reading: 371, math: 379, oecd: 488 },
  { year: "2022", reading: 359, math: 366, oecd: 474 },
];

type PisaView = "reading" | "math" | "both";

function PisaTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg p-3 text-xs"
      style={{
        background: "#0a0e16",
        border: "1px solid rgba(255,255,255,0.13)",
        fontFamily: SANS,
      }}
    >
      <p
        className="font-semibold mb-2 tracking-wider"
        style={{ color: T }}
      >
        PISA {label}
      </p>
      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          className="flex items-center justify-between gap-4 mb-1"
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span style={{ color: M }}>{p.name}</span>
          </div>
          <span
            className="font-bold tabular-nums"
            style={{ color: p.color }}
          >
            {p.value}
          </span>
        </div>
      ))}
      {payload.length > 1 &&
        (() => {
          const oecdEntry = payload.find(
            (p: any) => p.dataKey === "oecd",
          );
          const indoEntry = payload.find(
            (p: any) => p.dataKey !== "oecd",
          );
          if (!oecdEntry || !indoEntry) return null;
          const gap = oecdEntry.value - indoEntry.value;
          return (
            <p
              className="text-[9px] mt-2 pt-2"
              style={{
                color: `${M}80`,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Selisih rata-rata OECD:{" "}
              <span style={{ color: A }}>−{gap} poin</span>
            </p>
          );
        })()}
    </div>
  );
}

function PISAChart({ on }: { on: boolean }) {
  const [view, setView] = useState<PisaView>("both");

  const tabs: { key: PisaView; label: string }[] = [
    { key: "reading", label: "Membaca" },
    { key: "math", label: "Matematika" },
    { key: "both", label: "Keduanya" },
  ];

  // Build chart data per view — avoids recharts `hide` prop swallowing OECD from domain
  const chartData = PISA_DATA.map((d) => {
    const row: Record<string, string | number> = {
      year: d.year,
      oecd: d.oecd,
    };
    if (view !== "math") row.reading = d.reading;
    if (view !== "reading") row.math = d.math;
    return row;
  });

  const latest = PISA_DATA[PISA_DATA.length - 1];

  return (
    <div className="w-full">
      {/* Ranking header */}
      <p
        className="text-[10px] tracking-[0.2em] uppercase text-center mb-2"
        style={{ color: M, fontFamily: SANS }}
      >
        Peringkat PISA 2022
      </p>
      <div className="text-center mb-4">
        <span
          style={{
            fontFamily: SERIF,
            fontSize: "4.5rem",
            color: A,
            lineHeight: 1,
          }}
        >
          69
        </span>
        <span
          className="text-2xl ml-1"
          style={{ color: "#a0988e" }}
        >
          /80
        </span>
      </div>

      {/* Tab toggle */}
      <div className="flex justify-center gap-1 mb-4">
        {tabs.map(({ key, label }) => {
          const active = view === key;
          const accent =
            key === "reading" ? A : key === "math" ? B : T;
          return (
            <button
              key={key}
              onClick={() => setView(key)}
              className="px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all"
              style={{
                background: active
                  ? accent
                  : "rgba(255,255,255,0.06)",
                color: active ? BG : M,
                fontFamily: SANS,
                letterSpacing: "0.07em",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Line chart — domain [300,520] always covers OECD (~474–497) + Indonesia (~360–402) */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 12, bottom: 4, left: 4 }}
        >
          <CartesianGrid
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 6"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: M, fontSize: 10, fontFamily: SANS }}
            axisLine={false}
            tickLine={false}
            dy={4}
          />
          <YAxis
            domain={[300, 520]}
            tick={{ fill: M, fontSize: 9, fontFamily: SANS }}
            axisLine={false}
            tickLine={false}
            width={34}
            tickCount={5}
          />
          <Tooltip
            content={<PisaTooltip />}
            cursor={{
              stroke: "rgba(255,255,255,0.1)",
              strokeWidth: 1,
            }}
          />

          {/* OECD average — always present in chartData */}
          <Line
            type="monotone"
            dataKey="oecd"
            name="Rata-rata OECD"
            stroke="#c9a55a"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{
              r: 4,
              fill: "#c9a55a",
              strokeWidth: 0,
            }}
            isAnimationActive={on}
            animationDuration={1400}
            animationBegin={0}
          />

          {/* Indonesia Reading — only present in chartData when view !== "math" */}
          {view !== "math" && (
            <Line
              key={`reading-${view}`}
              type="monotone"
              dataKey="reading"
              name="Indonesia Membaca"
              stroke={A}
              strokeWidth={2.5}
              dot={{ fill: A, r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: A, strokeWidth: 0 }}
              isAnimationActive={on}
              animationDuration={1600}
              animationBegin={150}
            />
          )}

          {/* Indonesia Math — only present in chartData when view !== "reading" */}
          {view !== "reading" && (
            <Line
              key={`math-${view}`}
              type="monotone"
              dataKey="math"
              name="Indonesia Matematika"
              stroke={B}
              strokeWidth={2.5}
              dot={{ fill: B, r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: B, strokeWidth: 0 }}
              isAnimationActive={on}
              animationDuration={1600}
              animationBegin={150}
            />
          )}

          <ReferenceLine
            x="2022"
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 mb-3">
        <div className="flex items-center gap-1.5">
          <svg width="18" height="6">
            <line
              x1="0"
              y1="3"
              x2="18"
              y2="3"
              stroke="#c9a55a"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
          </svg>
          <span
            className="text-[9px]"
            style={{ color: M, fontFamily: SANS }}
          >
            Rata-rata OECD (~{latest.oecd})
          </span>
        </div>
        {view !== "math" && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: A }}
            />
            <span
              className="text-[9px]"
              style={{ color: M, fontFamily: SANS }}
            >
              Membaca ({latest.reading})
            </span>
          </div>
        )}
        {view !== "reading" && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: B }}
            />
            <span
              className="text-[9px]"
              style={{ color: M, fontFamily: SANS }}
            >
              Matematika ({latest.math})
            </span>
          </div>
        )}
      </div>

      {/* Gap callout */}
      <div
        className="rounded-lg px-4 py-2.5 mb-3 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          className="text-[10px]"
          style={{ color: M, fontFamily: SANS }}
        >
          Selisih OECD (2022)
        </span>
        <div className="flex gap-3">
          {view !== "math" && (
            <span
              className="text-[11px] font-bold"
              style={{ color: A, fontFamily: SANS }}
            >
              Membaca −{latest.oecd - latest.reading}
            </span>
          )}
          {view !== "reading" && (
            <span
              className="text-[11px] font-bold"
              style={{ color: B, fontFamily: SANS }}
            >
              Matematika −{latest.oecd - latest.math}
            </span>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div
        className="pt-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          className="text-[10px] tracking-widest uppercase text-center"
          style={{ color: M, fontFamily: SANS }}
        >
          Rata-rata OECD jauh lebih tinggi — Sumber: OECD PISA
        </p>
      </div>
    </div>
  );
}

// ─── Section 01: The Invisible Divide ────────────────────────────────────────
function IntroSection() {
  const { ref, on } = useReveal(0.25);

  return (
    <Split
      id="s01"
      left={
        <FadeUp>
          <Tag n="01" label="Pendahuluan" />
          <Heading>Kualitass Pendidikan Indonesia</Heading>
          <Body>
            Kualitas pendidikan Indoneia masih tergolong rendah,
            dibuktikan dengan posisi Indonesia pada PISA 2022
            (peringkat ke-69 dari 80 negara) yang berada di
            bawah rata-rata OECD dan terendah di Asia Tenggara
          </Body>
          <Body>
            Kualitas pendidikan ditentukan oleh berbagai
            faktor.Misal dari pendanaan, distribusi sumber daya,
            hingga kualitas guru dan siswa. Masalahnya terdapat
            kesenjangan faktor-faktor tersebut antar wilayah.
          </Body>
          <Body>
            Berbagai penelitian akademis mengonfirmasi bahwa
            ketidakmerataan ini sangat terlihat antara wilayah
            perkotaan (urban) dan pedesaan (rural), yang tidak
            hanya berdampak pada faktor pendukung pendidikan,
            tetapi juga memicu perbedaan signifikan pada capaian
            akademik siswa secara terukur.
          </Body>
        </FadeUp>
      }
      right={
        <div ref={ref} className="w-full max-w-sm mx-auto">
          <PISAChart on={on} />
        </div>
      }
    />
  );
}

// ─── Section 01b: Research Aim ───────────────────────────────────────────────
function ResearchAimSection() {
  const { ref, on } = useReveal(0.3);
  return (
    <section
      id="s-aim"
      ref={ref}
      className="px-6 py-24 flex flex-col items-center text-center"
      style={{ maxWidth: 860, margin: "0 auto" }}
    >
      {/* overline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={on ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div
          style={{
            width: 28,
            height: 1,
            background: A,
            opacity: 0.6,
          }}
        />
        <span
          className="text-[9px] tracking-[0.22em] uppercase"
          style={{ color: A, fontFamily: SANS }}
        >
          Tujuan Penelitian
        </span>
        <div
          style={{
            width: 28,
            height: 1,
            background: A,
            opacity: 0.6,
          }}
        />
      </motion.div>

      {/* main statement */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={on ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.12 }}
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(1.35rem, 3vw, 2rem)",
          color: T,
          lineHeight: 1.6,
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: "0.01em",
        }}
      >
        Penelitian ini bertujuan untuk menganalisis apakah ada{" "}
        <span
          style={{
            color: A,
            fontStyle: "normal",
            fontWeight: 600,
          }}
        >
          perbedaan faktor
        </span>{" "}
        yang mempengaruhi capaian nilai siswa di daerah{" "}
        <span
          style={{
            color: B,
            fontStyle: "normal",
            fontWeight: 600,
          }}
        >
          urban
        </span>{" "}
        dan{" "}
        <span
          style={{
            color: A,
            fontStyle: "normal",
            fontWeight: 600,
          }}
        >
          rural
        </span>
        , serta memodelkan interaksi antara siswa dengan
        lingkungannya yang kompleks menggunakan{" "}
        <span
          style={{
            color: G,
            fontStyle: "normal",
            fontWeight: 600,
          }}
        >
          pendekatan berbasis graf
        </span>
        .
      </motion.p>

      {/* two concept pills */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={on ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.32 }}
        className="flex flex-wrap justify-center gap-3 mt-10"
      >
        {[
          { label: "Urban vs Rural", color: A },
          { label: "Graph Neural Network", color: G },
          { label: "SHAP Explainability", color: B },
        ].map(({ label, color }) => (
          <div
            key={label}
            className="px-4 py-2 rounded-full text-xs font-medium"
            style={{
              border: `1px solid ${color}44`,
              background: `${color}10`,
              color,
              fontFamily: SANS,
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── Section 02: The Data ─────────────────────────────────────────────────────
function DataSection() {
  const { ref, on } = useReveal(0.25);
  const total = useCount(2162, on);
  const rural = useCount(1329, on);
  const urban = useCount(833, on);

  return (
    <Split
      id="s02"
      left={
        <div ref={ref} className="w-full max-w-sm">
          <p
            className="text-[10px] tracking-widest uppercase mb-3"
            style={{ color: M, fontFamily: SANS }}
          >
            Komposisi Dataset
          </p>

          <div className="mb-8">
            <div
              style={{
                fontFamily: SERIF,
                fontSize: "4.5rem",
                color: T,
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {total.toLocaleString()}
            </div>
            <p
              className="text-sm mt-2"
              style={{ color: M, fontFamily: SANS }}
            >
              Total Siswa yang Dianalisis
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span
                className="text-xs font-bold tracking-widest"
                style={{ color: A, fontFamily: SANS }}
              >
                RURAL
              </span>
              <span
                className="text-xs font-bold tracking-widest"
                style={{ color: B, fontFamily: SANS }}
              >
                URBAN
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span
                className="text-2xl font-bold"
                style={{ color: A, fontFamily: SANS }}
              >
                {rural.toLocaleString()}
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: B, fontFamily: SANS }}
              >
                {urban.toLocaleString()}
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden flex"
              style={{ background: "#1e2535" }}
            >
              <motion.div
                style={{ background: A }}
                initial={{ width: 0 }}
                animate={on ? { width: "61.5%" } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              />
              <motion.div
                style={{ background: B }}
                initial={{ width: 0 }}
                animate={on ? { width: "38.5%" } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "79", l: "Sekolah" },
              { n: "5", l: "Wilayah" },
            ].map(({ n, l }) => (
              <div
                key={l}
                className="rounded-xl p-5"
                style={{
                  background: SURF,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: "2.5rem",
                    color: T,
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {n}
                </div>
                <div
                  className="text-[10px] tracking-widest uppercase mt-2"
                  style={{ color: M, fontFamily: SANS }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      right={
        <FadeUp>
          <Tag n="02" label="Dataset" />
          <Heading>2,162 Data Siswa (Sampel)</Heading>
          <Body>
            Sejalan dengan tujuan penelitian tersebut,
            penelitian ini menggunakan dataset Asesmen Nasional
            (AN) yang terdiri dari Asesmen Kompetensi Minimum
            (AKM), Survei Karakter, dan Survei Lingkungan
            Belajar. Variabel-variabel multidimensi yang terekam
            dalam AN inilah yang kemudian dimodelkan ke dalam
            struktur graf.
          </Body>
          <Body>
            Sampel data yang akhirnya digunakan adalah data
            tabular sebanyak 2,162 data siswa dengan 84 fitur
            (Variabel) misal pendidikan tertinggi ortu, memiliki
            meja belajar dll. perlu di garis bawahi menjadi 84
            fitru karena adanya proses One-hot Encoding
          </Body>
          <Body>
            Data Tabular tersebut, akhirnya di bentuk kedalam
            data graf seperti pada contoh di section berikutnya
          </Body>
        </FadeUp>
      }
    />
  );
}

// ─── Section 03: Data Transformation ─────────────────────────────────────────
const TABLE_DATA = [
  {
    id: "Siswa 1",
    sekolah: "Sekolah A",
    wilayah: "Urban",
    perpus: 2,
    ayah: "SMA",
    ibu: "SMA",
    kelas: "Tinggi",
  },
  {
    id: "Siswa 2",
    sekolah: "Sekolah A",
    wilayah: "Urban",
    perpus: 2,
    ayah: "SMA",
    ibu: "SMA",
    kelas: "Tinggi",
  },
  {
    id: "Siswa 3",
    sekolah: "Sekolah A",
    wilayah: "Urban",
    perpus: 2,
    ayah: "SD",
    ibu: "SD",
    kelas: "Cukup",
  },
  {
    id: "Siswa 4",
    sekolah: "Sekolah B",
    wilayah: "Rural",
    perpus: 1,
    ayah: "SD",
    ibu: "SD",
    kelas: "Rendah",
  },
  {
    id: "Siswa 5",
    sekolah: "Sekolah B",
    wilayah: "Rural",
    perpus: 1,
    ayah: "SD",
    ibu: "SD",
    kelas: "Rendah",
  },
];

// ── Heterogeneous graph data ──────────────────────────────────────────────────
type GNT = "area" | "school" | "parent" | "student";
interface GNode {
  id: string;
  label: string;
  typeLabel: string;
  type: GNT;
  x: number;
  y: number;
  attrs: Record<string, string>;
}
interface GEdge {
  from: string;
  to: string;
  label?: string;
  step: number;
}

const NC: Record<GNT, string> = {
  area: "#d4899a",
  school: "#6aaa82",
  parent: "#d4a640",
  student: "#e07a5f",
};
const NR: Record<GNT, number> = {
  area: 26,
  school: 30,
  parent: 25,
  student: 21,
};
const NS: Record<GNT, number> = {
  area: 1,
  school: 2,
  parent: 3,
  student: 4,
};

const GNODES: GNode[] = [
  {
    id: "urban",
    label: "Urban",
    typeLabel: "Status Wilayah",
    type: "area",
    x: 148,
    y: 52,
    attrs: { Tipe: "Status Wilayah", Nilai: "Urban" },
  },
  {
    id: "rural",
    label: "Rural",
    typeLabel: "Status Wilayah",
    type: "area",
    x: 392,
    y: 52,
    attrs: { Tipe: "Status Wilayah", Nilai: "Rural" },
  },
  {
    id: "skolA",
    label: "Sekolah A",
    typeLabel: "Sekolah",
    type: "school",
    x: 200,
    y: 162,
    attrs: {
      Tipe: "Sekolah",
      Kode: "A",
      "Jml. Perpus": "2",
      Wilayah: "Urban",
    },
  },
  {
    id: "skolB",
    label: "Sekolah B",
    typeLabel: "Sekolah",
    type: "school",
    x: 368,
    y: 162,
    attrs: {
      Tipe: "Sekolah",
      Kode: "B",
      "Jml. Perpus": "1",
      Wilayah: "Rural",
    },
  },
  {
    id: "ot1",
    label: "Kar. OT",
    typeLabel: "Orang Tua",
    type: "parent",
    x: 72,
    y: 272,
    attrs: {
      Tipe: "Kar. Orang Tua",
      "Pend. Ayah": "SMA",
      "Pend. Ibu": "SMA",
    },
  },
  {
    id: "ot2",
    label: "Kar. OT",
    typeLabel: "Orang Tua",
    type: "parent",
    x: 292,
    y: 272,
    attrs: {
      Tipe: "Kar. Orang Tua",
      "Pend. Ayah": "SD",
      "Pend. Ibu": "SD",
    },
  },
  {
    id: "s1",
    label: "Siswa 1",
    typeLabel: "Siswa",
    type: "student",
    x: 110,
    y: 375,
    attrs: {
      Tipe: "Siswa",
      ID: "Siswa 1",
      Sekolah: "A",
      "Pend. OT": "SMA+SMA",
      Wilayah: "Urban",
      Prediksi: "Tinggi",
    },
  },
  {
    id: "s2",
    label: "Siswa 2",
    typeLabel: "Siswa",
    type: "student",
    x: 180,
    y: 382,
    attrs: {
      Tipe: "Siswa",
      ID: "Siswa 2",
      Sekolah: "A",
      "Pend. OT": "SMA+SMA",
      Wilayah: "Urban",
      Prediksi: "Tinggi",
    },
  },
  {
    id: "s3",
    label: "Siswa 3",
    typeLabel: "Siswa",
    type: "student",
    x: 252,
    y: 380,
    attrs: {
      Tipe: "Siswa",
      ID: "Siswa 3",
      Sekolah: "A",
      "Pend. OT": "SD+SD",
      Wilayah: "Urban",
      Prediksi: "Cukup",
    },
  },
  {
    id: "s4",
    label: "Siswa 4",
    typeLabel: "Siswa",
    type: "student",
    x: 335,
    y: 375,
    attrs: {
      Tipe: "Siswa",
      ID: "Siswa 4",
      Sekolah: "B",
      "Pend. OT": "SD+SD",
      Wilayah: "Rural",
      Prediksi: "Rendah",
    },
  },
  {
    id: "s5",
    label: "Siswa 5",
    typeLabel: "Siswa",
    type: "student",
    x: 422,
    y: 375,
    attrs: {
      Tipe: "Siswa",
      ID: "Siswa 5",
      Sekolah: "B",
      "Pend. OT": "SD+SD",
      Wilayah: "Rural",
      Prediksi: "Rendah",
    },
  },
];

const GEDGES: GEdge[] = [
  {
    from: "urban",
    to: "skolA",
    label: "jml_perpus=2",
    step: 2,
  },
  {
    from: "rural",
    to: "skolB",
    label: "jml_perpus=1",
    step: 2,
  },
  { from: "skolA", to: "s1", step: 4 },
  { from: "skolA", to: "s2", step: 4 },
  { from: "skolA", to: "s3", step: 4 },
  { from: "skolB", to: "s4", step: 4 },
  { from: "skolB", to: "s5", step: 4 },
  { from: "ot1", to: "s1", label: "mempunyai", step: 4 },
  { from: "ot1", to: "s2", label: "mempunyai", step: 4 },
  { from: "ot2", to: "s3", label: "mempunyai", step: 4 },
  { from: "ot2", to: "s4", label: "mempunyai", step: 4 },
  { from: "ot2", to: "s5", label: "mempunyai", step: 4 },
];

function GraphTransformViz({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const ts = [
      setTimeout(() => setStep(1), 280),
      setTimeout(() => setStep(2), 700),
      setTimeout(() => setStep(3), 1150),
      setTimeout(() => setStep(4), 1650),
      setTimeout(() => setStep(5), 2150),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const hovNode = hovered
    ? (GNODES.find((n) => n.id === hovered) ?? null)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <p
        className="text-[10px] text-center tracking-wider mb-2"
        style={{
          color: M,
          fontFamily: SANS,
          fontStyle: "italic",
        }}
      >
        Contoh topologi graf heterogen yang terbentuk
      </p>

      {/* SVG graph */}
      <div
        className="rounded-xl"
        style={{
          border: "1px dashed rgba(255,255,255,0.11)",
          background: "rgba(255,255,255,0.015)",
          padding: 2,
        }}
      >
        <svg viewBox="0 0 540 415" width="100%">
          {/* ── Edges ───────────────────────────────────────────────────── */}
          {GEDGES.map((edge, i) => {
            const f = GNODES.find((n) => n.id === edge.from)!;
            const t = GNODES.find((n) => n.id === edge.to)!;
            const vis = step >= edge.step;
            const hilit =
              hovered === edge.from || hovered === edge.to;
            const midX = (f.x + t.x) / 2;
            const midY = (f.y + t.y) / 2;
            return (
              <g
                key={i}
                style={{ transition: "opacity 0.45s" }}
                opacity={vis ? 1 : 0}
              >
                <line
                  x1={f.x}
                  y1={f.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={
                    hilit
                      ? NC[f.type]
                      : "rgba(255,255,255,0.16)"
                  }
                  strokeWidth={hilit ? 2 : 1}
                  style={{
                    transition:
                      "stroke 0.2s, stroke-width 0.2s",
                  }}
                />
                {/* label only for area→school edges */}
                {edge.step === 2 && edge.label && (
                  <text
                    x={midX + 6}
                    y={midY - 5}
                    textAnchor="middle"
                    fill={M}
                    fontSize={7}
                    fontFamily={SANS}
                    fontStyle="italic"
                    opacity={0.8}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Nodes ───────────────────────────────────────────────────── */}
          {GNODES.map((node) => {
            const vis = step >= NS[node.type];
            const color = NC[node.type];
            const r = NR[node.type];
            const isHov = hovered === node.id;
            const fs = node.type === "school" ? 7.5 : 8;

            return (
              <g
                key={node.id}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transition: "opacity 0.4s",
                }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Type label above */}
                <text
                  x={node.x}
                  y={node.y - r - 5}
                  textAnchor="middle"
                  fill={color}
                  fontSize={6.5}
                  fontFamily={SANS}
                  fontWeight="600"
                  opacity={0.7}
                >
                  {node.typeLabel}
                </text>

                {/* Glow ring on hover */}
                {isHov && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 7}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    strokeOpacity={0.3}
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={r}
                  fill={color}
                  fillOpacity={isHov ? 0.3 : 0.14}
                  stroke={color}
                  strokeWidth={isHov ? 2.5 : 1.8}
                  style={{
                    transition:
                      "fill-opacity 0.18s, stroke-width 0.18s",
                  }}
                />

                {/* Node label — two-line for schools */}
                {node.type === "school" ? (
                  <text
                    textAnchor="middle"
                    fill={color}
                    fontSize={fs}
                    fontFamily={SANS}
                    fontWeight="700"
                  >
                    <tspan x={node.x} y={node.y - 3}>
                      {node.label.split(" ")[0]}
                    </tspan>
                    <tspan x={node.x} dy="11">
                      {node.label.split(" ")[1]}
                    </tspan>
                  </text>
                ) : (
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={color}
                    fontSize={fs}
                    fontFamily={SANS}
                    fontWeight="700"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Tooltip ─────────────────────────────────────────────────── */}
          {hovNode &&
            (() => {
              const color = NC[hovNode.type];
              const r = NR[hovNode.type];
              const entries = Object.entries(hovNode.attrs);
              const W = 150;
              const H = 20 + entries.length * 15;
              // position: prefer right; flip left if too close to edge
              let tx = hovNode.x + r + 10;
              let ty = hovNode.y - H / 2;
              if (tx + W > 532) tx = hovNode.x - r - W - 10;
              if (ty < 3) ty = 3;
              if (ty + H > 412) ty = 412 - H;

              return (
                <g style={{ pointerEvents: "none" }}>
                  {/* drop shadow */}
                  <rect
                    x={tx + 2}
                    y={ty + 2}
                    width={W}
                    height={H}
                    rx={7}
                    fill="#000"
                    fillOpacity={0.45}
                  />
                  {/* body */}
                  <rect
                    x={tx}
                    y={ty}
                    width={W}
                    height={H}
                    rx={7}
                    fill="#080c14"
                    stroke={color}
                    strokeWidth={1}
                    strokeOpacity={0.55}
                  />
                  {/* tinted header strip */}
                  <rect
                    x={tx}
                    y={ty}
                    width={W}
                    height={19}
                    rx={7}
                    fill={color}
                    fillOpacity={0.2}
                  />
                  <rect
                    x={tx}
                    y={ty + 12}
                    width={W}
                    height={7}
                    fill={color}
                    fillOpacity={0.2}
                  />
                  {/* title */}
                  <text
                    x={tx + 9}
                    y={ty + 13}
                    fill={color}
                    fontSize={9}
                    fontWeight="700"
                    fontFamily={SANS}
                  >
                    {hovNode.label}
                  </text>
                  {/* separator */}
                  <line
                    x1={tx + 8}
                    y1={ty + 18}
                    x2={tx + W - 8}
                    y2={ty + 18}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={0.8}
                  />
                  {/* attributes */}
                  {entries.map(([k, v], i) => {
                    const isKelas = k === "Kelas Prediksi";
                    const kelasClr =
                      v === "Tinggi"
                        ? "#6aaa82"
                        : v === "Cukup"
                          ? "#c9a55a"
                          : "#e07a5f";
                    return (
                      <text
                        key={k}
                        x={tx + 9}
                        y={ty + 30 + i * 15}
                        fontSize={8}
                        fontFamily={SANS}
                      >
                        <tspan fill={M}>{k}: </tspan>
                        <tspan
                          fill={isKelas ? kelasClr : "#d8d0c8"}
                          fontWeight={isKelas ? "700" : "400"}
                        >
                          {isKelas ? `▶ ${v}` : v}
                        </tspan>
                      </text>
                    );
                  })}
                </g>
              );
            })()}
        </svg>
      </div>

      {/* Legend */}
      {step >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3"
        >
          {(Object.entries(NC) as [GNT, string][]).map(
            ([type, color]) => {
              const lbl: Record<GNT, string> = {
                area: "Status Wilayah",
                school: "Sekolah",
                parent: "Kar. Orang Tua",
                student: "Siswa",
              };
              return (
                <div
                  key={type}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: `${color}22`,
                      border: `1.5px solid ${color}`,
                    }}
                  />
                  <span
                    style={{ color: M, fontFamily: SANS }}
                    className="text-[9px]"
                  >
                    {lbl[type]}
                  </span>
                </div>
              );
            },
          )}
        </motion.div>
      )}

      {step >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-3"
        >
          <p
            className="text-[10px] mb-3"
            style={{ color: M, fontFamily: SANS }}
          >
            11 node · 12 edge — graf heterogen terbentuk ✓
            &nbsp;·&nbsp; hover node untuk detail
          </p>
          <button
            onClick={onBack}
            className="text-xs px-4 py-2 rounded-full hover:opacity-60 transition-opacity"
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              color: M,
              fontFamily: SANS,
            }}
          >
            ← Kembali ke tabel
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function TransformSection() {
  const [transformed, setTransformed] = useState(false);
  const { ref, on } = useReveal(0.15);

  return (
    <Split
      id="s03"
      left={
        <FadeUp>
          <Tag n="03" label="Transformasi Data ke Graf" />
          <Heading>Data Tabular ke Data Graf</Heading>
          <Body>
            Data tabular dari Asesmen Nasional tiba sebagai data
            tabular bawha. Tabel memperlakukan setiap baris
            secara independen.
          </Body>
          <Body>
            Padahal siswa-siswa yang berbeda bisa berbagi
            sekolah, wilayah yang sama, atau profil orang tua
            yang identik. Entitas-entitas berulang ini tidak
            terlihat pada data tabular tapi ketika dibentuk
            dalam graf maka akan terlihat.
          </Body>
          <Body>
            Jadi data di transformasi menjadi graf heterogen.
            Setiap entitas unik menjadi node bertipe (Siswa,
            Sekolah, Status Wilayah, Orang Tua) dan hubungan
            antar entitas menjadi edge. Edge ini akan menjadi
            media Grapn Neural Network untuk proses
            pemebelajarannya. Klik tombol di bawah untuk melihat
            contoh transformasi.
          </Body>
        </FadeUp>
      }
      right={
        <div ref={ref} className="w-full max-w-lg">
          {!transformed ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 16 }}
              animate={on ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Table title */}
              <p
                className="text-xs font-semibold text-center mb-2"
                style={{ color: T, fontFamily: SANS }}
              >
                Data Asesmen Nasional (Tabular)
              </p>

              {/* Table */}
              <div
                className="rounded-xl overflow-hidden mb-3"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: SURF,
                }}
              >
                <div
                  className="grid text-[8px] tracking-widest uppercase px-3 py-2"
                  style={{
                    gridTemplateColumns:
                      "56px 66px 64px 54px 48px 48px 18px 64px",
                    color: M,
                    fontFamily: SANS,
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span>kd_siswa</span>
                  <span>kd_sekolah</span>
                  <span>status_wil.</span>
                  <span>jml_perpus</span>
                  <span>pend_ayah</span>
                  <span>pend_ibu</span>
                  <span />
                  <span>kelas_pred.</span>
                </div>

                {TABLE_DATA.map((row, i) => {
                  const kelasColor =
                    row.kelas === "Tinggi"
                      ? G
                      : row.kelas === "Cukup"
                        ? "#c9a55a"
                        : A;
                  return (
                    <motion.div
                      key={row.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={on ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.1 + i * 0.07,
                        duration: 0.4,
                      }}
                      className="grid px-3 py-2 items-center"
                      style={{
                        gridTemplateColumns:
                          "56px 66px 64px 54px 48px 48px 18px 64px",
                        borderBottom:
                          i < TABLE_DATA.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                        fontFamily: SANS,
                      }}
                    >
                      <span
                        style={{
                          color: A,
                          fontWeight: 600,
                          fontSize: 10,
                        }}
                      >
                        {row.id}
                      </span>
                      <span style={{ color: T, fontSize: 10 }}>
                        {row.sekolah}
                      </span>
                      <span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                          style={{
                            background:
                              row.wilayah === "Urban"
                                ? `${B}22`
                                : `${A}22`,
                            color:
                              row.wilayah === "Urban" ? B : A,
                          }}
                        >
                          {row.wilayah}
                        </span>
                      </span>
                      <span
                        className="text-center text-[10px]"
                        style={{ color: T }}
                      >
                        {row.perpus}
                      </span>
                      <span
                        style={{
                          color: "#a0988e",
                          fontSize: 10,
                        }}
                      >
                        {row.ayah}
                      </span>
                      <span
                        style={{
                          color: "#a0988e",
                          fontSize: 10,
                        }}
                      >
                        {row.ibu}
                      </span>
                      {/* dots — more columns implied */}
                      <span
                        style={{
                          color: M,
                          fontSize: 11,
                          letterSpacing: "0.05em",
                          lineHeight: 1,
                        }}
                      >
                        ···
                      </span>
                      {/* kelas prediksi */}
                      <span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                          style={{
                            background: `${kelasColor}22`,
                            color: kelasColor,
                          }}
                        >
                          {row.kelas}
                        </span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Arrow + label */}
              <div className="flex flex-col items-center gap-1 mb-3">
                <div className="flex flex-col items-center gap-0">
                  <div
                    style={{
                      width: 1.5,
                      height: 18,
                      background: `${A}70`,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "7px solid transparent",
                      borderRight: "7px solid transparent",
                      borderTop: `10px solid ${A}90`,
                    }}
                  />
                </div>
                <p
                  style={{
                    color: M,
                    fontFamily: SANS,
                    fontStyle: "italic",
                  }}
                  className="text-[10px]"
                >
                  Transformasi ke Graf
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setTransformed(true)}
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: SURF,
                    border: `1px solid ${A}55`,
                    color: T,
                    fontFamily: SANS,
                  }}
                >
                  <span
                    style={{ color: A }}
                    className="transition-transform group-hover:translate-x-0.5 inline-block"
                  >
                    →
                  </span>
                  Transform ke graf
                </button>
              </div>
            </motion.div>
          ) : (
            <GraphTransformViz
              onBack={() => setTransformed(false)}
            />
          )}
        </div>
      }
    />
  );
}

// ─── Section 03b: Real Ego-Graph from Actual Data ────────────────────────────

const SKLA: Record<string, Record<string, string>> = {
  "8500067": {
    Status: "URBAN",
    Jenis: "Kabupaten",
    Kurikulum: "K. 2013",
    "Jml. Siswa": "94",
    "Jml. Pendidik": "5",
    "Rasio Guru/Murid": "18.8",
    "Ruang Kelas": "8",
    Internet: "Ada",
    Listrik: "Ada",
    Komputer: "0",
    Perpus: "0",
    Rombel: "8",
    "Siswa/Rombel": "13",
    "Penerima PIP": "6",
    "Rasio PIP": "6.4%",
    "Min. S1": "100%",
    Sertifikasi: "0%",
  },
  "8500059": {
    Status: "RURAL",
    Jenis: "Kabupaten",
    Kurikulum: "K. 2013",
    "Jml. Siswa": "247",
    "Jml. Pendidik": "2",
    "Rasio Guru/Murid": "123.5",
    "Ruang Kelas": "3",
    Internet: "Ada",
    Listrik: "Ada",
    Komputer: "0",
    Perpus: "0",
    Rombel: "9",
    "Siswa/Rombel": "3",
    "Penerima PIP": "8",
    "Rasio PIP": "3.2%",
    "Min. S1": "100%",
    Sertifikasi: "0%",
  },
  "7100368": {
    Status: "URBAN",
    Jenis: "Kota",
    Kurikulum: "K. Merdeka",
    "Jml. Siswa": "270",
    "Jml. Pendidik": "7",
    "Rasio Guru/Murid": "38.6",
    "Ruang Kelas": "9",
    Internet: "Ada",
    Listrik: "Ada",
    Komputer: "2",
    Perpus: "1",
    Rombel: "7",
    "Siswa/Rombel": "77",
    "Penerima PIP": "100",
    "Rasio PIP": "37%",
    "Min. S1": "85.7%",
    Sertifikasi: "14.3%",
  },
  "7100364": {
    Status: "RURAL",
    Jenis: "Kabupaten",
    Kurikulum: "K. Merdeka",
    "Jml. Siswa": "128",
    "Jml. Pendidik": "29",
    "Rasio Guru/Murid": "4.4",
    "Ruang Kelas": "10",
    Internet: "Ada",
    Listrik: "Ada",
    Komputer: "2",
    Perpus: "1",
    Rombel: "10",
    "Siswa/Rombel": "35",
    "Penerima PIP": "58",
    "Rasio PIP": "45.3%",
    "Min. S1": "96.6%",
    Sertifikasi: "10.3%",
  },
};

// [id, sekolah, gender, pend_ayah, pend_ibu, pkrj_ayah, pkrj_ibu, kelas]
const SROWS: string[][] = [
  [
    "8500067-018",
    "8500067",
    "L",
    "SD",
    "SD",
    "Tidak bekerja",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "8500067-027",
    "8500067",
    "L",
    "Tidak Tahu",
    "Tidak Tahu",
    "Tidak bekerja",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "8500067-045",
    "8500067",
    "L",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "8500067-054",
    "8500067",
    "L",
    "SMA/SMK",
    "SMP",
    "Buruh/Sopir",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "8500067-072",
    "8500067",
    "P",
    "SD",
    "SD",
    "Buruh/Sopir",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "8500067-107",
    "8500067",
    "L",
    "SD",
    "SD",
    "Tidak bekerja",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "8500067-143",
    "8500067",
    "P",
    "SMA/SMK",
    "SMP",
    "Tidak bekerja",
    "Tidak tahu",
    "cukup",
  ],
  [
    "8500067-152",
    "8500067",
    "L",
    "SD",
    "SD",
    "Buruh/Sopir",
    "Buruh/Sopir",
    "cukup",
  ],
  [
    "8500067-196",
    "8500067",
    "P",
    "SMP",
    "SD",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "8500067-205",
    "8500067",
    "P",
    "SD",
    "SD",
    "Buruh/Sopir",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "8500059-018",
    "8500059",
    "P",
    "Tidak Tahu",
    "SMA/SMK",
    "Legislatif/Pemda",
    "TNI/Polri",
    "cukup",
  ],
  [
    "8500059-036",
    "8500059",
    "L",
    "SD",
    "SD",
    "Pensiunan",
    "Pensiunan",
    "rendah",
  ],
  [
    "8500059-045",
    "8500059",
    "L",
    "SMP",
    "SMA/SMK",
    "Perwira TNI/Polri",
    "TNI/Polri",
    "rendah",
  ],
  [
    "8500059-054",
    "8500059",
    "L",
    "SD",
    "SMP",
    "Tidak bekerja",
    "Manajer",
    "cukup",
  ],
  [
    "7100368-018",
    "7100368",
    "P",
    "SMA/SMK",
    "SMP",
    "Mandiri terampil",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-027",
    "7100368",
    "P",
    "SD",
    "SMA/SMK",
    "Usaha kecil",
    "Usaha kecil",
    "cukup",
  ],
  [
    "7100368-036",
    "7100368",
    "P",
    "Sarjana",
    "Tidak Tahu",
    "Usaha kecil",
    "Usaha kecil",
    "rendah",
  ],
  [
    "7100368-054",
    "7100368",
    "P",
    "SD",
    "SD",
    "Tidak tahu",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "7100368-063",
    "7100368",
    "P",
    "Tidak Tahu",
    "Diploma",
    "Usaha kecil",
    "Administratif",
    "cukup",
  ],
  [
    "7100368-089",
    "7100368",
    "P",
    "SMP",
    "SD",
    "Mandiri terampil",
    "Mandiri terampil",
    "cukup",
  ],
  [
    "7100368-098",
    "7100368",
    "P",
    "SD",
    "SD",
    "Mandiri terampil",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-107",
    "7100368",
    "P",
    "SMP",
    "SMA/SMK",
    "Tidak tahu",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100368-125",
    "7100368",
    "L",
    "Tidak Tahu",
    "Tidak Tahu",
    "Usaha kecil",
    "Usaha kecil",
    "cukup",
  ],
  [
    "7100368-134",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Mandiri terampil",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "7100368-143",
    "7100368",
    "P",
    "SMP",
    "SMP",
    "Tidak tahu",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-152",
    "7100368",
    "P",
    "Tidak Tahu",
    "Tidak Tahu",
    "Tidak tahu",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100368-169",
    "7100368",
    "P",
    "SMA/SMK",
    "Diploma",
    "Mandiri terampil",
    "Administratif",
    "rendah",
  ],
  [
    "7100368-178",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-187",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Usaha kecil",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-196",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Pensiunan",
    "Pensiunan",
    "rendah",
  ],
  [
    "7100368-205",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Mandiri terampil",
    "Mandiri terampil",
    "cukup",
  ],
  [
    "7100368-232",
    "7100368",
    "P",
    "SMA/SMK",
    "Sarjana",
    "Profesional",
    "Administratif",
    "cukup",
  ],
  [
    "7100368-249",
    "7100368",
    "P",
    "Tidak Tahu",
    "SMA/SMK",
    "Buruh/Sopir",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-267",
    "7100368",
    "P",
    "SMP",
    "Diploma",
    "Administratif",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-276",
    "7100368",
    "P",
    "Tidak Tahu",
    "Tidak Tahu",
    "Buruh/Sopir",
    "Buruh/Sopir",
    "cukup",
  ],
  [
    "7100368-285",
    "7100368",
    "P",
    "Tidak Tahu",
    "Tidak Tahu",
    "Tidak tahu",
    "Usaha kecil",
    "cukup",
  ],
  [
    "7100368-294",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak tahu",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100368-303",
    "7100368",
    "P",
    "Tidak Tahu",
    "Tidak Tahu",
    "Mandiri terampil",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-312",
    "7100368",
    "P",
    "Tidak Tahu",
    "Tidak Tahu",
    "Mandiri terampil",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-329",
    "7100368",
    "P",
    "SMA/SMK",
    "Sarjana",
    "Tidak tahu",
    "Administratif",
    "cukup",
  ],
  [
    "7100368-338",
    "7100368",
    "P",
    "SD",
    "SMP",
    "Buruh/Sopir",
    "Buruh/Sopir",
    "cukup",
  ],
  [
    "7100368-374",
    "7100368",
    "P",
    "SMP",
    "SMP",
    "Tidak tahu",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100368-383",
    "7100368",
    "P",
    "SMP",
    "Tidak Tahu",
    "Mandiri terampil",
    "Mandiri terampil",
    "rendah",
  ],
  [
    "7100368-392",
    "7100368",
    "P",
    "Tidak Tahu",
    "Tidak Tahu",
    "Sales/Marketing",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100368-409",
    "7100368",
    "P",
    "Tidak Tahu",
    "Sarjana",
    "Tidak tahu",
    "Administratif",
    "cukup",
  ],
  [
    "7100368-427",
    "7100368",
    "P",
    "SMA/SMK",
    "Tidak Tahu",
    "Administratif",
    "Profesional",
    "cukup",
  ],
  [
    "7100368-436",
    "7100368",
    "P",
    "SMA/SMK",
    "Diploma",
    "TNI/Polri",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100368-445",
    "7100368",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak tahu",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100368-454",
    "7100368",
    "P",
    "Diploma",
    "SMA/SMK",
    "Sales/Marketing",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "7100364-018",
    "7100364",
    "L",
    "SMP",
    "SMP",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100364-027",
    "7100364",
    "L",
    "Sarjana",
    "SMA/SMK",
    "Administratif",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100364-036",
    "7100364",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "TNI/Polri",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "7100364-045",
    "7100364",
    "L",
    "Sarjana",
    "Tidak Tahu",
    "Tidak tahu",
    "Tidak tahu",
    "cukup",
  ],
  [
    "7100364-054",
    "7100364",
    "L",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100364-063",
    "7100364",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak tahu",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100364-072",
    "7100364",
    "P",
    "SMA/SMK",
    "SMA/SMK",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100364-089",
    "7100364",
    "P",
    "SD",
    "SD",
    "Tidak tahu",
    "Tidak tahu",
    "rendah",
  ],
  [
    "7100364-107",
    "7100364",
    "P",
    "SMP",
    "SMP",
    "Mandiri terampil",
    "Sales/Marketing",
    "rendah",
  ],
  [
    "7100364-116",
    "7100364",
    "P",
    "SMA/SMK",
    "Diploma",
    "Mandiri terampil",
    "Sales/Marketing",
    "rendah",
  ],
  [
    "7100364-125",
    "7100364",
    "P",
    "SMA/SMK",
    "SMP",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
  [
    "7100364-134",
    "7100364",
    "P",
    "SD",
    "SD",
    "Tidak bekerja",
    "Tidak bekerja",
    "rendah",
  ],
  [
    "7100364-143",
    "7100364",
    "P",
    "SMA/SMK",
    "SD",
    "Mandiri terampil",
    "Mandiri terampil",
    "cukup",
  ],
  [
    "7100364-152",
    "7100364",
    "P",
    "SMA/SMK",
    "SMP",
    "Tidak bekerja",
    "Tidak bekerja",
    "cukup",
  ],
];

type RGT = "wilayah" | "sekolah" | "ortu" | "siswa";
interface RGNode {
  id: string;
  type: RGT;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  attrs: Record<string, string>;
}
interface RGEdge {
  s: string;
  t: string;
}

const RG_C: Record<RGT, string> = {
  wilayah: "#7ec87e",
  sekolah: "#d4899a",
  ortu: "#c9a55a",
  siswa: "#7aafd4",
};
const RG_R: Record<RGT, number> = {
  wilayah: 22,
  sekolah: 18,
  ortu: 11,
  siswa: 7,
};
const RG_L: Record<RGT, string> = {
  wilayah: "Wilayah",
  sekolah: "Sekolah",
  ortu: "Profil Ortu",
  siswa: "Siswa",
};

const { rg_nodes: RG_NODES, rg_edges: RG_EDGES } = (() => {
  const W = 660,
    H = 490;
  const nodes: RGNode[] = [];
  const edges: RGEdge[] = [];
  const sekolahDone = new Set<string>();
  const wMap = new Map<string, string>();
  const oMap = new Map<string, string>();
  let oc = 0;

  let rng = 0.7319;
  const rand = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };
  // Random position within a circle centred on the canvas
  const rpos = (jitter = 1) => {
    const angle = rand() * Math.PI * 2;
    const r =
      (rand() * 0.7 + 0.15) * Math.min(W, H) * 0.46 * jitter;
    return {
      x: W / 2 + Math.cos(angle) * r,
      y: H / 2 + Math.sin(angle) * r,
    };
  };

  for (const row of SROWS) {
    const [sid, skl, gender, pA, pI, pkA, pkI, kls] = row;
    const sa = SKLA[skl];
    const wk = `${sa.Status}_${sa.Jenis}`;

    if (!wMap.has(wk)) {
      const wid = `W_${wk}`;
      wMap.set(wk, wid);
      const p = rpos(0.35);
      nodes.push({
        id: wid,
        type: "wilayah",
        label: `${sa.Status} · ${sa.Jenis}`,
        attrs: {
          Status: sa.Status,
          "Jenis Wilayah": sa.Jenis,
          Bagian: "Indonesia Timur",
          "Daerah Khusus": "Tidak",
        },
        ...p,
        vx: 0,
        vy: 0,
      });
    }

    if (!sekolahDone.has(skl)) {
      sekolahDone.add(skl);
      const p = rpos(0.55);
      nodes.push({
        id: `S_${skl}`,
        type: "sekolah",
        label: skl,
        attrs: { "ID Sekolah": skl, ...sa },
        ...p,
        vx: 0,
        vy: 0,
      });
      edges.push({ s: wMap.get(wk)!, t: `S_${skl}` });
    }

    const ok = `${pA}|${pI}|${pkA}|${pkI}`;
    if (!oMap.has(ok)) {
      const oid = `OT${oc}`;
      oMap.set(ok, oid);
      const p = rpos(0.8);
      nodes.push({
        id: oid,
        type: "ortu",
        label: `Profil ${oc + 1}`,
        attrs: {
          "Pend. Ayah": pA,
          "Pend. Ibu": pI,
          "Pkrj. Ayah": pkA,
          "Pkrj. Ibu": pkI,
        },
        ...p,
        vx: 0,
        vy: 0,
      });
      oc++;
    }

    const p = rpos(1.0);
    nodes.push({
      id: `SI_${sid}`,
      type: "siswa",
      label: sid,
      attrs: {
        ID: sid,
        Gender: gender,
        "Pend. Ayah": pA,
        "Pend. Ibu": pI,
        "Pkrj. Ayah": pkA,
        "Pkrj. Ibu": pkI,
        "Kelas Nilai AN": kls,
      },
      ...p,
      vx: 0,
      vy: 0,
    });

    edges.push({ s: `S_${skl}`, t: `SI_${sid}` });
    edges.push({ s: oMap.get(ok)!, t: `SI_${sid}` });
  }

  return { rg_nodes: nodes, rg_edges: edges };
})();

function RealGraphViz() {
  const GW = 860,
    GH = 560;
  const nodesR = useRef<RGNode[]>(
    RG_NODES.map((n) => ({ ...n })),
  );
  const nmRef = useRef(
    new Map(nodesR.current.map((n) => [n.id, n])),
  );
  const rafR = useRef(0);
  const tickR = useRef(0);
  const running = useRef(false);
  const [, setTick] = useState(0);
  const [hovId, setHovId] = useState<string | null>(null);
  const { ref, on } = useReveal(0.15);

  useEffect(() => {
    if (!on || running.current) return;
    running.current = true;

    const step = () => {
      const ns = nodesR.current;
      const nm = nmRef.current;
      for (const n of ns) {
        n.vx *= 0.82;
        n.vy *= 0.82;
      }
      // Weak center gravity — keeps blob from drifting off canvas
      for (const n of ns) {
        n.vx += (GW / 2 - n.x) * 0.0015;
        n.vy += (GH / 2 - n.y) * 0.0015;
      }
      // Repulsion between every pair — produces organic spread
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[j].x - ns[i].x,
            dy = ns[j].y - ns[i].y;
          const d2 = dx * dx + dy * dy || 0.01;
          const d = Math.sqrt(d2);
          const f = Math.min(4800 / d2, 10);
          ns[i].vx -= (dx / d) * f;
          ns[i].vy -= (dy / d) * f;
          ns[j].vx += (dx / d) * f;
          ns[j].vy += (dy / d) * f;
        }
      }
      // Uniform spring length for all edges — organic, no hierarchy
      for (const e of RG_EDGES) {
        const a = nm.get(e.s),
          b = nm.get(e.t);
        if (!a || !b) continue;
        const dx = b.x - a.x,
          dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const rest = 55;
        const f = (d - rest) * 0.028;
        a.vx += (dx / d) * f;
        a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f;
        b.vy -= (dy / d) * f;
      }
      for (const n of ns) {
        const r = RG_R[n.type];
        n.x = Math.max(r + 2, Math.min(GW - r - 2, n.x + n.vx));
        n.y = Math.max(r + 2, Math.min(GH - r - 2, n.y + n.vy));
      }
      tickR.current++;
      if (tickR.current % 5 === 0) setTick((k) => k + 1);
      if (tickR.current < 500)
        rafR.current = requestAnimationFrame(step);
    };

    rafR.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafR.current);
      running.current = false;
    };
  }, [on]);

  const ns = nodesR.current;
  const nm = nmRef.current;
  const hovNode = hovId ? nm.get(hovId) : null;

  const kelasColor = (v: string) =>
    v === "tinggi" ? G : v === "rendah" ? A : "#c9a55a";

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <svg
          viewBox={`0 0 ${GW} ${GH}`}
          width="100%"
          style={{ display: "block" }}
        >
          {RG_EDGES.map((e, i) => {
            const a = nm.get(e.s),
              b = nm.get(e.t);
            if (!a || !b) return null;
            const hi = hovId === e.s || hovId === e.t;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={
                  hi ? RG_C[a.type] : "rgba(255,255,255,0.09)"
                }
                strokeWidth={hi ? 1.4 : 0.45}
              />
            );
          })}
          {ns.map((n) => {
            const c = RG_C[n.type],
              r = RG_R[n.type],
              hov = hovId === n.id;
            return (
              <g
                key={n.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovId(n.id)}
                onMouseLeave={() => setHovId(null)}
              >
                {hov && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r + 7}
                    fill="none"
                    stroke={c}
                    strokeWidth={1}
                    strokeOpacity={0.32}
                  />
                )}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill={c}
                  fillOpacity={hov ? 0.3 : 0.14}
                  stroke={c}
                  strokeWidth={hov ? 2.5 : 1.5}
                />
                {n.type !== "siswa" && (
                  <text
                    x={n.x}
                    y={n.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={c}
                    fontSize={n.type === "sekolah" ? 6.5 : 7}
                    fontFamily={SANS}
                    fontWeight="700"
                  >
                    {n.type === "sekolah"
                      ? `…${n.label.slice(-7)}`
                      : n.label.length > 14
                        ? n.label.slice(0, 13) + "…"
                        : n.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div
        className="mt-2 rounded-lg px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          minHeight: 64,
        }}
      >
        {hovNode ? (
          <div>
            <p
              style={{
                color: RG_C[hovNode.type],
                fontFamily: SANS,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginBottom: 6,
              }}
            >
              {RG_L[hovNode.type].toUpperCase()}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px 20px",
              }}
            >
              {Object.entries(hovNode.attrs).map(([k, v]) => (
                <div
                  key={k}
                  style={{ display: "flex", gap: 5 }}
                >
                  <span
                    style={{
                      color: M,
                      fontFamily: SANS,
                      fontSize: 9,
                    }}
                  >
                    {k}:
                  </span>
                  <span
                    style={{
                      color:
                        k === "Kelas Nilai AN"
                          ? kelasColor(v)
                          : "#d8d0c8",
                      fontFamily: SANS,
                      fontSize: 9,
                      fontWeight:
                        k === "Kelas Nilai AN" ? 700 : 400,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p
            style={{
              color: M,
              fontFamily: SANS,
              fontStyle: "italic",
              textAlign: "center",
              paddingTop: 16,
              fontSize: 10,
            }}
          >
            Hover node untuk melihat atribut lengkap
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 18px",
          marginTop: 12,
        }}
      >
        {(Object.entries(RG_C) as [RGT, string][]).map(
          ([t, c]) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: `${c}22`,
                  border: `1.5px solid ${c}`,
                }}
              />
              <span
                style={{
                  color: M,
                  fontFamily: SANS,
                  fontSize: 9,
                }}
              >
                {RG_L[t]}
              </span>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: SANS,
            fontSize: 10,
            color: M,
            letterSpacing: "0.04em",
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          Keseluruhan struktur graf yang terbentuk adalah
        </p>
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: "2.4rem",
              color: T,
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            3.318
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 9,
              color: M,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 5,
            }}
          >
            Total Node Jaringan
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 32px",
          }}
        >
          {(
            [
              { dot: A, count: "2.162", label: "Siswa" },
              { dot: B, count: "79", label: "Sekolah" },
              { dot: G, count: "5", label: "Wilayah" },
              {
                dot: "#c9a55a",
                count: "1.072",
                label: "Profil Orang Tua",
              },
            ] as { dot: string; count: string; label: string }[]
          ).map(({ dot, count, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: dot,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 600,
                  color: T,
                }}
              >
                {count}
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 11,
                  color: M,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EgoGraphSection() {
  return (
    <section
      id="s03b"
      className="max-w-7xl mx-auto px-6 lg:px-16 py-16"
    >
      <RealGraphViz />
    </section>
  );
}

// ─── Section 04: Graph Structure ─────────────────────────────────────────────
// Siswa — tight cluster at center (1 + 6 + 11 = 18 nodes)
const SN: [number, number][] = [
  [210, 210],
  [228, 210],
  [219, 226],
  [201, 226],
  [192, 210],
  [201, 194],
  [219, 194],
  [246, 210],
  [240, 230],
  [225, 243],
  [205, 246],
  [187, 237],
  [175, 221],
  [175, 199],
  [187, 183],
  [205, 174],
  [225, 177],
  [240, 190],
];
// Sekolah — scattered middle area
const SCH: [number, number][] = [
  [298, 148],
  [262, 308],
  [128, 298],
  [72, 178],
  [162, 62],
  [318, 268],
];
// Wilayah — scattered outer area
const REG: [number, number][] = [
  [362, 78],
  [38, 312],
  [330, 355],
];

const MP_PHASES = [
  {
    label: "Ronde 1",
    name: "Agregasi Lokal",
    desc: "Setiap siswa mengirim pesan ke sekolah-nya",
    color: A,
  },
  {
    label: "Ronde 2",
    name: "Propagasi Konteks",
    desc: "Sekolah mengumpulkan & meneruskan ke wilayah",
    color: B,
  },
  {
    label: "Ronde 3",
    name: "Klasifikasi",
    desc: "Representasi lengkap — prediksi dihasilkan",
    color: G,
  },
];

function NetworkGraph() {
  const { ref, on } = useReveal(0.2);
  const [phase, setPhase] = useState(0);

  // Pre-build photon path data
  const snPhotons = SN.map(([sx, sy], i) => {
    const [ex, ey] = SCH[i % 6];
    return {
      path: `M${sx},${sy} L${ex},${ey}`,
      x1: sx,
      y1: sy,
      x2: ex,
      y2: ey,
      dur: 0.85 + (i % 5) * 0.11,
      delay: (i * 0.21) % 2.6,
    };
  });
  const schPhotons: {
    path: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dur: number;
    delay: number;
  }[] = [];
  SCH.forEach(([sx, sy], i) => {
    const [rx, ry] = REG[i % 3];
    schPhotons.push({
      path: `M${sx},${sy} L${rx},${ry}`,
      x1: sx,
      y1: sy,
      x2: rx,
      y2: ry,
      dur: 0.72 + i * 0.09,
      delay: i * 0.31,
    });
    const [rx2, ry2] = REG[(i + 1) % 3];
    schPhotons.push({
      path: `M${sx},${sy} L${rx2},${ry2}`,
      x1: sx,
      y1: sy,
      x2: rx2,
      y2: ry2,
      dur: 0.78 + i * 0.07,
      delay: i * 0.24 + 0.18,
    });
  });

  // Phase cycling
  useEffect(() => {
    if (!on) return;
    const dur = [3400, 2800, 2400][phase];
    const t = setTimeout(
      () => setPhase((p) => (p + 1) % 3),
      dur,
    );
    return () => clearTimeout(t);
  }, [on, phase]);

  return (
    <div ref={ref} className="w-full max-w-sm">
      <svg viewBox="30 30 360 360" width="100%">
        <defs>
          <filter
            id="mpf-a"
            x="-250%"
            y="-250%"
            width="600%"
            height="600%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4.5"
              result="b"
            />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="mpf-b"
            x="-250%"
            y="-250%"
            width="600%"
            height="600%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4"
              result="b"
            />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="mpf-g"
            x="-300%"
            y="-300%"
            width="700%"
            height="700%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="7"
              result="b"
            />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base edges — SCH↔SN (middle to center) */}
        {snPhotons.map((e, i) => (
          <line
            key={`sne${i}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={
              phase >= 1 ? `${A}35` : "rgba(255,255,255,0.06)"
            }
            strokeWidth={phase >= 1 ? 0.9 : 0.5}
          />
        ))}

        {/* Base edges — REG↔SCH (outer to middle) */}
        {schPhotons.map((e, i) => (
          <line
            key={`sche${i}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={
              phase === 0 ? `${G}35` : "rgba(255,255,255,0.06)"
            }
            strokeWidth={phase === 0 ? 0.9 : 0.5}
          />
        ))}

        {/* ── Photons: Wilayah → Sekolah (phase 0) — outer to middle ── */}
        {on &&
          phase === 0 &&
          schPhotons.map((e, i) => (
            <circle
              key={`rsp${i}`}
              r={2.5}
              fill={G}
              fillOpacity={0.9}
              filter="url(#mpf-g)"
            >
              {/* @ts-ignore */}
              <animateMotion
                dur={`${e.dur}s`}
                repeatCount="indefinite"
                begin={`${e.delay}s`}
                path={`M${e.x2},${e.y2} L${e.x1},${e.y1}`}
              />
            </circle>
          ))}

        {/* ── Photons: Sekolah → Siswa (phase 1 & 2) — middle to center ── */}
        {on &&
          phase >= 1 &&
          snPhotons.map((e, i) => (
            <circle
              key={`snp${i}`}
              r={2.2}
              fill={B}
              fillOpacity={0.92}
              filter="url(#mpf-b)"
            >
              {/* @ts-ignore */}
              <animateMotion
                dur={`${e.dur}s`}
                repeatCount="indefinite"
                begin={`${e.delay}s`}
                path={`M${e.x2},${e.y2} L${e.x1},${e.y1}`}
              />
            </circle>
          ))}

        {/* ── REG nodes — outer, dim unless active ── */}
        {REG.map(([x, y], i) => (
          <g key={`rg${i}`}>
            {on && phase === 0 && (
              <circle
                cx={x}
                cy={y}
                r={13}
                fill="none"
                stroke={G}
                strokeOpacity={0.45}
                strokeWidth={1}
              >
                <animate
                  attributeName="r"
                  values="13;22;13"
                  dur="2.8s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.45;0;0.45"
                  dur="2.8s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={13}
              fill={G}
              fillOpacity={phase === 0 ? 0.88 : 0.35}
            />
          </g>
        ))}

        {/* ── SCH nodes — middle ring ── */}
        {SCH.map(([x, y], i) => (
          <g key={`sc${i}`}>
            {on && phase === 1 && (
              <circle
                cx={x}
                cy={y}
                r={9}
                fill="none"
                stroke={B}
                strokeOpacity={0.5}
                strokeWidth={1}
              >
                <animate
                  attributeName="r"
                  values="9;17;9"
                  dur="2.2s"
                  begin={`${i * 0.22}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.5;0;0.5"
                  dur="2.2s"
                  begin={`${i * 0.22}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={9}
              fill={B}
              fillOpacity={
                phase === 0 ? 0.72 : phase === 1 ? 0.95 : 0.45
              }
              filter={phase === 1 ? "url(#mpf-b)" : undefined}
            />
          </g>
        ))}

        {/* ── SN nodes — center cluster, the focus ── */}
        {SN.map(([x, y], i) => (
          <g key={`sn${i}`}>
            {on && phase === 2 && (
              <circle
                cx={x}
                cy={y}
                r={5.5}
                fill="none"
                stroke={A}
                strokeOpacity={0.6}
                strokeWidth={0.8}
              >
                <animate
                  attributeName="r"
                  values="5.5;12;5.5"
                  dur="2s"
                  begin={`${(i * 0.12) % 1.6}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.6;0;0.6"
                  dur="2s"
                  begin={`${(i * 0.12) % 1.6}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={i === 0 ? 6.5 : 5.5}
              fill={A}
              fillOpacity={
                phase === 2 ? 1.0 : phase === 1 ? 0.75 : 0.4
              }
              filter={phase === 2 ? "url(#mpf-a)" : undefined}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function GraphSection() {
  return (
    <Split
      id="s04"
      left={
        <FadeUp>
          <Tag n="04" label="Struktur Graf" />
          <Heading>
            Memetakan Jaringan yang Tak Terlihat
          </Heading>
          <Body>
            Hasil data kemudian berada dalam bentuk graf yang
            terdiri dari
          </Body>
          <Body>
            3,318 nodes. 4,403 relasi. Siswa terhubung dengan
            sekolah, sekolah terhubung dengan wilayah, siswa
            terhubung dengan profil orang tua — menjadi sebuah
            graf yang mencerminkan bagaimana pendidikan
            sebenarnya berjalan di dunia nyata.
          </Body>
          <Body>
            Graph Neural Network kemudian belajar dari struktur
            ini, sehingga informasi dapat mengalir melalui
            koneksi-koneksi tersebut. Sehingga hasil pembelajran
            dan prediksi dari GNN nantinya adalah hasil dari
            informasi koneksi dalam graf.
          </Body>
        </FadeUp>
      }
      right={<NetworkGraph />}
    />
  );
}

// ─── Section 05: Model Performance ───────────────────────────────────────────
function ModelSection() {
  const { ref, on } = useReveal(0.3);
  const acc = 70.37;
  const r = 90;
  const circ = 2 * Math.PI * r;
  const filled = (acc / 100) * circ;

  return (
    <Split
      id="s05"
      left={
        <FadeUp>
          <Tag n="05" label="Performa Model" />
          <Heading>Model Belajar</Heading>
          <Body>
            Setelah proses pelatihan, GNN mencapai akurasi
            pengujian sebesar 70,37% — yang berhasil
            mengklasifikasikan sebagian besar siswa ke dalam
            tingkatan prestasi rendah, sedang, atau tinggi.
          </Body>
          <Body>
            Tantangan yang lebih rumit: model tersebut terkadang
            salah mengidentifikasi siswa yang berada di dekat
            batas antara kelompok kelas, terutama dalam kelompok
            minoritas 'rendah' dan 'tinggi'. Siswa dengan
            lingkungan sekolah yang identik dapat memperoleh
            hasil yang sangat berbeda akibat faktor-faktor yang
            tidak dapat dideteksi oleh model mana pun.
          </Body>
          <Body>
            Namun, apa yang dipelajari model tersebut tetap
            memberikan wawasan yang berharga.
          </Body>

          <Body>
            SHAP Kemudian digunakann untuk mengetahui
            faktor-faktor apa saja yang sebenarnya mendasari
            setiap prediksi?
          </Body>
        </FadeUp>
      }
      right={
        <div
          ref={ref}
          className="flex flex-col items-center gap-10 w-full max-w-xs"
        >
          {/* Circular gauge */}
          <div
            className="relative"
            style={{ width: 220, height: 220 }}
          >
            <svg width={220} height={220} viewBox="0 0 220 220">
              <circle
                cx={110}
                cy={110}
                r={r}
                fill="none"
                stroke={SURF}
                strokeWidth={16}
              />
              <g transform="rotate(-90 110 110)">
                <motion.circle
                  cx={110}
                  cy={110}
                  r={r}
                  fill="none"
                  stroke={A}
                  strokeWidth={16}
                  strokeLinecap="round"
                  strokeDasharray={`${circ} ${circ}`}
                  initial={{ strokeDashoffset: circ }}
                  animate={
                    on
                      ? { strokeDashoffset: circ - filled }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: "2.25rem",
                  color: T,
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                70.37%
              </span>
              <span
                className="text-[10px] tracking-widest uppercase mt-2"
                style={{ color: M, fontFamily: SANS }}
              >
                Akurasi Pengujian
              </span>
            </div>
          </div>

          {/* Classification certainty */}
          <div className="w-full">
            <p
              className="text-[10px] tracking-widest uppercase text-center mb-5"
              style={{ color: M, fontFamily: SANS }}
            >
              Kepastian Klasifikasi
            </p>
            <div
              className="flex gap-3 justify-center mb-3"
              style={{ alignItems: "flex-end", height: 90 }}
            >
              {[
                { label: "RENDAH", h: 48, active: false },
                { label: "SEDANG", h: 80, active: true },
                { label: "TINGGI", h: 50, active: false },
              ].map(({ label, h, active }) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <motion.div
                      className="w-full rounded-sm"
                      initial={{ height: 0 }}
                      animate={on ? { height: h } : {}}
                      transition={{
                        duration: 0.9,
                        delay: 0.65,
                      }}
                      style={{
                        background: active
                          ? "#7a3c28"
                          : "#252d3e",
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] tracking-wider font-medium"
                    style={{
                      color: active ? A : M,
                      fontFamily: SANS,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="text-[11px] italic text-center"
              style={{ color: M, fontFamily: SANS }}
            >
              Model memprediksi kelas mayoritas "Sedang" dengan
              keyakinan tertinggi.
            </p>
          </div>
        </div>
      }
    />
  );
}

// ─── Section 06: SHAP Key Finding ────────────────────────────────────────────
const SHAP_DATA = [
  { factor: "Kepadatan Kelas", rural: 0.0671, urban: 0.0864 },
  { factor: "Skala Sekolah", rural: 0.0245, urban: 0.042 },
  { factor: "Penerima PIP", rural: 0.0385, urban: 0.0198 },
  {
    factor: "Guru Bersertifikat",
    rural: 0.0312,
    urban: 0.0187,
  },
  { factor: "Komputer Sekolah", rural: 0.0155, urban: 0.0289 },
  {
    factor: "Pendidikan Ayah",
    rural: 0.0198,
    urban: 0.0221,
  },
];
const MAX_SHAP = 0.0864;

function ShapSection() {
  const { ref, on } = useReveal(0.15);

  return (
    <Split
      id="s06"
      left={
        <FadeUp>
          <Tag n="06" label="Temuan Utama I" />
          <Heading>Kepadatan Kelas: Faktor Universal</Heading>
          <Body>
            analisis SHAP memeringkat setiap variabel
            berdasarkan kekuatan prediktifnya, satu faktor
            menempati posisi teratas baik di daerah rural maupun
            urban: kepadatan kelas — yaitu Jumlah Siswa per
            Rombel
          </Body>
          <Body>
            Di daerah rural, nilai rata-rata absolut SHAP-nya
            adalah 0,0671. Di daerah urban, sebesar 0,0864.
            Lebih tinggi dibandingkan pendidikan orang tua.
            Lebih tinggi dibandingkan akses internet. Lebih
            tinggi dibandingkan kurikulum yang digunakan.
          </Body>
          <Body>
            Ini adalah faktor paling fundamental dalam sistem
            sekolah: Di mana ruang kelas mengalami kelebihan
            kapasitas, kualitas pembelajaran akan terganggu baik
            rural ataupun urban.
          </Body>
        </FadeUp>
      }
      right={
        <div ref={ref} className="w-full max-w-md">
          <div className="text-center mb-6">
            <p
              style={{
                fontFamily: SERIF,
                color: T,
                fontWeight: 400,
              }}
              className="text-xl mb-1"
            >
              Nilai Rata-rata |SHAP|
            </p>
            <p
              className="text-[10px] tracking-widest uppercase"
              style={{ color: M, fontFamily: SANS }}
            >
              Kekuatan Prediktif Setiap Faktor
            </p>
          </div>

          <div className="flex gap-6 mb-6">
            {[
              { c: A, l: "RURAL" },
              { c: B, l: "URBAN" },
            ].map(({ c, l }) => (
              <div key={l} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: c }}
                />
                <span
                  className="text-xs font-bold tracking-widest"
                  style={{ color: c, fontFamily: SANS }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {SHAP_DATA.map(({ factor, rural, urban }, i) => {
              const rW = (rural / MAX_SHAP) * 100;
              const uW = (urban / MAX_SHAP) * 100;
              return (
                <div key={factor}>
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: T, fontFamily: SANS }}
                  >
                    {factor}
                  </p>
                  <div className="flex flex-col gap-1">
                    {[
                      { color: A, w: rW, val: rural },
                      { color: B, w: uW, val: urban },
                    ].map(({ color, w, val }, j) => (
                      <div
                        key={j}
                        className="relative h-6 rounded overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <motion.div
                          className="absolute left-0 top-0 h-full rounded flex items-center justify-end pr-2"
                          style={{
                            background: color,
                            minWidth: 4,
                          }}
                          initial={{ width: 0 }}
                          animate={on ? { width: `${w}%` } : {}}
                          transition={{
                            duration: 0.9,
                            delay: 0.2 + i * 0.07 + j * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {w > 30 && (
                            <span
                              className="text-[9px] font-bold"
                              style={{
                                color: "#fff",
                                fontFamily: SANS,
                              }}
                            >
                              {val.toFixed(4)}
                            </span>
                          )}
                        </motion.div>
                        {w <= 30 && (
                          <span
                            className="absolute right-0 top-0 h-full flex items-center pr-2 text-[9px] font-bold"
                            style={{ color, fontFamily: SANS }}
                          >
                            {val.toFixed(4)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

// ─── Section 07: Mirror Effect ────────────────────────────────────────────────
function MirrorSection() {
  return (
    <Split
      id="s07"
      left={
        <FadeUp>
          <Tag n="07" label="Temuan Utama II" />
          <Heading>Faktor Sama. Efek Berlawanan.</Heading>
          <Body>
            Di sinilah temuannya menjadi menarik. Peneliti
            menemukan bahwa beberapa faktor tidak hanya berbeda
            dalam hal kekuatan antara daerah rural dan urban
            melainkan menunjukkan arah pengaruh yang bertolak
            belakang sepenuhnya.
          </Body>
          <Body>
            Ambil contoh skala sekolah (Jumlah Peserta Didik).
            Di wilayah urban, tingginya Jumlah Peserta Didik
            bertindak sebagai penahan yang menurunkan
            probabilitas siswa untuk diklasifikasikan ke dalam
            kelas capaian rendah. Sekolah berskala besar sering
            kali berasosiasi dengan prestise, pendanaan, dan
            pendidik yang kompetitif.
          </Body>
          <Body>
            Di wilayah rural, tingginya Jumlah Peserta Didik
            yang sama justru mendorong siswa masuk ke kelas
            capaian rendah. Lebih banyak siswa. Sumber daya yang
            sama (atau lebih sedikit). Faktor yang sama. Pola
            arah pengaruh yang bertolak belakang
          </Body>
          <Body>
            Temuan ini berupaya untuk menjelaskan bahwa gagasan
            bahwa kebijakan pendidikan harusnya tidak
            disamaratakan melihat berbagi faktor ternyata dapat
            memiliki pola pengaruh yang berbeda di daerah rural
            dan urban.
          </Body>
        </FadeUp>
      }
      right={
        <FadeUp delay={0.15}>
          <div className="w-full max-w-sm">
            <div className="text-center mb-5">
              <p
                style={{
                  fontFamily: SERIF,
                  color: T,
                  fontWeight: 400,
                }}
                className="text-xl mb-3"
              >
                Efek Cermin
              </p>
              <div
                className="inline-block px-4 py-2 rounded-lg text-xs"
                style={{
                  background: SURF,
                  color: M,
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: SANS,
                }}
              >
                Jumlah Peserta Didik
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  color: A,
                  label: "DAMPAK RURAL",
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 5v14M5 12l7 7 7-7"
                        stroke={A}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  headline:
                    "Mendorong siswa KE DALAM kelas capaian rendah",
                  detail:
                    "Di daerah rural, sekolah yang lebih besar sering kekurangan sumber daya seiring bertambahnya siswa, membebani infrastruktur yang terbatas",
                },
                {
                  color: B,
                  label: "DAMPAK URBAN",
                  icon: (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 19V5M5 12l7-7 7 7"
                        stroke={B}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                  headline:
                    "MENAHAN siswa dari kelas capaian rendah",
                  detail:
                    "Di wilayah urban, sekolah yang lebih besar menandakan prestise, pendanaan lebih baik, dan sumber daya pendidikan yang lebih terkonsentrasi",
                },
              ].map(
                ({ color, label, icon, headline, detail }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-5 flex flex-col items-center text-center"
                    style={{
                      background: SURF,
                      border: `1px solid ${color}28`,
                    }}
                  >
                    <p
                      className="text-[9px] tracking-widest font-bold mb-4"
                      style={{ color, fontFamily: SANS }}
                    >
                      {label}
                    </p>
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{
                        background: `${color}18`,
                        border: `2px solid ${color}55`,
                      }}
                    >
                      {icon}
                    </div>
                    <p
                      className="text-sm font-semibold leading-snug mb-3"
                      style={{ color: T, fontFamily: SANS }}
                    >
                      {headline}
                    </p>
                    <p
                      className="text-[11px] leading-relaxed"
                      style={{ color: M, fontFamily: SANS }}
                    >
                      {detail}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </FadeUp>
      }
    />
  );
}

// ─── Section 08: Policy Implications ─────────────────────────────────────────
const RURAL_FACTORS = [
  {
    factor: "Kepadatan Kelas",
    desc: "Jumlah siswa per rombongan belajar (rombel)",
  },
  {
    factor: "Penerima PIP",
    desc: "Jumlah siswa penerima bantuan Program Indonesia Pintar",
  },
  {
    factor: "Guru Bersertifikat",
    desc: "Proporsi guru dengan sertifikasi pendidikan formal",
  },
];
const URBAN_FACTORS = [
  {
    factor: "Kepadatan Kelas",
    desc: "Jumlah siswa per rombongan belajar (rombel)",
  },
  {
    factor: "Skala Sekolah",
    desc: "Total jumlah siswa yang terdaftar di sekolah",
  },
  {
    factor: "Komputer Sekolah",
    desc: "Jumlah komputer yang tersedia di sekolah",
  },
];

function PolicySection() {
  return (
    <Split
      id="s08"
      left={
        <FadeUp>
          <Tag n="08" label="Implikasi Kebijakan" />
          <Heading>Dua Sistem. Dua Intervensi.</Heading>
          <Body>
            Hasil analisis ini sangat tegas: variabel struktural
            pada tingkat institusi sekolah mendominasi
            karakteristik latar belakang individu keluarga dalam
            menentukan capaian akademik siswa. Ekosistemlah yang
            membentuk siswa.
          </Body>
          <Body>
            Di daerah rural, faktor prediktif utama kedua
            setelah kepadatan kelas adalah Jumlah Siswa PIP —
            program bantuan finansial pemerintah. Hambatan
            ekonomi menjadi batasan struktural bagi capaian
            akademik di daerah rural.
          </Body>
          <Body>
            Di wilayah urban, faktor tersebut adalah skala
            institusi (Jumlah Peserta Didik). Konsentrasi siswa
            di sekolah-sekolah tertentu memperbesar keuntungan
            bagi sebagian siswa, dan kerugian bagi siswa
            lainnya.
          </Body>
          <Body>
            Mengurangi kepadatan kelas (Jumlah Siswa per Rombel)
            di ruang kelas daerah rural akan memberikan dampak
            terukur yang lebih besar dibandingkan hampir semua
            intervensi tunggal lainnya. Dan data menunjukkan
            mengapa intervensi tersebut tidak dapat diterapkan
            dengan pendekatan yang sama secara seragam di
            seluruh wilayah Nusantara.
          </Body>
        </FadeUp>
      }
      right={
        <FadeUp delay={0.15}>
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <p
                style={{
                  fontFamily: SERIF,
                  color: T,
                  fontWeight: 400,
                }}
                className="text-xl mb-1"
              >
                Perbedaan Prioritas
              </p>
              <p
                className="text-[10px] tracking-widest uppercase"
                style={{ color: M, fontFamily: SANS }}
              >
                3 Faktor Prediktif Utama Berdasarkan Wilayah
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {[
                {
                  title: "Rural Indonesia Timur",
                  color: A,
                  items: RURAL_FACTORS,
                },
                {
                  title: "Urban Indonesia Timur",
                  color: B,
                  items: URBAN_FACTORS,
                },
              ].map(({ title, color, items }) => (
                <div key={title}>
                  <p
                    className="text-[9px] tracking-widest uppercase font-bold mb-4"
                    style={{ color, fontFamily: SANS }}
                  >
                    {title}
                  </p>
                  <div className="flex flex-col gap-4">
                    {items.map((item, i) => (
                      <div
                        key={item.factor}
                        className="flex gap-3"
                      >
                        <span
                          style={{
                            fontFamily: SERIF,
                            color: `${color}45`,
                            fontWeight: 400,
                            fontSize: "2rem",
                            lineHeight: 1,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p
                            className="text-sm font-semibold mb-0.5"
                            style={{
                              color: T,
                              fontFamily: SANS,
                            }}
                          >
                            {item.factor}
                          </p>
                          <p
                            className="text-[11px] leading-snug"
                            style={{
                              color: M,
                              fontFamily: SANS,
                            }}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-6 text-center"
              style={{
                background: SURF,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: SERIF,
                  color: T,
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                }}
                className="text-base"
              >
                "Intervensi kebijakan yang berhasil di wilayah
                urban tidak dapat begitu saja diterapkan di
                wilayah rural"
              </p>
            </div>
          </div>
        </FadeUp>
      }
    />
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      style={{
        background: BG,
        color: T,
        fontFamily: SANS,
        minHeight: "100vh",
      }}
    >
      <ProgressBar />
      <Hero />
      <IntroSection />
      <ResearchAimSection />
      <DataSection />
      <TransformSection />
      <EgoGraphSection />
      <GraphSection />
      <ModelSection />
      <ShapSection />
      <MirrorSection />
      <PolicySection />

      <footer
        className="py-16 text-center"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <p
          className="text-sm mb-2"
          style={{ color: M, fontFamily: SANS }}
        >
          Research by Michael Luwi Pallea' — Universitas Negeri
          Surabaya, 2026
        </p>
        <p
          className="text-xs"
          style={{ color: `${M}70`, fontFamily: SANS }}
        >
          Analisis GNN + SHAP Capaian Akademik Siswa Indonesia
          Timur
        </p>
      </footer>
    </div>
  );
}