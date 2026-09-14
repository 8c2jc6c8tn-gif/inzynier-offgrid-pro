"use client"

import { useMemo, useState } from "react"
import { calculateLaczenieCuAl } from "@/lib/core/modules/okablowanie/laczenie-cu-al/calculator"
import { ETYKIETY_MATERIALOW, ETYKIETY_SRODOWISK, kluczPary } from "@/lib/core/modules/okablowanie/laczenie-cu-al/constants"
import type { Material, Srodowisko } from "@/lib/core/modules/okablowanie/laczenie-cu-al/input"
import { Pole, PoleCheckbox, PoleSelect } from "@/components/ui/pole"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WynikSzczegoly } from "@/components/wzorce/wynik-szczegoly"

const MATERIALY = Object.keys(ETYKIETY_MATERIALOW) as Material[]
const SRODOWISKA = Object.keys(ETYKIETY_SRODOWISK) as Srodowisko[]

export default function LaczenieCuAlPage() {
  const [material1, setMaterial1] = useState<Material | "">("")
  const [material2, setMaterial2] = useState<Material | "">("")
  const [srodowisko, setSrodowisko] = useState<Srodowisko>("suche")
  const [maZlaczkeBimetaliczna, setMaZlaczkeBimetaliczna] = useState(false)
  const [maPodkladkeISmar, setMaPodkladkeISmar] = useState(false)
  const [przekrojCuMm2, setPrzekrojCuMm2] = useState("")

  const result = useMemo(
    () =>
      calculateLaczenieCuAl({
        material1: material1 === "" ? null : material1,
        material2: material2 === "" ? null : material2,
        srodowisko,
        maZlaczkeBimetaliczna,
        maPodkladkeISmar,
        przekrojCuMm2: przekrojCuMm2 === "" ? 0 : Number(przekrojCuMm2),
      }),
    [material1, material2, srodowisko, maZlaczkeBimetaliczna, maPodkladkeISmar, przekrojCuMm2],
  )

  const paraCuAl = material1 && material2 && kluczPary(material1, material2) === kluczPary("Cu", "Al")
  const paraStalOcynkCu =
    material1 && material2 && kluczPary(material1, material2) === kluczPary("stal-ocynkowana", "Cu")

  const hasCritical = result.warnings.some((w) => w.level === "critical")

  const verdict =
    result.status === "INVALID_INPUT"
      ? "invalid"
      : result.status === "INCOMPLETE"
        ? "incomplete"
        : result.status === "OUT_OF_SCOPE"
          ? "poza-zakresem"
          : hasCritical
            ? "red"
            : "green"

  const verdictPoziom: Record<typeof verdict, WerdyktPoziom> = {
    invalid: "blad",
    incomplete: "ok",
    "poza-zakresem": "blad",
    red: "blad",
    green: "ok",
  }

  const verdictLabel: Record<typeof verdict, string> = {
    invalid: "Nie da się policzyć",
    incomplete: "Wybierz oba materiały",
    "poza-zakresem": "Ta para/środowisko nie jest oceniane w źródle",
    red: "Zabronione — korozja galwaniczna",
    green: "Połączenie bezpieczne",
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/laczenie-cu-al" />
      <NaglowekEkranu tytul="Łączenie Cu-Al i ochrona przed korozją">
        Miedź i aluminium w wilgoci nie znoszą bezpośredniego kontaktu — trzeba je rozdzielić
        barierą, inaczej rdzewieją tam, gdzie się stykają. Moduł 5, Ekran 4.
      </NaglowekEkranu>

      <div className="flex flex-col gap-4">
        <PoleSelect label="Materiał przewodu 1" value={material1} onChange={(e) => setMaterial1(e.target.value as Material)}>
          <option value="">— wybierz —</option>
          {MATERIALY.map((m) => (
            <option key={m} value={m}>
              {ETYKIETY_MATERIALOW[m]}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect label="Materiał przewodu 2" value={material2} onChange={(e) => setMaterial2(e.target.value as Material)}>
          <option value="">— wybierz —</option>
          {MATERIALY.map((m) => (
            <option key={m} value={m}>
              {ETYKIETY_MATERIALOW[m]}
            </option>
          ))}
        </PoleSelect>
        <PoleSelect label="Środowisko" value={srodowisko} onChange={(e) => setSrodowisko(e.target.value as Srodowisko)}>
          {SRODOWISKA.map((s) => (
            <option key={s} value={s}>
              {ETYKIETY_SRODOWISK[s]}
            </option>
          ))}
        </PoleSelect>

        {paraCuAl && (
          <PoleCheckbox
            id="ma-zlaczke-bimetaliczna"
            label="Zastosowana złączka bimetaliczna + pasta antykorozyjna"
            checked={maZlaczkeBimetaliczna}
            onChange={(e) => setMaZlaczkeBimetaliczna(e.target.checked)}
          />
        )}
        {paraStalOcynkCu && (
          <PoleCheckbox
            id="ma-podkladke-i-smar"
            label="Zastosowana podkładka i smar"
            checked={maPodkladkeISmar}
            onChange={(e) => setMaPodkladkeISmar(e.target.checked)}
          />
        )}

        <Pole
          label="Przekrój Cu (opcjonalnie — przelicznik na Al)"
          unit="mm²"
          type="number"
          inputMode="decimal"
          min={0}
          value={przekrojCuMm2}
          onChange={(e) => setPrzekrojCuMm2(e.target.value)}
          hint="Aluminium potrzebuje ok. 1,6× większego przekroju niż miedź dla tego samego prądu."
        />
      </div>

      <WerdyktPanel poziom={verdictPoziom[verdict]} etykieta={verdictLabel[verdict]}>
        {result.value.wymaganyPrzekrojAlMm2 > 0 && (
          <p className="font-medium">Wymagany przekrój Al: {result.value.wymaganyPrzekrojAlMm2.toFixed(1)} mm²</p>
        )}
        <WynikSzczegoly assumptions={result.assumptions} warnings={result.warnings} formula={result.formula} />
      </WerdyktPanel>
    </main>
  )
}
