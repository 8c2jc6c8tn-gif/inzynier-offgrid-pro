"use client"

import { useMemo } from "react"
import { calculateBezRekuperacji } from "@/lib/core/modules/stress-test/bez-rekuperacji/calculator"
import type { BezRekuperacjiInput } from "@/lib/core/modules/stress-test/bez-rekuperacji/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = Record<keyof BezRekuperacjiInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  strumienM3H: "",
  sprawnoscOdzyskuPct: "",
  tempWewnC: "20",
  tempZewnC: "",
  tempZamarzaniaWymiennikaC: "",
  tempZaNagrzewnicaC: "",
}

const POLA: { pole: keyof BezRekuperacjiInput; label: string; unit: string }[] = [
  { pole: "strumienM3H", label: "UI-BEZREK-WYDAJNOSC-CENTRALI", unit: "m³/h" },
  { pole: "sprawnoscOdzyskuPct", label: "UI-BEZREK-SPRAWNOSC-ODZYSKU", unit: "%" },
  { pole: "tempWewnC", label: "UI-BEZREK-TEMPERATURA-WEWNATRZ", unit: "°C" },
  { pole: "tempZewnC", label: "UI-BEZREK-NAJNIZSZA-TEMPERATURA-ZEWNAT", unit: "°C" },
  { pole: "tempZamarzaniaWymiennikaC", label: "UI-BEZREK-GRANICA-ZAMARZANIA-WYMIENNIK", unit: "°C" },
  { pole: "tempZaNagrzewnicaC", label: "UI-BEZREK-TEMPERATURA-NAGRZEWNICA-WSTE", unit: "°C" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))
const f2 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 2 })
const f0 = (x: number) => x.toLocaleString("pl-PL", { maximumFractionDigits: 0 })

export default function BezRekuperacjiPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("bez-rekuperacji", STAN_POCZATKOWY)
  const result = useMemo(
    () => calculateBezRekuperacji(Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as BezRekuperacjiInput),
    [stan],
  )
  const { dodatkowaStrataKw, dodatkowaEnergiaKwhDoba, mocNagrzewnicyW } = result.value
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/bez-rekuperacji" />
      <NaglowekEkranu tytul={t("UI-BEZREK-REKUPERACJA-ZAMARZLA")} ekran="bez-rekuperacji" wynik={result}>
        {t("UI-BEZREK-WENTYLACJA-PLUCA-DOMU")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit}
            type="number"
            inputMode="decimal"
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="bez-rekuperacji" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-BEZREK-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-BEZREK-WPISZ-WYDAJNOSC-SPRAWNOSC")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={hasWarning ? t("UI-BEZREK-WYMIENNIK-MOZE-ZAMARZNAC") : t("UI-BEZREK-SKUTKI-PRACY-BEZ")}>
          {dodatkowaStrataKw !== null && <WynikGlowny>{t("UI-BEZREK-STRAT-BEZ-ODZYSKU", { dodatkowaStrataKw: f2(dodatkowaStrataKw) })}</WynikGlowny>}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {dodatkowaEnergiaKwhDoba !== null && <li>{t("UI-BEZREK-DOBE-KWH-CIEPLA", { dodatkowaEnergiaKwhDoba: f2(dodatkowaEnergiaKwhDoba) })}</li>}
            {mocNagrzewnicyW !== null && <li>{t("UI-BEZREK-NAGRZEWNICA-WSTEPNA", { mocNagrzewnicyW: f0(mocNagrzewnicyW) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
