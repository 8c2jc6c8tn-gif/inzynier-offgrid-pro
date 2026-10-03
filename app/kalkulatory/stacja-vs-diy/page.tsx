"use client"

import { useMemo } from "react"
import { calculateStacjaVsDiy } from "@/lib/core/modules/kalkulator-mobilny/stacja-vs-diy/calculator"
import type { StacjaVsDiyInput } from "@/lib/core/modules/kalkulator-mobilny/stacja-vs-diy/input"
import { DOD_LIFEPO4_TYPOWY_MAX_PCT, DOD_LIFEPO4_TYPOWY_MIN_PCT } from "@/lib/core/modules/baterie/dobor-pojemnosci/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { przeliczPola } from "@/lib/waluta/przelicz"
import { PrzeliczoneInfo } from "@/components/przeliczone-info"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = Record<keyof StacjaVsDiyInput, string>

const STAN_POCZATKOWY: FormularzStan = {
  cenaStacjiZl: "",
  pojemnoscStacjiWh: "",
  uzytecznaStacjiPct: "",
  masaStacjiKg: "",
  cenaDiyZl: "",
  pojemnoscDiyAh: "",
  napiecieDiyV: "",
  dodDiyPct: "",
  masaDiyKg: "",
}

/** Money fields converted when the display currency changes. */
const PRZELICZ_KWOTY = przeliczPola<FormularzStan>("cenaStacjiZl", "cenaDiyZl")

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

export default function StacjaVsDiyPage() {
  const t = useTranslate()
  const [stan, setStan, info] = usePersistedDraft<FormularzStan>("stacja-vs-diy", STAN_POCZATKOWY, PRZELICZ_KWOTY)
  const pole = (klucz: keyof FormularzStan) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan[klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setStan((prev) => ({ ...prev, [klucz]: e.target.value })),
  })

  const result = useMemo(
    () =>
      calculateStacjaVsDiy(
        Object.fromEntries(Object.entries(stan).map(([k, v]) => [k, liczba(v)])) as Record<keyof StacjaVsDiyInput, number>,
      ),
    [stan],
  )
  const v = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/stacja-vs-diy" />
      <NaglowekEkranu tytul={t("UI-M12-SD-TYTUL")} ekran="stacja-vs-diy" wynik={result}>
        {t("UI-M12-SD-OPIS")}
      </NaglowekEkranu>
      <PrzeliczoneInfo info={info} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-SD-STACJA")}</legend>
        <Pole label={t("UI-M12-SD-CENA")} unit={t("UI-M12-J-ZL")} {...pole("cenaStacjiZl")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="cenaStacji" />} />
        <Pole label={t("UI-M12-SD-POJEMNOSC-WH")} unit="Wh" {...pole("pojemnoscStacjiWh")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="pojemnoscStacji" />} />
        <Pole label={t("UI-M12-SD-UZYTECZNA")} unit="%" max={100} {...pole("uzytecznaStacjiPct")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="uzytecznaStacji" />} />
        <Pole label={t("UI-M12-SD-MASA")} unit="kg" {...pole("masaStacjiKg")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="masaStacji" />} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-small font-medium">{t("UI-M12-SD-DIY")}</legend>
        <Pole label={t("UI-M12-SD-CENA-DIY")} unit={t("UI-M12-J-ZL")} {...pole("cenaDiyZl")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="cenaDiy" />} />
        <Pole label={t("UI-M12-SD-POJEMNOSC-AH")} unit="Ah" {...pole("pojemnoscDiyAh")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="pojemnoscDiy" />} />
        <Pole label={t("UI-M12-SD-NAPIECIE")} unit="V" {...pole("napiecieDiyV")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="napiecieDiy" />} />
        <Pole
          label={t("UI-M12-SD-DOD")}
          unit="%"
          max={100}
          {...pole("dodDiyPct")}
          pomoc={<PomocPola ekran="stacja-vs-diy" pole="dodDiy" params={{ min: DOD_LIFEPO4_TYPOWY_MIN_PCT, max: DOD_LIFEPO4_TYPOWY_MAX_PCT }} />}
        />
        <Pole label={t("UI-M12-SD-MASA")} unit="kg" {...pole("masaDiyKg")} pomoc={<PomocPola ekran="stacja-vs-diy" pole="masaDiy" />} />
      </fieldset>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t(v.krotnoscDiy > 1 ? "UI-M12-SD-W-DIY" : "UI-M12-SD-W-STACJA")}>
          <WynikGlowny>{t("UI-M12-SD-KROTNOSC", { x: r1(v.krotnoscDiy) })}</WynikGlowny>
          <ul className="mt-1 text-small">
            <li>{t("UI-M12-SD-WIERSZ", { nazwa: t("UI-M12-SD-STACJA"), wh: Math.round(v.energiaStacjiWh), zl: r2(v.zlZaWhStacja) })}</li>
            <li>{t("UI-M12-SD-WIERSZ", { nazwa: t("UI-M12-SD-DIY"), wh: Math.round(v.energiaDiyWh), zl: r2(v.zlZaWhDiy) })}</li>
          </ul>
          {v.kgNaKwhStacja > 0 && v.kgNaKwhDiy > 0 && (
            <p className="mt-1 text-small">{t("UI-M12-SD-MASA-WIERSZ", { st: r1(v.kgNaKwhStacja), diy: r1(v.kgNaKwhDiy) })}</p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
