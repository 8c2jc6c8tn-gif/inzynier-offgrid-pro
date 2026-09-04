export type OpisTopologii = { id: string; nazwa: string; opis: string }

export const TOPOLOGIE: OpisTopologii[] = [
  {
    id: "common-port",
    nazwa: "Common Port",
    opis: "Jedna wspólna droga (MOSFET-y) dla ładowania i rozładowania. Prostsze i tańsze, ale prąd ładowania i rozładowania dzielą tę samą, jedną zdolność przełączania portu.",
  },
  {
    id: "separate-port",
    nazwa: "Separate Port",
    opis: "Osobne drogi dla MPPT (ładowanie) i falownika (rozładowanie). Droższe, ale każda droga ma własną zdolność przełączania — nie konkurują o ten sam limit prądu.",
  },
]
