import { useEffect, useState } from "react";
import { loadProgress, setLang as persistLang } from "./storage";
import { type Lang, t as tFn } from "./translations";

// Global set of listeners to sync language changes across all instances of the hook
const listeners = new Set<(lang: Lang) => void>();

// Read initial value safely for SSR
const getInitialLang = (): Lang => {
  if (typeof window === "undefined") return "te";
  return loadProgress().lang;
};

export function useLang() {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    // Update state to match actual storage on mount
    setLangState(loadProgress().lang);

    const handleUpdate = (newLang: Lang) => {
      setLangState(newLang);
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const setLang = (l: Lang) => {
    persistLang(l);
    // Notify all instances of useLang hook to update state
    listeners.forEach((listener) => listener(l));
  };

  const t = (k: Parameters<typeof tFn>[1]) => tFn(lang, k);
  return { lang, setLang, t };
}
