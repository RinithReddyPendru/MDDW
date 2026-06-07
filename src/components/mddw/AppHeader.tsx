import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/mddw/useLang";
import { LANGS, type Lang } from "@/lib/mddw/translations";

interface Props {
  showBack?: boolean;
}

export function AppHeader({ showBack }: Props) {
  const { lang, setLang, t } = useLang();
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-xl px-4 py-3 flex items-center gap-2">
        {showBack ? (
          <Link
            to="/"
            className="inline-flex items-center justify-center min-h-11 min-w-11 -ml-2 rounded-full text-foreground hover:bg-muted"
            aria-label={t("back")}
          >
            ←
          </Link>
        ) : (
          <div className="text-2xl" aria-hidden>🌿</div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold leading-tight truncate">{t("appTitle")}</h1>
          <p className="text-[11px] text-muted-foreground leading-tight truncate">{t("appSubtitle")}</p>
        </div>
        <select
          aria-label={t("language")}
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="rounded-lg border border-border bg-card px-2 py-2 text-xs font-medium min-h-11"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
