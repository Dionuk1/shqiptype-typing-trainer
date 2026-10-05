import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateWords, simplifyAlbanian, type Dictionary } from "@/lib/words";

const WORD_COUNT = 80;
export type Phase = "idle" | "running" | "done";

function buildText(dict: Dictionary, simplified: boolean) {
  const words = generateWords(dict, WORD_COUNT);
  return (simplified ? words.map(simplifyAlbanian) : words).join(" ");
}

export function useTypingEngine(dictionary: Dictionary, duration: number, simplified: boolean) {
  const [text, setText] = useState(() => buildText(dictionary, simplified));
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const reset = useCallback(() => {
    stop();
    setText(buildText(dictionary, simplified));
    setTyped("");
    setPhase("idle");
    setElapsedMs(0);
  }, [dictionary, simplified]);

  // regenerate when settings change
  useEffect(() => {
    reset();
  }, [reset, duration]);

  useEffect(() => stop, []);

  const input = (value: string) => {
    if (phase === "done") return;
    if (phase === "idle" && value.length > 0) {
      setPhase("running");
      startRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const ms = Date.now() - startRef.current;
        if (ms >= duration * 1000) {
          stop();
          setElapsedMs(duration * 1000);
          setPhase("done");
        } else setElapsedMs(ms);
      }, 100);
    }
    setTyped(value.slice(0, text.length));
  };

  const stats = useMemo(() => {
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < typed.length; i++) typed[i] === text[i] ? correct++ : errors++;
    // completed correct words
    const typedWords = typed.split(" ");
    const targetWords = text.split(" ");
    let words = 0;
    for (let i = 0; i < typedWords.length - 1; i++) if (typedWords[i] === targetWords[i]) words++;
    const minutes = Math.max(elapsedMs, 1000) / 60000;
    const fpm = phase === "idle" ? 0 : Math.round(correct / 5 / minutes);
    const total = correct + errors;
    const accuracy = total === 0 ? 100 : Math.round((correct / total) * 100);
    return { correct, errors, total, words, fpm, accuracy };
  }, [typed, text, elapsedMs, phase]);

  const timeLeft = Math.max(0, Math.ceil(duration - elapsedMs / 1000));

  return { text, typed, phase, timeLeft, elapsedMs, stats, input, reset };
}
