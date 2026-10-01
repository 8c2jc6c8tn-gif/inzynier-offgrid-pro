"use client"

import { useMemo } from "react"
import { calculateLaczenieCuAl } from "@/lib/core/modules/okablowanie/laczenie-cu-al/calculator"
import { ETYKIETY_MATERIALOW, ETYKIETY_SRODOWISK, WSPOLCZYNNIK_PRZEKROJU_AL_WZGLEDEM_CU, kluczPary } from "@/lib/core/modules/okablowanie/laczenie-cu-al/constants"
import type { Material, Srodowisko } from "@/lib/core/modules/okablowanie/laczenie-cu-al/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const MATERIALY = Object.keys(ETYKIETY_MATERIALOW) as Material[]
const SRODOWISKA = Object.keys(ETYKIETY_SRODOWISK) as Srodowisko[]

type FormularzStan = {
  material1: Material | ""
  material2: Material | ""
  srodowisko: Srodowisko
  maZlaczkeBimetaliczna: boolean
  maPodkladkeISmar: boolean
  przekrojCuMm2: string
}

const STAN_POCZATKOWY: FormularzStan = {
  material1: "",
  material2: "",
  srodowisko: "suche",
  maZlaczkeBimetaliczna: false,
  maPodkladkeISmar: false,
  przekrojCuMm2: "",
}

export default function LaczenieCuAlPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("laczenie-cu-al", STAN_POCZATKOWY)
  const { material1, material2, srodowisko, maZlaczkeBimetaliczna, maPodkladkeISmar, przekrojCuMm2 } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMaterial1 = (a: (Material | "") | ((p: Material | "") => Material | "")) => setPole("material1", a)
  const setMaterial2 = (a: (Material | "") | ((p: Material | "") => Material | "")) => setPole("material2", a)
  const setSrodowisko = (a: Srodowisko | ((p: Srodowisko) => Srodowisko)) => setPole("srodowisko", a)
  const setMaZlaczkeBimetaliczna = (a: boolean | ((p: boolean) => boolean)) => setPole("maZlaczkeBimetaliczna", a)
  const setMaPodkladkeISmar = (a: boolean | ((p: boolean) => boolean)) => setPole("maPodkladkeISmar", a)
  const setPrzekrojCuMm2 = (a: string | ((p: string) => string)) => setPole("przekrojCuMm2", a)

  const result = useMemo(
    () =>
      calculateLaczenieCuAl({
        material1: material1 === "" ? null : material1,
        material2: material2 === "" ? null : material2,
        srodowisko,
        maZlaczkeBimetaliczna,
        maPodkladkeISmar,
        przekrojCuMm2: przekrojCuMm2 === "" ? 0 : Number(przekrojCuMm2),
      }),
    [material1, material2, srodowisko, maZlaczkeBimetaliczna, maPodkladkeISmar, przekrojCuMm2],
  )

  const paraCuAl = material1 && material2 && kluczPary(material1, material2) === kluczPary("Cu", "Al")
  const paraStalOcynkCu =
    material1 && material2 && kluczPary(material1, material2) === kluczPary("stal-ocynkowana", "Cu")

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : result.status === "OUT_OF_SCOPE"
          ? "poza-zakresem"
          : hasCritical
            ? "red"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    "poza-zakresem": "blad",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-LACCUAL-POLICZYC"),
    incomplete: t("UI-LACCUAL-WYBIERZ-OBA-MATERIALY"),
    "poza-zakresem": t("UI-LACCUAL-PARA-SRODOWISKO-OCENIANE"),
    red: t("UI-LACCUAL-ZABRONIONE-KOROZJA-GALWANICZNA"),
    green: t("UI-LACCUAL-POLACZENIE-BEZPIECZNE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/laczenie-cu-al" />
      <NaglowekEkranu
        tytul={t("UI-LACCUAL-LACZENIE-OCHRONA-PRZED")}
        ekran="laczenie-cu-al"
        wynik={result}
        parametry={{ wspAl: WSPOLCZYNNIK_PRZEKROJU_AL_WZGLEDEM_CU }}
      >
        {t("UI-LACCUAL-MIEDZ-ALUMINIUM-WILGOCI")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-LACCUAL-MATERIAL-PRZEWODU")}
          value={material1}
          onChange={(e) => setMaterial1(e.target.value as Material)}
          pomoc={<PomocPola ekran="laczenie-cu-al" pole="material1" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {MATERIALY.map((m) => (
            <option key={m} value={m}>
              {ETYKIETY_MATERIALOW[m]}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-LACCUAL-MATERIAL-PRZEWODU-2")}
          value={material2}
          onChange={(e) => setMaterial2(e.target.value as Material)}
          pomoc={<PomocPola ekran="laczenie-cu-al" pole="material2" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          {MATERIALY.map((m) => (
            <option key={m} value={m}>
              {ETYKIETY_MATERIALOW[m]}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect
          label={t("UI-LACCUAL-SRODOWISKO")}
          value={srodowisko}
          onChange={(e) => setSrodowisko(e.target.value as Srodowisko)}
          pomoc={<PomocPola ekran="laczenie-cu-al" pole="srodowisko" />}
        >
          {SRODOWISKA.map((s) => (
            <option key={s} value={s}>
              {ETYKIETY_SRODOWISK[s]}
            </option>
          ))}
        </PoleSelect>

        {paraCuAl && (
          <PoleCheckbox
            id="ma-zlaczke-bimetaliczna"
            label={t("UI-LACCUAL-ZASTOSOWANA-ZLACZKA-BIMETALI")}
            checked={maZlaczkeBimetaliczna}
            onChange={(e) => setMaZlaczkeBimetaliczna(e.target.checked)}
          />
        )}
        {paraStalOcynkCu && (
          <PoleCheckbox
            id="ma-podkladke-i-smar"
            label={t("UI-LACCUAL-ZASTOSOWANA-PODKLADKA-SMAR")}
            checked={maPodkladkeISmar}
            onChange={(e) => setMaPodkladkeISmar(e.target.checked)}
          />
        )}

        <Pole
          label={t("UI-LACCUAL-PRZEKROJ-OPCJONALNIE-PRZELIC")}
          unit="mm²"
          type="number"
          inputMode="decimal"
          min={0}
          value={przekrojCuMm2}
          onChange={(e) => setPrzekrojCuMm2(e.target.value)}
          pomoc={<PomocPola ekran="laczenie-cu-al" pole="przekrojCu" params={{ wspAl: WSPOLCZYNNIK_PRZEKROJU_AL_WZGLEDEM_CU }} />}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {result.value.wymaganyPrzekrojAlMm2 > 0 && (
          <p className="font-medium">{t("UI-LACCUAL-WYMAGANY-PRZEKROJ", { wymaganyPrzekrojAlMm2: result.value.wymaganyPrzekrojAlMm2.toFixed(1) })}</p>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
