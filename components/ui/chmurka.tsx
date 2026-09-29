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
 * `naHover={false}` for content the user interacts with (tabs in the „i” Migawka).
 */
export function Chmurka({
  tresc,
  children,
  naHover = true,
  aria,
  className,
}: {
  tresc: ReactNode
  children: ReactNode
  naHover?: boolean
  aria?: string
  className?: string
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover={naHover}
        delay={200}
        aria-label={aria}
        className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} collisionPadding={16}>
          <Popover.Popup
            className={cn(
              "z-50 max-w-64 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md outline-none",
              className,
            )}
          >
            {tresc}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function PomocPole({ tresc, aria }: { tresc: ReactNode; aria?: string }) {
  return (
    <Chmurka
      tresc={tresc}
      aria={aria ?? "Więcej informacji o tym polu"}
      className="max-h-[70vh] max-w-[min(20rem,calc(100vw-2rem))] overflow-y-auto"
    >
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] text-muted-foreground hover:bg-muted">
        ?
      </span>
    </Chmurka>
  )
}
