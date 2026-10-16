"use client"

import { useMemo } from "react"
import { calculateAkumulatorSamochodowy } from "@/lib/core/modules/kalkulator-mobilny/akumulator-samochodowy/calculator"
import {
  UZYTECZNA_ROZRUCHOWY_MAX_PCT,
  UZYTECZNA_ROZRUCHOWY_MIN_PCT,
} from "@/lib/core/modules/kalkulator-mobilny/akumulator-samochodowy/constants"
import type { TypAkumulatoraSamochodowego } from "@/lib/core/modules/kalkulator-mobilny/akumulator-samochodowy/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useTranslate } from "@/lib/i18n/language-context"
import { Pole, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { NapiecieZProfilu } from "@/components/napiecie-z-profilu"

type FormularzStan = {
  typ: TypAkumulatoraSamochodowego | ""
  pojemnoscAh: string
  napiecieV: string
  uzytecznaPct: string
  mocW: string
  planowanyCzasH: string
}

const STAN_POCZATKOWY: FormularzStan = { typ: "", pojemnoscAh: "", napiecieV: "", uzytecznaPct: "", mocW: "", planowanyCzasH: "" }

const TYPY: { id: TypAkumulatoraSamochodowego; label: string }[] = [
  { id: "rozruchowy", label: "UI-M12-AS-TYP-ROZRUCHOWY" },
  { id: "agm", label: "UI-M12-AS-TYP-AGM" },
  { id: "kwasowy", label: "UI-M12-AS-TYP-KWASOWY" },
]

const liczba = (s: string) => (s === "" ? 0 : Number(s))
const r1 = (x: number) => Math.round(x * 10) / 10

export default function AkumulatorSamochodowyPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("akumulator-samochodowy", STAN_POCZATKOWY)
  const ustaw = (pole: keyof FormularzStan) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStan((prev) => ({ ...prev, [pole]: e.target.value }))

  const result = useMemo(
    () =>
      calculateAkumulatorSamochodowy({
        typ: stan.typ === "" ? null : stan.typ,
        pojemnoscAh: liczba(stan.pojemnoscAh),
        napiecieV: liczba(stan.napiecieV),
        uzytecznaPct: liczba(stan.uzytecznaPct),
        mocW: liczba(stan.mocW),
        planowanyCzasH: liczba(stan.planowanyCzasH),
      }),
    [stan],
  )
  // Directive #4: the hard stop comes from warning levels, not from the Status enum.
  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const hasWarning = result.warnings.some((w) => w.level === "warning")

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/akumulator-samochodowy" />
      <NaglowekEkranu tytul={t("UI-M12-AS-TYTUL")} ekran="akumulator-samochodowy" wynik={result}>
        {t("UI-M12-AS-OPIS")}
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect label={t("UI-M12-AS-TYP")} value={stan.typ} onChange={ustaw("typ")} pomoc={<PomocPola ekran="akumulator-samochodowy" pole="typ" />}>
          <option value="">{t("UI-WYBIERZ")}</option>
          {TYPY.map((o) => (
            <option key={o.id} value={o.id}>
              {t(o.label)}
            </option>
          ))}
        </PoleSelect>
        <Pole label={t("UI-M12-AS-POJEMNOSC")} unit="Ah" type="number" inputMode="decimal" min={0} value={stan.pojemnoscAh} onChange={ustaw("pojemnoscAh")} pomoc={<PomocPola ekran="akumulator-samochodowy" pole="pojemnosc" />} />
        <Pole label={t("UI-M12-AS-NAPIECIE")} unit="V" type="number" inputMode="decimal" min={0} value={stan.napiecieV} onChange={ustaw("napiecieV")} pomoc={<PomocPola ekran="akumulator-samochodowy" pole="napiecie" />} />
        <NapiecieZProfilu aktualne={stan.napiecieV} onUzyj={(v) => setStan((prev) => ({ ...prev, napiecieV: v }))} />
        <Pole
          label={t("UI-M12-AS-UZYTECZNA")}
          unit="%"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          value={stan.uzytecznaPct}
          onChange={ustaw("uzytecznaPct")}
          pomoc={
            <PomocPola
              ekran="akumulator-samochodowy"
              pole="uzyteczna"
              params={{ min: UZYTECZNA_ROZRUCHOWY_MIN_PCT, max: UZYTECZNA_ROZRUCHOWY_MAX_PCT }}
            />
          }
        />
        <Pole label={t("UI-M12-AS-MOC")} unit="W" type="number" inputMode="decimal" min={0} value={stan.mocW} onChange={ustaw("mocW")} pomoc={<PomocPola ekran="akumulator-samochodowy" pole="moc" />} />
        <Pole label={t("UI-M12-AS-PLANOWANY")} unit="h" type="number" inputMode="decimal" min={0} value={stan.planowanyCzasH} onChange={ustaw("planowanyCzasH")} pomoc={<PomocPola ekran="akumulator-samochodowy" pole="planowany" />} />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M12-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M12-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : hasWarning ? "uwaga" : "ok"}
          etykieta={t(hasCritical ? "UI-M12-AS-W-STOP" : hasWarning ? "UI-M12-AS-W-UWAGA" : "UI-M12-AS-W-OK")}
        >
          <WynikGlowny>{t("UI-M12-X-H", { x: r1(result.value.czasH) })}</WynikGlowny>
          <p className="mt-1 text-small">
            {t("UI-M12-AS-SZCZEGOLY", {
              prad: r1(result.value.pradA),
              ah: r1(result.value.pojemnoscUzytecznaAh),
              wh: Math.round(result.value.energiaUzytecznaWh),
            })}
          </p>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
        </WerdyktPanel>
      )}
    </main>
  )
}
