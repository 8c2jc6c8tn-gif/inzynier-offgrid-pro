/**
 * Checkpoints of Screen 14 (M12, dawne 8.22). The five areas come 1:1 from Biblia §12.22 ("poprawność doboru
 * bezpieczników, przekroje przewodów, ochrona przed rozładowaniem, wentylacja akumulatora, poprawność
 * połączeń"); the battery fuse is split out of "fuses" because the Bible gives it its own alert. "How to
 * check" and repair steps (UI-M12-RB-JAK-*, RB-NAPRAWA-*) are expert text ✅🤖. `href` points at the
 * calculator that sizes the element properly.
 */
export type IdPunktuRaportu =
  | "bezpiecznik-akumulatora"
  | "dobor-bezpiecznikow"
  | "przekroje-przewodow"
  | "ochrona-rozladowania"
  | "wentylacja-akumulatora"
  | "polaczenia"

export type PunktRaportu = { id: IdPunktuRaportu; href: string | null }

export const PUNKTY_RAPORTU: PunktRaportu[] = [
  { id: "bezpiecznik-akumulatora", href: "/kalkulatory/dobor-bezpiecznika-dc" },
  { id: "dobor-bezpiecznikow", href: "/kalkulatory/kable-bezpieczniki-male" },
  { id: "przekroje-przewodow", href: "/kalkulatory/kable-bezpieczniki-male" },
  { id: "ochrona-rozladowania", href: "/kalkulatory/ochrona-przed-rozladowaniem" },
  { id: "wentylacja-akumulatora", href: "/kalkulatory/ladowanie-w-garazu" },
  { id: "polaczenia", href: null },
]
