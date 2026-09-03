import {
  MIGAWKA,
  NARZEDZIA_DIAGNOSTYCZNE_FAKTY,
  PRZECHOWYWANIE_FAKTY,
  RECYKLING_FAKTY,
} from "@/lib/core/modules/montaz-baterii/przechowywanie-recykling/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { SekcjaAkordeon } from "@/components/wzorce/sekcja-akordeon"
import { MigawkaBox } from "@/components/wzorce/migawka-box"

export default function PrzechowywanieRecyklingPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/przechowywanie-recykling" />
      <NaglowekEkranu tytul="Przechowywanie / recykling / narzędzia diagnostyczne">
        Moduł 11, Ekran A10 (Ścieżka A — LiFePO4). Trzy tematy poniżej uzupełniają się nawzajem.
      </NaglowekEkranu>

      <div className="flex flex-col gap-3">
        <SekcjaAkordeon tytul="Przechowywanie" domyslnieOtwarta>
          <ul className="flex flex-col gap-2">
            {PRZECHOWYWANIE_FAKTY.map((fakt) => (
              <li key={fakt.id} className="text-small text-muted-foreground">
                {fakt.tekst}
              </li>
            ))}
          </ul>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Recykling">
          <ul className="flex flex-col gap-2">
            {RECYKLING_FAKTY.map((fakt) => (
              <li key={fakt.id} className="text-small text-muted-foreground">
                {fakt.tekst}
              </li>
            ))}
          </ul>
        </SekcjaAkordeon>

        <SekcjaAkordeon tytul="Narzędzia diagnostyczne">
          <ul className="flex flex-col gap-2">
            {NARZEDZIA_DIAGNOSTYCZNE_FAKTY.map((fakt) => (
              <li key={fakt.id} className="text-small text-muted-foreground">
                {fakt.tekst}
              </li>
            ))}
          </ul>
        </SekcjaAkordeon>
      </div>

      <MigawkaBox>{MIGAWKA}</MigawkaBox>
    </main>
  )
}
