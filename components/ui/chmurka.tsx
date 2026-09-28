"use client"

import type { ReactNode } from "react"
import { Popover } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

/**
 * "Chmurka" — dymek z wyjaśnieniem. Dwa użycia z docs/standards/08-ui-ux.md 8.4:
 * `PomocPole` = mały „?” obok etykiety pola (nazwa/zastosowanie/zakres wartości), `Chmurka` =
 * ogólny wrapper na dowolny trigger, gdy `PomocPole` nie pasuje (np. cała karta, nie tylko „?”).
 *
 * Popover, not Tooltip (28.09.2026): a tooltip never opens on touch, so on a phone the „?” did nothing.
 * `openOnHover` keeps the desktop behaviour; tap/click/Enter open it everywhere.
 */
export function Chmurka({ tresc, children }: { tresc: ReactNode; children: ReactNode }) {
  return (
    <Popover.Root>
      <Popover.Trigger openOnHover delay={200} className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6}>
          <Popover.Popup
            className={cn(
              "z-50 max-w-64 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md outline-none",
            )}
          >
            {tresc}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
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
