import type { ReactNode } from "react"
import type { Status } from "@/lib/core/calc-result"
import { cn } from "@/lib/utils"
import { TekstUi } from "@/components/ui/tekst-ui"

/**
 * Werdykt trójstopniowy 🟢🟡🔴 (docs/standards/04-walidacja-i-twarde-stopy.md, 4.1) jako jeden
 * reużywalny komponent zamiast kopiowanych klas Tailwind per ekran. Kolory idą przez tokeny CSS
 * (`--werdykt-*`, app/globals.css) — edytowalne w Ustawieniach/`/wzornik` (lib/wyglad/storage.ts)
 * i propagują się na każde miejsce w apce, które używa tego komponentu.
 */

export type WerdyktPoziom = "ok" | "uwaga" | "blad"

const STYL: Record<WerdyktPoziom, string> = {
  ok: "border-werdykt-ok-border bg-werdykt-ok-bg text-werdykt-ok-foreground",
  uwaga: "border-werdykt-uwaga-border bg-werdykt-uwaga-bg text-werdykt-uwaga-foreground",
  blad: "border-werdykt-blad-border bg-werdykt-blad-bg text-werdykt-blad-foreground",
}

export const WERDYKT_IKONA: Record<WerdyktPoziom, string> = { ok: "🟢", uwaga: "🟡", blad: "🔴" }

/** Default labels — `UI-WERDYKT-*` keys, rendered through `TekstUi` (this module stays server-safe). */
const DOMYSLNA_ETYKIETA: Record<WerdyktPoziom, string> = {
  ok: "UI-WERDYKT-ZALECANE",
  uwaga: "UI-WERDYKT-DOPUSZCZALNE",
  blad: "UI-WERDYKT-ZABRONIONE",
}

/** Ogólna reguła: VALID → ok, VALID_WITH_WARNINGS → uwaga, reszta (brak/błędne dane) → blad.
 * Ekran z bardziej szczegółową logiką (np. próg liczbowy) może zamiast tego ustalić poziom sam. */
export function poziomZStatusu(status: Status): WerdyktPoziom {
  if (status === "VALID") return "ok"
  if (status === "VALID_WITH_WARNINGS") return "uwaga"
  return "blad"
}

export function WerdyktPanel({
  poziom,
  etykieta,
  children,
  className,
}: {
  poziom: WerdyktPoziom
  etykieta?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div role="status" className={cn("rounded-lg border-2 p-4", STYL[poziom], className)}>
      <p className="flex items-center gap-2 font-medium">
        <span aria-hidden="true">{WERDYKT_IKONA[poziom]}</span>
        <span>{etykieta ?? <TekstUi kod={DOMYSLNA_ETYKIETA[poziom]} />}</span>
      </p>
      {children}
    </div>
  )
}

/** Wariant kompaktowy — jedna linia, do list/kart porównawczych zamiast pełnego panelu. */
export function WerdyktBadge({ poziom, etykieta }: { poziom: WerdyktPoziom; etykieta?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STYL[poziom],
      )}
    >
      <span aria-hidden="true">{WERDYKT_IKONA[poziom]}</span>
      {etykieta ?? <TekstUi kod={DOMYSLNA_ETYKIETA[poziom]} />}
    </span>
  )
}
