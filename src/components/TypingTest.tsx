import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DICTIONARIES, generateWords, type Dictionary } from "@/lib/words";

const TIME_OPTIONS = [15, 30, 60] as const;
const WORD_COUNT = 60;
const VISIBLE_WORDS = 24;

type Phase = "idle" | "running" | "done";

interface CharState {
  char: string;
  status: "untyped" | "correct" | "incorrect";
}

function buildText(words: string[]): string {
  return words.join(" ");
}

export function TypingTest() {
  const [dictionary, setDictionary] = useState<Dictionary>("standarde");
  const [duration, setDuration] = useState<number>(30);
  const [text, setText] = useState(() => buildText(generateWords("standarde", WORD_COUNT)));
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [wordOffset, setWordOffset] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  const reset = useCallback((dict: Dictionary, dur: number) => {
    setText(buildText(generateWords(dict, WORD_COUNT)));
    setTyped("");
    setPhase("idle");
    setTimeLeft(dur);
    setElapsed(0);
    setWordOffset(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
    inputRef.current?.focus();
  }, []);

  const startTimer = useCallback(() => {
    startedAtRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsed(secs);
      setTimeLeft((prev) => {
        const next = duration - secs;
        if (next <= 0) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setPhase("done");
          return 0;
        }
        return next;
      });
    }, 250);
  }, [duration]);

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, []);

  // Tab + Enter restart
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.getModifierState("Tab") || tabPressedRef.current)) {
        e.preventDefault();
        reset(dictionary, duration);
        tabPressedRef.current = false;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        tabPressedRef.current = true;
        window.setTimeout(() => (tabPressedRef.current = false), 800);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dictionary, duration, reset]);

  const tabPressedRef = useRef(false);

  const handleInput = (value: string) => {
    if (phase === "done") return;
    if (phase === "idle" && value.length > 0) {
      setPhase("running");
      startTimer();
    }
    setTyped(value.slice(0, text.length));

    // Scroll words: when caret passes halfway through visible words, shift window
    const upto = value.length;
    const before = text.slice(0, upto);
    const spacesSeen = (before.match(/ /g) || []).length;
    if (spacesSeen - wordOffset > VISIBLE_WORDS / 2) {
      setWordOffset(spacesSeen - Math.floor(VISIBLE_WORDS / 3));
    }
  };

  // Visible slice of text starting at wordOffset-th word
  const { visibleText, visibleStart } = useMemo(() => {
    let start = 0;
    let count = 0;
    while (count < wordOffset) {
      const sp = text.indexOf(" ", start);
      if (sp === -1) break;
      start = sp + 1;
      count++;
    }
    let end = start;
    let words = 0;
    while (words < VISIBLE_WORDS) {
      const sp = text.indexOf(" ", end + 1);
      if (sp === -1) { end = text.length; break; }
      end = sp;
      words++;
    }
    return { visibleText: text.slice(start, end), visibleStart: start };
  }, [text, wordOffset]);

  const charStates: CharState[] = useMemo(() => {
    return visibleText.split("").map((char, i) => {
      const globalIdx = visibleStart + i;
      const t = typed[globalIdx];
      if (t === undefined) return { char, status: "untyped" };
      return { char, status: t === char ? "correct" : "incorrect" };
    });
  }, [visibleText, visibleStart, typed]);

  const stats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
      else incorrect++;
    }
    const minutes = Math.max(elapsed, 1) / 60;
    const wpm = phase === "idle" ? 0 : Math.round(correct / 5 / minutes);
    const total = correct + incorrect;
    const accuracy = total === 0 ? 100 : Math.round((correct / total) * 100);
    return { wpm, accuracy, correct, total };
  }, [typed, text, elapsed, phase]);

  const finalStats = useMemo(() => {
    const minutes = duration / 60;
    const wpm = Math.round(stats.correct / 5 / minutes);
    return { wpm, accuracy: stats.accuracy, chars: stats.total };
  }, [stats, duration]);

  const caretIndex = typed.length - visibleStart;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const glassCard =
    "rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_12px_40px_-16px] shadow-black/60";

  return (
    <div
      className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[720px] flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-8"
      onClick={() => inputRef.current?.focus()}
    >
      {/* hidden input capturing keystrokes */}
      <input
        ref={inputRef}
        autoFocus
        value={typed}
        onChange={(e) => handleInput(e.target.value)}
        className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
        aria-label="Typing input"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />

      {/* header */}
      <header className="flex items-center justify-between animate-rise">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky/70 to-sky/20 ring-1 ring-white/25 shadow-[0_8px_24px_-8px] shadow-sky/50">
            <span className="font-mono text-lg font-bold text-frost">A</span>
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-bold tracking-tight text-frost">ShqipType</div>
            <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-mist/70">
              Albanian typing
            </div>
          </div>
        </div>
        <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-sky tabular-nums">
          {phase === "done" ? finalStats.wpm : stats.wpm}
          <small className="text-mist/70"> wpm</small>
        </div>
      </header>

      {/* dictionary toggle */}
      <div className={`${glassCard} p-1 animate-rise [animation-delay:50ms]`}>
        <div className="grid grid-cols-2 gap-1">
          {(Object.keys(DICTIONARIES) as Dictionary[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setDictionary(key);
                reset(key, duration);
              }}
              className={
                dictionary === key
                  ? "rounded-xl bg-gradient-to-b from-sky/80 to-sky/50 py-2.5 text-[13px] font-bold text-navy shadow-[0_6px_18px_-6px] shadow-sky/60 ring-1 ring-white/30 transition"
                  : "rounded-xl py-2.5 text-[13px] font-semibold text-mist transition hover:text-frost"
              }
            >
              {DICTIONARIES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* timer options + restart */}
      <div className="flex items-center justify-between animate-rise [animation-delay:100ms]">
        <div className="flex gap-1.5">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setDuration(t);
                reset(dictionary, t);
              }}
              className={
                duration === t
                  ? "rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-frost backdrop-blur-md transition"
                  : "rounded-lg border border-transparent bg-white/5 px-3 py-1.5 text-[12px] font-medium text-mist backdrop-blur-md transition hover:text-frost"
              }
            >
              {t}s
            </button>
          ))}
        </div>
        <button
          onClick={() => reset(dictionary, duration)}
          className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-sky backdrop-blur-md transition hover:bg-white/15"
        >
          ↺ Restart
        </button>
      </div>

      {/* typing surface */}
      {phase !== "done" ? (
        <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-[0_24px_60px_-24px] shadow-black/70 backdrop-blur-2xl animate-rise [animation-delay:150ms] sm:p-7">
          <div className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <p className="select-none font-mono text-[17px] leading-[1.9] tracking-tight sm:text-[20px]">
            {charStates.map((c, i) => {
              const isCaret = i === caretIndex;
              const color =
                c.status === "correct"
                  ? "text-sky"
                  : c.status === "incorrect"
                    ? "text-err"
                    : "text-mist/45";
              return (
                <span key={i} className="relative">
                  {isCaret && (
                    <span className="absolute -left-px top-0 h-full w-[2px] rounded-full bg-sky animate-blink shadow-[0_0_8px] shadow-sky" />
                  )}
                  <span className={color}>{c.char}</span>
                </span>
              );
            })}
            {caretIndex >= charStates.length && (
              <span className="relative">
                <span className="absolute -left-px top-0 h-full w-[2px] rounded-full bg-sky animate-blink shadow-[0_0_8px] shadow-sky" />
              </span>
            )}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-mist/80">
              <span className="h-2 w-2 rounded-full bg-sky" /> correct
              <span className="ml-1 h-2 w-2 rounded-full bg-err" /> wrong
            </div>
            <div className="font-mono text-[11px] tabular-nums text-mist/70">
              {mm}:{ss}
            </div>
          </div>
        </div>
      ) : (
        /* results panel */
        <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_24px_60px_-24px] shadow-black/70 backdrop-blur-2xl animate-rise sm:p-8">
          <div className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="text-center">
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-mist/70">
              Session complete
            </div>
            <div className="mt-2 font-mono text-6xl font-bold text-sky sm:text-7xl">
              {finalStats.wpm}
            </div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-mist/70">
              words per minute
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <div className={`${glassCard} px-3 py-3 text-center`}>
              <div className="font-mono text-2xl font-bold text-frost">
                {finalStats.accuracy}
                <span className="text-sm text-mist/70">%</span>
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-mist/70">
                accuracy
              </div>
            </div>
            <div className={`${glassCard} px-3 py-3 text-center`}>
              <div className="font-mono text-2xl font-bold text-frost">{finalStats.chars}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-mist/70">
                characters
              </div>
            </div>
          </div>
          <button
            onClick={() => reset(dictionary, duration)}
            className="mt-5 w-full rounded-xl bg-gradient-to-b from-sky/80 to-sky/50 py-3 text-[13px] font-bold text-navy shadow-[0_6px_18px_-6px] shadow-sky/60 ring-1 ring-white/30 transition hover:brightness-110"
          >
            ↺ Provo sërish
          </button>
        </div>
      )}

      {/* live metrics */}
      {phase !== "done" && (
        <div className="grid grid-cols-3 gap-2.5 animate-rise [animation-delay:200ms]">
          <div className={`${glassCard} px-3 py-3 text-center`}>
            <div className="font-mono text-[26px] font-bold leading-none text-sky tabular-nums">
              {stats.wpm}
            </div>
            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-mist/70">
              wpm
            </div>
          </div>
          <div className={`${glassCard} px-3 py-3 text-center`}>
            <div className="font-mono text-[26px] font-bold leading-none text-frost tabular-nums">
              {stats.accuracy}
              <span className="text-[14px] text-mist/70">%</span>
            </div>
            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-mist/70">
              accuracy
            </div>
          </div>
          <div className={`${glassCard} px-3 py-3 text-center`}>
            <div className="font-mono text-[26px] font-bold leading-none text-frost tabular-nums">
              {mm}
              <span className="text-[14px] text-mist/70">:{ss}</span>
            </div>
            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-mist/70">
              time
            </div>
          </div>
        </div>
      )}

      <p className="mt-auto pt-1 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-mist/50">
        Tab + Enter · restart session
      </p>
    </div>
  );
}
