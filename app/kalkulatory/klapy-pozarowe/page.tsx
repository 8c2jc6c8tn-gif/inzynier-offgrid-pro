"use client"

import { useMemo } from "react"
import { calculateKlapyPozarowe } from "@/lib/core/modules/bezpieczenstwo/klapy-pozarowe/calculator"
import type { WentylacjaBudynku } from "@/lib/core/modules/bezpieczenstwo/klapy-pozarowe/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate } from "@/lib/i18n/language-context"

type Flagi = "wentylacjaWylaczanaPrzyPozarze" | "klapyZamykanePrzyPozarze" | "sygnalizacjaStanuKlap" | "maOddymianie"
type FormularzStan = { wentylacja: WentylacjaBudynku | "" } & Record<Flagi, boolean>

const STAN_POCZATKOWY: FormularzStan = {
  wentylacja: "",
  wentylacjaWylaczanaPrzyPozarze: false,
  klapyZamykanePrzyPozarze: false,
  sygnalizacjaStanuKlap: false,
  maOddymianie: false,
}

const FLAGI: { pole: Flagi; label: string }[] = [
  { pole: "wentylacjaWylaczanaPrzyPozarze", label: "UI-KLAPOZ-REKUPERACJA-WENTYLACJA-WYLAC" },
  { pole: "klapyZamykanePrzyPozarze", label: "UI-KLAPOZ-KLAPY-KANALACH-ZAMYKAJA" },
  { pole: "sygnalizacjaStanuKlap", label: "UI-KLAPOZ-STAN-KLAP-SYGNALIZOWANY" },
  { pole: "maOddymianie", label: "UI-KLAPOZ-WENTYLACJA-ODDYMIAJACA" },
]

export default function KlapyPozarowePage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("klapy-pozarowe", STAN_POCZATKOWY)

  const result = useMemo(
    () => calculateKlapyPozarowe({ ...stan, wentylacja: stan.wentylacja === "" ? null : stan.wentylacja }),
    [stan],
  )
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/klapy-pozarowe" />
      <NaglowekEkranu tytul={t("UI-KLAPOZ-KLAPY-POZAROWE-WENTYLACJA")} ekran="klapy-pozarowe" wynik={result}>
        {t("UI-KLAPOZ-DYM-ZABIJA-SZYBCIEJ")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-KLAPOZ-WENTYLACJA-BUDYNKU")}
          value={stan.wentylacja}
          onChange={(e) => setStan((prev) => ({ ...prev, wentylacja: e.target.value as FormularzStan["wentylacja"] }))}
          pomoc={<PomocPola ekran="klapy-pozarowe" pole="wentylacja" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="mechaniczna">{t("UI-KLAPOZ-MECHANICZNA-REKUPERACJA-KANA")}</option>
          <option value="brak">{t("UI-KLAPOZ-TYLKO-GRAWITACYJNA-BRAK")}</option>
        </PoleSelect>
        {stan.wentylacja === "mechaniczna" &&
          FLAGI.map(({ pole, label }) => (
            <PoleCheckbox
              key={pole}
              id={`klapy-${pole}`}
              label={t(label)}
              checked={stan[pole]}
              onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.checked }))}
            />
          ))}
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-KLAPOZ-WYBIERZ-RODZAJ-WENTYLACJI")}</p>
      ) : (
        <WerdyktPanel poziom={hasWarning ? "uwaga" : "ok"} etykieta={hasWarning ? t("UI-KLAPOZ-DYM-MOZE-ROZEJSC") : t("UI-KLAPOZ-REAKCJA-WENTYLACJI-POZAR")}>
          <WynikGlowny>{t("UI-KLAPOZ-BRAKI", { liczbaBrakow: result.value.liczbaBrakow })}</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
