/** Dwa mechanizmy ochrony 1:1 ze źródła (Ekran 17). */
export type MechanizmOchrony = { id: string; nazwa: string; opis: string }

export const CHECKLIST_ITEMS: MechanizmOchrony[] = [
  {
    id: "bezposrednia",
    nazwa: "Ochrona bezpośrednia",
    opis: "Izolacja podstawowa i obudowy uniemożliwiające dotknięcie części czynnych.",
  },
  {
    id: "posrednia",
    nazwa: "Ochrona pośrednia",
    opis: "Samoczynne wyłączenie zasilania w razie uszkodzenia izolacji (RCD, uziemienie).",
  },
]
