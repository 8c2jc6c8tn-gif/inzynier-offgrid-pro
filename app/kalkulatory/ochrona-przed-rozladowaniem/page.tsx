"use client"

import { useId, useMemo } from "react"
import { calculateOchronaPrzedRozladowaniem } from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/calculator"
import { PROG_ODCIECIA_12V } from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/constants"
import type {
  ChemiaMalegoAkumulatora,
  OchronaPrzedRozladowaniemInput,
} from "@/lib/core/modules/kalkulator-mobilny/ochrona-przed-rozladowaniem/input"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { WerdyktPanel } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

type FormularzStan = {
  chemia: ChemiaMalegoAkumulatora | ""
  napiecieZnamionoweV: OchronaPrzedRozladowaniemInput["napiecieZnamionoweV"]
  maDozownik: boolean
  odbiornikMaWlasneZabezpieczenie: boolean
}

const STAN_POCZATKOWY: FormularzStan = {
  chemia: "",
  napiecieZnamionoweV: 0,
  maDozownik: false,
  odbiornikMaWlasneZabezpieczenie: false,
}

const f2 = (x: number) => x.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 2 })

export default function OchronaPrzedRozladowaniemPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("ochrona-przed-rozladowaniem", STAN_POCZATKOWY)
  const idDozownik = useId()
  const idZabezpieczenie = useId()

  const result = useMemo(
    () =>
      calculateOchronaPrzedRozladowaniem({
        chemia: stan.chemia === "" ? null : stan.chemia,
        napiecieZnamionoweV: stan.napiecieZnamionoweV,
        maDozownik: stan.maDozownik,
        odbiornikMaWlasneZabezpieczenie: stan.odbiornikMaWlasneZabezpieczenie,
      }),
    [stan],
  )

  const hasCritical = result.warnings.some((w) => w.level === "critical")
  const { progOdcieciaV, progNaOgniwoV, liczbaOgniw } = result.value

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ochrona-przed-rozladowaniem" />
      <NaglowekEkranu
        tytul="Ochrona przed rozładowaniem akumulatora"
        ekran="ochrona-przed-rozladowaniem"
        wzor={result.formula}
        parametry={{ progAgm: PROG_ODCIECIA_12V.AGM ?? "—", progLfp: PROG_ODCIECIA_12V.LiFePO4 ?? "—" }}
      >
        Dozownik napięcia (LVD) odłącza odbiornik, zanim rozładuje akumulator za głęboko. Moduł 12.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect
          label="Typ akumulatora"
          value={stan.chemia}
          onChange={(e) => setStan((prev) => ({ ...prev, chemia: e.target.value as FormularzStan["chemia"] }))}
          pomoc={<PomocPola ekran="ochrona-przed-rozladowaniem" pole="typ" />}
        >
          <option value="">— wybierz —</option>
          <option value="AGM">AGM</option>
          <option value="kwasowy">Kwasowy (zalewowy)</option>
          <option value="LiFePO4">LiFePO4</option>
        </PoleSelect>
        <PoleSelect
          label="Napięcie znamionowe"
          value={stan.napiecieZnamionoweV}
          onChange={(e) =>
            setStan((prev) => ({
              ...prev,
              napiecieZnamionoweV: Number(e.target.value) as FormularzStan["napiecieZnamionoweV"],
            }))
          }
          pomoc={<PomocPola ekran="ochrona-przed-rozladowaniem" pole="napiecie" />}
        >
          <option value={0}>— wybierz —</option>
          <option value={12}>12 V</option>
          <option value={24}>24 V</option>
          <option value={48}>48 V</option>
        </PoleSelect>
        <PoleCheckbox
          id={idDozownik}
          label="Mam dozownik napięcia (LVD)"
          checked={stan.maDozownik}
          onChange={(e) => setStan((prev) => ({ ...prev, maDozownik: e.target.checked }))}
        />
        <PoleCheckbox
          id={idZabezpieczenie}
          label="Odbiornik sam odcina się przy niskim napięciu"
          hint="Np. lodówka turystyczna z wbudowaną ochroną akumulatora."
          checked={stan.odbiornikMaWlasneZabezpieczenie}
          onChange={(e) => setStan((prev) => ({ ...prev, odbiornikMaWlasneZabezpieczenie: e.target.checked }))}
        />
      </div>

      {result.status === "INCOMPLETE" ? (
        <p className="text-small text-muted-foreground">Wybierz typ i napięcie akumulatora, żeby zobaczyć próg odcięcia.</p>
      ) : (
        <WerdyktPanel
          poziom={hasCritical ? "blad" : "ok"}
          etykieta={hasCritical ? "Akumulator bez ochrony" : "Próg odcięcia dozownika"}
        >
          <WynikGlowny>{progOdcieciaV === null ? "wg karty producenta" : `${f2(progOdcieciaV)} V`}</WynikGlowny>
          {progNaOgniwoV !== null && (
            <p className="mt-1 text-small">
              {f2(progNaOgniwoV)} V na ogniwo · {liczbaOgniw} ogniw w szeregu
            </p>
          )}
          <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
