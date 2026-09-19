import type { KlasaEnergetyczna } from "./input"

/** Mnożnik wg klasy energetycznej, 1:1 ze źródła — "stare" to środek zakresu 1,3-1,5, dopowiedziany. */
export const MNOZNIK_KLASY: Record<KlasaEnergetyczna, number> = {
  nowoczesne: 0.8,
  standardowe: 1.0,
  stare: 1.4,
}

/**
 * Domyślne moce — echo z `lib/core/modules/baterie/napiecie-systemowe/constants.ts`
 * (KATALOG_ODBIORNIKOW), nie wymyślone od nowa. Czas pracy dobowej NIE echowany (tamten
 * katalog koduje "0 = ciągłe/bazowe", inny sens niż "ile dziś używasz tego urządzenia") —
 * użytkownik wpisuje realny czas sam, pole startuje puste.
 */
export const KATALOG_URZADZEN_ZMIENNYCH: { id: string; label: string; mocDomyslnaW: number }[] = [
  { id: "pralka", label: "Pralka (grzanie wody)", mocDomyslnaW: 1250 },
  { id: "zmywarka", label: "Zmywarka", mocDomyslnaW: 1500 },
  { id: "lodowka-230v", label: "Lodówka 230V AC", mocDomyslnaW: 100 },
  { id: "czajnik", label: "Czajnik elektryczny", mocDomyslnaW: 1850 },
  { id: "mikrofalowka", label: "Mikrofalówka", mocDomyslnaW: 1000 },
  { id: "laptop", label: "Laptop", mocDomyslnaW: 68 },
  { id: "tv", label: "Telewizor 32\"", mocDomyslnaW: 65 },
  { id: "led-230v", label: "Oświetlenie LED 230V (żarówka)", mocDomyslnaW: 12 },
]

/** Przykładowa moc płyty indukcyjnej ze źródła ("np. 7kW") — podpowiedź, nie ukryty domyślny. */
export const PLYTA_INDUKCYJNA_MOC_SUGEROWANA_W = 7000
