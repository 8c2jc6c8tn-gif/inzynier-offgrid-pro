"use client"

import type { ReactNode } from "react"
import { Tooltip } from "@base-ui/react/tooltip"
import { cn } from "@/lib/utils"

/**
 * "Chmurka" — dymek z wyjaśnieniem. Dwa użycia z docs/standards/08-ui-ux.md 8.4:
 * `PomocPole` = mały „?” obok etykiety pola (nazwa/zastosowanie/zakres wartości), `Chmurka` =
 * ogólny wrapper na dowolny trigger, gdy `PomocPole` nie pasuje (np. cała karta, nie tylko „?”).
 */
export function Chmurka({ tresc, children }: { tresc: ReactNode; children: ReactNode }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6}>
          <Tooltip.Popup
            className={cn(
              "z-50 max-w-64 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md",
            )}
          >
            {tresc}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export function PomocPole({ tresc }: { tresc: ReactNode }) {
  return (
    <Chmurka tresc={tresc}>
      <span
        aria-label="Więcej informacji o tym polu"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] text-muted-foreground hover:bg-muted"
      >
        ?
      </span>
    </Chmurka>
  )
}
