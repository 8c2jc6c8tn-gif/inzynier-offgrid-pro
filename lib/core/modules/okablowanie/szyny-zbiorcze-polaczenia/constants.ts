/** Kroki checklisty 1:1 ze źródła (Ekran 3, Dolna sekcja E). */
export type KrokMomentu = { id: string; krok: string; wartoscDocelowa: string }

export const CHECKLIST_ITEMS: KrokMomentu[] = [
  { id: "zacisk-baterii-m8", krok: "Moment dokręcenia — zacisk baterii M8", wartoscDocelowa: "8 N·m" },
  { id: "szyna-glowna-m10", krok: "Moment dokręcenia — szyna główna M10", wartoscDocelowa: "12 N·m" },
  { id: "uziom-m8", krok: "Moment dokręcenia — uziom M8", wartoscDocelowa: "8 N·m" },
  { id: "kontrola-24h", krok: "Ponowna kontrola po 24h (szczególnie połączenia aluminiowe)", wartoscDocelowa: "—" },
]
