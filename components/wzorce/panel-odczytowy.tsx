import type { ReactNode } from "react"
import { WERDYKT_IKONA, type WerdyktPoziom } from "@/components/werdykt"

export type PozycjaOdczytowa = {
  id: string
  poziom: WerdyktPoziom
  tytul: ReactNode
  opis?: ReactNode
}

/**
 * Wzorzec G (docs/brief-dla-v0.md) — ekran wyłącznie do odczytu: wynik innego systemu (audyt
 * pożarowy AI), bez pól do wypełnienia. Lista pozycji ze statusem 🟢🟡🔴, tymi samymi ikonami co
 * `WerdyktPanel` (WERDYKT_IKONA) — jeden słownik ikon w całej apce, nie zduplikowany
 * `STATUS_ICON` per ekran.
 */
export function ListaOdczytowa({ pozycje }: { pozycje: PozycjaOdczytowa[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {pozycje.map((p) => (
        <li key={p.id} className="flex items-start gap-3 rounded-md border p-3 text-small">
          <span aria-hidden="true">{WERDYKT_IKONA[p.poziom]}</span>
          <div>
            <span className="block font-medium">{p.tytul}</span>
            {p.opis && <span className="block text-muted-foreground">{p.opis}</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}
