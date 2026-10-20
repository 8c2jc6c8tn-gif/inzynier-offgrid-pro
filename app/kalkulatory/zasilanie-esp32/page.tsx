"use client"

import { useMemo } from "react"
import { calculateZasilanieEsp32 } from "@/lib/core/modules/esp32/zasilanie-esp32/calculator"
import type { SposobZasilania, ZasilanieEsp32Input } from "@/lib/core/modules/esp32/zasilanie-esp32/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { useTranslate, useFormaty } from "@/lib/i18n/language-context"

type PoleLiczbowe = Exclude<keyof ZasilanieEsp32Input, "sposob">
type FormularzStan = Record<PoleLiczbowe, string> & { sposob: SposobZasilania | "" }

const STAN_POCZATKOWY: FormularzStan = {
  sposob: "",
  napiecieMagistraliV: "",
  napiecieMagistraliMaxV: "",
  poborMocyW: "",
  napiecieWyjscioweV: "5",
  napiecieWejscioweMaxV: "",
  pradWyjsciowyMaxA: "",
  sprawnoscPct: "",
}

const POLA: { pole: PoleLiczbowe; label: string; unit: string }[] = [
  { pole: "napiecieMagistraliV", label: "UI-ZASESP-NAPIECIE-MAGISTRALI-NOMINALN", unit: "V" },
  { pole: "napiecieMagistraliMaxV", label: "UI-ZASESP-NAJWYZSZE-NAPIECIE-MAGISTRAL", unit: "V" },
  { pole: "poborMocyW", label: "UI-ZASESP-POBOR-ESP32-CZUJNIKOW", unit: "W" },
  { pole: "napiecieWyjscioweV", label: "UI-ZASESP-NAPIECIE-WYJSCIOWE-PRZETWORN", unit: "V" },
  { pole: "napiecieWejscioweMaxV", label: "UI-ZASESP-MAKS-NAPIECIE-WEJSCIOWE", unit: "V" },
  { pole: "pradWyjsciowyMaxA", label: "UI-ZASESP-MAKS-PRAD-WYJSCIOWY", unit: "A" },
  { pole: "sprawnoscPct", label: "UI-ZASESP-SPRAWNOSC-PRZETWORNICY", unit: "%" },
]

const liczba = (v: string) => (v === "" ? null : Number(v))

export default function ZasilanieEsp32Page() {
  const t = useTranslate()
  const { f2 } = useFormaty()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("zasilanie-esp32", STAN_POCZATKOWY)
  const result = useMemo(() => {
    const { sposob, ...liczby } = stan
    return calculateZasilanieEsp32({
      ...(Object.fromEntries(Object.entries(liczby).map(([k, v]) => [k, liczba(v)])) as Record<PoleLiczbowe, number | null>),
      sposob: sposob === "" ? null : sposob,
    })
  }, [stan])
  const { pradWyjsciowyA, pradWejsciowyA } = result.value
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/zasilanie-esp32" />
      <NaglowekEkranu tytul={t("UI-ZASESP-ZASILANIE-ESP32-MAGISTRALI")} ekran="zasilanie-esp32" wynik={result}>
        {t("UI-ZASESP-ESP32-POTRZEBUJE-ALBO")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label={t("UI-ZASESP-ZASILASZ-ESP32")}
          value={stan.sposob}
          onChange={(e) => setStan((prev) => ({ ...prev, sposob: e.target.value as FormularzStan["sposob"] }))}
          pomoc={<PomocPola ekran="zasilanie-esp32" pole="sposob" />}
        >
          <option value="">{t("UI-WYBIERZ")}</option>
          <option value="przetwornica">{t("UI-ZASESP-PRZETWORNICE-STEP-DOWN")}</option>
          <option value="bezposrednio">{t("UI-ZASESP-BEZPOSREDNIO-MAGISTRALI")}</option>
        </PoleSelect>
        {stan.sposob === "przetwornica" &&
          POLA.map(({ pole, label, unit }) => (
            <Pole
              key={pole}
              label={t(label)}
              unit={unit}
              type="number"
              inputMode="decimal"
              min={0}
              value={stan[pole]}
              onChange={(e) => setStan((prev) => ({ ...prev, [pole]: e.target.value }))}
              pomoc={<PomocPola ekran="zasilanie-esp32" pole={pole} />}
            />
          ))}
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-ZASESP-POLICZYC-SPRAWDZ-WPISANE")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-ZASESP-WYBIERZ-SPOSOB-ZASILANIA")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={hasCritical ? t("UI-ZASESP-ESP32-PRZETWORNICA-ZOSTANIE") : hasWarning ? t("UI-ZASESP-PRZETWORNICA-SLABA") : t("UI-ZASESP-ZASILANIE-POPRAWNE")}
        >
          {pradWejsciowyA !== null && <WynikGlowny>{t("UI-ZASESP-MAGISTRALI", { pradWejsciowyA: f2(pradWejsciowyA) })}</WynikGlowny>}
          {pradWyjsciowyA !== null && <p className="mt-2 text-small">{t("UI-ZASESP-STRONIE-ESP32", { pradWyjsciowyA: f2(pradWyjsciowyA) })}</p>}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
