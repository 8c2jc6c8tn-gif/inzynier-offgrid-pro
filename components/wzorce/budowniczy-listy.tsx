import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { StanPusty } from "@/components/ui/stany"
import { TekstUi } from "@/components/ui/tekst-ui"

export type PozycjaListy = { id: string }

/**
 * Wzorzec H (docs/brief-dla-v0.md) — katalog/budowniczy listy: formularz dodawania instancji
 * (typ + etykieta + opcjonalne pola) nad rosnącą listą z usuwaniem. Używany przez katalog
 * czujników; ten sam układ nadaje się do każdego innego "dodaj wystąpienie czegoś" ekranu.
 */
export function BudowniczyListy<T extends PozycjaListy>({
  formularz,
  pozycje,
  renderPozycja,
  podsumowanie,
  pustyTekst,
}: {
  formularz: ReactNode
  pozycje: T[]
  renderPozycja: (p: T) => ReactNode
  podsumowanie?: ReactNode
  pustyTekst: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border p-4">{formularz}</div>

      <div>
        {podsumowanie && <p className="mb-2 text-small font-medium">{podsumowanie}</p>}
        {pozycje.length === 0 ? (
          <StanPusty tytul={pustyTekst} />
        ) : (
          <ul className="flex flex-col gap-2">
            {pozycje.map((p) => (
              <li key={p.id}>{renderPozycja(p)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/** Przycisk usuwania pozycji z listy — jeden styl (destructive-ghost) zamiast
 * `text-xs text-red-600 hover:underline dark:text-red-400` kopiowanego per ekran. */
export function PrzyciskUsun({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onClick} className="text-werdykt-blad-foreground hover:bg-werdykt-blad-bg">
      {label ?? <TekstUi kod="UI-BUDLIS-USUN" />}
    </Button>
  )
}
