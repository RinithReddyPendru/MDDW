import { useEffect, useState } from "react";
import { loadProgress, setLang as persistLang } from "./storage";
import { type Lang, t as tFn } from "./translations";

export function useLang() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(loadProgress().lang);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    persistLang(l);
  };

  const t = (k: Parameters<typeof tFn>[1]) => tFn(lang, k);
  return { lang, setLang, t };
}
