/**
 * Display label of a surface name. Generated names ("Dach wg obrysu budynku", "Elewacja N") are stable PL keys —
 * they are matched against and stored in saved state (`wysokosci[nazwa]`, `moc[nazwa]`, surface ids) — so only the
 * rendering is translated; names typed by the user pass through unchanged.
 */
const NAZWA_DACH_OBRYS = "Dach wg obrysu budynku"
const WZORZEC_ELEWACJI = /^Elewacja (N|NE|E|SE|S|SW|W|NW)$/

export function etykietaPowierzchni(nazwa: string, t: (klucz: string, params?: Record<string, string | number>) => string): string {
  if (nazwa === NAZWA_DACH_OBRYS) return t("UI-NAZWAPOW-DACH-OBRYS")
  const elewacja = WZORZEC_ELEWACJI.exec(nazwa)
  return elewacja ? t("UI-NAZWAPOW-ELEWACJA", { kierunek: elewacja[1]! }) : nazwa
}
