/**
 * Tabela porównawcza 1:1 ze źródła (Ekran 21). Biblia (§3.36) wymienia dodatkowo "sprawność" jako
 * kryterium, ale bez żadnej wartości ani kierunku — nie dopisujemy go (15.7).
 */
export type KryteriumPorownania = { id: string; kryterium: string; mikroinwerter: string; centralny: string }

export const KRYTERIA_POROWNANIA: KryteriumPorownania[] = [
  {
    id: "zacienienie",
    kryterium: "Odporność na zacienienie",
    mikroinwerter: "wysoka (każdy panel niezależnie)",
    centralny: "niska (ogranicza cały string)",
  },
  { id: "monitoring", kryterium: "Monitoring", mikroinwerter: "na poziomie panelu", centralny: "na poziomie stringu" },
  { id: "koszt", kryterium: "Koszt", mikroinwerter: "wyższy", centralny: "niższy" },
  { id: "niezawodnosc", kryterium: "Niezawodność", mikroinwerter: "wiele punktów awarii", centralny: "jeden punkt awarii" },
]
