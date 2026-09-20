"use client"

import { useMemo } from "react"
import { calculateSzynyZbiorczePolaczenia } from "@/lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia/calculator"
import { CHECKLIST_ITEMS } from "@/lib/core/modules/okablowanie/szyny-zbiorcze-polaczenia/constants"
import { usePersistedDraft } from "@/lib/adapters/use-persisted-draft"
import { WerdyktPanel, type WerdyktPoziom } from "@/components/werdykt"
import { NawigacjaEkranu } from "@/components/nawigacja-ekranu"
import { NaglowekEkranu } from "@/components/wzorce/naglowek-ekranu"
import { ListaChecklist } from "@/components/wzorce/lista-checklist"
import { StanPusty } from "@/components/ui/stany"

type FormularzStan = { potwierdzoneIds: string[] }
const STAN_POCZATKOWY: FormularzStan = { potwierdzoneIds: [] }

export default function SzynyZbiorczePolaczeniaPage() {
  const [stan, setStan] = usePersistedDraft<FormularzStan>("szyny-zbiorcze-polaczenia", STAN_POCZATKOWY)
  const { potwierdzoneIds } = stan
  const setPotwierdzoneIds = (a: string[] | ((p: string[]) => string[])) =>
    setStan((prev) => ({
      ...prev,
      potwierdzoneIds: typeof a === "function" ? (a as (p: string[]) => string[])(prev.potwierdzoneIds) : a,
    }))

  const result = useMemo(() => calculateSzynyZbiorczePolaczenia({ potwierdzoneIds }), [potwierdzoneIds])

  function toggle(id: string) {
    setPotwierdzoneIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const poziom: WerdyktPoziom | null = result.status === "VALID" ? "ok" : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <NawigacjaEkranu href="/kalkulatory/szyny-zbiorcze-polaczenia" />
      <NaglowekEkranu tytul="Szyny zbiorcze i połączenia">
        Śruba to sprężyna. Za słabo dokręcona — iskrzy. Za mocno — pęka gwint. Trzeba trafić w
        idealny moment, i to inny dla aluminium niż dla miedzi. Moduł 5, Ekran 3.
      </NaglowekEkranu>

      <ListaChecklist
        items={CHECKLIST_ITEMS}
        potwierdzoneIds={potwierdzoneIds}
        onToggle={toggle}
        renderLabel={(item) => (
          <>
            <span className="block font-medium">{item.krok}</span>
            <span className="block text-muted-foreground">Wartość docelowa: {item.wartoscDocelowa}</span>
          </>
        )}
      />

      <p className="text-small text-muted-foreground">
        Zdjęcie połączenia jest opcjonalne (dokumentacja montażu) i nie jest wymagane do odbioru —
        nie ma go w tej checkliście. Dobór przekroju szyny wg wytrzymałości zwarciowej wymaga
        normy/tabeli, której źródło nie podaje — nie jest tu liczony.
      </p>

      {poziom ? (
        <WerdyktPanel poziom={poziom} etykieta="Wszystkie kroki potwierdzone" />
      ) : (
        <StanPusty tytul={`Potwierdzono ${result.value.potwierdzone} / ${result.value.razem} kroków`} />
      )}
    </main>
  )
}
