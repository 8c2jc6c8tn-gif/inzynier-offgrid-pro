"use client"

import { useMemo } from "react"
import { calculateOchronaPrzepieciowaSpd } from "@/lib/core/modules/okablowanie/ochrona-przepieciowa-spd/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { SekcjaCrl } from "./sekcja-crl"
import { MIN_ODLEGLOSC_OD_ZWODU_M, WSPOLCZYNNIK_MARGINESU_UC } from "@/lib/core/modules/okablowanie/ochrona-przepieciowa-spd/constants"
import { useTranslate } from "@/lib/i18n/language-context"
import { PolaBudynkuUkryteInfo } from "@/components/pola-budynku-ukryte-info"
import { czyUkryjPolaBudynku } from "@/lib/obiekt/ukrywanie-dla-kampera"
import { useRodzajObiektu } from "@/lib/obiekt/use-rodzaj-obiektu"

type FormularzStan = {
  vocMaxStringuV: string
  maInstalacjeOdgromowa: boolean
  odlegloscOdZwoduM: string
  maZainstalowanySpdTyp1: boolean
  ucSpdV: string
  uziemienieViaGsw: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  vocMaxStringuV: "",
  maInstalacjeOdgromowa: false,
  odlegloscOdZwoduM: "",
  maZainstalowanySpdTyp1: false,
  ucSpdV: "",
  uziemienieViaGsw: false,
}

export default function OchronaPrzepieciowaSpdPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-przepieciowa-spd", STAN_POCZATKOWY)
  const { vocMaxStringuV, odlegloscOdZwoduM, ucSpdV, uziemienieViaGsw } = stan
  // A camper has no building and no lightning rod: the three building fields are hidden and count as "no lightning protection".
  const ukryjPolaBudynku = czyUkryjPolaBudynku(useRodzajObiektu())
  const maInstalacjeOdgromowa = !ukryjPolaBudynku && stan.maInstalacjeOdgromowa
  const maZainstalowanySpdTyp1 = !ukryjPolaBudynku && stan.maZainstalowanySpdTyp1

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setVocMaxStringuV = (a: string | ((p: string) => string)) => setPole("vocMaxStringuV", a)
  const setMaInstalacjeOdgromowa = (a: boolean | ((p: boolean) => boolean)) => setPole("maInstalacjeOdgromowa", a)
  const setOdlegloscOdZwoduM = (a: string | ((p: string) => string)) => setPole("odlegloscOdZwoduM", a)
  const setMaZainstalowanySpdTyp1 = (a: boolean | ((p: boolean) => boolean)) => setPole("maZainstalowanySpdTyp1", a)
  const setUcSpdV = (a: string | ((p: string) => string)) => setPole("ucSpdV", a)
  const setUziemienieViaGsw = (a: boolean | ((p: boolean) => boolean)) => setPole("uziemienieViaGsw", a)

  const result = useMemo(
    () =>
      calculateOchronaPrzepieciowaSpd({
        vocMaxStringuV: vocMaxStringuV === "" ? 0 : Number(vocMaxStringuV),
        maInstalacjeOdgromowa,
        odlegloscOdZwoduM: maInstalacjeOdgromowa && odlegloscOdZwoduM !== "" ? Number(odlegloscOdZwoduM) : null,
        maZainstalowanySpdTyp1,
        ucSpdV: ucSpdV === "" ? 0 : Number(ucSpdV),
        uziemienieViaGsw,
      }),
    [vocMaxStringuV, maInstalacjeOdgromowa, odlegloscOdZwoduM, maZainstalowanySpdTyp1, ucSpdV, uziemienieViaGsw],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-OCHPRZSPD-POLICZYC"),
    incomplete: t("UI-OCHPRZSPD-WYPELNIJ-WSZYSTKIE-POLA"),
    red: t("UI-OCHPRZSPD-ZABRONIONE-OCHRONA-PRZECIWPR"),
    green: t("UI-OCHPRZSPD-SPD-DOBRANY-POPRAWNIE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przepieciowa-spd" />
      <NaglowekEkranu
        tytul={t("UI-OCHPRZSPD-OCHRONA-PRZECIWPRZEPIECIOWA-")}
        ekran="ochrona-przepieciowa-spd"
        wynik={result}
        parametry={{ marginesUc: WSPOLCZYNNIK_MARGINESU_UC, minOdleglosc: MIN_ODLEGLOSC_OD_ZWODU_M }}
      >
        {t("UI-OCHPRZSPD-PIORUN-MUSI-TRAFIC")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-OCHPRZSPD-NAPIECIE-ROBOCZE-STRINGU")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={vocMaxStringuV}
          onChange={(e) => setVocMaxStringuV(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-przepieciowa-spd" pole="voc" />}
        />
        {!ukryjPolaBudynku && (
          <PoleCheckbox
            id="ma-instalacje-odgromowa"
            label={t("UI-OCHPRZSPD-BUDYNEK-INSTALACJE-ODGROMOWA")}
            checked={maInstalacjeOdgromowa}
            onChange={(e) => setMaInstalacjeOdgromowa(e.target.checked)}
          />
        )}
        {maInstalacjeOdgromowa && (
          <>
            <Pole
              label={t("UI-OCHPRZSPD-ODLEGLOSC-PANELI-ZWODU")}
              unit="m"
              type="number"
              inputMode="decimal"
              min={0}
              value={odlegloscOdZwoduM}
              onChange={(e) => setOdlegloscOdZwoduM(e.target.value)}
              pomoc={<PomocPola ekran="ochrona-przepieciowa-spd" pole="odleglosc" params={{ marginesUc: WSPOLCZYNNIK_MARGINESU_UC, minOdleglosc: MIN_ODLEGLOSC_OD_ZWODU_M }} />}
            />
            <PoleCheckbox
              id="ma-spd-typ1"
              label={t("UI-OCHPRZSPD-ZAINSTALOWANY-SPD-TYPU")}
              checked={maZainstalowanySpdTyp1}
              onChange={(e) => setMaZainstalowanySpdTyp1(e.target.checked)}
            />
          </>
        )}
        <Pole
          label={t("UI-OCHPRZSPD-NAPIECIE-TRWALEJ-PRACY")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={ucSpdV}
          onChange={(e) => setUcSpdV(e.target.value)}
          pomoc={<PomocPola ekran="ochrona-przepieciowa-spd" pole="uc" params={{ marginesUc: WSPOLCZYNNIK_MARGINESU_UC, minOdleglosc: MIN_ODLEGLOSC_OD_ZWODU_M }} />}
        />
        <PoleCheckbox
          id="uziemienie-gsw"
          label={t("UI-OCHPRZSPD-SPD-UZIEMIONY-WSPOLNA")}
          checked={uziemienieViaGsw}
          onChange={(e) => setUziemienieViaGsw(e.target.checked)}
        />
        {ukryjPolaBudynku && <PolaBudynkuUkryteInfo />}
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && (
          <WynikGlowny>
            {result.value.typWymagany}, Uc ≥ {result.value.ucMinimalneV.toFixed(0)} V
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>

      <SekcjaCrl />
    </main>
  )
}
