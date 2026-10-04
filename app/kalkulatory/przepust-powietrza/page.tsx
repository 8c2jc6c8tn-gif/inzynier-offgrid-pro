"use client"

import { useMemo } from "react"
import { calculatePrzepustPowietrza } from "@/lib/core/modules/okablowanie/przepust-powietrza/calculator"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"
import {
  PROG_BEZPIECZNY_CM,
  PROG_KRYTYCZNY_CM,
  TEMPERATURA_ODNIESIENIA_C,
  TEMPERATURA_PRZY_SZCZELINIE_KRYTYCZNEJ_C,
  WSPOLCZYNNIK_STRATY_PCT_PER_C,
} from "@/lib/core/modules/okablowanie/przepust-powietrza/constants"
import { useTranslate } from "@/lib/i18n/language-context"

type FormularzStan = { szczelinaCm: string }

const STAN_POCZATKOWY: FormularzStan = { szczelinaCm: "" }

export default function PrzepustPowietrzaPage() {
  const t = useTranslate()
  const [stan, setStan] = usePersistedDraft<FormularzStan>("przepust-powietrza", STAN_POCZATKOWY)
  const { szczelinaCm } = stan

  const result = useMemo(
    () => calculatePrzepustPowietrza({ szczelinaCm: szczelinaCm === "" ? null : Number(szczelinaCm) }),
    [szczelinaCm],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: result.value.klasyfikacja === "posrednia" ? "uwaga" : "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: t("UI-PRZPOW-POLICZYC"),
    incomplete: t("UI-PRZPOW-WPISZ-PLANOWANA-SZCZELINE"),
    red: t("UI-PRZPOW-MALA-SZCZELINA-REALNA"),
    green:
      result.value.klasyfikacja === "posrednia"
        ? t("UI-PRZPOW-BRAK-DANYCH-ZAKRESU")
        : t("UI-PRZPOW-SZCZELINA-WYSTARCZAJACA"),
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przepust-powietrza" />
      <NaglowekEkranu
        tytul={t("UI-PRZPOW-PRZEPUST-POWIETRZA-POD")}
        ekran="przepust-powietrza"
        wynik={result}
        parametry={{
          progKrytyczny: PROG_KRYTYCZNY_CM,
          progBezpieczny: PROG_BEZPIECZNY_CM,
          tKrytyczna: TEMPERATURA_PRZY_SZCZELINIE_KRYTYCZNEJ_C,
          tStc: TEMPERATURA_ODNIESIENIA_C,
          strata: WSPOLCZYNNIK_STRATY_PCT_PER_C,
        }}
      >
        {t("UI-PRZPOW-PANELE-NAGRZEWAJA-DACH")}
      </NaglowekEkranu>

      <Pole
        label={t("UI-PRZPOW-PLANOWANA-SZCZELINA-WENTYLAC")}
        unit="cm"
        type="number"
        inputMode="decimal"
        min={0}
        value={szczelinaCm}
        onChange={(e) => setStan({ szczelinaCm: e.target.value })}
        pomoc={<PomocPola ekran="przepust-powietrza" pole="szczelina" params={{ progKrytyczny: PROG_KRYTYCZNY_CM, progBezpieczny: PROG_BEZPIECZNY_CM }} />}
      />

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {verdict !== "invalid" && verdict !== "incomplete" && result.value.strataOrientacyjnaPct !== null && (
          <WynikGlowny>{t("UI-PRZPOW-STRATY-MOCY-ORIENTACYJNIE", { strataOrientacyjnaPct: result.value.strataOrientacyjnaPct.toFixed(0) })}</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} formulaKey={result.formulaKey} formulaParams={result.formulaParams} />
      </WerdyktPanel>
    </main>
  )
}
