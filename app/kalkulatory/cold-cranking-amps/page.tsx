"use client"

import { useMemo, useState } from "react"
import { calculateColdCrankingAmps } from "@/lib/core/modules/baterie/cold-cranking-amps/calculator"
import { Pole } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikGlowny } from "@/components/wzorce/wynik-glowny"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function ColdCrankingAmpsPage() {
  const [napiecieOtwartegoObwoduV, setNapiecieOtwartegoObwoduV] = useState("")
  const [pradRozruchowyA, setPradRozruchowyA] = useState("")
  const [rezystancjaWewnetrznaMOhm, setRezystancjaWewnetrznaMOhm] = useState("")
  const [minimalneNapiecieFalownikaV, setMinimalneNapiecieFalownikaV] = useState("")

  const result = useMemo(
    () =>
      calculateColdCrankingAmps({
        napiecieOtwartegoObwoduV: napiecieOtwartegoObwoduV === "" ? 0 : Number(napiecieOtwartegoObwoduV),
        pradRozruchowyA: pradRozruchowyA === "" ? 0 : Number(pradRozruchowyA),
        rezystancjaWewnetrznaMOhm: rezystancjaWewnetrznaMOhm === "" ? 0 : Number(rezystancjaWewnetrznaMOhm),
        minimalneNapiecieFalownikaV: minimalneNapiecieFalownikaV === "" ? 0 : Number(minimalneNapiecieFalownikaV),
      }),
    [napiecieOtwartegoObwoduV, pradRozruchowyA, rezystancjaWewnetrznaMOhm, minimalneNapiecieFalownikaV],
  )

  const poziom: WerdyktPoziom | null =
    result.status === "INVALID_INPUT"
      ? "blad"
      : result.status === "INCOMPLETE"
        ? null
        : result.value.falownikWytrzyma
          ? "ok"
          : "uwaga"

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/cold-cranking-amps" />
      <NaglowekEkranu tytul="Cold Cranking Amps — zimny start dużych odbiorników">
        Zimna bateria to leniwa chemia — reakcje chemiczne wewnątrz zwalniają, więc bateria
        chwilowo „nie nadąża” z dostarczeniem prądu rozruchowego, nawet jeśli ma dużo energii.
        Moduł 4, Ekran 15.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole
          label="Napięcie pakietu bez obciążenia"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieOtwartegoObwoduV}
          onChange={(e) => setNapiecieOtwartegoObwoduV(e.target.value)}
        />
        <Pole
          label="Prąd rozruchowy odbiornika"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradRozruchowyA}
          onChange={(e) => setPradRozruchowyA(e.target.value)}
          hint="Np. prąd startowy pompy głębinowej."
        />
        <Pole
          label="Rezystancja wewnętrzna pakietu"
          unit="mΩ"
          type="number"
          inputMode="decimal"
          min={0}
          value={rezystancjaWewnetrznaMOhm}
          onChange={(e) => setRezystancjaWewnetrznaMOhm(e.target.value)}
          hint="Zmierzona w bieżącej (zimnej) temperaturze ogniw, np. testerem YR1035."
        />
        <Pole
          label="Minimalne napięcie pracy falownika"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={minimalneNapiecieFalownikaV}
          onChange={(e) => setMinimalneNapiecieFalownikaV(e.target.value)}
        />
      </div>

      {result.status === "INVALID_INPUT" ? (
        <WerdyktPanel poziom="blad" etykieta="Nie da się policzyć — sprawdź wpisane dane">
          <WynikSzczegoly assumptions={[]} warnings={result.warnings} />
        </WerdyktPanel>
      ) : poziom === null ? (
        <p className="text-small text-muted-foreground">Wypełnij wszystkie pola, żeby zobaczyć wynik.</p>
      ) : (
        <WerdyktPanel
          poziom={poziom}
          etykieta={poziom === "ok" ? "Falownik utrzyma napięcie pracy" : "Falownik się wyłączy"}
        >
          <WynikGlowny>{result.value.vSagV.toFixed(1)} V</WynikGlowny>
          <WynikSzczegoly assumptions={result.assumptions} formula={result.formula} />
        </WerdyktPanel>
      )}
    </main>
  )
}
