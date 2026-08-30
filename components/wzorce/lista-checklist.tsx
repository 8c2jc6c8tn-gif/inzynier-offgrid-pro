import type { ReactNode } from "react"
import { PoleCheckbox } from "@/components/ui/pole"

export type ChecklistItem = { id: string }

/**
 * Wzorzec E (docs/brief-dla-v0.md) — checklista z potwierdzaniem krok po kroku, z pasem
 * postępu. Używany przez moment-dokrecania-srub, procedura-black-start (kolejność wymuszona
 * numeracją) i przygotowanie-stanowiska. Sam stan każdego elementu to teraz `PoleCheckbox`
 * (hover/focus/disabled raz zdefiniowane), tu dodany jest tylko pasek postępu nad listą.
 */
export function ListaChecklist<T extends ChecklistItem>({
  items,
  potwierdzoneIds,
  onToggle,
  renderLabel,
  numerowana,
}: {
  items: T[]
  potwierdzoneIds: string[]
  onToggle: (id: string) => void
  renderLabel: (item: T, index: number) => ReactNode
  numerowana?: boolean
}) {
  const ListaTag = numerowana ? "ol" : "ul"
  const procent = items.length === 0 ? 0 : Math.round((potwierdzoneIds.length / items.length) * 100)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="presentation">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${procent}%` }}
          />
        </div>
        <span className="shrink-0 text-caption text-muted-foreground" aria-live="polite">
          {potwierdzoneIds.length}/{items.length}
        </span>
      </div>

      <ListaTag className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.id} className="list-none">
            <PoleCheckbox
              id={`checklist-${item.id}`}
              checked={potwierdzoneIds.includes(item.id)}
              onChange={() => onToggle(item.id)}
              label={renderLabel(item, index)}
            />
          </li>
        ))}
      </ListaTag>
    </div>
  )
}
