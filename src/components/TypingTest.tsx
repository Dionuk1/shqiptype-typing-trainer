import { useEffect, useMemo, useRef, useState } from "react";
import { DICTIONARIES, type Dictionary } from "@/lib/words";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { getRecord, recordKey, saveIfRecord, type PersonalRecord } from "@/lib/records";

const TIME_OPTIONS = [15, 30, 60] as const;
const VISIBLE_WORDS = 24;

const glassCard =
  "rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_12px_40px_-16px] shadow-black/60";

function Stat({ value, label, accent, suffix }: { value: React.ReactNode; label: string; accent?: boolean; suffix?: string }) {
  return (
    <div className={`${glassCard} px-3 py-3 text-center`}>
      <div className={`font-mono text-[24px] font-bold leading-none tabular-nums ${accent ? "text-sky" : "text-frost"}`}>
        {value}
        {suffix && <span className="text-[13px] text-mist/70">{suffix}</span>}
      </div>
      <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-mist/70">{label}</div>
    </div>
  );
}

export function TypingTest() {
  const [dictionary, setDictionary] = useState<Dictionary>("standarde");
  const [duration, setDuration] = useState<number>(30);
  const [simplified, setSimplified] = useState(false);
  const { text, typed, phase, timeLeft, stats, input, reset } = useTypingEngine(dictionary, duration, simplified);

  const [record, setRecord] = useState<PersonalRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const key = recordKey(dictionary, duration, simplified);

  const inputRef = useRef<HTMLInputElement>(null);
  const tabRef = useRef(false);

  useEffect(() => {
    setRecord(getRecord(key));
    setIsNewRecord(false);
  }, [key]);

  // save personal record on finish
  useEffect(() => {
    if (phase !== "done") return;
    const rec = { fpm: stats.fpm, accuracy: stats.accuracy, date: Date.now() };
    if (stats.fpm > 0 && saveIfRecord(key, rec)) {
      setIsNewRecord(true);
      setRecord(rec);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const restart = () => {
    reset();
    setIsNewRecord(false);
    inputRef.current?.focus();
  };

  // Tab + Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        tabRef.current = true;
        window.setTimeout(() => (tabRef.current = false), 800);
      } else if (e.key === "Enter" && tabRef.current) {
        e.preventDefault();
        tabRef.current = false;
        restart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // visible window: start a few words behind the caret
  const { visibleText, visibleStart } = useMemo(() => {
    const words = text.split(" ");
    const caretWord = typed.split(" ").length - 1;
    const startWord = Math.max(0, caretWord - 6);
    const start = words.slice(0, startWord).join(" ").length + (startWord > 0 ? 1 : 0);
    const slice = words.slice(startWord, startWord + VISIBLE_WORDS).join(" ");
    return { visibleText: slice, visibleStart: start };
  }, [text, typed]);

  const caretIndex = typed.length - visibleStart;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const urgent = phase === "running" && timeLeft <= 5;

  const pill = (active: boolean) =>
    active
      ? "rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-frost backdrop-blur-md transition"
      : "rounded-lg border border-transparent bg-white/5 px-3 py-1.5 text-[12px] font-medium text-mist backdrop-blur-md transition hover:text-frost";

  return (
    <div
      className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[720px] flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-8"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        autoFocus
        value={typed}
        onChange={(e) => input(e.target.value)}
        className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
        aria-label="Fusha e shkrimit"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />

      <header className="flex items-center justify-between animate-rise">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky/70 to-sky/20 ring-1 ring-white/25">
            <span className="font-mono text-lg font-bold text-frost">A</span>
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-bold tracking-tight text-frost">ShqipType</div>
            <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-mist/70">Test shkrimi shqip</div>
          </div>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-mist tabular-nums">
          🏆 Rekordi: <span className="text-sky">{record?.fpm ?? "—"}</span>
          <small className="text-mist/70"> FPM</small>
        </div>
      </header>

      {/* dictionary toggle */}
      <div className={`${glassCard} p-1 animate-rise`}>
        <div className="grid grid-cols-2 gap-1">
          {(Object.keys(DICTIONARIES) as Dictionary[]).map((k) => (
            <button
              key={k}
              onClick={() => setDictionary(k)}
              className={
                dictionary === k
                  ? "rounded-xl bg-gradient-to-b from-sky/80 to-sky/50 py-2.5 text-[13px] font-bold text-navy ring-1 ring-white/30 transition"
                  : "rounded-xl py-2.5 text-[13px] font-semibold text-mist transition hover:text-frost"
              }
            >
              {DICTIONARIES[k].label}
            </button>
          ))}
        </div>
      </div>

      {/* options */}
      <div className="flex flex-wrap items-center justify-between gap-2 animate-rise">
        <div className="flex gap-1.5">
          {TIME_OPTIONS.map((t) => (
            <button key={t} onClick={() => setDuration(t)} className={pill(duration === t)}>
              {t}s
            </button>
          ))}
          <button
            onClick={() => setSimplified((s) => !s)}
            aria-pressed={simplified}
            className={simplified ? `${pill(true)} !text-sky ring-1 ring-sky/50` : pill(false)}
          >
            Pa ë/ç
          </button>
        </div>
        <button
          onClick={restart}
          className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-sky backdrop-blur-md transition hover:bg-white/15"
        >
          ↺ Rifillo
        </button>
      </div>

      {/* big pulsing timer */}
      {phase !== "done" && (
        <div className="flex justify-center">
          <div
            key={timeLeft}
            className={`font-mono text-5xl font-bold tabular-nums sm:text-6xl ${
              urgent ? "text-err animate-timer-pulse" : phase === "running" ? "text-sky animate-timer-pulse" : "text-mist/50"
            }`}
          >
            {mm}:{ss}
          </div>
        </div>
      )}

      {phase !== "done" ? (
        <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-2xl sm:p-7">
          <p className="select-none font-mono text-[17px] leading-[1.9] tracking-tight sm:text-[20px]">
            {visibleText.split("").map((char, i) => {
              const t = typed[visibleStart + i];
              const color = t === undefined ? "text-mist/45" : t === char ? "text-sky" : "text-err bg-err/15 rounded-sm";
              return (
                <span key={i} className="relative">
                  {i === caretIndex && (
                    <span className="absolute -left-px top-0 h-full w-[2px] rounded-full bg-sky animate-blink" />
                  )}
                  <span className={color}>{char}</span>
                </span>
              );
            })}
          </p>
          {phase === "idle" && (
            <div className="mt-4 border-t border-white/10 pt-3 text-center text-[11px] text-mist/70">
              Fillo të shkruash — koha nis me tastin e parë
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-2xl animate-rise sm:p-8">
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-mist/70">
              {isNewRecord ? "🏆 Rekord i ri personal!" : "Sesioni përfundoi"}
            </div>
            <div className="mt-2 font-mono text-6xl font-bold text-sky sm:text-7xl">{stats.fpm}</div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-mist/70">
              fjalë për minutë (FPM)
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            <Stat value={stats.accuracy} suffix="%" label="Saktësia" />
            <Stat value={stats.words} label="Fjalë" />
            <Stat value={record?.fpm ?? stats.fpm} label="Rekordi" accent />
          </div>
          <button
            onClick={restart}
            className="mt-5 w-full rounded-xl bg-gradient-to-b from-sky/80 to-sky/50 py-3 text-[13px] font-bold text-navy ring-1 ring-white/30 transition hover:brightness-110"
          >
            ↺ Provo sërish
          </button>
        </div>
      )}

      {phase !== "done" && (
        <div className="grid grid-cols-4 gap-2">
          <Stat value={stats.fpm} label="FPM" accent />
          <Stat value={stats.accuracy} suffix="%" label="Saktësia" />
          <Stat value={stats.words} label="Fjalë" />
          <Stat value={timeLeft} suffix="s" label="Koha" />
        </div>
      )}

      <p className="mt-auto pt-1 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-mist/50">
        Tab + Enter · rifillo sesionin
      </p>
    </div>
  );
}
