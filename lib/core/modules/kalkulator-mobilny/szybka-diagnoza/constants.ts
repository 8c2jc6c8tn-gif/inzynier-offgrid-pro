/**
 * Drzewo diagnostyczne Ekranu 25 (M12, dawne 8.50). Źródło podaje trzy objawy (brak prądu, niskie napięcie,
 * przegrzewanie) i dwa przykłady kolejności (Tresc: bezpiecznik główny → styk na złączu → dozownik niskiego
 * napięcia; Biblia §12.38: napięcie akumulatora → bezpiecznik → połączenia → regulator). Pełne kroki,
 * czwarty objaw ("akumulator się nie ładuje") i odnośniki dopisane jako wiedza ekspercka ✅🤖 — decyzja
 * właściciela 30.09.2026 ("Dopisz kroki jako ekspert"). Kroki są pytaniami tak/nie bez progów liczbowych
 * (Dyrektywa #1) — tam, gdzie potrzebna liczba, krok odsyła do kalkulatora.
 */
export type ObjawDiagnozy = "brak-pradu" | "niskie-napiecie" | "przegrzewanie" | "nie-laduje"

export type KrokDiagnozy = {
  id: string
  /** Kalkulator pomocny przy usunięciu przyczyny; null = brak. */
  link: string | null
  /** Przyczyna wymagająca natychmiastowego odłączenia zasilania (🔴). */
  odlaczNatychmiast?: true
}

export const OBJAWY: ObjawDiagnozy[] = ["brak-pradu", "niskie-napiecie", "przegrzewanie", "nie-laduje"]

export const DRZEWO_DIAGNOZY: Record<ObjawDiagnozy, KrokDiagnozy[]> = {
  "brak-pradu": [
    { id: "napiecie-akumulatora", link: "/kalkulatory/ratowanie-akumulatora-maly" },
    { id: "bezpiecznik-glowny", link: "/kalkulatory/kable-bezpieczniki-male" },
    { id: "zlacza", link: null },
    { id: "lvd", link: "/kalkulatory/ochrona-przed-rozladowaniem" },
    { id: "napiecie-odbiornika", link: "/kalkulatory/kable-bezpieczniki-male" },
  ],
  "niskie-napiecie": [
    { id: "napiecie-spoczynkowe", link: "/kalkulatory/ratowanie-akumulatora-maly" },
    { id: "ladowanie-w-dzien", link: "/kalkulatory/dobor-regulatora-pwm-mppt" },
    { id: "spadek-na-przewodzie", link: "/kalkulatory/kable-bezpieczniki-male" },
    { id: "spadek-pod-obciazeniem", link: "/kalkulatory/ratowanie-akumulatora-maly" },
  ],
  przegrzewanie: [
    { id: "spalenizna", link: null, odlaczNatychmiast: true },
    { id: "cieple-zlacze", link: null },
    { id: "cieply-przewod", link: "/kalkulatory/kable-bezpieczniki-male" },
    { id: "przeciazenie", link: "/kalkulatory/przetwornice" },
    { id: "wentylacja", link: null },
  ],
  "nie-laduje": [
    { id: "napiecie-panelu", link: "/kalkulatory/laczenie-paneli-przenosnych" },
    { id: "bezpiecznik-panelu", link: "/kalkulatory/kable-bezpieczniki-male" },
    { id: "ustawienia-regulatora", link: "/kalkulatory/alternator-vs-panele" },
    { id: "mroz-bms", link: "/kalkulatory/cold-c-rate" },
  ],
}
