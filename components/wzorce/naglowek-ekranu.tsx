import type { ReactNode } from "react"
import { MigawkaInfo, type WynikMigawki } from "@/components/ui/pomoc"
import type { EkranPomocy } from "@/lib/i18n/pomoc"

/**
 * Nagłówek ekranu kalkulatora — `<h1>` + akapit z kontekstem (migawka edukacyjna/moduł/ekran),
 * identyczny na wszystkich ~20 ekranach kalkulatorów. Wydzielony, żeby skala typografii
 * (text-h1/text-small, app/globals.css) żyła w jednym miejscu, nie w 20 kopiach `text-xl
 * font-semibold` / `text-sm text-muted-foreground`.
 *
 * `ekran` renders the „i” Migawka next to the title (8.4, D34/D51); `wynik` passes the current
 * `CalcResult` (formula + assumptions) into its „Fizyka” tab (8.4b).
 */
export function NaglowekEkranu({
  tytul,
  ekran,
  wynik,
  parametry,
  children,
}: {
  tytul: string
  ekran?: EkranPomocy
  wynik?: WynikMigawki
  /** `{name}` placeholders of the Migawka, filled from engine constants. */
  parametry?: Record<string, string | number>
  children?: ReactNode
}) {
  return (
    <div>
      <div className="flex items-start gap-2">
        <h1 className="text-h1 font-semibold">{tytul}</h1>
        {ekran && (
          <span className="mt-1.5 shrink-0">
            <MigawkaInfo ekran={ekran} wynik={wynik} params={parametry} />
          </span>
        )}
      </div>
      {children && <p className="mt-1 text-small text-muted-foreground">{children}</p>}
    </div>
  )
}
