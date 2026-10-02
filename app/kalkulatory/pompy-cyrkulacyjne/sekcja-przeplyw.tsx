"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculatePrzeplywPompyCiepla, DT_ZRODLO_K } from "@/lib/core/modules/ogrzewanie/przeplyw-pompy-ciepla/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type Pola = "moc" | "dT" | "przeplyw" | "min"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { moc: "", dT: "", przeplyw: "", min: "" }
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2B — dokładka do Ekranu 15: przepływ przez pompę ciepła (dawne 5.65). */
export function SekcjaPrzeplyw() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("pompy-cyrkulacyjne.przeplyw", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const result = useMemo(
    () =>
      calculatePrzeplywPompyCiepla({
        mocPompyKw: liczba(stan.moc) ?? 0,
        dTK: liczba(stan.dT) ?? 0,
        przeplywPompyM3H: liczba(stan.przeplyw) ?? 0,
        minPrzeplywM3H: liczba(stan.min) ?? 0,
      }),
    [stan],
  )
  const v = result.value

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-PRZ-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-PRZ-OPIS")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-PRZ-MOC")} unit="kW" {...pole("moc")} pomoc={<PomocPola ekran="m6d-przeplyw-pompy-ciepla" pole="moc" />} />
        <Pole
          label={t("UI-M6D-PRZ-DT")}
          unit="K"
          {...pole("dT")}
          pomoc={<PomocPola ekran="m6d-przeplyw-pompy-ciepla" pole="dT" params={{ min: DT_ZRODLO_K.min, max: DT_ZRODLO_K.max }} />}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-PRZ-PRZEPLYW")} unit="m³/h" {...pole("przeplyw")} pomoc={<PomocPola ekran="m6d-przeplyw-pompy-ciepla" pole="przeplyw" />} />
        <Pole label={t("UI-M6D-PRZ-MIN")} unit="m³/h" {...pole("min")} pomoc={<PomocPola ekran="m6d-przeplyw-pompy-ciepla" pole="min" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-PRZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"} etykieta={t("UI-M6D-PRZ-W-OK")}>
          <WynikGlowny>{t("UI-M6D-PRZ-WYNIK", { m3h: r2(v.wymaganyM3H), lmin: r1(v.wymaganyLMin) })}</WynikGlowny>
          {v.rzeczywistyDTK !== null && <p className="mt-1 text-small">{t("UI-M6D-PRZ-RZECZYWISTE-DT", { dt: r1(v.rzeczywistyDTK) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </section>
  )
}
