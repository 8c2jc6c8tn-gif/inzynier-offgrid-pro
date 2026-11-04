// English texts of ./m14-sciezka.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-sciezka"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-SCZ-RACHUNEK-T": "My bill",
  "UI-SCZ-RACHUNEK-O":
    "How much you pay today and how much of it is the “cost of keeping the grid” — fixed costs that disappear once you leave.",
  "UI-SCZ-L-RACHUNEK-DOM": "My bill today",
  "UI-SCZ-L-TARYFA-G": "Which G tariff",
  "UI-SCZ-L-DEPOZYT": "What I lose as a prosumer",
  "UI-SCZ-L-RACHUNEK-FIRMA": "My bill today (C)",
  "UI-SCZ-L-TARYFY-C": "C tariff comparison",
  "UI-SCZ-L-MOC-UMOWNA": "Contracted capacity",
  "UI-SCZ-ZUZYCIE-T": "My consumption",
  "UI-SCZ-ZUZYCIE-O": "Consumption month by month — winter decides everything, the yearly average is not enough.",
  "UI-SCZ-L-ZUZYCIE-DOM": "My monthly consumption",
  "UI-SCZ-L-ZUZYCIE-FIRMA": "Business monthly consumption (PV in a business screen)",
  "UI-SCZ-PV-T": "How much PV and storage",
  "UI-SCZ-PV-O": "An installation that covers consumption without the grid, and its cost.",
  "UI-SCZ-L-PV-FIRMA": "PV in a business and self-consumption",
  "UI-SCZ-L-BESS": "Storage (BESS) — benefit streams",
  "UI-SCZ-ZIMA-T": "Winter and the generator",
  "UI-SCZ-ZIMA-O": "Whether the worst month balances and how many hours the generator has to run.",
  "UI-SCZ-L-ZIMA": "Winter without the grid",
  "UI-SCZ-L-AGREGAT-ZAPAS": "Generator as backup",
  "UI-SCZ-L-BILANS-D": "Balance without the grid — scenario D",
  "UI-SCZ-L-AGREGAT": "Power generator",
  "UI-SCZ-SCEN-T": "Scenarios A–D",
  "UI-SCZ-SCEN-O": "Stay as I am, add PV, add storage, leave the grid — cost over the years and independence.",
  "UI-SCZ-L-SCEN-DOM": "Comparison of scenarios A–D",
  "UI-SCZ-L-SCEN-FIRMA": "Scenarios A–D for a business",
  "UI-SCZ-RYZYKA-T": "Risks and procedure",
  "UI-SCZ-RYZYKA-O":
    "What can go wrong, what cannot be undone and how to safely connect the grid, the island system and the generator.",
  "UI-SCZ-L-RYZYKA": "Disconnection risks",
  "UI-SCZ-L-REZYGNACJA": "How to give up the grid connection",
  "UI-SCZ-L-PRZELACZNIK": "Grid/island switch",
  "UI-SCZ-L-RYZYKA-FIRMA": "Business disconnection risks",
  "UI-SCZ-L-PROCEDURA-B2B": "Procedure and B2B contracts",
  "UI-SCZ-TYTUL": "Transition path",
  "UI-SCZ-OPIS":
    "Six steps from the electricity bill to the decision to leave the grid. Each step opens the screens that calculate it — your data from them carries forward automatically. Progress is saved on this device.",
  "UI-SCZ-ZROBIONE": "Done",
  "UI-SCZ-PODSUMOWANIE": "Summary — {zrobione} of {wszystkie} steps",
  "UI-SCZ-NASTEPNY": "Next step:",
  "UI-SCZ-NASTEPNY-UWAGA":
    "Decide on leaving the grid only after going through all the steps — especially winter and risks.",
  "UI-SCZ-WSZYSTKIE":
    "All steps reviewed. The comparison result and safety conditions are on the scenarios screen — that is where the verdict is.",
  "UI-SCZ-DRUKUJ": "Print / save as PDF",
}
