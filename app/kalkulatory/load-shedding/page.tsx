"use client"

import { useMemo } from "react"
import { calculateLoadShedding } from "@/lib/core/modules/zapotrzebowanie/load-shedding/calculator"
import type { LoadSheddingInput } from "@/lib/core/modules/zapotrzebowanie/load-shedding/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT, PROG_ODLACZENIA_PRIORYTET_3_SOC_PCT } from "@/lib/core/modules/zapotrzebowanie/load-shedding/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = {
  priorytet: LoadSheddingInput["priorytet"]
  socPct: string
  maNadwyzkePv: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  priorytet: 0,
  socPct: "",
  maNadwyzkePv: false,
}

export default function LoadSheddingPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("load-shedding", STAN_POCZATKOWY)
  const { priorytet, socPct, maNadwyzkePv } = stan

  function setPole<K extends keyof FormularzStan>(
    pole: K,
    akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K]),
  ) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPriorytet = (a: LoadSheddingInput["priorytet"] | ((p: LoadSheddingInput["priorytet"]) => LoadSheddingInput["priorytet"])) =>
    setPole("priorytet", a)
  const setSocPct = (a: string | ((p: string) => string)) => setPole("socPct", a)
  const setMaNadwyzkePv = (a: boolean | ((p: boolean) => boolean)) => setPole("maNadwyzkePv", a)

  const result = useMemo(
    () =>
      calculateLoadShedding({
        priorytet,
        socPct: socPct === "" ? null : Number(socPct),
        maNadwyzkePv,
      }),
    [priorytet, socPct, maNadwyzkePv],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/load-shedding" />
      <NaglowekEkranu
        tytul={t("UI-LOASHE-MACIERZ-PRIORYTETOW-ODLACZAN")}
        ekran="load-shedding"
        wynik={result}
        parametry={{ prog2: PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT, prog3: PROG_ODLACZENIA_PRIORYTET_3_SOC_PCT }}
      >
        {t("UI-LOASHE-SYSTEM-KTORY-SAM")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-LOASHE-PRIORYTET-ODBIORNIKA")}
          value={priorytet}
          onChange={(e) => setPriorytet(Number(e.target.value) as LoadSheddingInput["priorytet"])}
          pomoc={<PomocPola ekran="load-shedding" pole="priorytet" />}
        >
          <option value={0}>{t("UI-WYBIERZ")}</option>
          <option value={1}>{t("UI-LOASHE-KRYTYCZNY-NIGDY-ODLACZANY")}</option>
          <option value={2}>{t("UI-LOASHE-KOMFORT-ODLACZANY-SOC")}</option>
          <option value={3}>{t("UI-LOASHE-NADWYZKOWY-ODLACZANY-SOC")}</option>
        </PoleSelect>
        <Pole
          label={t("UI-LOASHE-AKTUALNY-SOC-BATERII")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={socPct}
          onChange={(e) => setSocPct(e.target.value)}
          pomoc={<PomocPola ekran="load-shedding" pole="soc" />}
        />
        {priorytet === 3 && (
          <PoleCheckbox
            id="ma-nadwyzke-pv"
            label={t("UI-LOASHE-OBECNIE-NADWYZKA-PRODUKCJI")}
            checked={maNadwyzkePv}
            onChange={(e) => setMaNadwyzkePv(e.target.checked)}
          />
        )}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-LOASHE-WYBIERZ-PRIORYTET-WPISZ")}</p>
      ) : result.status === "INVALID_INPUT" ? (
        <p className="text-small text-werdykt-blad">{t("UI-LOASHE-SOC-MUSI-BYC")}</p>
      ) : (
        <WerdyktPanel
          poziom={result.value.odlaczone ? "uwaga" : "ok"}
          etykieta={result.value.odlaczone ? t("UI-LOASHE-ODLACZONY-TERAZ") : t("UI-LOASHE-AKTYWNY")}
        >
          <WynikGlowny>{result.value.odlaczone ? t("UI-LOASHE-ODLACZONY") : t("UI-LOASHE-AKTYWNY")}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
