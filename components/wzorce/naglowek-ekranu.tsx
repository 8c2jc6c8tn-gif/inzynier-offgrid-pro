import type { ReactNode } from "react"

/**
 * Nagłówek ekranu kalkulatora — `<h1>` + akapit z kontekstem (migawka edukacyjna/moduł/ekran),
 * identyczny na wszystkich ~20 ekranach kalkulatorów. Wydzielony, żeby skala typografii
 * (text-h1/text-small, app/globals.css) żyła w jednym miejscu, nie w 20 kopiach `text-xl
 * font-semibold` / `text-sm text-muted-foreground`.
 */
export function NaglowekEkranu({ tytul, children }: { tytul: string; children?: ReactNode }) {
  return (
    <div>
      <h1 className="text-h1 font-semibold">{tytul}</h1>
      {children && <p className="mt-1 text-small text-muted-foreground">{children}</p>}
    </div>
  )
}
