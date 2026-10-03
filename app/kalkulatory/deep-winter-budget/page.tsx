"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateDeepWinterBudget } from "@/lib/core/modules/stress-test/deep-winter-budget/calculator"
import { CELE_BUDZETU, type CelBudzetu } from "@/lib/core/modules/stress-test/deep-winter-budget/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola =
  | "dni"
  | "dzien"
  | "pv"
  | "agregat"
  | "magazyn"
  | "zuzycie"
  | "udzialOgrz"
  | "roznicaT"
type FormularzStan = Record<Pola, string> & {
  /** Per category: share of the plan [%] and consumption [kWh], both as text; a row with both empty is skipped. */
  celeUdzial: Record<CelBudzetu, string>
  celeZuzycie: Record<CelBudzetu, string>
}

const PUSTE_CELE = (): Record<CelBudzetu, string> => ({ ogrzewanie: "", cwu: "", pompy: "", oswietlenie: "", inne: "" })

const STAN_POCZATKOWY: FormularzStan = {
  dni: "",
  dzien: "",
  pv: "",
  agregat: "",
  magazyn: "",
  zuzycie: "",
  udzialOgrz: "",
  roznicaT: "",
  celeUdzial: PUSTE_CELE(),
  celeZuzycie: PUSTE_CELE(),
}

