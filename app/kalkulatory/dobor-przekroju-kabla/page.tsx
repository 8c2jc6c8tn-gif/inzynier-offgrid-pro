"use client"

import { useMemo } from "react"
import { calculateDoborPrzekrojuKabla } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/calculator"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  DOMYSLNY_SPADEK_AC_PCT,
  DOMYSLNY_SPADEK_DC_PCT,
  PROG_MARGINESU_ZALECANE_PCT,
  REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M,
  REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M,
} from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { useTranslate } from "@/lib/i18n/language-context"

const LICZBA = (v: number) => v.toLocaleString("pl-PL", { maximumFractionDigits: 2 })

type FormularzStan = {
  pradA: string
  napiecieV: string
  dlugoscTrasyM: string
  material: Material
  sposobUlozenia: SposobUlozenia
  temperaturaOtoczeniaC: string
  liczbaKabliWWiazce: string
  dopuszczalnySpadekNapieciaPct: string
  sprawdzamWlasny: boolean
  sprawdzanyPrzekrojMm2: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pradA: "",
  napiecieV: "",
  dlugoscTrasyM: "",
  material: "Cu",
  sposobUlozenia: "swobodnie",
  temperaturaOtoczeniaC: "",
  liczbaKabliWWiazce: "",
  dopuszczalnySpadekNapieciaPct: "",
  sprawdzamWlasny: false,
  sprawdzanyPrzekrojMm2: "",
}

export default function DoborPrzekrojuKablaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-przekroju-kabla", STAN_POCZATKOWY)
  const {
    pradA,
    napiecieV,
    dlugoscTrasyM,
    material,
    sposobUlozenia,
    temperaturaOtoczeniaC,
    liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct,
    sprawdzamWlasny,
    sprawdzanyPrzekrojMm2,
  } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPradA = (a: string | ((p: string) => string)) => setPole("pradA", a)
  const setNapiecieV = (a: string | ((p: string) => string)) => setPole("napiecieV", a)
  const setDlugoscTrasyM = (a: string | ((p: string) => string)) => setPole("dlugoscTrasyM", a)
  const setMaterial = (a: Material | ((p: Material) => Material)) => setPole("material", a)
  const setSposobUlozenia = (a: SposobUlozenia | ((p: SposobUlozenia) => SposobUlozenia)) => setPole("sposobUlozenia", a)
  const setTemperaturaOtoczeniaC = (a: string | ((p: string) => string)) => setPole("temperaturaOtoczeniaC", a)
  const setLiczbaKabliWWiazce = (a: string | ((p: string) => string)) => setPole("liczbaKabliWWiazce", a)
  const setDopuszczalnySpadekNapieciaPct = (a: string | ((p: string) => string)) => setPole("dopuszczalnySpadekNapieciaPct", a)
  const setSprawdzamWlasny = (a: boolean | ((p: boolean) => boolean)) => setPole("sprawdzamWlasny", a)
  const setSprawdzanyPrzekrojMm2 = (a: string | ((p: string) => string)) => setPole("sprawdzanyPrzekrojMm2", a)

  const result = useMemo(
    () =>
      calculateDoborPrzekrojuKabla({
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        dlugoscTrasyM: dlugoscTrasyM === "" ? 0 : Number(dlugoscTrasyM),
        material,
        sposobUlozenia,
        temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : Number(temperaturaOtoczeniaC),
        liczbaKabliWWiazce: liczbaKabliWWiazce === "" ? 0 : Number(liczbaKabliWWiazce),
        dopuszczalnySpadekNapieciaPct:
          dopuszczalnySpadekNapieciaPct === "" ? 0 : Number(dopuszczalnySpadekNapieciaPct),
        sprawdzanyPrzekrojMm2: sprawdzamWlasny && sprawdzanyPrzekrojMm2 !== "" ? Number(sprawdzanyPrzekrojMm2) : null,
      }),
    [
      pradA,
      napiecieV,
      dlugoscTrasyM,
      material,
      sposobUlozenia,
      temperaturaOtoczeniaC,
      liczbaKabliWWiazce,
      dopuszczalnySpadekNapieciaPct,
      sprawdzamWlasny,
      sprawdzanyPrzekrojMm2,
    ],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const werdykt: "incomplete" | "invalid" | "red" | "yellow" | "green" =
    result.status === "INCOMPLETE"
      ? "incomplete"
      : result.status === "INVALID_INPUT" || result.status === "OUT_OF_SCOPE"
        ? "invalid"
        : hasCritical
          ? "red"
          : result.status === "VALID_WITH_WARNINGS"
            ? "yellow"
            : "green"

  const werdyktPoziom: Record<Exclude<typeof werdykt, "incomplete">, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const werdyktEtykieta: Record<Exclude<typeof werdykt, "incomplete">, string> = {
    invalid: t("UI-DOBPRZKAB-POLICZYC-SPRAWDZ-WPISANE"),
    red: t("UI-DOBPRZKAB-ZABRONIONE"),
    yellow: t("UI-DOBPRZKAB-DOPUSZCZALNE-NA-GRANICY"),
    green: t("UI-DOBPRZKAB-ZALECANE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-przekroju-kabla" />
      <NaglowekEkranu
        tytul={t("UI-DOBPRZKAB-DOBOR-PRZEKROJU-KABLA")}
        ekran="dobor-przekroju-kabla"
        wynik={result}
        parametry={{
          margines: PROG_MARGINESU_ZALECANE_PCT,
          rhoCu: REZYSTYWNOSC_MIEDZI_OHM_MM2_NA_M,
          rhoAl: REZYSTYWNOSC_ALUMINIUM_OHM_MM2_NA_M,
        }}
      >
        {t("UI-DOBPRZKAB-PRAD-PLYNACY-DLUGIM")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-DOBPRZKAB-PRAD-ROBOCZY-OBWODU")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="prad" />}
        />
        <Pole
          label={t("UI-DOBPRZKAB-NAPIECIE-SYSTEMOWE")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="napiecie" />}
        />
        <Pole
          label={t("UI-DOBPRZKAB-DLUGOSC-TRASY-JEDNA")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscTrasyM}
          onChange={(e) => setDlugoscTrasyM(e.target.value)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="dlugosc" />}
        />
        <PoleSelect
          label={t("UI-DOBPRZKAB-MATERIAL-PRZEWODNIKA")}
          value={material}
          onChange={(e) => setMaterial(e.target.value as Material)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="material" />}
        >
          <option value="Cu">{t("UI-DOBPRZKAB-MIEDZ")}</option>
          <option value="Al">{t("UI-DOBPRZKAB-ALUMINIUM")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-DOBPRZKAB-SPOSOB-ULOZENIA")}
          value={sposobUlozenia}
          onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="ulozenie" />}
        >
          <option value="swobodnie">{t("UI-DOBPRZKAB-SWOBODNIE-SCIANIE-POWIETRZU")}</option>
          <option value="w_peszlu">{t("UI-DOBPRZKAB-PESZLU-RURZE-INSTALACYJNEJ")}</option>
          <option value="w_ziemi">{t("UI-DOBPRZKAB-ZIEMI")}</option>
          <option value="w_wiazce">{t("UI-DOBPRZKAB-WIAZCE-INNYMI-KABLAMI")}</option>
        </PoleSelect>
        {(sposobUlozenia === "w_wiazce" || sposobUlozenia === "w_peszlu" || sposobUlozenia === "w_ziemi") && (
          <Pole
            label={t("UI-DOBPRZKAB-LICZBA-KABLI-WIAZCE")}
            unit={t("UI-J-SZT")}
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaKabliWWiazce}
            onChange={(e) => setLiczbaKabliWWiazce(e.target.value)}
            pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="wiazka" />}
          />
        )}
        <Pole
          label={t("UI-DOBPRZKAB-TEMPERATURA-OTOCZENIA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaOtoczeniaC}
          onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="temperatura" />}
        />
        <Pole
          label={t("UI-DOBPRZKAB-DOPUSZCZALNY-SPADEK-NAPIECIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={dopuszczalnySpadekNapieciaPct}
          onChange={(e) => setDopuszczalnySpadekNapieciaPct(e.target.value)}
          pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="spadek" params={{ spadekAc: DOMYSLNY_SPADEK_AC_PCT, spadekDc: DOMYSLNY_SPADEK_DC_PCT }} />}
        />

        <PoleCheckbox
          id="sprawdz-wlasny-przekroj"
          label={t("UI-DOBPRZKAB-SPRAWDZ-MOJ-WLASNY")}
          checked={sprawdzamWlasny}
          onChange={(e) => setSprawdzamWlasny(e.target.checked)}
        />
        {sprawdzamWlasny && (
          <Pole
            label={t("UI-DOBPRZKAB-PRZEKROJ-SPRAWDZENIA")}
            unit="mm²"
            type="number"
            inputMode="decimal"
            min={0}
            value={sprawdzanyPrzekrojMm2}
            onChange={(e) => setSprawdzanyPrzekrojMm2(e.target.value)}
            pomoc={<PomocPola ekran="dobor-przekroju-kabla" pole="sprawdzany" />}
          />
        )}
      </div>

      {werdykt === "incomplete" ? (
        <p className="text-small text-muted-foreground">{t("UI-DOBPRZKAB-WYPELNIJ-WSZYSTKIE-POLA")}</p>
      ) : (
        <WerdyktPanel poziom={werdyktPoziom[werdykt]} etykieta={werdyktEtykieta[werdykt]}>
          {werdykt !== "invalid" && (
            <>
              <WynikGlowny>{result.value.przekrojMm2} mm²</WynikGlowny>
              <p className="mt-1 text-small">
                {t("UI-DOBPRZKAB-OBCIAZALNOSC-EFEKTYWNA-SPADE", { obciazalnoscEfektywnaA: LICZBA(result.value.obciazalnoscEfektywnaA), spadekNapieciaPct: LICZBA(result.value.spadekNapieciaPct) })}
              </p>
              <p className="mt-1 text-small">
                {t("UI-DOBPRZKAB-MARGINES-OBCIAZALNOSCI-MARGI", { marginesObciazalnosciPct: LICZBA(result.value.marginesObciazalnosciPct), marginesSpadkuPct: LICZBA(result.value.marginesSpadkuPct) })}
              </p>
              {result.value.strataRocznaKwh > 0 && (
                <p className="mt-1 text-small">
                  {t("UI-DOBPRZKAB-ORIENTACYJNA-ROCZNA-STRATA", { strataRocznaKwh: LICZBA(result.value.strataRocznaKwh) })}
                </p>
              )}
            </>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
