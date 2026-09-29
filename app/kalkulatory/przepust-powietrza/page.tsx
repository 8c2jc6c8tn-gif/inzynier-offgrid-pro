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
import { PROG_BEZPIECZNY_CM, PROG_KRYTYCZNY_CM } from "@/lib/core/modules/okablowanie/przepust-powietrza/constants"

type FormularzStan = { szczelinaCm: string }

const STAN_POCZATKOWY: FormularzStan = { szczelinaCm: "" }

export default function PrzepustPowietrzaPage() {
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
    invalid: "Nie da się policzyć",
    incomplete: "Wpisz planowaną szczelinę wentylacyjną",
    red: "Za mała szczelina — realna strata mocy latem",
    green:
      result.value.klasyfikacja === "posrednia"
        ? "Brak danych dla tego zakresu — zalecane min. 15 cm"
        : "Szczelina wystarczająca",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przepust-powietrza" />
      <NaglowekEkranu
        tytul="Przepust powietrza pod panelami"
        ekran="przepust-powietrza"
        wynik={result}
        parametry={{ progKrytyczny: PROG_KRYTYCZNY_CM, progBezpieczny: PROG_BEZPIECZNY_CM }}
      >
        Panele nagrzewają się jak dach samochodu w słońcu — im gorszy przepływ powietrza pod
        spodem, tym gorętsze i mniej wydajne. Moduł 5, Ekran 8.
      </NaglowekEkranu>

      <Pole
        label="Planowana szczelina wentylacyjna pod panelami"
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
          <WynikGlowny>~{result.value.strataOrientacyjnaPct.toFixed(0)}% straty mocy (orientacyjnie)</WynikGlowny>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
