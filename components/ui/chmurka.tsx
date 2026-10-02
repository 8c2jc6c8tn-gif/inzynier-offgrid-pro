"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import { Drawer } from "@base-ui/react/drawer"
import { Popover } from "@base-ui/react/popover"
import { useTranslate } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

/** Phone = below the Tailwind `sm` breakpoint. Server snapshot: desktop (popover). */
const TELEFON = "(max-width: 639px)"

function useTelefon(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(TELEFON)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () => window.matchMedia(TELEFON).matches,
    () => false,
  )
}

/**
 * "Chmurka" — dymek z wyjaśnieniem. Dwa użycia z docs/standards/08-ui-ux.md 8.4:
 * `PomocPole` = mały „?” obok etykiety pola (nazwa/zastosowanie/zakres wartości), `Chmurka` =
 * ogólny wrapper na dowolny trigger, gdy `PomocPole` nie pasuje (np. cała karta, nie tylko „?”).
 *
 * Popover, not Tooltip (28.09.2026): a tooltip never opens on touch, so on a phone the „?” did nothing.
 * `openOnHover` keeps the desktop behaviour; tap/click/Enter open it everywhere.
 * `naHover={false}` for content the user interacts with (tabs in the „i” Migawka).
 * On a phone both „?” and „i” open as a bottom panel instead (standard 8.4b, 29.09.2026) — a popover
 * next to a small icon covers the field and is hard to read on a narrow screen.
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
  const telefon = useTelefon()
  const t = useTranslate()
  const wyzwalacz = "outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"

  if (telefon) {
    return (
      <Drawer.Root>
        <Drawer.Trigger aria-label={aria} className={wyzwalacz}>
          {children}
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
            <Drawer.Popup className="w-full max-h-[80vh] overflow-y-auto overscroll-contain rounded-t-lg border-t bg-popover px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] text-sm text-popover-foreground shadow-lg outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-300 data-ending-style:[transform:translateY(100%)] data-starting-style:[transform:translateY(100%)]">
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-muted" />
              <Drawer.Content>
                {aria && <Drawer.Title className="sr-only">{aria}</Drawer.Title>}
                {tresc}
                <Drawer.Close className="mt-4 min-h-11 w-full rounded-md border text-sm font-medium hover:bg-muted">
                  {t("POMOC-UI-ZAMKNIJ")}
                </Drawer.Close>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover={naHover}
        delay={200}
        aria-label={aria}
        className={wyzwalacz}
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
  const t = useTranslate()
  return (
    <Chmurka
      tresc={tresc}
      aria={aria ?? t("UI-CHM-WIECEJ-INFORMACJI-TYM")}
      className="max-h-[70vh] max-w-[min(20rem,calc(100vw-2rem))] overflow-y-auto"
    >
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] text-muted-foreground hover:bg-muted">
        ?
      </span>
    </Chmurka>
  )
}
