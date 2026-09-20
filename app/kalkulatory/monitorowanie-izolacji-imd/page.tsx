"use client"

import { useMemo } from "react"
import { calculateMonitorowanieIzolacjiImd } from "@/lib/core/modules/okablowanie/monitorowanie-izolacji-imd/calculator"
import { PRZYKLADOWY_PROG_ALARMU_KOM } from "@/lib/core/modules/okablowanie/monitorowanie-izolacji-imd/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  ukladIt: boolean
  maZainstalowanyImd: boolean
  progAlarmuKOm: string
}

const STAN_POCZATKOWY: FormularzStan = { ukladIt: false, maZainstalowanyImd: false, progAlarmuKOm: "" }

export default function MonitorowanieIzolacjiImdPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("monitorowanie-izolacji-imd", STAN_POCZATKOWY)
  const { ukladIt, maZainstalowanyImd, progAlarmuKOm } = stan

  function setPole<K extends keyof FormularzStan>(pole: K, wartosc: FormularzStan[K]) {
    setStan((prev) => ({ ...prev, [pole]: wartosc }))
  }

  const result = useMemo(
    () =>
      calculateMonitorowanieIzolacjiImd({
        ukladIt,
        maZainstalowanyImd,
        progAlarmuKOm: progAlarmuKOm === "" ? 0 : Number(progAlarmuKOm),
      }),
    [ukladIt, maZainstalowanyImd, progAlarmuKOm],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const verdict =
    result.status === "INVALID_INPUT" ? "invalid" : result.status === "INCOMPLETE" ? "incomplete" : hasCritical ? "red" : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wpisz próg alarmu IMD",
    red: "Zabronione — układ IT bez zamontowanego IMD",
    green: ukladIt ? "IMD zainstalowany poprawnie" : "IMD nie jest wymagany w tym układzie",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/monitorowanie-izolacji-imd" />
      <NaglowekEkranu tytul="Monitorowanie izolacji (IMD)">
        W układzie IT nie ma bezpośredniego uziemienia, więc pierwsze doziemienie nie wyłączy
        bezpiecznika. IMD wyłapie problem, zanim stanie się groźny. Moduł 5, Ekran 18.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleCheckbox
          id="uklad-it"
          label="Układ sieci jest typu IT (bez bezpośredniego uziemienia punktu neutralnego)"
          checked={ukladIt}
          onChange={(e) => setPole("ukladIt", e.target.checked)}
        />
        {ukladIt && (
          <>
            <PoleCheckbox
              id="ma-imd"
              label="IMD jest już zainstalowany"
              checked={maZainstalowanyImd}
              onChange={(e) => setPole("maZainstalowanyImd", e.target.checked)}
            />
            {maZainstalowanyImd && (
              <Pole
                label="Próg alarmu IMD"
                unit="kΩ"
                type="number"
                inputMode="decimal"
                min={0}
                value={progAlarmuKOm}
                onChange={(e) => setPole("progAlarmuKOm", e.target.value)}
                hint={`Przykład ze źródła: ${PRZYKLADOWY_PROG_ALARMU_KOM} kΩ — realny próg zależy od napięcia systemu i zaleceń producenta IMD, nie jest to wartość uniwersalna.`}
              />
            )}
          </>
        )}
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
