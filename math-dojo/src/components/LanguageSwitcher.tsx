import type { Locale } from "../types";
import { useLocale } from "../i18n/LocaleContext";
import styles from "./LanguageSwitcher.module.css";

const OPTIONS: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
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
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
