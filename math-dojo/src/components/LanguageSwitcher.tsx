import type { Locale } from "../types";
import { useLocale } from "../i18n/LocaleContext";
import styles from "./LanguageSwitcher.module.css";

const OPTIONS: { code: Locale; label: string; flag: string; name: string }[] = [
  { code: "en", label: "EN", flag: "🇺🇸", name: "English" },
  { code: "pt", label: "PT", flag: "🇧🇷", name: "Português" },
  { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          className={[styles.option, locale === opt.code ? styles.optionActive : ""].join(" ")}
          onClick={() => setLocale(opt.code)}
          aria-label={opt.name}
          title={opt.name}
        >
          <span className={styles.flag} aria-hidden="true">
            {opt.flag}
          </span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
