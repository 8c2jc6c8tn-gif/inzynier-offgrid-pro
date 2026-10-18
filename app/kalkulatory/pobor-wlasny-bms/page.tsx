"use client"

import { useMemo } from "react"
import { calculatePoborWlasnyBms } from "@/lib/core/modules/baterie/pobor-wlasny-bms/calculator"
import {
  POBOR_CIAGLE_TYPOWY_MAX_W,
  POBOR_CIAGLE_TYPOWY_MIN_W,
  POBOR_USPIENIE_TYPOWY_MAX_W,
  POBOR_USPIENIE_TYPOWY_MIN_W,
} from "@/lib/core/modules/baterie/pobor-wlasny-bms/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormatLiczby } from "@/lib/i18n/language-context"

type FormularzStan = {
  poborCiagleW: string
  poborUspienieW: string
}

const STAN_POCZATKOWY: FormularzStan = {
  poborCiagleW: "",
  poborUspienieW: "",
}

export default function PoborWlasnyBmsPage() {
  const t = useTranslate()
  const formatLiczbe = useFormatLiczby()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("pobor-wlasny-bms", STAN_POCZATKOWY)
  const { poborCiagleW, poborUspienieW } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, akcja: FormularzStan[K] | ((prev: FormularzStan[K]) => FormularzStan[K])) {
    setStan((prev) => ({
      ...prev,
      [pole]: typeof akcja === "function" ? (akcja as (p: FormularzStan[K]) => FormularzStan[K])(prev[pole]) : akcja,
    }))
  }
  const setPoborCiagleW = (a: string | ((p: string) => string)) => setPole("poborCiagleW", a)
  const setPoborUspienieW = (a: string | ((p: string) => string)) => setPole("poborUspienieW", a)

  const result = useMemo(
    () =>
      calculatePoborWlasnyBms({
        poborCiagleW: poborCiagleW === "" ? 0 : Number(poborCiagleW),
        poborUspienieW: poborUspienieW === "" ? 0 : Number(poborUspienieW),
      }),
    [poborCiagleW, poborUspienieW],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/pobor-wlasny-bms" />
      <NaglowekEkranu tytul={t("UI-POBWLABMS-POBOR-WLASNY-BMS")} ekran="pobor-wlasny-bms" wynik={result}>
        {t("UI-POBWLABMS-BMS-TEZ-ODBIORNIK")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label={t("UI-POBWLABMS-POBOR-TRYBIE-PRACY")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={poborCiagleW}
          onChange={(e) => setPoborCiagleW(e.target.value)}
          pomoc={<PomocPola ekran="pobor-wlasny-bms" pole="ciagle" params={{ ciagleMin: POBOR_CIAGLE_TYPOWY_MIN_W, ciagleMax: POBOR_CIAGLE_TYPOWY_MAX_W }} />}
        />
        <Pole
          label={t("UI-POBWLABMS-POBOR-TRYBIE-USPIENIA")}
          unit="W"
          type="number"
          inputMode="decimal"
          min={0}
          value={poborUspienieW}
          onChange={(e) => setPoborUspienieW(e.target.value)}
          pomoc={<PomocPola ekran="pobor-wlasny-bms" pole="uspienie" params={{ uspienieMin: POBOR_USPIENIE_TYPOWY_MIN_W, uspienieMax: POBOR_USPIENIE_TYPOWY_MAX_W }} />}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-POBWLABMS-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-POBWLABMS-WYPELNIJ-OBA-POLA")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-POBWLABMS-ROCZNA-STRATA-PRACY")}>
          <WynikGlowny>{formatLiczbe(result.value.strataRocznaCiagleKwh)} kWh</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-POBWLABMS-TRYBIE-USPIENIA-KWH", { strataDoboweUspienieKwh: formatLiczbe(result.value.strataDoboweUspienieKwh), strataRocznaUspienieKwh: formatLiczbe(result.value.strataRocznaUspienieKwh), oszczednoscRocznaKwh: formatLiczbe(result.value.oszczednoscRocznaKwh) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
