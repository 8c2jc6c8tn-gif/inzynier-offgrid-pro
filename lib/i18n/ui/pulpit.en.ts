// English texts of ./pulpit.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./pulpit"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-PULPIT-PRESETY-TYTUL": "What do you want to do now?",
  "UI-PULPIT-PRESETY-OPIS":
    "Tick one or more categories and apply — the dashboard shows only the modules you need, in a matching order. Several categories = all their modules together. The “Home – grid” and “Business – grid” tiles always stay. You can change everything below later.",
  "UI-PULPIT-PRESETY-ZASTOSUJ": "Apply to the dashboard",
  "UI-PULPIT-PRESETY-ZASTOSOWANO": "Dashboard set. Bring hidden modules back with “Show”.",
  "UI-PULPIT-PRESET-CALY-SYSTEM": "Whole off-grid system",
  "UI-PULPIT-PRESET-CALY-SYSTEM-OPIS": "All modules in the default order.",
  "UI-PULPIT-PRESET-PV": "PV installation",
  "UI-PULPIT-PRESET-PV-OPIS": "Panels and what surrounds them; hides heating, safety, ESP32 electronics, battery assembly, mobile mode and Live.",
  "UI-PULPIT-PRESET-MAGAZYN": "Energy storage / batteries",
  "UI-PULPIT-PRESET-MAGAZYN-OPIS": "Storage with battery assembly; hides heating, safety, ESP32 electronics, AI, mobile mode and Live.",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE": "Energy demand",
  "UI-PULPIT-PRESET-ZAPOTRZEBOWANIE-OPIS": "Demand balance with panels, storage and the quick calculator; hides the rest.",
  "UI-PULPIT-PRESET-OGRZEWANIE": "Heating / heat pump",
  "UI-PULPIT-PRESET-OGRZEWANIE-OPIS": "Heating with the balance, stress test and AI; hides the rest.",
  "UI-PULPIT-PRESET-ELEKTRYKA": "Electrical installation",
  "UI-PULPIT-PRESET-ELEKTRYKA-OPIS": "Cabling and protection with panels, storage and safety; hides the rest.",
  "UI-PULPIT-PRESET-ANALIZA": "Analysis / stress test",
  "UI-PULPIT-PRESET-ANALIZA-OPIS": "Stress test with the data that feeds it, and AI; hides cabling, safety, ESP32 electronics, battery assembly, mobile mode and Live.",
  "UI-PULPIT-PRESET-AUTOMATYKA": "Automation and AI",
  "UI-PULPIT-PRESET-AUTOMATYKA-OPIS": "ESP32 electronics, AI, Live mode and safety; hides the rest.",
  "UI-PULPIT-PRESET-MIKRO": "Camper, garden cabin or garage",
  "UI-PULPIT-PRESET-MIKRO-OPIS": "Location, mobile mode, panels, battery, wiring and safety; hides building heating, stress test, ESP32, AI, battery installation and Live.",
  "UI-PULPIT-PRESET-SIEC": "I am connected to the grid",
  "UI-PULPIT-PRESET-SIEC-OPIS":
    "“Home – grid” and “Business – grid” first, then the modules needed to go off-grid; hides cabling, ESP32 electronics, AI, battery assembly, mobile mode and Live.",
}
