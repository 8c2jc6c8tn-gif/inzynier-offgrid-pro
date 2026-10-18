"use client"

import { useMemo } from "react"
import { calculateBlackout } from "@/lib/core/modules/stress-test/blackout/calculator"
import type { BlackoutInput } from "@/lib/core/modules/stress-test/blackout/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"

type FormularzStan = Record<keyof BlackoutInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  pojemnoscKwh: "",
  socStartPct: "100",
  socMinPct: "",
  sprawnoscFalownikaPct: "",
  zuzycieDoboweKwh: "",
  dniScenariusza: "14",
  agregatKwhDoba: "",
}

const POLA: { pole: keyof BlackoutInput; label: string; unit: string }[] = [
  { pole: "pojemnoscKwh", label: "UI-BLA-POJEMNOSC-BATERII-ZNAMIONOWA", unit: "kWh" },
  { pole: "socStartPct", label: "UI-BLA-SOC-POCZATKU", unit: "%" },
  { pole: "socMinPct", label: "UI-BLA-KRYTYCZNE-MINIMUM-SOC", unit: "%" },
  { pole: "sprawnoscFalownikaPct", label: "UI-BLA-SPRAWNOSC-FALOWNIKA", unit: "%" },
  { pole: "zuzycieDoboweKwh", label: "UI-BLA-ZUZYCIE-DOBOWE-MROZIE", unit: "UI-J-KWH-DOBA" },
  { pole: "dniScenariusza", label: "UI-BLA-DNI-BEZ-SLONCA", unit: "UI-J-DNI" },
  { pole: "agregatKwhDoba", label: "UI-BLA-ENERGIA-AGREGATU-OPCJONALNIE", unit: "UI-J-KWH-DOBA" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))

export default function BlackoutPage() {
  const t = useTranslate()
  const { f0, f1 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("blackout", STAN_POCZATKOWY)

  const result = useMemo(
    () =>
      calculateBlackout(
        Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as BlackoutInput,
      ),
    [stan],
  )
  const { energiaDostepnaKwh, dniPrzetrwania, dzienAwarii, dodatkowaPojemnoscKwh, redukcjaZuzyciaPct } = result.value
  const padnie = dzienAwarii !== null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/blackout" />
      <NaglowekEkranu tytul={t("UI-BLA-BLACKOUT-DNI-BEZ")} ekran="blackout" wynik={result}>
        {t("UI-BLA-TEST-NAJGORSZEGO-KOSZMARU")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        {POLA.map(({ pole, label, unit }) => (
          <Pole
            key={pole}
            label={t(label)}
            unit={unit.startsWith("UI-") ? t(unit) : unit}
            type="number"
            inputMode="decimal"
            min={0}
            value={stan[pole]}
            onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
            pomoc={<PomocPola ekran="blackout" pole={pole} />}
          />
        ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-BLA-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-BLA-WPISZ-POJEMNOSC-SOC")}</p>
      ) : (
        <WerdyktPanel poziom={padnie ? "uwaga" : "ok"} etykieta={padnie ? t("UI-BLA-SYSTEM-PADNIE-DNIA", { dzienAwarii }) : t("UI-BLA-SYSTEM-PRZETRWA-SCENARIUSZ")}>
          <WynikGlowny>{dniPrzetrwania === null ? t("UI-BLA-AGREGAT-POKRYWA-ZUZYCIE") : t("UI-BLA-DNIA-BATERII", { dniPrzetrwania: f1(dniPrzetrwania) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {energiaDostepnaKwh !== null && <li>{t("UI-BLA-ENERGIA-MINIMUM-KWH", { energiaDostepnaKwh: f1(energiaDostepnaKwh) })}</li>}
            {padnie && dodatkowaPojemnoscKwh !== null && <li>{t("UI-BLA-BRAKUJE-KWH-BATERII", { p: f0(Math.ceil(dodatkowaPojemnoscKwh)) })}</li>}
            {padnie && redukcjaZuzyciaPct !== null && <li>{t("UI-BLA-ALBO-OGRANICZENIE-ZUZYCIA", { p: f0(Math.ceil(redukcjaZuzyciaPct)) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
