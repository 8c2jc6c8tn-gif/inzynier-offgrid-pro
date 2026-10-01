"use client"

import { useMemo } from "react"
import { calculateSekwencjaMontazu } from "@/lib/core/modules/montaz-baterii/sekwencja-montazu/calculator"
import { PRESETY_LICZBY_OGNIW } from "@/lib/core/modules/montaz-baterii/sekwencja-montazu/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { KrokZMedia } from "@/components/wzorce/krok-z-media"
import { StanPusty } from "@/components/ui/stany"
import { MAX_OGNIW, MIN_OGNIW } from "@/lib/core/modules/montaz-baterii/sekwencja-montazu/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  preset: number
  wlasna: boolean
  liczbaOgniwWlasna: string
}

const STAN_POCZATKOWY: FormularzStan = {
  preset: 16,
  wlasna: false,
  liczbaOgniwWlasna: "",
}

export default function SekwencjaMontazuPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("sekwencja-montazu", STAN_POCZATKOWY)
  const { preset, wlasna, liczbaOgniwWlasna } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPreset = (a: number | ((p: number) => number)) => setPole("preset", a)
  const setWlasna = (a: boolean | ((p: boolean) => boolean)) => setPole("wlasna", a)
  const setLiczbaOgniwWlasna = (a: string | ((p: string) => string)) => setPole("liczbaOgniwWlasna", a)

  const liczbaOgniw = wlasna ? (liczbaOgniwWlasna === "" ? 0 : Number(liczbaOgniwWlasna)) : preset

  const result = useMemo(() => calculateSekwencjaMontazu({ liczbaOgniw }), [liczbaOgniw])

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const poziom: WerdyktPoziom | null =
    result.status === "VALID" ? "ok" : result.status === "OUT_OF_SCOPE" || hasCritical ? "blad" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/sekwencja-montazu" />
      <NaglowekEkranu
        tytul={t("UI-SEKMON-SEKWENCJA-MONTAZU-PAKIETU")}
        ekran="sekwencja-montazu"
        wynik={result}
        parametry={{ min: MIN_OGNIW, max: MAX_OGNIW }}
      >
        {t("UI-SEKMON-DOKLADNA-PONUMEROWANA-KOLEJN")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-SEKMON-LICZBA-OGNIW-SZEREGU")}
          value={wlasna ? "custom" : String(preset)}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setWlasna(true)
            } else {
              setWlasna(false)
              setPreset(Number(e.target.value))
            }
          }}
          pomoc={<PomocPola ekran="sekwencja-montazu" pole="liczbaOgniw" />}
        >
          {PRESETY_LICZBY_OGNIW.map((n) => (
            <option key={n} value={n}>
              {t("UI-SEKMON-NOMINALNIE", { n, p: (n * 3.2).toFixed(1) })}
            </option>
          ))}
          <option value="custom">{t("UI-SEKMON-INNA-LICZBA")}</option>
        </PoleSelect>

        {wlasna && (
          <Pole
            label={t("UI-SEKMON-WLASNA-LICZBA-OGNIW")}
            unit={t("UI-J-SZT")}
            type="number"
            inputMode="numeric"
            min={0}
            value={liczbaOgniwWlasna}
            onChange={(e) => setLiczbaOgniwWlasna(e.target.value)}
            pomoc={<PomocPola ekran="sekwencja-montazu" pole="wlasnaLiczba" params={{ min: MIN_OGNIW, max: MAX_OGNIW }} />}
          />
        )}
      </div>

      {result.status === "VALID" ? (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="text-small font-semibold text-muted-foreground">
              {t("UI-SEKMON-KROK-POLACZENIA-BUSBAROW", { length: result.value.polaczeniaBusbarow.length })}
            </h2>
            <ol className="flex flex-col gap-2">
              {result.value.polaczeniaBusbarow.map((p) => (
                <KrokZMedia
                  key={p.numer}
                  numer={p.numer}
                  tytul={t("UI-SEKMON-PLUS-OGNIWA-MINUS", { zOgniwa: p.zOgniwa, doOgniwa: p.doOgniwa })}
                >
                  {p.miedzyRzedami && t("UI-SEKMON-POLACZENIE-PRZECHODZI-MIEDZY")}
                </KrokZMedia>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-small font-semibold text-muted-foreground">
              {t("UI-SEKMON-KROK-OKABLOWANIE-BMS", { length: result.value.okablowanieBms.length })}
            </h2>
            <ol className="flex flex-col gap-2">
              {result.value.okablowanieBms.map((w) => (
                <KrokZMedia key={w.numer} numer={w.numer} tytul={`${w.etykieta} → ${w.punkt}`}>
                  {t("UI-SEKMON-NAPIECIE-NOMINALNE-WZGLEDEM", { napiecieNominalneV: w.napiecieNominalneV.toFixed(1) })}
                </KrokZMedia>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <StanPusty tytul={t("UI-SEKMON-WYBIERZ-LICZBE-OGNIW")} />
      )}

      {poziom && (
        <WerdyktPanel
          poziom={poziom}
          etykieta={
            poziom === "ok"
              ? t("UI-SEKMON-PAKIET-NOMINALNIE", { liczbaOgniw, napiecieCalkowiteNominalneV: result.value.napiecieCalkowiteNominalneV.toFixed(1) })
              : undefined
          }
        >
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
