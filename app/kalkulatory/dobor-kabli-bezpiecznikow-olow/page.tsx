"use client"

import { useMemo } from "react"
import { calculateDoborKabliBezpiecznikowOlow } from "@/lib/core/modules/montaz-baterii/dobor-kabli-bezpiecznikow-olow/calculator"
import type { Material, SposobUlozenia } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { DOMYSLNY_SPADEK_DC_PCT } from "@/lib/core/modules/okablowanie/dobor-przekroju-kabla/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  pradA: string
  napiecieV: string
  dlugoscTrasyM: string
  material: Material
  sposobUlozenia: SposobUlozenia
  temperaturaOtoczeniaC: string
  liczbaKabliWWiazce: string
  dopuszczalnySpadekNapieciaPct: string
  pradZwarciowyA: string
  aicBezpiecznikaA: string
}

const STAN_POCZATKOWY: FormularzStan = {
  pradA: "",
  napiecieV: "",
  dlugoscTrasyM: "",
  material: "Cu",
  sposobUlozenia: "swobodnie",
  temperaturaOtoczeniaC: "",
  liczbaKabliWWiazce: "1",
  dopuszczalnySpadekNapieciaPct: "3",
  pradZwarciowyA: "",
  aicBezpiecznikaA: "",
}

export default function DoborKabliBezpiecznikowOlowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("dobor-kabli-bezpiecznikow-olow", STAN_POCZATKOWY)
  const {
    pradA,
    napiecieV,
    dlugoscTrasyM,
    material,
    sposobUlozenia,
    temperaturaOtoczeniaC,
    liczbaKabliWWiazce,
    dopuszczalnySpadekNapieciaPct,
    pradZwarciowyA,
    aicBezpiecznikaA,
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
  const setPradZwarciowyA = (a: string | ((p: string) => string)) => setPole("pradZwarciowyA", a)
  const setAicBezpiecznikaA = (a: string | ((p: string) => string)) => setPole("aicBezpiecznikaA", a)

  const result = useMemo(
    () =>
      calculateDoborKabliBezpiecznikowOlow({
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        dlugoscTrasyM: dlugoscTrasyM === "" ? 0 : Number(dlugoscTrasyM),
        material,
        sposobUlozenia,
        temperaturaOtoczeniaC: temperaturaOtoczeniaC === "" ? null : Number(temperaturaOtoczeniaC),
        liczbaKabliWWiazce: liczbaKabliWWiazce === "" ? 0 : Number(liczbaKabliWWiazce),
        dopuszczalnySpadekNapieciaPct: dopuszczalnySpadekNapieciaPct === "" ? 0 : Number(dopuszczalnySpadekNapieciaPct),
        sprawdzanyPrzekrojMm2: null,
        pradZwarciowyA: pradZwarciowyA === "" ? 0 : Number(pradZwarciowyA),
        aicBezpiecznikaA: aicBezpiecznikaA === "" ? 0 : Number(aicBezpiecznikaA),
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
      pradZwarciowyA,
      aicBezpiecznikaA,
    ],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "OUT_OF_SCOPE"
        ? "invalid"
        : result.status === "INCOMPLETE"
          ? "incomplete"
          : hasCritical
            ? "red"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }
  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-DOBKABBEZOLO-POLICZYC"),
    incomplete: t("UI-DOBKABBEZOLO-WYPELNIJ-DANE-OBWODU"),
    red: t("UI-DOBKABBEZOLO-ZABRONIONE-SPRAWDZ-OSTRZEZEN"),
    green: t("UI-DOBKABBEZOLO-DOBRANE-POPRAWNIE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/dobor-kabli-bezpiecznikow-olow" />
      <NaglowekEkranu
        tytul={t("UI-DOBKABBEZOLO-DOBOR-KABLI-BEZPIECZNIKOW")}
        ekran="dobor-kabli-bezpiecznikow-olow"
        wynik={result}
      >
        {t("UI-DOBKABBEZOLO-DOBOR-KABLA-ZALEZY")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-DOBKABBEZOLO-PRAD-LADOWANIA-ROZLADOWANIA")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradA}
          onChange={(e) => setPradA(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="prad" />}
        />
        <Pole
          label={t("UI-DOBKABBEZOLO-NAPIECIE-SYSTEMU")}
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="napiecie" />}
        />
        <Pole
          label={t("UI-DOBKABBEZOLO-DLUGOSC-TRASY-KABLA")}
          unit="m"
          type="number"
          inputMode="decimal"
          min={0}
          value={dlugoscTrasyM}
          onChange={(e) => setDlugoscTrasyM(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="dlugosc" />}
        />
        <PoleSelect
          label={t("UI-DOBKABBEZOLO-MATERIAL")}
          value={material}
          onChange={(e) => setMaterial(e.target.value as Material)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="material" />}
        >
          <option value="Cu">{t("UI-DOBKABBEZOLO-MIEDZ")}</option>
          <option value="Al">{t("UI-DOBKABBEZOLO-ALUMINIUM")}</option>
        </PoleSelect>
        <PoleSelect
          label={t("UI-DOBKABBEZOLO-SPOSOB-ULOZENIA")}
          value={sposobUlozenia}
          onChange={(e) => setSposobUlozenia(e.target.value as SposobUlozenia)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="ulozenie" />}
        >
          <option value="swobodnie">{t("UI-DOBKABBEZOLO-SWOBODNIE-SCIANIE")}</option>
          <option value="w_peszlu">{t("UI-DOBKABBEZOLO-PESZLU")}</option>
          <option value="w_ziemi">{t("UI-DOBKABBEZOLO-ZIEMI")}</option>
          <option value="w_wiazce">{t("UI-DOBKABBEZOLO-WIAZCE")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-DOBKABBEZOLO-TEMPERATURA-OTOCZENIA")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaOtoczeniaC}
          onChange={(e) => setTemperaturaOtoczeniaC(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="temperatura" />}
        />
        <Pole
          label={t("UI-DOBKABBEZOLO-LICZBA-KABLI-WIAZCE")}
          unit={t("UI-J-SZT")}
          type="number"
          inputMode="decimal"
          min={0}
          value={liczbaKabliWWiazce}
          onChange={(e) => setLiczbaKabliWWiazce(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="wiazka" />}
        />
        <Pole
          label={t("UI-DOBKABBEZOLO-DOPUSZCZALNY-SPADEK-NAPIECIA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          value={dopuszczalnySpadekNapieciaPct}
          onChange={(e) => setDopuszczalnySpadekNapieciaPct(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="spadek" params={{ spadekDc: DOMYSLNY_SPADEK_DC_PCT }} />}
        />
        <Pole
          label={t("UI-DOBKABBEZOLO-PRAD-ZWARCIOWY-ZESTAWU")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradZwarciowyA}
          onChange={(e) => setPradZwarciowyA(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="pradZwarcia" />}
        />
        <Pole
          label={t("UI-DOBKABBEZOLO-ZDOLNOSC-WYLACZANIA-AIC")}
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={aicBezpiecznikaA}
          onChange={(e) => setAicBezpiecznikaA(e.target.value)}
          pomoc={<PomocPola ekran="dobor-kabli-bezpiecznikow-olow" pole="aic" />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict === "green" || verdict === "red" ? (
          <WynikGlowny>
            {t("UI-DOBKABBEZOLO-PRZEKROJ-BEZPIECZNIK", { przekrojMm2: result.value.przekrojMm2, pradBezpiecznikaZalecanyA: result.value.pradBezpiecznikaZalecanyA.toFixed(1) })}
          </WynikGlowny>
        ) : null}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>
    </main>
  )
}
