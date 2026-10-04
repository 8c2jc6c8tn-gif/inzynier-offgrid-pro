"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateKrzywaGrzewcza } from "@/lib/core/modules/ogrzewanie/krzywa-grzewcza/calculator"
import { COP_NA_STOPIEN_ZASILANIA } from "@/lib/core/modules/ogrzewanie/wplyw-czynnika/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type Pola = "tZewn1" | "tZewn2" | "tZasil1" | "tZasil2" | "tNowa1" | "tNowa2" | "tOceny" | "cop" | "cieplo"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { tZewn1: "", tZewn2: "", tZasil1: "", tZasil2: "", tNowa1: "", tNowa2: "", tOceny: "", cop: "", cieplo: "" }
const r1 = (x: number) => Math.round(x * 10) / 10
const n = (s: string) => liczba(s) ?? null
const r2 = (x: number) => Math.round(x * 100) / 100

/** Moduł 6, Część 2B — dokładka do Ekranu 5: krzywa grzewcza obecna vs proponowana (dawne 5.71). */
export function SekcjaKrzywaGrzewcza() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("cop-pompy-ciepla.krzywa-grzewcza", STAN_POCZATKOWY)
  const pole = (klucz: Pola, min: number | undefined = undefined) => ({
    type: "number",
    inputMode: "decimal" as const,
    min,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateKrzywaGrzewcza({
        tZewn1C: n(stan.tZewn1),
        tZewn2C: n(stan.tZewn2),
        tZasil1C: n(stan.tZasil1),
        tZasil2C: n(stan.tZasil2),
        tZasilNowa1C: n(stan.tNowa1),
        tZasilNowa2C: n(stan.tNowa2),
        tOcenyC: n(stan.tOceny),
        copObecny: liczba(stan.cop) ?? 0,
        cieploSezonKwh: liczba(stan.cieplo) ?? 0,
      }),
    [stan],
  )
  const v = result.value

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-KRZ-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-KRZ-OPIS")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-KRZ-T-ZEWN-1")} unit="°C" {...pole("tZewn1")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tZewn" />} />
        <Pole label={t("UI-M6D-KRZ-T-ZEWN-2")} unit="°C" {...pole("tZewn2")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tZewn" />} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-KRZ-ZASIL-1")} unit="°C" {...pole("tZasil1")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tZasil" />} />
        <Pole label={t("UI-M6D-KRZ-ZASIL-2")} unit="°C" {...pole("tZasil2")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tZasil" />} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-KRZ-NOWA-1")} unit="°C" {...pole("tNowa1")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tNowa" />} />
        <Pole label={t("UI-M6D-KRZ-NOWA-2")} unit="°C" {...pole("tNowa2")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tNowa" />} />
      </div>
      <Pole label={t("UI-M6D-KRZ-T-OCENY")} unit="°C" {...pole("tOceny")} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="tOceny" />} />
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-KRZ-COP")} {...pole("cop", 0)} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="cop" params={{ min: COP_NA_STOPIEN_ZASILANIA.min * 100, max: COP_NA_STOPIEN_ZASILANIA.max * 100 }} />} />
        <Pole label={t("UI-M6D-KRZ-CIEPLO")} unit="kWh" {...pole("cieplo", 0)} pomoc={<PomocPola ekran="m6d-krzywa-grzewcza" pole="cieplo" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-KRZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={result.status === "VALID_WITH_WARNINGS" ? "uwaga" : "ok"} etykieta={t("UI-M6D-KRZ-W-OK")}>
          <WynikGlowny>{t("UI-M6D-KRZ-WYNIK", { t: stan.tOceny, z: r1(v.zasilanieC), n: r2(v.nachylenie) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {v.zasilanieNoweC !== null && v.obnizenieK !== null && (
              <li>{t("UI-M6D-KRZ-NOWA", { z: r1(v.zasilanieNoweC), k: r1(v.obnizenieK), n: r2(v.nachylenieNowe ?? 0) })}</li>
            )}
            {v.copNowyMin !== null && v.copNowyMax !== null && <li>{t("UI-M6D-KRZ-COP-NOWY", { min: r2(v.copNowyMin), max: r2(v.copNowyMax) })}</li>}
            {v.oszczednoscMinKwh !== null && v.oszczednoscMaxKwh !== null && (
              <li>{t("UI-M6D-KRZ-OSZCZEDNOSC", { min: Math.round(v.oszczednoscMinKwh), max: Math.round(v.oszczednoscMaxKwh) })}</li>
            )}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </section>
  )
}
