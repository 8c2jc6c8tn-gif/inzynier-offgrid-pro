import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Wzorzec C (docs/brief-dla-v0.md) — kilka niezależnych tematów na jednym ekranie, każdy
 * zwijany osobno przez natywny `<details>` (dostępność za darmo, bez JS). Wcześniej definiowany
 * lokalnie w app/kalkulatory/czystosc-i-snieg/page.tsx jako `AccordionSection` — tu wydzielony,
 * żeby inne ekrany z wieloma niezależnymi tematami mogły użyć tego samego stanu hover/focus.
 */
export function SekcjaAkordeon({
  tytul,
  children,
  domyslnieOtwarta,
}: {
  tytul: string
  children: ReactNode
  domyslnieOtwarta?: boolean
}) {
  return (
    <details
      className={cn(
        "group rounded-lg border transition-colors",
        "has-[summary:hover]:bg-muted/40",
      )}
      open={domyslnieOtwarta}
    >
      <summary
        className={cn(
          "flex cursor-pointer select-none items-center justify-between gap-2 p-4 text-h3 font-medium outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/50 rounded-lg",
        )}
      >
        {tytul}
        <span aria-hidden="true" className="text-muted-foreground transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="border-t p-4">{children}</div>
    </details>
  )
}
