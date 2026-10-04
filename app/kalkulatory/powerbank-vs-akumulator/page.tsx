"use client"

import { useMemo } from "react"
import { calculatePowerbankVsAkumulator } from "@/lib/core/modules/kalkulator-mobilny/powerbank-vs-akumulator/calculator"
import type { PowerbankVsAkumulatorInput } from "@/lib/core/modules/kalkulator-mobilny/powerbank-vs-akumulator/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof PowerbankVsAkumulatorInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  mocUrzadzeniaW: "",
  energiaNaUzycieWh: "",
  powerbankWh: "",
  powerbankMocWyjsciaW: "",
  akumulatorAh: "",
  akumulatorV: "",
  akumulatorUzytecznaPct: "",
  sprawnoscPct: "",
}

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function PowerbankVsAkumulatorPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("powerbank-vs-akumulator", STAN_POCZATKOWY)
  const pole = (klucz: keyof FormularzStan) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculatePowerbankVsAkumulator({
        mocUrzadzeniaW: liczba(stan.mocUrzadzeniaW),
        energiaNaUzycieWh: liczba(stan.energiaNaUzycieWh),
        powerbankWh: liczba(stan.powerbankWh),
        powerbankMocWyjsciaW: liczba(stan.powerbankMocWyjsciaW),
        akumulatorAh: liczba(stan.akumulatorAh),
        akumulatorV: liczba(stan.akumulatorV),
        akumulatorUzytecznaPct: liczba(stan.akumulatorUzytecznaPct),
        sprawnoscPct: liczba(stan.sprawnoscPct),
      }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/powerbank-vs-akumulator" />
      <NaglowekEkranu tytul={t("UI-M12-PBA-TYTUL")} ekran="powerbank-vs-akumulator" wynik={result}>
        {t("UI-M12-PBA-OPIS")}
      </NaglowekEkranu>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-PBA-URZADZENIE")}</legend>
        <Pole label={t("UI-M12-PBA-MOC-URZADZENIA")} unit="W" {...pole("mocUrzadzeniaW")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="mocUrzadzenia" />} />
        <Pole label={t("UI-M12-PBA-ENERGIA-UZYCIA")} unit="Wh" {...pole("energiaNaUzycieWh")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="energiaUzycia" />} />
        <Pole label={t("UI-M12-PBA-SPRAWNOSC")} unit="%" max={100} {...pole("sprawnoscPct")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="sprawnosc" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-PBA-POWERBANK")}</legend>
        <Pole label={t("UI-M12-PBA-PB-WH")} unit="Wh" {...pole("powerbankWh")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="pbWh" />} />
        <Pole label={t("UI-M12-PBA-PB-MOC")} unit="W" {...pole("powerbankMocWyjsciaW")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="pbMoc" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-PBA-AKUMULATOR")}</legend>
        <Pole label={t("UI-M12-PBA-AK-AH")} unit="Ah" {...pole("akumulatorAh")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="akAh" />} />
        <Pole label={t("UI-M12-PBA-AK-V")} unit="V" {...pole("akumulatorV")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="akV" />} />
        <Pole label={t("UI-M12-PBA-AK-UZYTECZNA")} unit="%" max={100} {...pole("akumulatorUzytecznaPct")} pomoc={<PomocPola ekran="powerbank-vs-akumulator" pole="akUzyteczna" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-PBA-W-UWAGA" : "UI-M12-PBA-W-OK")}>
          <WynikGlowny>{t("UI-M12-PBA-WYNIK", { pb: r1(v.uzyciaPowerbank), ak: r1(v.uzyciaAkumulator) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M12-PBA-SZCZEGOLY", { pb: Math.round(v.energiaPowerbankuWh), ak: Math.round(v.energiaAkumulatoraWh) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
