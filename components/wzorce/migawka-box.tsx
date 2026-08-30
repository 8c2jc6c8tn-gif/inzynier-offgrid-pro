import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * "Migawka edukacyjna" — krótkie fizyczne wyjaśnienie w formie cytatu, wzięte z pola
 * formula/assumptions wyniku albo z constants.ts modułu (np. MIGAWKA w trasach kablowych).
 * Statyczny box, nie tooltip — dla treści, która ma być widoczna od razu, bez najeżdżania
 * (odwrotność `Chmurka`/`PomocPole`, które chowają treść do interakcji).
 */
export function MigawkaBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "rounded-lg border-2 border-muted-foreground/30 bg-muted p-4 text-small italic text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  )
}
