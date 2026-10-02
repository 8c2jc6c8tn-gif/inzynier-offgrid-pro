"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateNagrzewnicaPowietrza } from "@/lib/core/modules/ogrzewanie/nagrzewnica-powietrza/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type Pola =
  | "moc"
  | "zuzycie"
  | "cenaPaliwa"
  | "pobor"
  | "rozruch"
  | "rozruchy"
  | "cenaPradu"
  | "cop"
  | "zapotrzebowanie"
  | "dni"
  | "bateria"
type FormularzStan = Record<Pola, string>

const STAN_POCZATKOWY: FormularzStan = {
  moc: "",
  zuzycie: "",
  cenaPaliwa: "",
  pobor: "",
  rozruch: "",
  rozruchy: "",
  cenaPradu: "",
  cop: "",
  zapotrzebowanie: "",
  dni: "",
  bateria: "",
}

/** Heater datasheet fields, then the electric side — every unit through UI-J-* / plain symbols. */
const POLA_NAGRZEWNICY: { pole: Pola; label: string; unit: string }[] = [
  { pole: "moc", label: "UI-NP-MOC", unit: "kW" },
  { pole: "zuzycie", label: "UI-NP-ZUZYCIE", unit: "l/h" },
  { pole: "cenaPaliwa", label: "UI-NP-CENA-PALIWA", unit: "UI-J-ZL-L" },
  { pole: "pobor", label: "UI-NP-POBOR", unit: "W" },
  { pole: "rozruch", label: "UI-NP-ROZRUCH", unit: "Wh" },
  { pole: "rozruchy", label: "UI-NP-ROZRUCHY", unit: "UI-NP-J-ROZRUCHY" },
]
const POLA_PRADU: { pole: Pola; label: string; unit: string }[] = [
  { pole: "cenaPradu", label: "UI-NP-CENA-PRADU", unit: "UI-J-ZL-KWH" },
  { pole: "cop", label: "UI-NP-COP", unit: "" },
  { pole: "zapotrzebowanie", label: "UI-NP-ZAPOTRZEBOWANIE", unit: "kWh" },
  { pole: "dni", label: "UI-NP-DNI", unit: "UI-J-DNI" },
  { pole: "bateria", label: "UI-NP-BATERIA", unit: "kWh" },
]

const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaPaliwa", "cenaPradu")

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100
const r3 = (x: number) => Math.round(x * 1000) / 1000

export default function NagrzewnicaPowietrzaPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("nagrzewnica-powietrza", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const result = useMemo(
    () =>
      calculateNagrzewnicaPowietrza({
        mocCieplnaKw: liczba(stan.moc),
        zuzyciePaliwaLH: liczba(stan.zuzycie),
        cenaPaliwaZlL: liczba(stan.cenaPaliwa),
        poborPraduW: liczba(stan.pobor),
        energiaRozruchuWh: liczba(stan.rozruch),
        rozruchyNaDobe: liczba(stan.rozruchy),
        cenaPraduZlKwh: liczba(stan.cenaPradu),
        copElektryczne: liczba(stan.cop),
        zapotrzebowanieCieplaDobaKwh: liczba(stan.zapotrzebowanie),
        dniOgrzewania: liczba(stan.dni),
        pojemnoscBateriiKwh: liczba(stan.bateria),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  const pola = (lista: { pole: Pola; label: string; unit: string }[]) =>
    lista.map(({ pole, label, unit }) => (
      <Pole
        key={pole}
        label={t(label)}
        unit={unit.startsWith("UI-") ? t(unit) : unit || undefined}
        type="number"
        inputMode="decimal"
        min={0}
        value={stan[pole]}
        onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
        pomoc={<PomocPola ekran="nagrzewnica-powietrza" pole={pole} />}
      />
    ))

  const taniejKlucz = v?.taniej === "nagrzewnica" ? "UI-NP-TANIEJ-NAGRZEWNICA" : v?.taniej === "elektryczne" ? "UI-NP-TANIEJ-PRAD" : "UI-NP-TANIEJ-ROWNO"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/nagrzewnica-powietrza" />
      <NaglowekEkranu tytul={t("UI-NP-TYTUL")} ekran="nagrzewnica-powietrza" wynik={result}>
        {t("UI-NP-OPIS")}
      </NaglowekEkranu>

      <PrzeliczoneInfo info={info} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-NP-NAGRZEWNICA")}</legend>
        {pola(POLA_NAGRZEWNICY)}
      </fieldset>
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-NP-PRAD")}</legend>
        {pola(POLA_PRADU)}
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-NP-BLAD")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" || !v ? (
        <p className="text-small text-muted-foreground">{t("UI-NP-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-NP-W-UWAGA" : "UI-NP-W-OK")}>
          <WynikGlowny>
            {v.kosztCieplaElektrycznegoZlKwh === null
              ? t("UI-NP-WYNIK-NAGRZEWNICA", { zl: r2(v.kosztCieplaNagrzewnicaZlKwh) })
              : t("UI-NP-WYNIK-RAZEM", {
                  nagrz: r2(v.kosztCieplaNagrzewnicaZlKwh),
                  prad: r2(v.kosztCieplaElektrycznegoZlKwh),
                  taniej: t(taniejKlucz),
                })}
          </WynikGlowny>

          <div className="mt-3 flex flex-col gap-1 text-small">
            <p>{t("UI-NP-RZAD-PALIWO", { l: r3(v.paliwoNaKwhCieplaL), zl: r2(v.kosztPaliwaNaKwhCieplaZl) })}</p>
            {v.kosztPraduPomocniczegoNaKwhZl !== null && (
              <p>
                {t("UI-NP-RZAD-PRAD-WLASNY", {
                  kwh: r3(v.pradPomocniczyNaKwhCieplaKwh),
                  zl: r3(v.kosztPraduPomocniczegoNaKwhZl),
                })}
              </p>
            )}
            {v.oszczednoscNaKwhZl !== null && v.taniej !== "rowno" && (
              <p>
                {t("UI-NP-RZAD-OSZCZEDNOSC", { zl: r2(Math.abs(v.oszczednoscNaKwhZl)), kto: t(taniejKlucz) })}
              </p>
            )}
            {v.kosztCieplaElektrycznegoZlKwh !== null &&
              (v.cenaPraduRownowagiZlKwh !== null ? (
                <p>{t("UI-NP-RZAD-ROWNOWAGA", { zl: r2(v.cenaPraduRownowagiZlKwh) })}</p>
              ) : (
                <p>{t("UI-NP-RZAD-BRAK-ROWNOWAGI")}</p>
              ))}
          </div>

          {v.doba && (
            <div className="mt-3 flex flex-col gap-1 text-small">
              <p className="font-medium">{t("UI-NP-DOBA-TYTUL")}</p>
              <p>
                {t("UI-NP-DOBA-PRACA", { godziny: r1(v.doba.godzinyPracy), litry: r1(v.doba.paliwoL), zl: r2(v.doba.kosztPaliwaZl) })}
              </p>
              <p>{t("UI-NP-DOBA-PRAD", { wh: Math.round(v.doba.energiaPomocniczaWh) })}</p>
              {v.doba.procentBateriiNagrzewnica !== null && v.doba.procentBateriiElektrycznie !== null ? (
                <p>
                  {t("UI-NP-DOBA-BATERIA", {
                    proc: r1(v.doba.procentBateriiNagrzewnica),
                    procPrad: r1(v.doba.procentBateriiElektrycznie),
                    kwh: r1(v.doba.energiaElektrycznaKwh),
                  })}
                </p>
              ) : (
                <p>{t("UI-NP-DOBA-BEZ-BATERII", { kwh: r1(v.doba.energiaElektrycznaKwh) })}</p>
              )}
              {v.doba.kosztNagrzewnicaZl !== null && v.doba.kosztElektrycznieZl !== null && (
                <p>{t("UI-NP-DOBA-KOSZT", { nagrz: r2(v.doba.kosztNagrzewnicaZl), prad: r2(v.doba.kosztElektrycznieZl) })}</p>
              )}
              {v.sezon && v.sezon.kosztNagrzewnicaZl !== null && v.sezon.kosztElektrycznieZl !== null && (
                <p>
                  {t("UI-NP-SEZON", {
                    dni: v.sezon.dni,
                    litry: Math.round(v.sezon.paliwoL),
                    nagrz: Math.round(v.sezon.kosztNagrzewnicaZl),
                    prad: Math.round(v.sezon.kosztElektrycznieZl),
                  })}
                </p>
              )}
            </div>
          )}

          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}

      <Link href="/kalkulatory/koszty-ogrzewania" className="text-small underline">
        {t("UI-NP-LINK-KOSZTY")}
      </Link>
    </main>
  )
}
