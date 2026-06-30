import { useEffect, useState } from "react";
import { loadProgress, saveProgress, setLang as persistLang, STORAGE_KEY } from "./storage";
import { type Lang, t as tFn } from "./translations";

// Global set of listeners to sync language changes across all instances of the hook
const listeners = new Set<(lang: Lang) => void>();

export function useLang() {
  // Always initialize with a fixed default ("te") on both Server and Client initial render
  // to prevent Hydration Mismatch in TanStack Start.
  const [lang, setLangState] = useState<Lang>("te");

  useEffect(() => {
    // Once mounted on the client, sync with actual localStorage state
    const currentLang = loadProgress().lang;
    setLangState(currentLang);

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
