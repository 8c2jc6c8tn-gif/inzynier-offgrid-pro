import { PRZYKLAD, ZASADY } from "@/lib/core/modules/okablowanie/selektywnosc-zabezpieczen/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"

export default function SelektywnoscZabezpieczenPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/selektywnosc-zabezpieczen" />
      <NaglowekEkranu tytul="Selektywność zabezpieczeń" ekran="selektywnosc-zabezpieczen">
        Rzeczywista ocena selektywności wymaga krzywych czasowo-prądowych konkretnych, dobranych
        zabezpieczeń od producenta — bez tego dane wejściowego nie da się policzyć jednoznacznie,
        dlatego ten ekran to przewodnik, nie kalkulator. Moduł 5, Ekran 13.
      </NaglowekEkranu>

      <ul className="flex flex-col gap-3">
        {ZASADY.map((zasada) => (
          <li key={zasada.id} className="rounded-md border p-3 text-small">
            <span className="block font-medium">{zasada.tytul}</span>
            <span className="block text-muted-foreground">{zasada.opis}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-md border p-3 text-small">
        <span className="block font-medium">Przykład</span>
        <span className="block text-muted-foreground">{PRZYKLAD}</span>
      </div>

      
    </main>
  )
}
