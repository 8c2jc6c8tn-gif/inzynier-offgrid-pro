/**
 * docs/standards/18-logowanie.md, 18.2 (dopisek 15.09.2026) — magic link/OAuth niesie URL powrotny
 * (`?next=...`), klasyczny wektor open redirect jeśli niewalidowany. Allowlista: tylko ścieżka
 * względna zaczynająca się od jednego `/`, nigdy pełny URL i nigdy `//host` (protocol-relative —
 * przeglądarka traktuje to jak zewnętrzny host, mimo braku schematu).
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/"
  if (!next.startsWith("/") || next.startsWith("//")) return "/"
  return next
}
