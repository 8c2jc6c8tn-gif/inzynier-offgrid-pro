import {
  CZYNNIKI,
  OSTRZEZENIE,
  PRZYKLAD_ILUSTRACYJNY,
  ZALECENIA,
} from "@/lib/core/modules/ogrzewanie/halas-i-wibracje/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel } from "@/components/werdykt"

export default function HalasIWibracjePage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/halas-i-wibracje" />
      <NaglowekEkranu tytul="Hałas i wibracje pompy ciepła" ekran="halas-i-wibracje">
        Moduł 6, Część 2C. Treść informacyjna — źródło nie podaje wzoru propagacji akustycznej,
        tylko jeden ilustracyjny przykład.
      </NaglowekEkranu>

      <WerdyktPanel poziom="uwaga" etykieta="Sprawdź lokalną normę hałasu">
        <p className="mt-1 text-small">{OSTRZEZENIE}</p>
      </WerdyktPanel>

      <div>
        <h2 className="mb-2 text-small font-semibold">Czynniki wpływające na hałas</h2>
        <ul className="flex flex-col gap-2">
          {CZYNNIKI.map((czynnik) => (
            <li key={czynnik.id} className="rounded-md border p-3 text-small">
              <p className="font-medium">{czynnik.etykieta}</p>
              <p className="text-caption text-muted-foreground">Źródło danych: {czynnik.zrodlo}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4 text-small">
        <p className="font-medium">Przykład ilustracyjny</p>
        <p className="mt-1 text-muted-foreground">{PRZYKLAD_ILUSTRACYJNY}</p>
      </div>

      <div>
        <h2 className="mb-2 text-small font-semibold">Zalecenia</h2>
        <ul className="flex flex-col gap-2">
          {ZALECENIA.map((zalecenie) => (
            <li key={zalecenie} className="text-small text-muted-foreground">
              • {zalecenie}
            </li>
          ))}
        </ul>
      </div>

      
    </main>
  )
}
