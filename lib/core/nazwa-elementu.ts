/**
 * Element label for warning params (docs/standards/17-i18n.md, 17.2): the user's own name passes
 * through as data (never translated); an unnamed element gets a numbered fallback KEY, resolved in the
 * UI language by `lib/i18n/t` (`przegrodaKey` „przegroda {nr}” → „partition 2”), never a Polish
 * „przegroda 2” built in the domain.
 */
export type NazwaElementu = Record<string, string | number>

export function nazwaElementu(param: string, nazwa: string | null | undefined, fallbackKey: string, nr: number): NazwaElementu {
  const wlasna = nazwa?.trim() ?? ""
  return wlasna !== "" ? { [param]: wlasna } : { [`${param}Key`]: fallbackKey, nr }
}
