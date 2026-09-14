"use client"

import { useMemo, useState } from "react"
import { calculateWylacznikiNadpradoweDc } from "@/lib/core/modules/okablowanie/wylaczniki-nadpradowe-dc/calculator"
import { Pole, PoleCheckbox } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

export default function WylacznikiNadpradoweDcPage() {
  const [pradA, setPradA] = useState("")
  const [napiecieV, setNapiecieV] = useState("")
  const [liczbaBiegunow, setLiczbaBiegunow] = useState("")
  const [certyfikowanyDoDc, setCertyfikowanyDoDc] = useState(false)
  const [aicA, setAicA] = useState("")
  const [pradZwarciowyA, setPradZwarciowyA] = useState("")

  const result = useMemo(
    () =>
      calculateWylacznikiNadpradoweDc({
        pradA: pradA === "" ? 0 : Number(pradA),
        napiecieV: napiecieV === "" ? 0 : Number(napiecieV),
        liczbaBiegunow: liczbaBiegunow === "" ? 0 : Number(liczbaBiegunow),
        certyfikowanyDoDc,
        aicA: aicA === "" ? 0 : Number(aicA),
        pradZwarciowyA: pradZwarciowyA === "" ? 0 : Number(pradZwarciowyA),
      }),
    [pradA, napiecieV, liczbaBiegunow, certyfikowanyDoDc, aicA, pradZwarciowyA],
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
    incomplete: "Wypełnij prąd i napięcie obwodu",
    red: "Zabronione — wyłącznik nie spełnia wymagań",
    green: "Wyłącznik dobrany poprawnie",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/wylaczniki-nadpradowe-dc" />
      <NaglowekEkranu tytul="Wyłączniki nadprądowe DC">
        Prąd stały pali się jak spawarka. Wyłącznik musi umieć zgasić ten łuk, inaczej sam
        zamieni się w źródło pożaru. Moduł 5, Ekran 14.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <Pole label="Prąd obwodu" unit="A" type="number" inputMode="decimal" min={0} value={pradA} onChange={(e) => setPradA(e.target.value)} />
        <Pole
          label="Napięcie DC obwodu"
          unit="V"
          type="number"
          inputMode="decimal"
          min={0}
          value={napiecieV}
          onChange={(e) => setNapiecieV(e.target.value)}
        />
        <Pole
          label="Liczba biegunów"
          unit=""
          type="number"
          inputMode="decimal"
          min={0}
          value={liczbaBiegunow}
          onChange={(e) => setLiczbaBiegunow(e.target.value)}
        />
        <PoleCheckbox
          id="certyfikowany-dc"
          label="Wyłącznik ma certyfikację do pracy w DC"
          checked={certyfikowanyDoDc}
          onChange={(e) => setCertyfikowanyDoDc(e.target.checked)}
        />
        <Pole
          label="Zdolność wyłączania (AIC) — opcjonalnie"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={aicA}
          onChange={(e) => setAicA(e.target.value)}
        />
        <Pole
          label="Prąd zwarciowy w tym punkcie — opcjonalnie"
          unit="A"
          type="number"
          inputMode="decimal"
          min={0}
          value={pradZwarciowyA}
          onChange={(e) => setPradZwarciowyA(e.target.value)}
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
