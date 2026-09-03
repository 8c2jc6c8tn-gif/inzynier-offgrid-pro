import { MIGAWKA, ZALECENIE } from "@/lib/core/modules/montaz-baterii/ratowanie-zasiarczenia/constants"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { MigawkaBox } from "@/components/wzorce/migawka-box"

export default function RatowanieZasiarczeniaPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/ratowanie-zasiarczenia" />
      <NaglowekEkranu tytul="Ratowanie zasiarczonego akumulatora">
        Dotyczy akumulatora ze zdiagnozowanym zasiarczeniem (Ekran B10). Moduł 11, Ekran B11
        (Ścieżka B — kwasowo-ołowiowa).
      </NaglowekEkranu>

      <div className="rounded-lg border p-4 text-small">{ZALECENIE}</div>

      <MigawkaBox>{MIGAWKA}</MigawkaBox>
    </main>
  )
}