const NAZWY_CELOW: Record<CelBudzetu, string> = {
  ogrzewanie: "UI-M7-DWB-CEL-OGRZEWANIE",
  cwu: "UI-M7-DWB-CEL-CWU",
  pompy: "UI-M7-DWB-CEL-POMPY",
  oswietlenie: "UI-M7-DWB-CEL-OSWIETLENIE",
  inne: "UI-M7-DWB-CEL-INNE",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100
const procent = (x: number | null) => (x === null ? "—" : `${x > 0 ? "+" : ""}${r1(x)}%`)

export default function DeepWinterBudgetPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("deep-winter-budget", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const poleCelu = (grupa: "celeUdzial" | "celeZuzycie", cel: CelBudzetu) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[grupa]?.[cel] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setStan((prev) => ({ ...prev, [grupa]: { ...(prev[grupa] ?? PUSTE_CELE()), [cel]: e.target.value } })),
  })

  const result = useMemo(
    () =>
      calculateDeepWinterBudget({
        dniMiesiaca: liczba(stan.dni),
        biezacyDzien: liczba(stan.dzien),
        planPvKwh: liczba(stan.pv),
        planAgregatKwh: liczba(stan.agregat),
        planMagazynKwh: liczba(stan.magazyn),
        zuzycieNarastajaceKwh: liczba(stan.zuzycie),
        cele: CELE_BUDZETU.filter((c) => (stan.celeUdzial?.[c] ?? "") !== "" || (stan.celeZuzycie?.[c] ?? "") !== "").map((c) => ({
          cel: c,
          udzialPlanuPct: liczba(stan.celeUdzial?.[c] ?? ""),
          zuzycieKwh: liczba(stan.celeZuzycie?.[c] ?? ""),
        })),
        udzialOgrzewaniaPct: liczba(stan.udzialOgrz),
        roznicaTemperaturK: liczba(stan.roznicaT),
      }),
    [stan],
  )
  const v = result.value
  const krytyczne = result.warnings.some((w) => w.level === "critical")
  const uwaga = result.warnings.some((w) => w.level === "warning")
  const poziom = krytyczne ? "blad" : uwaga ? "uwaga" : "ok"
  const etykieta = krytyczne ? "UI-M7-DWB-W-BLAD" : uwaga ? "UI-M7-DWB-W-UWAGA" : "UI-M7-DWB-W-OK"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/deep-winter-budget" />
      <NaglowekEkranu tytul={t("UI-M7-DWB-TYTUL")} ekran="deep-winter-budget" wynik={result}>
        {t("UI-M7-DWB-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DWB-PLAN")}</legend>
        <Pole label={t("UI-M7-DWB-PLAN-PV")} unit="kWh" {...pole("pv")} pomoc={<PomocPola ekran="deep-winter-budget" pole="planPv" />} />
        <Pole label={t("UI-M7-DWB-PLAN-AGREGAT")} unit="kWh" {...pole("agregat")} pomoc={<PomocPola ekran="deep-winter-budget" pole="planAgregat" />} />
        <Pole label={t("UI-M7-DWB-PLAN-MAGAZYN")} unit="kWh" {...pole("magazyn")} pomoc={<PomocPola ekran="deep-winter-budget" pole="planMagazyn" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DWB-STAN")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-DWB-DNI")} unit="d" step={1} {...pole("dni")} pomoc={<PomocPola ekran="deep-winter-budget" pole="dniMiesiaca" />} />
          <Pole label={t("UI-M7-DWB-DZIEN")} unit="d" step={1} {...pole("dzien")} pomoc={<PomocPola ekran="deep-winter-budget" pole="biezacyDzien" />} />
        </div>
        <Pole label={t("UI-M7-DWB-ZUZYCIE")} unit="kWh" {...pole("zuzycie")} pomoc={<PomocPola ekran="deep-winter-budget" pole="zuzycie" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DWB-CELE")}</legend>
        <p className="text-small text-muted-foreground">{t("UI-M7-DWB-CELE-NOTATKA")}</p>
        {CELE_BUDZETU.map((c) => (
          <div key={c} className="flex flex-col gap-1">
            <span className="text-small font-medium">{t(NAZWY_CELOW[c])}</span>
            <div className="grid grid-cols-2 gap-3">
              <Pole label={t("UI-M7-DWB-CEL-UDZIAL")} unit="%" max={100} {...poleCelu("celeUdzial", c)} pomoc={<PomocPola ekran="deep-winter-budget" pole="celUdzial" />} />
              <Pole label={t("UI-M7-DWB-CEL-ZUZYCIE")} unit="kWh" {...poleCelu("celeZuzycie", c)} pomoc={<PomocPola ekran="deep-winter-budget" pole="celZuzycie" />} />
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M7-DWB-OGRZ")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M7-DWB-OGRZ-UDZIAL")} unit="%" max={100} {...pole("udzialOgrz")} pomoc={<PomocPola ekran="deep-winter-budget" pole="udzialOgrzewania" />} />
          <Pole label={t("UI-M7-DWB-OGRZ-DT")} unit="K" {...pole("roznicaT")} pomoc={<PomocPola ekran="deep-winter-budget" pole="roznicaTemperatur" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M7-DWB-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M7-DWB-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={t(etykieta)}>
          <WynikGlowny>{t("UI-M7-DWB-WYNIK", { kwh: r1(v.zostaloKwh), plan: r1(v.planKwh) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            <li>{t("UI-M7-DWB-L-DNI", { dni: v.dniDoKonca })}</li>
            <li>
              {t("UI-M7-DWB-L-BUDZET", {
                kwh: r1(v.budzetNarastajacyKwh),
                zuzycie: r1(liczba(stan.zuzycie)),
                odchylenie: procent(v.odchyleniePct),
              })}
            </li>
            <li>
              {v.tempoDopuszczalneKwhDzien === null
                ? t("UI-M7-DWB-L-TEMPO-KONIEC", { biezace: r2(v.tempoBiezaceKwhDzien) })
                : t("UI-M7-DWB-L-TEMPO", { biezace: r2(v.tempoBiezaceKwhDzien), dopuszczalne: r2(v.tempoDopuszczalneKwhDzien) })}
            </li>
            <li>{t("UI-M7-DWB-L-PROGNOZA", { kwh: r1(v.prognozaKoniecMiesiacaKwh) })}</li>
            {v.wymaganeOgraniczeniePct !== null && v.wymaganeOgraniczeniePct > 0 && (
              <li>{t("UI-M7-DWB-L-OGRANICZENIE", { pct: r1(v.wymaganeOgraniczeniePct) })}</li>
            )}
            {v.potrzebneObnizenieK !== null && <li>{t("UI-M7-DWB-L-K", { k: r1(v.potrzebneObnizenieK) })}</li>}
          </ul>
          {v.cele.length > 0 && (
            <div className="mt-3">
              <p className="text-small font-medium">{t("UI-M7-DWB-CELE-WYNIK")}</p>
              <ul className="mt-1 flex flex-col gap-1 text-small">
                {v.cele.map((c) => (
                  <li key={c.cel}>
                    {t(c.odchyleniePct === null ? "UI-M7-DWB-CEL-BRAK-BUDZETU" : c.ponadBudzet ? "UI-M7-DWB-CEL-WIERSZ-PONAD" : "UI-M7-DWB-CEL-WIERSZ", {
                      cel: t(NAZWY_CELOW[c.cel]),
                      zuzycie: r1(c.zuzycieKwh),
                      budzet: r1(c.budzetNarastajacyKwh),
                      odchylenie: procent(c.odchyleniePct),
                    })}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/deficyty-miesieczne" className="text-small underline">
        {t("UI-M7-DWB-LINK-E2")}
      </Link>
    </main>
  )
}
