"use client"

import { useMemo } from "react"
import { calculatePowlokiAntyrefleksyjne } from "@/lib/core/modules/pv/powloki-antyrefleksyjne/calculator"
import {
  WZROST_UZYSKU_MAX_PCT,
  WZROST_UZYSKU_MIN_PCT,
} from "@/lib/core/modules/pv/powloki-antyrefleksyjne/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { rocznyUzyskKwh: string }

const STAN_POCZATKOWY: FormularzStan = { rocznyUzyskKwh: "" }

const formatKwh = (kwh: number) => kwh.toLocaleString("pl-PL", { maximumFractionDigits: 1 })

export default function PowlokiAntyrefleksyjnePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("powloki-antyrefleksyjne", STAN_POCZATKOWY)
  const { rocznyUzyskKwh } = stan

  const result = useMemo(
    () => calculatePowlokiAntyrefleksyjne({ rocznyUzyskKwh: rocznyUzyskKwh === "" ? 0 : Number(rocznyUzyskKwh) }),
    [rocznyUzyskKwh],
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/powloki-antyrefleksyjne" />
      <NaglowekEkranu
        tytul="Powłoki antyrefleksyjne"
        ekran="powloki-antyrefleksyjne"
        wzor={result.formula}
        parametry={{ wzrostMin: WZROST_UZYSKU_MIN_PCT, wzrostMax: WZROST_UZYSKU_MAX_PCT }}
      >
        Powłoka antyrefleksyjna (i teksturowane szkło) zmniejsza odbicie światła od powierzchni panelu,
        więc więcej energii dociera do ogniw — typowo +{WZROST_UZYSKU_MIN_PCT}–{WZROST_UZYSKU_MAX_PCT}%
        uzysku rocznie. Moduł 3, Ekran 23.
      </NaglowekEkranu>

      <Pole
        label="Roczny uzysk instalacji (bez powłoki)"
        unit="kWh/rok"
        type="number"
        inputMode="decimal"
        min={0}
        value={rocznyUzyskKwh}
        onChange={(e) => setStan({ rocznyUzyskKwh: e.target.value })}
        pomoc={<PomocPola ekran="powloki-antyrefleksyjne" pole="uzysk" />}
      />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">
          Wpisz roczny uzysk, żeby przeliczyć {WZROST_UZYSKU_MIN_PCT}–{WZROST_UZYSKU_MAX_PCT}% na kWh.
        </p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta="Dodatkowy uzysk dzięki powłoce">
          <WynikGlowny>
            +{formatKwh(result.value.zyskMinKwh)}–{formatKwh(result.value.zyskMaxKwh)} kWh/rok
          </WynikGlowny>
          {result.warnings.map((w) => (
            <p key={w.code} className="mt-1 text-small">
              {w.message ?? t(w.i18nKey ?? w.code, w.params)}
            </p>
          ))}
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}

      
    </main>
  )
}
