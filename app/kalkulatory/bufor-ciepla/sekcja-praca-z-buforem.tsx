"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateBuforPracaPompy } from "@/lib/core/modules/ogrzewanie/bufor-praca-pompy/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type Pola = "obciazenie" | "woda" | "histereza" | "dTMagazyn" | "straty" | "dni"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { obciazenie: "", woda: "", histereza: "", dTMagazyn: "", straty: "", dni: "" }
const r0 = (x: number) => Math.round(x)
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 14: praca pompy z buforem i bez (dawne 5.28, 5.70). Pump power and buffer
 * volume come from the fields above (Screen 14), so they are not typed twice.
 */
export function SekcjaPracaZBuforem({ mocPompyKw, buforL }: { mocPompyKw: number; buforL: number }) {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("bufor-ciepla.praca-z-buforem", STAN_POCZATKOWY)
  const pole = (klucz: Pola) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateBuforPracaPompy({
        mocPompyKw,
        buforL,
        obciazenieKw: liczba(stan.obciazenie) ?? 0,
        wodaInstalacjiL: liczba(stan.woda) ?? 0,
        histerezaK: liczba(stan.histereza) ?? 0,
        dTMagazynK: liczba(stan.dTMagazyn) ?? 0,
        stratyPostojoweW: liczba(stan.straty) ?? 0,
        dniPracy: liczba(stan.dni) ?? 0,
      }),
    [stan, mocPompyKw, buforL],
  )
  const v = result.value

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-BPP-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-BPP-OPIS")}</p>
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-BPP-OBCIAZENIE")} unit="kW" {...pole("obciazenie")} pomoc={<PomocPola ekran="m6d-bufor-praca-pompy" pole="obciazenie" />} />
        <Pole label={t("UI-M6D-BPP-WODA")} unit="l" {...pole("woda")} pomoc={<PomocPola ekran="m6d-bufor-praca-pompy" pole="woda" />} />
      </div>
      <Pole label={t("UI-M6D-BPP-HISTEREZA")} unit="K" {...pole("histereza")} pomoc={<PomocPola ekran="m6d-bufor-praca-pompy" pole="histereza" />} />
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-BPP-DT-MAGAZYN")} unit="K" {...pole("dTMagazyn")} pomoc={<PomocPola ekran="m6d-bufor-praca-pompy" pole="dTMagazyn" />} />
        <Pole label={t("UI-M6D-BPP-STRATY")} unit="W" {...pole("straty")} pomoc={<PomocPola ekran="m6d-bufor-praca-pompy" pole="straty" />} />
      </div>
      <Pole label={t("UI-M6D-BPP-DNI")} unit={t("UI-M6D-J-DNI")} {...pole("dni")} pomoc={<PomocPola ekran="m6d-bufor-praca-pompy" pole="dni" />} />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-BPP-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6D-BPP-W-OK")}>
          {v.bez && v.z && (
            <>
              <WynikGlowny>{t("UI-M6D-BPP-WYNIK", { bez: r1(v.bez.startyDoba), z: r1(v.z.startyDoba) })}</WynikGlowny>
              <ul className="mt-2 flex flex-col gap-1 text-small">
                <li>{t("UI-M6D-BPP-CYKL-BEZ", { praca: r1(v.bez.pracaMin), postoj: r1(v.bez.postojMin) })}</li>
                <li>{t("UI-M6D-BPP-CYKL-Z", { praca: r1(v.z.pracaMin), postoj: r1(v.z.postojMin) })}</li>
              </ul>
            </>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {v.cieploMagazynKwh !== null && (
              <li>{t("UI-M6D-BPP-MAGAZYN", { kwh: r2(v.cieploMagazynKwh), h: r1(v.czasPokryciaH ?? 0) })}</li>
            )}
            {v.stratyDobaKwh !== null && <li>{t("UI-M6D-BPP-STRATY-DOBA", { kwh: r2(v.stratyDobaKwh) })}</li>}
            {v.stratySezonKwh !== null && <li>{t("UI-M6D-BPP-STRATY-SEZON", { kwh: r0(v.stratySezonKwh) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </section>
  )
}
