"use client"

import { useMemo } from "react"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { calculateDefrostSezon } from "@/lib/core/modules/ogrzewanie/defrost-sezon/calculator"
import { useTranslate } from "@/lib/i18n/language-context"
import { liczba } from "@/lib/lokalizacja/model-dzialki"

type PolaScenariusza = "odstep" | "czas" | "godziny" | "dni"
type Scenariusz = Record<PolaScenariusza, string>
type Stan = { scenariusze: Scenariusz[]; zuzycie: string }

const PUSTY_SCENARIUSZ: Scenariusz = { odstep: "", czas: "", godziny: "", dni: "" }
const STAN_POCZATKOWY: Stan = { scenariusze: [PUSTY_SCENARIUSZ, PUSTY_SCENARIUSZ, PUSTY_SCENARIUSZ], zuzycie: "" }
const n = (s: string) => liczba(s) ?? 0
const r0 = (x: number) => Math.round(x)
const r1 = (x: number) => Math.round(x * 10) / 10
const r2 = (x: number) => Math.round(x * 100) / 100

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 6: defrost w sezonie w kilku scenariuszach pogody (dawne 5.56). The power
 * during a defrost comes from the Screen 6 field above, so it is not typed twice.
 */
export function SekcjaDefrostSezon({ mocDefrostuKw }: { mocDefrostuKw: number }) {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<Stan>("cykle-odszraniania.sezon", STAN_POCZATKOWY)
  const minuty = t("UI-M6-CYK-J-MIN")
  const poleScenariusza = (i: number, klucz: PolaScenariusza) => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: stan.scenariusze[i][klucz],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setStan((prev) => ({
        ...prev,
        scenariusze: prev.scenariusze.map((s, j) => (j === i ? { ...s, [klucz]: e.target.value } : s)),
      })),
  })
  const result = useMemo(
    () =>
      calculateDefrostSezon({
        mocDefrostuKw,
        scenariusze: stan.scenariusze.map((s) => ({ odstepMin: n(s.odstep), czasDefrostuMin: n(s.czas), godzinyDobaH: n(s.godziny), dni: n(s.dni) })),
        zuzyciePompySezonKwh: n(stan.zuzycie),
      }),
    [stan, mocDefrostuKw],
  )
  const v = result.value

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="font-semibold">{t("UI-M6D-DSZ-TYTUL")}</h2>
      <p className="text-small text-muted-foreground">{t("UI-M6D-DSZ-OPIS")}</p>
      {stan.scenariusze.map((_, i) => (
        <fieldset key={i} className="flex flex-col gap-3">
          <legend className="mb-2 text-small font-medium">{t("UI-M6D-DSZ-SCENARIUSZ", { n: i + 1 })}</legend>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6-CYK-ODSTEP")} unit={minuty} {...poleScenariusza(i, "odstep")} pomoc={<PomocPola ekran="m6d-defrost-sezon" pole="odstep" />} />
            <Pole label={t("UI-M6-CYK-CZAS")} unit={minuty} {...poleScenariusza(i, "czas")} pomoc={<PomocPola ekran="m6d-defrost-sezon" pole="czas" />} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Pole label={t("UI-M6D-DSZ-GODZINY")} unit="h" max={24} {...poleScenariusza(i, "godziny")} pomoc={<PomocPola ekran="m6d-defrost-sezon" pole="godziny" />} />
            <Pole label={t("UI-M6D-DSZ-DNI")} unit={t("UI-M6D-J-DNI")} {...poleScenariusza(i, "dni")} pomoc={<PomocPola ekran="m6d-defrost-sezon" pole="dni" />} />
          </div>
        </fieldset>
      ))}
      <Pole
        label={t("UI-M6D-DSZ-ZUZYCIE")}
        unit="kWh"
        type="number"
        inputMode="decimal"
        min={0}
        value={stan.zuzycie}
        onChange={(e) => setStan((prev) => ({ ...prev, zuzycie: e.target.value }))}
        pomoc={<PomocPola ekran="m6d-defrost-sezon" pole="zuzycie" />}
      />

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta={t("UI-M6-BLAD-DANYCH")}>
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">{t("UI-M6D-DSZ-UZUPELNIJ")}</p>
      ) : (
        <WerdyktPanel poziom="ok" etykieta={t("UI-M6D-DSZ-W-OK")}>
          <WynikGlowny>{t("UI-M6D-DSZ-WYNIK", { kwh: r0(v.sumaKwh) })}</WynikGlowny>
          <ul className="mt-2 flex flex-col gap-1 text-small">
            {v.scenariusze.map((s, i) =>
              s === null ? null : (
                <li key={i}>
                  {t("UI-M6D-DSZ-WIERSZ", { n: i + 1, ile: r0(s.defrostowDoba), udzial: r1(s.udzialCzasuPct), doba: r2(s.energiaDobaKwh), sezon: r0(s.energiaSezonKwh) })}
                </li>
              ),
            )}
            {v.udzialPct !== null && <li>{t("UI-M6D-DSZ-UDZIAL", { pct: r1(v.udzialPct) })}</li>}
          </ul>
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </section>
  )
}
