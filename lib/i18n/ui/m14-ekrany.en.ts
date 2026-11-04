// English texts of ./m14-ekrany.ts — the same keys as `pl` (a missing or an extra key is a compile error).
import type { pl } from "./m14-ekrany"

type Klucz = keyof typeof pl

export const en: Record<Klucz, string> = {
  "UI-FAQ-DOM-TYTUL": "Frequently asked questions — home and grid",
  "UI-FAQ-DOM-OPIS":
    "Bill, prosumer, disconnection and safety in short answers, with links to the calculators. M14 “Home – grid”, screen D14.",
  "UI-FAQ-FIRMA-TYTUL": "Frequently asked questions for businesses",
  "UI-FAQ-FIRMA-OPIS":
    "C tariffs, reactive power, capacity fee, net-billing, storage and the meter — answers corrected against the source material. M14 “Business – grid”, screen F13.",
  "UI-DOT-TYTUL": "Subsidies (as of date)",
  "UI-DOT-OPIS":
    "Information, not advice. Every item has an as-of date and a confidence mark: ✅ read from the source, 🔎B a single source or expert knowledge. After the application deadline an item switches to “call closed” by itself. M14 “Home – grid”, screen D13.",
  "UI-DOT-UWAGA-KOLEJNOSC":
    "Mind the order: storage subsidies are currently tied to being a grid-connected prosumer. Disconnecting within the project's durability period may mean paying the subsidy back — check the rules before you choose scenario D.",
  "UI-DOT-FIRMA-TYTUL": "Subsidies and taxes — information, not advice",
  "UI-DOT-FIRMA-OPIS":
    "Calls for businesses with an as-of date. “Przydomowe Magazyny Energii” and the thermal-modernisation tax relief apply to private individuals, so they are in the “Home” part. M14 “Business – grid”, screen F12.",
  "UI-DOT-PODATKI": "Taxes",
  "UI-DOT-PODATKI-OPIS":
    "The tax consequences of net-billing in a business depend on the form of taxation — consult your accountant; individual tax rulings bind only the applicant.",
  "UI-DOT-STAN-TRWA": "call open",
  "UI-DOT-STAN-ZAKONCZONY": "call closed",
  "UI-DOT-STAN-PRZYSZLY": "call not open yet",
  "UI-DOT-STAN-BEZ-TERMINU": "no application deadline",
  "UI-DOT-STAN-NA": "As of {data}.",
  "UI-DOT-REGULAMIN": "Rules",
  "UI-DOT-BRAK-REGULAMINU":
    "We have not read the rules from the source yet — check them with the programme operator before deciding.",
  "UI-SCEN-DOM-TYTUL": "Comparison of scenarios A–D",
  "UI-SCEN-DOM-OPIS":
    "Grid + PV, grid + PV + storage, off-grid with the grid as backup, and full disconnection — total cost over the horizon, payback period, generator hours and reversibility side by side. You enter the prices. M14 “Home – grid”, screen D7.",
  "UI-SCEN-FIRMA-TYTUL": "Scenarios A–D for a business",
  "UI-SCEN-FIRMA-OPIS":
    "The same four scenarios as for a home, with a business-continuity check (RF1): how many hours the business can go without power and whether storage with a generator covers that. M14 “Business – grid”, screen F8.",
  "UI-PVF-TYTUL": "PV in a business and self-consumption",
  "UI-PVF-OPIS":
    "How much panel energy the business uses right away, how much storage shifts, and how much goes to the grid (net-billing — the less you export, the better). Irradiation from the location (Modules 1 and 3). M14 “Business – grid”, screen F6.",
  "UI-PVD-TYTUL": "How much PV and storage to become independent of the grid",
  "UI-PVD-OPIS":
    "Month-by-month balance: how much energy the panels and storage provide, how much you still take from the grid and how much you export. Irradiation from your location (Modules 1 and 3), storage as in Module 4. M14 “Home – grid”, screen D4.",
}
