"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateWentylacjaPorownanie } from "@/lib/core/modules/ogrzewanie/wentylacja-porownanie/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe =
  | "strumienNaturalnyM3H"
  | "strumienMechanicznyM3H"
  | "sprawnoscOdzyskuPct"
  | "mocWentylatorowW"
  | "copOgrzewania"
  | "dniSezonu"
  | "cenaPraduZlKwh"
  | "doplataZl"
type PolaTemperatur = "tWewC" | "tZewnC"

type FormularzStan = Record<PolaLiczbowe | PolaTemperatur, string> & { szczelnyDom: boolean }

const STAN_POCZATKOWY: FormularzStan = {
  tWewC: "",
  tZewnC: "",
  strumienNaturalnyM3H: "",
  szczelnyDom: false,
  strumienMechanicznyM3H: "",
  sprawnoscOdzyskuPct: "",
  mocWentylatorowW: "",
  copOgrzewania: "",
  dniSezonu: "",
  cenaPraduZlKwh: "",
  doplataZl: "",
}

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaPraduZlKwh", "doplataZl")

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temperatura = (s: string) => (s === "" ? null : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function WentylacjaPorownaniePage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("wentylacja-porownanie", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const pole = (klucz: PolaLiczbowe) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })
  const poleT = (klucz: PolaTemperatur) => ({
    type: "number",
    inputMode: "decimal" as const,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateWentylacjaPorownanie({
        tWewC: temperatura(stan.tWewC),
        tZewnC: temperatura(stan.tZewnC),
        strumienNaturalnyM3H: liczba(stan.strumienNaturalnyM3H),
        strumienMechanicznyM3H: liczba(stan.strumienMechanicznyM3H),
        sprawnoscOdzyskuPct: liczba(stan.sprawnoscOdzyskuPct),
        mocWentylatorowW: liczba(stan.mocWentylatorowW),
        copOgrzewania: liczba(stan.copOgrzewania),
        dniSezonu: liczba(stan.dniSezonu),
        cenaPraduZlKwh: liczba(stan.cenaPraduZlKwh),
        doplataZl: liczba(stan.doplataZl),
        szczelnyDom: stan.szczelnyDom,
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wentylacja-porownanie" />
      <NaglowekEkranu tytul={t("UI-M6-WPOR-TYTUL")} ekran="wentylacja-porownanie" wynik={result}>
        {t("UI-M6-WPOR-OPIS")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <div className="grid grid-cols-2 gap-3">
        <Pole label={t("UI-M6-WPOR-T-WEW")} unit="°C" {...poleT("tWewC")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="tWew" />} />
        <Pole label={t("UI-M6-WPOR-T-ZEWN")} unit="°C" {...poleT("tZewnC")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="tZewn" />} />
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-WPOR-NATURALNA")}</legend>
        <Pole label={t("UI-M6-WPOR-STRUMIEN-NAT")} unit="m³/h" {...pole("strumienNaturalnyM3H")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="strumienNat" />} />
        <div className="flex items-center gap-2">
          <PoleCheckbox
            id="wentylacja-porownanie-szczelny"
            className="flex-1"
            label={t("UI-M6-WPOR-SZCZELNY")}
            checked={stan.szczelnyDom}
            onChange={(e) => setStan((prev) => ({ ...prev, szczelnyDom: e.target.checked }))}
          />
          <PomocPola ekran="wentylacja-porownanie" pole="szczelny" />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-WPOR-MECHANICZNA")}</legend>
        <Pole label={t("UI-M6-WPOR-STRUMIEN-MECH")} unit="m³/h" {...pole("strumienMechanicznyM3H")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="strumienMech" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-WPOR-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscOdzyskuPct")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="sprawnosc" />} />
          <Pole label={t("UI-M6-WPOR-WENTYLATORY")} unit="W" {...pole("mocWentylatorowW")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="wentylatory" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-WPOR-BILANS")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-WPOR-COP")} {...pole("copOgrzewania")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="cop" />} />
          <Pole label={t("UI-M6-WPOR-DNI")} max={366} {...pole("dniSezonu")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="dni" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-WPOR-CENA")} unit={t("UI-J-ZL-KWH")} {...pole("cenaPraduZlKwh")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="cena" />} />
          <Pole label={t("UI-M6-WPOR-DOPLATA")} unit={t("UI-J-ZL")} {...pole("doplataZl")} pomoc={<PomocPola ekran="wentylacja-porownanie" pole="doplata" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-WPOR-W-UWAGA" : "UI-M6-WPOR-W-OK")}>
          <WynikGlowny>
            {v.oszczednoscNettoKwh !== null
              ? t("UI-M6-WPOR-WYNIK-NETTO", { netto: r2(v.oszczednoscNettoKwh) })
              : t("UI-M6-WPOR-WYNIK-CIEPLO", { kwh: r2(v.oszczednoscCieplaKwh) })}
          </WynikGlowny>
          {v.oszczednoscSezonKwh !== null && <p className="mt-1 text-small">{t("UI-M6-WPOR-SEZON", { kwh: Math.round(v.oszczednoscSezonKwh) })}</p>}
          {v.oszczednoscZl !== null && <p className="mt-1 text-small">{t("UI-M6-WPOR-ZL", { zl: Math.round(v.oszczednoscZl) })}</p>}
          {v.zwrotLat !== null && <p className="mt-1 text-small">{t("UI-M6-WPOR-ZWROT", { lat: r1(v.zwrotLat) })}</p>}
          <table className="mt-3 w-full text-small">
            <thead>
              <tr className="text-left">
                <th className="font-medium">{t("UI-M6-WPOR-KRYTERIUM")}</th>
                <th className="font-medium">{t("UI-M6-WPOR-K-NATURALNA")}</th>
                <th className="font-medium">{t("UI-M6-WPOR-K-MECHANICZNA")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("UI-M6-WPOR-K-STRATY")}</td>
                <td>{r2(v.stratyNaturalnaKwh)}</td>
                <td>{r2(v.stratyMechanicznaKwh)}</td>
              </tr>
              <tr>
                <td>{t("UI-M6-WPOR-K-PRAD")}</td>
                <td>0</td>
                <td>{r2(v.pradWentylatorowKwh)}</td>
              </tr>
              <tr>
                <td>{t("UI-M6-WPOR-K-WILGOC")}</td>
                <td>{t("UI-M6-WPOR-BRAK")}</td>
                <td>{t("UI-TAK")}</td>
              </tr>
              <tr>
                <td>{t("UI-M6-WPOR-K-KOSZT")}</td>
                <td>{t("UI-M6-WPOR-NISKI")}</td>
                <td>{t("UI-M6-WPOR-WYZSZY")}</td>
              </tr>
            </tbody>
          </table>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/wentylacja-odzysk-ciepla" className="text-small underline">
          {t("UI-M6-WPOR-LINK-E3")}
        </Link>
        <Link href="/kalkulatory/infiltracja-powietrza" className="text-small underline">
          {t("UI-M6-WPOR-LINK-E12")}
        </Link>
      </div>
    </main>
  )
}
