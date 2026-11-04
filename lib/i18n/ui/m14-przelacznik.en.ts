// English texts of ./m14-przelacznik.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-przelacznik"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-PSW-TYTUL": "Grid/island switch and safety",
  "UI-PSW-OPIS":
    "Neither an island installation nor a generator may ever feed voltage into the grid — a line worker on a “switched-off” line can be killed. Here you check whether the connection to the grid is safe. M14, screen D11 (shared by home and business).",
  "UI-PSW-K1-T": "Switch with a 0 position",
  "UI-PSW-K1-O":
    "Grid – 0 – island with a mechanical interlock, or a contactor-based automatic transfer switch with electrical and mechanical interlocks. Position 0 disconnects both sources before connecting the other one.",
  "UI-PSW-K2-T": "Switched phases and the neutral conductor N",
  "UI-PSW-K2-O":
    "According to the earthing system in the building. The standard's detail (HD 60364-5-551) still needs to be specified — settle it with a licensed electrician.",
  "UI-PSW-K3-T": "Generator always through the switch",
  "UI-PSW-K3-O":
    "Never “through a socket” or with a plug with two pins — that puts voltage on the plug pins and into the grid. A combustion generator only outdoors or in a separate, ventilated place (carbon monoxide).",
  "UI-PSW-K4-T": "Parallel operation is something else",
  "UI-PSW-K4-O":
    "An inverter operating in parallel with the grid (scenarios A and B, including “zero export”) is a grid-connected source — it requires notifying the DSO of the microinstallation and an NC RfG certificate. A purely switched installation is usually not parallel operation (it depends on the inverter configuration).",
  "UI-PSW-SPRAWDZ": "Check your installation",
  "UI-PSW-TRYB": "How the installation meets the grid",
  "UI-PSW-TRYB-PRZELACZANY": "Switched: grid or island (no synchronisation)",
  "UI-PSW-TRYB-ROWNOLEGLE": "In parallel with the grid (hybrid / grid-tie inverter)",
  "UI-PSW-TRYB-BEZ-SIECI": "Without the grid (full disconnection)",
  "UI-PSW-PRZELACZNIK": "Switch",
  "UI-PSW-PRZ-RECZNY": "Manual grid – 0 – island with a mechanical interlock",
  "UI-PSW-PRZ-SZR": "Automatic transfer switch with electrical and mechanical interlocks",
  "UI-PSW-PRZ-BRAK": "None, an ordinary breaker, or no interlock",
  "UI-PSW-N": "Is the N conductor switched too?",
  "UI-PSW-N-NIE-WIEM": "I don't know",
  "UI-PSW-N-TAK": "yes, phases and N",
  "UI-PSW-N-NIE": "no, phases only",
  "UI-PSW-ZGLOSZENIE": "Microinstallation notified to the DSO?",
  "UI-PSW-MA-AGREGAT": "A generator supplies the building installation",
  "UI-PSW-ODPOWIEDZ": "Answer the questions above",
  "UI-PSW-STOP": "STOP — {n} life hazard(s)",
  "UI-PSW-BEZ-STOPOW": "Grid connection without hard stops",
  "UI-PSW-POWIAZANE": "Related:",
  "UI-PSW-L-AGREGAT": "power generator (Module 2)",
  "UI-PSW-L-PROCEDURA": "procedure for giving up the connection",
}
