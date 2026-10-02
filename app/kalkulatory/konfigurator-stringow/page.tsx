"use client"

import { useMemo } from "react"
import { calculateKonfiguratorStringow } from "@/lib/core/modules/pv/konfigurator-stringow/calculator"
import type { KonfiguratorStringowInput } from "@/lib/core/modules/pv/konfigurator-stringow/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { LICZBA_PANELI_SANITY_MAX } from "@/lib/core/modules/pv/konfigurator-stringow/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type Mode = KonfiguratorStringowInput["mode"]

const MODE_LABELS: Record<Mode, string> = {
  szereg: "UI-KONSTR-SZEREG",
  rownolegle: "UI-KONSTR-ROWNOLEGLE",
  mieszany: "UI-KONSTR-MIESZANY-GRUPY-SZEREGOWE",
}

type FormularzStan = {
  mode: Mode
  vmpV: string
  impA: string
  liczbaPaneli: string
  panelWGrupie: string
  liczbaGrup: string
}

const STAN_POCZATKOWY: FormularzStan = {
  mode: "szereg",
  vmpV: "40",
  impA: "11",
  liczbaPaneli: "8",
  panelWGrupie: "4",
  liczbaGrup: "2",
}

export default function KonfiguratorStringowPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("konfigurator-stringow", STAN_POCZATKOWY)
  const { mode, vmpV, impA, liczbaPaneli, panelWGrupie, liczbaGrup } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setMode = (a: Mode | ((p: Mode) => Mode)) => setPole("mode", a)
  const setVmpV = (a: string | ((p: string) => string)) => setPole("vmpV", a)
  const setImpA = (a: string | ((p: string) => string)) => setPole("impA", a)
  const setLiczbaPaneli = (a: string | ((p: string) => string)) => setPole("liczbaPaneli", a)
  const setPanelWGrupie = (a: string | ((p: string) => string)) => setPole("panelWGrupie", a)
  const setLiczbaGrup = (a: string | ((p: string) => string)) => setPole("liczbaGrup", a)

  const input: KonfiguratorStringowInput = useMemo(() => {
    if (mode === "mieszany") {
      return {
        mode,
        vmpV: Number(vmpV),
        impA: Number(impA),
        panelWGrupie: Number(panelWGrupie),
        liczbaGrup: Number(liczbaGrup),
      }
    }
    return { mode, vmpV: Number(vmpV), impA: Number(impA), liczbaPaneli: Number(liczbaPaneli) }
  }, [mode, vmpV, impA, liczbaPaneli, panelWGrupie, liczbaGrup])

  const result = useMemo(() => calculateKonfiguratorStringow(input), [input])

  const poziom: WerdyktPoziom =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "VALID_WITH_WARNINGS"
        ? "uwaga"
        : "ok"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/konfigurator-stringow" />
      <NaglowekEkranu tytul={t("UI-KONSTR-KONFIGURATOR-STRINGOW")} ekran="konfigurator-stringow" wynik={result}>
        {t("UI-KONSTR-SZEREG-DODAJE-NAPIECIA")}
      </NaglowekEkranu>

      <PoleSelect
        label={t("UI-KONSTR-TRYB")}
        value={mode}
        onChange={(e) => setMode(e.target.value as Mode)}
        pomoc={<PomocPola ekran="konfigurator-stringow" pole="tryb" />}
      >
        {Object.entries(MODE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {t(label)}
          </option>
        ))}
      </PoleSelect>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-KONSTR-NAPIECIE-VMP-PANELU")}
          unit="V"
          type="number"
          inputMode="decimal"
          value={vmpV}
          onChange={(e) => setVmpV(e.target.value)}
          pomoc={<PomocPola ekran="konfigurator-stringow" pole="vmp" />}
        />
        <Pole
          label={t("UI-KONSTR-PRAD-IMP-PANELU")}
          unit="A"
          type="number"
          inputMode="decimal"
          value={impA}
          onChange={(e) => setImpA(e.target.value)}
          pomoc={<PomocPola ekran="konfigurator-stringow" pole="imp" />}
        />

        {mode === "mieszany" ? (
          <>
            <Pole
              label={t("UI-KONSTR-PANELI-GRUPIE-SZEREG")}
              unit={t("UI-J-SZT")}
              type="number"
              inputMode="decimal"
              value={panelWGrupie}
              onChange={(e) => setPanelWGrupie(e.target.value)}
              pomoc={<PomocPola ekran="konfigurator-stringow" pole="szereg" />}
            />
            <Pole
              label={t("UI-KONSTR-LICZBA-GRUP-ROWNOLEGLE")}
              unit={t("UI-J-SZT")}
              type="number"
              inputMode="decimal"
              value={liczbaGrup}
              onChange={(e) => setLiczbaGrup(e.target.value)}
              pomoc={<PomocPola ekran="konfigurator-stringow" pole="grupy" />}
            />
          </>
        ) : (
          <Pole
            label={t("UI-KONSTR-LICZBA-PANELI")}
            unit={t("UI-J-SZT")}
            type="number"
            inputMode="decimal"
            value={liczbaPaneli}
            onChange={(e) => setLiczbaPaneli(e.target.value)}
            pomoc={<PomocPola ekran="konfigurator-stringow" pole="liczba" params={{ max: LICZBA_PANELI_SANITY_MAX }} />}
          />
        )}
      </div>

      <WerdyktPanel poziom={poziom}>
        {result.status === "INVALID_INPUT" ? (
          <p className="mt-1">{t("UI-KONSTR-POLICZYC-SPRAWDZ-DANE")}</p>
        ) : (
          <WynikGlowny>
            {result.value.voltageV.toFixed(1)} V &nbsp;/&nbsp; {result.value.currentA.toFixed(2)} A
          </WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
