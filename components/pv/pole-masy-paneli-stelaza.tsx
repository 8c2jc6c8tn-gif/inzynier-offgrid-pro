"use client"

import { Pole } from "@/components/ui/pole"

/**
 * Optional "panels + frame mass" field for the ballast screens of Module 3 (E2, E6, E9) — D29.
 * Empty = self-weight ignored (safe side). No default and no typical range: the value comes from
 * datasheets or weighing (Directive #1).
 */
export function PoleMasyPaneliStelaza({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Pole
      label="Masa paneli i stelaża (opcjonalnie)"
      unit="kg"
      type="number"
      inputMode="decimal"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      pomoc={
        <>
          <strong>Masa paneli i stelaża</strong> — łączny ciężar tego, co stoi na balaście: paneli (masa z karty
          katalogowej panelu × liczba paneli) i konstrukcji (karta producenta stelaża albo ważenie). Ten ciężar
          też dociska stelaż do podłoża, więc aplikacja odejmuje go od potrzebnego balastu — liczony tak samo
          ostrożnie jak balast (tylko 90% ciężaru, PN-EN 1990). Puste pole = ciężar pominięty, wynik po stronie
          bezpiecznej. Wartość bierz z kart katalogowych albo z wagi — nie szacuj.
        </>
      }
    />
  )
}
