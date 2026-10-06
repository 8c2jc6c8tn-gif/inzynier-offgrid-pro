"use client"

import { useMemo } from "react"
import { calculateElektronikaWMrozie } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/calculator"
import { jestKrytyczny } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/constants"
import type { TypElektroniki, UrzadzenieElektroniczne } from "@/lib/core/modules/stress-test/elektronika-w-mrozie/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  temperaturaMiejscaC: string
  urzadzenia: UrzadzenieElektroniczne[]
}

const STAN_POCZATKOWY: FormularzStan = { temperaturaMiejscaC: "", urzadzenia: [] }

const TYPY: { id: TypElektroniki; label: string }[] = [
  { id: "BMS", label: "BMS" },
  { id: "przetwornica", label: "UI-ELEWMRO-PRZETWORNICA-FALOWNIK" },
  { id: "wyswietlacz", label: "UI-ELEWMRO-WYSWIETLACZ-LCD" },
  { id: "czujnik", label: "UI-ELEWMRO-CZUJNIK" },
  { id: "regulator", label: "UI-ELEWMRO-REGULATOR-LADOWANIA-MPPT" },
  { id: "inne", label: "UI-ELEWMRO-INNE" },
]

const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 1 })
const pole = "min-h-10 rounded-md border border-input bg-background px-2"

export default function ElektronikaWMroziePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("elektronika-w-mrozie", STAN_POCZATKOWY)

  function aktualizuj(id: string, zmiana: Partial<UrzadzenieElektroniczne>) {
    setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.map((u) => (u.id === id ? { ...u, ...zmiana } : u)) }))
  }

  const result = useMemo(
    () =>
      calculateElektronikaWMrozie({
        temperaturaMiejscaC: stan.temperaturaMiejscaC === "" ? null : Number(stan.temperaturaMiejscaC),
        urzadzenia: stan.urzadzenia,
      }),
    [stan],
  )
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/elektronika-w-mrozie" />
      <NaglowekEkranu tytul={t("UI-ELEWMRO-ELEKTRONIKA-MROZIE")} ekran="elektronika-w-mrozie" wynik={result}>
        {t("UI-ELEWMRO-KTORE-URZADZENIA-PRZESTANA")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-ELEWMRO-NAJNIZSZA-TEMPERATURA-MIEJSC")}
        unit="°C"
        type="number"
        inputMode="decimal"
        value={stan.temperaturaMiejscaC}
        onChange={(e) => setStan((prev) => ({ ...prev, temperaturaMiejscaC: e.target.value }))}
        pomoc={<PomocPola ekran="elektronika-w-mrozie" pole="temp" />}
      />

      <div className="flex flex-col gap-2">
        <p className="text-small font-medium">{t("UI-ELEWMRO-URZADZENIA-TYM-MIEJSCU")}</p>
        <p className="text-caption text-muted-foreground">
          {t("UI-ELEWMRO-MINIMALNA-TEMPERATURE-PRACY")}
        </p>
        <ul className="flex flex-col gap-3">
          {stan.urzadzenia.map((u, i) => {
            const opis = u.nazwa || t("UI-ELEWMRO-URZADZENIE", { p: i + 1 })
            return (
              <li key={u.id} className="flex flex-wrap items-center gap-2">
                <input
                  placeholder={t("UI-ELEWMRO-NAZWA")}
                  value={u.nazwa}
                  onChange={(e) => aktualizuj(u.id, { nazwa: e.target.value })}
                  className={`${pole} min-w-24 flex-1`}
                  aria-label={t("UI-ELEWMRO-NAZWA-URZADZENIE", { p: i + 1 })}
                />
                <PomocPola ekran="elektronika-w-mrozie" pole="nazwa" />
                <select
                  value={u.typ}
                  onChange={(e) => aktualizuj(u.id, { typ: e.target.value as TypElektroniki })}
                  className={pole}
                  aria-label={t("UI-ELEWMRO-TYP", { opis })}
                >
                  {TYPY.map((typ) => (
                    <option key={typ.id} value={typ.id}>
                      {t(typ.label)}
                    </option>
                  ))}
                </select>
                <PomocPola ekran="elektronika-w-mrozie" pole="typ" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder={t("UI-ELEWMRO-MIN-C")}
                  value={u.minTempPracyC ?? ""}
                  onChange={(e) => aktualizuj(u.id, { minTempPracyC: e.target.value === "" ? null : Number(e.target.value) })}
                  className={`${pole} w-24`}
                  aria-label={t("UI-ELEWMRO-MINIMALNA-TEMPERATURA-PRACY", { opis })}
                />
                <PomocPola ekran="elektronika-w-mrozie" pole="tempMin" />
                <button
                  type="button"
                  onClick={() => setStan((prev) => ({ ...prev, urzadzenia: prev.urzadzenia.filter((x) => x.id !== u.id) }))}
                  className="text-caption text-muted-foreground underline"
                  aria-label={t("UI-ELEWMRO-USUN-2", { opis })}
                >
                  {t("UI-ELEWMRO-USUN")}
                </button>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            setStan((prev) => ({
              ...prev,
              urzadzenia: [...prev.urzadzenia, { id: crypto.randomUUID(), nazwa: "", typ: "BMS", minTempPracyC: null }],
            }))
          }
          className="min-h-11 self-start rounded-md border px-4 text-small font-medium hover:bg-muted"
        >
          {t("UI-ELEWMRO-DODAJ-URZADZENIE")}
        </button>
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-ELEWMRO-WPISZ-TEMPERATURE-DODAJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-ELEWMRO-BMS-WYSTARTUJE-TYM") : hasWarning ? t("UI-ELEWMRO-CZESC-SPRZETU-POZA") : t("UI-ELEWMRO-SPRZET-PRACUJE-ZAKRESIE")}
        >
          <WynikGlowny>
            {t("UI-ELEWMRO-PONIZEJ-MINIMUM", { liczbaPonizejMin: result.value.liczbaPonizejMin, length: result.value.oceny.length })}
          </WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {result.value.oceny.map((o) => (
              <li key={o.id}>
                {o.zapasK === null ? "ℹ️" : o.zapasK < 0 ? (jestKrytyczny(o.typ) ? "🔴" : "🟡") : "✅"} {o.nazwa || t("UI-ELEWMRO-URZADZENIE", { p: o.nr })}
                {o.zapasK === null ? ` ${t("UI-ELEWMRO-BRAK-DANYCH-KARTY")}` : ` ${t("UI-ELEWMRO-ZAPAS", { zapasK: f0(o.zapasK) })}`}
              </li>
            ))}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
