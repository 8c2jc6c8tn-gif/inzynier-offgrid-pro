import {
  CZYNNIKI_RYZYKA,
  MIGAWKA,
  PRZYKLAD_ILUSTRACYJNY,
  TWARDY_STOP,
  ZALECENIA,
} from "@/lib/core/modules/ogrzewanie/ryzyko-zamarzniecia-dolnego-zrodla/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { WerdyktPanel } from "@/components/werdykt"
import { MigawkaBox } from "@/components/wzorce/migawka-box"

export default function RyzykoZamarznieciaDolnegoZrodlaPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ryzyko-zamarzniecia-dolnego-zrodla" />
      <NaglowekEkranu tytul="Ryzyko zamarznięcia dolnego źródła">
        Dłuższa praca ciągła schładza grunt wokół kolektora gruntowego. Moduł 6, Część 2C. Treść
        informacyjna — źródło nie podaje wzoru wiążącego czynniki poniżej z temperaturą czynnika
        roboczego, tylko jeden ilustracyjny przykład.
      </NaglowekEkranu>

      <WerdyktPanel poziom="blad" etykieta="Twardy stop">
        <p className="mt-1 text-small">{TWARDY_STOP}</p>
      </WerdyktPanel>

      <div>
        <h2 className="mb-2 text-small font-semibold">Czynniki ryzyka</h2>
        <ul className="flex flex-col gap-2">
          {CZYNNIKI_RYZYKA.map((czynnik) => (
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

      <MigawkaBox>{MIGAWKA}</MigawkaBox>
    </main>
  )
}
