"use client"

import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { SekcjaDanychNaslonecznienia } from "@/components/lokalizacja/sekcja-dane-nasloniecznienia"
import { PoleSelect } from "@/components/ui/pole"
import { PomocPola } from "@/components/ui/pomoc"
import { StanLadowania } from "@/components/ui/stany"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { useLokalizacjaProjektu } from "@/lib/lokalizacja/use-lokalizacja-projektu"
import { TrybDachPlaski } from "./_components/tryb-dach-plaski"
import { TrybPionowy } from "./_components/tryb-pionowy"
import { TrybPowierzchnie } from "./_components/tryb-powierzchnie"
import { TrybRegulowany } from "./_components/tryb-regulowany"
import { TrybWiata } from "./_components/tryb-wiata"

type Tryb = "" | "pionowy" | "dach-plaski" | "dach-skosny" | "wielopolaciowy" | "wiata" | "regulowany"

const TRYBY: { id: Exclude<Tryb, "">; label: string }[] = [
  { id: "dach-skosny", label: "Dach skośny — jedna połać" },
  { id: "wielopolaciowy", label: "Kilka powierzchni (dach, ściany, ogrodzenia)" },
  { id: "dach-plaski", label: "Dach płaski albo grunt — stelaż pod kątem" },
  { id: "regulowany", label: "Stelaż naziemny z regulacją kąta" },
  { id: "pionowy", label: "Pionowo (ogrodzenie, ściana)" },
  { id: "wiata", label: "Wiata / carport" },
]

/** Tryby z nasłonecznieniem PVGIS — pokazują sekcję danych lokalizacji. */
const Z_NASLONECZNIENIEM: Tryb[] = ["pionowy", "dach-skosny", "wielopolaciowy", "regulowany"]

/**
 * Moduł 3, Ekran 2 — "Typ montażu" (dawne 2.4, 2.5, 2.6, 2.7, 2.9; Wzorzec A z przełącznikiem trybu).
 * Każdy tryb to osobny komponent z własnym szkicem (osobny klucz), żeby przełączanie nie gubiło danych.
 */
export default function TypMontazuPage() {
  const { lokalizacja, dane, tmy, wczytano } = useLokalizacjaProjektu()
  const [stan, setStan] = usePersistedDraft<{ tryb: Tryb }>("typ-montazu", { tryb: "" })

  if (!wczytano) return <StanLadowania linie={6} />

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/typ-montazu" />
      <NaglowekEkranu tytul="Typ montażu" ekran="typ-montazu">
        Gdzie i jak staną panele — na dachu, na gruncie, pionowo na ogrodzeniu, na wiacie. Każdy wariant ma swoje liczby: ile
        energii, jak wysoko, ile balastu, ile paneli się zmieści. Moduł 3, Ekran 2.
      </NaglowekEkranu>

      <PoleSelect
        label="Jak staną panele?"
        value={stan.tryb}
        onChange={(e) => setStan({ tryb: e.target.value as Tryb })}
        pomoc={<PomocPola ekran="typ-montazu" pole="tryb" />}
      >
        <option value="">— wybierz —</option>
        {TRYBY.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </PoleSelect>

      {Z_NASLONECZNIENIEM.includes(stan.tryb) && <SekcjaDanychNaslonecznienia lokalizacja={lokalizacja} dane={dane} tmy={tmy} />}

      {stan.tryb === "pionowy" && <TrybPionowy />}
      {stan.tryb === "dach-plaski" && <TrybDachPlaski />}
      {stan.tryb === "dach-skosny" && <TrybPowierzchnie tylkoJednaPolac />}
      {stan.tryb === "wielopolaciowy" && <TrybPowierzchnie tylkoJednaPolac={false} />}
      {stan.tryb === "wiata" && <TrybWiata />}
      {stan.tryb === "regulowany" && <TrybRegulowany />}

      
    </main>
  )
}
