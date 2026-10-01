"use client"

import { useMemo } from "react"
import { calculateGrzalkiBmsMroz } from "@/lib/core/modules/baterie/grzalki-bms-mroz/calculator"
import {
  PROG_SOC_WSTRZYMANIA_PCT,
  PROG_TEMPERATURY_GRZANIA_C,
  PRZYKLADY_BILANSU_GRZANIA,
} from "@/lib/core/modules/baterie/grzalki-bms-mroz/constants"
import type { ProdukcjaPv } from "@/lib/core/modules/baterie/grzalki-bms-mroz/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

const ETYKIETY_ZRODLA: Record<string, string> = {
  "brak-potrzeby": "UI-GRZBMSMRO-GRZANIE-NIEPOTRZEBNE",
  pv: "UI-GRZBMSMRO-GRZANIE-Z-PV",
  bateria: "UI-GRZBMSMRO-GRZANIE-Z-BATERII",
  wstrzymane: "UI-GRZBMSMRO-GRZANIE-WSTRZYMANE",
}

type FormularzStan = {
  temperaturaMinC: string
  socPct: string
  produkcjaPv: ProdukcjaPv
}

const STAN_POCZATKOWY: FormularzStan = {
  temperaturaMinC: "",
  socPct: "",
  produkcjaPv: "",
}

export default function GrzalkiBmsMrozPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("grzalki-bms-mroz", STAN_POCZATKOWY)
  const { temperaturaMinC, socPct, produkcjaPv } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setTemperaturaMinC = (a: string | ((p: string) => string)) => setPole("temperaturaMinC", a)
  const setSocPct = (a: string | ((p: string) => string)) => setPole("socPct", a)
  const setProdukcjaPv = (a: ProdukcjaPv | ((p: ProdukcjaPv) => ProdukcjaPv)) => setPole("produkcjaPv", a)

  const result = useMemo(
    () =>
      calculateGrzalkiBmsMroz({
        temperaturaMinC: temperaturaMinC === "" ? null : Number(temperaturaMinC),
        socPct: socPct === "" ? 0 : Number(socPct),
        produkcjaPv,
      }),
    [temperaturaMinC, socPct, produkcjaPv],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const werdykt =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : result.status === "OUT_OF_SCOPE"
          ? "out-of-scope"
          : hasCritical
            ? "red"
            : result.status === "VALID_WITH_WARNINGS"
              ? "yellow"
              : "green"

  const werdyktPoziom: Record<Exclude<typeof werdykt, "incomplete" | "out-of-scope">, WerdyktPoziom> = {
    invalid: "blad",
    red: "blad",
    yellow: "uwaga",
    green: "ok",
  }

  const werdyktEtykieta: Record<Exclude<typeof werdykt, "incomplete" | "out-of-scope">, string> = {
    invalid: t("UI-GRZBMSMRO-OCENIC-SPRAWDZ-WPISANE"),
    red: t("UI-GRZBMSMRO-GRZANIE-WSTRZYMANE-LADOWANIE"),
    yellow: t("UI-GRZBMSMRO-GRZANIE-Z-BATERII"),
    green: t(ETYKIETY_ZRODLA[result.value.zrodloGrzania] ?? "UI-GRZBMSMRO-ZALECANE"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/grzalki-bms-mroz" />
      <NaglowekEkranu
        tytul={t("UI-GRZBMSMRO-GRZALKI-BMS-OCHRONA")}
        ekran="grzalki-bms-mroz" wynik={result}
        parametry={{ progTemp: PROG_TEMPERATURY_GRZANIA_C, progSoc: PROG_SOC_WSTRZYMANIA_PCT }}
      >
        {t("UI-GRZBMSMRO-MARNUJ-PRADU-BATERII")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-GRZBMSMRO-NAJNIZSZA-SPODZIEWANA-TEMPER")}
          unit="°C"
          type="number"
          inputMode="decimal"
          value={temperaturaMinC}
          onChange={(e) => setTemperaturaMinC(e.target.value)}
          pomoc={<PomocPola ekran="grzalki-bms-mroz" pole="temperatura" params={{ progTemp: PROG_TEMPERATURY_GRZANIA_C, progSoc: PROG_SOC_WSTRZYMANIA_PCT }} />}
        />
        <Pole
          label={t("UI-GRZBMSMRO-BIEZACY-SOC-BATERII")}
          unit="%"
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={socPct}
          onChange={(e) => setSocPct(e.target.value)}
          pomoc={<PomocPola ekran="grzalki-bms-mroz" pole="soc" params={{ progTemp: PROG_TEMPERATURY_GRZANIA_C, progSoc: PROG_SOC_WSTRZYMANIA_PCT }} />}
        />
        <PoleSelect
          label={t("UI-GRZBMSMRO-TEJ-CHWILI-PRODUKCJA")}
          value={produkcjaPv}
          onChange={(e) => setProdukcjaPv(e.target.value as ProdukcjaPv)}
          pomoc={<PomocPola ekran="grzalki-bms-mroz" pole="pv" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="tak">{t("UI-TAK-DUZE")}</option>
          <option value="nie">{t("UI-NIE-DUZE")}</option>
        </PoleSelect>
      </div>

      {werdykt === "incomplete" ? (
        <p className="text-small text-muted-foreground">
          {t("UI-GRZBMSMRO-WYPELNIJ-DANE-ZEBY")}
        </p>
      ) : werdykt === "out-of-scope" ? (
        <WerdyktPanel poziom="uwaga" etykieta={t("UI-GRZBMSMRO-GRANICA-NIEROZSTRZYGNIETA-ZR")}>
          <p className="text-small">
            {t("UI-GRZBMSMRO-SOC-DOKLADNIE-ZRODLO", { PROG_SOC_WSTRZYMANIA_PCT })}
          </p>
        </WerdyktPanel>
      ) : (
        <WerdyktPanel poziom={werdyktPoziom[werdykt]} etykieta={werdyktEtykieta[werdykt]}>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} warnings={[]} />
        </WerdyktPanel>
      )}

      <div className="rounded-lg border bg-muted/30 p-4 text-caption text-muted-foreground">
        <p className="font-medium text-foreground">
          {t("UI-GRZBMSMRO-DODATKOWY-BILANS-ENERGII")}
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {PRZYKLADY_BILANSU_GRZANIA.map((tekst) => (
            <li key={tekst}>{tekst}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}
