"use client"

import { useMemo } from "react"
import { BATTERY_TECHNOLOGIES } from "@/lib/core/modules/baterie/porownanie-technologii/constants"
import { calculateAkumulatorKampera } from "@/lib/core/modules/kalkulator-mobilny/akumulator-kampera/calculator"
import type { AkumulatorKamperaInput } from "@/lib/core/modules/kalkulator-mobilny/akumulator-kampera/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof AkumulatorKamperaInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  zapotrzebowanieWhDoba: "",
  dniBezLadowania: "",
  napiecieV: "",
  agmAh: "",
  agmCenaZl: "",
  agmMasaKg: "",
  agmDodPct: "",
  agmCykle: "",
  lfpAh: "",
  lfpCenaZl: "",
  lfpMasaKg: "",
  lfpDodPct: "",
  lfpCykle: "",
  zapasMasyKg: "",
}

const KWOTY = przeliczPola<FormularzStan>("agmCenaZl", "lfpCenaZl")

// Hints only (Directive #1): the reference cycle counts from M4/E30.
const opisCykli = (id: string) => BATTERY_TECHNOLOGIES.find((x) => x.id === id)!.cyklePrzyDodOpis
const PODPOWIEDZ = { cykleAgm: opisCykli("agm"), cykleLfp: opisCykli("lifepo4") }

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r2 = (x: number) => Math.round(x * 100) / 100

export default function AkumulatorKamperaPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("akumulator-kampera", STAN_POCZATKOWY, KWOTY)
  const pole = (klucz: keyof FormularzStan) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateAkumulatorKampera(
        Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as AkumulatorKamperaInput,
      ),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/akumulator-kampera" />
      <NaglowekEkranu tytul={t("UI-M12-AKK-TYTUL")} ekran="akumulator-kampera" wynik={result}>
        {t("UI-M12-AKK-OPIS")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-AKK-POTRZEBA")}</legend>
        <Pole label={t("UI-M12-AKK-ZAPOTRZEBOWANIE")} unit="Wh" {...pole("zapotrzebowanieWhDoba")} pomoc={<PomocPola ekran="akumulator-kampera" pole="zapotrzebowanie" />} />
        <Pole label={t("UI-M12-AKK-DNI")} {...pole("dniBezLadowania")} pomoc={<PomocPola ekran="akumulator-kampera" pole="dni" />} />
        <Pole label={t("UI-M12-MA-NAPIECIE")} unit="V" {...pole("napiecieV")} pomoc={<PomocPola ekran="akumulator-kampera" pole="napiecie" />} />
        <Pole label={t("UI-M12-AKK-ZAPAS-MASY")} unit="kg" {...pole("zapasMasyKg")} pomoc={<PomocPola ekran="akumulator-kampera" pole="zapasMasy" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-AKK-AGM")}</legend>
        <Pole label={t("UI-M12-MA-POJEMNOSC")} unit="Ah" {...pole("agmAh")} pomoc={<PomocPola ekran="akumulator-kampera" pole="agmAh" />} />
        <Pole label={t("UI-M12-AKK-CENA")} unit={t("UI-M12-J-ZL")} {...pole("agmCenaZl")} pomoc={<PomocPola ekran="akumulator-kampera" pole="agmCena" />} />
        <Pole label={t("UI-M12-AKK-MASA")} unit="kg" {...pole("agmMasaKg")} pomoc={<PomocPola ekran="akumulator-kampera" pole="agmMasa" />} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("agmDodPct")} pomoc={<PomocPola ekran="akumulator-kampera" pole="agmDod" params={PODPOWIEDZ} />} />
        <Pole label={t("UI-M12-AKK-CYKLE")} {...pole("agmCykle")} pomoc={<PomocPola ekran="akumulator-kampera" pole="agmCykle" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-AKK-LFP")}</legend>
        <Pole label={t("UI-M12-MA-POJEMNOSC")} unit="Ah" {...pole("lfpAh")} pomoc={<PomocPola ekran="akumulator-kampera" pole="lfpAh" />} />
        <Pole label={t("UI-M12-AKK-CENA")} unit={t("UI-M12-J-ZL")} {...pole("lfpCenaZl")} pomoc={<PomocPola ekran="akumulator-kampera" pole="lfpCena" />} />
        <Pole label={t("UI-M12-AKK-MASA")} unit="kg" {...pole("lfpMasaKg")} pomoc={<PomocPola ekran="akumulator-kampera" pole="lfpMasa" />} />
        <Pole label={t("UI-M12-MA-DOD")} unit="%" max={100} {...pole("lfpDodPct")} pomoc={<PomocPola ekran="akumulator-kampera" pole="lfpDod" params={PODPOWIEDZ} />} />
        <Pole label={t("UI-M12-AKK-CYKLE")} {...pole("lfpCykle")} pomoc={<PomocPola ekran="akumulator-kampera" pole="lfpCykle" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={t(hasWarning ? "UI-M12-AKK-W-UWAGA" : "UI-M12-AKK-W-OK")}>
          <WynikGlowny>{t("UI-M12-AKK-WYNIK", { wh: Math.round(v.potrzebaWh), agm: v.agm.sztuk, lfp: v.lfp.sztuk })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M12-AKK-WIERSZ-AGM", { kg: Math.round(v.agm.masaKg), zl: Math.round(v.agm.cenaZl), kwh: r2(v.agm.kosztKwhZyciaZl) })}
          </p>
          <p className="mt-1 text-small">
            {t("UI-M12-AKK-WIERSZ-LFP", { kg: Math.round(v.lfp.masaKg), zl: Math.round(v.lfp.cenaZl), kwh: r2(v.lfp.kosztKwhZyciaZl) })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
