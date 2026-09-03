import {
  MIGAWKA,
  NARZEDZIA_FAKTY,
  PRZECHOWYWANIE_FAKTY,
  RECYKLING_FAKTY,
  type FaktStopka,
} from "@/lib/core/modules/montaz-baterii/przechowywanie-recykling-olow/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { MigawkaBox } from "@/components/wzorce/migawka-box"

function ListaFaktow({ fakty }: { fakty: FaktStopka[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {fakty.map((fakt) => (
        <li
          key={fakt.id}
          className={fakt.hardStop ? "text-small text-werdykt-blad" : "text-small text-muted-foreground"}
        >
          {fakt.hardStop && "🔴 "}
          {fakt.tekst}
        </li>
      ))}
    </ul>
  )
}

export default function PrzechowywanieRecyklingOlowPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przechowywanie-recykling-olow" />
      <NaglowekEkranu tytul="Przechowywanie / recykling / narzędzia">
        Moduł 11, Ekran B12 (Ścieżka B — kwasowo-ołowiowa). Trzy tematy poniżej uzupełniają się
        nawzajem.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul="Przechowywanie" domyslnieOtwarta>
          <ListaFaktow fakty={PRZECHOWYWANIE_FAKTY} />
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Recykling">
          <ListaFaktow fakty={RECYKLING_FAKTY} />
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Narzędzia">
          <ListaFaktow fakty={NARZEDZIA_FAKTY} />
        </SekcjaAkordeon>
      </div>

      <MigawkaBox>{MIGAWKA}</MigawkaBox>
    </main>
  )
}
