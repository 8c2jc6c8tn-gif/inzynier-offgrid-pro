"use client"

import Link from "next/link"
import { useMemo } from "react"
import { calculateZasobnikCwu } from "@/lib/core/modules/ogrzewanie/zasobnik-cwu/calculator"
import { CWU_L_NA_OSOBE_ZRODLO_M6 } from "@/lib/core/modules/ogrzewanie/zapotrzebowanie-co-cwu/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type PolaLiczbowe =
  | "osoby"
  | "litrowNaOsobe"
  | "pojemnoscL"
  | "uaWK"
  | "uaPorownawczyWK"
  | "dlugoscCyrkulacjiM"
  | "strataRuryWmK"
  | "godzinCyrkulacji"
  | "mocPompyW"

type PolaTemperatur = "tZimnaC" | "tCwuC" | "tOtoczeniaC" | "tOtoczeniaRurC"

type FormularzStan = Record<PolaLiczbowe | PolaTemperatur, string> & { nieogrzewane: boolean }

const STAN_POCZATKOWY: FormularzStan = {
  osoby: "",
  litrowNaOsobe: String(CWU_L_NA_OSOBE_ZRODLO_M6),
  tZimnaC: "",
  tCwuC: "",
  pojemnoscL: "",
  uaWK: "",
  uaPorownawczyWK: "",
  tOtoczeniaC: "",
  nieogrzewane: false,
  dlugoscCyrkulacjiM: "",
  strataRuryWmK: "",
  tOtoczeniaRurC: "",
  godzinCyrkulacji: "",
  mocPompyW: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const temperatura = (s: string) => (s === "" ? null : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

export default function ZasobnikCwuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zasobnik-cwu", STAN_POCZATKOWY)
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
      calculateZasobnikCwu({
        osoby: liczba(stan.osoby),
        litrowNaOsobe: liczba(stan.litrowNaOsobe),
        tZimnaC: temperatura(stan.tZimnaC),
        tCwuC: temperatura(stan.tCwuC),
        pojemnoscL: liczba(stan.pojemnoscL),
        uaWK: liczba(stan.uaWK),
        uaPorownawczyWK: liczba(stan.uaPorownawczyWK),
        tOtoczeniaC: temperatura(stan.tOtoczeniaC),
        nieogrzewane: stan.nieogrzewane,
        dlugoscCyrkulacjiM: liczba(stan.dlugoscCyrkulacjiM),
        strataRuryWmK: liczba(stan.strataRuryWmK),
        tOtoczeniaRurC: temperatura(stan.tOtoczeniaRurC),
        godzinCyrkulacji: liczba(stan.godzinCyrkulacji),
        mocPompyW: liczba(stan.mocPompyW),
      }),
    [stan],
  )
  const v = result.value
  const uwaga = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zasobnik-cwu" />
      <NaglowekEkranu tytul={t("UI-M6-ZAS-TYTUL")} ekran="zasobnik-cwu" wynik={result}>
        {t("UI-M6-ZAS-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-ZAS-ZAPOTRZEBOWANIE")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ZAS-OSOBY")} {...pole("osoby")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="osoby" />} />
          <Pole label={t("UI-M6-ZAS-LITROW")} unit={t("UI-M6-J-L-OS-DOBE")} {...pole("litrowNaOsobe")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="litrow" />} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ZAS-T-ZIMNA")} unit="°C" {...poleT("tZimnaC")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="tZimna" />} />
          <Pole label={t("UI-M6-ZAS-T-CWU")} unit="°C" {...poleT("tCwuC")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="tCwu" />} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-ZAS-ZASOBNIK")}</legend>
        <Pole label={t("UI-M6-ZAS-POJEMNOSC")} unit="l" {...pole("pojemnoscL")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="pojemnosc" />} />
        <Pole label={t("UI-M6-ZAS-UA")} unit="W/K" {...pole("uaWK")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="ua" />} />
        <Pole label={t("UI-M6-ZAS-UA-POROWNAWCZY")} unit="W/K" {...pole("uaPorownawczyWK")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="uaPorownawczy" />} />
        <Pole label={t("UI-M6-ZAS-T-OTOCZENIA")} unit="°C" {...poleT("tOtoczeniaC")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="tOtoczenia" />} />
        <div className="flex items-center gap-2">
          <PoleCheckbox
            id="zasobnik-cwu-nieogrzewane"
            className="flex-1"
            label={t("UI-M6-ZAS-NIEOGRZEWANE")}
            checked={stan.nieogrzewane}
            onChange={(e) => setStan((prev) => ({ ...prev, nieogrzewane: e.target.checked }))}
          />
          <PomocPola ekran="zasobnik-cwu" pole="nieogrzewane" />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M6-ZAS-CYRKULACJA")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ZAS-DLUGOSC")} unit="m" {...pole("dlugoscCyrkulacjiM")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="dlugosc" />} />
          <Pole label={t("UI-M6-ZAS-STRATA-RURY")} unit="W/(m·K)" {...pole("strataRuryWmK")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="strataRury" />} />
        </div>
        <Pole label={t("UI-M6-ZAS-T-RUR")} unit="°C" {...poleT("tOtoczeniaRurC")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="tRur" />} />
        <div className="grid grid-cols-2 gap-3">
          <Pole label={t("UI-M6-ZAS-GODZIN")} unit={t("UI-M6-J-H-DOBE")} max={24} {...pole("godzinCyrkulacji")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="godzin" />} />
          <Pole label={t("UI-M6-ZAS-MOC-POMPY")} unit="W" {...pole("mocPompyW")} pomoc={<PomocPola ekran="zasobnik-cwu" pole="mocPompy" />} />
        </div>
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={uwaga ? "uwaga" : "ok"} etykieta={t(uwaga ? "UI-M6-ZAS-W-UWAGA" : "UI-M6-ZAS-W-OK")}>
          <WynikGlowny>{t("UI-M6-ZAS-WYNIK", { razem: r2(v.cieploRazemKwh), pct: Math.round(v.udzialStratPct) })}</WynikGlowny>
          <p className="mt-1 text-small">{t("UI-M6-ZAS-WODA", { l: Math.round(v.zapotrzebowanieL), kwh: r2(v.cieploWodyKwh) })}</p>
          <p className="mt-1 text-small">{t("UI-M6-ZAS-POSTOJ", { kwh: r2(v.strataPostojowaKwh), rok: Math.round(v.strataPostojowaKwh * 365) })}</p>
          {v.strataPorownawczaKwh !== null && v.oszczednoscRocznaKwh !== null && (
            <p className="mt-1 text-small">{t("UI-M6-ZAS-POROWNANIE", { kwh: r2(v.strataPorownawczaKwh), rok: Math.round(v.oszczednoscRocznaKwh) })}</p>
          )}
          {v.cyrkulacjaCiaglaKwh > 0 && (
            <p className="mt-1 text-small">
              {t("UI-M6-ZAS-CYRK", { cieplo: r2(v.cyrkulacjaCieploKwh), prad: r2(v.cyrkulacjaPradKwh), ciagla: r2(v.cyrkulacjaCiaglaKwh) })}
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}

      <div className="flex flex-col gap-2">
        <Link href="/kalkulatory/zapotrzebowanie-co-cwu" className="text-small underline">
          {t("UI-M6-ZAS-LINK-E2")}
        </Link>
        <Link href="/kalkulatory/pompy-cyrkulacyjne" className="text-small underline">
          {t("UI-M6-ZAS-LINK-E15")}
        </Link>
      </div>
    </main>
  )
}
