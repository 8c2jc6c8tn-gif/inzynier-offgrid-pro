"use client"

import { useMemo } from "react"
import { calculateBalanseryZewnetrzneOlow } from "@/lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA } from "@/lib/core/modules/montaz-baterii/balansery-zewnetrzne-olow/constants"
import { useTranslate } from "@/lib/i18n/language-context"

/** Schemat: balanser zewnętrzny podłączony równolegle do KAŻDEGO akumulatora w szeregu. */
function BalanseryIlustracja() {
  const t = useTranslate()
  return (
    <svg
      viewBox="0 0 400 190"
      className="w-full rounded-lg border bg-muted/30 text-foreground"
      role="img"
      aria-label={t("UI-BALZEWOLO-SCHEMAT-BALANSER-ZEWNETRZNY")}
    >
      {[0, 1].map((i) => {
        const x = 40 + i * 190
        return (
          <g key={i}>
            <rect x={x} y="90" width="90" height="46" rx="4" className="fill-indigo-400/60 stroke-current" />
            <text x={x + 45} y="117" textAnchor="middle" className="fill-current text-[9px]">
              {t("UI-BALZEWOLO-AKUM", { p: i + 1 })}
            </text>
            <text x={x + 8} y="86" className="fill-current text-[9px] font-semibold">+</text>
            <text x={x + 78} y="86" className="fill-current text-[9px] font-semibold">−</text>

            {/* balanser podłączony równolegle nad akumulatorem */}
            <rect x={x + 10} y="24" width="70" height="30" rx="4" className="fill-amber-400/70 stroke-current" />
            <text x={x + 45} y="43" textAnchor="middle" className="fill-current text-[8px] font-medium">
              {t("UI-BALZEWOLO-BALANSER")}
            </text>
            <line x1={x + 15} y1="54" x2={x + 8} y2="90" className="stroke-amber-500" strokeWidth="2" />
            <line x1={x + 75} y1="54" x2={x + 82} y2="90" className="stroke-amber-500" strokeWidth="2" />
          </g>
        )
      })}

      {/* połączenie szeregowe między akumulatorami */}
      <line x1="130" y1="113" x2="230" y2="113" className="stroke-red-500" strokeWidth="3" />
      <line x1="6" y1="113" x2="40" y2="113" className="stroke-current" strokeWidth="2" />
      <line x1="360" y1="113" x2="394" y2="113" className="stroke-current" strokeWidth="2" />

      <text x="200" y="165" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-BALZEWOLO-KAZDY-AKUMULATOR-SZEREGU")}
      </text>
      <text x="200" y="179" textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {t("UI-BALZEWOLO-POWTORZ-WSZYSTKICH-AKUMULATO")}
      </text>
    </svg>
  )
}

type FormularzStan = {
  iloscAkumulatorow: string
  posiadaBalanserZewnetrzny: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  iloscAkumulatorow: "",
  posiadaBalanserZewnetrzny: false,
}

export default function BalanseryZewnetrzneOlowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("balansery-zewnetrzne-olow", STAN_POCZATKOWY)
  const { iloscAkumulatorow, posiadaBalanserZewnetrzny } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setIloscAkumulatorow = (a: string | ((p: string) => string)) => setPole("iloscAkumulatorow", a)
  const setPosiadaBalanserZewnetrzny = (a: boolean | ((p: boolean) => boolean)) => setPole("posiadaBalanserZewnetrzny", a)

  const result = useMemo(
    () =>
      calculateBalanseryZewnetrzneOlow({
        iloscAkumulatorowWSzeregu: iloscAkumulatorow === "" ? 0 : Number(iloscAkumulatorow),
        posiadaBalanserZewnetrzny,
      }),
    [iloscAkumulatorow, posiadaBalanserZewnetrzny],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : hasCritical
          ? "blad"
          : "ok"

  const etykieta =
    result.status === "INVALID_INPUT"
      ? t("UI-BALZEWOLO-POLICZYC-LICZBA-AKUMULATOROW")
      : hasCritical
        ? t("UI-BALZEWOLO-BRAK-WYMAGANEGO-BALANSERA")
        : result.value.wymaganyBalanser
          ? t("UI-BALZEWOLO-BALANSER-ZEWNETRZNY-PODLACZO")
          : t("UI-BALZEWOLO-NIEWYMAGANY")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/balansery-zewnetrzne-olow" />
      <NaglowekEkranu
        tytul={t("UI-BALZEWOLO-BALANSERY-ZEWNETRZNE")}
        ekran="balansery-zewnetrzne-olow" wynik={result}
        parametry={{ minAku: MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA }}
      >
        {t("UI-BALZEWOLO-AKUMULATORY-KWASOWE-PRZECIWI")}
      </NaglowekEkranu>

      <BalanseryIlustracja />

      <Pole
        label={t("UI-BALZEWOLO-LICZBA-AKUMULATOROW-SZEREGU")}
        unit={t("UI-J-SZT")}
        type="number"
        inputMode="numeric"
        min={0}
        step="1"
        value={iloscAkumulatorow}
        onChange={(e) => setIloscAkumulatorow(e.target.value)}
        pomoc={<PomocPola ekran="balansery-zewnetrzne-olow" pole="liczba" params={{ minAku: MIN_AKUMULATOROW_WYMAGAJACYCH_BALANSERA }} />}
      />

      <PoleCheckbox
        id="posiada-balanser"
        label={t("UI-BALZEWOLO-BALANSER-ZEWNETRZNY-PODLACZO-2")}
        checked={posiadaBalanserZewnetrzny}
        onChange={(e) => setPosiadaBalanserZewnetrzny(e.target.checked)}
      />

      {poziom === null ? (
        <p className="text-small text-muted-foreground">{t("UI-BALZEWOLO-WPISZ-LICZBE-AKUMULATOROW")}</p>
      ) : (
        <WerdyktPanel poziom={poziom} etykieta={etykieta}>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} />
        </WerdyktPanel>
      )}
    </main>
  )
}
