"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, poziomOstrzezen } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateCwuPompaCiepla } from "@/lib/core/modules/ogrzewanie/cwu-pompa-ciepla/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type Pola = "tMax" | "cop" | "moc"
type Stan = Record<Pola, string>

const STAN_POCZATKOWY: Stan = { tMax: "", cop: "", moc: "" }
const r2 = (x: number) => Math.round(x * 100) / 100

type Props = {
  pojemnoscL: number
  tStartC: number | null
  tKoniecC: number | null
  mocGrzalkiKw: number
  mocPvKw: number
}

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 18: pompa ciepła w grzaniu C.W.U. i zyski z nadwyżki PV (dawne 5.30, 5.58).
 * Tank, temperatures, heater power and PV surplus come from the Screen 18 fields above, so they are not typed twice.
 */
export function SekcjaPompaCwu({ pojemnoscL, tStartC, tKoniecC, mocGrzalkiKw, mocPvKw }: Props) {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("grzalka-cwu.pompa-cwu", STAN_POCZATKOWY)
  const pole = (klucz: Pola, min?: number) => ({
    type: "number",
    inputMode: "decimal" as const,
    min,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const result = useMemo(
    () =>
      calculateCwuPompaCiepla({
        pojemnoscL,
        tStartC,
        tKoniecC,
        tMaxPompyC: liczba(stan.tMax) ?? null,
        copCwu: liczba(stan.cop) ?? 0,
        mocCieplnaPompyKw: liczba(stan.moc) ?? 0,
        mocGrzalkiKw,
        mocPvKw,
      }),
    [stan, pojemnoscL, tStartC, tKoniecC, mocGrzalkiKw, mocPvKw],
  )
  const v = result.value

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-CWP-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-CWP-OPIS")}</p>
      <Pole label={t("UI-M6D-CWP-TMAX")} unit="°C" {...pole("tMax")} pomoc={<PomocPola ekran="m6d-cwu-pompa-ciepla" pole="tMax" />} />
      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6D-CWP-COP")} {...pole("cop", 0)} pomoc={<PomocPola ekran="m6d-cwu-pompa-ciepla" pole="cop" />} />
        <Pole label={t("UI-M6D-CWP-MOC")} unit="kW" {...pole("moc", 0)} pomoc={<PomocPola ekran="m6d-cwu-pompa-ciepla" pole="moc" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-CWP-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={poziomOstrzezen(result.status)} etykieta={t("UI-M6D-CWP-W-OK")}>
          <WynikGlowny>{t("UI-M6D-CWP-WYNIK", { kwh: r2(v.energiaPompaKwh), h: r2(v.czasPompaH) })}</WynikGlowny>
          {v.cieploGrzalkaKwh > 0 && (
            <p className="mt-1 text-small">
              {v.czasGrzalkaH !== null
                ? t("UI-M6D-CWP-GRZALKA-CZAS", { kwh: r2(v.cieploGrzalkaKwh), h: r2(v.czasGrzalkaH) })
                : t("UI-M6D-CWP-GRZALKA", { kwh: r2(v.cieploGrzalkaKwh) })}
            </p>
          )}
          <p className="mt-1 text-small">
            {t("UI-M6D-CWP-POROWNANIE", { razem: r2(v.energiaRazemKwh), grzalka: r2(v.energiaSamaGrzalkaKwh), oszczednosc: r2(v.oszczednoscKwh) })}
          </p>
          <p className="mt-1 text-small">{t("UI-M6D-CWP-MOC-EL", { kw: r2(v.mocElektrycznaPompyKw) })}</p>
          {v.energiaZPvKwh !== null && v.energiaZBateriiKwh !== null && (
            <p className="mt-1 text-small">{t("UI-M6D-CWP-ZRODLA", { pv: r2(v.energiaZPvKwh), bat: r2(v.energiaZBateriiKwh) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </section>
  )
}
