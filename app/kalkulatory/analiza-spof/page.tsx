"use client"

import { useMemo } from "react"
import { calculateAnalizaSpof } from "@/lib/core/modules/stress-test/analiza-spof/calculator"
import type { KomponentSystemu, TypKomponentu } from "@/lib/core/modules/stress-test/analiza-spof/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PomocPola } from "@/components/ui/pomoc"
import { useTranslate } from "@/lib/i18n/language-context"

type Wiersz = KomponentSystemu & { id: string }
type FormularzStan = { komponenty: Wiersz[] }

const STAN_POCZATKOWY: FormularzStan = { komponenty: [] }

const TYPY: { id: TypKomponentu; label: string }[] = [
  { id: "bms", label: "BMS" },
  { id: "falownik", label: "UI-ANASPO-FALOWNIK" },
  { id: "bezpiecznik-glowny", label: "UI-ANASPO-BEZPIECZNIK-GLOWNY" },
  { id: "mppt", label: "UI-ANASPO-REGULATOR-MPPT" },
  { id: "pompa-ciepla", label: "UI-ANASPO-POMPA-CIEPLA" },
  { id: "pompa", label: "UI-ANASPO-POMPA-WODA-OBIEG" },
  { id: "czujnik", label: "UI-ANASPO-CZUJNIK" },
  { id: "inne", label: "UI-ANASPO-INNE" },
]

const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function AnalizaSpofPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("analiza-spof", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<Wiersz>) {
    setStan((prev) => ({ komponenty: prev.komponenty.map((k) => (k.id === id ? { ...k, ...zmiana } : k)) }))
  }

  const result = useMemo(() => calculateAnalizaSpof({ komponenty: stan.komponenty }), [stan])
  const hasCritical = result.warnings.some((w) => w.level === "critical")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/analiza-spof" />
      <NaglowekEkranu tytul={t("UI-ANASPO-ANALIZA-SPOF-POJEDYNCZE")} ekran="analiza-spof" wynik={result}>
        {t("UI-ANASPO-JEDEN-ELEMENT-MOZE")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-ANASPO-KOMPONENTY-SYSTEMU")}</p>
        <p className="text-caption text-muted-foreground">
          {t("UI-ANASPO-ZAZNACZ-REDUNDANCJA-JESLI")}
        </p>
        <ul className="flex flex-col gap-3">
          {stan.komponenty.map((k, i) => {
            const opis = k.nazwa || `komponent ${i + 1}`
            return (
              <li key={k.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder={t("UI-ANASPO-NAZWA")}
                  value={k.nazwa}
                  onChange={(e) => aktualizuj(k.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-ANASPO-NAZWA-KOMPONENT", { p: i + 1 })}
                />
                <PomocPola ekran="analiza-spof" pole="nazwa" />
                <select
                  value={k.typ}
                  onChange={(e) => aktualizuj(k.id, { typ: e.target.value as TypKomponentu })}
                  className={pole}
                  aria-label={t("UI-ANASPO-TYP", { opis })}
                >
                  {TYPY.map((typ) => (
                    <option key={typ.id} value={typ.id}>
                      {t(typ.label)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="analiza-spof" pole="typ" />
                <label className="flex items-center gap-1 text-caption">
                  <input
                    type="checkbox"
                    checked={k.maRedundancje}
                    onChange={(e) => aktualizuj(k.id, { maRedundancje: e.target.checked })}
                    className="h-5 w-5 accent-primary"
                    aria-label={t("UI-ANASPO-REDUNDANCJA-2", { opis })}
                  />
                  {t("UI-ANASPO-REDUNDANCJA")}
                </label>
                <PomocPola ekran="analiza-spof" pole="redundancja" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ komponenty: prev.komponenty.filter((x) => x.id !== k.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-ANASPO-USUN-2", { opis })}
                >
                  {t("UI-ANASPO-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({ komponenty: [...prev.komponenty, { id: crypto.randomUUID(), nazwa: "", typ: "bms", maRedundancje: false }] }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-ANASPO-DODAJ-KOMPONENT")}
        </button>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-ANASPO-DODAJ-KOMPONENTY-SYSTEMU")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : result.value.liczbaSpof > 0 ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-ANASPO-KRYTYCZNY-POJEDYNCZY-PUNKT") : result.value.liczbaSpof > 0 ? t("UI-ANASPO-POJEDYNCZE-PUNKTY-AWARII") : t("UI-ANASPO-BRAK-POJEDYNCZYCH-PUNKTOW")}
        >
          <WynikGlowny>
            SPOF: {result.value.liczbaSpof} z {result.value.liczbaKomponentow}
          </WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
