"use client"

/**
 * Suggestion of the system voltage chosen once in Settings → Type of site (owner decision 11.10.2026). It sits next to a screen's own
 * voltage field and only offers the value: the field is never filled silently, so the screen still shows exactly what the user typed.
 * Renders nothing when the site is not a micro-installation, no voltage is chosen, the field already holds that value, or (for a
 * list-of-voltages field) the chosen voltage is not one of the voltages the field offers (`dozwolone`).
 */
import { useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { KLUCZ_PROFILU_OBIEKTU, napiecieUkladuDoPodpowiedzi, type ProfilObiektu } from "@/lib/obiekt/profil-obiektu"

type Props = {
  /** What the screen's voltage field holds now (text as typed). */
  aktualne: string
  onUzyj: (napiecieV: string) => void
  /** Voltages the screen's field offers (a select with a fixed list); omitted = any value fits (a number field). */
  dozwolone?: readonly number[]
}

export function NapiecieZProfilu({ aktualne, onUzyj, dozwolone }: Props) {
  const t = useTranslate()
  const { dane } = useOdczytDraftu<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU)
  const v = napiecieUkladuDoPodpowiedzi(dane)
  if (v === null || (dozwolone && !dozwolone.includes(v)) || Number(aktualne.trim().replace(",", ".")) === v) return null
  return (
    <p className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
      {t("UI-OBIEKT-NAPIECIE-PODPOWIEDZ", { v })}
      <button type="button" onClick={() => onUzyj(String(v))} className="min-h-11 rounded-md border px-3 text-small font-medium hover:bg-muted">
        {t("UI-OBIEKT-NAPIECIE-UZYJ", { v })}
      </button>
    </p>
  )
}
