// English texts of ./dopiski-starych-ekranow.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./dopiski-starych-ekranow"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-AGB-TYTUL": "Generator safety",
  "UI-AGB-MIEJSCE": "Where the generator runs",
  "UI-AGB-M-ZEWNATRZ": "Outdoors (shelter, under a roof)",
  "UI-AGB-M-WYDZIELONE": "Separate plant room with the exhaust led outside",
  "UI-AGB-M-BUDYNEK": "Inside the building (basement, attached garage, boiler room)",
  "UI-AGB-PODLACZENIE": "How the generator supplies the loads",
  "UI-AGB-P-PRZELACZNIK": "Into the installation through an I–0–II changeover switch",
  "UI-AGB-P-BEZ": "Into the installation without a switch (socket, plug)",
  "UI-AGB-P-FALOWNIK": "Through the distribution board to the AC input of the inverter / charger",
  "UI-AGB-P-ODBIORNIKI": "Emergency loads from a board supplied only by the generator",
  "UI-AGB-JAK-PRZELACZNIK": "What the switch should look like (position 0, interlock, N conductor):",
  "UI-AGB-L-PRZELACZNIK": "Grid/island switch and safety",
  "UI-ZDE-F-AWARYJNE": "The lock has backup power (UPS or battery)",
  "UI-ZDE-F-RECZNE": "The door can be opened by hand without power",
  "UI-ZDE-F-RECZNE-HINT":
    "Mechanically, from the inside and without a key: a handle, a panic bar. An electric button does not count.",
  "UI-ZDE-F-ALARM": "The fire alarm releases the lock",
  "UI-ZDE-F-PRZYCISK": "There is an emergency exit button",
  "UI-ZDE-F-KONTAKTRON": "A reed switch confirms the door is open",
  "UI-GZ-NAZWA": "Name",
  "UI-GZ-MOC": "Power [W]",
  "UI-OSW-MIEJSCE": "Location",
  "UI-OSW-STAN": "Condition",
  "UI-CRL-K-1": "LV overhead → LV cable → MV overhead → MV cable",
  "UI-CRL-K-2": "LV overhead → LV cable → MV cable → MV overhead",
  "UI-CRL-K-3": "LV cable → LV overhead → MV overhead → MV cable",
  "UI-CRL-K-4": "LV cable → LV overhead → MV cable → MV overhead",
  "UI-CRL-KOLEJNOSC": "Order of sections from the building",
  "UI-CRL-K-NIE-WIEM": "I don't know — calculate conservatively",
  "UI-CRL-ZALECENIE-S": "A recommendation, not a requirement of the standard:",
  "UI-CRL-ZALECENIE": "A type 2 SPD costs little compared with the equipment it protects — it is worth installing.",
}
